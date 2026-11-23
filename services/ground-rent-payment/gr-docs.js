/* ==========================================================================
   Online Ground Rent Payment System – shared document helpers (Stage 05)
   Used by receipt.html, challan.html, verify.html, document.html and payment-review.html.
   ========================================================================== */
(function (global) {
  'use strict';
  var App = global.GRApp;

  function header(title) {
    return '<header class="gr-doc-head"><img src="../../common/assets/images/sikkim-government-logo-dark.png" alt="Official Emblem of the Government of Sikkim">' +
      '<div class="fw-bold mt-1">Government of Sikkim</div><div class="small">Urban Development Department</div>' +
      '<div class="small text-muted">Online Ground Rent Payment System</div><h1 class="gr-doc-title">' + App.esc(title) + '</h1></header>';
  }
  function row(label, valueHtml) {
    return '<tr><th scope="row" class="text-muted fw-semibold" style="width:38%;">' + App.esc(label) + '</th><td>' + valueHtml + '</td></tr>';
  }
  function prototypeNote() {
    return '<p class="small text-muted text-center mt-3 mb-0 border-top pt-2"><i class="bi bi-flask me-1" aria-hidden="true"></i>Prototype document with demonstration data &ndash; not valid for any official purpose.</p>';
  }

  // Indian numbering in words ("Six Thousand One Hundred Ten Rupees")
  var ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  var TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  function two(n) { return n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : ''); }
  function three(n) { return (n >= 100 ? ONES[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' : '') : '') + (n % 100 ? two(n % 100) : ''); }
  function words(amount) {
    var n = Math.round(Number(amount) || 0);
    if (n === 0) return 'Rupees Zero';
    var parts = [];
    var crore = Math.floor(n / 10000000); n %= 10000000;
    var lakh = Math.floor(n / 100000); n %= 100000;
    var thousand = Math.floor(n / 1000); n %= 1000;
    if (crore) parts.push(three(crore) + ' Crore');
    if (lakh) parts.push(two(lakh) + ' Lakh');
    if (thousand) parts.push(two(thousand) + ' Thousand');
    if (n) parts.push(three(n));
    return 'Rupees ' + parts.join(' ');
  }

  // Demonstration records loaded with the seed have no real file: a sample Bank Receipt (or a placeholder) instead.
  function sample(a) {
    var D = App.data, esc = App.esc, inr = App.inr;
    var br = (a.file.match(/\d{4}N-\d{5}-\d{5}/) || [])[0];
    var c = br ? D.challans.filter(function (x) { return x.brNo === br; })[0] : null;
    var p = br ? D.payments.filter(function (x) { return x.ref === br; })[0] : null;
    if (br && (c || p)) {
      var amt = c ? (c.brAmount || c.amount) : p.amount, date = c ? c.brDate : p.paidOn, gr = c ? c.grId : p.grId;
      var bank = D.config.lists.banks[0];
      return '<div class="border border-2 rounded p-3 mx-auto bg-light" style="max-width:520px;font-family:\'Noto Serif\',serif;">' +
        '<div class="text-center fw-bold">' + esc(bank.name) + '</div><div class="text-center small text-muted mb-2">' + esc(bank.branch) + '</div>' +
        '<div class="text-center fw-bold border-top border-bottom py-1 mb-2">BANK RECEIPT</div>' +
        '<table class="table table-sm table-borderless mb-0"><tbody>' +
          row('BR No.', '<span class="font-monospace">' + esc(br) + '</span>') +
          row('Date', App.fmtDate(date)) +
          row('Received for', 'Ground rent &bull; <span class="gr-gr-id">' + esc(gr) + '</span>') +
          (c ? row('Challan No.', esc(c.challanNo)) : '') +
          row('Amount', '<strong>' + inr(amt) + '</strong>') +
          row('In words', esc(words(amt)) + ' only') +
        '</tbody></table></div>' +
        '<p class="small text-muted text-center mt-3 mb-0"><i class="bi bi-info-circle me-1" aria-hidden="true"></i>Sample scan for a demonstration record. Files you upload during the demo are shown here as uploaded.</p>';
    }
    return '<div class="border rounded p-5 text-center bg-light"><i class="bi bi-file-earmark-richtext fs-1 text-muted" aria-hidden="true"></i>' +
      '<p class="fw-semibold mt-2 mb-1">' + esc(a.docType) + '</p><p class="small text-muted mb-0">Sample document for a demonstration record. Files you upload during the demo are shown here as uploaded.</p></div>';
  }
  // Show an uploaded file (image / PDF) inside the page; the sample when no real file is stored.
  function previewInto(el, name, grId) {
    if (!el || !name) return;
    var a = App.attachmentFor(name, grId) || App.attachmentFor(name) || { id: null, file: name, docType: 'Bank Receipt scan' };
    el.innerHTML = '<p class="small text-muted mb-0">Opening the file…</p>';
    (a.id ? App.getFile(a.id) : Promise.resolve(null)).then(function (file) {
      if (!file) { el.innerHTML = sample(a); return; }
      var url = URL.createObjectURL(file), type = file.type || '';
      if (/^image\//.test(type)) el.innerHTML = '<img src="' + url + '" alt="' + App.esc(a.docType + ': ' + a.file) + '" class="img-fluid d-block mx-auto border rounded">';
      else if (type === 'application/pdf' || /\.pdf$/i.test(a.file)) el.innerHTML = '<iframe src="' + url + '" title="' + App.esc(a.file) + '" class="w-100 border rounded gr-preview-frame"></iframe>';
      else el.innerHTML = '<div class="alert alert-light border small mb-0">This file type cannot be previewed here. Open it in the document viewer.</div>';
    });
  }

  function backButton() {
    var btn = document.getElementById('btnBack');
    if (!btn) return;
    var s = App.getSession();
    btn.href = s && s.type === 'staff' ? 'dashboard-staff.html' : (s ? 'dashboard.html#payments' : 'index.html');
    btn.addEventListener('click', function (e) {
      if (document.referrer && document.referrer.indexOf(location.host) !== -1 && history.length > 1) { e.preventDefault(); history.back(); }
    });
  }

  global.GRDocs = { header: header, row: row, words: words, prototypeNote: prototypeNote, backButton: backButton, sample: sample, previewInto: previewInto };
})(window);
