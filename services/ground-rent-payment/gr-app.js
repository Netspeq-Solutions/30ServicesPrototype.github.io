/* ==========================================================================
   Online Ground Rent Payment System – shared page helpers
   - Prototype session (no real authentication)
   - Demo data store: the seed in mock-data.js is copied into localStorage on
     first use so payments, challans and staff changes persist between pages.
     "Reset demo data" restores the seed.
   - Common shell (demo bar, header, sidebar, footer) for workspace pages
   ========================================================================== */
(function (global) {
  'use strict';

  var SESSION_KEY = 'gr_demo_session';
  var STATE_KEY = 'gr_demo_state_v7';
  var FILE_DB = 'gr_demo_files';
  var SEED = global.GR_DATA;

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
    // Uploaded files live in IndexedDB; clear them too, then reload.
    var done = false;
    function reload() { if (!done) { done = true; window.location.reload(); } }
    try {
      var req = indexedDB.deleteDatabase(FILE_DB);
      req.onsuccess = req.onerror = req.onblocked = reload;
      setTimeout(reload, 1500);
    } catch (e) { reload(); }
  }

  // ---------------- Uploaded files (prototype) ----------------
  // The file itself is kept in this browser's IndexedDB so staff and citizens can open it again.
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
  // Wait for uploads to finish storing before leaving the page.
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

  // ---------------- Formatting ----------------
  function inr(n) { return '₹' + Math.round(Number(n) || 0).toLocaleString('en-IN'); }
  function sqft(n) { return (Math.round(Number(n) * 100) / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 }) + ' sq ft'; }
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmtDate(isoStr) {
    if (!isoStr) return '—';
    var p = String(isoStr).slice(0, 10).split('-');
    return parseInt(p[2], 10) + ' ' + MONTHS[parseInt(p[1], 10) - 1] + ' ' + p[0];
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function maskMobile(m) { return m ? 'XXXXXX' + String(m).slice(-4) : 'Not recorded'; }
  function nowTime() {
    var d = new Date();
    return (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  }
  function stamp() { return data.demoToday + ' ' + nowTime(); }
  function qs(name) { return new URLSearchParams(location.search).get(name); }
  // Normalise names for search: ignore case, dots and extra spaces ("M.D. Ibrahim" = "md ibrahim").
  function norm(s) { return String(s || '').toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ').trim(); }

  // ---------------- Data helpers ----------------
  function site(grId) { return data.sites.filter(function (s) { return s.grId === grId; })[0] || null; }
  function ulb(code) { return data.config.ulbs.filter(function (u) { return u.code === code; })[0] || null; }
  function ward(ulbCode, wardCode) {
    return data.config.wards.filter(function (w) { return w.ulb === ulbCode && w.code === wardCode; })[0] || null;
  }
  // ULB → Wards → Localities. Inactive wards are left out unless asked for.
  function wardsOf(ulbCode, includeInactive) {
    return data.config.wards.filter(function (w) { return (!ulbCode || w.ulb === ulbCode) && (includeInactive || w.active !== false); });
  }
  function localitiesOf(ulbCode, wardCode) {
    var list = [];
    wardsOf(ulbCode, true).forEach(function (w) {
      if (wardCode && w.code !== wardCode) return;
      (w.localities || []).forEach(function (l) { if (list.indexOf(l) === -1) list.push(l); });
    });
    return list;
  }
  function wardName(ulbCode, wardCode) { var w = ward(ulbCode, wardCode); return w ? w.name : wardCode; }

  // Cascading search filters: District → ULB → Ward → Locality.
  // ids: { district, ulb, ward, locality } (any may be left out).
  // opts: lockUlb (staff's own ULB, shown but fixed), onlyLive (others listed but disabled), onChange.
  function cascadeFilters(ids, opts) {
    opts = opts || {};
    var el = function (k) { return ids[k] ? document.getElementById(ids[k]) : null; };
    var dEl = el('district'), uEl = el('ulb'), wEl = el('ward'), lEl = el('locality');
    var lock = opts.lockUlb ? ulb(opts.lockUlb) : null;
    function options(all, list) { return '<option value="">' + all + '</option>' + list.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (o[2] ? ' disabled' : '') + '>' + esc(o[1]) + '</option>'; }).join(''); }
    function fillDistricts() {
      if (!dEl) return;
      dEl.innerHTML = options('All districts', data.config.districts.map(function (d) { return [d, d]; }));
      if (lock) { dEl.value = lock.district; dEl.disabled = true; }
    }
    function fillUlbs() {
      if (!uEl) return;
      var list = data.config.ulbs.filter(function (u) { return !dEl || !dEl.value || u.district === dEl.value; });
      uEl.innerHTML = options('All ULBs', list.map(function (u) { var off = opts.onlyLive && !u.active; return [u.code, u.name + (off ? ' (not online yet)' : ''), off]; }));
      if (lock) { uEl.value = lock.code; uEl.disabled = true; }
    }
    function fillWards() {
      if (!wEl) return;
      wEl.innerHTML = options('All wards', uEl && uEl.value ? wardsOf(uEl.value, true).map(function (w) { return [w.code, w.name + (w.active === false ? ' (inactive)' : '')]; }) : []);
      wEl.disabled = !(uEl && uEl.value);
    }
    function fillLocalities() {
      if (!lEl) return;
      var locs = uEl && uEl.value ? localitiesOf(uEl.value, wEl ? wEl.value : null) : [];
      lEl.innerHTML = options('All localities', locs.map(function (l) { return [l, l]; }));
      lEl.disabled = !locs.length;
    }
    function changed() { if (opts.onChange) opts.onChange(); }
    if (dEl) dEl.addEventListener('change', function () { fillUlbs(); fillWards(); fillLocalities(); changed(); });
    if (uEl) uEl.addEventListener('change', function () { fillWards(); fillLocalities(); changed(); });
    if (wEl) wEl.addEventListener('change', function () { fillLocalities(); changed(); });
    if (lEl) lEl.addEventListener('change', changed);
    fillDistricts(); fillUlbs(); fillWards(); fillLocalities();
    return {
      // Does a site match the chosen district / ULB / ward / locality?
      match: function (s) {
        var u = ulb(s.ulb);
        if (dEl && dEl.value && (!u || u.district !== dEl.value)) return false;
        if (uEl && uEl.value && s.ulb !== uEl.value) return false;
        if (wEl && wEl.value && s.ward !== wEl.value) return false;
        if (lEl && lEl.value && s.locality !== lEl.value) return false;
        return true;
      }
    };
  }
  function dues(s, asOf) { return global.GRDues.computeDues(s, asOf || data.demoToday, data); }
  function ownersText(s) { return s.owners.map(function (o) { return o.name; }).join(' & '); }
  function ownersFull(s) {
    return s.owners.map(function (o) {
      return o.name + ' ' + o.relation + ' ' + o.guardian + (s.owners.length > 1 ? ' (' + o.share + '%)' : '');
    }).join('; ');
  }
  function totalArea(s) {
    var fy = global.GRDues.fyOfDate(data.demoToday);
    return global.GRDues.chargeableArea(s, fy);
  }
  function legacyRef(s) {
    var l = s.legacy || {};
    var parts = [];
    if (l.book) parts.push(l.book);
    if (l.page) parts.push('Page ' + l.page);
    if (l.slNo) parts.push('Sl. ' + l.slNo);
    return parts.length ? parts.join(', ') : 'Not recorded';
  }
  // A challan that is no longer needed (dues paid another way) is cancelled, never left "issued".
  function closeChallans(grId, reason, exceptNo) {
    var closed = 0;
    data.challans.forEach(function (c) {
      if (c.grId === grId && c.status === 'Generated' && c.challanNo !== exceptNo) {
        c.status = 'Cancelled'; c.cancelReason = reason; c.cancelledOn = data.demoToday;
        audit({ grId: grId, entity: 'Challan', action: 'Challan ' + c.challanNo + ' cancelled · ' + reason });
        closed++;
      }
    });
    return closed;
  }
  function challanFor(grId) {
    var c = data.challans.filter(function (x) { return x.grId === grId && (x.status === 'Generated' || x.status === 'BR Recorded'); })[0] || null;
    // Safety net: an unpaid-at-bank challan on a site with nothing left to pay is closed.
    if (c && c.status === 'Generated') {
      var s = site(grId);
      if (s && dues(s).totalPayable === 0) { closeChallans(grId, 'Dues already paid by another payment'); save(); return null; }
    }
    return c;
  }
  function citizenByMobile(m) {
    var k = Object.keys(data.citizens).filter(function (key) { return data.citizens[key].mobile === m; })[0];
    return k ? data.citizens[k] : null;
  }

  // My Ground Rent Accounts: sites matching the login mobile plus sites paid before.
  function citizenSites(citizen) {
    var saved = (citizen.savedSites || []).concat(data.savedSites[citizen.mobile] || []);
    return data.sites.filter(function (s) {
      if (s.status === 'Closed') return false;
      var match = s.owners.some(function (o) { return o.mobile && o.mobile === citizen.mobile; });
      return match || saved.indexOf(s.grId) !== -1;
    });
  }
  function saveSiteForCitizen(mobile, grId) {
    if (!mobile) return;
    data.savedSites[mobile] = data.savedSites[mobile] || [];
    if (data.savedSites[mobile].indexOf(grId) === -1) data.savedSites[mobile].push(grId);
  }

  // Current citizen identity from the session (unknown mobiles = first-time citizen).
  function currentCitizen(session) {
    var c = data.citizens[session.scenario] || data.citizens.scenarioA;
    if (session.mobile && session.mobile !== c.mobile) {
      c = citizenByMobile(session.mobile) || {
        label: 'Citizen', badge: '', name: 'Citizen ' + maskMobile(session.mobile), mobile: session.mobile, email: null,
        savedSites: [], notifications: data.otherNotifications[session.mobile] || []
      };
    }
    return c;
  }

  // ---------------- IDs, audit, notifications ----------------
  function nextId(prefix, list, field) {
    var max = 0;
    list.forEach(function (x) {
      var m = String(x[field] || '').match(/(\d+)$/);
      if (m && String(x[field]).indexOf(prefix) === 0) max = Math.max(max, parseInt(m[1], 10));
    });
    return prefix + String(max + 1).padStart(6, '0');
  }
  function newReceiptNo() { return nextId('GRR-2026-', data.payments, 'receiptNo'); }
  function newChallanNo() { return nextId('GRC-2026-', data.challans, 'challanNo'); }
  function newIntentNo() { return nextId('GRI-2026-', data.payments.concat(data.intents), 'intentNo'); }

  function audit(entry) {
    var s = getSession() || {};
    var role = s.type === 'staff' ? data.staffRoles[s.role] : null;
    data.auditLog.unshift(Object.assign({
      at: stamp(), user: role ? role.user : 'Citizen', role: role ? role.title : 'Citizen', ip: '10.0.0.' + (20 + Math.floor(Math.random() * 60))
    }, entry));
  }
  // SMS / email are stubs: logged to the outbox and shown as citizen notifications.
  function notify(mobile, title, body, grId) {
    var n = { title: title, body: body, grId: grId || null, date: data.demoToday, unread: true };
    var c = citizenByMobile(mobile);
    if (c) c.notifications.unshift(n);
    else if (mobile) { data.otherNotifications[mobile] = data.otherNotifications[mobile] || []; data.otherNotifications[mobile].unshift(n); }
    data.outbox.unshift({ at: stamp(), to: mobile ? maskMobile(mobile) : 'No mobile recorded', channel: 'SMS + email (simulated)', text: title + ' – ' + body });
  }
  function siteMobiles(s) { return s.owners.map(function (o) { return o.mobile; }).filter(Boolean); }

  // Offline challan validity: N days, never past 31 March (amount changes on 1 April).
  function challanValidTill(fromIso) {
    var T = global.GRDues;
    var d = T.toDate(fromIso);
    var till = new Date(d.getFullYear(), d.getMonth(), d.getDate() + data.config.settings.challanValidityDays);
    var fyEnd = new Date(T.fyOfDate(d) + 1, 2, 31);
    return T.iso(till > fyEnd ? fyEnd : till);
  }

  // ---------------- Role permissions (Section 4) ----------------
  var PERMS = {
    supervisor: ['viewAccounts', 'editAccounts', 'structures', 'transferSubmit', 'payments', 'reportsOwn', 'auditOwn'],
    deptAdmin: ['viewAccounts', 'editAccounts', 'structures', 'transferSubmit', 'transferApprove', 'payments', 'adjust', 'approve', 'reportsOwn', 'auditOwn', 'configView'],
    hq: ['viewAccounts', 'reportsAll', 'auditAll', 'configView'],
    sysAdmin: ['viewAccounts', 'editAccounts', 'structures', 'transferSubmit', 'transferApprove', 'payments', 'adjust', 'approve', 'reportsAll', 'auditAll', 'configView', 'configEdit', 'users']
  };
  function can(perm, session) {
    session = session || getSession();
    return !!(session && session.type === 'staff' && PERMS[session.role] && PERMS[session.role].indexOf(perm) !== -1);
  }
  function staffScope(session) {
    var r = data.staffRoles[session.role];
    return r && r.scope === 'ULB' ? session.ulb : null; // null = statewide
  }
  function inScope(s, session) { var u = staffScope(session); return !u || s.ulb === u; }
  // ULB-level roles work in the live ULB by default; it is not chosen or shown explicitly.
  function defaultUlb() { var u = data.config.ulbs.filter(function (x) { return x.active; })[0]; return u ? u.code : 'ALL'; }
  // Maker–checker: when on, Supervisor changes to transfers and structures wait for approval.
  function needsApproval(session) {
    return data.config.settings.makerChecker && session.role === 'supervisor';
  }

  // Guard a page: returns the session or redirects to login.
  function requireSession(type, perm) {
    var s = getSession();
    if (!s || s.type !== type || (type === 'staff' && !data.staffRoles[s.role])) { window.location.replace('index.html#login'); return null; }
    if (perm && !can(perm, s)) { window.location.replace('dashboard-staff.html?denied=1'); return null; }
    return s;
  }

  // ---------------- Status pills ----------------
  function pill(kind, text) {
    var map = {
      paid: ['approved', 'bi-check-circle-fill'], due: ['due', 'bi-clock-fill'], overdue: ['overdue', 'bi-exclamation-triangle-fill'],
      pending: ['review', 'bi-hourglass-split'], info: ['submitted', 'bi-info-circle-fill'], closed: ['rejected', 'bi-x-circle-fill'],
      failed: ['returned', 'bi-x-octagon-fill']
    };
    var m = map[kind] || map.info;
    return '<span class="gov-status-pill gov-status-pill-' + m[0] + '"><i class="bi ' + m[1] + '" aria-hidden="true"></i>' + esc(text) + '</span>';
  }
  function paymentPill(p) {
    if (p.status === 'Success') return pill('paid', 'Success');
    if (p.status === 'Pending') return pill('pending', 'Under verification');
    if (p.status === 'Reversed') return pill('closed', 'Reversed');
    return pill('failed', p.status);
  }
  // Staff screens show only two account states; the year-wise arrears breakup stays on the ledger.
  function duesPill(site, d) {
    if (site.status === 'Closed') return pill('closed', 'Closed');
    d = d || dues(site);
    return d.totalPayable > 0 ? pill('overdue', 'Due') : pill('paid', 'Paid');
  }
  function challanPill(c) {
    var k = { Generated: 'info', 'BR Recorded': 'pending', Verified: 'paid', Expired: 'closed', Cancelled: 'closed' }[c.status] || 'info';
    return pill(k, c.status);
  }

  // ---------------- UI helpers ----------------
  function toast(message, tone) {
    var holder = document.getElementById('gr-toasts');
    if (!holder) {
      holder = document.createElement('div');
      holder.id = 'gr-toasts';
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
    var f = input.files && input.files[0];
    if (!f) return required ? 'Upload the supporting file (PDF, JPG or PNG, up to 5 MB).' : '';
    if (!/\.(pdf|jpe?g|png)$/i.test(f.name)) return 'Only PDF, JPG or PNG files are accepted.';
    if (f.size > 5 * 1024 * 1024) return 'The file is larger than 5 MB.';
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
  function addAttachment(grId, docType, input) {
    var f = input && input.files && input.files[0];
    if (!f) return null;
    var id = 'F-' + String(data.attachments.length + 1).padStart(4, '0');
    var s = getSession() || {};
    data.attachments.unshift({ id: id, grId: grId, docType: docType, file: f.name, fileType: f.type, size: f.size, uploadedBy: s.type === 'staff' ? data.staffRoles[s.role].user : 'Citizen', at: data.demoToday });
    putFile(id, f);
    return f.name;
  }
  // Latest attachment with this file name (optionally on this site).
  function attachmentFor(name, grId) {
    return data.attachments.filter(function (a) { return a.file === name && (grId === undefined || a.grId === grId); })[0] || null;
  }
  // Link that opens an uploaded file in the document viewer (new tab).
  function fileLink(name, grId, label) {
    if (!name) return '';
    var a = attachmentFor(name, grId) || attachmentFor(name);
    var href = 'document.html?' + (a ? 'id=' + encodeURIComponent(a.id) : 'name=' + encodeURIComponent(name));
    return '<a href="' + href + '" target="_blank" rel="noopener" class="gr-file-link"><i class="bi bi-paperclip me-1" aria-hidden="true"></i>' + esc(label || name) + '<span class="visually-hidden"> (opens in a new tab)</span></a>';
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
      if (svg) { svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'QR code to verify this document'); }
    } else {
      el.innerHTML = '<div class="small text-muted border rounded p-2">QR unavailable offline<br>' + esc(text) + '</div>';
    }
  }
  function verifyUrl(type, ref) {
    var base = location.href.replace(/[^/]*$/, '');
    return base + 'verify.html?type=' + encodeURIComponent(type) + '&ref=' + encodeURIComponent(ref);
  }

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

  // ---------------- In-page view switching (citizen dashboard) ----------------
  function initViews(onShow) {
    var links = document.querySelectorAll('[data-view]');
    function show(view) {
      var target = document.getElementById('view-' + view);
      if (!target) return;
      document.querySelectorAll('.gr-view').forEach(function (v) { v.classList.toggle('d-none', v !== target); });
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
  var STAFF_MENU = {
    dash: { icon: 'bi-speedometer2', label: 'Dashboard', href: 'dashboard-staff.html' },
    search: { icon: 'bi-search', label: 'Account Search', href: 'accounts.html', perm: 'viewAccounts' },
    create: { icon: 'bi-person-plus', label: 'Create Account', href: 'account-form.html', perm: 'editAccounts' },
    verify: { icon: 'bi-patch-check', label: 'Approve Bank Payments', href: 'payment-desk.html', perm: 'payments', badge: 'challans' },
    adjust: { icon: 'bi-sliders2-vertical', label: 'Adjustments', href: 'accounts.html?intent=adjust', perm: 'adjust' },
    approvals: { icon: 'bi-check2-square', label: 'Approval Queue', href: 'approvals.html', perm: 'approve', makerChecker: true, badge: 'approvals' },
    config: { icon: 'bi-gear', label: 'Configuration', href: 'config.html', perm: 'configView' },
    reports: { icon: 'bi-bar-chart-line', label: 'Reports', href: 'reports.html' },
    audit: { icon: 'bi-journal-text', label: 'Audit Log', href: 'reports.html#audit' }
  };
  var STAFF_GROUPS = [
    ['Overview', ['dash']], ['Accounts', ['search', 'create']], ['Payments', ['verify', 'adjust']],
    ['Approvals', ['approvals']], ['Monitoring', ['reports', 'audit']], ['Settings', ['config']]
  ];
  var CITIZEN_MENU = [
    { key: 'dashboard', icon: 'bi-speedometer2', label: 'Dashboard', href: 'dashboard.html#dashboard', view: 'dashboard' },
    { key: 'pay', icon: 'bi-plus-circle-fill text-success', label: 'Pay Ground Rent', href: 'search.html', cls: 'text-success fw-semibold' },
    { key: 'accounts', icon: 'bi-house-door', label: 'My Ground Rent Accounts', href: 'dashboard.html#accounts', view: 'accounts', badge: 'accounts' },
    { key: 'uploadBr', icon: 'bi-upload', label: 'Upload Bank Receipt', href: 'upload-br.html', badge: 'challans' },
    { key: 'payments', icon: 'bi-receipt', label: 'Payment History & Receipts', href: 'dashboard.html#payments', view: 'payments' },
    { key: 'notifications', icon: 'bi-bell-fill text-warning', label: 'Notifications', href: 'dashboard.html#notifications', view: 'notifications', badge: 'notifs' },
    { key: 'support', icon: 'bi-headset', label: 'Help and Support', href: 'dashboard.html#support', view: 'support' },
    { sep: true },
    { key: 'profile', icon: 'bi-person-badge', label: 'My Profile', href: 'dashboard.html#profile', view: 'profile' }
  ];

  function toolbarHtml() {
    return '<div class="btn-group btn-group-sm" role="group" aria-label="Text Size Controls">' +
      '<button type="button" class="btn btn-outline-gov-light" data-font-action="decrease" aria-label="Decrease text size">A-</button>' +
      '<button type="button" class="btn btn-outline-gov-light" data-font-action="reset" aria-label="Reset text size">A</button>' +
      '<button type="button" class="btn btn-outline-gov-light" data-font-action="increase" aria-label="Increase text size">A+</button></div>' +
      '<button type="button" class="btn btn-outline-gov-light btn-sm" id="btn-contrast-toggle" aria-pressed="false" aria-label="Toggle High Contrast Mode" title="Toggle High Contrast Mode"><i class="fas fa-adjust" aria-hidden="true"></i></button>';
  }

  // opts: { type: 'citizen'|'staff', active: menu key, title: header title }
  function shell(opts) {
    var session = getSession();
    var main = document.getElementById('main-content');
    var isStaff = opts.type === 'staff';
    var onDashboard = /dashboard\.html$/.test(location.pathname);

    // Demo bar
    var picker;
    if (isStaff) {
      picker = '<label for="roleSelector" class="fw-semibold text-white mb-0">Prototype Demo &ndash; Role:</label>' +
        '<select id="roleSelector" class="form-select form-select-sm py-1 border-0 fw-semibold">' +
        Object.keys(data.staffRoles).map(function (k) {
          var r = data.staffRoles[k];
          return '<option value="' + k + '"' + (k === session.role ? ' selected' : '') + '>' + esc(r.title) + '</option>';
        }).join('') + '</select>';
    } else {
      picker = '<label for="scenarioSelector" class="fw-semibold text-white mb-0">Prototype Demo &ndash; Select Citizen Scenario:</label>' +
        '<select id="scenarioSelector" class="form-select form-select-sm py-1 border-0 fw-semibold">' +
        Object.keys(data.citizens).map(function (k, i) {
          return '<option value="' + k + '"' + (k === session.scenario ? ' selected' : '') + '>' + String.fromCharCode(65 + i) + ': ' + esc(data.citizens[k].label) + ' (' + esc(data.citizens[k].name) + ')</option>';
        }).join('') + '</select>';
    }
    var top = document.createElement('div');
    top.innerHTML =
      '<a class="gov-skip-link" href="#main-content">Skip to Main Content</a>' +
      '<a class="gov-skip-link" href="#sidebar-nav">Skip to Navigation Menu</a>' +
      '<div class="gov-flag-stripe" aria-hidden="true"></div>' +
      '<aside class="gr-demo-bar" aria-label="Prototype controls"><div class="container-fluid px-lg-4"><div class="d-flex align-items-center justify-content-between flex-wrap gap-2">' +
        '<div class="d-flex align-items-center gap-2 flex-wrap"><span class="badge bg-warning text-dark fw-bold px-2 py-1"><i class="bi bi-flask me-1" aria-hidden="true"></i>PROTOTYPE</span>' + picker +
        '<a href="index.html#login" class="btn btn-sm btn-outline-warning py-0 px-2 fw-semibold" data-logout><i class="bi bi-people-fill me-1" aria-hidden="true"></i>Switch Role</a>' +
        '<button type="button" class="btn btn-sm btn-outline-light py-0 px-2" id="btnResetDemo" title="Restore the original demonstration data"><i class="bi bi-arrow-counterclockwise me-1" aria-hidden="true"></i>Reset demo data</button></div>' +
        '<div class="d-flex align-items-center gap-2"><span class="small text-white-50 d-none d-md-inline"><i class="bi bi-calendar3 me-1" aria-hidden="true"></i>Demo date: <strong class="text-white">' + fmtDate(data.demoToday) + '</strong></span>' + toolbarHtml() + '</div>' +
      '</div></div></aside>';

    // Header
    var userName, userSub, roleBadge = '';
    if (isStaff) {
      var r = data.staffRoles[session.role];
      userName = r.user + ' (demo)';
      userSub = r.title;
      roleBadge = '<span class="badge bg-primary-subtle text-primary border border-primary-subtle d-none d-xl-inline-flex">' + esc(r.title) + '</span>';
    } else {
      var c = currentCitizen(session);
      userName = c.name;
      userSub = 'Mobile ' + maskMobile(c.mobile);
    }
    top.innerHTML +=
      '<header class="gr-workspace-header py-2" role="banner"><div class="container-fluid px-lg-4"><div class="d-flex align-items-center justify-content-between gap-2">' +
        '<div class="d-flex align-items-center gap-2 gap-sm-3 min-w-0">' +
          '<button class="btn btn-sm btn-outline-secondary d-lg-none" id="gov-sidebar-toggle" type="button" aria-controls="sidebar-nav" aria-expanded="false" aria-label="Open menu"><i class="bi bi-list" aria-hidden="true"></i></button>' +
          '<a href="index.html" title="Online Ground Rent Payment System home"><img src="../../common/assets/images/sikkim-government-logo-dark.png" alt="Official Emblem of the Government of Sikkim" class="gov-emblem"></a>' +
          '<div class="min-w-0"><div class="gov-header-dept-eyebrow" style="font-size:0.75rem;">Urban Development Department</div>' +
          '<div class="h6 fw-bold mb-0 text-dark text-truncate">Ground Rent &ndash; ' + (isStaff ? 'Department' : 'Citizen') + ' Workspace</div></div>' +
        '</div>' +
        '<div class="d-flex align-items-center gap-2"><div class="text-end d-none d-sm-block"><div class="fw-bold text-dark small">' + esc(userName) + '</div><div class="text-muted" style="font-size:0.75rem;">' + esc(userSub) + '</div></div>' + roleBadge +
          '<a href="index.html#login" class="btn btn-sm btn-outline-danger" data-logout title="Logout"><i class="bi bi-box-arrow-left" aria-hidden="true"></i><span class="d-none d-md-inline ms-1">Logout</span></a></div>' +
      '</div></div></header>';
    var frag = document.createDocumentFragment();
    while (top.firstChild) frag.appendChild(top.firstChild);
    document.body.insertBefore(frag, document.body.firstChild);

    // Sidebar
    var menu = '';
    if (isStaff) {
      var scopeIds = data.sites.filter(function (s) { return inScope(s, session); }).map(function (s) { return s.grId; });
      var counts = {
        challans: data.challans.filter(function (c) { return scopeIds.indexOf(c.grId) !== -1 && c.status === 'BR Recorded'; }).length,
        approvals: data.approvals.filter(function (a) { return a.status === 'Submitted' && scopeIds.indexOf(a.grId) !== -1; }).length
      };
      STAFF_GROUPS.forEach(function (g) {
        var items = g[1].map(function (k) { return Object.assign({ key: k }, STAFF_MENU[k]); }).filter(function (m) {
          return (!m.perm || can(m.perm, session)) && (!m.makerChecker || data.config.settings.makerChecker);
        });
        if (!items.length) return;
        menu += '<li class="gr-sidebar-section">' + esc(g[0]) + '</li>';
        items.forEach(function (m) {
          var label = m.key === 'search' && session.role === 'hq' ? 'Account Search (view only)' : (m.key === 'config' && !can('configEdit', session) ? 'Configuration (view)' : m.label);
          var badge = m.badge && counts[m.badge] ? '<span class="badge bg-warning text-dark">' + counts[m.badge] + '</span>' : '';
          menu += '<li><a href="' + m.href + '" class="gov-sidebar-link' + (m.key === opts.active ? ' active" aria-current="page' : '') + '"><i class="bi ' + m.icon + '" aria-hidden="true"></i><span>' + esc(label) + '</span>' + badge + '</a></li>';
        });
      });
    } else {
      var cz = currentCitizen(session);
      var czIds = citizenSites(cz).map(function (s) { return s.grId; });
      var cCounts = { accounts: czIds.length, notifs: cz.notifications.filter(function (n) { return n.unread; }).length,
        challans: data.challans.filter(function (c) { return czIds.indexOf(c.grId) !== -1 && c.status === 'Generated' && c.validTill >= data.demoToday; }).length };
      CITIZEN_MENU.forEach(function (m) {
        if (m.sep) { menu += '<li class="my-2 border-top"></li>'; return; }
        var badge = m.badge && cCounts[m.badge] ? '<span class="badge ' + (m.badge === 'notifs' ? 'bg-danger' : 'bg-secondary') + '">' + cCounts[m.badge] + '</span>' : '';
        var viewAttr = onDashboard && m.view ? ' data-view="' + m.view + '"' : '';
        menu += '<li><a href="' + m.href + '"' + viewAttr + ' class="gov-sidebar-link ' + (m.cls || '') + (m.key === opts.active ? ' active" aria-current="page' : '') + '"><i class="bi ' + m.icon + '" aria-hidden="true"></i><span>' + esc(m.label) + '</span>' + badge + '</a></li>';
      });
    }
    menu += '<li class="my-2 border-top"></li><li><a href="index.html#login" class="gov-sidebar-link text-danger" data-logout><i class="bi bi-box-arrow-left text-danger" aria-hidden="true"></i><span>Switch Role / Logout</span></a></li>';

    var footInfo;
    if (isStaff && staffScope(session)) {
      var su = ulb(session.ulb);
      footInfo = '<div class="fw-bold text-dark"><i class="bi bi-building me-1 text-primary" aria-hidden="true"></i>Urban Development Department</div><div class="text-muted" style="font-size:0.75rem;">Go-live FY ' + esc(su.goLiveFy) + ' &bull; Cut-off ' + fmtDate(su.cutOffDate) + '</div>';
    } else if (isStaff) {
      footInfo = '<div class="fw-bold text-dark"><i class="bi bi-building me-1 text-primary" aria-hidden="true"></i>Urban Development Department</div><div class="text-muted" style="font-size:0.75rem;">' + data.config.ulbs.filter(function (u2) { return u2.active; }).length + ' of ' + data.config.ulbs.length + ' ULBs live</div>';
    } else {
      footInfo = '<div class="fw-bold text-dark"><i class="bi bi-building me-1 text-primary" aria-hidden="true"></i>Department Support</div><div class="text-muted" style="font-size:0.75rem;">Helpline pending departmental confirmation</div>';
    }

    var layout = document.createElement('div');
    layout.className = 'gov-workspace-layout flex-grow-1';
    layout.innerHTML = '<div class="gr-sidebar-backdrop" id="sidebar-backdrop"></div>' +
      '<aside class="gov-sidebar gr-sidebar" id="sidebar-nav" aria-label="' + (isStaff ? 'Department' : 'Citizen') + ' menu">' +
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
    // Sidebar links to this same page with another #tab (e.g. Reports ↔ Audit Log) must re-render it.
    layout.querySelectorAll('.gr-sidebar a[href*="#"]:not([data-view])').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var url = new URL(a.getAttribute('href'), location.href);
        if (url.pathname === location.pathname && url.hash !== location.hash) {
          e.preventDefault();
          location.href = url.href;
          location.reload();
        }
      });
    });
    document.getElementById('btnResetDemo').addEventListener('click', function () {
      if (window.confirm('Restore the original demonstration data? Payments, challans and changes made during this demo will be removed.')) resetDemo();
    });
    var rs = document.getElementById('roleSelector');
    if (rs) rs.addEventListener('change', function () {
      var r2 = data.staffRoles[rs.value];
      setSession({ type: 'staff', role: rs.value, ulb: r2.scope === 'ULB' ? defaultUlb() : 'ALL', loggedInAt: session.loggedInAt });
      window.location.href = 'dashboard-staff.html';
    });
    var ss = document.getElementById('scenarioSelector');
    if (ss) ss.addEventListener('change', function () {
      setSession({ type: 'citizen', scenario: ss.value, mobile: data.citizens[ss.value].mobile, loggedInAt: session.loggedInAt });
      window.location.href = 'dashboard.html';
    });
    initAccessibility();
    initSidebar();
  }

  // On every page load: close challans whose site no longer owes anything (repairs older demo data too).
  (function sweepChallans() {
    if (!global.GRDues || !data.challans) return;
    var changed = false;
    data.challans.forEach(function (c) {
      if (c.status !== 'Generated') return;
      var s = site(c.grId);
      if (s && dues(s).totalPayable === 0) { closeChallans(c.grId, 'Dues already paid by another payment'); changed = true; }
    });
    if (changed) save();
  })();

  global.GRApp = {
    get data() { return data; },
    save: save, resetDemo: resetDemo,
    getSession: getSession, setSession: setSession, logout: logout,
    inr: inr, sqft: sqft, fmtDate: fmtDate, esc: esc, maskMobile: maskMobile, stamp: stamp, qs: qs, norm: norm,
    site: site, ulb: ulb, ward: ward, wardsOf: wardsOf, localitiesOf: localitiesOf, wardName: wardName, cascadeFilters: cascadeFilters, defaultUlb: defaultUlb, dues: dues, ownersText: ownersText, ownersFull: ownersFull, totalArea: totalArea, legacyRef: legacyRef,
    challanFor: challanFor, closeChallans: closeChallans,citizenSites: citizenSites, saveSiteForCitizen: saveSiteForCitizen, currentCitizen: currentCitizen, siteMobiles: siteMobiles,
    newReceiptNo: newReceiptNo, newChallanNo: newChallanNo, newIntentNo: newIntentNo, audit: audit, notify: notify, challanValidTill: challanValidTill,
    can: can, staffScope: staffScope, inScope: inScope, needsApproval: needsApproval, requireSession: requireSession,
    pill: pill, paymentPill: paymentPill, challanPill: challanPill, duesPill: duesPill,
    toast: toast, checkFile: checkFile, fieldError: fieldError, addAttachment: addAttachment, attachmentFor: attachmentFor, fileLink: fileLink, getFile: getFile, filesReady: filesReady, downloadCsv: downloadCsv, renderQr: renderQr, verifyUrl: verifyUrl,
    initAccessibility: initAccessibility, initSidebar: initSidebar, initViews: initViews, shell: shell
  };
})(window);
