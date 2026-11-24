/* ==========================================================================
   e-Trade Licence (UDD) – shared page helpers
   - Prototype session (no real authentication; Sikkim GO is simulated)
   - Demo data store: the seed in mock-data.js is copied into localStorage on
     first use so actions persist between pages. "Reset demo data" restores it.
   - Common shell (demo bar, header, sidebar, footer) for workspace pages
   Same structure as the Ground Rent prototype (gr-app.js).
   ========================================================================== */
(function (global) {
  'use strict';

  var SESSION_KEY = 'tl_demo_session';
  var STATE_KEY = 'tl_demo_state_v8';
  var FILE_DB = 'tl_demo_files';
  var SEED = global.TL_DATA;

  // ---------------- Demo data store ----------------
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function loadState() {
    try {
      var raw = localStorage.getItem(STATE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* storage blocked or corrupt – fall back to the seed */ }
    return clone(SEED);
  }
  var data = loadState();
  function save() {
    try { localStorage.setItem(STATE_KEY, JSON.stringify(data)); return true; } catch (e) { return false; }
  }
  function resetDemo() {
    try { localStorage.removeItem(STATE_KEY); } catch (e) { /* ignore */ }
    data = clone(SEED);
    var done = false;
    function reload() { if (!done) { done = true; window.location.reload(); } }
    try {
      var req = indexedDB.deleteDatabase(FILE_DB);
      req.onsuccess = req.onerror = req.onblocked = reload;
      setTimeout(reload, 1500);
    } catch (e) { reload(); }
  }

  // ---------------- Uploaded files (prototype) ----------------
  // The file itself is kept in this browser's IndexedDB so officers and applicants can open it again.
  var pendingFiles = [];
  function fileDb() {
    return new Promise(function (resolve, reject) {
      var r = indexedDB.open(FILE_DB, 1);
      r.onupgradeneeded = function () { r.result.createObjectStore('files'); };
      r.onsuccess = function () { resolve(r.result); };
      r.onerror = function () { reject(r.error); };
    });
  }
  function putFile(id, file) {
    var p = fileDb().then(function (db) {
      return new Promise(function (resolve) {
        var tx = db.transaction('files', 'readwrite');
        tx.objectStore('files').put(file, id);
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = tx.onabort = function () { resolve(false); };
      });
    }).catch(function () { return false; });
    pendingFiles.push(p);
    return p;
  }
  function getFile(id) {
    return fileDb().then(function (db) {
      return new Promise(function (resolve) {
        var r = db.transaction('files', 'readonly').objectStore('files').get(id);
        r.onsuccess = function () { resolve(r.result || null); };
        r.onerror = function () { resolve(null); };
      });
    }).catch(function () { return null; });
  }
  function filesReady() { return Promise.all(pendingFiles); }

  // ---------------- Session (prototype only) ----------------
  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; } catch (e) { return null; }
  }
  function setSession(s) {
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch (e) { /* ignore */ }
  }
  function logout(e) {
    if (e) e.preventDefault();
    try { localStorage.removeItem(SESSION_KEY); } catch (err) { /* ignore */ }
    window.location.href = 'index.html#login';
  }
  function requireSession(type) {
    var s = getSession();
    var ok = s && s.type === type && (type === 'staff' ? !!data.staff[s.userId] : !!data.businesses[s.scenario]);
    if (!ok) { window.location.replace('index.html#login'); return null; }
    return s;
  }
  function me(session) { session = session || getSession(); return session && session.type === 'staff' ? data.staff[session.userId] : null; }
  function business(key) { return data.businesses[key] || null; }
  function currentBusiness(session) { session = session || getSession(); return session && session.type === 'applicant' ? data.businesses[session.scenario] : null; }
  // Name and role written to history / audit log for the current user.
  function actor(session) {
    var u = me(session);
    if (u) return { name: u.name, role: u.designation };
    var b = currentBusiness(session);
    return b ? { name: b.authName, role: 'Applicant' } : { name: 'System', role: 'System' };
  }

  // ---------------- Formatting ----------------
  function inr(n) { return '₹' + Math.round(Number(n) || 0).toLocaleString('en-IN'); }
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmtDate(isoStr) {
    if (!isoStr) return '—';
    var p = String(isoStr).slice(0, 10).split('-');
    return parseInt(p[2], 10) + ' ' + MONTHS[parseInt(p[1], 10) - 1] + ' ' + p[0];
  }
  function fmtStamp(s) { if (!s) return '—'; var t = String(s).slice(11, 16); return fmtDate(s) + (t ? ', ' + t : ''); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // Amount in words (Indian numbering): 10500 → "Ten Thousand Five Hundred".
  function amountWords(n) {
    n = Math.round(Number(n) || 0);
    var a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    var t = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    function two(x) { return x < 20 ? a[x] : t[Math.floor(x / 10)] + (x % 10 ? ' ' + a[x % 10] : ''); }
    function three(x) { return (x >= 100 ? a[Math.floor(x / 100)] + ' Hundred' + (x % 100 ? ' ' : '') : '') + two(x % 100); }
    if (!n) return 'Zero';
    var out = [], cr = Math.floor(n / 10000000), la = Math.floor(n / 100000) % 100, th = Math.floor(n / 1000) % 100, rest = n % 1000;
    if (cr) out.push(three(cr) + ' Crore');
    if (la) out.push(two(la) + ' Lakh');
    if (th) out.push(two(th) + ' Thousand');
    if (rest) out.push(three(rest));
    return out.join(' ');
  }
  function maskMobile(m) { return m ? 'XXXXXX' + String(m).slice(-4) : 'Not recorded'; }
  function nowTime() {
    var d = new Date();
    return (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  }
  function stamp() { return data.demoToday + ' ' + nowTime(); }
  function qs(name) { return new URLSearchParams(location.search).get(name); }

  // ---------------- Data helpers ----------------
  function app(id) { return data.applications.filter(function (a) { return a.appId === id; })[0] || null; }
  function licence(no) { return data.licences.filter(function (l) { return l.licenceNo === no; })[0] || null; }
  function circle(code) { return data.config.circles.filter(function (c) { return c.code === code; })[0] || null; }
  function category(code) { return data.config.categories.filter(function (c) { return c.code === code; })[0] || null; }
  function appsOf(bizKey) { return data.applications.filter(function (a) { return a.businessKey === bizKey; }); }
  function licencesOf(bizKey) { return data.licences.filter(function (l) { return l.businessKey === bizKey; }); }
  function appName(a) { return a.form && a.form.businessName ? a.form.businessName : (business(a.businessKey) || {}).name; }

  // ---------------- Audit & notifications ----------------
  function audit(entry) {
    var who = actor();
    data.auditLog.unshift(Object.assign({ at: stamp(), user: who.name, role: who.role }, entry));
  }
  // SMS / email are stubs: logged to the outbox and shown as applicant notifications.
  function notify(bizKey, title, body, appId) {
    var b = business(bizKey);
    if (!b) return;
    b.notifications.unshift({ title: title, body: body, appId: appId || null, date: data.demoToday, unread: true });
    data.outbox.unshift({ at: stamp(), to: maskMobile(b.mobile) + ' / ' + b.email, channel: 'SMS + email (simulated)', text: title + ' – ' + body });
  }

  // ---------------- Status pills ----------------
  var STATUS_STYLE = {
    'Draft': ['draft', 'bi-pencil-square'],
    'Submitted': ['submitted', 'bi-send-fill'],
    'Under Inspection': ['review', 'bi-search'],
    'Returned to Applicant': ['returned', 'bi-arrow-return-left'],
    'Resubmitted': ['submitted', 'bi-arrow-repeat'],
    'With BO': ['review', 'bi-hourglass-split'],
    'With Special Secretary': ['review', 'bi-hourglass-split'],
    'Returned to BO': ['returned', 'bi-arrow-return-left'],
    'With Joint Director / Director': ['review', 'bi-hourglass-split'],
    'Returned to Joint Director / Director': ['returned', 'bi-arrow-return-left'],
    'Returned to Special Secretary': ['returned', 'bi-arrow-return-left'],
    'With Issuing Authority': ['review', 'bi-hourglass-split'],
    'Approved – Payment Pending': ['due', 'bi-currency-rupee'],
    'BR Uploaded': ['submitted', 'bi-receipt'],
    'BR Invalid': ['overdue', 'bi-x-octagon-fill'],
    'Licence Issued': ['approved', 'bi-patch-check-fill'],
    'Active': ['approved', 'bi-check-circle-fill'],
    'Expired': ['overdue', 'bi-exclamation-triangle-fill'],
    'Superseded': ['draft', 'bi-layers'],
    'Current': ['approved', 'bi-check-circle-fill']
  };
  function pill(status, text) {
    var m = STATUS_STYLE[status] || ['submitted', 'bi-info-circle-fill'];
    return '<span class="gov-status-pill gov-status-pill-' + m[0] + '"><i class="bi ' + m[1] + '" aria-hidden="true"></i>' + esc(text || status) + '</span>';
  }
  // kind: 'New' | 'Renewal' | 'Change', or the application itself (shows "Old licence" for a renewal of a licence issued before this system).
  function kindBadge(kind) {
    if (kind && typeof kind === 'object') {
      if (kind.kind === 'New' && kind.form && kind.form.applyFor === 'old') return '<span class="tl-kind tl-kind-renewal" title="Renewal of a licence issued before this system"><i class="bi bi-clock-history" aria-hidden="true"></i>Old licence</span>';
      kind = kind.kind;
    }
    var cls = kind === 'Renewal' ? ' tl-kind-renewal' : (kind === 'Change' ? ' tl-kind-change' : '');
    var icon = kind === 'Renewal' ? 'bi-arrow-clockwise' : (kind === 'Change' ? 'bi-pencil' : 'bi-plus-circle');
    return '<span class="tl-kind' + cls + '"><i class="bi ' + icon + '" aria-hidden="true"></i>' + esc(kind === 'Change' ? 'Change' : kind) + '</span>';
  }

  // ---------------- UI helpers ----------------
  function toast(message, tone) {
    var holder = document.getElementById('tl-toasts');
    if (!holder) {
      holder = document.createElement('div');
      holder.id = 'tl-toasts';
      holder.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      holder.style.zIndex = 1090;
      holder.setAttribute('aria-live', 'polite');
      document.body.appendChild(holder);
    }
    var el = document.createElement('div');
    el.className = 'toast align-items-center text-bg-' + (tone || 'success') + ' border-0 show';
    el.setAttribute('role', 'status');
    el.innerHTML = '<div class="d-flex"><div class="toast-body">' + message + '</div><button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close"></button></div>';
    el.querySelector('.btn-close').addEventListener('click', function () { el.remove(); });
    holder.appendChild(el);
    setTimeout(function () { el.remove(); }, 6000);
  }
  // Attachment rule: PDF, JPG or PNG, up to 5 MB. Returns an error string or ''.
  function checkFile(input, required) {
    var files = input.files ? Array.prototype.slice.call(input.files) : [];
    if (!files.length) return required ? 'Upload the file (PDF, JPG or PNG, up to 5 MB).' : '';
    for (var i = 0; i < files.length; i++) {
      if (!/\.(pdf|jpe?g|png)$/i.test(files[i].name)) return 'Only PDF, JPG or PNG files are accepted.';
      if (files[i].size > 5 * 1024 * 1024) return files[i].name + ' is larger than 5 MB.';
    }
    return '';
  }
  function fieldError(input, msg) {
    input.classList.toggle('is-invalid', !!msg);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    var fb = input.parentElement.querySelector('.invalid-feedback');
    if (!fb) {
      fb = document.createElement('div');
      fb.className = 'invalid-feedback';
      input.insertAdjacentElement('afterend', fb);
    }
    fb.textContent = msg || '';
    return !msg;
  }
  // Store each chosen file; returns the list of stored file names.
  function addAttachments(appId, docType, input) {
    var files = input && input.files ? Array.prototype.slice.call(input.files) : [];
    var who = actor();
    return files.map(function (f) {
      var id = 'F-' + String(data.attachments.length + 1).padStart(4, '0');
      data.attachments.unshift({ id: id, appId: appId, docType: docType, file: f.name, fileType: f.type, size: f.size, uploadedBy: who.name + ' (' + who.role + ')', at: data.demoToday });
      putFile(id, f);
      return f.name;
    });
  }
  function attachmentFor(name) { return data.attachments.filter(function (a) { return a.file === name; })[0] || null; }
  function docHref(name, docType) {
    var a = attachmentFor(name);
    return 'document.html?' + (a ? 'id=' + encodeURIComponent(a.id) : 'name=' + encodeURIComponent(name) + (docType ? '&type=' + encodeURIComponent(docType) : ''));
  }
  function docAttrs(name, docType) {
    return ' data-tl-doc="' + esc(name) + '"' + (docType ? ' data-doc-type="' + esc(docType) + '"' : '');
  }
  // Link that opens an uploaded file in the in-page document viewer.
  function fileLink(name, label, docType) {
    if (!name) return '';
    return '<a href="' + docHref(name, docType) + '" class="text-break"' + docAttrs(name, docType) + '><i class="bi bi-paperclip me-1" aria-hidden="true"></i>' + esc(label || name) + '</a>';
  }
  function isPdfName(n) { return /\.pdf$/i.test(n || ''); }
  // Placeholder face of a thumbnail (before the file loads, or for seed records with no real file).
  function thumbFace(name) {
    return isPdfName(name) ? '<i class="bi bi-file-earmark-pdf text-danger" aria-hidden="true"></i><span class="tl-thumb-ext">PDF</span>'
      : (/\.(jpe?g|png)$/i.test(name) ? '<i class="bi bi-file-earmark-image text-primary" aria-hidden="true"></i><span class="tl-thumb-ext">IMG</span>' : '<i class="bi bi-file-earmark-text text-muted" aria-hidden="true"></i>');
  }
  // Clickable thumbnail of a stored file; filled from IndexedDB by hydrateThumbs().
  function fileThumb(name, label, docType, meta) {
    if (!name) return '';
    var a = attachmentFor(name);
    return '<div class="tl-thumb-item"><a href="' + docHref(name, docType) + '" class="tl-thumb"' + docAttrs(name, docType) + (a ? ' data-att="' + esc(a.id) + '"' : '') + ' aria-label="View ' + esc(label || name) + '">' + thumbFace(name) + '</a>' +
      '<div class="tl-thumb-cap"><a href="' + docHref(name, docType) + '" class="text-break"' + docAttrs(name, docType) + '>' + esc(label || name) + '</a>' + (meta ? '<div class="text-muted">' + meta + '</div>' : '') + '</div></div>';
  }
  // Put a preview of a File / Blob into a thumbnail box.
  function fillThumb(box, file) {
    var url = URL.createObjectURL(file), type = file.type || '';
    if (/^image\//.test(type)) box.innerHTML = '<img src="' + url + '" alt="">';
    else if (type === 'application/pdf' || isPdfName(file.name)) box.innerHTML = '<iframe src="' + url + '#toolbar=0&navpanes=0&scrollbar=0&view=FitH" title="" tabindex="-1" aria-hidden="true"></iframe><span class="tl-thumb-ext">PDF</span>';
    box.classList.add('has-file');
  }
  function hydrateThumbs(scope) {
    (scope || document).querySelectorAll('.tl-thumb[data-att]:not([data-hydrated])').forEach(function (el) {
      el.setAttribute('data-hydrated', '1');
      getFile(el.getAttribute('data-att')).then(function (f) { if (f) fillThumb(el, f); });
    });
  }

  // Sample shown for demonstration records loaded with the seed (no real file behind them).
  function docSample(a) {
    var br = (a.file.match(/\d{4}N-\d{5}-\d{5}/) || [])[0];
    var ap = br ? data.applications.filter(function (x) { return x.br && x.br.brNo === br; })[0] : null;
    if (ap) {
      var bank = data.config.banks[0];
      return '<div class="border border-2 rounded p-3 mx-auto bg-light" style="max-width:520px;font-family:\'Noto Serif\',serif;">' +
        '<div class="text-center fw-bold">' + esc(bank.name) + '</div><div class="text-center small text-muted mb-2">' + esc(bank.branch) + '</div>' +
        '<div class="text-center fw-bold border-top border-bottom py-1 mb-2">BANK RECEIPT</div>' +
        '<table class="table table-sm table-borderless mb-0"><tbody>' +
        [['BR No.', '<span class="font-monospace">' + esc(br) + '</span>'], ['Date', fmtDate(ap.br.brDate)], ['Received for', 'e-Trade Licence fee &bull; ' + esc(ap.appId)], ['Deposited by', esc(appName(ap))], ['Amount', '<strong>' + inr(ap.br.amount) + '</strong>']]
          .map(function (r) { return '<tr><th scope="row" class="text-muted fw-semibold" style="width:38%;">' + r[0] + '</th><td>' + r[1] + '</td></tr>'; }).join('') +
        '</tbody></table></div><p class="small text-muted text-center mt-3 mb-0"><i class="bi bi-info-circle me-1" aria-hidden="true"></i>Sample scan for a demonstration record. Files you upload during the demo are shown here as uploaded.</p>';
    }
    var isPhoto = /\.(jpe?g|png)$/i.test(a.file);
    return '<div class="border rounded p-5 text-center bg-light"><i class="bi ' + (isPhoto ? 'bi-image' : 'bi-file-earmark-richtext') + ' fs-1 text-muted" aria-hidden="true"></i>' +
      '<p class="fw-semibold mt-2 mb-1">' + esc(a.docType) + '</p><p class="small text-muted mb-0">Sample ' + (isPhoto ? 'photo' : 'document') + ' for a demonstration record. Files you upload during the demo are shown here as uploaded.</p></div>';
  }
  // Show a stored file inside a page or popup (image / PDF), or the demonstration sample when there is no real file.
  function previewInto(el, name, docType) {
    if (!el || !name) return;
    var att = attachmentFor(name);
    var a = att || { id: null, file: name, docType: docType || 'Document' };
    el.innerHTML = '<p class="small text-muted mb-0">Opening the file…</p>';
    (a.id ? getFile(a.id) : Promise.resolve(null)).then(function (file) {
      el.innerHTML = file ? fileView(file, a.docType + ': ' + a.file).html : docSample(a);
    });
  }
  function fileView(file, title) {
    var url = URL.createObjectURL(file), type = file.type || '';
    if (/^image\//.test(type)) return { url: url, html: '<img src="' + url + '" alt="' + esc(title) + '" class="img-fluid d-block mx-auto border rounded">' };
    if (type === 'application/pdf' || isPdfName(file.name)) return { url: url, html: '<iframe src="' + url + '" title="' + esc(title) + '" class="w-100 border rounded tl-viewer-frame"></iframe>' };
    return { url: url, html: '<div class="alert alert-light border small mb-0">This file type cannot be previewed. Use Download to open it.</div>' };
  }
  // In-page document viewer (modal). src: { name, docType } of a stored file, or { file } for a File not yet saved.
  function openDoc(src) {
    var old = document.getElementById('tlDocModal');
    if (old) { var oi = bootstrap.Modal.getInstance(old); if (oi) oi.dispose(); old.remove(); }
    var att = src.file ? null : attachmentFor(src.name);
    var a = att || { id: null, file: src.file ? src.file.name : src.name, docType: src.docType || 'Document', uploadedBy: src.file ? 'You (not submitted yet)' : '—', at: null, appId: null };
    var el = document.createElement('div');
    el.className = 'modal fade'; el.id = 'tlDocModal'; el.tabIndex = -1;
    el.setAttribute('aria-labelledby', 'tlDocModalLabel'); el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="modal-dialog modal-xl modal-fullscreen-md-down modal-dialog-centered modal-dialog-scrollable"><div class="modal-content">' +
      '<div class="modal-header align-items-start"><div class="min-w-0"><h2 class="modal-title h6 fw-bold text-break" id="tlDocModalLabel"><i class="bi bi-file-earmark-text me-1 text-primary" aria-hidden="true"></i>' + esc(a.file) + '</h2>' +
      '<div class="small text-muted">' + esc(a.docType) + (a.appId ? ' &bull; <span class="tl-ref-id">' + esc(a.appId) + '</span>' : '') + ' &bull; Uploaded by ' + esc(a.uploadedBy) + (a.at ? ' on ' + fmtDate(a.at) : '') + '</div></div>' +
      '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
      '<div class="modal-body bg-light" id="tlDocBody"><p class="small text-muted mb-0">Opening the file…</p></div>' +
      '<div class="modal-footer"><a class="btn btn-sm btn-outline-primary d-none" id="tlDocDownload"><i class="bi bi-download me-1" aria-hidden="true"></i>Download</a><button type="button" class="btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">Close</button></div></div></div>';
    document.body.appendChild(el);
    var m = new bootstrap.Modal(el), urls = [];
    el.addEventListener('hidden.bs.modal', function () { urls.forEach(URL.revokeObjectURL); m.dispose(); el.remove(); });
    m.show();
    (src.file ? Promise.resolve(src.file) : (a.id ? getFile(a.id) : Promise.resolve(null))).then(function (file) {
      var body = el.querySelector('#tlDocBody');
      if (!file) { body.innerHTML = docSample(a); return; }
      var v = fileView(file, a.docType + ': ' + a.file);
      urls.push(v.url);
      body.innerHTML = v.html;
      var dl = el.querySelector('#tlDocDownload');
      dl.href = v.url; dl.setAttribute('download', a.file); dl.classList.remove('d-none');
    });
  }

  // Upload box (Tourism pattern): click or drag & drop, with thumbnails of the chosen files.
  // opts: { id, label, required, multiple, help, current: stored file name, currentLabel }
  function dropzone(opts) {
    var id = opts.id;
    return '<div class="tl-upload" data-dropzone>' +
      (opts.label ? '<div class="form-label small fw-semibold mb-1" id="' + id + '_lbl">' + opts.label + (opts.required ? ' <span class="text-danger" aria-hidden="true">*</span>' : '') + '</div>' : '') +
      '<input type="file" id="' + id + '" class="tl-dropzone-input visually-hidden" accept=".pdf,.jpg,.jpeg,.png"' + (opts.multiple ? ' multiple' : '') + (opts.label ? ' aria-labelledby="' + id + '_lbl ' + id + '_hint"' : '') + (opts.attrs || '') + '>' +
      '<label for="' + id + '" class="file-dropzone tl-dropzone mb-0"><i class="bi bi-cloud-arrow-up" aria-hidden="true"></i>' +
        '<span class="d-block small fw-semibold text-dark" id="' + id + '_hint">Click to upload or drag &amp; drop ' + (opts.multiple ? 'files' : 'a file') + ' here</span>' +
        '<span class="d-block small text-muted">' + (opts.help || 'PDF, JPG or PNG, up to 5 MB' + (opts.multiple ? ' each' : '')) + '</span></label>' +
      '<div class="tl-thumbs" data-current="' + esc(opts.current || '') + '" data-current-label="' + esc(opts.currentLabel || 'Current file') + '" data-doc-type="' + esc(opts.docType || '') + '"></div>' +
      '<div class="invalid-feedback"></div></div>';
  }
  function setFiles(input, files) {
    try {
      var dt = new DataTransfer();
      files.forEach(function (f) { dt.items.add(f); });
      input.files = dt.files;
    } catch (e) { /* very old browsers: drag & drop not supported, click still works */ }
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function renderUploadThumbs(wrap) {
    var input = wrap.querySelector('.tl-dropzone-input'), box = wrap.querySelector('.tl-thumbs');
    var files = input.files ? Array.prototype.slice.call(input.files) : [];
    if (!files.length) {
      var cur = box.getAttribute('data-current');
      box.innerHTML = cur ? fileThumb(cur, cur, box.getAttribute('data-doc-type'), esc(box.getAttribute('data-current-label'))) : '';
      hydrateThumbs(box);
      return;
    }
    box.innerHTML = files.map(function (f, i) {
      var bad = checkFile({ files: [f] }, false);
      return '<div class="tl-thumb-item"><button type="button" class="tl-thumb" data-preview="' + i + '" aria-label="Preview ' + esc(f.name) + '">' + thumbFace(f.name) + '</button>' +
        '<div class="tl-thumb-cap"><span class="text-break fw-semibold">' + esc(f.name) + '</span><div class="' + (bad ? 'text-danger' : 'text-muted') + '">' + (bad ? esc(bad) : (f.size / 1024).toFixed(1) + ' KB &bull; <span class="text-success">ready to upload</span>') + '</div>' +
        '<button type="button" class="btn btn-link btn-sm text-danger p-0 tl-thumb-remove" data-remove="' + i + '"><i class="bi bi-x-circle me-1" aria-hidden="true"></i>Remove</button></div></div>';
    }).join('');
    files.forEach(function (f, i) { if (/^image\//.test(f.type) || isPdfName(f.name)) fillThumb(box.querySelector('[data-preview="' + i + '"]'), f); });
    box.querySelectorAll('[data-preview]').forEach(function (b) { b.addEventListener('click', function () { openDoc({ file: files[+b.getAttribute('data-preview')], docType: box.getAttribute('data-doc-type') || 'Selected file' }); }); });
    box.querySelectorAll('[data-remove]').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = +b.getAttribute('data-remove');
        setFiles(input, files.filter(function (_, j) { return j !== k; }));
        input.focus();
      });
    });
  }
  // Wire every upload box inside scope. Call after rendering the markup from dropzone().
  function bindDropzones(scope) {
    (scope || document).querySelectorAll('[data-dropzone]:not([data-bound])').forEach(function (wrap) {
      wrap.setAttribute('data-bound', '1');
      var input = wrap.querySelector('.tl-dropzone-input'), zone = wrap.querySelector('.tl-dropzone');
      input.addEventListener('change', function () {
        if (input.classList.contains('is-invalid')) fieldError(input, '');
        renderUploadThumbs(wrap);
      });
      ['dragenter', 'dragover'].forEach(function (ev) { zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add('dragover'); }); });
      ['dragleave', 'dragend'].forEach(function (ev) { zone.addEventListener(ev, function () { zone.classList.remove('dragover'); }); });
      zone.addEventListener('drop', function (e) {
        e.preventDefault();
        zone.classList.remove('dragover');
        var dropped = Array.prototype.slice.call(e.dataTransfer.files || []);
        if (!dropped.length) return;
        var keep = input.multiple ? Array.prototype.slice.call(input.files || []).concat(dropped) : dropped.slice(0, 1);
        setFiles(input, keep);
      });
      renderUploadThumbs(wrap);
    });
  }
  // Any [data-tl-doc] link or thumbnail opens the viewer in the same page; new thumbnails fill themselves.
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-tl-doc]');
    if (!t || e.ctrlKey || e.metaKey || e.shiftKey || !global.bootstrap) return;
    e.preventDefault();
    openDoc({ name: t.getAttribute('data-tl-doc'), docType: t.getAttribute('data-doc-type') });
  });
  if (global.MutationObserver) {
    new MutationObserver(function () { hydrateThumbs(document); }).observe(document.documentElement, { childList: true, subtree: true });
  }
  function downloadCsv(filename, rows) {
    var csv = rows.map(function (r) {
      return r.map(function (c) { var v = String(c == null ? '' : c); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(',');
    }).join('\r\n');
    var blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  // Scannable QR (qrcode-generator from jsdelivr); falls back to the reference text.
  function renderQr(el, text) {
    if (!el) return;
    if (global.qrcode) {
      var q = global.qrcode(0, 'M');
      q.addData(text);
      q.make();
      el.innerHTML = q.createSvgTag({ cellSize: 3, margin: 2, scalable: true });
      var svg = el.querySelector('svg');
      if (svg) { svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'QR code to verify this licence'); }
    } else {
      el.innerHTML = '<div class="small text-muted border rounded p-2">QR unavailable offline<br>' + esc(text) + '</div>';
    }
  }
  function verifyUrl(ref) {
    var base = location.href.replace(/[^/]*$/, '');
    return base + 'verify.html?ref=' + encodeURIComponent(ref);
  }
  // Shared table card with desktop table + mobile cards (guardrail 1.5).
  function tableCard(id, title, subtitle, cols, rows, cards, emptyText, headerExtra) {
    var empty = '<tr><td colspan="' + cols.length + '" class="text-center text-muted py-4">' + emptyText + '</td></tr>';
    return '<div class="card border-0 shadow-xs mb-4" id="' + id + '"><div class="card-header bg-white d-flex justify-content-between align-items-start flex-wrap gap-2"><div><h2 class="h6 fw-bold mb-0">' + title + '</h2>' + (subtitle ? '<div class="small text-muted">' + subtitle + '</div>' : '') + '</div>' + (headerExtra || '') + '</div>' +
      '<div class="gov-table-desktop table-responsive"><table class="table gov-table-compact table-hover mb-0"><caption class="visually-hidden">' + title + '</caption><thead><tr>' +
      cols.map(function (c) { return '<th scope="col"' + (c.end ? ' class="text-end"' : '') + (c.w ? ' style="width:' + c.w + '"' : '') + '>' + c.t + '</th>'; }).join('') +
      '</tr></thead><tbody>' + (rows || empty) + '</tbody></table></div><div class="gov-cards-mobile p-3">' + (cards || '<p class="text-center text-muted small mb-0">' + emptyText + '</p>') + '</div></div>';
  }
  function mobileCard(top, pillHtml, lines, action) {
    return '<div class="gov-mobile-app-card"><div class="d-flex justify-content-between align-items-start gap-2 mb-1">' + top + pillHtml + '</div>' + lines + (action ? '<div class="d-flex justify-content-end mt-2">' + action + '</div>' : '') + '</div>';
  }
  // Generic remarks / form modal. fields: html; onOk(modalEl) returns false to keep open.
  // opts.scroll === false: the whole popup scrolls with the page, so Cancel / Save sit after the last field
  // (used for long forms, where a fixed footer let officers save before seeing the rest of the form).
  function modal(opts) {
    var id = 'tlModal';
    var old = document.getElementById(id);
    if (old) { var inst = global.bootstrap && bootstrap.Modal.getInstance(old); if (inst) inst.dispose(); old.remove(); }
    var el = document.createElement('div');
    el.className = 'modal fade'; el.id = id; el.tabIndex = -1;
    el.setAttribute('aria-labelledby', id + 'Label'); el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="modal-dialog' + (opts.scroll === false ? '' : ' modal-dialog-centered modal-dialog-scrollable') + (opts.size ? ' modal-' + opts.size : '') + '"><form class="modal-content" novalidate>' +
      '<div class="modal-header"><h2 class="modal-title h6 fw-bold" id="' + id + 'Label">' + opts.title + '</h2><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
      '<div class="modal-body small">' + opts.body + '</div>' +
      '<div class="modal-footer' + (opts.footerNote ? ' justify-content-between' : '') + '">' + (opts.footerNote ? '<span class="small text-muted me-auto">' + opts.footerNote + '</span>' : '') +
        '<div class="d-flex gap-2"><button type="button" class="btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>' + (opts.ok ? '<button type="submit" class="btn btn-sm ' + (opts.okClass || 'btn-primary') + '"' + (opts.okDisabled ? ' disabled' : '') + '>' + opts.ok + '</button>' : '') + '</div></div></form></div>';
    document.body.appendChild(el);
    var m = new bootstrap.Modal(el);
    el.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (opts.onOk(el) !== false) m.hide();
    });
    el.addEventListener('hidden.bs.modal', function () { m.dispose(); el.remove(); });
    if (opts.onShow) opts.onShow(el);
    m.show();
    return el;
  }

  // ---------------- Dashboard building blocks (simple: greeting, next step, navigation tiles) ----------------
  function greeting(name) {
    var h = new Date().getHours();
    return (h < 12 ? 'Good morning' : (h < 17 ? 'Good afternoon' : 'Good evening')) + ', ' + String(name || '').split(' ')[0];
  }
  // opts: { id, eyebrow, title, summary, action, chips: [[icon, text]] }
  function dashHero(opts) {
    return '<section class="tl-dash-hero mb-4" aria-labelledby="' + opts.id + '"><div class="min-w-0">' +
      (opts.eyebrow ? '<div class="tl-dash-eyebrow">' + opts.eyebrow + '</div>' : '') +
      '<h1 class="tl-dash-title" id="' + opts.id + '">' + esc(opts.title) + '</h1><p class="tl-dash-summary mb-0">' + opts.summary + '</p>' +
      (opts.chips && opts.chips.length ? '<div class="tl-dash-chips">' + opts.chips.map(function (c) { return '<span class="tl-dash-chip"><i class="bi ' + c[0] + '" aria-hidden="true"></i>' + c[1] + '</span>'; }).join('') + '</div>' : '') +
      '</div>' + (opts.action ? '<div class="tl-dash-hero-action">' + opts.action + '</div>' : '') + '</section>';
  }
  // Large navigation tile. count: number or '' (hidden). attrs: extra attributes for the link.
  function dashTile(icon, tone, title, sub, href, count, attrs) {
    var hasCount = count !== '' && count != null;
    return '<div class="col-md-6"><a class="tl-tile" href="' + href + '"' + (attrs || '') + '>' +
      '<span class="tl-tile-icon bg-' + tone + '-subtle text-' + tone + '-emphasis"><i class="bi ' + icon + '" aria-hidden="true"></i></span>' +
      '<span class="tl-tile-body"><span class="tl-tile-title">' + title + '</span><span class="tl-tile-sub">' + sub + '</span></span>' +
      (hasCount ? '<span class="tl-tile-count' + (+count ? ' is-active' : '') + '" aria-label="' + count + ' items">' + count + '</span>' : '') +
      '<i class="bi bi-chevron-right tl-tile-arrow" aria-hidden="true"></i></a></div>';
  }
  // The single most important item. item: { label, title, meta, pillHtml, href, button } or null.
  function dashNext(item, emptyText) {
    if (!item) return '<div class="tl-next tl-next-empty mb-4"><span class="tl-tile-icon bg-success-subtle text-success-emphasis"><i class="bi bi-check2-all" aria-hidden="true"></i></span>' +
      '<div><div class="tl-tile-title">You are all caught up</div><div class="tl-tile-sub">' + emptyText + '</div></div></div>';
    return '<div class="tl-next mb-4"><div class="min-w-0"><div class="tl-next-label">' + item.label + '</div><div class="tl-next-title text-truncate">' + item.title + '</div>' +
      '<div class="tl-next-meta">' + item.pillHtml + '<span>' + item.meta + '</span></div></div>' +
      '<a class="btn btn-sm btn-primary" href="' + item.href + '">' + item.button + '<i class="bi bi-arrow-right ms-1" aria-hidden="true"></i></a></div>';
  }
  function sectionTitle(text) { return '<h2 class="tl-dash-section">' + text + '</h2>'; }

  // ---------------- Accessibility toolbar ----------------
  function initAccessibility() {
    var html = document.documentElement, body = document.body;
    var buttons = document.querySelectorAll('[data-font-action]');
    var size = 'normal';
    try { size = localStorage.getItem('gov_font_size') || 'normal'; } catch (e) { /* ignore */ }
    html.setAttribute('data-font-size', size);
    var map = { decrease: 'small', reset: 'normal', increase: 'large' };
    buttons.forEach(function (btn) {
      var action = btn.getAttribute('data-font-action');
      btn.classList.toggle('active', map[action] === size);
      btn.addEventListener('click', function () {
        html.setAttribute('data-font-size', map[action]);
        try { localStorage.setItem('gov_font_size', map[action]); } catch (e) { /* ignore */ }
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
      });
    });
    var hc = document.getElementById('btn-contrast-toggle');
    var hcOn = false;
    try { hcOn = localStorage.getItem('gov_contrast') === 'high'; } catch (e) { /* ignore */ }
    function applyHc(on) {
      html.classList.toggle('high-contrast', on);
      body.classList.toggle('high-contrast', on);
      if (on) body.setAttribute('data-contrast', 'high'); else body.removeAttribute('data-contrast');
      if (hc) hc.setAttribute('aria-pressed', String(on));
    }
    applyHc(hcOn);
    if (hc) hc.addEventListener('click', function () {
      hcOn = !hcOn;
      applyHc(hcOn);
      try { localStorage.setItem('gov_contrast', hcOn ? 'high' : 'normal'); } catch (e) { /* ignore */ }
    });
  }

  // ---------------- Sidebar drawer (< 992px) ----------------
  function initSidebar() {
    var sidebar = document.getElementById('sidebar-nav');
    var backdrop = document.getElementById('sidebar-backdrop');
    var toggle = document.getElementById('gov-sidebar-toggle');
    var close = document.getElementById('sidebar-close-btn');
    if (!sidebar) return;
    function set(open) {
      sidebar.classList.toggle('is-open', open);
      if (backdrop) backdrop.classList.toggle('is-open', open);
      if (toggle) toggle.setAttribute('aria-expanded', String(open));
    }
    if (toggle) toggle.addEventListener('click', function () { set(!sidebar.classList.contains('is-open')); });
    if (close) close.addEventListener('click', function () { set(false); });
    if (backdrop) backdrop.addEventListener('click', function () { set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
    sidebar.addEventListener('click', function (e) { if (e.target.closest('a') && window.innerWidth < 992) set(false); });
  }

  // ---------------- In-page view switching (applicant dashboard) ----------------
  function initViews(onShow) {
    var links = document.querySelectorAll('[data-view]');
    function show(view) {
      var target = document.getElementById('view-' + view);
      if (!target) return;
      document.querySelectorAll('.tl-view').forEach(function (v) { v.classList.toggle('d-none', v !== target); });
      links.forEach(function (l) {
        var on = l.getAttribute('data-view') === view;
        l.classList.toggle('active', on);
        if (on) l.setAttribute('aria-current', 'page'); else l.removeAttribute('aria-current');
      });
      if (onShow) onShow(view);
      var main = document.getElementById('main-content');
      if (main) main.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
    links.forEach(function (l) {
      l.addEventListener('click', function (e) {
        e.preventDefault();
        var v = l.getAttribute('data-view');
        history.replaceState(null, '', '#' + v);
        show(v);
      });
    });
    var initial = (location.hash || '').replace('#', '');
    show(document.getElementById('view-' + initial) ? initial : 'dashboard');
    return show;
  }

  // ---------------- Common workspace shell ----------------
  var ROLE_TITLES = { inspector: 'Inspector', bo: 'BO', jd: 'Joint Director / Director', ss: 'Special Secretary', hod: 'Issuing Authority', admin: 'Admin' };
  var STAFF_MENU = [
    ['Overview', [{ key: 'dash', icon: 'bi-speedometer2', label: 'Dashboard', href: 'dashboard-staff.html' }]],
    ['Applications', [
      { key: 'mine', icon: 'bi-inbox', label: 'My Work Queue', href: 'applications.html?view=mine', badge: 'mine', roles: ['inspector', 'bo', 'jd', 'ss', 'hod'] },
      { key: 'br', icon: 'bi-receipt', label: 'BR Verification', href: 'applications.html?view=br', badge: 'br', roles: ['inspector', 'bo'] },
      { key: 'all', icon: 'bi-list-ul', label: 'All Applications', href: 'applications.html?view=all' }
    ]],
    ['Licences', [{ key: 'licences', icon: 'bi-patch-check', label: 'Licence Register', href: 'licences.html' }]],
    ['Monitoring', [
      { key: 'reports', icon: 'bi-bar-chart-line', label: 'Reports', href: 'reports.html' },
      { key: 'audit', icon: 'bi-journal-text', label: 'Audit Log', href: 'reports.html#audit' }
    ]],
    ['Settings', [{ key: 'items', icon: 'bi-diagram-3', label: 'Items Master', href: 'items-master.html' }, { key: 'docs', icon: 'bi-file-earmark-check', label: 'Document Types', href: 'documents-master.html' }, { key: 'fees', icon: 'bi-currency-rupee', label: 'Renewal Amounts', href: 'fee-master.html' }]]
  ];
  var APPLICANT_MENU = [
    { key: 'dashboard', icon: 'bi-speedometer2', label: 'Dashboard', href: 'dashboard.html#dashboard', view: 'dashboard' },
    { key: 'apply', icon: 'bi-plus-circle-fill text-success', label: 'Apply for New Licence', href: 'apply.html?type=new', cls: 'text-success fw-semibold' },
    { key: 'applications', icon: 'bi-folder2-open', label: 'My Applications', href: 'dashboard.html#applications', view: 'applications', badge: 'apps' },
    { key: 'licences', icon: 'bi-patch-check', label: 'My Licences', href: 'dashboard.html#licences', view: 'licences', badge: 'lics' },
    { key: 'notifications', icon: 'bi-bell-fill text-warning', label: 'Notifications', href: 'dashboard.html#notifications', view: 'notifications', badge: 'notifs' },
    { key: 'support', icon: 'bi-headset', label: 'Help and Support', href: 'dashboard.html#support', view: 'support' },
    { sep: true },
    { key: 'profile', icon: 'bi-person-badge', label: 'My Account', href: 'dashboard.html#profile', view: 'profile' }
  ];
  // Counts for the staff sidebar badges.
  function staffCounts(userId) {
    var F = global.TLFlow;
    var mine = 0, br = 0;
    data.applications.forEach(function (a) {
      if (!F.canAct(a, userId)) return;
      if (a.status === F.ST.BR_UPLOADED) br++; else mine++;
    });
    return { mine: mine, br: br };
  }

  function toolbarHtml() {
    return '<div class="btn-group btn-group-sm" role="group" aria-label="Text Size Controls">' +
      '<button type="button" class="btn btn-outline-gov-light" data-font-action="decrease" aria-label="Decrease text size">A-</button>' +
      '<button type="button" class="btn btn-outline-gov-light" data-font-action="reset" aria-label="Reset text size">A</button>' +
      '<button type="button" class="btn btn-outline-gov-light" data-font-action="increase" aria-label="Increase text size">A+</button></div>' +
      '<button type="button" class="btn btn-outline-gov-light btn-sm" id="btn-contrast-toggle" aria-pressed="false" aria-label="Toggle High Contrast Mode" title="Toggle High Contrast Mode"><i class="fas fa-adjust" aria-hidden="true"></i></button>';
  }

  // opts: { type: 'applicant'|'staff', active: menu key }
  function shell(opts) {
    var session = getSession();
    var main = document.getElementById('main-content');
    var isStaff = opts.type === 'staff';
    var onDashboard = /dashboard\.html$/.test(location.pathname);

    // Demo bar
    var picker;
    if (isStaff) {
      picker = '<label for="roleSelector" class="fw-semibold text-white mb-0">Prototype Demo &ndash; Officer:</label>' +
        '<select id="roleSelector" class="form-select form-select-sm py-1 border-0 fw-semibold">' +
        Object.keys(data.staff).map(function (k) {
          var u = data.staff[k];
          return '<option value="' + k + '"' + (k === session.userId ? ' selected' : '') + '>' + esc(u.designation) + ' &ndash; ' + esc(u.name) + '</option>';
        }).join('') + '</select>';
    } else {
      var keys = Object.keys(data.businesses).filter(function (k) { return data.businesses[k].scenario; });
      picker = '<label for="scenarioSelector" class="fw-semibold text-white mb-0">Prototype Demo &ndash; Select Applicant Scenario:</label>' +
        '<select id="scenarioSelector" class="form-select form-select-sm py-1 border-0 fw-semibold">' +
        keys.map(function (k, i) {
          var b = data.businesses[k];
          return '<option value="' + k + '"' + (k === session.scenario ? ' selected' : '') + '>' + String.fromCharCode(65 + i) + ': ' + esc(b.label) + ' (' + esc(b.authName) + ')</option>';
        }).join('') + '</select>';
    }
    var top = document.createElement('div');
    top.innerHTML =
      '<a class="gov-skip-link" href="#main-content">Skip to Main Content</a>' +
      '<a class="gov-skip-link" href="#sidebar-nav">Skip to Navigation Menu</a>' +
      '<div class="gov-flag-stripe" aria-hidden="true"></div>' +
      '<aside class="tl-demo-bar" aria-label="Prototype controls"><div class="container-fluid px-lg-4"><div class="d-flex align-items-center justify-content-between flex-wrap gap-2">' +
        '<div class="d-flex align-items-center gap-2 flex-wrap"><span class="badge bg-warning text-dark fw-bold px-2 py-1"><i class="bi bi-flask me-1" aria-hidden="true"></i>PROTOTYPE</span>' + picker +
        '<a href="index.html#login" class="btn btn-sm btn-outline-warning py-0 px-2 fw-semibold" data-logout><i class="bi bi-people-fill me-1" aria-hidden="true"></i>Switch Role</a>' +
        '<button type="button" class="btn btn-sm btn-outline-light py-0 px-2" id="btnResetDemo" title="Restore the original demonstration data"><i class="bi bi-arrow-counterclockwise me-1" aria-hidden="true"></i>Reset demo data</button></div>' +
        '<div class="d-flex align-items-center gap-2"><span class="small text-white-50 d-none d-md-inline"><i class="bi bi-calendar3 me-1" aria-hidden="true"></i>Demo date: <strong class="text-white">' + fmtDate(data.demoToday) + '</strong></span>' + toolbarHtml() + '</div>' +
      '</div></div></aside>';

    // Header
    var userName, userSub, roleBadge = '';
    if (isStaff) {
      var u = me(session);
      userName = u.name + ' (demo)';
      userSub = u.designation + ' &bull; ' + circle(u.circle).name;
      roleBadge = '<span class="badge bg-primary-subtle text-primary border border-primary-subtle d-none d-xl-inline-flex">' + esc(ROLE_TITLES[u.role]) + '</span>';
    } else {
      var b = currentBusiness(session);
      userName = b.authName;
      userSub = 'Sikkim GO user &bull; Mobile ' + maskMobile(b.mobile);
    }
    top.innerHTML +=
      '<header class="tl-workspace-header py-2" role="banner"><div class="container-fluid px-lg-4"><div class="d-flex align-items-center justify-content-between gap-2">' +
        '<div class="d-flex align-items-center gap-2 gap-sm-3 min-w-0">' +
          '<button class="btn btn-sm btn-outline-secondary d-lg-none" id="gov-sidebar-toggle" type="button" aria-controls="sidebar-nav" aria-expanded="false" aria-label="Open menu"><i class="bi bi-list" aria-hidden="true"></i></button>' +
          '<a href="index.html" title="e-Trade Licence home"><img src="../../common/assets/images/sikkim-government-logo-dark.png" alt="Official Emblem of the Government of Sikkim" class="gov-emblem"></a>' +
          '<div class="min-w-0"><div class="gov-header-dept-eyebrow" style="font-size:0.75rem;">Urban Development Department</div>' +
          '<div class="h6 fw-bold mb-0 text-dark text-truncate">e-Trade Licence &ndash; ' + (isStaff ? 'Department' : 'Applicant') + ' Workspace</div></div>' +
        '</div>' +
        '<div class="d-flex align-items-center gap-2 min-w-0 tl-header-user"><div class="text-end d-none d-sm-block min-w-0"><div class="fw-bold text-dark small text-truncate">' + esc(userName) + '</div><div class="text-muted text-truncate" style="font-size:0.75rem;">' + userSub + '</div></div>' + roleBadge +
          '<a href="index.html#login" class="btn btn-sm btn-outline-danger" data-logout title="Logout"><i class="bi bi-box-arrow-left" aria-hidden="true"></i><span class="d-none d-md-inline ms-1">Logout</span></a></div>' +
      '</div></div></header>';
    var frag = document.createDocumentFragment();
    while (top.firstChild) frag.appendChild(top.firstChild);
    document.body.insertBefore(frag, document.body.firstChild);

    // Sidebar
    var menu = '';
    if (isStaff) {
      var su = me(session);
      var counts = staffCounts(session.userId);
      STAFF_MENU.forEach(function (g) {
        var items = g[1].filter(function (m) { return !m.roles || m.roles.indexOf(su.role) !== -1; });
        if (!items.length) return;
        menu += '<li class="tl-sidebar-section">' + esc(g[0]) + '</li>';
        items.forEach(function (m) {
          var badge = m.badge && counts[m.badge] ? '<span class="badge bg-warning text-dark">' + counts[m.badge] + '</span>' : '';
          var label = (m.key === 'fees' || m.key === 'items' || m.key === 'docs') && su.role !== 'admin' ? m.label + ' (view)' : m.label;
          menu += '<li><a href="' + m.href + '" class="gov-sidebar-link' + (m.key === opts.active ? ' active" aria-current="page' : '') + '"><i class="bi ' + m.icon + '" aria-hidden="true"></i><span>' + esc(label) + '</span>' + badge + '</a></li>';
        });
      });
    } else {
      var bz = currentBusiness(session);
      var bApps = appsOf(session.scenario);
      var cCounts = {
        apps: bApps.filter(function (a) { return a.status !== 'Licence Issued'; }).length,
        lics: licencesOf(session.scenario).length,
        notifs: bz.notifications.filter(function (n) { return n.unread; }).length
      };
      APPLICANT_MENU.forEach(function (m) {
        if (m.sep) { menu += '<li class="my-2 border-top"></li>'; return; }
        var badge = m.badge && cCounts[m.badge] ? '<span class="badge ' + (m.badge === 'notifs' ? 'bg-danger' : 'bg-secondary') + '">' + cCounts[m.badge] + '</span>' : '';
        var viewAttr = onDashboard && m.view ? ' data-view="' + m.view + '"' : '';
        menu += '<li><a href="' + m.href + '"' + viewAttr + ' class="gov-sidebar-link ' + (m.cls || '') + (m.key === opts.active ? ' active" aria-current="page' : '') + '"><i class="bi ' + m.icon + '" aria-hidden="true"></i><span>' + esc(m.label) + '</span>' + badge + '</a></li>';
      });
    }
    menu += '<li class="my-2 border-top"></li><li><a href="index.html#login" class="gov-sidebar-link text-danger" data-logout><i class="bi bi-box-arrow-left text-danger" aria-hidden="true"></i><span>Switch Role / Logout</span></a></li>';

    var footInfo;
    if (isStaff) {
      var c = circle(me(session).circle);
      footInfo = '<div class="fw-bold text-dark"><i class="bi bi-geo-alt me-1 text-primary" aria-hidden="true"></i>' + esc(c.name) + '</div><div class="text-muted" style="font-size:0.75rem;">' + esc(c.office) + '</div>';
    } else {
      footInfo = '<div class="fw-bold text-dark"><i class="bi bi-building me-1 text-primary" aria-hidden="true"></i>Department Support</div><div class="text-muted" style="font-size:0.75rem;">Helpline pending departmental confirmation</div>';
    }

    var layout = document.createElement('div');
    layout.className = 'gov-workspace-layout flex-grow-1';
    layout.innerHTML = '<div class="tl-sidebar-backdrop" id="sidebar-backdrop"></div>' +
      '<aside class="gov-sidebar tl-sidebar" id="sidebar-nav" aria-label="' + (isStaff ? 'Department' : 'Applicant') + ' menu">' +
        '<div class="d-flex d-lg-none justify-content-between align-items-center px-2 pb-2 mb-2 border-bottom"><span class="fw-bold small text-muted">MENU</span><button type="button" class="btn-close" id="sidebar-close-btn" aria-label="Close menu"></button></div>' +
        '<nav aria-label="Workspace menu"><ul class="gov-sidebar-nav">' + menu + '</ul></nav>' +
        '<div class="mt-auto pt-3 px-2 small border-top">' + footInfo + '</div></aside>';
    main.parentNode.insertBefore(layout, main);
    layout.appendChild(main);
    main.classList.add('gov-workspace-content', 'p-3', 'p-lg-4');
    main.setAttribute('tabindex', '-1');

    var footer = document.createElement('footer');
    footer.className = 'gov-footer py-3';
    footer.setAttribute('role', 'contentinfo');
    footer.innerHTML = '<div class="container-fluid px-lg-4"><div class="d-flex justify-content-between flex-wrap gap-2 small text-white-50"><span>&copy; 2026 Government of Sikkim &bull; Urban Development Department</span><span>Designed &amp; hosted by DITEC / NIC &bull; GIGW 3.0 &amp; WCAG 2.1 AA</span></div></div>';
    layout.insertAdjacentElement('afterend', footer);
    document.body.classList.add('d-flex', 'flex-column', 'min-vh-100');

    // Wiring
    document.querySelectorAll('[data-logout]').forEach(function (a) { a.addEventListener('click', logout); });
    // Sidebar links to this same page with another ?view / #tab must re-render it.
    layout.querySelectorAll('.tl-sidebar a:not([data-view]):not([data-logout])').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var url = new URL(a.getAttribute('href'), location.href);
        if (url.pathname === location.pathname && (url.search !== location.search || url.hash !== location.hash)) {
          e.preventDefault();
          location.href = url.href;
          if (url.search === location.search) location.reload();
        }
      });
    });
    document.getElementById('btnResetDemo').addEventListener('click', function () {
      if (window.confirm('Restore the original demonstration data? Applications, payments and licences created during this demo will be removed.')) resetDemo();
    });
    var rs = document.getElementById('roleSelector');
    if (rs) rs.addEventListener('change', function () {
      setSession({ type: 'staff', userId: rs.value, loggedInAt: session.loggedInAt });
      window.location.href = 'dashboard-staff.html';
    });
    var ss = document.getElementById('scenarioSelector');
    if (ss) ss.addEventListener('change', function () {
      setSession({ type: 'applicant', scenario: ss.value, loggedInAt: session.loggedInAt });
      window.location.href = 'dashboard.html';
    });
    initAccessibility();
    initSidebar();
  }

  global.TLApp = {
    get data() { return data; },
    save: save, resetDemo: resetDemo,
    getSession: getSession, setSession: setSession, logout: logout, requireSession: requireSession, me: me, actor: actor, ROLE_TITLES: ROLE_TITLES,
    business: business, currentBusiness: currentBusiness,
    inr: inr, amountWords: amountWords, fmtDate: fmtDate, fmtStamp: fmtStamp, esc: esc, maskMobile: maskMobile, stamp: stamp, qs: qs,
    app: app, licence: licence, circle: circle, category: category, appsOf: appsOf, licencesOf: licencesOf, appName: appName,
    audit: audit, notify: notify, pill: pill, kindBadge: kindBadge,
    toast: toast, checkFile: checkFile, fieldError: fieldError, addAttachments: addAttachments, attachmentFor: attachmentFor, fileLink: fileLink, fileThumb: fileThumb, openDoc: openDoc, docSample: docSample, fileView: fileView, previewInto: previewInto, dropzone: dropzone, bindDropzones: bindDropzones, hydrateThumbs: hydrateThumbs, getFile: getFile, filesReady: filesReady,
    greeting: greeting, dashHero: dashHero, dashTile: dashTile, dashNext: dashNext, sectionTitle: sectionTitle,
    downloadCsv: downloadCsv, renderQr: renderQr, verifyUrl: verifyUrl, tableCard: tableCard, mobileCard: mobileCard, modal: modal,
    initAccessibility: initAccessibility, initSidebar: initSidebar, initViews: initViews, shell: shell
  };
})(window);
