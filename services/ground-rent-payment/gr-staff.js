/* ==========================================================================
   Online Ground Rent Payment System – staff-side change engine (Stage 04)
   Every change carries a comment (and a file where the rules require one)
   and is written to the append-only audit log. When maker–checker is on,
   Supervisor transfers and structure changes wait in the approval queue.
   ========================================================================== */
(function (global) {
  'use strict';
  var App = global.GRApp, T = global.GRDues;

  function D() { return App.data; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function currentFy() { return T.fyOfDate(D().demoToday); }
  function goLiveFy(site) { return T.parseFy(App.ulb(site.ulb).goLiveFy); }

  function fyOptions(site, extraAhead) {
    var out = [];
    for (var y = goLiveFy(site); y <= currentFy() + (extraAhead || 1); y++) out.push(T.fyLabel(y));
    return out;
  }
  // "Register paid up to" choices: from the first register FY (setting) to the FY ending on the ULB's cut-off date.
  function registerFyOptions(ulbCode) {
    var u = App.ulb(ulbCode), s = D().config.settings, out = [];
    var last = u && u.cutOffDate ? T.fyOfDate(u.cutOffDate) : currentFy() - 1;
    for (var y = T.parseFy(s.registerFirstFy || '1975-76'); y <= last; y++) out.push(T.fyLabel(y));
    return out;
  }
  // Default chargeable-from FY for a new structure (setting 5.7).
  function defaultFromFy(orderDate) {
    var fy = orderDate ? T.fyOfDate(orderDate) : currentFy();
    if (D().config.settings.newStructureFrom === 'NEXT_FY') fy += 1;
    return T.fyLabel(fy);
  }
  // Annual rent for one FY on a (possibly modified) site.
  function rentForFy(site, fyLabel) {
    var fy = T.parseFy(fyLabel);
    var asOf = T.iso(new Date(Math.max(T.toDate(D().demoToday), new Date(fy, 3, 1))));
    if (fy > currentFy()) asOf = T.iso(new Date(fy, 3, 1));
    var r = T.computeDues(site, asOf, D());
    return r.blocked ? null : r.annualRent;
  }

  function ensureOwnershipHistory(site) {
    if (!site.ownershipHistory) {
      site.ownershipHistory = [{ owners: clone(site.owners), from: null, to: null, orderNo: 'Original allotment / register', reason: 'As per register' }];
    }
    return site.ownershipHistory;
  }

  // First FY that still has a balance – area corrections apply from here so paid years stay as they are.
  function firstOpenFy(site) {
    var d = App.dues(site);
    var open = d.years.filter(function (y) { return y.balance > 0; })[0];
    return open ? open.label : T.fyLabel(currentFy() + 1); // everything paid: from next FY
  }

  // ---------- Apply an approved change to a site ----------
  function applyChange(type, site, p) {
    var data = D();
    if (type === 'structureAdd') {
      site.structures.push(p.structure);
      return 'Structure added ' + (p.structure.lengthFt ? p.structure.lengthFt + '×' + p.structure.widthFt + ' = ' : '') + p.structure.areaSqft + ' sq ft · Mutation ' + (p.structure.mutationNo || '—') + ' · from FY ' + p.structure.chargeableFromFy;
    }
    if (type === 'structureEnd') {
      var s1 = site.structures[p.index];
      s1.chargeableToFy = p.toFy;
      s1.endReason = p.reason;
      return 'Structure ended (' + s1.type + ', ' + s1.areaSqft + ' sq ft) · chargeable to FY ' + p.toFy;
    }
    if (type === 'structureCorrect') {
      var s2 = site.structures[p.index];
      var fromFy = T.parseFy(p.fromFy);
      var corrected = clone(s2);
      corrected.lengthFt = p.lengthFt; corrected.widthFt = p.widthFt; corrected.areaSqft = p.areaSqft;
      corrected.areaOverrideReason = p.lengthFt ? null : 'Area entered directly – ' + p.reason;
      corrected.chargeableFromFy = p.fromFy;
      corrected.correctionOf = s2.areaSqft;
      if (T.parseFy(s2.chargeableFromFy) >= fromFy) {
        site.structures[p.index] = corrected;           // never charged before: replace
      } else {
        s2.chargeableToFy = T.fyLabel(fromFy - 1);      // keep history for paid years
        s2.endReason = 'Superseded by measurement correction';
        site.structures.push(corrected);
      }
      return 'Area corrected ' + s2.areaSqft + ' → ' + p.areaSqft + ' sq ft from FY ' + p.fromFy + ' (paid years unchanged)';
    }
    if (type === 'transfer') {
      var hist = ensureOwnershipHistory(site);
      var cur = hist[hist.length - 1];
      cur.to = p.effectiveDate;
      hist.push({ owners: clone(p.newOwners), from: p.effectiveDate, to: null, orderNo: p.orderNo, orderDate: p.orderDate, reason: p.reason, duesHandling: p.duesHandling });
      var oldMobiles = App.siteMobiles(site);
      site.owners = clone(p.newOwners);
      site.flags = (site.flags || []).filter(function (f) { return f.indexOf('Transfer pending') === -1; });
      // Old mobile loses auto-match; new allottee is told by SMS.
      Object.keys(data.savedSites).forEach(function (m) {
        if (oldMobiles.indexOf(m) !== -1) data.savedSites[m] = data.savedSites[m].filter(function (g) { return g !== site.grId; });
      });
      App.siteMobiles(site).forEach(function (m) {
        App.notify(m, 'Ground rent account transferred to you', site.grId + ' is now in your name (HQ order ' + p.orderNo + '). Outstanding dues stay with the site.', site.grId);
      });
      return 'Transfer recorded · ' + p.reason + ' · HQ order ' + p.orderNo + ' dt. ' + App.fmtDate(p.orderDate) + ' · effective ' + App.fmtDate(p.effectiveDate) + ' · to ' + p.newOwners.map(function (o) { return o.name; }).join(' & ');
    }
    return '';
  }

  // Save directly or queue for Dept. Admin approval (maker–checker).
  function submitChange(session, type, site, payload, comment, file) {
    var data = D();
    if (App.needsApproval(session) && (type === 'transfer' || type.indexOf('structure') === 0)) {
      data.approvals.unshift({ id: 'AP-' + String(data.approvals.length + 1).padStart(4, '0'), type: type, grId: site.grId, payload: payload,
        comment: comment, file: file, submittedBy: data.staffRoles[session.role].user, submittedAt: App.stamp(), status: 'Submitted' });
      App.audit({ grId: site.grId, entity: type, action: 'Submitted for approval · ' + describe(type, payload), reason: comment, file: file });
      App.save();
      return 'submitted';
    }
    var desc = applyChange(type, site, payload);
    App.audit({ grId: site.grId, entity: type, action: desc, reason: comment, file: file });
    App.save();
    return 'saved';
  }

  function describe(type, p) {
    return { structureAdd: 'Add structure ' + (p.structure ? p.structure.areaSqft + ' sq ft' : ''), structureEnd: 'End structure', structureCorrect: 'Correct area to ' + p.areaSqft + ' sq ft', transfer: 'Transfer to ' + (p.newOwners || []).map(function (o) { return o.name; }).join(' & ') }[type] || type;
  }

  global.GRStaff = {
    fyOptions: fyOptions, registerFyOptions: registerFyOptions, defaultFromFy: defaultFromFy, rentForFy: rentForFy, currentFy: currentFy, firstOpenFy: firstOpenFy,
    ensureOwnershipHistory: ensureOwnershipHistory, applyChange: applyChange, submitChange: submitChange, describe: describe, clone: clone
  };
})(window);
