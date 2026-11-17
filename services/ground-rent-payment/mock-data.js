/* ==========================================================================
   Online Ground Rent Payment System – prototype mock data (Stage 02)
   All names, mobiles, BR numbers and receipts below are DEMONSTRATION DATA.
   Goyal (Sl. 2) and Ibrahim (Sl. 4) follow the two register pages in the
   design document; every other account is a dummy record.
   Amounts are never stored here except certified opening balances and
   payments – everything else is calculated by dues-engine.js.
   ========================================================================== */
(function (global) {
  'use strict';

  // Fixed demonstration date so every reviewer sees the same figures.
  var DEMO_TODAY = '2026-11-16';

  // Wards of ULBs whose ward names are not yet received: Ward 1 … Ward N, localities added later.
  function numberedWards(counts) {
    var list = [];
    Object.keys(counts).forEach(function (code) {
      for (var i = 1; i <= counts[code]; i++) list.push({ ulb: code, code: 'W' + (i < 10 ? '0' : '') + i, name: 'Ward ' + i, localities: [] });
    });
    return list;
  }

  var config = {
    rateCategories: [
      { code: 'MC', name: 'Municipal Corporation' },
      { code: 'MCL', name: 'Municipal Council' },
      { code: 'NP', name: 'Nagar Panchayat' },
      { code: 'ONA', name: 'Other Notified Area / Bazaar' }
    ],
    // Masters: District → Municipality / ULB (with its type) → Wards → Localities.
    districts: ['Gangtok', 'Mangan', 'Pakyong', 'Soreng', 'Gyalshing', 'Namchi'],
    ulbs: [
      { code: 'GMC', name: 'Gangtok Municipal Corporation', category: 'MC', district: 'Gangtok', wardCount: 21, active: true, cutOffDate: '2026-03-31', goLiveFy: '2026-27', migrationStatus: 'Live', allottedSites: 1578 },
      { code: 'SGT', name: 'Singtam Nagar Panchayat', category: 'NP', district: 'Gangtok', wardCount: 5, active: false, cutOffDate: '2027-03-31', goLiveFy: '2027-28', migrationStatus: 'Data received', allottedSites: null },
      { code: 'RNG', name: 'Rangpo Nagar Panchayat', category: 'NP', district: 'Gangtok', wardCount: 5, active: false, cutOffDate: null, goLiveFy: null, migrationStatus: 'Not started', allottedSites: null },
      { code: 'NMC', name: 'Namchi Municipal Council', category: 'MCL', district: 'Namchi', wardCount: 7, active: false, cutOffDate: null, goLiveFy: null, migrationStatus: 'Not started', allottedSites: null },
      { code: 'NJN', name: 'Nayabazar Jorethang Nagar Panchayat', category: 'NP', district: 'Namchi', wardCount: 5, active: false, cutOffDate: null, goLiveFy: null, migrationStatus: 'Not started', allottedSites: null },
      { code: 'GYL', name: 'Gyalshing Nagar Panchayat (Geyzing)', category: 'NP', district: 'Gyalshing', wardCount: 5, active: false, cutOffDate: null, goLiveFy: null, migrationStatus: 'Not started', allottedSites: null },
      { code: 'SRG', name: 'Soreng Nagar Panchayat', category: 'NP', district: 'Soreng', wardCount: 5, active: false, cutOffDate: null, goLiveFy: null, migrationStatus: 'Not started', allottedSites: null },
      { code: 'PKY', name: 'Pakyong Nagar Panchayat', category: 'NP', district: 'Pakyong', wardCount: 5, active: false, cutOffDate: null, goLiveFy: null, migrationStatus: 'Not started', allottedSites: null },
      { code: 'MGN', name: 'Mangan Nagar Panchayat', category: 'NP', district: 'Mangan', wardCount: 5, active: false, cutOffDate: null, goLiveFy: null, migrationStatus: 'Not started', allottedSites: null },
      // Other Notified Areas / Bazaars are ULBs of their own (type ONA), usually one bazaar area each.
      { code: 'LDK', name: 'Lingdok / Penlong', category: 'ONA', district: 'Gangtok', wardCount: 1, active: false, cutOffDate: null, goLiveFy: null, migrationStatus: 'Not started', allottedSites: null },
      { code: 'MCP', name: '32-Nos. / Middle Camp', category: 'ONA', district: 'Gangtok', wardCount: 1, active: false, cutOffDate: null, goLiveFy: null, migrationStatus: 'Not started', allottedSites: null },
      { code: 'MKH', name: 'Makha', category: 'ONA', district: 'Gangtok', wardCount: 1, active: false, cutOffDate: null, goLiveFy: null, migrationStatus: 'Not started', allottedSites: null },
      { code: 'RRT', name: 'Rorathang', category: 'ONA', district: 'Pakyong', wardCount: 1, active: false, cutOffDate: null, goLiveFy: null, migrationStatus: 'Not started', allottedSites: null },
      { code: 'RNK', name: 'Rhenock', category: 'ONA', district: 'Pakyong', wardCount: 1, active: false, cutOffDate: null, goLiveFy: null, migrationStatus: 'Not started', allottedSites: null },
      { code: 'RGL', name: 'Rongli', category: 'ONA', district: 'Pakyong', wardCount: 1, active: false, cutOffDate: null, goLiveFy: null, migrationStatus: 'Not started', allottedSites: null },
      { code: 'DKC', name: 'Dikchu', category: 'ONA', district: 'Mangan', wardCount: 1, active: false, cutOffDate: null, goLiveFy: null, migrationStatus: 'Not started', allottedSites: null }
    ],
    // ULB → Wards → Localities. Each site picks one ward and one locality of that ward.
    wards: [
      { ulb: 'GMC', code: 'W01', name: 'M.G. Marg', localities: ['Lower M.G. Marg / Lall Bazaar', 'Upper M.G. Marg'] },
      { ulb: 'GMC', code: 'W02', name: 'Diesel Power House (DPH)', localities: ['DPH', 'Paljor Stadium Road', 'Church Road'] },
      { ulb: 'GMC', code: 'W03', name: 'Development Area', localities: ['Development Area', 'Secretariat'] },
      { ulb: 'GMC', code: 'W04', name: 'Tibet Road', localities: ['Tibet Road'] },
      { ulb: 'GMC', code: 'W05', name: 'Deorali', localities: ['Deorali Bazaar', 'Ropeway Area'] },
      { ulb: 'GMC', code: 'W06', name: 'Tadong', localities: ['Tadong College Area', 'Tadong Defence Area'] },
      { ulb: 'GMC', code: 'W07', name: 'Ranipool', localities: ['Ranipool Bazaar', 'Seti Pool'] },
      { ulb: 'GMC', code: 'W08', name: 'Upper Burtuk / Burtuk', localities: ['Tashi View Point', 'Ganesh Tok', 'Burtuk Jhora', 'Eastern Bye Pass'] },
      { ulb: 'GMC', code: 'W09', name: 'Bojoghari (2nd Mile)', localities: ['Bojoghari', '2nd Mile'] },
      { ulb: 'GMC', code: 'W10', name: 'Lower & Upper Sichey', localities: ['Lower Sichey', 'Upper Sichey'] },
      { ulb: 'GMC', code: 'W11', name: 'Chandmari', localities: ['Chandmari'] },
      { ulb: 'GMC', code: 'W12', name: 'Tathangchen / Syari', localities: ['Tathangchen', 'Syari'] },
      { ulb: 'GMC', code: 'W13', name: 'Arithang', localities: ['Arithang-I', 'Arithang-II'] },
      { ulb: 'GMC', code: 'W14', name: 'Pani House', localities: ['Pani House'] },
      { ulb: 'GMC', code: 'W15', name: 'Daragaon-Lumsey', localities: ['Daragaon', 'Lumsey', 'Amdo Golai'] },
      // GMC has 21 wards; names of W16–W21 are awaited from the Department.
      { ulb: 'GMC', code: 'W16', name: 'Ward 16', localities: [] },
      { ulb: 'GMC', code: 'W17', name: 'Ward 17', localities: [] },
      { ulb: 'GMC', code: 'W18', name: 'Ward 18', localities: [] },
      { ulb: 'GMC', code: 'W19', name: 'Ward 19', localities: [] },
      { ulb: 'GMC', code: 'W20', name: 'Ward 20', localities: [] },
      { ulb: 'GMC', code: 'W21', name: 'Ward 21', localities: [] }
    ].concat(numberedWards({ SGT: 5, RNG: 5, NMC: 7, NJN: 5, GYL: 5, SRG: 5, PKY: 5, MGN: 5 }))
      // Each bazaar starts with one area named after it; localities are added in Configuration.
      .concat([{ ulb: 'LDK', code: 'W01', name: 'Lingdok / Penlong Bazaar', localities: [] }, { ulb: 'MCP', code: 'W01', name: '32-Nos. / Middle Camp Bazaar', localities: [] }, { ulb: 'MKH', code: 'W01', name: 'Makha Bazaar', localities: [] }, { ulb: 'RRT', code: 'W01', name: 'Rorathang Bazaar', localities: [] }, { ulb: 'RNK', code: 'W01', name: 'Rhenock Bazaar', localities: [] }, { ulb: 'RGL', code: 'W01', name: 'Rongli Bazaar', localities: [] }, { ulb: 'DKC', code: 'W01', name: 'Dikchu Bazaar', localities: [] }]),
    // Effective-dated rent rates (₹ per 100 sq ft). Lookup: Ward → ULB → Category.
    rateRules: [
      { id: 'RR-001', level: 'Category', target: 'MC', rate: 500, from: '2024-09-01', to: null, notificationNo: '17/UDD/2024', gazetteNo: '416' },
      { id: 'RR-002', level: 'Category', target: 'MCL', rate: 200, from: '2024-09-01', to: null, notificationNo: '17/UDD/2024', gazetteNo: '416' },
      { id: 'RR-003', level: 'Category', target: 'NP', rate: 200, from: '2024-09-01', to: null, notificationNo: '17/UDD/2024', gazetteNo: '416' },
      { id: 'RR-004', level: 'Category', target: 'ONA', rate: 50, from: '2024-09-01', to: null, notificationNo: '17/UDD/2024', gazetteNo: '416' }
    ],
    surchargeRules: [
      { id: 'SR-001', rate: 5, from: '2024-09-01', to: null, method: 'ONCE_PER_OVERDUE_YEAR', ref: 'Gazette No. 416, Notification 17/UDD/2024' }
    ],
    settings: {
      makerChecker: false,
      advancePayment: false,
      partialOfflinePayment: true,
      allocationOrder: 'SURCHARGE_FIRST',
      rounding: 'NEAREST',
      challanValidityDays: 15,
      midYearRevision: 'PRO_RATA_MONTH',
      newStructureFrom: 'SAME_FY',
      structureRemovalStops: 'NEXT_FY'
    }
  };

  // ---------------------------------------------------------------------
  // Site accounts (one per GR ID). Structures carry chargeable FY range.
  // ---------------------------------------------------------------------
  function st(type, l, w, area, mutationNo, orderDate, fromFy, toFy, note) {
    return {
      type: type, lengthFt: l, widthFt: w,
      areaSqft: area != null ? area : Math.round(l * w * 100) / 100,
      areaOverrideReason: area != null && l == null ? (note || 'Area entered directly as per register') : null,
      mutationNo: mutationNo, orderDate: orderDate,
      chargeableFromFy: fromFy, chargeableToFy: toFy || null
    };
  }
  function ob(paidUpToFy, principal, surcharge, last) {
    return { asOfFy: '2025-26', paidUpToFy: paidUpToFy, principal: principal, surcharge: surcharge, lastPayment: last || null, certifiedBy: 'Pending (Q14)' };
  }
  function owner(name, relation, guardian, mobile, share) {
    return { name: name, relation: relation, guardian: guardian, mobile: mobile || null, share: share || 100 };
  }

  var sites = [
    { grId: 'GR-GMC-W01-00002', ulb: 'GMC', ward: 'W01', locality: 'Upper M.G. Marg', plotNo: null,
      legacy: { book: 'Gangtok-I', page: 1, slNo: 2 }, address: 'M.G. Marg, Gangtok', status: 'Active', dataVerified: true,
      owners: [owner('Shri Prasant Kumar Goyal', 'S/o', 'Shri Prem Prakash Goyal', '9800000101')],
      structures: [
        st('R.C.C. shop-cum-residential', 12, 37, null, 'Original allotment', '1994-01-01', '1994-95'),
        st('R.C.C. shop-cum-residential', 12, 34, null, 'Original allotment', '1994-01-01', '1994-95'),
        st('R.C.C. shop-cum-residential', 10, 37, null, '2/DCE', '2004-01-03', '2003-04')
      ],
      opening: ob('2025-26', 0, 0, { brNo: '2425N-11001-61739', date: '2025-03-04', amount: 7888, period: '2025-26' }) },

    { grId: 'GR-GMC-W01-00004', ulb: 'GMC', ward: 'W01', locality: 'Lower M.G. Marg / Lall Bazaar', plotNo: null,
      legacy: { book: 'Gangtok-I', page: 2, slNo: 4 }, address: 'Lal Bazaar, Gangtok', status: 'Active', dataVerified: true,
      owners: [owner('Md. Ibrahim', 'S/o', 'Abdul Rashid', '9800000105')],
      structures: [st('R.C.C. building', null, null, 2700, 'Original allotment', null, '1990-91', null, 'Total area (break-up not known)')],
      opening: ob('2024-25', 13500, 675, { brNo: '2425N-11001-20318', date: '2024-07-15', amount: 6750, period: '2024-25' }) },

    { grId: 'GR-GMC-W02-00011', ulb: 'GMC', ward: 'W02', locality: 'DPH', plotNo: null,
      legacy: { book: 'Gangtok-I', page: 14, slNo: 11 }, address: 'D.P.H. Road, Gangtok', status: 'Active', dataVerified: true,
      owners: [owner('Pemba Sherpa', 'S/o', 'Late Nima Sherpa', '9800000103', 50), owner('Dawa Doma Sherpa', 'W/o', 'Pemba Sherpa', null, 50)],
      structures: [
        st('Wooden shop house', 20, 30, null, 'Original allotment', null, '1988-89'),
        st('Assam-type', 20, 30, null, '7/DCE', '1999-06-12', '1999-00')
      ],
      opening: ob('2013-14', 52500, 2625, { brNo: '1314N-11001-3021', date: '2013-12-02', amount: 600, period: '2013-14' }) },

    { grId: 'GR-GMC-W05-00021', ulb: 'GMC', ward: 'W05', locality: 'Deorali Bazaar', plotNo: 'DEO/102',
      legacy: { book: 'Gangtok-II', page: 31, slNo: 21 }, address: 'Near Deorali Bazaar', status: 'Active', dataVerified: true,
      owners: [owner('Anita Pradhan', 'W/o', 'Ramesh Pradhan', '9800000104')],
      structures: [st('R.C.C. building', 20, 40, null, 'Original allotment', null, '2001-02')],
      opening: ob('2025-26', 0, 0, { brNo: '2526N-11001-08812', date: '2025-09-18', amount: 4000, period: '2025-26' }) },

    { grId: 'GR-GMC-W06-00034', ulb: 'GMC', ward: 'W06', locality: 'Tadong College Area', plotNo: null,
      legacy: { book: 'Gangtok-II', page: 46, slNo: 34 }, address: 'Bye-Pass Road, Tadong', status: 'Active', dataVerified: true,
      owners: [owner('Anita Pradhan', 'W/o', 'Ramesh Pradhan', '9800000104')],
      structures: [st('R.C.C. shop-cum-residential', null, null, 1199.8, 'Original allotment', null, '2005-06', null, 'Area as per register; measurement not recorded')],
      opening: ob('2025-26', 0, 0, { brNo: '2526N-11001-08813', date: '2025-09-18', amount: 5999, period: '2025-26' }) },

    { grId: 'GR-GMC-W03-00045', ulb: 'GMC', ward: 'W03', locality: 'Development Area', plotNo: null,
      legacy: { book: 'Gangtok-I', page: 52, slNo: 45 }, address: 'Development Area, Gangtok', status: 'Active', dataVerified: true,
      owners: [owner('Anita Pradhan', 'W/o', 'Ramesh Pradhan', '9800000104')],
      structures: [st('R.C.C. building', 22, 32, null, 'Original allotment', null, '2008-09')],
      opening: ob('2025-26', 0, 0, { brNo: '2526N-11001-09104', date: '2025-11-02', amount: 3520, period: '2025-26' }) },

    { grId: 'GR-GMC-W01-00007', ulb: 'GMC', ward: 'W01', locality: 'Upper M.G. Marg', plotNo: 'GTK/07',
      legacy: { book: 'Gangtok-I', page: 4, slNo: 7 }, address: 'Upper M.G. Marg, Gangtok', status: 'Active', dataVerified: true,
      owners: [owner('Tshering Bhutia', 'S/o', 'Karma Bhutia', '9800000201')],
      structures: [st('Hotel', 30, 40, null, 'Original allotment', null, '1996-97')],
      opening: ob('2025-26', 0, 0) },

    { grId: 'GR-GMC-W01-00009', ulb: 'GMC', ward: 'W01', locality: 'Lower M.G. Marg / Lall Bazaar', plotNo: null,
      legacy: { book: 'Gangtok-I', page: 5, slNo: 9 }, address: 'New Market, Gangtok', status: 'Active', dataVerified: false,
      flags: ['Register rent ≠ area × current rate (Q13)'],
      owners: [owner('Sunita Rai', 'D/o', 'Bal Bahadur Rai', '9800000202')],
      structures: [st('R.C.C. building', null, null, 2355.87, 'Original allotment', null, '1999-00', null, 'Area as per register')],
      opening: ob('2025-26', 0, 0) },

    { grId: 'GR-GMC-W02-00013', ulb: 'GMC', ward: 'W02', locality: 'Paljor Stadium Road', plotNo: null,
      legacy: { book: 'Gangtok-I', page: 15, slNo: 13 }, address: 'Paljor Stadium Road, Gangtok', status: 'Active', dataVerified: true,
      owners: [owner('Rajesh Agarwal', 'S/o', 'Mohanlal Agarwal', '9800000203')],
      structures: [
        st('R.C.C. shop-cum-residential', 25, 30, null, 'Original allotment', null, '1992-93'),
        st('R.C.C. shop-cum-residential', 15, 20, null, '5/DCE', '2011-04-20', '2011-12')
      ],
      opening: ob('2021-22', 14700, 1890) },

    { grId: 'GR-GMC-W03-00048', ulb: 'GMC', ward: 'W03', locality: 'Secretariat', plotNo: null,
      legacy: { book: 'Gangtok-I', page: 53, slNo: 48 }, address: 'Near Secretariat, Gangtok', status: 'Active', dataVerified: true,
      owners: [owner('Phurba Lepcha', 'S/o', 'Sonam Lepcha', '9800000204')],
      structures: [st('Wooden shop house', 18, 25, null, 'Original allotment', null, '1997-98')],
      opening: ob('2025-26', 0, 0) },

    { grId: 'GR-GMC-W03-00052', ulb: 'GMC', ward: 'W03', locality: 'Development Area', plotNo: null,
      legacy: { book: 'Gangtok-I', page: 55, slNo: 52 }, address: 'Development Area, Gangtok', status: 'Active', dataVerified: false,
      owners: [owner('Mingma Tamang', 'S/o', 'Lakpa Tamang', null)],
      structures: [st('R.C.C. building', 30, 30, null, 'Original allotment', null, '1994-95')],
      opening: ob('2009-10', 31500, 1575) },

    { grId: 'GR-GMC-W04-00061', ulb: 'GMC', ward: 'W04', locality: 'Tibet Road', plotNo: null,
      legacy: { book: 'Gangtok-II', page: 8, slNo: 61 }, address: 'Tibet Road, Gangtok', status: 'Active', dataVerified: true,
      flags: ['Transfer pending – allottee deceased'],
      owners: [owner('Hari Gurung', 'S/o', 'Man Bahadur Gurung', '9800000205')],
      structures: [st('Assam-type', 20, 30, null, 'Original allotment', null, '1985-86')],
      opening: ob('2018-19', 10500, 525) },

    { grId: 'GR-GMC-W04-00063', ulb: 'GMC', ward: 'W04', locality: 'Tibet Road', plotNo: 'BLK/63',
      legacy: { book: 'Gangtok-II', page: 9, slNo: 63 }, address: 'Lower Tibet Road, Gangtok', status: 'Active', dataVerified: true,
      owners: [owner('Karma Dorjee', 'S/o', 'Pema Dorjee', '9800000206')],
      structures: [st('Hotel', 30, 50, null, 'Original allotment', null, '2002-03')],
      opening: ob('2025-26', 0, 0) },

    { grId: 'GR-GMC-W05-00024', ulb: 'GMC', ward: 'W05', locality: 'Deorali Bazaar', plotNo: 'DEO/114',
      legacy: { book: 'Gangtok-II', page: 32, slNo: 24 }, address: 'Deorali, Gangtok', status: 'Active', dataVerified: true,
      owners: [owner('Rita Sharma', 'D/o', 'Krishna Sharma', '9800000207')],
      structures: [st('R.C.C. building', 22, 24, null, 'Original allotment', null, '2006-07')],
      opening: ob('2025-26', 0, 0) },

    { grId: 'GR-GMC-W05-00027', ulb: 'GMC', ward: 'W05', locality: 'Ropeway Area', plotNo: 'DEO/131',
      legacy: { book: 'Gangtok-II', page: 33, slNo: 27 }, address: 'Near Ropeway, Deorali', status: 'Active', dataVerified: true,
      owners: [owner('Ugen Bhutia', 'S/o', 'Dorjee Bhutia', '9800000208')],
      structures: [
        st('R.C.C. building', 25, 40, null, 'Original allotment', null, '2000-01'),
        st('R.C.C. building', 10, 20, null, '3/DCE', '2026-05-20', '2026-27')
      ],
      opening: ob('2025-26', 0, 0) },

    { grId: 'GR-GMC-W06-00036', ulb: 'GMC', ward: 'W06', locality: 'Tadong College Area', plotNo: null,
      legacy: { book: 'Gangtok-II', page: 47, slNo: 36 }, address: 'Tadong, Gangtok', status: 'Active', dataVerified: true,
      owners: [owner('Sangay Lhamu', 'W/o', 'Tenzing Wangchuk', '9800000209')],
      structures: [st('R.C.C. building', 24, 40, null, 'Original allotment', null, '2003-04')],
      opening: ob('2023-24', 9600, 480) },

    { grId: 'GR-GMC-W06-00039', ulb: 'GMC', ward: 'W06', locality: 'Tadong Defence Area', plotNo: 'TDG/39',
      legacy: { book: 'Gangtok-II', page: 48, slNo: 39 }, address: 'Defence Area, Tadong', status: 'Active', dataVerified: true,
      owners: [owner('Prakash Chettri', 'S/o', 'Dil Bahadur Chettri', '9800000210')],
      structures: [st('R.C.C. shop-cum-residential', 33, 40, null, 'Original allotment', null, '2004-05')],
      opening: ob('2025-26', 0, 0) },

    { grId: 'GR-GMC-W07-00071', ulb: 'GMC', ward: 'W07', locality: 'Ranipool Bazaar', plotNo: null,
      legacy: { book: 'Gangtok-III', page: 6, slNo: 71 }, address: 'Ranipool Bazaar', status: 'Active', dataVerified: false,
      owners: [owner('Deepak Subba', 'S/o', 'Ganesh Subba', '9800000211')],
      structures: [st('Assam-type', 22, 50, null, 'Original allotment', null, '1991-92')],
      opening: ob('2003-04', 38500, 1925) },

    { grId: 'GR-GMC-W07-00074', ulb: 'GMC', ward: 'W07', locality: 'Seti Pool', plotNo: null,
      legacy: { book: 'Gangtok-III', page: 7, slNo: 74 }, address: 'Seti Pool, Ranipool', status: 'Active', dataVerified: true,
      owners: [owner('Lhakpa Doma Sherpa', 'D/o', 'Ang Tshering Sherpa', '9800000212')],
      structures: [st('R.C.C. building', 16, 40, null, 'Original allotment', null, '2010-11')],
      opening: ob('2025-26', 0, 0) },

    { grId: 'GR-GMC-W08-00081', ulb: 'GMC', ward: 'W08', locality: 'Burtuk Jhora', plotNo: null,
      legacy: { book: 'Gangtok-III', page: 18, slNo: 81 }, address: 'Burtuk, Gangtok', status: 'Active', dataVerified: true,
      owners: [owner('Nirmal Pradhan', 'S/o', 'Hem Pradhan', null)],
      structures: [st('Wooden shop house', 25, 35, null, 'Original allotment', null, '1998-99')],
      opening: ob('2024-25', 4375, 219) },

    { grId: 'GR-GMC-W08-00083', ulb: 'GMC', ward: 'W08', locality: 'Ganesh Tok', plotNo: null,
      legacy: { book: 'Gangtok-III', page: 19, slNo: 83 }, address: 'Ganesh Tok Road, Gangtok', status: 'Draft', dataVerified: false,
      owners: [owner('Kiran Thapa', 'S/o', 'Bhim Thapa', '9800000213')],
      structures: [st('Other', 20, 25, null, 'Original allotment', null, '2012-13')],
      opening: ob('2022-23', 7500, 375) },

    { grId: 'GR-GMC-W02-00015', ulb: 'GMC', ward: 'W02', locality: 'Church Road', plotNo: null,
      legacy: { book: 'Gangtok-I', page: 16, slNo: 15 }, address: 'Church Road, Gangtok', status: 'Closed', dataVerified: true,
      flags: ['Site surrendered – account closed'],
      owners: [owner('Pasang Lepcha', 'S/o', 'Dorjee Lepcha', '9800000214')],
      structures: [st('Wooden shop house', 16, 25, null, 'Original allotment', null, '1990-91', '2025-26')],
      opening: ob('2025-26', 0, 0) }
  ];

  // ---------------------------------------------------------------------
  // Payments made through the system (after go-live). Only "Success"
  // payments reduce dues; "Pending" ones lock the bill (W2 step 8).
  // ---------------------------------------------------------------------
  var payments = [
    { receiptNo: 'GRR-2026-000214', grId: 'GR-GMC-W01-00004', mode: 'Offline', ref: '2627N-11001-01452', bank: 'Designated bank (pending Q8)', amount: 14175, paidOn: '2026-06-21', recordedBy: 'Supervisor (GMC)', status: 'Success', note: 'FY 2025-26 paid late, recorded against certified opening balance' },
    { receiptNo: 'GRR-2026-000087', grId: 'GR-GMC-W05-00021', mode: 'Online', ref: 'TXN2605120931', bank: 'Payment gateway (pending Q8)', amount: 4000, paidOn: '2026-05-12', recordedBy: 'Citizen', status: 'Success' },
    { receiptNo: 'GRR-2026-000121', grId: 'GR-GMC-W06-00039', mode: 'Online', ref: 'TXN2606021145', bank: 'Payment gateway (pending Q8)', amount: 6600, paidOn: '2026-06-02', recordedBy: 'Citizen', status: 'Success' },
    { receiptNo: 'GRR-2026-000188', grId: 'GR-GMC-W06-00036', mode: 'Offline', ref: '2627N-11001-01877', bank: 'Designated bank (pending Q8)', amount: 5000, paidOn: '2026-08-14', recordedBy: 'Supervisor (GMC)', status: 'Success', note: 'Partial payment, allocated oldest dues first' },
    { receiptNo: 'GRR-2026-000301', grId: 'GR-GMC-W01-00007', mode: 'Online', ref: 'TXN2611160915', bank: 'Payment gateway (pending Q8)', amount: 6000, paidOn: '2026-11-16', recordedBy: 'Citizen', status: 'Success' },
    { receiptNo: 'GRR-2026-000302', grId: 'GR-GMC-W02-00013', mode: 'Offline', ref: '2627N-11001-02210', bank: 'Designated bank (pending Q8)', amount: 21840, paidOn: '2026-11-16', recordedBy: 'Supervisor (GMC)', status: 'Success' },
    { receiptNo: 'GRR-2026-000303', grId: 'GR-GMC-W04-00063', mode: 'Online', ref: 'TXN2611161032', bank: 'Payment gateway (pending Q8)', amount: 7500, paidOn: '2026-11-16', recordedBy: 'Citizen', status: 'Success' },
    { receiptNo: null, intentNo: 'GRI-2026-004417', grId: 'GR-GMC-W01-00004', mode: 'Online', ref: 'TXN2611161042', bank: 'Payment gateway (pending Q8)', amount: 13500, paidOn: '2026-11-16', recordedBy: 'Citizen', status: 'Pending', note: 'Gateway result pending – reconciliation runs every 15 minutes' }
  ];

  // Offline challans (W3). Generated → BR Recorded → Verified / Expired / Cancelled.
  var challans = [
    { challanNo: 'GRC-2026-000318', grId: 'GR-GMC-W03-00045', amount: 3520, generatedOn: '2026-11-10', validTill: '2026-11-25', status: 'Generated', generatedBy: 'Citizen' },
    { challanNo: 'GRC-2026-000322', grId: 'GR-GMC-W03-00048', amount: 2250, generatedOn: '2026-11-12', validTill: '2026-11-27', status: 'BR Recorded', brNo: '2627N-11001-02231', brDate: '2026-11-14', brAmount: 2250, brScan: 'BR_2627N-11001-02231.jpg', brUploadedBy: 'Citizen', brUploadedOn: '2026-11-14', generatedBy: 'Citizen' },
    { challanNo: 'GRC-2026-000325', grId: 'GR-GMC-W07-00074', amount: 3200, generatedOn: '2026-11-15', validTill: '2026-11-30', status: 'BR Recorded', brNo: '2627N-11001-02260', brDate: '2026-11-16', brAmount: 3200, brScan: 'BR_2627N-11001-02260.pdf', brUploadedBy: 'Citizen', brUploadedOn: '2026-11-16', generatedBy: 'Citizen' },
    { challanNo: 'GRC-2026-000301', grId: 'GR-GMC-W05-00024', amount: 2640, generatedOn: '2026-10-20', validTill: '2026-11-04', status: 'Expired', generatedBy: 'Citizen' }
  ];

  // ---------------------------------------------------------------------
  // Citizen demo scenarios (mock Sikkim GO identities)
  // ---------------------------------------------------------------------
  var citizens = {
    scenarioA: {
      label: 'First-time citizen', badge: 'No linked accounts',
      name: 'Sonam Wangmo', mobile: '9800000100', email: 'sonam.demo@example.in',
      description: 'No site is linked to this mobile number yet. Search an account to pay.',
      savedSites: [],
      notifications: [
        { title: 'Welcome to the Online Ground Rent Payment System', body: 'Search by plot no., allottee\'s name or father\'s / husband\'s name to find a site and pay.', date: '2026-11-16', unread: true }
      ]
    },
    scenarioB: {
      label: 'Current year due', badge: 'Register account (Goyal)',
      name: 'Prasant Kumar Goyal', mobile: '9800000101', email: 'goyal.demo@example.in',
      description: 'One site linked by mobile. FY 2026-27 rent is due by 31 March 2027.',
      savedSites: [],
      notifications: [
        { title: 'Ground rent for FY 2026-27 is now payable', body: 'GR-GMC-W01-00002 · Annual rent calculated on 1,222 sq ft at ₹500 per 100 sq ft.', grId: 'GR-GMC-W01-00002', date: '2026-04-01', unread: true },
        { title: 'Your ground rent account is online', body: 'Your register entry (Gangtok-I, Page 1, Sl. 2) is now GR-GMC-W01-00002. Use it to pay online.', grId: 'GR-GMC-W01-00002', date: '2026-04-01', unread: false }
      ]
    },
    scenarioC: {
      label: 'Long-pending arrears', badge: 'Joint allottees · test case T3',
      name: 'Pemba Sherpa', mobile: '9800000103', email: 'pemba.demo@example.in',
      description: 'Certified opening balance from the register plus the current FY rent.',
      savedSites: [],
      notifications: [
        { title: 'Arrears pending on your site', body: 'GR-GMC-W02-00011 has a certified opening balance of ₹55,125 for years up to FY 2025-26. Please clear the dues.', grId: 'GR-GMC-W02-00011', date: '2026-04-01', unread: true },
        { title: 'Your ground rent account is online', body: 'Register entry Gangtok-I, Page 14, Sl. 11 is now GR-GMC-W02-00011.', grId: 'GR-GMC-W02-00011', date: '2026-04-01', unread: false }
      ]
    },
    scenarioD: {
      label: 'Several sites', badge: 'Paid · due · challan issued',
      name: 'Anita Pradhan', mobile: '9800000104', email: 'anita.demo@example.in',
      description: 'Three sites: one paid for this year, one due, one with an offline challan to pay at the bank.',
      savedSites: [],
      notifications: [
        { title: 'Offline challan generated', body: 'Challan GRC-2026-000318 for ₹3,520 (GR-GMC-W03-00045) is valid till 25 Nov 2026. Pay the exact amount at the designated bank.', grId: 'GR-GMC-W03-00045', date: '2026-11-10', unread: true },
        { title: 'Payment received', body: 'Receipt GRR-2026-000087 · ₹4,000 for GR-GMC-W05-00021 · FY 2026-27 cleared.', grId: 'GR-GMC-W05-00021', date: '2026-05-12', unread: false },
        { title: 'Ground rent for FY 2026-27 is now payable', body: 'Bills for your 3 sites are available.', date: '2026-04-01', unread: false }
      ]
    },
    scenarioE: {
      label: 'Payment under verification', badge: 'Register account (Ibrahim)',
      name: 'Md. Ibrahim', mobile: '9800000105', email: 'ibrahim.demo@example.in',
      description: 'An online payment is awaiting the gateway result. The bill is locked to stop double payment.',
      savedSites: [],
      notifications: [
        { title: 'Payment under verification', body: '₹13,500 for GR-GMC-W01-00004 is awaiting confirmation from the payment gateway. Please do not pay again.', grId: 'GR-GMC-W01-00004', date: '2026-11-16', unread: true },
        { title: 'Payment received', body: 'Receipt GRR-2026-000214 · ₹14,175 (BR 2627N-11001-01452) cleared the opening balance for FY 2025-26.', grId: 'GR-GMC-W01-00004', date: '2026-06-21', unread: false }
      ]
    }
  };

  // ---------------------------------------------------------------------
  // Department demo users (role labels only – no real officer names)
  // ---------------------------------------------------------------------
  var staffRoles = {
    supervisor: { key: 'supervisor', title: 'Supervisor', user: 'Demo Supervisor', scope: 'ULB', icon: 'bi-person-workspace',
      description: 'Approve Bank Receipts uploaded by citizens and maintain allottees, structures and transfers.' },
    deptAdmin: { key: 'deptAdmin', title: 'Dept. Admin', user: 'Demo Dept. Admin', scope: 'ULB', icon: 'bi-person-gear',
      description: 'Everything a Supervisor does, plus adjustments, payment reversals and approvals.' },
    hq: { key: 'hq', title: 'HQ', user: 'Demo HQ Officer', scope: 'STATE', icon: 'bi-globe2',
      description: 'Read-only view of every ULB: dashboards, reports with state totals and ULB-wise comparison, and the audit log.' },
    sysAdmin: { key: 'sysAdmin', title: 'System Admin', user: 'Demo System Admin', scope: 'STATE', icon: 'bi-sliders',
      description: 'Full access: ULBs, wards, rate and surcharge revisions, global rules, users and roles, plus all staff functions.' }
  };

  // Recent staff-side audit entries for the dashboard activity panel.
  var auditLog = [
    { at: '2026-11-16 11:05', user: 'Demo Supervisor', role: 'Supervisor', grId: 'GR-GMC-W02-00013', action: 'Offline payment recorded · BR 2627N-11001-02210 · ₹21,840' },
    { at: '2026-11-14 15:42', user: 'Demo Supervisor', role: 'Supervisor', grId: 'GR-GMC-W03-00048', action: 'BR recorded against challan GRC-2026-000322 · awaiting verification' },
    { at: '2026-05-20 12:10', user: 'Demo Supervisor', role: 'Supervisor', grId: 'GR-GMC-W05-00027', action: 'Structure added 10×20 = 200 sq ft · Mutation 3/DCE · file attached' },
    { at: '2026-04-01 09:00', user: 'Demo Dept. Admin', role: 'Dept. Admin', grId: null, action: 'GMC register data loaded (manual migration) · accounts created with GR IDs' }
  ];

  // Small lists (Section 5.8)
  config.lists = {
    structureTypes: ['R.C.C. shop-cum-residential', 'R.C.C. building', 'Wooden shop house', 'Hotel', 'Assam-type', 'Other'],
    transferReasons: ['Inheritance to son or daughter', 'Other legal heir / family member', 'Third-party sale / gift', 'Other'],
    adjustmentTypes: ['Waiver', 'Correction', 'Refund note'],
    reversalReasons: ['Bounced / dishonoured', 'Duplicate entry', 'Wrong account', 'Other'],
    banks: [
      { name: 'State Bank of Sikkim (SBS)', branch: 'M.G. Marg, Gangtok (to confirm – Q8)' },
      { name: 'State Bank of Sikkim (SBS)', branch: 'Tadong (to confirm – Q8)' }
    ],
    documentTypes: ['HQ transfer order', 'Mutation order / plan', 'Bank Receipt scan', 'Gazette notification', 'Adjustment approval', 'Signed certificate', 'Other']
  };
  config.reminders = [
    { on: '1 February', channel: 'SMS + email', audience: 'Current-FY dues unpaid', text: 'Ground rent for the current FY is due by 31 March.' },
    { on: '1 March', channel: 'SMS + email', audience: 'Current-FY dues unpaid', text: 'Reminder: pay ground rent by 31 March to avoid surcharge.' },
    { on: '1 April', channel: 'SMS + email', audience: 'Previous-FY dues unpaid', text: 'Surcharge now applies on last year\'s unpaid ground rent.' }
  ];

  // Staff users (A5) – demonstration accounts only
  var users = [
    { id: 'U-001', name: 'Demo Supervisor', role: 'supervisor', ulbs: ['GMC'], login: 'Sikkim GO', active: true },
    { id: 'U-002', name: 'Demo Supervisor 2', role: 'supervisor', ulbs: ['GMC'], login: 'Local + OTP', active: true },
    { id: 'U-003', name: 'Demo Dept. Admin', role: 'deptAdmin', ulbs: ['GMC'], login: 'Sikkim GO', active: true },
    { id: 'U-004', name: 'Demo HQ Officer', role: 'hq', ulbs: ['ALL'], login: 'Sikkim GO', active: true },
    { id: 'U-005', name: 'Demo System Admin', role: 'sysAdmin', ulbs: ['ALL'], login: 'Local + OTP', active: true }
  ];

  var attachments = [
    { id: 'F-0001', grId: 'GR-GMC-W05-00027', docType: 'Mutation order / plan', file: 'Mutation_3-DCE_2026.pdf', uploadedBy: 'Demo Supervisor', at: '2026-05-20' },
    { id: 'F-0002', grId: 'GR-GMC-W02-00013', docType: 'Bank Receipt scan', file: 'BR_2627N-11001-02210.jpg', uploadedBy: 'Demo Supervisor', at: '2026-11-16' },
    { id: 'F-0005', grId: 'GR-GMC-W07-00074', docType: 'Bank Receipt scan', file: 'BR_2627N-11001-02260.pdf', uploadedBy: 'Citizen', at: '2026-11-16' },
    { id: 'F-0004', grId: 'GR-GMC-W03-00048', docType: 'Bank Receipt scan', file: 'BR_2627N-11001-02231.jpg', uploadedBy: 'Citizen', at: '2026-11-14' },
    { id: 'F-0003', grId: 'GR-GMC-W01-00004', docType: 'Bank Receipt scan', file: 'BR_2627N-11001-01452.jpg', uploadedBy: 'Demo Supervisor', at: '2026-06-21' }
  ];

  global.GR_DATA = {
    demoToday: DEMO_TODAY,
    config: config,
    users: users,
    adjustments: [],
    intents: [],
    approvals: [],
    attachments: attachments,
    outbox: [],
    otherNotifications: {},
    savedSites: {},
    sites: sites,
    payments: payments,
    challans: challans,
    citizens: citizens,
    staffRoles: staffRoles,
    auditLog: auditLog
  };
})(window);
