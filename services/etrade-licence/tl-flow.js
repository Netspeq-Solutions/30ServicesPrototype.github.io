/* ==========================================================================
   e-Trade Licence (UDD) – workflow engine
   New / Change:  Inspector (inspection report + fee assessment) → BO → then,
                  as the BO chooses: Joint Director / Director, Special
                  Secretary or the Issuing Authority directly.
                  Joint Director / Director → Special Secretary or Issuing Authority.
                  Special Secretary → Issuing Authority, or approves himself / herself.
                  Approval fixes the fee → applicant generates the challan,
                  pays at the bank, uploads the BR → BR verified → Licence.
   Renewal:       Applicant submits the renewal request (GST certificate, any
                  items added / removed) → Inspector works out the fee (licence
                  fee, garbage fee, late fee, backlog, penalties …) → BO approves
                  → challan, BR → BR verified → Renewed licence.
   No outright rejection: only send-backs. Remarks are mandatory on every
   return, and on every action of the Joint Director / Director, Special
   Secretary and Issuing Authority. A corrected application goes back to the
   officer who returned it. Every action is written to the history and audit log.
   ========================================================================== */
(function (global) {
  'use strict';
  var App = global.TLApp;
  function D() { return App.data; }
  function today() { return D().demoToday; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

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
    { key: 'oldLicenceNo', label: 'Licence number / BRN No.', section: 'oldLicence', required: true, mono: true, when: oldLic, hint: 'As printed on the old trade licence. The same number is kept; only the year part changes.' },
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

  // ---------------- Licence purpose: items and sub-items (multi-select) ----------------
  // config.categories is the items master kept by the Department Admin (items-master.html):
  // item = purpose of licence; sub-item = activity as per the UDD notification. Some items have no sub-items.
  // An application or licence holds one or more purposes: a.purposes = [{ category, item }]
  // (item = sub-item name, or '' for an item without sub-items). a.category / a.item keep the first one.
  // Inactive entries are hidden from new applications but kept for old records.
  function items(code, all) {
    var c = App.category(code);
    return c ? (c.items || []).filter(function (x) { return all || x.active !== false; }) : [];
  }
  function categoriesOf(type, all) { return D().config.categories.filter(function (c) { return c.type === type && (all || c.active !== false); }); }
  function named(x, name) { return x.name === name || (x.formerNames || []).indexOf(name) !== -1; }
  function purposesOf(a) {
    if (a.purposes && a.purposes.length) return a.purposes;
    return a.category ? [{ category: a.category, item: a.item || '' }] : [];
  }
  function purposeKey(p) { return p.category + '|' + (p.item || ''); }
  function samePurposes(x, y) {
    var kx = (x || []).map(purposeKey).sort(), ky = (y || []).map(purposeKey).sort();
    return kx.join('§') === ky.join('§');
  }
  function hasCategory(a, code) { return purposesOf(a).some(function (p) { return p.category === code; }); }
  // Purposes added / removed against the licence (renewal or change request).
  function prevPurposes(a) { return a.prevPurposes || []; }
  function addedPurposes(a) { var old = prevPurposes(a).map(purposeKey); return purposesOf(a).filter(function (p) { return old.indexOf(purposeKey(p)) === -1; }); }
  function removedPurposes(a) { var now = purposesOf(a).map(purposeKey); return prevPurposes(a).filter(function (p) { return now.indexOf(purposeKey(p)) === -1; }); }
  function purposeChanged(a) { return !!a.prevPurposes && !samePurposes(a.prevPurposes, purposesOf(a)); }

  // Questions the chosen items switch on in the form (any of them).
  function ctx(a) {
    var on = {};
    purposesOf(a).forEach(function (p) { var c = App.category(p.category); Object.keys((c && c.asks) || {}).forEach(function (k) { if (c.asks[k]) on[k] = true; }); });
    return { type: typeOf(a), asks: on };
  }
  function applies(f, a) { var c = ctx(a); return (!f.who || f.who === c.type) && (!f.when || f.when(a.form || {}, c)); }
  function fieldsFor(a, section) { return FIELDS.filter(function (f) { return (!section || f.section === section) && applies(f, a); }); }
  function isRequired(f, a) { return f.required === true || f.required === typeOf(a); }
  function labelOf(f, type) { return (f.labels && f.labels[type]) || f.label; }
  function inputType(f, type) { return (f.types && f.types[type]) || f.type || 'text'; }
  var PSEUDO = { circle: 'Circle', category: 'Applicant type, items & sub-items', purposes: 'Items & sub-items (purpose)', br: 'Bank Receipt' };
  function fieldLabel(key, type) { var f = field(key); return f ? labelOf(f, type || 'IND') : (PSEUDO[key] || key); }
  function showValue(f, v) {
    if (f && f.type === 'check') return v ? 'Yes' : 'No';
    return v === '' || v == null ? '—' : String(v);
  }

  // Questions an item can switch on in the form (items master).
  var QUESTIONS = { hotel: 'Hotel details (rooms, parking, restaurant, tours & travels)', franchise: 'Franchise of a head office / parent company', education: 'Educational institute / tutorial' };

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
  // Documents mapped to the chosen items and sub-items in the items master: [{ key, req, from }].
  // list: purposes to use (default: all of the application). A company under "Others" that picks a notified item also gets that item's documents.
  function itemDocs(a, list) {
    var out = [], seen = {};
    function take(x) {
      if (!x || seen[x.code]) return;
      seen[x.code] = true;
      (x.docs || []).forEach(function (d) { out.push({ key: d.key, req: d.req, from: x.name }); });
    }
    (list || purposesOf(a)).forEach(function (p) {
      take(App.category(p.category));
      if (!p.item) return;
      var it = items(p.category, true).filter(function (i) { return named(i, p.item); })[0];
      if (it) { take(it); return; }
      var f = findItem(p.item);
      if (f) { take(f.cat); take(f.item); }
    });
    return out;
  }
  function purposeName(p, form) {
    var c = App.category(p.category);
    if (!c) return p.item || '';
    if (p.category === 'OTHER') return ((form && form.otherPurpose) || 'Others') + (p.item ? ' (' + p.item + ')' : '');
    return p.item || c.name;
  }
  function purposeNames(a, list) { return (list || purposesOf(a)).map(function (p) { return purposeName(p, a.form || a.details); }); }
  function purpose(a) { return purposeNames(a).join('; '); }
  // Item (category) names, each once: "Animal Husbandry …; Green Grocery …".
  function categoryNames(a) {
    var out = [];
    purposesOf(a).forEach(function (p) { var c = App.category(p.category); if (c && out.indexOf(c.name) === -1) out.push(c.name); });
    return out.join('; ');
  }
  function categoryShort(a) {
    var ps = purposesOf(a), c = ps.length ? App.category(ps[0].category) : null;
    var n = 0, seen = {};
    ps.forEach(function (p) { if (!seen[p.category]) { seen[p.category] = 1; n++; } });
    return c ? c.short + (n > 1 ? ' +' + (n - 1) : '') : '—';
  }

  // Fill the summary fields used on the licence, lists and certificate from the form.
  function join(parts) { return parts.filter(function (x) { return x != null && String(x).trim() !== ''; }).join(', '); }
  var PRES = ['HouseNo', 'Street', 'Locality', 'Address', 'Po', 'Ps', 'District'];
  function derive(a) {
    var f = a.form = a.form || {}, isComp = typeOf(a) === 'COMP';
    a.purposes = clone(purposesOf(a));
    a.category = a.purposes.length ? a.purposes[0].category : '';
    a.item = a.purposes.length ? a.purposes[0].item : '';
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

  // Change requests: only these fields can be edited. "purpose" changes the items, not form fields.
  var CHANGE_TYPES = {
    name: { label: 'Change of name', hint: 'Name of the firm / company' },
    premises: { label: 'Change of premises', hint: 'Place of business and house owner' },
    address: { label: 'Change of address', hint: 'Permanent address of the applicant' },
    purpose: { label: 'Add / remove items', hint: 'Items and sub-items (purpose) on the licence' }
  };
  function changeFields(a, types) {
    var out = [];
    (types || (a.change && a.change.types) || []).forEach(function (t) {
      if (t === 'purpose') return;
      var keys = t === 'name' ? [typeOf(a) === 'COMP' ? 'companyName' : 'firmName']
        : fieldsFor(a, t === 'premises' ? 'firm' : 'perm').map(function (f) { return f.key; }).filter(function (k) { return k !== 'firmName'; });
      keys.forEach(function (k) { if (out.indexOf(k) === -1) out.push(k); });
    });
    return out;
  }
  function changesPurpose(a) { return a.kind === 'Change' ? !!a.change && a.change.types.indexOf('purpose') !== -1 : a.kind === 'Renewal'; }
  // Renewal: only the contact details can be updated (and items added / removed); everything else is carried over from the licence.
  function renewalFields(a) { return ['mobile', 'landline', 'email'].filter(function (k) { return applies(field(k), a); }); }

  // ---------------- Documents ----------------
  // config.docTypes is the document types master kept by the Department Admin (documents-master.html).
  // A document is asked for when: it applies to every applicant of the type (base), to every renewal,
  // to a change request of that type, to an answer in the form (when), or it is mapped to a chosen
  // item / sub-item (items master). 'M' = mandatory, 'O' = optional; mandatory wins.
  // Renewal / change that adds items: only the item documents the licence does not already hold.
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
  // Documents of the items added on a renewal / change that the licence does not hold yet.
  function newItemDocs(a) {
    var lic = a.licenceNo ? App.licence(a.licenceNo) : null, have = (lic && lic.docKeys) || [];
    return itemDocs(a, addedPurposes(a)).filter(function (m) { return have.indexOf(m.key) === -1; });
  }
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
    function added() { newItemDocs(a).forEach(function (m) { add(m.key, m.req, m.from + ' (item added)'); }); }
    if (a.kind === 'Renewal') {
      docTypes().forEach(function (d) { add(d.key, d.renewal); });
      if (purposeChanged(a)) added();
    } else if (a.kind === 'Change') {
      ((a.change && a.change.types) || []).forEach(function (t) { docTypes().forEach(function (d) { add(d.key, (d.change || {})[t], CHANGE_TYPES[t] ? CHANGE_TYPES[t].label : ''); }); });
      if (changesPurpose(a)) added();
    } else {
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
  function docLabel(key) { if (key === 'br') return 'Bank Receipt'; var d = docType(key); return d ? d.name : key; }
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
  // Quarter of the financial year: Q1 = Apr–Jun … Q4 = Jan–Mar.
  function fyQuarter(isoStr) { var m = toDate(isoStr).getMonth(); return 'Q' + (m >= 3 ? Math.floor((m - 3) / 3) + 1 : 4); }

  // ---------------- Fees ----------------
  // Charges (assessment by the Inspector / BO, and the fee fixed on approval):
  //   { base: licence / renewal / change fee, garbage, late, backlog, penalty, others: [{ label, amount }] }
  // The fee fixed on approval also carries exempt: { late | backlog | penalty | o<i>: { by, role, on, remarks } }:
  // after approval the Inspector or BO may exempt the late fee, backlog fee, penalties or other charges.
  var EXEMPTIBLE = ['late', 'backlog', 'penalty'];
  function kindFee(kind) { return kind === 'Renewal' ? 'Renewal' : (kind === 'Change' ? 'Change' : 'Licence'); }
  function charges(x) {
    x = x || {};
    return { base: Math.round(+x.base || 0), garbage: Math.round(+x.garbage || 0), late: Math.round(+x.late || 0), lateDays: x.lateDays || 0, backlog: Math.round(+x.backlog || 0), penalty: Math.round(+x.penalty || 0),
      others: (x.others || []).filter(function (o) { return o && o.label && +o.amount > 0; }).map(function (o) { return { label: String(o.label), amount: Math.round(+o.amount) }; }) };
  }
  // Lines of a charge set: [{ key, label, amount, exemptible, exempt }]. Zero lines are left out unless keepZero.
  function feeLines(x, kind, keepZero) {
    if (!x) return [];
    kind = kindFee(kind || x.kind);
    var ex = x.exempt || {};
    var lines = [
      { key: 'base', label: kind + ' fee', amount: +x.base || 0 },
      { key: 'garbage', label: 'Garbage fee', amount: +x.garbage || 0 },
      { key: 'late', label: 'Late fee' + (x.lateDays ? ' (' + x.lateDays + ' days × ₹' + D().config.renewalFine.perDay + ')' : ''), amount: +x.late || 0 },
      { key: 'backlog', label: 'Backlog fee', amount: +x.backlog || 0 },
      { key: 'penalty', label: 'Penalties', amount: +x.penalty || 0 }
    ].concat((x.others || []).map(function (o, i) { return { key: 'o' + i, label: o.label, amount: +o.amount || 0 }; }));
    return lines.filter(function (l) { return keepZero || l.amount > 0 || l.key === 'base' || l.key === 'garbage'; }).map(function (l) {
      l.exemptible = l.key !== 'base' && l.key !== 'garbage';
      l.exempt = l.exemptible && ex[l.key] ? ex[l.key] : null;
      return l;
    });
  }
  function feeGross(x) { return feeLines(x).reduce(function (n, l) { return n + l.amount; }, 0); }
  function feeExempted(x) { return feeLines(x).reduce(function (n, l) { return n + (l.exempt ? l.amount : 0); }, 0); }
  function feeTotal(x) { return feeGross(x) - feeExempted(x); }
  function feeLineText(x, kind) { return feeLines(x, kind).map(function (l) { return l.label.replace(/ \(.*\)$/, '').toLowerCase() + ' ' + App.inr(l.amount); }).join(' + '); }
  // Renewal late fee: grace of N days after expiry (31 March); ₹5 per day after that,
  // counted to the FIRST submission date of the renewal. No cut-off.
  function renewalFine(validTo, submittedOn) {
    var rule = D().config.renewalFine;
    var graceEnd = addDays(validTo, rule.graceDays);
    var late = submittedOn ? Math.max(0, daysBetween(graceEnd, submittedOn)) : 0;
    return { graceEnd: graceEnd, lateDays: late, fine: late * rule.perDay, perDay: rule.perDay };
  }
  // Renewal amounts held on the licence: start from the first licence fee, revised by the Department.
  function renewalAmounts(lic) { return (lic && lic.fees) || { renewal: 0, garbage: 0, history: [] }; }
  // Starting point for the fee assessment form: the current assessment, or for a renewal the
  // licence's renewal amount + garbage fee + the late fee worked out by the system rule.
  function suggestedCharges(a) {
    if (a.assessment) return a.assessment;
    if (a.kind === 'Renewal') {
      var lic = App.licence(a.licenceNo), r = renewalAmounts(lic), f = lic ? renewalFine(lic.validTo, a.firstSubmittedOn || today()) : { fine: 0, lateDays: 0 };
      return { base: r.renewal, garbage: r.garbage, late: f.fine, lateDays: f.lateDays, backlog: 0, penalty: 0, others: [], suggested: true };
    }
    return null;
  }
  // The fee fixed on approval: the assessment of the Inspector / BO.
  function computeFee(a, onDate) {
    var s = a.assessment;
    if (!s) return null;
    var f = Object.assign(charges(s), { kind: kindFee(a.kind), exempt: {}, assessedBy: s.by, assessedRole: s.role || 'Inspector', assessedOn: s.on, fixedOn: onDate || today() });
    f.total = feeTotal(f);
    return f;
  }

  // ---------------- Statuses ----------------
  var ST = {
    DRAFT: 'Draft', SUBMITTED: 'Submitted', UNDER_INSPECTION: 'Under Inspection', RETURNED: 'Returned to Applicant', RESUBMITTED: 'Resubmitted',
    WITH_BO: 'With BO', RETURNED_BO: 'Returned to BO',
    WITH_JD: 'With Joint Director / Director', RETURNED_JD: 'Returned to Joint Director / Director',
    WITH_SS: 'With Special Secretary', RETURNED_SS: 'Returned to Special Secretary',
    WITH_HOD: 'With Issuing Authority',
    PAYMENT: 'Approved – Payment Pending', BR_UPLOADED: 'BR Uploaded', BR_INVALID: 'BR Invalid', ISSUED: 'Licence Issued'
  };
  var CLOSED = [ST.ISSUED];
  function isOpen(a) { return CLOSED.indexOf(a.status) === -1 && a.status !== ST.DRAFT; }
  // Senior stages after the BO.
  var STAGE = {
    bo: { label: 'BO', with: ST.WITH_BO, back: ST.RETURNED_BO },
    jd: { label: 'Joint Director / Director', with: ST.WITH_JD, back: ST.RETURNED_JD },
    ss: { label: 'Special Secretary', with: ST.WITH_SS, back: ST.RETURNED_SS },
    hod: { label: 'Issuing Authority', with: ST.WITH_HOD, back: null }
  };
  // Where each officer may send the application on (BO: any senior stage; Joint Director / Director: SS or IA; SS: IA).
  var FORWARD_TO = { bo: ['jd', 'ss', 'hod'], jd: ['ss', 'hod'], ss: ['hod'] };
  // Officers who must give remarks on every action.
  var REMARKS_REQUIRED = ['jd', 'ss', 'hod'];

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
    if (s === ST.WITH_JD || s === ST.RETURNED_JD) return { role: 'jd', label: 'Joint Director / Director' };
    if (s === ST.WITH_SS || s === ST.RETURNED_SS) return { role: 'ss', label: 'Special Secretary' };
    if (s === ST.WITH_HOD) return { role: 'hod', label: 'Issuing Authority (CCS / Secretary)' };
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
  // After approval and before the BR is uploaded, the Inspector or the BO may exempt the late fee, backlog fee, penalties or other charges.
  function canExempt(a, userId) {
    var u = D().staff[userId];
    if (!u || u.circle !== a.circle || !a.fee) return false;
    if (u.role !== 'inspector' && !(u.role === 'bo' && a.selectedBo === userId)) return false;
    if (a.status !== ST.PAYMENT && a.status !== ST.BR_INVALID) return false;
    return feeLines(a.fee).some(function (l) { return l.exemptible && !l.exempt && l.amount > 0; });
  }
  // Applications this user can see in "All applications".
  function visibleTo(a, userId) {
    var u = D().staff[userId];
    if (!u || a.circle !== u.circle || a.status === ST.DRAFT) return false;
    if (u.role === 'bo') return a.selectedBo === userId || (a.returnedBy && a.returnedBy.userId === userId) || (a.boHistory || []).indexOf(userId) !== -1;
    return true; // Inspectors, Joint Director / Director, Special Secretary, Issuing Authority and Department Admin (view only) see the whole circle
  }
  // Return options for the officer holding the application: [{ to, label }].
  function returnTargets(a, role) {
    if (role === 'jd') return [{ to: 'bo', label: 'BO' }];
    if (role === 'ss') return [{ to: 'bo', label: 'BO' }, { to: 'jd', label: 'Joint Director / Director' }];
    if (role === 'hod') { var prev = (a.path || []).filter(function (r) { return r !== 'hod'; }).slice(-1)[0] || 'bo'; return [{ to: prev, label: STAGE[prev].label }]; }
    return [];
  }
  // Senior stages passed in this pass (for the progress path): ['jd', 'ss', 'hod'] in the order reached.
  function enterStage(a, role) {
    var p = (a.path || []).slice(), i = p.indexOf(role);
    if (i !== -1) p = p.slice(0, i);
    p.push(role);
    a.path = p;
  }
  function backToStage(a, role) {
    if (role === 'bo') { a.path = []; return; }
    var p = (a.path || []).slice(), i = p.indexOf(role);
    a.path = i === -1 ? p.concat([role]) : p.slice(0, i + 1);
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

  // ---------------- Challan & Bank Receipt ----------------
  // After approval the applicant generates a challan for the fee payable, pays it at the bank and uploads the BR.
  // A challan for an older amount (e.g. before an exemption) is superseded and must be generated again.
  function challanValid(a) { return !!(a.challan && a.challan.status !== 'Superseded' && a.fee && a.challan.amount === a.fee.total); }
  function generateChallan(a) {
    if (a.challan) { if (a.challan.status !== 'Superseded') a.challan.status = 'Superseded'; a.challanHistory = (a.challanHistory || []).concat([a.challan]); }
    var n = (a.challanHistory || []).length + 1;
    a.challan = { no: 'UDD/CH/' + fyLabel(today()).replace('-', '') + '/' + a.appId.slice(-6) + '-' + n, on: today(), amount: a.fee.total, status: 'Generated' };
    log(a, 'Challan generated · ' + a.challan.no + ' · ' + App.inr(a.challan.amount), '');
    return a.challan;
  }
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
  var KIND_TEXT = { New: 'Application', Renewal: 'Renewal request', Change: 'Change request' };
  function submit(a) {
    var biz = D().businesses[a.businessKey];
    derive(a);
    if (a.status === ST.DRAFT) {
      a.status = ST.SUBMITTED;
      a.firstSubmittedOn = a.submittedOn = today();
      log(a, KIND_TEXT[a.kind] + ' submitted' + (purposeChanged(a) ? ' (items added / removed)' : ''), '');
      App.notify(a.businessKey, KIND_TEXT[a.kind] + ' submitted', a.appId + ' is submitted and is now with the Inspector.' + (a.kind === 'Renewal' ? ' You will see the fee to pay once the renewal is approved.' : ''), a.appId);
      return;
    }
    if (a.status === ST.RETURNED) {
      a.status = ST.RESUBMITTED;
      a.submittedOn = today();
      a.round = (a.round || 1) + 1;
      var to = a.returnedBy && a.returnedBy.role === 'bo' ? 'BO ' + staffName(a.returnedBy.userId) : 'the Inspector';
      log(a, 'Corrected and resubmitted – goes back to ' + to, '');
      App.notify(a.businessKey, 'Application resubmitted', a.appId + ' is resubmitted and goes back to ' + to + '.', a.appId);
      a.correction = null;
    }
    if (biz) biz.lastActiveOn = today();
  }

  // ---------------- Original documents ----------------
  // The Inspector and the BO can each verify the originals (new licence and change requests).
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
  // Originals are checked for a new licence and change requests; renewals rely on the documents already on the licence.
  function needsOriginals(a) { return a.kind !== 'Renewal'; }

  // ---------------- Officer actions ----------------
  // Fee assessment (Inspector, or BO revising it): kept only when it differs; earlier assessments are kept.
  function assess(a, meU, input) {
    var next = charges(input), prev = a.assessment;
    if (prev && JSON.stringify(charges(prev)) === JSON.stringify(next)) return '';
    if (prev) a.assessmentHistory = (a.assessmentHistory || []).concat([prev]);
    a.assessment = Object.assign(next, { by: meU.name, role: meU.designation, on: today() });
    return (prev ? 'fee revised from ' + App.inr(feeTotal(prev)) + ' to ' : 'fee assessed ') + App.inr(feeTotal(a.assessment)) + ' (' + feeLineText(a.assessment, a.kind) + ')';
  }
  // payload: { remarks, boId, to, notes, visitDate, files, originals, noteId, fields, docs, assess, lines }
  function act(a, action, p) {
    p = p || {};
    var s = App.getSession(), me = s && s.userId, meU = D().staff[me];
    var allowed = action === 'reassignBo' ? canReassign(a, me) : (action === 'exempt' ? canExempt(a, me) : (canAct(a, me) || action === 'editNote'));
    if (!allowed) throw new Error('You cannot act on this application at its current stage.');
    if (REMARKS_REQUIRED.indexOf(meU.role) !== -1 && ['forward', 'approve', 'returnTo'].indexOf(action) !== -1 && String(p.remarks || '').trim().length < 5)
      throw new Error('Remarks are mandatory for the ' + meU.designation + '.');
    var who = meU.name + ' (' + meU.designation + ')';
    switch (action) {
      case 'start':
        a.status = ST.UNDER_INSPECTION; a.returnedBy = null;
        log(a, 'Verification started', p.remarks);
        return 'Verification started.';
      case 'note': {
        var senior = meU.role === 'jd' || meU.role === 'ss';
        var origNow = !senior && !!p.originals && needsOriginals(a) && markOriginals(a, meU, 'at inspection', p.visitDate || today());
        a.inspections.push({ id: 'N-' + a.appId.slice(-3) + '-' + (a.inspections.length + 1), by: me, byName: meU.name, role: meU.designation, visitDate: senior ? null : (p.visitDate || null), at: App.stamp(), notes: p.notes, files: p.files || [], originalsCollected: origNow, edits: [] });
        var feeTxt = p.assess ? assess(a, meU, p.assess) : '';
        if (senior) { log(a, meU.designation + ' note added', ''); return 'Note saved.'; }
        var what = meU.role === 'bo' ? 'Re-inspection note added' : (a.kind === 'Renewal' ? 'Renewal verification note added' : 'Inspection report added');
        log(a, what + (feeTxt ? ' · ' + feeTxt : '') + (origNow ? ' · originals verified at inspection' : ''), p.visitDate ? 'Site visited on ' + App.fmtDate(p.visitDate) : '');
        return (meU.role === 'bo' ? 'Note' : (a.kind === 'Renewal' ? 'Note' : 'Inspection report')) + ' saved' + (feeTxt ? ' with the ' + feeTxt.replace(/ \(.*$/, '') : '') + '.';
      }
      case 'assess': {
        var t = assess(a, meU, p.assess);
        if (!t) throw new Error('No change from the current fee assessment.');
        log(a, 'Fee assessment ' + (a.assessmentHistory && a.assessmentHistory.length ? 'revised' : 'added') + ' · ' + t, p.remarks);
        return 'Fee assessment saved: ' + App.inr(feeTotal(a.assessment)) + '.';
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
        log(a, 'Returned to applicant for correction', p.remarks);
        App.notify(a.businessKey, 'Application returned for correction', a.appId + ': ' + p.remarks, a.appId);
        return 'Returned to the applicant. After correction it comes back to ' + (meU.role === 'bo' ? 'you' : 'the Inspector') + '.';
      }
      case 'forwardBo': {
        if (!a.assessment) throw new Error('Add the ' + (a.kind === 'Renewal' ? 'fee assessment' : 'inspection report with the fee assessment') + ' before forwarding.');
        a.selectedBo = p.boId; a.status = ST.WITH_BO; a.returnedBy = null; a.path = [];
        log(a, 'Forwarded to BO (' + staffName(p.boId) + ')' + (a.kind === 'Renewal' ? ' for approval' : ''), p.remarks);
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
      case 'forward': {
        // BO → Joint Director / Director, Special Secretary or Issuing Authority; JD → SS or IA; SS → IA.
        var to = p.to, okTo = FORWARD_TO[meU.role] || [];
        if (a.kind === 'Renewal') throw new Error('Renewals are approved by the BO.');
        if (okTo.indexOf(to) === -1) throw new Error('Choose where to forward the application.');
        if (!a.assessment) throw new Error('The fee has not been assessed yet.');
        a.status = STAGE[to].with; a.returnedBy = null;
        a.sentBy = { role: meU.role, userId: me };
        enterStage(a, to);
        log(a, (meU.role === 'bo' ? 'Forwarded to ' : 'Approved and forwarded to ') + STAGE[to].label, p.remarks);
        return (meU.role === 'bo' ? 'Forwarded to the ' : 'Approved and forwarded to the ') + STAGE[to].label + '.';
      }
      case 'approve': {
        // Final approval: Issuing Authority or Special Secretary (new / change); BO (renewal).
        var canApprove = a.kind === 'Renewal' ? meU.role === 'bo' : (meU.role === 'hod' || meU.role === 'ss');
        if (!canApprove) throw new Error(a.kind === 'Renewal' ? 'Renewals are approved by the BO.' : 'Final approval is given by the Special Secretary or the Issuing Authority.');
        if (!a.assessment) throw new Error('The fee has not been assessed yet.');
        a.fee = computeFee(a);
        a.status = ST.PAYMENT; a.returnedBy = null;
        a.approvedBy = { name: meU.name, role: meU.designation, on: today() };
        a.challan = null;
        log(a, (a.kind === 'Renewal' ? 'Renewal approved' : 'Approved (final)') + ' – fee ' + App.inr(a.fee.total) + ' fixed (' + feeLineText(a.fee) + ')', p.remarks);
        App.notify(a.businessKey, (a.kind === 'Renewal' ? 'Renewal' : 'Application') + ' approved – pay the fee', a.appId + ' is approved. Generate the challan for ' + App.inr(a.fee.total) + ', pay it at the bank and upload the Bank Receipt.', a.appId);
        return 'Approved. The fee of ' + App.inr(a.fee.total) + ' is shown to the applicant for payment.';
      }
      case 'returnTo': {
        // Return to an officer: Joint Director / Director → BO; SS → BO or JD; Issuing Authority → the officer who sent it.
        var targets = returnTargets(a, meU.role).map(function (x) { return x.to; });
        if (targets.indexOf(p.to) === -1) throw new Error('This return is not allowed.');
        a.status = STAGE[p.to].back;
        backToStage(a, p.to);
        log(a, 'Returned to ' + STAGE[p.to].label + (p.to === 'bo' ? ' (' + staffName(a.selectedBo) + ')' : ''), p.remarks);
        return 'Returned to the ' + STAGE[p.to].label + '.';
      }
      case 'exempt': {
        // Inspector / BO, after approval: exempt the late fee, backlog fee, penalties or other charges.
        var lines = feeLines(a.fee).filter(function (l) { return l.exemptible && !l.exempt && (p.lines || []).indexOf(l.key) !== -1; });
        if (!lines.length) throw new Error('Choose at least one charge to exempt.');
        if (String(p.remarks || '').trim().length < 5) throw new Error('Enter the order reference or remarks for the exemption.');
        var was = a.fee.total;
        a.fee.exempt = a.fee.exempt || {};
        lines.forEach(function (l) { a.fee.exempt[l.key] = { by: meU.name, role: meU.designation, on: today(), remarks: p.remarks }; });
        a.fee.total = feeTotal(a.fee);
        if (a.challan && a.challan.amount !== a.fee.total) a.challan.status = 'Superseded';
        log(a, 'Exempted ' + lines.map(function (l) { return l.label.replace(/ \(.*\)$/, '').toLowerCase() + ' ' + App.inr(l.amount); }).join(', ') + ' · fee payable ' + App.inr(was) + ' → ' + App.inr(a.fee.total), p.remarks);
        App.notify(a.businessKey, 'Fee revised – charges exempted', a.appId + ': the fee payable is now ' + App.inr(a.fee.total) + '.' + (a.challan && a.challan.status === 'Superseded' ? ' Generate a new challan before paying.' : ''), a.appId);
        return 'Exempted. Fee payable is now ' + App.inr(a.fee.total) + '.';
      }
      case 'originals':
        if (!markOriginals(a, meU, 'at the department', today())) throw new Error('You have already marked the originals.');
        log(a, 'Original documents verified at the department (' + meU.designation + ')', p.remarks);
        return 'Originals marked as verified by you (' + meU.designation + ').';
      case 'brInvalid':
        a.br.status = 'Invalid'; a.br.remarks = p.remarks; a.br.checkedBy = who; a.br.checkedOn = today();
        a.brHistory.push(a.br); a.br = null;
        a.status = ST.BR_INVALID;
        log(a, 'Bank Receipt marked invalid', p.remarks);
        App.notify(a.businessKey, 'Bank Receipt not accepted', a.appId + ': ' + p.remarks + ' Upload a valid Bank Receipt.', a.appId);
        return 'BR marked invalid. The applicant has been asked to upload it again.';
      case 'brVerify': {
        if (needsOriginals(a) && !a.originalsVerified) throw new Error('Verify the original documents first. The licence is generated only after the originals are seen.');
        var pr = brProblem(a);
        if (pr) throw new Error(pr);
        a.br.status = 'Verified'; a.br.checkedBy = who; a.br.checkedOn = today();
        var l = issueLicence(a);
        a.status = ST.ISSUED;
        recordPayment(a);
        log(a, 'Bank Receipt verified · licence ' + l.licenceNo + (a.kind === 'Renewal' ? ' renewed' : ' generated') + ' (valid to ' + App.fmtDate(l.validTo) + ')', p.remarks);
        App.notify(a.businessKey, a.kind === 'Change' ? 'Licence updated' : (a.kind === 'Renewal' ? 'Licence renewed' : 'Licence issued'), 'Licence ' + l.licenceNo + ' is ready to download. Valid up to ' + App.fmtDate(l.validTo) + '.', a.appId);
        return 'BR verified. Licence ' + l.licenceNo + (a.kind === 'Renewal' ? ' renewed.' : ' generated.');
      }
    }
    throw new Error('Unknown action');
  }

  // ---------------- Collections ledger (reports) ----------------
  // One row per verified BR: what was collected, by charge, and what was exempted.
  function ledgerRow(o) {
    var c = o.charges || {}, ls = feeLines(c, o.kind), get = function (k) { var l = ls.filter(function (x) { return x.key === k; })[0]; return l && !l.exempt ? l.amount : 0; };
    var other = ls.filter(function (l) { return /^o\d+$/.test(l.key) && !l.exempt; }).reduce(function (n, l) { return n + l.amount; }, 0);
    return { appId: o.appId || null, licenceNo: o.licenceNo, kind: o.kind, on: o.on, brNo: o.brNo || '', base: get('base'), garbage: get('garbage'), late: get('late'), backlog: get('backlog'), penalty: get('penalty'), other: other, exempted: feeExempted(c), total: feeTotal(c) };
  }
  function recordPayment(a) {
    D().payments = D().payments || [];
    D().payments.push(ledgerRow({ appId: a.appId, licenceNo: a.licenceNo, kind: a.kind, on: today(), brNo: a.br.brNo, charges: a.fee }));
  }

  // ---------------- Licence generation ----------------
  // Licence number format is awaited from the department (may depend on the district, type etc.).
  function nextLicenceNo(circle) {
    var y = today().slice(0, 4), prefix = 'UDD/TL/' + circle + '/' + y + '/', max = 0;
    D().licences.forEach(function (l) { if (l.licenceNo.indexOf(prefix) === 0) max = Math.max(max, parseInt(l.licenceNo.slice(prefix.length), 10)); });
    return prefix + String(max + 1).padStart(4, '0');
  }
  // Renewal of a licence issued before this system: the same number, only the year part changes.
  function oldRenewalNo(old, day) {
    var y = (day || today()).slice(0, 4), s = String(old || '').trim(), m = s.match(/(19|20)\d{2}(?!.*(19|20)\d{2})/);
    return m ? s.slice(0, m.index) + y + s.slice(m.index + 4) : s + '/' + y;
  }
  function approver(a) {
    if (a.approvedBy) return a.approvedBy.name + ' (' + a.approvedBy.role + ')';
    var row = a.history.filter(function (x) { return /^(Approved \(final\)|Approved –|Renewal approved)/.test(x.action); }).slice(-1)[0];
    return row ? row.by + ' (' + row.role + ')' : '—';
  }
  function versionFields(f) {
    return { businessName: f.businessName, premisesAddress: f.premisesAddress, locality: f.locality, district: f.district, officeAddress: f.officeAddress };
  }
  // Full details held on the licence: what was entered in the licence application,
  // updated by each approved renewal / change. Renewal and change forms start from this.
  function licenceDetails(lic) { return clone(lic.details || {}); }
  function addDocKeys(lic, a) { lic.docKeys = (lic.docKeys || []).concat(Object.keys(a.docs || {}).filter(function (k) { return (lic.docKeys || []).indexOf(k) === -1; })); }
  function setPurposes(lic, a) {
    lic.purposes = clone(a.purposes);
    lic.category = a.category; lic.item = a.item; lic.orgType = a.orgType;
  }
  function issueLicence(a, by) {
    var day = today(), lic, prev;
    derive(a);
    if (a.kind === 'New') {
      var no = isOldRenewal(a) ? oldRenewalNo(a.form.oldLicenceNo, day) : nextLicenceNo(a.circle);
      lic = { licenceNo: no, businessKey: a.businessKey, circle: a.circle, applicantType: a.applicantType, firstIssuedOn: day, validTo: fyEnd(day), renewals: [], versions: [], firstCharges: clone(a.fee),
        fees: { first: { fee: a.fee.base, garbage: a.fee.garbage, on: a.fee.assessedOn, by: a.fee.assessedBy }, renewal: a.fee.base, garbage: a.fee.garbage, history: [] } };
      setPurposes(lic, a);
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
      lic.renewals.push({ appId: a.appId, on: day, validTo: lic.validTo, fee: a.fee.base, garbage: a.fee.garbage, fine: a.fee.late, charges: clone(a.fee), brNo: a.br.brNo, approvedBy: by ? by.name + ' (' + by.role + ')' : approver(a) });
      renewalFields(a).forEach(function (k) { lic.details[k] = a.form[k]; });
      if (purposeChanged(a)) {
        // Items added / removed with the renewal: a new version of the licence.
        prev = lic.versions[lic.versions.length - 1];
        prev.superseded = day;
        lic.versions.push(Object.assign({ v: prev.v + 1, issuedOn: day, appId: a.appId, approvedBy: approver(a), brNo: a.br.brNo, superseded: null,
          change: { types: ['purpose'], from: { purposes: purposeNames(a, a.prevPurposes).join('; ') }, to: { purposes: a.orgType } } }, versionFields(a.form)));
        setPurposes(lic, a);
      }
    } else {
      lic = App.licence(a.licenceNo);
      prev = lic.versions[lic.versions.length - 1];
      prev.superseded = day;
      var from = {}, to = {};
      changeFields(a).forEach(function (k) { from[k] = a.change.old[k]; to[k] = a.form[k]; });
      if (changesPurpose(a)) { from.purposes = purposeNames(a, a.prevPurposes).join('; '); to.purposes = a.orgType; setPurposes(lic, a); }
      // Same licence number and same validity end date. The circle does not change with the premises district.
      lic.versions.push(Object.assign({ v: prev.v + 1, issuedOn: day, appId: a.appId, approvedBy: approver(a), brNo: a.br.brNo, superseded: null, change: { types: a.change.types.slice(), from: from, to: to } }, versionFields(a.form)));
      lic.details = clone(a.form);
    }
    addDocKeys(lic, a);
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
  // Change request (including adding / removing items): only one request at a time. While renewal is due,
  // items can be added or removed with the renewal; other changes wait until the renewal is done.
  function changeCheck(lic) {
    var open = openAppFor(lic.licenceNo);
    if (open) return { ok: false, reason: (open.kind === 'Change' ? 'A change request' : 'A renewal') + ' (' + open.appId + ') is in process. Only one request at a time is allowed.' };
    if (renewalDue(lic)) return { ok: false, reason: 'Renewal is due' + (licenceState(lic) === 'Expired' ? '' : ' (window opened on ' + App.fmtDate(renewalOpensOn(lic)) + ')') + '. You can add or remove items with the renewal; other changes can be requested after it.' };
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
    if (a.fee && a.fee.total == null) a.fee.total = feeTotal(a.fee);
    if (!a.docs) {
      a.docs = {};
      docList(a).forEach(function (d) { a.docs[d.key] = { file: d.key + '_' + slug(a.form.businessName) + (d.key === 'photo' ? '.jpg' : '.pdf'), v: 1, on: a.firstSubmittedOn }; });
    }
  });
  D().licences.forEach(function (l) {
    var x = { applicantType: l.applicantType, purposes: l.purposes, category: l.category, item: l.item, form: l.details, kind: 'New' };
    derive(x);
    l.purposes = x.purposes; l.category = x.category; l.item = x.item; l.orgType = x.orgType;
    // Documents held on the licence (the full set of its first application).
    if (!l.docKeys) l.docKeys = docKeys(x);
    var f = l.fees && l.fees.first;
    if (!l.firstCharges && f) l.firstCharges = { kind: 'Licence', base: f.fee, garbage: f.garbage, late: 0, backlog: 0, penalty: 0, others: [], exempt: {} };
    l.renewals.forEach(function (r) { if (!r.charges) r.charges = { kind: 'Renewal', base: r.fee, garbage: r.garbage || 0, late: r.fine || 0, backlog: 0, penalty: 0, others: [], exempt: {} }; });
  });

  global.TLFlow = {
    TYPES: TYPES, typeOf: typeOf, FIELDS: FIELDS, SECTIONS: SECTIONS, sectionLabel: sectionLabel, field: field, fieldsFor: fieldsFor, applies: applies, isRequired: isRequired, labelOf: labelOf, inputType: inputType, fieldLabel: fieldLabel, showValue: showValue,
    QUESTIONS: QUESTIONS, items: items, categoriesOf: categoriesOf, findItem: findItem, itemDocs: itemDocs, purpose: purpose, purposeName: purposeName, purposeNames: purposeNames, categoryNames: categoryNames, categoryShort: categoryShort, derive: derive,
    purposesOf: purposesOf, purposeKey: purposeKey, samePurposes: samePurposes, hasCategory: hasCategory, addedPurposes: addedPurposes, removedPurposes: removedPurposes, purposeChanged: purposeChanged,
    CHANGE_TYPES: CHANGE_TYPES, changeFields: changeFields, changesPurpose: changesPurpose, renewalFields: renewalFields,
    docTypes: docTypes, docType: docType, FORMATS: FORMATS, formatUrl: formatUrl, WHEN: WHEN, docList: docList, docKeys: docKeys, docRequired: docRequired, docLabel: docLabel, docMappings: docMappings, newItemDocs: newItemDocs,
    ST: ST, STAGE: STAGE, FORWARD_TO: FORWARD_TO, REMARKS_REQUIRED: REMARKS_REQUIRED, isOpen: isOpen, pendingWith: pendingWith, canAct: canAct, canReassign: canReassign, canExempt: canExempt, visibleTo: visibleTo, returnTargets: returnTargets, isOldRenewal: isOldRenewal,
    originals: originals, originalsBy: originalsBy, originalsText: originalsText, clearOriginals: clearOriginals, needsOriginals: needsOriginals,
    EXEMPTIBLE: EXEMPTIBLE, charges: charges, feeLines: feeLines, feeGross: feeGross, feeExempted: feeExempted, feeTotal: feeTotal, suggestedCharges: suggestedCharges,
    renewalFine: renewalFine, renewalAmounts: renewalAmounts, computeFee: computeFee, fyEnd: fyEnd, fyLabel: fyLabel, fyQuarter: fyQuarter, addDays: addDays, daysBetween: daysBetween,
    challanValid: challanValid, generateChallan: generateChallan, ledgerRow: ledgerRow,
    nextAppId: nextAppId, submit: submit, act: act, log: log, brDuplicate: brDuplicate, brProblem: brProblem, issueLicence: issueLicence, oldRenewalNo: oldRenewalNo, approver: approver,
    licenceState: licenceState, openAppFor: openAppFor, renewalOpensOn: renewalOpensOn, renewalDue: renewalDue, renewalCheck: renewalCheck, changeCheck: changeCheck, currentVersion: currentVersion, licenceDetails: licenceDetails, staffName: staffName
  };
})(window);
