/* ==========================================================================
   Online Ground Rent Payment System – dues calculation engine
   computeDues(site, asOfDate, data) is a pure function: it never mutates
   its inputs and never stores a computed amount.

   Rules implemented (design document Sections 5 and 7):
   - Dues = certified opening balance + system calculation from the site's
     ULB go-live FY up to and including the current FY (never a future FY).
   - Rent per FY = chargeable area × rate ÷ 100. Rate looked up per month
     (Ward → ULB → Category, effective-dated), so a mid-year revision is
     pro-rated by month. Each line is rounded to the nearest rupee.
   - Surcharge: assessed on 1 April after the 31 March due date on the rent
     still unpaid, at the surcharge rate in force that day. Method
     ONCE_PER_OVERDUE_YEAR (default) or PER_COMPLETED_YEAR_OF_DELAY.
     The opening balance is not surcharged again (Q12 default).
   - Payments (status Success) are allocated oldest dues first; within a
     year surcharge then rent (configurable). Excess is flagged, never
     carried forward as advance.
   - Missing rate for any month → bill blocked (T10).
   ========================================================================== */
(function (global) {
  'use strict';

  function toDate(d) {
    if (d instanceof Date) return d;
    var p = String(d).split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function iso(d) {
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }
  // FY is identified by its starting year: FY 2026-27 → 2026
  function fyOfDate(d) {
    d = toDate(d);
    return d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  }
  function parseFy(label) { return label ? parseInt(String(label).slice(0, 4), 10) : null; }
  function fyLabel(start) { return start + '-' + String(start + 1).slice(2); }
  function dueDateOf(fy) { return new Date(fy + 1, 2, 31); }      // 31 March closing the FY
  function surchargeDateOf(fy) { return new Date(fy + 1, 3, 1); } // 1 April after due date

  function inRange(rule, d) {
    var from = toDate(rule.from);
    var to = rule.to ? toDate(rule.to) : null;
    return d >= from && (!to || d <= to);
  }

  function findUlb(data, code) {
    return data.config.ulbs.filter(function (u) { return u.code === code; })[0] || null;
  }

  // Most specific rate wins: Ward → ULB → Category.
  function lookupRate(site, d, data) {
    var ulb = findUlb(data, site.ulb);
    var rules = data.config.rateRules;
    var candidates = [
      { level: 'Ward', target: site.ulb + '/' + site.ward },
      { level: 'ULB', target: site.ulb },
      { level: 'Category', target: ulb ? ulb.category : null }
    ];
    for (var i = 0; i < candidates.length; i++) {
      var c = candidates[i];
      var hit = rules.filter(function (r) { return r.level === c.level && r.target === c.target && inRange(r, d); })[0];
      if (hit) return hit;
    }
    return null;
  }

  function lookupSurcharge(d, data) {
    return data.config.surchargeRules.filter(function (r) { return inRange(r, d); })[0] || null;
  }

  function chargeableArea(site, fy) {
    return site.structures.reduce(function (sum, s) {
      var from = parseFy(s.chargeableFromFy);
      var to = parseFy(s.chargeableToFy);
      if ((from === null || from <= fy) && (to === null || fy <= to)) return sum + s.areaSqft;
      return sum;
    }, 0);
  }

  function roundAmt(x, data) {
    return data.config.settings.rounding === 'UP' ? Math.ceil(x - 1e-9) : Math.round(x);
  }

  // Rent for one FY, pro-rated by month across rate revisions.
  function rentForFy(site, fy, area, data) {
    var segments = [];
    var total = 0;
    for (var m = 0; m < 12; m++) {
      var d = new Date(fy, 3 + m, 1);
      var rule = lookupRate(site, d, data);
      if (!rule) return { blocked: true, month: iso(d) };
      total += area * rule.rate / 100 / 12;
      var last = segments[segments.length - 1];
      if (last && last.rate === rule.rate) last.months++;
      else segments.push({ rate: rule.rate, months: 1, ruleId: rule.id });
    }
    return { rent: roundAmt(total, data), segments: segments };
  }

  function computeDues(site, asOfDate, data) {
    var asOf = toDate(asOfDate || data.demoToday);
    var ulb = findUlb(data, site.ulb);
    var result = {
      grId: site.grId, asOf: iso(asOf), blocked: false, blockReason: null,
      opening: null, years: [], totalPayable: 0, annualRent: 0, currentFy: fyLabel(fyOfDate(asOf)),
      paidUpToFy: site.opening ? site.opening.paidUpToFy : null,
      pendingPayment: null, excess: 0, status: site.status
    };

    if (site.status === 'Closed') { result.paidUpToFy = null; return result; }
    if (!ulb || !ulb.goLiveFy) {
      result.blocked = true;
      result.blockReason = 'ULB not live yet – no go-live FY configured';
      return result;
    }

    var startFy = parseFy(ulb.goLiveFy);
    var endFy = fyOfDate(asOf);
    var surchargeOrderFirst = data.config.settings.allocationOrder !== 'RENT_FIRST';

    // 1. Buckets: opening balance, then each FY from go-live to the current FY.
    var op = site.opening || { principal: 0, surcharge: 0 };
    var opening = { key: 'OB', label: 'Opening balance (certified arrears up to FY ' + fyLabel(startFy - 1) + ')',
      rent: op.principal, surcharge: op.surcharge, rentPaid: 0, surchargePaid: 0, rentAdj: 0, surchargeAdj: 0 };
    var years = [];
    for (var fy = startFy; fy <= endFy; fy++) {
      var area = chargeableArea(site, fy);
      var r = rentForFy(site, fy, area, data);
      // Years already fully paid when a later rate revision was saved keep their billed rent.
      var frozen = site.frozenRent && site.frozenRent[fyLabel(fy)];
      if (frozen != null) r = { rent: frozen, segments: r.blocked ? [{ rate: null, months: 12 }] : r.segments, frozen: true };
      if (r.blocked) {
        result.blocked = true;
        result.blockReason = 'No rate configured for ' + r.month + ' – bill generation stopped, System Admin alerted';
        return result;
      }
      years.push({ fy: fy, label: fyLabel(fy), area: area, segments: r.segments, rent: r.rent,
        surcharge: 0, rentPaid: 0, surchargePaid: 0, rentAdj: 0, surchargeAdj: 0, dueDate: iso(dueDateOf(fy)), assessments: [] });
    }

    // Approved manual adjustments (W6): negative = waiver/credit (surcharge first, then rent),
    // positive = correction that adds to rent. The only way dues change by hand.
    function bucketFor(label) {
      if (label === 'OB') return opening;
      return years.filter(function (y) { return y.label === label; })[0] || null;
    }
    (data.adjustments || []).filter(function (a) {
      return a.grId === site.grId && a.status === 'Approved' && toDate(a.date) <= asOf;
    }).forEach(function (a) {
      var b = bucketFor(a.fy);
      if (!b) return;
      if (a.amount >= 0) { b.rentAdj += a.amount; return; }
      var credit = -a.amount;
      var fromSur = Math.min(credit, b.surcharge + b.surchargeAdj);
      b.surchargeAdj -= fromSur;
      b.rentAdj -= Math.min(credit - fromSur, b.rent + b.rentAdj);
    });

    // 2. Chronological events: payments and surcharge assessments.
    var events = [];
    data.payments.filter(function (p) { return p.grId === site.grId; }).forEach(function (p) {
      if (p.status === 'Success' && toDate(p.paidOn) <= asOf) events.push({ type: 'pay', date: toDate(p.paidOn), p: p });
      if (p.status === 'Pending') result.pendingPayment = p;
    });
    years.forEach(function (y) {
      var d = surchargeDateOf(y.fy);
      while (d <= asOf) {
        events.push({ type: 'assess', date: new Date(d.getTime()), y: y });
        var rule = lookupSurcharge(d, data);
        if (!rule || rule.method !== 'PER_COMPLETED_YEAR_OF_DELAY') break;
        d = new Date(d.getFullYear() + 1, 3, 1);
      }
    });
    // On the same day, surcharge is assessed before that day's payment is applied.
    events.sort(function (a, b) { return a.date - b.date || (a.type === 'assess' ? -1 : 1); });

    // PaymentAllocation: which bucket each receipt cleared (register "Arrear from–to").
    var allocations = {};
    function allocate(amount, payDate, key) {
      var payFy = fyOfDate(payDate);
      var buckets = [opening].concat(years.filter(function (y) { return y.fy <= payFy; }));
      var lines = [];
      buckets.forEach(function (b) {
        var parts = surchargeOrderFirst ? ['surcharge', 'rent'] : ['rent', 'surcharge'];
        var line = { label: b.label || ('FY ' + fyLabel(b.fy)), fy: b.key === 'OB' ? 'OB' : fyLabel(b.fy), rent: 0, surcharge: 0 };
        parts.forEach(function (part) {
          var due = b[part] + b[part + 'Adj'] - b[part + 'Paid'];
          var take = Math.min(due, amount);
          if (take > 0) { b[part + 'Paid'] += take; amount -= take; line[part] += take; }
        });
        if (line.rent || line.surcharge) lines.push(line);
      });
      allocations[key] = { lines: lines, excess: amount };
      return amount;
    }

    events.forEach(function (e) {
      if (e.type === 'pay') {
        result.excess += allocate(e.p.amount, e.date, e.p.receiptNo || e.p.intentNo);
      } else {
        var unpaidRent = e.y.rent + e.y.rentAdj - e.y.rentPaid;
        var rule = lookupSurcharge(e.date, data);
        if (unpaidRent > 0 && rule) {
          var s = roundAmt(unpaidRent * rule.rate / 100, data);
          e.y.surcharge += s;
          e.y.assessments.push({ on: iso(e.date), rate: rule.rate, amount: s });
        }
      }
    });

    // 3. Summaries.
    function bal(b) { return (b.rent + b.rentAdj - b.rentPaid) + (b.surcharge + b.surchargeAdj - b.surchargePaid); }
    opening.balance = bal(opening);
    opening.adjustment = opening.rentAdj + opening.surchargeAdj;
    opening.paid = opening.rentPaid + opening.surchargePaid;
    result.allocations = allocations;
    years.forEach(function (y) {
      y.paid = y.rentPaid + y.surchargePaid;
      y.adjustment = y.rentAdj + y.surchargeAdj;
      y.total = y.rent + y.surcharge + y.adjustment;
      y.balance = bal(y);
      y.state = y.balance === 0 ? 'Paid' : (asOf > dueDateOf(y.fy) ? 'Overdue' : 'Due');
    });

    result.opening = opening;
    result.years = years;
    result.totalPayable = opening.balance + years.reduce(function (s, y) { return s + y.balance; }, 0);
    var cur = years[years.length - 1];
    result.annualRent = cur ? cur.rent : 0;
    result.currentArea = cur ? cur.area : chargeableArea(site, endFy);
    result.currentDueDate = cur ? cur.dueDate : null;

    // Paid up to = latest FY whose balance and every earlier balance is zero.
    // A cleared opening balance means every year up to the cut-off FY is paid.
    if (opening.balance === 0) {
      var paidUpTo = startFy - 1;
      for (var i = 0; i < years.length && years[i].balance === 0; i++) paidUpTo = years[i].fy;
      result.paidUpToFy = fyLabel(paidUpTo);
    } else {
      result.paidUpToFy = op.paidUpToFy || null;
    }
    result.hasOverdue = opening.balance > 0 || years.some(function (y) { return y.state === 'Overdue'; });
    return result;
  }

  global.GRDues = {
    computeDues: computeDues,
    iso: iso,
    toDate: toDate,
    fyOfDate: fyOfDate,
    fyLabel: fyLabel,
    parseFy: parseFy,
    lookupRate: lookupRate,
    chargeableArea: chargeableArea
  };
})(window);
