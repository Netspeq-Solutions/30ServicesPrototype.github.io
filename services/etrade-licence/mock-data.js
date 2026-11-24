/* ==========================================================================
   e-Trade Licence (UDD) – demonstration data
   Copied into localStorage on first use (see tl-app.js). "Reset demo data"
   restores this seed. All names, numbers and documents are fictitious.
   Demo date: 17 Nov 2026 (FY 2026-27).
   Seed applications leave docs empty: tl-flow.js fills them from the document
   rules, so the seed always matches what the form asks for.
   ========================================================================== */
(function (global) {
  'use strict';

  var STAFF = {
    'INS-01': { name: 'Karma Tshering Bhutia', role: 'inspector', designation: 'Inspector', circle: 'NE' },
    'INS-02': { name: 'Pema Doma Lepcha', role: 'inspector', designation: 'Inspector', circle: 'NE' },
    'BO-01': { name: 'Ranjit Pradhan', role: 'bo', designation: 'BO', circle: 'NE', note: 'Mainly handles pharmaceutical and manufacturing cases' },
    'BO-02': { name: 'Sushma Rai', role: 'bo', designation: 'BO', circle: 'NE', note: 'Individual traders, fuel and other company cases' },
    'JD-01': { name: 'Phurba Tshering Lepcha', role: 'jd', designation: 'Joint Director', circle: 'NE', note: 'Approves and forwards after the BO' },
    'DIR-01': { name: 'Yangchen Dolkar Bhutia', role: 'jd', designation: 'Director', circle: 'NE', note: 'Approves and forwards after the BO' },
    'SS-01': { name: 'Tenzing Wangchuk', role: 'ss', designation: 'Special Secretary', circle: 'NE', note: 'North-East circle, Gangtok HQ – may give final approval' },
    'HOD-CCS': { name: 'Dorjee Namgyal', role: 'hod', designation: 'CCS', circle: 'NE', note: 'Final approval (own account)' },
    'HOD-IA1': { name: 'Nima Sherpa', role: 'hod', designation: 'Issuing Authority', circle: 'NE', note: 'Final approval (own account)' },
    'HOD-IA2': { name: 'Bimala Chettri', role: 'hod', designation: 'Issuing Authority', circle: 'NE', note: 'Final approval (own account)' },
    'ADM-01': { name: 'Sangeeta Subba', role: 'admin', designation: 'Department Admin', circle: 'NE', note: 'Renewal amounts and settings' }
  };

  // ---------------- Items master (purpose of licence) ----------------
  // Seed of the master maintained by the Department Admin in items-master.html.
  // Each item (purpose) may have sub-items (activity as per the UDD notification); some have none.
  // type IND = Individual / firm (firm, enterprise or establishment of a proprietor or partners); COMP = Registered company.
  // Sample list – the full UDD activity / items notification is awaited.
  // tags below are seed shorthand only: they are turned into document mappings (item.docs) from the
  // document types master – food → PFA / FSSAI, meat → Animal Husbandry NOC, garage → Traffic Police NOC,
  // cyber → Crime Branch NOC, fuel → petrol pump / LPG documents, etc.
  function m(n, tags) { return { n: n, tags: tags }; }
  var CATEGORIES = [
    { code: 'AGRI', type: 'IND', name: 'Agricultural and Forest Produce', short: 'Agriculture', icon: 'bi-flower1', items: ['Agriculture, Floriculture and Horticulture (Composite)', 'Agricultural Implements and Seeds Shop', 'Agriculture Inputs of Organic Origin', 'Florist, Plant Seller and Nursery of Plants', 'Mushrooms', 'Orange (Wholesale)', 'Broomsticks (Amliso) Wholesale', 'Cardamom', 'Ginger'] },
    { code: 'FOREST', type: 'IND', name: 'Forest Produce and Timber Merchants', short: 'Forest produce', icon: 'bi-tree', tags: ['forest'], items: ['Charcoal, Firewood, Broomsticks and Dry Flowers', 'Cane and Cane Products', 'Lumber and Timber', m('Quarry / Crusher Plant', ['quarry'])] },
    { code: 'SCRAP', type: 'IND', name: 'Scrap', short: 'Scrap', icon: 'bi-recycle', items: ['Bags, Cartons and Crates', m('Iron and Metals', ['pollution'])] },
    { code: 'GREEN', type: 'IND', name: 'Green Grocery, Dairy, Farm and Orchard Produce', short: 'Green grocery', icon: 'bi-basket', tags: ['food'], items: ['Vegetable and Fruit Vendor (Retail)', 'Vegetable and Fruit Vendor (Wholesale)', 'Milk and Dairy Produce Vendor'] },
    { code: 'GROCERY', type: 'IND', name: 'Grocery, Packaged Food and Provisions', short: 'Grocery', icon: 'bi-bag', tags: ['food'], items: ['Tea Leaf and Tea Dust Shop', 'Grocery (except controlled items) – Wholesale', 'Grocery (except controlled items) – Retail'] },
    { code: 'TEASHOP', type: 'IND', name: 'Boutique Tea Shop', short: 'Tea shop', icon: 'bi-cup-hot', tags: ['food'], items: [] },
    { code: 'ANIMAL', type: 'IND', name: 'Animal Husbandry, Livestock and Produce', short: 'Animal husbandry', icon: 'bi-egg', tags: ['food'], items: [m('Mechanised Abattoir / Slaughter House', ['meat']), 'Fish', 'Egg Seller', m('Meat (Retail)', ['meat']), m('Meat or Fish (Wholesale)', ['meat'])] },
    { code: 'WATER', type: 'IND', name: 'Mineral Water (Wholesale)', short: 'Mineral water', icon: 'bi-droplet', tags: ['food', 'bis'], items: [] },
    { code: 'PROVISION', type: 'IND', name: 'Provisional Goods', short: 'Provisions', icon: 'bi-box-seam', tags: ['food'], items: ['Provisional Goods (Retail)', 'Provisional Goods (Wholesale)'] },
    { code: 'RICE', type: 'IND', name: 'Rice (Wholesale)', short: 'Rice', icon: 'bi-basket2', tags: ['food'], items: [] },
    { code: 'DEPTA', type: 'IND', name: 'Departmental Stores (A)', short: 'Dept. store (A)', icon: 'bi-shop', tags: ['food'], items: ['Class-I: Provisions, confectionery, cosmetics, grocery, manihari, cold drinks, ice-cream (large shop with multiple facilities)', 'Class-II: Small shop with basic facilities'] },
    { code: 'DEPTB', type: 'IND', name: 'Departmental Stores (B)', short: 'Dept. store (B)', icon: 'bi-shop-window', items: ['Class-I: Franchise – readymade clothes, shoes, bags, cosmetics', 'Class-II: Readymade clothes and a few other items', 'Class-III: Readymade garments only'] },
    { code: 'TEXTILE', type: 'IND', name: 'Textiles, Apparel and Garments', short: 'Textiles', icon: 'bi-grid-3x3', items: ['Textile and Cloth Shop', 'Textiles and Cloth (Wholesale)'] },
    { code: 'GARMENT', type: 'IND', name: 'Readymade Garments', short: 'Garments', icon: 'bi-handbag', items: ['Class-I: Franchise', 'Class-II: Readymade garments and a few other items', 'Class-III: Small shop – readymade garments only'] },
    { code: 'LEATHER', type: 'IND', name: 'Leather Items', short: 'Leather', icon: 'bi-briefcase', items: ['Leather goods – jackets, suitcases, bags, belts and wallets'] },
    { code: 'FOOTWEAR', type: 'IND', name: 'Footwear and Shoe Shop', short: 'Footwear', icon: 'bi-tags', items: ['Class-I: Big shop dealing only in footwear and shoes', 'Class-II: Small shop – footwear and shoes with other items'] },
    { code: 'TAILOR', type: 'IND', name: 'Tailors and Outfitters', short: 'Tailoring', icon: 'bi-scissors', items: ['Tailor (self-employed)', 'Outfitter and Tailoring Shop'] },
    { code: 'DYERS', type: 'IND', name: 'Dyers and Cleaners', short: 'Dry cleaning', icon: 'bi-droplet-half', items: ['Dry Cleaning and Dyeing of Clothes', 'Dyeing of Clothes'] },
    { code: 'BEAUTY', type: 'IND', name: 'Beauty, Spa and Beauty Care', short: 'Beauty care', icon: 'bi-stars', items: ['Cosmetics and Toiletries', 'Beauty Parlour (Class-I): multiple and specialised services', 'Beauty Parlour (Class-II): basic services only', 'Beauty Parlour (Class-III): SHG, cooperative or small entrepreneur trained under a government programme', 'Hair Salon (Male)'] },
    { code: 'HEALTHCLUB', type: 'IND', name: 'Health Club and Spa', short: 'Health club', icon: 'bi-heart-pulse', items: ['Foot Spa', 'Health Club and Spa', 'Gymnasium and Body Building Centre', 'Yoga Centre'] },
    { code: 'AUTOSHOW', type: 'IND', name: 'Automobile Showroom', short: 'Auto showroom', icon: 'bi-car-front', tags: ['dealer'], items: ['Two Wheeler', 'Light Motor Vehicle', 'Heavy Motor Vehicle'] },
    { code: 'AUTOWORK', type: 'IND', name: 'Automobile Workshops', short: 'Auto workshop', icon: 'bi-tools', tags: ['garage', 'pollution'], items: ['Two Wheeler Workshop', 'Light Motor Vehicle Workshop', 'Heavy Motor Vehicle Workshop'] },
    { code: 'GARAGE', type: 'IND', name: 'Garage – Small Scale', short: 'Garage', icon: 'bi-wrench', tags: ['garage'], items: ['Automobile Electrical Parts', 'Automobile Spare Parts and Accessories'] },
    { code: 'CARPARK', type: 'IND', name: 'Commercial Car Parks', short: 'Car park', icon: 'bi-p-square', tags: ['garage'], items: ['Car Park (Private)'] },
    { code: 'FUEL', type: 'IND', name: 'Power and Fuel Merchants', short: 'Fuel', icon: 'bi-fuel-pump', items: [m('Liquefied Petroleum Gas Distributors', ['fuel']), m('Petrol and Diesel Pump', ['fuel']), 'Lubricants'] },
    { code: 'MACHINERY', type: 'IND', name: 'Heavy Machinery Items', short: 'Heavy machinery', icon: 'bi-gear-wide-connected', items: [] },
    { code: 'CYBER', type: 'IND', name: 'Cyber Café', short: 'Cyber café', icon: 'bi-pc-display', tags: ['cyber'], items: [] },
    // Registered companies
    { code: 'MANUF', type: 'COMP', name: 'Manufacturing', short: 'Manufacturing', icon: 'bi-gear', tags: ['industry'], items: [] },
    { code: 'SECURITY', type: 'COMP', name: 'Security Agency / Manpower Placement', short: 'Security / manpower', icon: 'bi-shield-check', tags: ['security'], items: [] },
    { code: 'BANK', type: 'COMP', name: 'Banking & Non-Banking', short: 'Banking', icon: 'bi-bank', items: [m('Banking', ['rbi']), m('Non-banking (NBFC / insurance)', ['irda'])] },
    { code: 'DEPT', type: 'COMP', name: 'Departmental Stores', short: 'Dept. stores', icon: 'bi-shop', tags: ['food'], items: [] },
    { code: 'CASINO', type: 'COMP', name: 'Casino', short: 'Casino', icon: 'bi-suit-spade', tags: ['lottery'], items: [] },
    { code: 'HOTEL', type: 'COMP', name: 'Hotels / Restaurants', short: 'Hotel / restaurant', icon: 'bi-building', tags: ['food', 'tourism'], items: ['Hotel / resort / lodge / guest house', 'Restaurant', 'Hotel with restaurant'] },
    { code: 'PHARMA', type: 'COMP', name: 'Pharmaceutical Company', short: 'Pharma', icon: 'bi-capsule', tags: ['drug', 'pharma'], items: ['Pharma manufacturer', 'Pharma distributor / wholesaler'] },
    { code: 'OTHER', type: 'COMP', name: 'Others (specify)', short: 'Others', icon: 'bi-three-dots', items: [] }
  ];

  // ---------------- Document types master ----------------
  // Maintained by the Department Admin in documents-master.html.
  //   base:      asked of every applicant of that type – { IND: 'M' | 'O', COMP: 'M' | 'O' } (M = mandatory, O = optional)
  //   renewal:   asked with every renewal ('M' / 'O')
  //   change:    asked for a change request – { name | premises | address | purpose: 'M' / 'O' } (configurable per change type)
  //   when:      asked when the applicant answers – { franchise | tourismRegistered | toursTravel: 'M' / 'O' }
  //   format:    prescribed format the applicant downloads (format.html?f=…)
  // Documents for particular items / sub-items are mapped on the item (item.docs), not here.
  function doc(key, name, o) { return Object.assign({ key: key, name: name, active: true, base: {}, renewal: '', change: {}, when: {}, format: '' }, o || {}); }
  var DOC_TYPES = [
    doc('photo', 'Photograph of the applicant', { base: { IND: 'M' } }),
    // Identity: one document – SSC, COI or RC (Residential Certificate, Notification No. 23/Home/2015 dated 15.05.2015).
    doc('idProof', 'SSC / COI / RC (any one)', { base: { IND: 'M', COMP: 'O' } }),
    doc('landParcha', 'Land Parcha of the premises', { base: { COMP: 'M' } }),
    doc('occupancy', 'Building Occupancy Certificate / Land Parcha', { base: { IND: 'M', COMP: 'M' }, change: { premises: 'M' } }),
    doc('recommendation', 'Recommendation of the Gram Panchayat / Councillor (Form VI)', { base: { IND: 'M', COMP: 'M' }, format: 'recommendation' }),
    doc('houseOwnerNoc', 'NOC of the house owner (Form X)', { base: { IND: 'M', COMP: 'M' }, change: { premises: 'M' }, format: 'houseOwnerNoc' }),
    doc('fireNoc', 'NOC – Sikkim Fire & Emergency Services', { base: { IND: 'M', COMP: 'M' }, change: { premises: 'M' } }),
    doc('unemployed', 'Unemployed certificate (employment card or NOC from BDO / SDM)', { base: { IND: 'M' } }),
    doc('undertaking', 'Undertaking (Form VIII)', { base: { IND: 'M' }, change: { purpose: 'M' }, format: 'undertaking' }),
    doc('incorporation', 'Certificate of Incorporation of the company', { base: { COMP: 'M' } }),
    doc('moa', 'Memorandum & Articles of Association', { base: { COMP: 'M' } }),
    doc('boardResolution', 'Board resolution specifying the business to be carried out in Sikkim', { base: { COMP: 'M' } }),
    doc('taxClearance', 'Certificate from the Registrar of Companies that all tax dues are cleared', { base: { COMP: 'O' } }),
    doc('pvr', 'Police Verification Report (PVR) of the company & Board of Directors', { base: { COMP: 'M' } }),
    doc('pollution', 'Clearance – State Pollution Control Board', { base: { COMP: 'M' } }),
    doc('labour', 'Licence from the Labour Department', { base: { COMP: 'O' } }),
    doc('lawEnlistment', 'Enlistment certificate – Law Department', { base: { COMP: 'M' } }),
    doc('companyPan', 'PAN card of the company', { base: { COMP: 'M' } }),
    doc('boardList', 'List of Board of Directors (Ministry of Corporate Affairs)', { base: { COMP: 'M' } }),
    doc('fssai', 'PFA / FSSAI licence'),
    doc('drugLicence', 'Drug licence – Health Care, Human Services & Family Welfare Department'),
    doc('ahNoc', 'NOC – Animal Husbandry Department'),
    doc('crimeNoc', 'NOC – Crime Branch'),
    doc('trafficNoc', 'NOC – Traffic Police'),
    doc('tourismNoc', 'Tourism & Civil Aviation Department – NOC / certificate of registration', { when: { tourismRegistered: 'M', toursTravel: 'M' } }),
    doc('franchiseDocs', 'Franchise agreement and parent company documents', { when: { franchise: 'M' } }),
    doc('oldLicence', 'Copy of the old trade licence (last renewed)', { when: { oldLicence: 'M' } }),
    doc('forestNoc', 'NOC / transit permit – Forest & Environment Department'),
    doc('miningNoc', 'Permission – Mines & Geology Department'),
    doc('bisLicence', 'BIS licence (packaged drinking water)'),
    doc('psara', 'Licence under the Private Security Agencies (Regulation) Act'),
    doc('tenancy', 'Tenancy agreement / lease deed / rent agreement', { change: { premises: 'O' } }),
    doc('industryEst', 'Industry establishment certificate'),
    doc('msme', 'MSME registration'),
    doc('lotteryNoc', 'NOC / intimation letter – Lottery Department'),
    doc('rbi', 'RBI licence (banking)'),
    doc('irda', 'IRDA licence (non-banking / insurance)'),
    doc('dealership', 'Dealership agreement'),
    doc('oilLicence', 'Licence from Indian Oil Corporation Ltd. / Explosives licence'),
    doc('dcNoc', 'NOC from the District Collector'),
    doc('gstClearance', 'GST certificate', { renewal: 'M' }),
    doc('nameProof', 'Certificate of change of name / board resolution', { change: { name: 'M' } }),
    doc('addressProof', 'Proof of the new address', { change: { address: 'M' } }),
    // Any other paper the applicant wants to add to a change request (optional, every change type).
    doc('changeSupport', 'Other supporting documents for the change', { change: { name: 'O', premises: 'O', address: 'O', purpose: 'O' } })
  ];

  // Normalise items to master records and turn the seed tags into document mappings:
  // { code, type, name, short, icon, active, docs: [{ key, req }], items: [{ code, name, active, docs }] }.
  var TAG_DOCS = {
    food: ['fssai'], meat: ['ahNoc'], garage: ['trafficNoc'], cyber: ['crimeNoc'], drug: ['drugLicence'], industry: ['industryEst'], lottery: ['lotteryNoc'], tourism: ['tourismNoc'], rbi: ['rbi'], irda: ['irda'],
    pharma: ['tenancy', 'industryEst', 'taxClearance'],
    forest: ['forestNoc'], quarry: ['miningNoc', 'pollution'], pollution: ['pollution'], bis: ['bisLicence'], dealer: ['dealership'], security: ['psara', 'labour'],
    // Documents already asked of every applicant (occupancy certificate, NOC of the house owner) are not repeated here.
    fuel: ['landParcha', ['tenancy', 'O'], ['trafficNoc', 'O'], 'dealership', 'oilLicence', 'dcNoc', 'pollution']
  };
  function docsOfTags(tags) {
    var out = [];
    (tags || []).forEach(function (t) {
      (TAG_DOCS[t] || []).forEach(function (d) {
        var key = Array.isArray(d) ? d[0] : d, req = Array.isArray(d) ? d[1] : 'M';
        if (!out.some(function (x) { return x.key === key; })) out.push({ key: key, req: req });
      });
    });
    return out;
  }
  // Questions each item switches on in the form; the department can change these in the items master.
  var ASKS = {
    hotel: ['HOTEL'],
    franchise: ['DEPTA', 'DEPTB', 'GARMENT', 'FOOTWEAR', 'BEAUTY', 'HEALTHCLUB', 'AUTOSHOW', 'DEPT', 'HOTEL', 'OTHER'],
    education: ['OTHER']
  };
  CATEGORIES.forEach(function (c) {
    c.active = true;
    c.asks = {};
    Object.keys(ASKS).forEach(function (q) { if (ASKS[q].indexOf(c.code) !== -1) c.asks[q] = true; });
    c.docs = docsOfTags(c.tags);
    delete c.tags;
    c.items = c.items.map(function (x, i) {
      var o = typeof x === 'string' ? { n: x, tags: [] } : x;
      return { code: c.code + '-' + String(i + 1).padStart(2, '0'), name: o.n, active: true, docs: docsOfTags(o.tags) };
    });
  });
  // "Others (specify)": optional documents for any other company.
  CATEGORIES.filter(function (c) { return c.code === 'OTHER'; })[0].docs = [{ key: 'tenancy', req: 'O' }, { key: 'msme', req: 'O' }, { key: 'industryEst', req: 'O' }];

  // ---------------- Applicants ----------------
  // Sikkim GO is only the identity provider: it supplies authName, mobile and email.
  // The form fields are what each applicant entered in their licence application.
  function ind(f) {
    return Object.assign({ applyFor: 'new', mdName: '', gender: 'Male', idStatus: 'SSC', socialGroup: 'Others', permDistrict: 'Gangtok', premDistrict: 'Gangtok', godownAddress: '',
      isHotel: 'No', isFranchise: 'No', isEducation: 'No', landline: '', tin: '' }, f);
  }
  function comp(f) {
    return Object.assign({ applyFor: 'new', permAddress: '', presSame: true, premDistrict: 'Gangtok', godownAddress: '', isFranchise: 'No', isEducation: 'No' }, f);
  }
  function biz(o) {
    var b = Object.assign({ notifications: [], scenario: false }, o);
    if (b.form) { b.form.applicantName = b.authName; b.form.mobile = b.mobile; b.form.email = b.email; }
    return b;
  }
  var BUSINESSES = {
    bizA: biz({ scenario: true, label: 'New applicant', badge: 'No licence yet', authName: 'Anil Gurung', mobile: '9733000101', email: 'anil.gurung@example.in' }),
    bizB: biz({ scenario: true, label: 'Returned for correction', badge: 'Application returned by Inspector', authName: 'Sonam Bhutia', mobile: '9733000102', email: 'kanchenjungafuels@example.in',
      applicantType: 'IND', category: 'FUEL', item: 'Petrol and Diesel Pump',
      form: ind({ age: 46, guardianName: 'Late Pemba Bhutia', socialGroup: 'ST', permHouseNo: 'H. No. 112', permStreet: 'Ranka Road', permLocality: 'Lingdum', permGpu: 'Lingdum-Ranka GPU', permWard: 'Lingdum Ward', permPo: 'Ranka', permPs: 'Ranka', permPin: '737135',
        firmName: 'Kanchenjunga Fuels', premOwner: 'Tshering Dorjee Bhutia', premHouseNo: 'Plot 7', premStreet: 'NH-10', premLocality: 'Ranipool Bazaar', premGpu: 'Ranipool Nagar Panchayat', premWard: 'Ward No. 3', premPo: 'Ranipool', premPs: 'Ranipool', premPin: '737135',
        pan: 'ABCPB0871M', tin: '11080871001' }) }),
    bizC: biz({ scenario: true, label: 'Fee payment pending', badge: 'Approved – upload Bank Receipt', authName: 'Rohit Agarwal', mobile: '9733000103', email: 'gangtok@teestatelecom.example',
      applicantType: 'COMP', category: 'OTHER', item: '',
      form: comp({ otherPurpose: 'Regional office for mobile and broadband services', companyName: 'Teesta Telecom Services Pvt. Ltd.', regNo: 'U64200SK2021PTC003318', mdName: 'Vivek Jain', age: 41, guardianName: 'Suresh Agarwal',
        permHouseNo: 'Flat 3B', permStreet: 'Bhanu Path', permLocality: 'MG Marg', permPo: 'Gangtok', permPs: 'Sadar', permDistrict: 'Gangtok',
        premOwner: 'Karma Lhamu', premHouseNo: '2nd Floor, Bhanu Path Complex', premStreet: 'Bhanu Path, MG Marg', premPo: 'Gangtok', premPs: 'Sadar' }) }),
    bizD: biz({ scenario: true, label: 'Licence holder', badge: 'Licence valid to 31 Mar 2027', authName: 'Meera Thapa', mobile: '9733000104', email: 'cs@gangtokpharma.example',
      applicantType: 'COMP', category: 'PHARMA', item: 'Pharma manufacturer',
      form: comp({ companyName: 'Gangtok Pharma Industries Ltd.', regNo: 'U24239SK2012PLC000981', mdName: 'Rajendra Pradhan', age: 44, guardianName: 'Bal Bahadur Thapa',
        permHouseNo: 'H. No. 21', permStreet: 'Lower Burtuk', permLocality: 'Burtuk', permPo: 'Gangtok', permPs: 'Sadar', permDistrict: 'Gangtok',
        premOwner: 'Gangtok Pharma Industries Ltd. (own)', premHouseNo: 'Plot 12, Industrial Estate', premStreet: 'Bojoghari', premPo: 'Tadong', premPs: 'Ranipool', godownAddress: 'Plot 12A, Industrial Estate, Bojoghari' }) }),
    bizE: biz({ scenario: true, label: 'Licence expired', badge: 'Renewal due – late fee applies', authName: 'Kiran Pradhan', mobile: '9733000105', email: 'denzongpetro@example.in',
      applicantType: 'IND', category: 'FUEL', item: 'Liquefied Petroleum Gas Distributors',
      form: ind({ age: 52, guardianName: 'Hari Prasad Pradhan', permHouseNo: 'H. No. 8', permStreet: 'Majhitar Road', permLocality: 'Rangpo', permDistrict: 'Pakyong', permGpu: 'Rangpo Nagar Panchayat', permWard: 'Ward No. 5', permPo: 'Rangpo', permPs: 'Rangpo', permPin: '737132',
        firmName: 'Denzong Petro Depot', premOwner: 'Kiran Pradhan (own)', premHouseNo: 'Depot Yard', premStreet: 'Depot Road', premLocality: 'Majhitar', premDistrict: 'Pakyong', premGpu: 'Majhitar GPU', premWard: 'Majhitar Ward', premPo: 'Majhitar', premPs: 'Rangpo', premPin: '737136',
        godownAddress: 'LPG cylinder godown, Depot Road, Majhitar', pan: 'AFKPP0342B' }) }),
    bizF: biz({ scenario: true, label: 'Renewal in process', badge: 'Renewal resubmitted to BO', authName: 'Lhakpa Tamang', mobile: '9733000106', email: 'rumtekfuel@example.in',
      applicantType: 'IND', category: 'FUEL', item: 'Petrol and Diesel Pump',
      form: ind({ age: 39, guardianName: 'Nima Tamang', socialGroup: 'ST', idStatus: 'COI', permHouseNo: 'H. No. 45', permStreet: 'Rumtek Road', permLocality: 'Ranka', permGpu: 'Rumtek-Sang GPU', permWard: 'Rumtek Ward', permPo: 'Rumtek', permPs: 'Ranka', permPin: '737135',
        firmName: 'Rumtek Fuel Station', premOwner: 'Mingma Sherpa', premHouseNo: 'Km 4', premStreet: 'Rumtek Road', premLocality: 'Ranka', premGpu: 'Rumtek-Sang GPU', premWard: 'Ranka Ward', premPo: 'Ranka', premPs: 'Ranka', premPin: '737135', pan: 'AGTPT0560D' }) }),
    // Other applicants – appear in officer queues only
    bizG: biz({ authName: 'Sanjay Lama', mobile: '9733000107', email: 'mgmarg@denzongbank.example', applicantType: 'COMP', category: 'BANK', item: 'Banking',
      form: comp({ companyName: 'Denzong Bank Ltd. – MG Marg Branch', regNo: 'L65110SK1998PLC000210', mdName: 'Arvind K. Sharma', age: 48, guardianName: 'Late Mingma Lama',
        permHouseNo: 'H. No. 3', permStreet: 'Development Area', permLocality: 'Lower Siyari', permPo: 'Gangtok', permPs: 'Sadar', permDistrict: 'Gangtok',
        premOwner: 'Sonam Yangzom', premHouseNo: 'Ground Floor, Yangzom Building', premStreet: 'MG Marg', premPo: 'Gangtok', premPs: 'Sadar' }) }),
    bizH: biz({ authName: 'Priya Sharma', mobile: '9733000108', email: 'gangtok@mountainmart.example', applicantType: 'COMP', category: 'DEPT', item: '',
      form: comp({ companyName: 'Mountain Mart Retail Franchise Pvt. Ltd.', regNo: 'U52100SK2023PTC004011', mdName: 'Ashok Mittal', age: 36, guardianName: 'Rakesh Sharma',
        permHouseNo: 'H. No. 17', permStreet: 'Sevoke Road', permLocality: 'Siliguri', permAddress: 'Darjeeling, West Bengal', permPo: 'Siliguri', permPs: 'Bhaktinagar', permDistrict: 'Darjeeling (West Bengal)', presSame: false,
        presHouseNo: 'Flat 2A', presStreet: 'Development Area', presLocality: 'Lower Siyari', presAddress: '', presPo: 'Gangtok', presPs: 'Sadar', presDistrict: 'Gangtok',
        premOwner: 'Dawa Tshering', premHouseNo: 'Tshering Complex', premStreet: 'Development Area, Lower Siyari', premPo: 'Gangtok', premPs: 'Sadar', godownAddress: 'Basement store, Tshering Complex',
        isFranchise: 'Yes', parentName: 'Mountain Mart Retail Ltd.', parentState: 'West Bengal, India', parentDistrict: 'Darjeeling', parentCity: 'Siliguri', parentStreet: 'Sevoke Road' }) }),
    bizI: biz({ authName: 'Dawa Sherpa', mobile: '9733000109', email: 'yuksompharma@example.in', applicantType: 'COMP', category: 'PHARMA', item: 'Pharma distributor / wholesaler',
      form: comp({ companyName: 'Yuksom Pharma Distributors Pvt. Ltd.', regNo: 'U51397SK2024PTC004120', mdName: 'Dawa Sherpa', age: 50, guardianName: 'Pasang Sherpa',
        permHouseNo: 'H. No. 9', permStreet: 'Daragaon Road', permLocality: 'Tadong', permPo: 'Tadong', permPs: 'Sadar', permDistrict: 'Gangtok',
        premOwner: 'Lhamu Sherpa', premHouseNo: 'Ground Floor, Sherpa Building', premStreet: 'Daragaon Road, Tadong', premPo: 'Tadong', premPs: 'Sadar', godownAddress: 'Cold-chain godown, Daragaon Road' }) }),
    bizJ: biz({ authName: 'Ugen Lepcha', mobile: '9733000110', email: 'nsti@example.in', applicantType: 'COMP', category: 'OTHER', item: '',
      form: comp({ otherPurpose: 'Telecom tower infrastructure', companyName: 'North Sikkim Telecom Infra Ltd.', regNo: 'L64202SK2018PLC002204', mdName: 'Sherab Lepcha', age: 45, guardianName: 'Pem Tshering Lepcha',
        permHouseNo: 'H. No. 30', permStreet: 'Mangan Bazaar', permLocality: 'Mangan', permPo: 'Mangan', permPs: 'Mangan', permDistrict: 'Mangan',
        premOwner: 'Karma Lepcha', premHouseNo: '1st Floor, Lepcha Building', premStreet: 'Mangan Bazaar', premPo: 'Mangan', premPs: 'Mangan', premDistrict: 'Mangan' }) }),
    bizK: biz({ authName: 'Bikash Chettri', mobile: '9733000111', email: 'siniolchu@example.in', applicantType: 'IND', category: 'FUEL', item: 'Lubricants',
      form: ind({ age: 43, guardianName: 'Dil Bahadur Chettri', socialGroup: 'OBC', permHouseNo: 'H. No. 66', permStreet: 'Singtam Bazaar', permLocality: 'Singtam', permGpu: 'Singtam Nagar Panchayat', permWard: 'Ward No. 2', permPo: 'Singtam', permPs: 'Singtam', permPin: '737134',
        firmName: 'Siniolchu Lubricants', premOwner: 'Bikash Chettri (own)', premHouseNo: 'Plot 3', premStreet: 'Bardang Road', premLocality: 'Bardang', premGpu: 'Bardang GPU', premWard: 'Bardang Ward', premPo: 'Singtam', premPs: 'Singtam', premPin: '737134', pan: 'AJBPC1102C' }) }),
    bizL: biz({ authName: 'Ritu Gupta', mobile: '9733000112', email: 'admin@alpinecorp.example', applicantType: 'COMP', category: 'SECURITY', item: '',
      form: comp({ companyName: 'Alpine Security & Manpower Services Pvt. Ltd.', regNo: 'U74999SK2022PTC003561', mdName: 'Ritu Gupta', age: 38, guardianName: 'Anand Gupta',
        permHouseNo: 'H. No. 5', permStreet: 'Tibet Road', permLocality: 'Gangtok', permPo: 'Gangtok', permPs: 'Sadar', permDistrict: 'Gangtok',
        premOwner: 'Pemba Doma', premHouseNo: '1st Floor, Doma Building', premStreet: 'Tibet Road', premPo: 'Gangtok', premPs: 'Sadar' }) }),
    bizM: biz({ authName: 'Vikram Singh', mobile: '9733000113', email: 'plant@rangpolife.example', applicantType: 'COMP', category: 'PHARMA', item: 'Pharma manufacturer',
      form: comp({ companyName: 'Rangpo Lifesciences Ltd.', regNo: 'U24230SK2025PLC004300', mdName: 'Harish Bansal', age: 47, guardianName: 'Mohan Singh',
        permHouseNo: 'Quarter 4', permStreet: 'Pharma Park', permLocality: 'Mamring', permPo: 'Rangpo', permPs: 'Rangpo', permDistrict: 'Pakyong',
        premOwner: 'Rangpo Lifesciences Ltd. (own)', premHouseNo: 'Pharma Park', premStreet: 'Mamring', premPo: 'Rangpo', premPs: 'Rangpo', premDistrict: 'Pakyong' }) }),
    bizN: biz({ authName: 'Arjun Rai', mobile: '9733000114', email: 'stay@rhenockhills.example', applicantType: 'COMP', category: 'HOTEL', item: 'Hotel with restaurant',
      form: comp({ companyName: 'Rhenock Hills Hotels Pvt. Ltd.', regNo: 'U55101SK2020PTC002980', mdName: 'Arjun Rai', age: 42, guardianName: 'Dhan Bahadur Rai',
        permHouseNo: 'H. No. 14', permStreet: 'Deorali Bazaar', permLocality: 'Deorali', permPo: 'Deorali', permPs: 'Sadar', permDistrict: 'Gangtok',
        premOwner: 'Arjun Rai', premHouseNo: 'Rhenock Hills Hotel', premStreet: 'Upper Deorali', premPo: 'Deorali', premPs: 'Sadar',
        rooms: 24, parking: 'Yes', restaurant: 'Yes', toursTravel: 'No' }) }),
    bizQ: biz({ authName: 'Sangay Bhutia', mobile: '9733000115', email: 'ranipoolfuel@example.in', applicantType: 'IND', category: 'FUEL', item: 'Petrol and Diesel Pump',
      form: ind({ age: 35, guardianName: 'Karma Bhutia', socialGroup: 'ST', permHouseNo: 'H. No. 2', permStreet: 'NH-10', permLocality: 'Ranipool', permGpu: 'Ranipool Nagar Panchayat', permWard: 'Ward No. 1', permPo: 'Ranipool', permPs: 'Ranipool', permPin: '737135',
        firmName: 'Ranipool Fuel Point', premOwner: 'Chimi Bhutia', premHouseNo: 'Km 12', premStreet: 'NH-10', premLocality: 'Ranipool', premGpu: 'Ranipool Nagar Panchayat', premWard: 'Ward No. 1', premPo: 'Ranipool', premPs: 'Ranipool', premPin: '737135', pan: 'AHJPB0988G' }) }),
    // Licence issued before this system (not migrated): applied for as a new application with the old licence details.
    bizS: biz({ authName: 'Tashi Gurung', mobile: '9733000117', email: 'tashistore@example.in', applicantType: 'IND', category: 'GROCERY', item: 'Grocery (except controlled items) – Retail',
      purposes: [{ category: 'GROCERY', item: 'Grocery (except controlled items) – Retail' }, { category: 'GROCERY', item: 'Tea Leaf and Tea Dust Shop' }],
      form: ind({ applyFor: 'old', oldLicenceNo: 'UDD/TL/1187/2016', oldIssuedOn: '2016-07-14', oldValidTo: '2023-03-31',
        age: 49, guardianName: 'Bhim Bahadur Gurung', socialGroup: 'OBC', permHouseNo: 'H. No. 27', permStreet: 'Sichey Road', permLocality: 'Lower Sichey', permGpu: 'GMC', permWard: 'Ward No. 14 (Sichey)', permPo: 'Gangtok', permPs: 'Sadar', permPin: '737101',
        firmName: 'Tashi General Store', premOwner: 'Tashi Gurung (own)', premHouseNo: 'Shop No. 2', premStreet: 'Sichey Road', premLocality: 'Lower Sichey', premGpu: 'GMC', premWard: 'Ward No. 14 (Sichey)', premPo: 'Gangtok', premPs: 'Sadar', premPin: '737101', pan: 'AKGPG4410H' }) }),
    bizR: biz({ authName: 'Dechen Lachenpa', mobile: '9733000116', email: 'lachenmeat@example.in', applicantType: 'IND', category: 'ANIMAL', item: 'Meat (Retail)',
      purposes: [{ category: 'ANIMAL', item: 'Meat (Retail)' }, { category: 'ANIMAL', item: 'Fish' }],
      form: ind({ age: 38, gender: 'Female', guardianName: 'Tashi Lachenpa (husband)', socialGroup: 'ST', permHouseNo: 'H. No. 19', permStreet: 'Lachen Road', permLocality: 'Lachen', permDistrict: 'Mangan', permGpu: 'Lachen Dzumsa', permWard: 'Lachen', permPo: 'Lachen', permPs: 'Chungthang', permPin: '737120',
        firmName: 'Lachen Meat & Fish Corner', premOwner: 'Norbu Tshering', premHouseNo: 'Shop No. 6', premStreet: 'Lal Bazaar Road', premLocality: 'Lal Market', premGpu: 'GMC', premWard: 'Ward No. 11 (Lal Bazaar)', premPo: 'Gangtok', premPs: 'Sadar', premPin: '737101', pan: 'AQLPL2216E' }) }),
    // Licence holder whose licence expired: renewal request with an item added – in the Inspector pool.
    bizT: biz({ authName: 'Karma Namgyal', mobile: '9733000118', email: 'namgyalauto@example.in', applicantType: 'IND', category: 'GARAGE', item: 'Automobile Spare Parts and Accessories',
      form: ind({ age: 41, guardianName: 'Sonam Namgyal', socialGroup: 'ST', permHouseNo: 'H. No. 11', permStreet: 'Singtam Road', permLocality: 'Ranipool', permGpu: 'Ranipool Nagar Panchayat', permWard: 'Ward No. 2', permPo: 'Ranipool', permPs: 'Ranipool', permPin: '737135',
        firmName: 'Namgyal Auto Spares', premOwner: 'Pemba Tshering', premHouseNo: 'Shop No. 4', premStreet: 'NH-10', premLocality: 'Ranipool Bazaar', premGpu: 'Ranipool Nagar Panchayat', premWard: 'Ward No. 2', premPo: 'Ranipool', premPs: 'Ranipool', premPin: '737135', pan: 'AKNPN3301K' }) }),
    // Beauty parlour with two sub-items – with the Joint Director / Director.
    bizU: biz({ authName: 'Sunita Rai', mobile: '9733000119', email: 'teestabeauty@example.in', applicantType: 'IND', category: 'BEAUTY', item: 'Beauty Parlour (Class-II): basic services only',
      purposes: [{ category: 'BEAUTY', item: 'Beauty Parlour (Class-II): basic services only' }, { category: 'BEAUTY', item: 'Cosmetics and Toiletries' }],
      form: ind({ age: 33, gender: 'Female', guardianName: 'Bhim Rai (husband)', socialGroup: 'OBC', permHouseNo: 'H. No. 52', permStreet: 'Tadong Road', permLocality: 'Tadong', permGpu: 'GMC', permWard: 'Ward No. 18 (Tadong)', permPo: 'Tadong', permPs: 'Sadar', permPin: '737102',
        firmName: 'Teesta Beauty Parlour', premOwner: 'Mingma Lhamu', premHouseNo: 'Shop No. 9', premStreet: 'Rangpo Road', premLocality: 'Singtam Bazaar', premDistrict: 'Gangtok', premGpu: 'Singtam Nagar Panchayat', premWard: 'Ward No. 1', premPo: 'Singtam', premPs: 'Singtam', premPin: '737134', pan: 'AMRPR7719Q' }) })
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  // Purpose of a business: one or more items / sub-items ({ category, item }); category / item keep the first.
  function purposeOf(key) {
    var b = BUSINESSES[key];
    return { applicantType: b.applicantType, category: b.category, item: b.item, purposes: clone(b.purposes || [{ category: b.category, item: b.item || '' }]), form: clone(b.form) };
  }
  // History entry: [date-time, staff id or 'APPLICANT' / 'SYSTEM', action, remarks, status]
  function h(rows, key) {
    return rows.map(function (r) {
      var who = r[1], s = STAFF[who];
      return { at: r[0], by: s ? s.name : (who === 'SYSTEM' ? 'System' : BUSINESSES[key].authName), role: s ? s.designation : (who === 'SYSTEM' ? 'System' : 'Applicant'), action: r[2], remarks: r[3] || '', status: r[4] };
    });
  }
  // Fee assessed by the Inspector: licence fee + garbage fee (+ late fee, backlog fee, penalties, other charges).
  function assessed(fee, garbage, by, on, extra) {
    return Object.assign({ base: fee, garbage: garbage, late: 0, lateDays: 0, backlog: 0, penalty: 0, others: [], by: STAFF[by].name, role: STAFF[by].designation, on: on }, extra || {});
  }
  // Fee fixed on approval from the assessment (total is worked out by tl-flow.js).
  function fixed(s, kind, on) {
    return { kind: kind || 'Licence', base: s.base, garbage: s.garbage, late: s.late, lateDays: s.lateDays, backlog: s.backlog, penalty: s.penalty, others: clone(s.others), exempt: {}, assessedBy: s.by, assessedRole: s.role, assessedOn: s.on, fixedOn: on };
  }
  // Original documents seen by an officer (Inspector and BO each keep their own check).
  function oc(by, on, how) { var s = STAFF[by]; return { role: s.role, designation: s.designation, by: s.name, on: on, how: how }; }
  function approvedBy(id, on) { return { name: STAFF[id].name, role: STAFF[id].designation, on: on }; }
  function app(o) {
    var a = Object.assign({
      circle: 'NE', kind: 'New', licenceNo: null, change: null, selectedBo: null, returnedBy: null, correction: null, assessment: null, path: [], sentBy: null, approvedBy: null,
      inspections: [], originalsChecks: [], fee: null, challan: null, challanHistory: [], br: null, brHistory: [], boHistory: [], versions: [], round: 1, docs: null
    }, purposeOf(o.businessKey), o);
    // Renewal and change requests start from the items on the licence.
    if (a.kind !== 'New' && !a.prevPurposes) a.prevPurposes = clone(a.purposes);
    a.history = h(a.history, a.businessKey);
    return a;
  }

  var A102 = assessed(9000, 1000, 'INS-02', '2026-09-18', { penalty: 500 });
  var A108 = assessed(6500, 1000, 'INS-01', '2026-08-20');
  var APPLICATIONS = [
    app({ appId: 'TL-NE-2026-000101', businessKey: 'bizB', status: 'Returned to Applicant', firstSubmittedOn: '2026-11-03', submittedOn: '2026-11-03', updatedOn: '2026-11-06',
      returnedBy: { role: 'inspector', userId: null },
      correction: { by: 'Karma Tshering Bhutia', role: 'Inspector', on: '2026-11-06', remarks: 'The NOC of the house owner is not signed – upload the signed NOC. The PAN entered does not match the PAN card uploaded.', fields: ['pan'], docs: ['houseOwnerNoc'] },
      history: [['2026-11-03 11:20', 'APPLICANT', 'Application submitted', '', 'Submitted'],
        ['2026-11-05 10:05', 'INS-01', 'Verification started', '', 'Under Inspection'],
        ['2026-11-06 15:42', 'INS-01', 'Returned to applicant for correction', 'The NOC of the house owner is not signed – upload the signed NOC. The PAN entered does not match the PAN card uploaded.', 'Returned to Applicant']] }),

    // Approved; the challan is not generated yet. The penalty can still be exempted by the Inspector / BO.
    app({ appId: 'TL-NE-2026-000102', businessKey: 'bizC', status: 'Approved – Payment Pending', firstSubmittedOn: '2026-09-15', submittedOn: '2026-09-15', updatedOn: '2026-10-06', selectedBo: 'BO-02',
      assessment: A102, path: ['ss', 'hod'], approvedBy: approvedBy('HOD-IA1', '2026-10-06'),
      inspections: [{ id: 'N-102-1', by: 'INS-02', byName: 'Pema Doma Lepcha', role: 'Inspector', visitDate: '2026-09-18', at: '2026-09-18 16:10', notes: 'Site visited. Office functioning on the 2nd floor; signage displayed. Fire extinguishers in place. Office had started working before the licence – penalty of ₹500 added.', files: ['site_photo_teesta_1.jpg'], originalsCollected: true, edits: [] }],
      originalsChecks: [oc('INS-02', '2026-09-18', 'at inspection')],
      fee: fixed(A102, 'Licence', '2026-10-06'),
      history: [['2026-09-15 12:02', 'APPLICANT', 'Application submitted', '', 'Submitted'],
        ['2026-09-17 10:30', 'INS-02', 'Verification started', '', 'Under Inspection'],
        ['2026-09-18 16:10', 'INS-02', 'Inspection report added · fee assessed ₹10,500 (licence fee ₹9,000 + garbage fee ₹1,000 + penalties ₹500) · originals verified at inspection', 'Site visited on 18 Sep 2026', 'Under Inspection'],
        ['2026-09-19 11:00', 'INS-02', 'Forwarded to BO (Sushma Rai)', 'Documents and site in order.', 'With BO'],
        ['2026-09-24 14:15', 'BO-02', 'Forwarded to Special Secretary', 'Recommended for licence.', 'With Special Secretary'],
        ['2026-09-29 12:40', 'SS-01', 'Approved and forwarded to Issuing Authority', 'Verified. Recommended for approval.', 'With Issuing Authority'],
        ['2026-10-06 11:25', 'HOD-IA1', 'Approved (final) – fee ₹10,500 fixed (licence fee ₹9,000 + garbage fee ₹1,000 + penalties ₹500)', 'Approved as recommended.', 'Approved – Payment Pending']] }),

    app({ appId: 'TL-NE-2026-000103', businessKey: 'bizG', status: 'Submitted', firstSubmittedOn: '2026-11-16', submittedOn: '2026-11-16', updatedOn: '2026-11-16',
      history: [['2026-11-16 10:48', 'APPLICANT', 'Application submitted', '', 'Submitted']] }),

    app({ appId: 'TL-NE-2026-000104', businessKey: 'bizH', status: 'Under Inspection', firstSubmittedOn: '2026-11-10', submittedOn: '2026-11-10', updatedOn: '2026-11-13',
      assessment: assessed(8000, 1500, 'INS-02', '2026-11-13'),
      inspections: [{ id: 'N-104-1', by: 'INS-02', byName: 'Pema Doma Lepcha', role: 'Inspector', visitDate: '2026-11-13', at: '2026-11-13 15:30', notes: 'Store visited. Fit-out complete, opening planned for December. Original incorporation certificate, franchise agreement and NOC of the house owner seen and collected for the file.', files: ['store_front_mountainmart.jpg'], originalsCollected: true, edits: [] }],
      originalsChecks: [oc('INS-02', '2026-11-13', 'at inspection')],
      history: [['2026-11-10 09:55', 'APPLICANT', 'Application submitted', '', 'Submitted'],
        ['2026-11-12 11:10', 'INS-02', 'Verification started', '', 'Under Inspection'],
        ['2026-11-13 15:30', 'INS-02', 'Inspection report added · fee assessed ₹9,500 (licence fee ₹8,000 + garbage fee ₹1,500) · originals verified at inspection', 'Site visited on 13 Nov 2026', 'Under Inspection']] }),

    app({ appId: 'TL-NE-2026-000105', businessKey: 'bizI', status: 'With BO', firstSubmittedOn: '2026-11-02', submittedOn: '2026-11-02', updatedOn: '2026-11-10', selectedBo: 'BO-01',
      assessment: assessed(5000, 500, 'INS-01', '2026-11-08'),
      inspections: [{ id: 'N-105-1', by: 'INS-01', byName: 'Karma Tshering Bhutia', role: 'Inspector', visitDate: '2026-11-08', at: '2026-11-08 14:20', notes: 'Godown at Daragaon Road visited. Storage racks and cold chain refrigerator available. Drug licence displayed. Pharmacist on duty.', files: ['godown_yuksom.jpg', 'drug_licence_display.jpg'], originalsCollected: false, edits: [] }],
      history: [['2026-11-02 13:15', 'APPLICANT', 'Application submitted', '', 'Submitted'],
        ['2026-11-04 10:00', 'INS-01', 'Verification started', '', 'Under Inspection'],
        ['2026-11-08 14:20', 'INS-01', 'Inspection report added · fee assessed ₹5,500 (licence fee ₹5,000 + garbage fee ₹500)', 'Site visited on 8 Nov 2026', 'Under Inspection'],
        ['2026-11-10 10:40', 'INS-01', 'Forwarded to BO (Ranjit Pradhan)', 'Pharma case – forwarded to BO handling pharma.', 'With BO']] }),

    // BO → Joint Director → Special Secretary
    app({ appId: 'TL-NE-2026-000106', businessKey: 'bizJ', status: 'With Special Secretary', firstSubmittedOn: '2026-10-20', submittedOn: '2026-10-20', updatedOn: '2026-11-09', selectedBo: 'BO-02',
      assessment: assessed(10000, 1000, 'INS-01', '2026-10-28'), path: ['jd', 'ss'], sentBy: { role: 'jd', userId: 'JD-01' },
      inspections: [{ id: 'N-106-1', by: 'INS-01', byName: 'Karma Tshering Bhutia', role: 'Inspector', visitDate: '2026-10-28', at: '2026-10-28 13:00', notes: 'Office at Mangan Bazaar visited. Premises in order. Tower site register maintained.', files: ['mangan_office.jpg'], originalsCollected: false, edits: [] },
        { id: 'N-106-2', by: 'BO-02', byName: 'Sushma Rai', role: 'BO', visitDate: '2026-11-03', at: '2026-11-03 12:30', notes: 'Re-inspected. Fire exit route now marked as advised.', files: [], originalsCollected: false, edits: [] },
        { id: 'N-106-3', by: 'JD-01', byName: 'Phurba Tshering Lepcha', role: 'Joint Director', visitDate: null, at: '2026-11-09 11:40', notes: 'Premises are in Mangan district; applied under the North-East circle (HQ) as allowed. File in order.', files: [], originalsCollected: false, edits: [] }],
      history: [['2026-10-20 15:00', 'APPLICANT', 'Application submitted', '', 'Submitted'],
        ['2026-10-22 10:20', 'INS-01', 'Verification started', '', 'Under Inspection'],
        ['2026-10-28 13:00', 'INS-01', 'Inspection report added · fee assessed ₹11,000 (licence fee ₹10,000 + garbage fee ₹1,000)', 'Site visited on 28 Oct 2026', 'Under Inspection'],
        ['2026-10-29 11:00', 'INS-01', 'Forwarded to BO (Sushma Rai)', '', 'With BO'],
        ['2026-11-03 12:30', 'BO-02', 'Re-inspection note added', 'Site visited on 3 Nov 2026', 'With BO'],
        ['2026-11-05 16:05', 'BO-02', 'Forwarded to Joint Director / Director', 'Recommended.', 'With Joint Director / Director'],
        ['2026-11-09 11:40', 'JD-01', 'Joint Director note added', '', 'With Joint Director / Director'],
        ['2026-11-09 11:45', 'JD-01', 'Approved and forwarded to Special Secretary', 'Verified the file and the re-inspection. Recommended.', 'With Special Secretary']] }),

    // BO → Special Secretary → Issuing Authority
    app({ appId: 'TL-NE-2026-000107', businessKey: 'bizK', status: 'With Issuing Authority', firstSubmittedOn: '2026-10-05', submittedOn: '2026-10-05', updatedOn: '2026-11-13', selectedBo: 'BO-02',
      assessment: assessed(6000, 1000, 'INS-02', '2026-10-12'), path: ['ss', 'hod'], sentBy: { role: 'ss', userId: 'SS-01' },
      inspections: [{ id: 'N-107-1', by: 'INS-02', byName: 'Pema Doma Lepcha', role: 'Inspector', visitDate: '2026-10-12', at: '2026-10-12 12:45', notes: 'Lubricant store visited. Stock kept on racks, fire extinguishers and sand buckets in place. Fire NOC valid till 2028.', files: ['store_siniolchu.jpg'], originalsCollected: true,
        edits: [{ notes: 'Lubricant store visited. Stock kept on racks.', editedBy: 'Tenzing Wangchuk', editedRole: 'Special Secretary', editedOn: '2026-11-12 11:20' }] }],
      originalsChecks: [oc('INS-02', '2026-10-12', 'at inspection')],
      history: [['2026-10-05 10:30', 'APPLICANT', 'Application submitted', '', 'Submitted'],
        ['2026-10-08 09:40', 'INS-02', 'Verification started', '', 'Under Inspection'],
        ['2026-10-12 12:45', 'INS-02', 'Inspection report added · fee assessed ₹7,000 (licence fee ₹6,000 + garbage fee ₹1,000) · originals verified at inspection', 'Site visited on 12 Oct 2026', 'Under Inspection'],
        ['2026-10-14 10:00', 'INS-02', 'Forwarded to BO (Sushma Rai)', '', 'With BO'],
        ['2026-10-30 15:30', 'BO-02', 'Forwarded to Special Secretary', 'Recommended.', 'With Special Secretary'],
        ['2026-11-12 11:20', 'SS-01', 'Inspection note edited (original kept)', 'Added fire NOC validity from the file.', 'With Special Secretary'],
        ['2026-11-13 10:10', 'SS-01', 'Approved and forwarded to Issuing Authority', 'Verified. Fire NOC validity confirmed.', 'With Issuing Authority']] }),

    // Paid: challan generated and BR uploaded – waiting for BR verification.
    app({ appId: 'TL-NE-2026-000108', businessKey: 'bizL', status: 'BR Uploaded', firstSubmittedOn: '2026-08-12', submittedOn: '2026-08-12', updatedOn: '2026-11-14', selectedBo: 'BO-02',
      assessment: A108, path: ['hod'], approvedBy: approvedBy('HOD-CCS', '2026-11-03'),
      inspections: [{ id: 'N-108-1', by: 'INS-01', byName: 'Karma Tshering Bhutia', role: 'Inspector', visitDate: '2026-08-20', at: '2026-08-20 15:15', notes: 'Office visited. All originals seen and collected at site.', files: [], originalsCollected: true, edits: [] }],
      originalsChecks: [oc('INS-01', '2026-08-20', 'at inspection')],
      fee: fixed(A108, 'Licence', '2026-11-03'),
      challan: { no: 'UDD/CH/202627/000108-1', on: '2026-11-10', amount: 7500, status: 'Generated' },
      br: { brNo: '2627N-11001-04512', brDate: '2026-11-13', amount: 7500, scan: 'BR_2627N-11001-04512.pdf', uploadedOn: '2026-11-14', status: 'Uploaded' },
      history: [['2026-08-12 11:00', 'APPLICANT', 'Application submitted', '', 'Submitted'],
        ['2026-08-18 10:15', 'INS-01', 'Verification started', '', 'Under Inspection'],
        ['2026-08-20 15:15', 'INS-01', 'Inspection report added · fee assessed ₹7,500 (licence fee ₹6,500 + garbage fee ₹1,000) · originals verified at inspection', 'Site visited on 20 Aug 2026', 'Under Inspection'],
        ['2026-08-21 10:00', 'INS-01', 'Forwarded to BO (Sushma Rai)', '', 'With BO'],
        ['2026-09-02 12:00', 'BO-02', 'Forwarded to Issuing Authority', 'Straightforward case – sent directly to the Issuing Authority.', 'With Issuing Authority'],
        ['2026-11-03 11:45', 'HOD-CCS', 'Approved (final) – fee ₹7,500 fixed (licence fee ₹6,500 + garbage fee ₹1,000)', 'Approved.', 'Approved – Payment Pending'],
        ['2026-11-10 10:05', 'APPLICANT', 'Challan generated · UDD/CH/202627/000108-1 · ₹7,500', '', 'Approved – Payment Pending'],
        ['2026-11-14 12:20', 'APPLICANT', 'Bank Receipt uploaded · BR 2627N-11001-04512 · ₹7,500', '', 'BR Uploaded']] }),

    app({ appId: 'TL-NE-2026-000109', businessKey: 'bizM', status: 'Returned to BO', firstSubmittedOn: '2026-10-10', submittedOn: '2026-10-10', updatedOn: '2026-11-11', selectedBo: 'BO-01',
      assessment: assessed(10000, 1500, 'INS-02', '2026-10-16'),
      inspections: [{ id: 'N-109-1', by: 'INS-02', byName: 'Pema Doma Lepcha', role: 'Inspector', visitDate: '2026-10-16', at: '2026-10-16 14:00', notes: 'Plant visited. Production not yet started; machinery installed.', files: ['plant_rangpo.jpg'], originalsCollected: false, edits: [] }],
      history: [['2026-10-10 12:00', 'APPLICANT', 'Application submitted', '', 'Submitted'],
        ['2026-10-13 10:00', 'INS-02', 'Verification started', '', 'Under Inspection'],
        ['2026-10-16 14:00', 'INS-02', 'Inspection report added · fee assessed ₹11,500 (licence fee ₹10,000 + garbage fee ₹1,500)', 'Site visited on 16 Oct 2026', 'Under Inspection'],
        ['2026-10-17 11:00', 'INS-02', 'Forwarded to BO (Ranjit Pradhan)', '', 'With BO'],
        ['2026-10-27 15:10', 'BO-01', 'Forwarded to Special Secretary', '', 'With Special Secretary'],
        ['2026-11-11 12:30', 'SS-01', 'Returned to BO (Ranjit Pradhan)', 'Confirm whether the drug manufacturing licence covers all three product lines before forwarding.', 'Returned to BO']] }),

    app({ appId: 'TL-NE-2026-000110', businessKey: 'bizN', status: 'Returned to Special Secretary', firstSubmittedOn: '2026-09-25', submittedOn: '2026-09-25', updatedOn: '2026-11-12', selectedBo: 'BO-02',
      assessment: assessed(8000, 1000, 'INS-01', '2026-10-01'), path: ['ss'], sentBy: { role: 'ss', userId: 'SS-01' },
      inspections: [{ id: 'N-110-1', by: 'INS-01', byName: 'Karma Tshering Bhutia', role: 'Inspector', visitDate: '2026-10-01', at: '2026-10-01 13:30', notes: 'Hotel at Upper Deorali visited. Restaurant and parking available. Tourism registration certificate seen.', files: [], originalsCollected: false, edits: [] }],
      history: [['2026-09-25 10:00', 'APPLICANT', 'Application submitted', '', 'Submitted'],
        ['2026-09-29 11:30', 'INS-01', 'Verification started', '', 'Under Inspection'],
        ['2026-10-01 13:30', 'INS-01', 'Inspection report added · fee assessed ₹9,000 (licence fee ₹8,000 + garbage fee ₹1,000)', 'Site visited on 1 Oct 2026', 'Under Inspection'],
        ['2026-10-02 10:00', 'INS-01', 'Forwarded to BO (Sushma Rai)', '', 'With BO'],
        ['2026-10-15 16:00', 'BO-02', 'Forwarded to Special Secretary', '', 'With Special Secretary'],
        ['2026-10-30 12:00', 'SS-01', 'Approved and forwarded to Issuing Authority', 'Verified.', 'With Issuing Authority'],
        ['2026-11-12 14:45', 'HOD-CCS', 'Returned to Special Secretary', 'Inspection note does not record the number of rooms actually in use. Please confirm.', 'Returned to Special Secretary']] }),

    // Renewal request (new flow): GST certificate uploaded, no fee shown to the applicant. The Inspector worked out the fee
    // (renewal fee + garbage fee + late fee counted to the FIRST submission: grace to 15 May, submitted 4 Jun → 20 days → ₹100).
    // Returned by the BO for the GST certificate and resubmitted – back with the BO for approval.
    app({ appId: 'TL-NE-2026-000111', kind: 'Renewal', licenceNo: 'UDD/TL/NE/2025/0004', businessKey: 'bizF', status: 'Resubmitted', firstSubmittedOn: '2026-06-04', submittedOn: '2026-11-14', updatedOn: '2026-11-14', selectedBo: 'BO-02', round: 2,
      returnedBy: { role: 'bo', userId: 'BO-02' },
      assessment: assessed(12000, 1500, 'INS-01', '2026-06-06', { late: 100, lateDays: 20 }),
      inspections: [{ id: 'N-111-1', by: 'INS-01', byName: 'Karma Tshering Bhutia', role: 'Inspector', visitDate: null, at: '2026-06-06 15:40', notes: 'Renewal request checked. Licence in order; no change of items. Late fee as per the rule (20 days after the grace period).', files: [], originalsCollected: false, edits: [] }],
      docs: { gstClearance: { file: 'gst_certificate_rumtek_fuel_station_v2.pdf', v: 2, on: '2026-11-14' } },
      versions: [{ round: 1, submittedOn: '2026-06-04', returnedOn: '2026-06-10', returnedBy: 'Sushma Rai (BO)', remarks: 'The GST certificate uploaded is for FY 2024-25. Upload the certificate for FY 2025-26.', changedFields: [], changedDocs: [{ key: 'gstClearance', old: 'gst_certificate_rumtek_fuel_station.pdf', new: 'gst_certificate_rumtek_fuel_station_v2.pdf' }] }],
      history: [['2026-06-04 10:30', 'APPLICANT', 'Renewal request submitted', '', 'Submitted'],
        ['2026-06-05 11:00', 'INS-01', 'Verification started', '', 'Under Inspection'],
        ['2026-06-06 15:40', 'INS-01', 'Renewal verification note added · fee assessed ₹13,600 (renewal fee ₹12,000 + garbage fee ₹1,500 + late fee ₹100)', '', 'Under Inspection'],
        ['2026-06-06 16:00', 'INS-01', 'Forwarded to BO (Sushma Rai) for approval', 'Fee worked out as per the renewal amount and the late fee rule.', 'With BO'],
        ['2026-06-10 12:10', 'BO-02', 'Returned to applicant for correction', 'The GST certificate uploaded is for FY 2024-25. Upload the certificate for FY 2025-26.', 'Returned to Applicant'],
        ['2026-11-14 17:05', 'APPLICANT', 'Corrected and resubmitted – goes back to BO Sushma Rai', '', 'Resubmitted']] }),

    // Change of name on an active licence – in the Inspector pool.
    app({ appId: 'TL-NE-2026-000112', kind: 'Change', licenceNo: 'UDD/TL/NE/2025/0007', businessKey: 'bizQ', status: 'Submitted', firstSubmittedOn: '2026-11-15', submittedOn: '2026-11-15', updatedOn: '2026-11-15',
      change: { types: ['name'], old: { firmName: 'Ranipool Fuel Point' } },
      docs: { nameProof: { file: 'name_change_deed_ranipool.pdf', v: 1, on: '2026-11-15' } },
      history: [['2026-11-15 12:30', 'APPLICANT', 'Change request submitted', '', 'Submitted']] }),

    // Individual meat & fish shop – two sub-items; Animal Husbandry NOC and PFA / FSSAI required.
    app({ appId: 'TL-NE-2026-000113', businessKey: 'bizR', status: 'Submitted', firstSubmittedOn: '2026-11-17', submittedOn: '2026-11-17', updatedOn: '2026-11-17',
      history: [['2026-11-17 09:40', 'APPLICANT', 'Application submitted', '', 'Submitted']] }),

    // Old licence (issued in 2016, last valid to 31 Mar 2023) renewed through the new application flow.
    // Same licence number on issue, only the year part changes (UDD/TL/1187/2016 → UDD/TL/1187/2026).
    // The Inspector assesses the licence fee, garbage fee and the backlog fee for the lapsed years.
    app({ appId: 'TL-NE-2026-000114', businessKey: 'bizS', status: 'Under Inspection', firstSubmittedOn: '2026-11-12', submittedOn: '2026-11-12', updatedOn: '2026-11-14',
      history: [['2026-11-12 11:15', 'APPLICANT', 'Application submitted (renewal of old licence UDD/TL/1187/2016)', '', 'Submitted'],
        ['2026-11-14 10:30', 'INS-01', 'Verification started', '', 'Under Inspection']] }),

    // Renewal request of an expired licence, with an item added – the Inspector works out the fee.
    app({ appId: 'TL-NE-2026-000115', kind: 'Renewal', licenceNo: 'UDD/TL/NE/2024/0015', businessKey: 'bizT', status: 'Submitted', firstSubmittedOn: '2026-11-10', submittedOn: '2026-11-10', updatedOn: '2026-11-10',
      prevPurposes: [{ category: 'GARAGE', item: 'Automobile Spare Parts and Accessories' }],
      purposes: [{ category: 'GARAGE', item: 'Automobile Spare Parts and Accessories' }, { category: 'GARAGE', item: 'Automobile Electrical Parts' }],
      history: [['2026-11-10 13:20', 'APPLICANT', 'Renewal request submitted (items added / removed)', '', 'Submitted']] }),

    // Beauty parlour (two sub-items): BO forwarded to the Joint Director / Director.
    app({ appId: 'TL-NE-2026-000116', businessKey: 'bizU', status: 'With Joint Director / Director', firstSubmittedOn: '2026-10-28', submittedOn: '2026-10-28', updatedOn: '2026-11-15', selectedBo: 'BO-02',
      assessment: assessed(4000, 500, 'INS-02', '2026-11-04'), path: ['jd'], sentBy: { role: 'bo', userId: 'BO-02' },
      inspections: [{ id: 'N-116-1', by: 'INS-02', byName: 'Pema Doma Lepcha', role: 'Inspector', visitDate: '2026-11-04', at: '2026-11-04 12:15', notes: 'Parlour at Singtam Bazaar visited. Two chairs, wash basin and sterilisation unit; cosmetics counter at the front. Premises in Singtam, applied under the North-East circle.', files: [], originalsCollected: true, edits: [] }],
      originalsChecks: [oc('INS-02', '2026-11-04', 'at inspection')],
      history: [['2026-10-28 10:10', 'APPLICANT', 'Application submitted', '', 'Submitted'],
        ['2026-10-30 11:00', 'INS-02', 'Verification started', '', 'Under Inspection'],
        ['2026-11-04 12:15', 'INS-02', 'Inspection report added · fee assessed ₹4,500 (licence fee ₹4,000 + garbage fee ₹500) · originals verified at inspection', 'Site visited on 4 Nov 2026', 'Under Inspection'],
        ['2026-11-05 10:00', 'INS-02', 'Forwarded to BO (Sushma Rai)', '', 'With BO'],
        ['2026-11-15 15:20', 'BO-02', 'Forwarded to Joint Director / Director', 'Two sub-items under one licence – for approval.', 'With Joint Director / Director']] })
  ];
  // Change request carries the new name
  APPLICATIONS.filter(function (a) { return a.appId === 'TL-NE-2026-000112'; })[0].form.firmName = 'Ranipool Highway Fuels';

  // ---------------- Licences ----------------
  // fees: the first licence fee and garbage fee assessed by the Inspector; renewal amounts start from these
  // and can be revised by the Department (each revision kept in history).
  function ver(o) { return Object.assign({ superseded: null, change: null }, o); }
  function fees(fee, garbage, on, by, extra) { return Object.assign({ first: { fee: fee, garbage: garbage, on: on, by: by }, renewal: fee, garbage: garbage, history: [] }, extra || {}); }
  function lic(key, o) { return Object.assign({ businessKey: key, circle: 'NE', details: clone(BUSINESSES[key].form) }, purposeOf(key), o); }
  var LICENCES = [
    lic('bizD', { licenceNo: 'UDD/TL/NE/2024/0003', firstIssuedOn: '2024-06-12', validTo: '2027-03-31', fees: fees(8000, 1500, '2024-05-28', 'Karma Tshering Bhutia'),
      versions: [
        ver({ v: 1, businessName: 'Gangtok Pharma Industries', premisesAddress: 'Plot 12, Industrial Estate', locality: 'Bojoghari', district: 'Gangtok', officeAddress: 'H. No. 21, Lower Burtuk, Burtuk, PO Gangtok, Gangtok', issuedOn: '2024-06-12', appId: 'TL-NE-2024-000031', approvedBy: 'Dorjee Namgyal (CCS)', brNo: '2425N-11001-00877', superseded: '2025-09-10' }),
        ver({ v: 2, businessName: 'Gangtok Pharma Industries Ltd.', premisesAddress: 'Plot 12, Industrial Estate', locality: 'Bojoghari', district: 'Gangtok', officeAddress: 'H. No. 21, Lower Burtuk, Burtuk, PO Gangtok, Gangtok', issuedOn: '2025-09-10', appId: 'TL-NE-2025-000058', approvedBy: 'Nima Sherpa (Issuing Authority)', brNo: '2526N-11001-02210',
          change: { types: ['name'], from: { companyName: 'Gangtok Pharma Industries' }, to: { companyName: 'Gangtok Pharma Industries Ltd.' } } })
      ],
      renewals: [
        { appId: 'TL-NE-2025-000019', on: '2025-04-22', validTo: '2026-03-31', fee: 8000, garbage: 1500, fine: 0, brNo: '2526N-11001-00412' },
        { appId: 'TL-NE-2026-000014', on: '2026-04-18', validTo: '2027-03-31', fee: 8000, garbage: 1500, fine: 0, brNo: '2627N-11001-00398' }
      ] }),
    lic('bizE', { licenceNo: 'UDD/TL/NE/2024/0011', firstIssuedOn: '2024-09-03', validTo: '2026-03-31', fees: fees(20000, 2000, '2024-08-21', 'Pema Doma Lepcha'),
      versions: [ver({ v: 1, businessName: 'Denzong Petro Depot', premisesAddress: 'Depot Yard, Depot Road', locality: 'Majhitar', district: 'Pakyong', officeAddress: 'H. No. 8, Majhitar Road, Rangpo, PO Rangpo, Pakyong, 737132', issuedOn: '2024-09-03', appId: 'TL-NE-2024-000047', approvedBy: 'Dorjee Namgyal (CCS)', brNo: '2425N-11001-01544' })],
      renewals: [{ appId: 'TL-NE-2025-000022', on: '2025-04-28', validTo: '2026-03-31', fee: 20000, garbage: 2000, fine: 0, brNo: '2526N-11001-00467' }] }),
    lic('bizF', { licenceNo: 'UDD/TL/NE/2025/0004', firstIssuedOn: '2025-05-06', validTo: '2026-03-31', fees: fees(12000, 1500, '2025-04-24', 'Karma Tshering Bhutia'),
      versions: [ver({ v: 1, businessName: 'Rumtek Fuel Station', premisesAddress: 'Km 4, Rumtek Road', locality: 'Ranka', district: 'Gangtok', officeAddress: 'H. No. 45, Rumtek Road, Ranka, PO Rumtek, Gangtok, 737135', issuedOn: '2025-05-06', appId: 'TL-NE-2025-000009', approvedBy: 'Nima Sherpa (Issuing Authority)', brNo: '2526N-11001-00630' })],
      renewals: [] }),
    lic('bizQ', { licenceNo: 'UDD/TL/NE/2025/0007', firstIssuedOn: '2025-06-20', validTo: '2027-03-31',
      fees: fees(12000, 1500, '2025-06-09', 'Pema Doma Lepcha', { renewal: 12500, history: [{ oldRenewal: 12000, oldGarbage: 1500, renewal: 12500, garbage: 1500, changedBy: 'Sangeeta Subba (Department Admin)', changedOn: '2026-11-10', remarks: 'Revised as per departmental order dated 5 Nov 2026 – applies from the 2027-28 renewal' }] }),
      versions: [ver({ v: 1, businessName: 'Ranipool Fuel Point', premisesAddress: 'Km 12, NH-10', locality: 'Ranipool', district: 'Gangtok', officeAddress: 'H. No. 2, NH-10, Ranipool, PO Ranipool, Gangtok, 737135', issuedOn: '2025-06-20', appId: 'TL-NE-2025-000027', approvedBy: 'Dorjee Namgyal (CCS)', brNo: '2526N-11001-00901' })],
      renewals: [{ appId: 'TL-NE-2026-000011', on: '2026-04-09', validTo: '2027-03-31', fee: 12000, garbage: 1500, fine: 0, brNo: '2627N-11001-00222' }] }),
    lic('bizT', { licenceNo: 'UDD/TL/NE/2024/0015', firstIssuedOn: '2024-07-15', validTo: '2026-03-31', fees: fees(5000, 500, '2024-07-02', 'Pema Doma Lepcha'),
      versions: [ver({ v: 1, businessName: 'Namgyal Auto Spares', premisesAddress: 'Shop No. 4, NH-10', locality: 'Ranipool Bazaar', district: 'Gangtok', officeAddress: 'H. No. 11, Singtam Road, Ranipool, PO Ranipool, Gangtok, 737135', issuedOn: '2024-07-15', appId: 'TL-NE-2024-000052', approvedBy: 'Nima Sherpa (Issuing Authority)', brNo: '2425N-11001-01208' })],
      renewals: [{ appId: 'TL-NE-2025-000031', on: '2025-05-30', validTo: '2026-03-31', fee: 5000, garbage: 500, fine: 75, brNo: '2526N-11001-00815' }] })
  ];
  LICENCES[0].details.companyName = 'Gangtok Pharma Industries Ltd.';

  // ---------------- Collections ledger ----------------
  // One row per verified Bank Receipt (reports: new licences, renewals, revenue and late fees by month / quarter / FY).
  // The licences above, plus earlier entries of the licence register (no detail in this demo).
  function pay(on, kind, licenceNo, appId, base, garbage, late, backlog, penalty, exempted) {
    late = late || 0; backlog = backlog || 0; penalty = penalty || 0;
    return { appId: appId, licenceNo: licenceNo, kind: kind, on: on, brNo: '', base: base, garbage: garbage, late: late, backlog: backlog, penalty: penalty, other: 0, exempted: exempted || 0, total: base + garbage + late + backlog + penalty };
  }
  var PAYMENTS = [
    pay('2024-06-12', 'New', 'UDD/TL/NE/2024/0003', 'TL-NE-2024-000031', 8000, 1500),
    pay('2024-07-15', 'New', 'UDD/TL/NE/2024/0015', 'TL-NE-2024-000052', 5000, 500),
    pay('2024-09-03', 'New', 'UDD/TL/NE/2024/0011', 'TL-NE-2024-000047', 20000, 2000),
    pay('2025-04-09', 'Renewal', 'UDD/TL/NE/2024/0021', null, 6000, 1000),
    pay('2025-04-22', 'Renewal', 'UDD/TL/NE/2024/0003', 'TL-NE-2025-000019', 8000, 1500),
    pay('2025-04-28', 'Renewal', 'UDD/TL/NE/2024/0011', 'TL-NE-2025-000022', 20000, 2000),
    pay('2025-05-06', 'New', 'UDD/TL/NE/2025/0004', 'TL-NE-2025-000009', 12000, 1500),
    pay('2025-05-22', 'Renewal', 'UDD/TL/NE/2024/0018', null, 4500, 500, 35),
    pay('2025-05-30', 'Renewal', 'UDD/TL/NE/2024/0015', 'TL-NE-2025-000031', 5000, 500, 75),
    pay('2025-06-20', 'New', 'UDD/TL/NE/2025/0007', 'TL-NE-2025-000027', 12000, 1500),
    pay('2025-07-11', 'Renewal', 'UDD/TL/NE/2024/0024', null, 7000, 1000, 285),
    pay('2025-08-04', 'New', 'UDD/TL/NE/2025/0012', null, 6000, 1000, 0, 0, 500),
    pay('2025-09-10', 'Change', 'UDD/TL/NE/2024/0003', 'TL-NE-2025-000058', 2000, 0),
    pay('2025-10-16', 'New', 'UDD/TL/NE/2025/0016', null, 9000, 1500),
    pay('2025-11-25', 'New', 'UDD/TL/1042/2025', null, 5000, 500, 0, 6000, 0, 1000),
    pay('2026-01-14', 'Change', 'UDD/TL/NE/2025/0012', null, 1500, 0),
    pay('2026-02-19', 'Renewal', 'UDD/TL/NE/2025/0002', null, 8000, 1000),
    pay('2026-03-23', 'Renewal', 'UDD/TL/NE/2025/0005', null, 5500, 500),
    pay('2026-04-09', 'Renewal', 'UDD/TL/NE/2025/0007', 'TL-NE-2026-000011', 12000, 1500),
    pay('2026-04-18', 'Renewal', 'UDD/TL/NE/2024/0003', 'TL-NE-2026-000014', 8000, 1500),
    pay('2026-04-27', 'Renewal', 'UDD/TL/NE/2025/0012', null, 6000, 1000),
    pay('2026-05-28', 'Renewal', 'UDD/TL/NE/2025/0016', null, 9000, 1500, 65),
    pay('2026-06-17', 'New', 'UDD/TL/NE/2026/0003', null, 7500, 1000),
    pay('2026-07-02', 'Renewal', 'UDD/TL/NE/2024/0021', null, 6000, 1000, 240, 0, 0, 240),
    pay('2026-08-12', 'New', 'UDD/TL/0877/2026', null, 4000, 500, 0, 4500, 500),
    pay('2026-09-08', 'New', 'UDD/TL/NE/2026/0006', null, 10000, 1500),
    pay('2026-10-21', 'Change', 'UDD/TL/NE/2026/0003', null, 1000, 0),
    pay('2026-11-05', 'Renewal', 'UDD/TL/NE/2024/0024', null, 7000, 1000, 870, 0, 1000)
  ];

  BUSINESSES.bizB.notifications.push({ title: 'Application returned for correction', body: 'TL-NE-2026-000101: the Inspector has asked you to correct the PAN and upload a signed NOC of the house owner.', appId: 'TL-NE-2026-000101', date: '2026-11-06', unread: true });
  BUSINESSES.bizC.notifications.push({ title: 'Application approved – pay the fee', body: 'TL-NE-2026-000102 is approved. Generate the challan for ₹10,500, pay it at the bank and upload the Bank Receipt.', appId: 'TL-NE-2026-000102', date: '2026-10-06', unread: true });
  BUSINESSES.bizD.notifications.push({ title: 'Licence renewed', body: 'UDD/TL/NE/2024/0003 is renewed and valid up to 31 Mar 2027.', appId: null, date: '2026-04-18', unread: false });
  BUSINESSES.bizE.notifications.push({ title: 'Licence expired', body: 'UDD/TL/NE/2024/0011 expired on 31 Mar 2026. Submit the renewal request now. A late fee of ₹5 per day applies after the 45-day grace period; the Inspector works out the fee.', appId: null, date: '2026-05-16', unread: true });
  BUSINESSES.bizF.notifications.push({ title: 'Renewal returned for correction', body: 'TL-NE-2026-000111: upload the GST certificate for FY 2025-26.', appId: 'TL-NE-2026-000111', date: '2026-06-10', unread: false });

  global.TL_DATA = {
    demoToday: '2026-11-17',
    config: {
      circles: [
        // Businesses in any district may apply to the North-East circle, which is the Headquarters.
        { code: 'NE', name: 'North-East Circle', office: 'UDD Headquarters, NH-10, Gangtok', districts: ['Gangtok', 'Pakyong', 'Mangan'], active: true, note: 'Headquarters – businesses in any district may apply here' },
        { code: 'SW', name: 'South-West Circle', office: 'Circle offices (Soreng, Jorethang and others)', districts: ['Namchi', 'Gyalshing', 'Soreng'], active: false, note: 'Workflow to be confirmed after the North-East circle' }
      ],
      districts: ['Gangtok', 'Pakyong', 'Mangan', 'Namchi', 'Gyalshing', 'Soreng'],
      categories: CATEGORIES,
      // Changes to the items master (newest last).
      itemHistory: [],
      docTypes: DOC_TYPES,
      // Changes to the document types master and its mappings (newest last).
      docHistory: [],
      // Renewal late fee: 45 days' grace after 31 March; ₹5 per day after that.
      renewalFine: { graceDays: 45, perDay: 5 },
      // Renewal opens this many months before the licence expires on 31 March (set by the Department Admin).
      renewalWindow: { monthsBefore: 2 },
      settingsHistory: [
        { setting: 'Renewal opens before expiry', oldValue: '1 month', newValue: '2 months', changedBy: 'Sangeeta Subba (Department Admin)', changedOn: '2026-10-01', remarks: 'Give licence holders more time to renew before 31 March' },
        { setting: 'Renewal grace period', oldValue: '30 days', newValue: '45 days', changedBy: 'Sangeeta Subba (Department Admin)', changedOn: '2026-11-17', remarks: 'Late fee of ₹5 per day only after 45 days from expiry' }
      ],
      banks: [{ name: 'State Bank of India', branch: 'MG Marg Branch, Gangtok' }],
      // Head of account printed on the challan (to be confirmed by the department).
      headOfAccount: '0217-60-800-xx – Other receipts (Trade Licence fee) – to be confirmed'
    },
    staff: STAFF,
    businesses: BUSINESSES,
    applications: APPLICATIONS,
    licences: LICENCES,
    payments: PAYMENTS,
    attachments: [],
    auditLog: [],
    outbox: []
  };
  // Seed audit log from application histories (newest first).
  APPLICATIONS.forEach(function (a) {
    a.history.forEach(function (x) { global.TL_DATA.auditLog.push({ at: x.at, user: x.by, role: x.role, appId: a.appId, action: x.action, remarks: x.remarks }); });
  });
  global.TL_DATA.auditLog.sort(function (p, q) { return p.at < q.at ? 1 : -1; });
})(window);
