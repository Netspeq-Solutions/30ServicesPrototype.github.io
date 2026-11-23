/* ==========================================================================
   e-Trade Licence (UDD) – workflow engine
   New / Change:  Inspector (inspection report + fee assessment) → BO → Special
                  Secretary → HOD (fixes the fee) → Payment by BR → Licence
   Renewal:       Applicant uploads GST clearance + BR with the application →
                  Inspector (BR + original copy) → BO (site visit optional,
                  approves) → Renewed licence
   No outright rejection: only send-backs. Remarks are mandatory on every
   return. A corrected application goes back to the officer who returned it.
   Every action is written to the application history and the audit log.
   ========================================================================== */
(function (global) {
  'use strict';
  var App = global.TLApp;
  function D() { return App.data; }
  function today() { return D().demoToday; }

  // ---------------- Applicant types ----------------
  var TYPES = {
    IND: { label: 'Individual / firm', short: 'Individual / firm', icon: 'bi-person', hint: 'Firm, enterprise or establishment of the applicant(s) – a proprietor or partners' },
    COMP: { label: 'Registered company', short: 'Company', icon: 'bi-buildings', hint: 'Pvt. Ltd., Public Ltd., society or other registered entity' }
  };
  function typeOf(a) { return a.applicantType === 'IND' ? 'IND' : 'COMP'; }

  // ---------------- Form fields ----------------
  // who: 'IND' | 'COMP' (omitted = both). required: true | 'IND' | 'COMP'.
  // when(form, ctx): shown only when true. labels / types: overrides per applicant type.
  // toggles: changing it shows or hides other fields.
  // Hotel, franchise and education questions are asked only for items set up to ask them (items master).
  function hotel(f, c) { return !!c.asks.hotel; }
  function asks(k) { return function (f, c) { return !!c.asks[k]; }; }
  function asksYes(k, field) { return function (f, c) { return !!c.asks[k] && f[field] === 'Yes'; }; }
  function notSame(f) { return !f.presSame; }
  // Renewal of a licence issued before this system: applied for as a new application, with the old licence details.
  function oldLic(f) { return f.applyFor === 'old'; }
  var PIN = { pattern: /^[1-9][0-9]{5}$/, hint: '6 digits', mono: true };
  function pin(o) { return Object.assign({}, PIN, o); }
  var FIELDS = [
    { key: 'oldLicenceNo', label: 'Old licence number', section: 'oldLicence', required: true, mono: true, when: oldLic, hint: 'As printed on the old trade licence' },
    { key: 'oldIssuedOn', label: 'Date of first issue', section: 'oldLicence', type: 'date', when: oldLic, hint: 'Optional, if known' },
    { key: 'oldValidTo', label: 'Valid up to (last renewal)', section: 'oldLicence', required: true, type: 'date', when: oldLic, hint: 'Validity end date on the old licence' },
    { key: 'applicantName', label: 'Name of applicant / applicants / proprietor / partners', labels: { COMP: 'Name of the applicant / applicants' }, section: 'applicant', required: true },
    { key: 'companyName', label: 'Name of the firm / company / society', section: 'applicant', who: 'COMP', required: true },
    { key: 'regNo', label: 'Registration number (CIN / society registration)', section: 'applicant', who: 'COMP', required: true, mono: true },
    { key: 'mdName', label: 'Name of the Managing Director / Director / President', labels: { IND: 'Managing Director / Director / President (if applicable)' }, section: 'applicant', required: 'COMP' },
    { key: 'age', label: 'Age of the applicant', labels: { COMP: 'Age of the applicant / applicants' }, section: 'applicant', required: true, type: 'number', min: 18, max: 100, hint: '18 or above' },
    { key: 'gender', label: 'Gender', section: 'applicant', who: 'IND', required: true, type: 'select', options: ['Male', 'Female', 'Transgender'] },
    { key: 'guardianName', label: 'Father\'s / Husband\'s name', section: 'applicant', required: true },
    { key: 'idStatus', label: 'Identification status', section: 'applicant', who: 'IND', required: true, type: 'select', options: ['SSC', 'COI', 'RC'], hint: 'Sikkim Subject Certificate, Certificate of Identification or Residential Certificate' },
    { key: 'socialGroup', label: 'Social group', section: 'applicant', who: 'IND', required: true, type: 'select', options: ['SC', 'ST', 'MBC', 'OBC', 'Others'] },

    { key: 'permHouseNo', label: 'House number', section: 'perm', required: true },
    { key: 'permStreet', label: 'Street / road', section: 'perm', required: true },
    { key: 'permLocality', label: 'Locality', labels: { COMP: 'Road / locality' }, section: 'perm', required: true },
    { key: 'permAddress', label: 'Address', section: 'perm', who: 'COMP', hint: 'Town, state – if outside Sikkim' },
    { key: 'permDistrict', label: 'District', section: 'perm', required: true, type: 'district', types: { COMP: 'text' } },
    { key: 'permGpu', label: 'Gram Panchayat Unit / GMC / WP', section: 'perm', who: 'IND', required: true },
    { key: 'permWard', label: 'Panchayat ward / municipal ward', section: 'perm', who: 'IND', required: true },
    { key: 'permPo', label: 'Post office', section: 'perm', required: true },
    { key: 'permPs', label: 'Police station', section: 'perm', required: true },
    pin({ key: 'permPin', label: 'PIN code', section: 'perm', who: 'IND', required: true }),

    { key: 'presSame', label: 'Present address is the same as the permanent address', section: 'present', who: 'COMP', type: 'check', toggles: true },
    { key: 'presHouseNo', label: 'House number', section: 'present', who: 'COMP', required: true, when: notSame },
    { key: 'presStreet', label: 'Street', section: 'present', who: 'COMP', required: true, when: notSame },
    { key: 'presLocality', label: 'Road / locality', section: 'present', who: 'COMP', required: true, when: notSame },
    { key: 'presAddress', label: 'Address', section: 'present', who: 'COMP', when: notSame },
    { key: 'presPo', label: 'Post office', section: 'present', who: 'COMP', required: true, when: notSame },
    { key: 'presPs', label: 'Police station', section: 'present', who: 'COMP', required: true, when: notSame },
    { key: 'presDistrict', label: 'District', section: 'present', who: 'COMP', required: true, when: notSame },

    { key: 'mobile', label: 'Mobile number', labels: { COMP: 'Phone number (mobile)' }, section: 'contact', required: true, pattern: /^[6-9][0-9]{9}$/, hint: '10 digits' },
    { key: 'landline', label: 'Landline number', section: 'contact', who: 'IND', pattern: /^[0-9][0-9\- ]{5,14}$/, hint: 'Optional, with STD code' },
    { key: 'email', label: 'Email', section: 'contact', required: true, pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/ },
    { key: 'pan', label: 'PAN', section: 'contact', who: 'IND', required: true, mono: true, upper: true, pattern: /^[A-Z]{5}[0-9]{4}[A-Z]$/, hint: '10 characters, e.g. ABCPB0871M' },
    { key: 'tin', label: 'TIN', section: 'contact', who: 'IND', mono: true, pattern: /^[0-9]{11}$/, hint: 'Optional, 11 digits' },

    { key: 'firmName', label: 'Name of the firm / enterprise / establishment', section: 'firm', who: 'IND', required: true },
    { key: 'premOwner', label: 'Name of the house owner', section: 'firm', required: true },
    { key: 'premHouseNo', label: 'House number', section: 'firm', required: true },
    { key: 'premStreet', label: 'Street / road', labels: { COMP: 'Street / road / locality' }, section: 'firm', required: true },
    { key: 'premLocality', label: 'Locality', section: 'firm', who: 'IND', required: true },
    { key: 'premDistrict', label: 'District', section: 'firm', required: true, type: 'district' },
    { key: 'premGpu', label: 'Gram Panchayat Unit / GMC / WP', section: 'firm', who: 'IND', required: true },
    { key: 'premWard', label: 'Panchayat ward / municipal ward', section: 'firm', who: 'IND', required: true },
    { key: 'premPo', label: 'Post office', section: 'firm', required: true },
    { key: 'premPs', label: 'Police station', section: 'firm', required: true },
    pin({ key: 'premPin', label: 'PIN code', section: 'firm', who: 'IND', required: true }),
    { key: 'godownAddress', label: 'Address of godown / warehouse where the articles are stored', section: 'firm', type: 'textarea', hint: 'Leave blank if there is no godown' },

    { key: 'tourismRegistered', label: 'Registered with the Tourism & Civil Aviation Department?', section: 'hotel', who: 'IND', required: true, type: 'yesno', when: hotel, toggles: true },
    { key: 'rooms', label: 'Number of rooms', section: 'hotel', required: true, type: 'number', min: 1, max: 1000, when: hotel },
    { key: 'parking', label: 'Parking facility available?', section: 'hotel', required: true, type: 'yesno', when: hotel },
    { key: 'restaurant', label: 'Restaurant available?', section: 'hotel', required: true, type: 'yesno', when: hotel },
    { key: 'toursTravel', label: 'Tours & travels available?', section: 'hotel', required: true, type: 'yesno', when: hotel, toggles: true },

    { key: 'isFranchise', label: 'Is this a franchise of a head office / parent company?', section: 'franchise', required: true, type: 'yesno', toggles: true, when: asks('franchise') },
    { key: 'parentName', label: 'Name of the firm / organisation', section: 'franchise', required: true, when: asksYes('franchise', 'isFranchise') },
    { key: 'parentState', label: 'State / country', section: 'franchise', required: true, when: asksYes('franchise', 'isFranchise') },
    { key: 'parentDistrict', label: 'District / sub-district', section: 'franchise', required: true, when: asksYes('franchise', 'isFranchise') },
    { key: 'parentCity', label: 'City / town', section: 'franchise', required: true, when: asksYes('franchise', 'isFranchise') },
    { key: 'parentStreet', label: 'Street / road', section: 'franchise', required: true, when: asksYes('franchise', 'isFranchise') },

    { key: 'isEducation', label: 'Is this an educational institute / tutorial?', section: 'education', required: true, type: 'yesno', toggles: true, when: asks('education') },
    { key: 'eduRegistered', label: 'Registered with the Education Department?', section: 'education', required: true, type: 'yesno', when: asksYes('education', 'isEducation'), toggles: true },
    { key: 'eduRegNo', label: 'Education Department registration number', section: 'education', required: true, when: function (f, c) { return !!c.asks.education && f.isEducation === 'Yes' && f.eduRegistered === 'Yes'; } }
  ];
  var SECTIONS = { oldLicence: 'Old licence (issued before this system)', applicant: 'Applicant details', perm: 'Permanent residential address', present: 'Present address', contact: 'Contact & tax details', firm: 'Firm & place of business', hotel: 'Hotel business', franchise: 'Head office / parent company', education: 'Educational institute / tutorial' };
  var SECTION_LABELS = { COMP: { firm: 'Premises where the trade / manufacture is carried out', contact: 'Contact details' } };
  function sectionLabel(sec, type) { return (SECTION_LABELS[type] && SECTION_LABELS[type][sec]) || SECTIONS[sec]; }
  function field(key) { return FIELDS.filter(function (f) { return f.key === key; })[0]; }
  function ctx(a) { var c = App.category(a.category); return { type: typeOf(a), category: a.category, asks: (c && c.asks) || {} }; }
  function applies(f, a) { var c = ctx(a); return (!f.who || f.who === c.type) && (!f.when || f.when(a.form || {}, c)); }
  function fieldsFor(a, section) { return FIELDS.filter(function (f) { return (!section || f.section === section) && applies(f, a); }); }
  function isRequired(f, a) { return f.required === true || f.required === typeOf(a); }
  function labelOf(f, type) { return (f.labels && f.labels[type]) || f.label; }
  function inputType(f, type) { return (f.types && f.types[type]) || f.type || 'text'; }
  var PSEUDO = { circle: 'Circle', category: 'Applicant type, item & sub-item', br: 'Bank Receipt' };
  function fieldLabel(key, type) { var f = field(key); return f ? labelOf(f, type || 'IND') : (PSEUDO[key] || key); }
  function showValue(f, v) {
    if (f && f.type === 'check') return v ? 'Yes' : 'No';
    return v === '' || v == null ? '—' : String(v);
  }

  // Questions an item can switch on in the form (items master).
  var QUESTIONS = { hotel: 'Hotel details (rooms, parking, restaurant, tours & travels)', franchise: 'Franchise of a head office / parent company', education: 'Educational institute / tutorial' };

  // ---------------- Licence purpose: items master ----------------
  // config.categories is the items master kept by the Department Admin (items-master.html):
  // item = purpose of licence (key "category"); sub-item = activity as per the UDD notification (key "item").
  // Some items have no sub-items. Inactive entries are hidden from new applications but kept for old records.
  function items(code, all) {
    var c = App.category(code);
    return c ? (c.items || []).filter(function (x) { return all || x.active !== false; }) : [];
  }
  function categoriesOf(type, all) { return D().config.categories.filter(function (c) { return c.type === type && (all || c.active !== false); }); }
  function named(x, name) { return x.name === name || (x.formerNames || []).indexOf(name) !== -1; }
  // Find a notified individual item or sub-item by name (used by "Others" for companies).
  function findItem(name) {
    var hit = null;
    categoriesOf('IND', true).forEach(function (c) {
      if (hit) return;
      if (!(c.items || []).length && named(c, name)) hit = { cat: c, item: null };
      items(c.code, true).forEach(function (i) { if (!hit && named(i, name)) hit = { cat: c, item: i }; });
    });
    return hit;
  }
  // Documents mapped to the chosen item and sub-item in the items master: [{ key, req, from }].
  // A company under "Others" that picks a notified item also gets that item's documents.
  function itemDocs(a) {
    var out = [], c = App.category(a.category);
    function take(x) { ((x && x.docs) || []).forEach(function (d) { out.push({ key: d.key, req: d.req, from: x.name }); }); }
    take(c);
    if (!a.item) return out;
    var it = items(a.category, true).filter(function (i) { return named(i, a.item); })[0];
    if (it) { take(it); return out; }
    var f = findItem(a.item);
    if (f) { take(f.cat); take(f.item); }
    return out;
  }
  function purpose(a) {
    var c = App.category(a.category);
    if (!c) return '';
    if (a.category === 'OTHER') return ((a.form && a.form.otherPurpose) || 'Others') + (a.item ? ' (' + a.item + ')' : '');
    return a.item || c.name;
  }

  // Fill the summary fields used on the licence, lists and certificate from the form.
  function join(parts) { return parts.filter(function (x) { return x != null && String(x).trim() !== ''; }).join(', '); }
  var PRES = ['HouseNo', 'Street', 'Locality', 'Address', 'Po', 'Ps', 'District'];
  function derive(a) {
    var f = a.form = a.form || {}, isComp = typeOf(a) === 'COMP';
    if (isComp && f.presSame) PRES.forEach(function (k) { f['pres' + k] = f['perm' + k]; });
    f.isHotel = hotel(f, ctx(a)) ? 'Yes' : 'No';
    f.businessName = isComp ? f.companyName : f.firmName;
    f.authName = f.applicantName;
    f.premisesAddress = isComp ? f.premHouseNo : join([f.premHouseNo, f.premStreet]);
    f.locality = isComp ? f.premStreet : f.premLocality;
    f.district = f.premDistrict;
    f.officeAddress = join([f.permHouseNo, f.permStreet, f.permLocality, f.permAddress, f.permPo ? 'PO ' + f.permPo : '', f.permDistrict, f.permPin]);
    a.orgType = purpose(a);
    return a;
  }

  // Change requests: only these fields can be edited.
  var CHANGE_TYPES = {
    name: { label: 'Change of name', hint: 'Name of the firm / company' },
    premises: { label: 'Change of premises', hint: 'Place of business and house owner' },
    address: { label: 'Change of address', hint: 'Permanent address of the applicant' }
  };
  function changeFields(a, types) {
    var out = [];
    (types || (a.change && a.change.types) || []).forEach(function (t) {
      var keys = t === 'name' ? [typeOf(a) === 'COMP' ? 'companyName' : 'firmName']
        : fieldsFor(a, t === 'premises' ? 'firm' : 'perm').map(function (f) { return f.key; }).filter(function (k) { return k !== 'firmName'; });
      keys.forEach(function (k) { if (out.indexOf(k) === -1) out.push(k); });
    });
    return out;
  }
  // Renewal: only the contact details can be updated; everything else is carried over from the licence.
  function renewalFields(a) { return ['mobile', 'landline', 'email'].filter(function (k) { return applies(field(k), a); }); }

  // ---------------- Documents ----------------
  // config.docTypes is the document types master kept by the Department Admin (documents-master.html).
  // A document is asked for when: it applies to every applicant of the type (base), to every renewal,
  // to a change of name / premises / address, to an answer in the form (when), or it is mapped to the
  // chosen item / sub-item (items master). 'M' = mandatory, 'O' = optional; mandatory wins.
  function docTypes(all) { return (D().config.docTypes || []).filter(function (d) { return all || d.active !== false; }); }
  function docType(key) { return (D().config.docTypes || []).filter(function (d) { return d.key === key; })[0] || null; }
  // Prescribed formats the applicant downloads, fills and uploads (format.html).
  var FORMATS = { undertaking: 'Undertaking (Form VIII)', recommendation: 'Recommendation of Gram Panchayat / Councillor (Form VI)', houseOwnerNoc: 'NOC of the house owner (Form X)' };
  function formatUrl(key) { var d = docType(key); return d && d.format && FORMATS[d.format] ? 'format.html?f=' + d.format : ''; }
  // Answers in the form that can call for a document.
  var WHEN = {
    franchise: { label: 'Franchise of a parent company = Yes', test: function (f, c) { return !!c.asks.franchise && f.isFranchise === 'Yes'; } },
    tourismRegistered: { label: 'Hotel registered with Tourism = Yes (individuals)', test: function (f, c) { return c.type === 'IND' && hotel(f, c) && f.tourismRegistered === 'Yes'; } },
    toursTravel: { label: 'Hotel offers tours & travels = Yes', test: function (f, c) { return hotel(f, c) && f.toursTravel === 'Yes'; } },
    oldLicence: { label: 'Renewal of a licence issued before this system = Yes', test: function (f) { return oldLic(f); } }
  };
  // New application that renews a licence issued before this system (old licences are not migrated).
  function isOldRenewal(a) { return a.kind === 'New' && !!a.form && oldLic(a.form); }
  // Documents for an application: [{ key, req, why }], in master order.
  function docList(a) {
    var found = {}, c = ctx(a), f = a.form || {};
    function add(key, req, why) {
      var d = docType(key);
      if (!d || d.active === false || !req) return;
      var x = found[key] = found[key] || { key: key, req: false, why: [] };
      x.req = x.req || req === 'M';
      if (why && x.why.indexOf(why) === -1) x.why.push(why);
    }
    if (a.kind === 'Renewal') docTypes().forEach(function (d) { add(d.key, d.renewal); });
    else if (a.kind === 'Change') ((a.change && a.change.types) || []).forEach(function (t) { docTypes().forEach(function (d) { add(d.key, (d.change || {})[t]); }); });
    else {
      docTypes().forEach(function (d) {
        add(d.key, (d.base || {})[c.type]);
        Object.keys(d.when || {}).forEach(function (w) { if (WHEN[w] && WHEN[w].test(f, c)) add(d.key, d.when[w], WHEN[w].label.replace(/ = Yes.*$/, '')); });
      });
      itemDocs(a).forEach(function (m) { add(m.key, m.req, m.from); });
    }
    return docTypes().filter(function (d) { return found[d.key]; }).map(function (d) { var x = found[d.key]; return { key: x.key, req: x.req, why: x.why.join(', ') }; });
  }
  function docKeys(a) { return docList(a).map(function (d) { return d.key; }); }
  function docRequired(a, key) { var d = docList(a).filter(function (x) { return x.key === key; })[0]; return d ? d.req : false; }
  function docLabel(key) { if (key === 'br') return 'Bank Receipt (renewal amount)'; var d = docType(key); return d ? d.name : key; }
  // Items and sub-items a document is mapped to: [{ cat, sub, req }].
  function docMappings(key) {
    var out = [];
    D().config.categories.forEach(function (c) {
      (c.docs || []).forEach(function (m) { if (m.key === key) out.push({ cat: c, sub: null, req: m.req }); });
      (c.items || []).forEach(function (s) { (s.docs || []).forEach(function (m) { if (m.key === key) out.push({ cat: c, sub: s, req: m.req }); }); });
    });
    return out;
  }

  // ---------------- Dates & financial year ----------------
  function toDate(iso) { var p = String(iso).slice(0, 10).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function addDays(isoStr, n) { var d = toDate(isoStr); d.setDate(d.getDate() + n); return iso(d); }
  function daysBetween(a, b) { return Math.round((toDate(b) - toDate(a)) / 86400000); }
  // 31 March that ends the FY containing this date.
  function fyEnd(isoStr) { var d = toDate(isoStr); var y = d.getMonth() >= 3 ? d.getFullYear() + 1 : d.getFullYear(); return y + '-03-31'; }
  function fyLabel(isoStr) { var y = +fyEnd(isoStr).slice(0, 4); return (y - 1) + '-' + String(y).slice(2); }

  // ---------------- Fees ----------------
  // Renewal late surcharge: grace up to 30 days after expiry; ₹5 per day after that,
  // counted to the FIRST submission date of the renewal. No cut-off.
  function renewalFine(validTo, submittedOn) {
    var rule = D().config.renewalFine;
    var graceEnd = addDays(validTo, rule.graceDays);
    var late = submittedOn ? Math.max(0, daysBetween(graceEnd, submittedOn)) : 0;
    return { graceEnd: graceEnd, lateDays: late, fine: late * rule.perDay, perDay: rule.perDay };
  }
  // Renewal amounts held on the licence: start from the first licence fee, revised by the Department.
  function renewalAmounts(lic) { return (lic && lic.fees) || { renewal: 0, garbage: 0, history: [] }; }
  // New / Change: the fee assessed by the Inspector (fee + garbage fee).
  // Renewal: the licence's renewal amount + garbage fee + late surcharge to the first submission.
  function computeFee(a, onDate) {
    onDate = onDate || today();
    if (a.kind === 'Renewal') {
      var lic = App.licence(a.licenceNo), r = renewalAmounts(lic);
      var f = lic ? renewalFine(lic.validTo, a.firstSubmittedOn || onDate) : { fine: 0, lateDays: 0 };
      return { kind: 'Renewal', base: r.renewal, garbage: r.garbage, fine: f.fine, lateDays: f.lateDays, total: r.renewal + r.garbage + f.fine, fixedOn: onDate };
    }
    // An old licence renewed through a new application may also carry a fine / surcharge for the lapsed years.
    var s = a.assessment, fine = s ? s.fine || 0 : 0;
    return { kind: a.kind === 'Change' ? 'Change' : 'Licence', base: s ? s.fee : 0, garbage: s ? s.garbage : 0, fine: fine, lateDays: 0, total: s ? s.fee + s.garbage + fine : 0,
      assessedBy: s ? s.by : null, assessedRole: s ? s.role || 'Inspector' : null, assessedOn: s ? s.on : null, fixedOn: onDate };
  }

  // ---------------- Statuses ----------------
  var ST = {
    DRAFT: 'Draft', SUBMITTED: 'Submitted', UNDER_INSPECTION: 'Under Inspection', RETURNED: 'Returned to Applicant', RESUBMITTED: 'Resubmitted',
    WITH_BO: 'With BO', WITH_SS: 'With Special Secretary', RETURNED_BO: 'Returned to BO', RETURNED_SS: 'Returned to Special Secretary', WITH_HOD: 'With HOD',
    PAYMENT: 'Approved – Payment Pending', BR_UPLOADED: 'BR Uploaded', BR_INVALID: 'BR Invalid', ISSUED: 'Licence Issued'
  };
  var CLOSED = [ST.ISSUED];
  function isOpen(a) { return CLOSED.indexOf(a.status) === -1 && a.status !== ST.DRAFT; }

  // Who the application is pending with: { role, userId, label }
  function pendingWith(a) {
    var s = a.status, staff = D().staff;
    if ([ST.DRAFT, ST.RETURNED, ST.PAYMENT, ST.BR_INVALID].indexOf(s) !== -1) return { role: 'applicant', label: 'Applicant' };
    if (s === ST.SUBMITTED || s === ST.UNDER_INSPECTION) return { role: 'inspector', label: 'Inspector' };
    if (s === ST.RESUBMITTED) {
      if (a.returnedBy && a.returnedBy.role === 'bo') return { role: 'bo', userId: a.returnedBy.userId, label: 'BO ' + staff[a.returnedBy.userId].name };
      return { role: 'inspector', label: 'Inspector' };
    }
    if (s === ST.WITH_BO || s === ST.RETURNED_BO) return { role: 'bo', userId: a.selectedBo, label: 'BO ' + (staff[a.selectedBo] ? staff[a.selectedBo].name : '') };
    if (s === ST.WITH_SS || s === ST.RETURNED_SS) return { role: 'ss', label: 'Special Secretary' };
    if (s === ST.WITH_HOD) return { role: 'hod', label: 'HOD (CCS / Issuing Authority)' };
    if (s === ST.BR_UPLOADED) return { role: 'brCheck', label: 'Inspector / BO (BR verification)' };
    return { role: null, label: '—' };
  }
  // Can this staff user act on the application now?
  function canAct(a, userId) {
    var u = D().staff[userId];
    if (!u || u.circle !== a.circle) return false;
    var p = pendingWith(a);
    if (p.role === 'brCheck') return u.role === 'inspector' || (u.role === 'bo' && a.selectedBo === userId);
    if (p.role !== u.role) return false;
    return !p.userId || p.userId === userId;
  }
  // Send the application on to another BO: the BO holding it, or an Inspector while it is with the BO.
  function canReassign(a, userId) {
    var u = D().staff[userId];
    if (!u || u.circle !== a.circle) return false;
    if (u.role === 'bo') return canAct(a, userId) && (a.status === ST.WITH_BO || a.status === ST.RETURNED_BO);
    if (u.role === 'inspector') return a.status === ST.WITH_BO;
    return false;
  }
  // Applications this user can see in "All applications".
  function visibleTo(a, userId) {
    var u = D().staff[userId];
    if (!u || a.circle !== u.circle || a.status === ST.DRAFT) return false;
    if (u.role === 'bo') return a.selectedBo === userId || (a.returnedBy && a.returnedBy.userId === userId) || (a.boHistory || []).indexOf(userId) !== -1;
    return true; // Inspectors, Special Secretary, HOD and Department Admin (view only) see the whole circle
  }

  // ---------------- Logging ----------------
  function log(a, action, remarks, actor) {
    var s = App.getSession() || {};
    var who = actor || App.actor(s);
    var entry = { at: App.stamp(), by: who.name, role: who.role, action: action, remarks: remarks || '', status: a.status };
    a.history.push(entry);
    a.updatedOn = today();
    D().auditLog.unshift({ at: entry.at, user: who.name, role: who.role, appId: a.appId, action: action, remarks: remarks || '' });
  }
  function staffName(id) { var u = D().staff[id]; return u ? u.name : id; }

  // ---------------- Bank Receipt checks ----------------
  // Same BR number already used on another application or licence?
  function brDuplicate(brNo, exceptAppId) {
    var n = String(brNo || '').trim().toUpperCase();
    if (!n) return null;
    var hit = D().applications.filter(function (a) { return a.appId !== exceptAppId && a.br && a.br.status !== 'Draft' && a.br.brNo.toUpperCase() === n; })[0];
    if (hit) return hit.appId;
    var lic = null;
    D().licences.forEach(function (l) {
      l.versions.forEach(function (v) { if (v.brNo && v.brNo.toUpperCase() === n) lic = l.licenceNo; });
      l.renewals.forEach(function (r) { if (r.brNo && r.brNo.toUpperCase() === n && r.appId !== exceptAppId) lic = l.licenceNo; });
    });
    return lic;
  }
  // Problem with the current BR against the fee: '' when it is in order.
  function brProblem(a) {
    if (!a.br) return 'No Bank Receipt uploaded.';
    var dup = brDuplicate(a.br.brNo, a.appId);
    if (dup) return 'Duplicate BR number (also used on ' + dup + ').';
    if (a.fee && a.br.amount < a.fee.total) return 'BR amount ' + App.inr(a.br.amount) + ' is less than ' + App.inr(a.fee.total) + '.';
    return '';
  }

  // ---------------- Applicant actions ----------------
  function nextAppId(circle) {
    var y = today().slice(0, 4), prefix = 'TL-' + circle + '-' + y + '-', max = 0;
    D().applications.forEach(function (a) { if (a.appId.indexOf(prefix) === 0) max = Math.max(max, parseInt(a.appId.slice(prefix.length), 10)); });
    return prefix + String(max + 1).padStart(6, '0');
  }
  function submit(a) {
    var biz = D().businesses[a.businessKey];
    derive(a);
    if (a.kind === 'Renewal' && a.br && a.br.status === 'Draft') { a.br.status = 'Uploaded'; a.br.uploadedOn = today(); }
    var brTxt = a.kind === 'Renewal' && a.br ? ' · BR ' + a.br.brNo + ' · ' + App.inr(a.br.amount) : '';
    if (a.status === ST.DRAFT) {
      a.status = ST.SUBMITTED;
      a.firstSubmittedOn = a.submittedOn = today();
      if (a.kind === 'Renewal') a.fee = computeFee(a); // late surcharge counted to this first submission
      log(a, (a.kind === 'New' ? 'Application' : (a.kind === 'Renewal' ? 'Renewal' : 'Change request')) + ' submitted' + brTxt, '');
      App.notify(a.businessKey, 'Application submitted', a.appId + ' is submitted and is now with the Inspector.' + (a.kind === 'Renewal' ? ' Submit the original Bank Receipt at the department.' : ''), a.appId);
      return;
    }
    if (a.status === ST.RETURNED) {
      a.status = ST.RESUBMITTED;
      a.submittedOn = today();
      a.round = (a.round || 1) + 1;
      var to = a.returnedBy && a.returnedBy.role === 'bo' ? 'BO ' + staffName(a.returnedBy.userId) : 'the Inspector';
      log(a, 'Corrected and resubmitted (round ' + a.round + ') – goes back to ' + to + brTxt, '');
      App.notify(a.businessKey, 'Application resubmitted', a.appId + ' is resubmitted and goes back to ' + to + '.', a.appId);
      a.correction = null;
    }
    if (biz) biz.lastActiveOn = today();
  }

  // ---------------- Original documents ----------------
  // The Inspector and the BO can each verify the originals (for renewals: receive the original BR).
  // Every check is kept: [{ role, designation, by, on, how }]. One check is enough to go ahead.
  function originals(a) { return a.originalsChecks || []; }
  function originalsBy(a, role) { return originals(a).filter(function (c) { return c.role === role; })[0] || null; }
  function originalsText(a) {
    return originals(a).map(function (c) { return c.by + ' (' + c.designation + ') – ' + c.how + ', ' + App.fmtDate(c.on); }).join('; ');
  }
  function markOriginals(a, u, how, on) {
    if (originalsBy(a, u.role)) return false;
    a.originalsChecks = originals(a).concat([{ role: u.role, designation: u.designation, by: u.name, on: on || today(), how: how }]);
    a.originalsVerified = true;
    a.originalsVerifiedBy = originalsText(a);
    return true;
  }
  function clearOriginals(a) { a.originalsChecks = []; a.originalsVerified = false; a.originalsVerifiedBy = null; }

  // ---------------- Officer actions ----------------
  // payload: { remarks, boId, notes, visitDate, files, originals, noteId, fields, docs, assess }
  function act(a, action, p) {
    p = p || {};
    var s = App.getSession(), me = s && s.userId, meU = D().staff[me];
    if (action === 'reassignBo' ? !canReassign(a, me) : (!canAct(a, me) && action !== 'editNote')) throw new Error('You cannot act on this application at its current stage.');
    var who = meU.name + ' (' + meU.designation + ')';
    switch (action) {
      case 'start':
        a.status = ST.UNDER_INSPECTION; a.returnedBy = null;
        log(a, 'Verification started', p.remarks);
        return 'Verification started.';
      case 'note': {
        var origNow = !!p.originals && markOriginals(a, meU, 'at inspection', p.visitDate);
        a.inspections.push({ id: 'N-' + a.appId.slice(-3) + '-' + (a.inspections.length + 1), by: me, byName: meU.name, role: meU.designation, visitDate: p.visitDate || null, at: App.stamp(), notes: p.notes, files: p.files || [], originalsCollected: origNow, edits: [] });
        // Fee assessment (Inspector, or BO revising it): kept only when it differs; earlier assessments are kept.
        var feeTxt = '', prev = a.assessment;
        var feeLine = function (x) { return App.inr(x.fee) + ' + garbage fee ' + App.inr(x.garbage) + (x.fine ? ' + fine / surcharge ' + App.inr(x.fine) : ''); };
        if (p.assess && (!prev || prev.fee !== p.assess.fee || prev.garbage !== p.assess.garbage || (prev.fine || 0) !== (p.assess.fine || 0))) {
          if (prev) a.assessmentHistory = (a.assessmentHistory || []).concat([prev]);
          a.assessment = { fee: p.assess.fee, garbage: p.assess.garbage, fine: p.assess.fine || 0, by: meU.name, role: meU.designation, on: today() };
          feeTxt = ' · fee ' + (prev ? 'revised from ' + feeLine(prev) + ' to ' : 'assessed ') + feeLine(a.assessment);
        } else p.assess = null;
        if (meU.role === 'ss') { log(a, 'Special Secretary note added' + (p.visitDate ? ' · site visited' : ''), p.visitDate ? 'Site visited on ' + App.fmtDate(p.visitDate) : ''); return 'Note saved.'; }
        log(a, (meU.role === 'bo' ? (a.kind === 'Renewal' ? 'Site inspection note added' : 'Re-inspection note added') : 'Inspection report added') + feeTxt + (origNow ? ' · originals verified at inspection' : ''), 'Site visited on ' + App.fmtDate(p.visitDate));
        return 'Inspection ' + (meU.role === 'bo' ? 'note' : 'report') + ' saved' + (p.assess ? ' with the fee ' + (prev ? 'revised to ' : 'of ') + App.inr(p.assess.fee + p.assess.garbage + (p.assess.fine || 0)) : '') + '.';
      }
      case 'editNote': {
        if (meU.role !== 'ss' || !canAct(a, me)) throw new Error('Only the Special Secretary can edit inspection notes at this stage.');
        var n = a.inspections.filter(function (x) { return x.id === p.noteId; })[0];
        n.edits.push({ notes: n.notes, editedBy: meU.name, editedRole: meU.designation, editedOn: App.stamp() });
        n.notes = p.notes;
        log(a, 'Inspection note edited (original kept)', p.remarks);
        return 'Note updated. The original version is kept in the history.';
      }
      case 'return': {
        // Return for correction to the applicant (Inspector or BO)
        a.status = ST.RETURNED;
        a.returnedBy = { role: meU.role, userId: meU.role === 'bo' ? me : null };
        a.correction = { by: meU.name, role: meU.designation, on: today(), remarks: p.remarks, fields: p.fields || [], docs: p.docs || [] };
        if (a.br && (p.docs || []).indexOf('br') !== -1) { a.br.status = 'Invalid'; a.br.remarks = p.remarks; a.br.checkedBy = who; a.br.checkedOn = today(); }
        log(a, 'Returned to applicant for correction', p.remarks);
        App.notify(a.businessKey, 'Application returned for correction', a.appId + ': ' + p.remarks, a.appId);
        return 'Returned to the applicant. After correction it comes back to ' + (meU.role === 'bo' ? 'you' : 'the Inspector') + '.';
      }
      case 'forwardBo': {
        var brTxt = '';
        if (a.kind === 'Renewal') {
          if (!a.originalsVerified) throw new Error('Mark the original Bank Receipt as received at the department first.');
          var pr = brProblem(a);
          if (pr) throw new Error(pr + ' Return the renewal to the applicant with the Bank Receipt marked.');
          a.br.status = 'Verified'; a.br.checkedBy = who; a.br.checkedOn = today();
          brTxt = 'BR checked · ';
        } else if (!a.assessment) throw new Error('Add the inspection report with the fee assessment before forwarding.');
        a.selectedBo = p.boId; a.status = ST.WITH_BO; a.returnedBy = null;
        log(a, brTxt + 'Forwarded to BO (' + staffName(p.boId) + ')', p.remarks);
        return 'Forwarded to BO ' + staffName(p.boId) + '.';
      }
      case 'reassignBo': {
        var fromBo = a.selectedBo;
        if (!p.boId || p.boId === fromBo) throw new Error('Choose a different BO.');
        if (fromBo && (a.boHistory || []).indexOf(fromBo) === -1) a.boHistory = (a.boHistory || []).concat([fromBo]);
        a.selectedBo = p.boId;
        log(a, 'Forwarded to another BO (' + staffName(fromBo) + ' → ' + staffName(p.boId) + ')', p.remarks);
        return 'Forwarded to BO ' + staffName(p.boId) + '.';
      }
      case 'forwardSs':
        a.status = ST.WITH_SS; a.returnedBy = null;
        log(a, 'Forwarded to Special Secretary', p.remarks);
        return 'Forwarded to the Special Secretary.';
      case 'approve': {
        if (!a.assessment) throw new Error('The fee has not been assessed in the inspection report.');
        a.fee = computeFee(a);
        a.status = ST.PAYMENT; a.returnedBy = null;
        log(a, 'Approved – fee ' + App.inr(a.fee.total) + ' fixed (' + a.fee.kind.toLowerCase() + ' fee ' + App.inr(a.fee.base) + ' + garbage fee ' + App.inr(a.fee.garbage) + (a.fee.fine ? ' + fine / surcharge ' + App.inr(a.fee.fine) : '') + ')', p.remarks);
        App.notify(a.businessKey, 'Application approved – pay the fee', a.appId + ' is approved. Pay ' + App.inr(a.fee.total) + ' at the bank, upload the Bank Receipt and bring it with the original documents to the department.', a.appId);
        return 'Approved. Fee of ' + App.inr(a.fee.total) + ' is shown to the applicant for payment.';
      }
      case 'approveRenewal': {
        // BR was paid with the application; the BO checks it if it came back after a return.
        var prb = brProblem(a);
        if (prb) throw new Error(prb + ' Return the renewal to the applicant with the Bank Receipt marked.');
        if (!a.originalsVerified) throw new Error('Mark the original Bank Receipt as received at the department first.');
        if (a.br.status !== 'Verified') { a.br.status = 'Verified'; a.br.checkedBy = who; a.br.checkedOn = today(); }
        var lic = issueLicence(a, { name: meU.name, role: meU.designation });
        a.status = ST.ISSUED; a.returnedBy = null;
        log(a, 'Renewal approved · licence ' + lic.licenceNo + ' renewed (valid to ' + App.fmtDate(lic.validTo) + ')', p.remarks);
        App.notify(a.businessKey, 'Licence renewed', 'Licence ' + lic.licenceNo + ' is renewed and ready to download. Valid up to ' + App.fmtDate(lic.validTo) + '.', a.appId);
        return 'Renewal approved. The applicant can download the renewed licence.';
      }
      case 'returnBo':
        a.status = ST.RETURNED_BO;
        log(a, 'Returned to BO', p.remarks);
        return 'Returned to BO ' + staffName(a.selectedBo) + '.';
      case 'forwardHod':
        a.status = ST.WITH_HOD;
        log(a, 'Forwarded to HOD', p.remarks);
        return 'Forwarded to the HOD (CCS / Issuing Authority).';
      case 'returnSs':
        a.status = ST.RETURNED_SS;
        log(a, 'Returned to Special Secretary', p.remarks);
        return 'Returned to the Special Secretary.';
      case 'originals':
        if (!markOriginals(a, meU, 'at the department', today())) throw new Error('You have already marked the originals.');
        log(a, (a.kind === 'Renewal' ? 'Original Bank Receipt received at the department' : 'Original documents verified at the department') + ' (' + meU.designation + ')', p.remarks);
        return a.kind === 'Renewal' ? 'Original Bank Receipt marked as received.' : 'Originals marked as verified by you (' + meU.designation + ').';
      case 'brInvalid':
        a.br.status = 'Invalid'; a.br.remarks = p.remarks; a.br.checkedBy = who; a.br.checkedOn = today();
        a.brHistory.push(a.br); a.br = null;
        a.status = ST.BR_INVALID;
        log(a, 'Bank Receipt marked invalid', p.remarks);
        App.notify(a.businessKey, 'Bank Receipt not accepted', a.appId + ': ' + p.remarks + ' Upload a valid Bank Receipt.', a.appId);
        return 'BR marked invalid. The applicant has been asked to upload it again.';
      case 'brVerify': {
        if (!a.originalsVerified) throw new Error('Verify the original documents first. The licence is generated only after the originals are seen.');
        a.br.status = 'Verified'; a.br.checkedBy = who; a.br.checkedOn = today();
        var l = issueLicence(a);
        a.status = ST.ISSUED;
        log(a, 'Bank Receipt verified · licence ' + l.licenceNo + ' generated (valid to ' + App.fmtDate(l.validTo) + ')', p.remarks);
        App.notify(a.businessKey, a.kind === 'Change' ? 'Licence updated' : 'Licence issued', 'Licence ' + l.licenceNo + ' is ready to download. Valid up to ' + App.fmtDate(l.validTo) + '.', a.appId);
        return 'BR verified. Licence ' + l.licenceNo + ' generated.';
      }
    }
    throw new Error('Unknown action');
  }

  // ---------------- Licence generation ----------------
  function nextLicenceNo(circle) {
    var y = today().slice(0, 4), prefix = 'UDD/TL/' + circle + '/' + y + '/', max = 0;
    D().licences.forEach(function (l) { if (l.licenceNo.indexOf(prefix) === 0) max = Math.max(max, parseInt(l.licenceNo.slice(prefix.length), 10)); });
    return prefix + String(max + 1).padStart(4, '0');
  }
  function approver(a) {
    var row = a.history.filter(function (x) { return /^Approved/.test(x.action); }).slice(-1)[0];
    return row ? row.by + ' (' + row.role + ')' : '—';
  }
  function versionFields(f) {
    return { businessName: f.businessName, premisesAddress: f.premisesAddress, locality: f.locality, district: f.district, officeAddress: f.officeAddress };
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  // Full details held on the licence: what was entered in the licence application,
  // updated by each approved renewal / change. Renewal and change forms start from this.
  function licenceDetails(lic) { return clone(lic.details || {}); }
  function issueLicence(a, by) {
    var day = today(), lic;
    derive(a);
    if (a.kind === 'New') {
      lic = { licenceNo: nextLicenceNo(a.circle), businessKey: a.businessKey, circle: a.circle, applicantType: a.applicantType, category: a.category, item: a.item, orgType: a.orgType, firstIssuedOn: day, validTo: fyEnd(day), renewals: [], versions: [],
        fees: { first: { fee: a.fee.base, garbage: a.fee.garbage, on: a.fee.assessedOn, by: a.fee.assessedBy }, renewal: a.fee.base, garbage: a.fee.garbage, history: [] } };
      lic.versions.push(Object.assign({ v: 1, issuedOn: day, appId: a.appId, approvedBy: approver(a), brNo: a.br.brNo, superseded: null, change: null }, versionFields(a.form)));
      lic.details = clone(a.form);
      if (isOldRenewal(a)) lic.oldLicenceNo = a.form.oldLicenceNo;
      D().licences.unshift(lic);
    } else if (a.kind === 'Renewal') {
      lic = App.licence(a.licenceNo);
      // Same licence number; new validity to the next 31 March.
      var next = (+lic.validTo.slice(0, 4) + 1) + '-03-31';
      var cur = fyEnd(day);
      lic.validTo = next > cur ? next : cur;
      lic.renewals.push({ appId: a.appId, on: day, validTo: lic.validTo, fee: a.fee.base, garbage: a.fee.garbage, fine: a.fee.fine, brNo: a.br.brNo, approvedBy: by ? by.name + ' (' + by.role + ')' : approver(a) });
      renewalFields(a).forEach(function (k) { lic.details[k] = a.form[k]; });
    } else {
      lic = App.licence(a.licenceNo);
      var prev = lic.versions[lic.versions.length - 1];
      prev.superseded = day;
      var from = {}, to = {};
      changeFields(a).forEach(function (k) { from[k] = a.change.old[k]; to[k] = a.form[k]; });
      // Same licence number and same validity end date.
      lic.versions.push(Object.assign({ v: prev.v + 1, issuedOn: day, appId: a.appId, approvedBy: approver(a), brNo: a.br.brNo, superseded: null, change: { types: a.change.types.slice(), from: from, to: to } }, versionFields(a.form)));
      if (a.change.types.indexOf('premises') !== -1 && a.form.district) {
        var circ = D().config.circles.filter(function (c) { return c.districts.indexOf(a.form.district) !== -1; })[0];
        if (circ) lic.circle = circ.code;
      }
      lic.details = clone(a.form);
    }
    a.licenceNo = lic.licenceNo;
    return lic;
  }

  // ---------------- Licence-level rules ----------------
  function licenceState(lic) { return lic.validTo < today() ? 'Expired' : 'Active'; }
  function openAppFor(licenceNo, kind) {
    return D().applications.filter(function (a) { return a.licenceNo === licenceNo && (!kind || a.kind === kind) && a.status !== ST.ISSUED; })[0] || null;
  }
  // Renewal window: opens on the 1st of the month N months before expiry (31 March → 2 months = 1 February).
  function renewalOpensOn(lic) {
    var m = D().config.renewalWindow.monthsBefore, d = toDate(lic.validTo);
    return iso(new Date(d.getFullYear(), d.getMonth() - m + 1, 1));
  }
  // Renewal is due once the window has opened (and stays due after expiry – no cut-off).
  function renewalDue(lic) { return today() >= renewalOpensOn(lic); }
  function renewalCheck(lic) {
    var open = openAppFor(lic.licenceNo);
    if (open) return { ok: false, reason: (open.kind === 'Renewal' ? 'A renewal' : 'A change request') + ' (' + open.appId + ') is already in process.' };
    if (!renewalDue(lic)) return { ok: false, reason: 'Valid up to ' + App.fmtDate(lic.validTo) + '. Renewal opens on ' + App.fmtDate(renewalOpensOn(lic)) + '.' };
    return { ok: true };
  }
  // Change request: not while renewal is due, and only one at a time.
  function changeCheck(lic) {
    var open = openAppFor(lic.licenceNo);
    if (open) return { ok: false, reason: (open.kind === 'Change' ? 'A change request' : 'A renewal') + ' (' + open.appId + ') is in process. Only one request at a time is allowed.' };
    if (renewalDue(lic)) return { ok: false, reason: 'Renewal is due' + (licenceState(lic) === 'Expired' ? '' : ' (window opened on ' + App.fmtDate(renewalOpensOn(lic)) + ')') + '. Complete the renewal first; then you can request a change.' };
    return { ok: true };
  }
  function currentVersion(lic) { return lic.versions[lic.versions.length - 1]; }

  // ---------------- Complete the seed ----------------
  // Seed records carry only the form: fill the summary fields and, where the seed left
  // them empty, one uploaded file per required document (dated the first submission).
  function slug(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 18); }
  D().applications.forEach(function (a) {
    derive(a);
    a.originalsChecks = a.originalsChecks || [];
    a.originalsVerified = a.originalsChecks.length > 0;
    a.originalsVerifiedBy = originalsText(a) || null;
    if (!a.docs) {
      a.docs = {};
      docList(a).forEach(function (d) { a.docs[d.key] = { file: d.key + '_' + slug(a.form.businessName) + (d.key === 'photo' ? '.jpg' : '.pdf'), v: 1, on: a.firstSubmittedOn }; });
    }
  });
  D().licences.forEach(function (l) { derive({ applicantType: l.applicantType, category: l.category, item: l.item, form: l.details }); l.orgType = l.orgType || purpose({ category: l.category, item: l.item, form: l.details }); });

  global.TLFlow = {
    TYPES: TYPES, typeOf: typeOf, FIELDS: FIELDS, SECTIONS: SECTIONS, sectionLabel: sectionLabel, field: field, fieldsFor: fieldsFor, applies: applies, isRequired: isRequired, labelOf: labelOf, inputType: inputType, fieldLabel: fieldLabel, showValue: showValue,
    QUESTIONS: QUESTIONS, items: items, categoriesOf: categoriesOf, findItem: findItem, itemDocs: itemDocs, purpose: purpose, derive: derive,
    CHANGE_TYPES: CHANGE_TYPES, changeFields: changeFields, renewalFields: renewalFields,
    docTypes: docTypes, docType: docType, FORMATS: FORMATS, formatUrl: formatUrl, WHEN: WHEN, docList: docList, docKeys: docKeys, docRequired: docRequired, docLabel: docLabel, docMappings: docMappings,
    ST: ST, isOpen: isOpen, pendingWith: pendingWith, canAct: canAct, canReassign: canReassign, visibleTo: visibleTo, isOldRenewal: isOldRenewal,
    originals: originals, originalsBy: originalsBy, originalsText: originalsText, clearOriginals: clearOriginals,
    renewalFine: renewalFine, renewalAmounts: renewalAmounts, computeFee: computeFee, fyEnd: fyEnd, fyLabel: fyLabel, addDays: addDays, daysBetween: daysBetween,
    nextAppId: nextAppId, submit: submit, act: act, log: log, brDuplicate: brDuplicate, brProblem: brProblem, issueLicence: issueLicence,
    licenceState: licenceState, openAppFor: openAppFor, renewalOpensOn: renewalOpensOn, renewalDue: renewalDue, renewalCheck: renewalCheck, changeCheck: changeCheck, currentVersion: currentVersion, licenceDetails: licenceDetails, staffName: staffName
  };
})(window);
