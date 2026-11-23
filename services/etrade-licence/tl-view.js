/* ==========================================================================
   e-Trade Licence (UDD) – shared application views
   Used by application.html (applicant tracking) and review.html (officers).
   ========================================================================== */
(function (global) {
  'use strict';
  var App = global.TLApp, F = global.TLFlow;
  var esc = App.esc, inr = App.inr;
  function D() { return App.data; }

  function card(title, body, sub, extra) {
    return '<div class="card border-0 shadow-xs mb-3"><div class="card-header bg-white d-flex justify-content-between align-items-start flex-wrap gap-2"><div><h2 class="h6 fw-bold mb-0">' + title + '</h2>' + (sub ? '<div class="small text-muted">' + sub + '</div>' : '') + '</div>' + (extra || '') + '</div><div class="card-body">' + body + '</div></div>';
  }

  // Forward path for this kind, with done / current markers.
  function flow(a) {
    var steps = a.kind === 'Renewal'
      ? [['Submitted with BR', 'Applicant'], ['Inspector', 'Inspector'], ['BO approves', 'BO'], ['Renewed licence', 'Licence']]
      : [['Submitted', 'Applicant'], ['Inspector', 'Inspector'], ['BO', 'BO'], ['Special Secretary', 'Special Secretary'], ['HOD', 'HOD'], ['Payment', 'Payment'], ['Licence', 'Licence']];
    var ST = F.ST, idx;
    switch (a.status) {
      case ST.DRAFT: case ST.RETURNED: idx = 0; break;
      case ST.SUBMITTED: case ST.UNDER_INSPECTION: idx = 1; break;
      case ST.RESUBMITTED: idx = a.returnedBy && a.returnedBy.role === 'bo' ? 2 : 1; break;
      case ST.WITH_BO: case ST.RETURNED_BO: idx = 2; break;
      case ST.WITH_SS: case ST.RETURNED_SS: idx = 3; break;
      case ST.WITH_HOD: idx = 4; break;
      case ST.PAYMENT: case ST.BR_UPLOADED: case ST.BR_INVALID: idx = steps.length - 2; break;
      default: idx = steps.length;
    }
    return '<ol class="tl-flow" aria-label="Approval path">' + steps.map(function (s, i) {
      var cls = i < idx ? 'done' : (i === idx ? 'now' : '');
      return (i ? '<li class="tl-flow-sep" aria-hidden="true"><i class="bi bi-chevron-right"></i></li>' : '') +
        '<li class="' + cls + '"' + (i === idx ? ' aria-current="step"' : '') + '>' + (i < idx ? '<i class="bi bi-check-lg" aria-hidden="true"></i>' : '') + esc(s[0]) + '</li>';
    }).join('') + '</ol>';
  }

  // Original documents (renewal: original BR) as seen by the Inspector and by the BO – each check shown separately.
  function originals(a, opts) {
    var short = opts && opts.short;
    return '<ul class="list-unstyled mb-0 tl-originals">' + [['inspector', 'Inspector'], ['bo', 'BO']].map(function (r) {
      var c = F.originalsBy(a, r[0]);
      return '<li class="small">' + (c ? '<i class="bi bi-check-circle-fill text-success me-1" aria-hidden="true"></i><span class="fw-semibold">' + r[1] + ':</span> ' + esc(c.by) + (short ? '' : ' &ndash; ' + esc(c.how)) + ', ' + App.fmtDate(c.on)
        : '<i class="bi bi-circle text-muted me-1" aria-hidden="true"></i><span class="fw-semibold">' + r[1] + ':</span> <span class="text-muted">not yet</span>') + '</li>';
    }).join('') + '</ul>';
  }
  function summary(a) {
    var c = App.circle(a.circle), lic = a.licenceNo ? App.licence(a.licenceNo) : null;
    return '<dl class="tl-dl">' +
      '<dt>Application ID</dt><dd><span class="tl-ref-id">' + esc(a.appId) + '</span></dd>' +
      '<dt>Type</dt><dd>' + App.kindBadge(a) + (a.kind === 'Change' && a.change ? ' ' + a.change.types.map(function (t) { return esc(F.CHANGE_TYPES[t].label); }).join(', ') : '') + '</dd>' +
      (F.isOldRenewal(a) ? '<dt>Old licence</dt><dd><span class="tl-ref-id">' + esc(a.form.oldLicenceNo) + '</span> <span class="text-muted fw-normal">&bull; valid to ' + App.fmtDate(a.form.oldValidTo) + '</span></dd>' : '') +
      (a.licenceNo ? '<dt>Licence</dt><dd><a class="tl-ref-id" href="licence.html?no=' + encodeURIComponent(a.licenceNo) + '">' + esc(a.licenceNo) + '</a>' + (lic && a.kind !== 'New' ? ' ' + App.pill(F.licenceState(lic)) : '') + '</dd>' : '') +
      '<dt>Circle</dt><dd>' + esc(c ? c.name : a.circle) + '</dd>' +
      '<dt>Applicant type</dt><dd>' + esc(F.TYPES[F.typeOf(a)].label) + '</dd>' +
      '<dt>Purpose</dt><dd>' + esc(App.category(a.category).name) + (a.orgType !== App.category(a.category).name ? ' &bull; ' + esc(a.orgType) : '') + '</dd>' +
      '<dt>First submitted</dt><dd>' + App.fmtDate(a.firstSubmittedOn) + (a.round > 1 ? ' <span class="text-muted fw-normal">&bull; resubmitted ' + App.fmtDate(a.submittedOn) + ' (round ' + a.round + ')</span>' : '') + '</dd>' +
      '<dt>Status</dt><dd>' + App.pill(a.status) + '</dd>' +
      '<dt>Pending with</dt><dd>' + esc(F.pendingWith(a).label) + '</dd>' +
      (a.selectedBo ? '<dt>BO selected</dt><dd>' + esc(F.staffName(a.selectedBo)) + '</dd>' : '') +
      '<dt>' + (a.kind === 'Renewal' ? 'Original BR received' : 'Originals verified') + '</dt><dd>' + originals(a, { short: true }) + '</dd>' +
    '</dl>';
  }

  // Form details by section; flagged fields highlighted; change requests show old → new.
  function sectionHead(t) { return '<h3 class="h6 fw-semibold text-muted text-uppercase small mt-2 mb-2">' + esc(t) + '</h3>'; }
  // Purpose of the licence: applicant type, category and activity / item.
  function purpose(a) {
    var c = App.category(a.category), fl = a.correction && (a.correction.fields || []).indexOf('category') !== -1;
    return '<dl class="tl-dl mb-3"><dt' + (fl ? ' class="text-warning-emphasis"' : '') + '>Applicant type' + (fl ? ' <span class="badge bg-warning text-dark">flagged</span>' : '') + '</dt><dd>' + esc(F.TYPES[F.typeOf(a)].label) + '</dd>' +
      '<dt>Item (purpose)</dt><dd>' + esc(c ? c.name : '—') + '</dd>' +
      (a.category === 'OTHER' ? '<dt>Purpose (as described)</dt><dd>' + esc(a.form.otherPurpose || '—') + '</dd>' : '') +
      (a.item ? '<dt>Sub-item (activity)</dt><dd>' + esc(a.item) + '</dd>' : '') + '</dl>';
  }
  // Form details by section; flagged fields highlighted; change requests show old → new.
  function details(a) {
    var flagged = a.correction ? a.correction.fields || [] : [];
    var keys = a.kind === 'Change' && a.change ? F.changeFields(a) : null;
    var type = F.typeOf(a);
    var html = sectionHead('Purpose of licence') + purpose(a);
    Object.keys(F.SECTIONS).forEach(function (sec) {
      var list = F.fieldsFor(a, sec);
      if (!list.length) return;
      var rows = list.map(function (f) {
        var changed = keys && keys.indexOf(f.key) !== -1;
        var shown = esc(F.showValue(f, a.form[f.key]));
        return '<dt' + (flagged.indexOf(f.key) !== -1 ? ' class="text-warning-emphasis"' : '') + '>' + esc(F.labelOf(f, type)) + (flagged.indexOf(f.key) !== -1 ? ' <span class="badge bg-warning text-dark">flagged</span>' : '') + '</dt><dd>' +
          (changed ? '<span class="text-decoration-line-through text-muted fw-normal">' + esc(F.showValue(f, a.change.old[f.key])) + '</span> <i class="bi bi-arrow-right" aria-hidden="true"></i> <span class="text-success">' + shown + '</span>' : shown) + '</dd>';
      }).join('');
      var photo = sec === 'applicant' && a.docs && a.docs.photo ? '<div class="tl-details-photo">' + App.fileThumb(a.docs.photo.file, 'Photograph', F.docLabel('photo')) + '</div>' : '';
      html += sectionHead(F.sectionLabel(sec, type)) + (photo ? '<div class="d-flex flex-column-reverse flex-sm-row gap-3 align-items-start"><dl class="tl-dl mb-3 flex-grow-1 min-w-0 w-100">' + rows + '</dl>' + photo + '</div>' : '<dl class="tl-dl mb-3">' + rows + '</dl>');
    });
    return html;
  }

  function documents(a) {
    var list = F.docList(a);
    Object.keys(a.docs || {}).forEach(function (k) { if (!list.some(function (d) { return d.key === k; })) list.push({ key: k, req: false }); });
    var flagged = a.correction ? a.correction.docs || [] : [];
    return '<ul class="list-group list-group-flush">' + list.map(function (x) {
      var k = x.key, d = a.docs[k];
      return '<li class="list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2' + (flagged.indexOf(k) !== -1 ? ' tl-flagged' : '') + '"><div class="min-w-0"><div class="small fw-semibold">' + esc(F.docLabel(k)) + (x.req ? '' : ' <span class="badge bg-light text-secondary border">optional</span>') + (flagged.indexOf(k) !== -1 ? ' <span class="badge bg-warning text-dark">flagged</span>' : '') + '</div>' +
        '<div class="small mt-1">' + (d ? '<div class="tl-thumbs mt-0">' + App.fileThumb(d.file, d.file, F.docLabel(k), 'Version ' + d.v + ' &bull; ' + App.fmtDate(d.on)) + '</div>' : (x.req ? '<span class="text-danger">Not uploaded</span>' : '<span class="text-muted">Not uploaded</span>')) + '</div></div></li>';
    }).join('') + '</ul>';
  }

  // Inspection notes. opts.canEdit: show Edit buttons (Special Secretary).
  function notes(a, opts) {
    opts = opts || {};
    if (!a.inspections.length) return '<p class="small text-muted mb-0">No inspection notes yet.</p>';
    return a.inspections.map(function (n) {
      var files = (n.files || []).map(function (f) { return App.fileThumb(f, f, 'Inspection photo / document'); }).join('');
      var edits = (n.edits || []);
      return '<div class="tl-note"><div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-1"><div class="small"><strong>' + esc(n.byName) + '</strong> <span class="text-muted">(' + esc(n.role) + ')</span> &bull; ' + (n.visitDate ? 'site visit ' + App.fmtDate(n.visitDate) : 'note added ' + App.fmtStamp(n.at)) + '</div>' +
        (opts.canEdit ? '<button type="button" class="btn btn-sm btn-outline-primary" data-edit-note="' + esc(n.id) + '"><i class="bi bi-pencil me-1" aria-hidden="true"></i>Edit Note</button>' : '') + '</div>' +
        '<p class="small mb-1">' + esc(n.notes) + '</p>' +
        (n.originalsCollected ? '<div class="small text-success mb-1"><i class="bi bi-check-circle-fill me-1" aria-hidden="true"></i>Originals verified at inspection</div>' : '') +
        (files ? '<div class="tl-thumbs mb-1">' + files + '</div>' : '') +
        (edits.length ? '<details class="mt-2"><summary class="small text-muted">Edited by ' + esc(edits[edits.length - 1].editedBy) + ' (' + esc(edits[edits.length - 1].editedRole) + ') on ' + App.fmtStamp(edits[edits.length - 1].editedOn) + ' &ndash; show original</summary>' +
          edits.map(function (e, i) { return '<div class="tl-note-old mt-1">' + (i === 0 ? 'Original' : 'Version ' + (i + 1)) + ' by ' + esc(i === 0 ? n.byName : edits[i - 1].editedBy) + ': ' + esc(e.notes) + '</div>'; }).join('') + '</details>' : '') +
      '</div>';
    }).join('');
  }

  // opts.applicant: inspection notes are internal – show the action but not its remarks.
  function history(a, opts) {
    var internal = opts && opts.applicant;
    var rows = a.history.slice().reverse().map(function (h) {
      return internal && /nspection note|nspection report|e-inspection note|Special Secretary note/.test(h.action) ? Object.assign({}, h, { remarks: '' }) : h;
    });
    return '<div class="gov-timeline my-0">' + rows.map(function (h, i) {
      return '<div class="gov-timeline-item ' + (i === 0 ? 'active' : 'completed') + '"><span class="gov-timeline-point" aria-hidden="true"><i class="bi ' + (i === 0 ? 'bi-dot' : 'bi-check') + '"></i></span>' +
        '<div class="gov-timeline-content py-2 px-3"><div class="d-flex justify-content-between flex-wrap gap-2"><span class="small fw-semibold">' + esc(h.action) + '</span><span class="small text-muted">' + App.fmtStamp(h.at) + '</span></div>' +
        '<div class="small text-muted">' + esc(h.by) + ' &bull; ' + esc(h.role) + '</div>' + (h.remarks ? '<div class="small mt-1"><i class="bi bi-chat-left-text me-1 text-primary" aria-hidden="true"></i>' + esc(h.remarks) + '</div>' : '') + '</div></div>';
    }).join('') + '</div>';
  }

  // Earlier rounds kept after each return and resubmission.
  function versions(a) {
    if (!a.versions || !a.versions.length) return '<p class="small text-muted mb-0">No earlier versions. Each time the application is returned and resubmitted, the earlier version is kept here.</p>';
    return a.versions.slice().reverse().map(function (v) {
      var ch = (v.changedFields || []).map(function (c) { return '<li>' + esc(F.fieldLabel(c.key, F.typeOf(a))) + ': <span class="text-decoration-line-through text-muted">' + esc(c.old) + '</span> &rarr; ' + esc(c.new) + '</li>'; })
        .concat((v.changedDocs || []).map(function (c) { return '<li>' + esc(F.docLabel(c.key)) + ': ' + (c.old ? App.fileLink(c.old, c.old + ' (earlier)') : 'none') + ' &rarr; ' + App.fileLink(c.new) + '</li>'; })).join('');
      return '<div class="tl-note"><div class="small fw-semibold">Round ' + v.round + ' &bull; submitted ' + App.fmtDate(v.submittedOn) + ' &bull; returned ' + App.fmtDate(v.returnedOn) + ' by ' + esc(v.returnedBy) + '</div>' +
        '<div class="small text-muted mb-1">Remarks: ' + esc(v.remarks) + '</div>' + (ch ? '<ul class="small mb-0 ps-3">' + ch + '</ul>' : '<div class="small text-muted">No field changes recorded.</div>') + '</div>';
    }).join('');
  }

  // Fee lines: fee + garbage fee (+ late surcharge for renewals) = total on one BR.
  function feeTable(f, renewal) {
    return '<table class="table table-sm mb-2"><tbody>' +
      '<tr><th scope="row" class="fw-semibold text-muted">' + esc(f.kind) + ' fee</th><td class="text-end">' + inr(f.base) + '</td></tr>' +
      '<tr><th scope="row" class="fw-semibold text-muted">Garbage fee</th><td class="text-end">' + inr(f.garbage) + '</td></tr>' +
      (renewal ? '<tr><th scope="row" class="fw-semibold text-muted">Late surcharge' + (f.lateDays ? ' (' + f.lateDays + ' days &times; ₹' + D().config.renewalFine.perDay + ')' : '') + '</th><td class="text-end">' + inr(f.fine) + '</td></tr>'
        : (f.fine ? '<tr><th scope="row" class="fw-semibold text-muted">Fine / surcharge (old licence)</th><td class="text-end">' + inr(f.fine) + '</td></tr>' : '')) +
      '<tr><th scope="row">Total payable on one BR</th><td class="text-end fw-bold">' + inr(f.total) + '</td></tr></tbody></table>';
  }
  // opts.applicant: the assessed fee is shown to the applicant only once it is fixed on approval.
  function fee(a, opts) {
    var f = a.fee, applicant = opts && opts.applicant, renewal = a.kind === 'Renewal';
    if (f) return feeTable(f, renewal) + '<div class="small text-muted">' + (renewal
      ? 'Renewal amount set for this licence (based on its first licence fee). The late surcharge is counted to the first submission on ' + App.fmtDate(a.firstSubmittedOn) + ' and paid with the application.'
      : 'Assessed by ' + esc(f.assessedBy || 'the Inspector') + ' (' + esc(f.assessedRole || 'Inspector') + ')' + (f.assessedOn ? ' on ' + App.fmtDate(f.assessedOn) : '') + '; fixed on approval, ' + App.fmtDate(f.fixedOn) + '.') + '</div>';
    if (renewal) return feeTable(F.computeFee(a), true) + '<div class="small text-muted">If submitted today. The amount is paid with the renewal application.</div>';
    if (!a.assessment) return '<p class="small text-muted mb-0"><i class="bi bi-hourglass-split me-1" aria-hidden="true"></i>Not yet assessed. The Inspector works out the ' + (a.kind === 'Change' ? 'change' : 'licence') + ' fee and the garbage fee in the inspection report.</p>';
    if (applicant) return '<p class="small text-muted mb-0"><i class="bi bi-check-circle me-1 text-success" aria-hidden="true"></i>The fee has been assessed at the inspection. You will see the amount to pay once the application is approved.</p>';
    return feeTable(F.computeFee(a), false) + '<div class="small text-muted">Assessed by ' + esc(a.assessment.by) + ' (' + esc(a.assessment.role || 'Inspector') + ') on ' + App.fmtDate(a.assessment.on) + '. Fixed when the HOD approves.</div>' +
      ((a.assessmentHistory || []).length ? '<div class="small text-muted mt-1">Earlier: ' + a.assessmentHistory.slice().reverse().map(function (h) { return inr(h.fee + h.garbage + (h.fine || 0)) + ' by ' + esc(h.by) + ' (' + esc(h.role || 'Inspector') + '), ' + App.fmtDate(h.on); }).join('; ') + '</div>' : '');
  }

  function br(a) {
    var list = (a.brHistory || []).slice();
    if (a.br) list.push(a.br);
    if (!list.length) return '';
    return list.slice().reverse().map(function (b) {
      var p = b.status === 'Verified' ? App.pill('Licence Issued', 'Verified') : (b.status === 'Invalid' ? App.pill('BR Invalid', 'Invalid') : (b.status === 'Replaced' ? App.pill('Superseded', 'Replaced') : App.pill('BR Uploaded', 'Awaiting verification')));
      var dup = b.status === 'Uploaded' ? F.brDuplicate(b.brNo, a.appId) : null;
      var short = a.fee && b.amount < a.fee.total;
      return '<div class="tl-note"><div class="d-flex justify-content-between flex-wrap gap-2"><span class="small fw-semibold font-monospace">BR ' + esc(b.brNo) + '</span>' + p + '</div>' +
        '<div class="small text-muted">Dated ' + App.fmtDate(b.brDate) + ' &bull; ' + inr(b.amount) + ' &bull; uploaded ' + App.fmtDate(b.uploadedOn) + '</div>' + (b.scan ? '<div class="tl-thumbs mt-2">' + App.fileThumb(b.scan, 'BR scan', 'Bank Receipt', esc(b.scan)) + '</div>' : '') +
        (dup ? '<div class="small text-danger mt-1"><i class="bi bi-exclamation-octagon-fill me-1" aria-hidden="true"></i>Duplicate: this BR number is already used on ' + esc(dup) + '.</div>' : '') +
        (short && b.status === 'Uploaded' ? '<div class="small text-danger mt-1"><i class="bi bi-exclamation-triangle-fill me-1" aria-hidden="true"></i>Amount is less than the fee payable (' + inr(a.fee.total) + ').</div>' : '') +
        (b.remarks ? '<div class="small mt-1">Remarks: ' + esc(b.remarks) + (b.checkedBy ? ' &ndash; ' + esc(b.checkedBy) : '') + '</div>' : (b.checkedBy ? '<div class="small mt-1 text-muted">Checked by ' + esc(b.checkedBy) + ' on ' + App.fmtDate(b.checkedOn) + '</div>' : '')) + '</div>';
    }).join('');
  }

  function correction(a) {
    if (!a.correction) return '';
    var c = a.correction;
    var items = (c.fields || []).map(function (k) { return esc(F.fieldLabel(k, F.typeOf(a))); }).concat((c.docs || []).map(function (k) { return esc(F.docLabel(k)); }));
    return '<div class="alert alert-warning small"><div class="fw-bold mb-1"><i class="bi bi-arrow-return-left me-1" aria-hidden="true"></i>Correction required &ndash; returned by ' + esc(c.by) + ' (' + esc(c.role) + ') on ' + App.fmtDate(c.on) + '</div>' + esc(c.remarks) +
      (items.length ? '<div class="mt-1"><strong>To correct:</strong> ' + items.join(', ') + '</div>' : '') + '</div>';
  }

  // Officer work-queue table (desktop) + cards (mobile): 6 columns.
  function queueTable(id, title, sub, list, emptyText, headerExtra) {
    var s = App.getSession();
    var rows = list.map(function (a) {
      var mine = F.canAct(a, s.userId);
      var btn = '<a class="btn btn-sm ' + (mine ? 'btn-primary' : 'btn-outline-primary') + '" href="review.html?app=' + encodeURIComponent(a.appId) + '">' + (mine ? (a.status === F.ST.BR_UPLOADED ? 'Verify BR' : 'Review Application') : 'View') + '</a>';
      var link = '<a class="tl-ref-id small" href="review.html?app=' + encodeURIComponent(a.appId) + '">' + esc(a.appId) + '</a>';
      return {
        row: '<tr><td>' + link + '<div>' + App.kindBadge(a) + '</div></td><td><div class="small fw-semibold text-truncate" style="max-width:240px;">' + esc(App.appName(a)) + '</div><div class="small text-muted text-truncate" style="max-width:240px;">' + esc(a.orgType) + '</div></td>' +
          '<td class="small">' + esc(App.category(a.category).short) + '<div class="text-muted">' + esc(F.TYPES[F.typeOf(a)].short) + '</div></td><td class="small">' + App.fmtDate(a.updatedOn) + '</td><td>' + App.pill(a.status) + '<div class="small text-muted text-truncate" style="max-width:200px;">' + esc(F.pendingWith(a).label) + '</div></td>' +
          '<td class="text-end text-nowrap"><div class="d-inline-flex align-items-center gap-1 text-nowrap">' + btn + '</div></td></tr>',
        card: App.mobileCard(link, App.pill(a.status), '<div class="small fw-semibold">' + esc(App.appName(a)) + '</div><div class="small text-muted">' + App.kindBadge(a) + ' ' + esc(a.orgType) + ' &bull; ' + App.fmtDate(a.updatedOn) + '</div>', btn)
      };
    });
    return App.tableCard(id, title, sub, [{ t: 'Application ID', w: '18%' }, { t: 'Applicant', w: '24%' }, { t: 'Item', w: '12%' }, { t: 'Last Action', w: '12%' }, { t: 'Status &amp; Stage', w: '18%' }, { t: 'Action', end: true, w: '16%' }],
      rows.map(function (r) { return r.row; }).join(''), rows.map(function (r) { return r.card; }).join(''), emptyText, headerExtra);
  }

  // ---------------- Instructions: documents and downloadable formats ----------------
  // Built from the document types and items masters, so the instructions always match what the form asks for.
  function fmtBtn(key) {
    var url = F.formatUrl(key);
    return url ? ' <a class="btn btn-sm btn-outline-primary py-0 ms-1 tl-fmt-btn" href="' + url + '" target="_blank" rel="noopener"><i class="bi bi-download me-1" aria-hidden="true"></i>Format<span class="visually-hidden"> for ' + esc(F.docLabel(key)) + ' (opens in a new tab)</span></a>' : '';
  }
  function docLi(key, req) {
    return '<li>' + esc(F.docLabel(key)) + (req ? '' : ' <span class="badge bg-light text-secondary border">optional</span>') + fmtBtn(key) + '</li>';
  }
  // Documents asked of every applicant of this type (IND / COMP).
  function baseDocList(type) {
    return '<ul class="tl-doc-list">' + F.docTypes().filter(function (d) { return d.base && d.base[type]; }).map(function (d) { return docLi(d.key, d.base[type] === 'M'); }).join('') + '</ul>';
  }
  function docNames(list) { return list.map(function (m) { return esc(F.docLabel(m.key)) + (m.req === 'O' ? ' <span class="text-muted">(optional)</span>' : ''); }).join('; '); }
  // Extra documents for particular items and sub-items: one row per item that has any.
  function itemDocTable(type) {
    var rows = F.categoriesOf(type).map(function (c) {
      var own = (c.docs || []).filter(function (m) { var d = F.docType(m.key); return d && d.active !== false; });
      var subs = F.items(c.code).filter(function (s) { return (s.docs || []).length; });
      if (!own.length && !subs.length) return '';
      return '<tr><th scope="row" class="fw-semibold">' + esc(c.name) + '</th><td>' + (own.length ? docNames(own) : '') +
        subs.map(function (s) { return '<div class="' + (own.length ? 'mt-1 ' : '') + 'text-muted">' + esc(s.name) + ': <span class="text-body">' + docNames(s.docs) + '</span></div>'; }).join('') + '</td></tr>';
    }).join('');
    return rows ? '<div class="table-responsive"><table class="table table-sm small mb-0 tl-item-docs"><caption class="visually-hidden">Extra documents by item</caption><thead><tr><th scope="col" style="width:38%">Item</th><th scope="col">Extra documents</th></tr></thead><tbody>' + rows + '</tbody></table></div>'
      : '<p class="small text-muted mb-0">No extra documents for these items.</p>';
  }
  // Documents that depend on an answer in the form (franchise, hotel registration, old licence) – each listed once.
  function whenDocList() {
    var out = [];
    F.docTypes().forEach(function (d) {
      var ifs = Object.keys(d.when || {}).filter(function (w) { return F.WHEN[w]; }).map(function (w) { return F.WHEN[w].label.replace(/ = Yes.*$/, '').replace(/ \(individuals\)$/, '').replace(/^./, function (x) { return x.toLowerCase(); }); });
      if (ifs.length) out.push('<li>' + esc(d.name) + ' <span class="text-muted">&ndash; if ' + esc(ifs.join(', or if ')) + '</span></li>');
    });
    return '<ul class="tl-doc-list">' + out.join('') + '</ul>';
  }
  function renewalDocList() {
    return '<ul class="tl-doc-list">' + F.docTypes().filter(function (d) { return d.renewal; }).map(function (d) { return docLi(d.key, d.renewal === 'M'); }).join('') +
      '<li>Bank Receipt (BR) for the renewal amount + garbage fee + any late surcharge &ndash; BR number, date, amount and scan</li></ul>';
  }
  function changeDocList(t) {
    return '<ul class="tl-doc-list">' + F.docTypes().filter(function (d) { return d.change && d.change[t]; }).map(function (d) { return docLi(d.key, d.change[t] === 'M'); }).join('') + '</ul>';
  }
  // Prescribed formats: download, fill, sign and upload.
  function formatList() {
    return '<ul class="list-group list-group-flush tl-format-list">' + Object.keys(F.FORMATS).map(function (f) {
      var who = F.docTypes().filter(function (d) { return d.format === f; }).map(function (d) { return Object.keys(d.base || {}).map(function (t) { return F.TYPES[t].label + (d.base[t] === 'O' ? ' (optional)' : ''); }).join(', '); })[0];
      return '<li class="list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2 px-0"><div class="min-w-0"><div class="small fw-semibold"><i class="bi bi-file-earmark-text text-primary me-1" aria-hidden="true"></i>' + esc(F.FORMATS[f]) + '</div>' + (who ? '<div class="small text-muted">For: ' + esc(who) + '</div>' : '') + '</div>' +
        '<a class="btn btn-sm btn-outline-primary" href="format.html?f=' + f + '" target="_blank" rel="noopener"><i class="bi bi-download me-1" aria-hidden="true"></i>Download<span class="visually-hidden"> ' + esc(F.FORMATS[f]) + ' (opens in a new tab)</span></a></li>';
    }).join('') + '</ul>';
  }

  global.TLView = { queueTable: queueTable, card: card, flow: flow, originals: originals, summary: summary,
    baseDocList: baseDocList, itemDocTable: itemDocTable, whenDocList: whenDocList, renewalDocList: renewalDocList, changeDocList: changeDocList, formatList: formatList, details: details, documents: documents, notes: notes, history: history, versions: versions, fee: fee, br: br, correction: correction };
})(window);
