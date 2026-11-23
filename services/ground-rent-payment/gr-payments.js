/* ==========================================================================
   Online Ground Rent Payment System – bank payment (BR) approval
   The citizen generates a challan, pays at the bank and uploads the Bank
   Receipt. Staff open the allottee's details, check the original BR and
   approve it (receipt issued) or return it to the citizen with a reason.
   Used by payment-desk.html (list) and payment-review.html (review desk).
   ========================================================================== */
(function (global) {
  'use strict';
  var App = global.GRApp;
  function D() { return App.data; }

  function challan(no) { return D().challans.filter(function (c) { return c.challanNo === no; })[0] || null; }
  function waiting(session) {
    return D().challans.filter(function (c) {
      var s = App.site(c.grId);
      return s && App.inScope(s, session) && s.status !== 'Closed' && c.status === 'BR Recorded';
    });
  }
  // Days since the citizen uploaded the BR.
  function daysWaiting(c) {
    var T = global.GRDues;
    return Math.max(0, Math.round((T.toDate(D().demoToday) - T.toDate(c.brUploadedOn || c.generatedOn)) / 86400000));
  }

  // A BR no. may be used only once – checked against system payments, other challans and the paper register.
  function duplicateOf(c) {
    var n = App.norm(c.brNo || '').replace(/\s/g, '');
    if (!n) return null;
    var p = D().payments.filter(function (x) { return x.mode === 'Offline' && App.norm(x.ref).replace(/\s/g, '') === n && x.status !== 'Reversed'; })[0];
    if (p) return 'BR already used on receipt ' + p.receiptNo + ' (' + p.grId + ').';
    var o = D().challans.filter(function (x) { return x.challanNo !== c.challanNo && x.brNo && App.norm(x.brNo).replace(/\s/g, '') === n && x.status !== 'Cancelled'; })[0];
    if (o) return 'Same BR no. uploaded on challan ' + o.challanNo + '.';
    var s = D().sites.filter(function (x) { return x.opening && x.opening.lastPayment && App.norm(x.opening.lastPayment.brNo).replace(/\s/g, '') === n; })[0];
    if (s) return 'BR is already in the paper register for ' + s.grId + '.';
    return null;
  }

  // What will be recorded: never more than the challan amount or what is outstanding today.
  function check(c) {
    var inr = App.inr, s = App.site(c.grId), d = App.dues(s);
    var paid = c.brAmount || c.amount;
    var cap = Math.min(c.amount, d.totalPayable);
    var dup = duplicateOf(c);
    var note = '', tone = 'success';
    if (dup) { note = dup; tone = 'danger'; }
    else if (paid === cap) note = 'Amount matches the challan.';
    else if (paid < cap) { note = 'Paid ' + inr(cap - paid) + ' less than the challan. ' + (D().config.settings.partialOfflinePayment ? 'It will be recorded as a part payment.' : 'Part payments are not allowed.'); tone = 'warning'; }
    else { note = 'Paid ' + inr(paid - cap) + ' more than due. Only ' + inr(cap) + ' is recorded; the excess is refunded outside the system.'; tone = 'warning'; }
    var blocked = !!dup || (paid < cap && !D().config.settings.partialOfflinePayment) || cap <= 0;
    if (cap <= 0 && !dup) { note = 'Nothing is outstanding on this account any more.'; tone = 'danger'; }
    return { site: s, dues: d, paid: paid, cap: cap, record: Math.min(paid, cap), note: note, tone: tone, blocked: blocked };
  }

  function mobilesFor(c, s) {
    var m = App.siteMobiles(s);
    if (c.payerMobile && m.indexOf(c.payerMobile) === -1) m.push(c.payerMobile);
    return m;
  }
  // Approve: record the payment, issue the receipt and close the challan. Returns the payment.
  function approve(c, session) {
    var k = check(c);
    if (k.blocked) throw new Error(k.note || 'This payment cannot be approved.');
    var s = k.site, inr = App.inr;
    var p = { receiptNo: App.newReceiptNo(), grId: s.grId, mode: 'Offline', ref: c.brNo, brDate: c.brDate, bank: 'Designated bank (pending Q8)', amount: k.record,
      paidOn: c.brDate, recordedBy: D().staffRoles[session.role].user, status: 'Success', challanNo: c.challanNo, excessFlagged: Math.max(0, k.paid - k.record),
      note: k.paid < k.cap ? 'Part payment, allocated oldest dues first.' : '' };
    D().payments.unshift(p);
    App.closeChallans(s.grId, 'Paid against challan ' + c.challanNo + ' · receipt ' + p.receiptNo, c.challanNo);
    c.status = 'Verified'; c.receiptNo = p.receiptNo; c.approvedBy = p.recordedBy; c.approvedOn = D().demoToday;
    if (c.payerMobile) App.saveSiteForCitizen(c.payerMobile, s.grId);
    App.audit({ grId: s.grId, entity: 'Payment', action: 'Bank payment approved · challan ' + c.challanNo + ' · BR ' + c.brNo + ' · ' + inr(k.record) + ' · receipt ' + p.receiptNo, file: c.brScan || null });
    mobilesFor(c, s).forEach(function (m) { App.notify(m, 'Payment received', 'Receipt ' + p.receiptNo + ' · ' + inr(k.record) + ' for ' + s.grId + ' (BR ' + c.brNo + ').', s.grId); });
    App.save();
    return p;
  }
  // Return to the citizen: the challan opens again for a new BR upload.
  function reject(c, reason) {
    var s = App.site(c.grId);
    App.audit({ grId: s.grId, entity: 'Challan', action: 'Bank Receipt returned to citizen · challan ' + c.challanNo + ' · BR ' + c.brNo, reason: reason, file: c.brScan || null });
    mobilesFor(c, s).forEach(function (m) { App.notify(m, 'Bank Receipt not accepted', 'Challan ' + c.challanNo + ': ' + reason + '. Please upload the Bank Receipt again.', s.grId); });
    c.status = 'Generated'; c.returnReason = reason;
    delete c.brNo; delete c.brDate; delete c.brAmount; delete c.brScan;
    App.save();
  }
  var RETURN_REASONS = ['BR no. does not match the original receipt', 'Amount does not match the original receipt', 'Scan is not readable', 'Original BR not produced at the counter'];

  global.GRPay = { challan: challan, waiting: waiting, daysWaiting: daysWaiting, duplicateOf: duplicateOf, check: check, approve: approve, reject: reject, RETURN_REASONS: RETURN_REASONS };
})(window);
