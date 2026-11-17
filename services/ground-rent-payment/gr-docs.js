/* ==========================================================================
   Online Ground Rent Payment System – shared document helpers (Stage 05)
   Used by receipt.html, challan.html and verify.html.
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

  function backButton() {
    var btn = document.getElementById('btnBack');
    if (!btn) return;
    var s = App.getSession();
    btn.href = s && s.type === 'staff' ? 'dashboard-staff.html' : (s ? 'dashboard.html#payments' : 'index.html');
    btn.addEventListener('click', function (e) {
      if (document.referrer && document.referrer.indexOf(location.host) !== -1 && history.length > 1) { e.preventDefault(); history.back(); }
    });
  }

  global.GRDocs = { header: header, row: row, words: words, prototypeNote: prototypeNote, backButton: backButton };
})(window);
