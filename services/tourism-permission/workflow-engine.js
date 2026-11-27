/**
 * WORKFLOW ENGINE & CENTRAL DATA REPOSITORY (V5 - Final Approved Scope)
 * Service: Tourism Permission
 * Department: Tourism & Civil Aviation Department, Government of Sikkim
 *
 * Workflows:
 *  - HQ-Level (Drone, Expedition):
 *      Citizen -> TO -> DTO -> HQ Officer -> Payment Activation -> Citizen Payment -> Same HQ Officer -> Final Approval (Approval Sheet + Approval Letter/Certificate)
 *  - DTO-Level (Satellite Phone, Event, Fair, Mela, Rally, Trekking, Other):
 *      Citizen -> TO -> DTO -> Payment Activation -> Citizen Payment -> DTO Final Approval (Approval Letter/Certificate; No Approval Sheet)
 *  - Extension Workflow (Drone up to 15d; Event, Fair, Mela, Rally up to 1w):
 *      Citizen -> DTO -> Approve/Reject
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'tourism_department_applications';
  const STORAGE_VERSION_KEY = 'tourism_dept_apps_version';
  const CURRENT_SEED_VERSION = 'v10_clean_approved_2026';
  const SUBMITTED_STORAGE_KEY = 'tourism_permission_submitted';
  const LO_STORAGE_KEY = 'tourism_permission_lo_directory';
  const NOTIFICATIONS_KEY = 'tourism_permission_notifications_v1';
  let syncChannel = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      syncChannel = new BroadcastChannel('tourism_permission_sync_v1');
    }
  } catch (e) {}

  const STATUSES = {
    SUBMITTED: 'Submitted',
    UNDER_HQ_REVIEW: 'Under Review by Headquarters',
    PAYMENT_PENDING: 'Payment Pending',
    RETURNED: 'Returned for Correction',
    REJECTED: 'Rejected',
    APPROVED: 'Approved'
  };

  const STAGES = {
    STAGE_1: 'Application Submitted',
    STAGE_2: 'Awaiting TO Verification',
    STAGE_3: 'Awaiting DTO Review',
    STAGE_4: 'Awaiting HQ Reviewing Officer',
    STAGE_4_UNDER_REVIEW: 'Under Review by Headquarters',
    STAGE_4B: 'Awaiting HQ Decision',
    STAGE_5: 'Returned by HQ to DTO',
    STAGE_5B: 'Returned by DTO to TO',
    STAGE_5C: 'Returned by HQ to TO',
    STAGE_6: 'Awaiting Citizen Correction',
    STAGE_7: 'Awaiting TO Reverification',
    STAGE_8: 'Payment Activated – Awaiting Citizen Payment',
    STAGE_9: 'Payment Received – Awaiting HQ Final Verification',
    STAGE_10: 'Approval Sheet Uploaded',
    STAGE_11: 'Payment Received – Awaiting DTO Final Approval',
    STAGE_12: 'Approved – Approval Letter Issued',
    STAGE_13: 'Rejected'
  };

  const CATEGORIES = {
    'drone': {
      key: 'drone',
      name: 'Drone Permission',
      approvalLevel: 'HQ',
      feePerPerson: 0,
      feeLabel: 'Free',
      validityDays: 15,
      validityLabel: '15 Days',
      extensionAllowed: true,
      maxExtensionDays: 15,
      extensionLabel: 'Up to 15 additional days (DTO Decision)'
    },
    'expedition': {
      key: 'expedition',
      name: 'Expedition Permission',
      approvalLevel: 'HQ',
      feePerPerson: 100,
      feeLabel: '₹100 / person',
      validityDays: null,
      validityLabel: 'As per Applicant Requested Duration',
      extensionAllowed: false,
      maxExtensionDays: 0,
      extensionLabel: 'No Extension Permitted'
    },
    'satellite-phone': {
      key: 'satellite-phone',
      name: 'Satellite Phone Permission',
      approvalLevel: 'DTO',
      feePerPerson: 0,
      feeLabel: 'Free',
      validityDays: null,
      validityLabel: 'As Approved',
      extensionAllowed: false,
      maxExtensionDays: 0,
      extensionLabel: 'Not Applicable'
    },
    'events-fairs': {
      key: 'events-fairs',
      name: 'Event / Mela / Fair / Rallies / Marathons',
      approvalLevel: 'DTO',
      feePerPerson: 0,
      feeLabel: 'Free',
      validityDays: null,
      validityLabel: 'As per Approved Date Range',
      extensionAllowed: false,
      maxExtensionDays: 0,
      extensionLabel: 'No Extension Permitted'
    },
    'trekking': {
      key: 'trekking',
      name: 'Trekking',
      approvalLevel: 'DTO',
      feePerPerson: 100,
      feeLabel: '₹100 / person',
      validityDays: null,
      validityLabel: 'As per Applicant Requested Duration',
      maxParticipants: 10,
      minPorters: 2,
      extensionAllowed: false,
      maxExtensionDays: 0,
      extensionLabel: 'No Extension Permitted'
    },
    'other': {
      key: 'other',
      name: 'Other Permissions',
      approvalLevel: 'DTO',
      feePerPerson: 0,
      feeLabel: 'Free',
      validityDays: null,
      validityLabel: 'As Approved',
      extensionAllowed: false,
      maxExtensionDays: 0,
      extensionLabel: 'Not Applicable'
    }
  };

  // Configurable Document Requirements Matrix (Provisional Departmental Agreement)
  const DOCUMENT_REQUIREMENTS = {
    'events-fairs': [
      { id: 'event_proposal', name: 'Event Proposal', mandatory: true, note: 'Detailed event / mela / rally proposal' },
      { id: 'fire_noc', name: 'Fire NOC', mandatory: true, note: 'Mandatory for Event / Mela / Fair / Rallies / Marathons' },
      { id: 'police_noc', name: 'Police NOC', mandatory: true, note: 'Mandatory for Event / Mela / Fair / Rallies / Marathons' },
      { id: 'traffic_noc', name: 'Traffic NOC (as applicable)', mandatory: false, note: 'Traffic clearance where applicable' },
      { id: 'panchayat_noc', name: 'Councillor / Panchayat NOC (as applicable)', mandatory: false, note: 'Local body clearance as applicable' }
    ],
    'satellite-phone': [
      { id: 'imf_rec', name: 'Letter of Recommendation issued by IMF', mandatory: true, note: 'Only required supporting document for Satellite Phone Permission' }
    ],
    'trekking': [
      { id: 'passport', name: 'Passports (Foreign Trekkers)', mandatory: false, conditionalOnForeigner: true, note: 'Not required for Indian trekkers. Merge all foreign trekkers\' passports into a single PDF file and upload.' },
      { id: 'visa', name: 'Visas (Foreign Trekkers)', mandatory: false, conditionalOnForeigner: true, note: 'Not required for Indian trekkers. Merge all foreign trekkers\' visas into a single PDF file and upload.' },
      { id: 'med_insurance', name: 'Medical Insurance (Consolidated)', mandatory: true, note: 'Merge all trekkers\' medical insurance policies into a single PDF file and upload.' },
      { id: 'medical_fitness', name: 'Medical Fitness (Consolidated)', mandatory: false, optionalChecklist: true, note: 'Optional — merge all members\' fitness certificates into a single PDF file.' },
      { id: 'insurance_opt', name: 'Insurance (Additional)', mandatory: false, optionalChecklist: true, note: 'Optional — merge multiple policies into a single PDF file.' },
      { id: 'guide_details', name: 'Guide Details', mandatory: false, optionalChecklist: true, note: 'Optional — merge guide credentials into a single PDF file.' },
      { id: 'clients_sheets', name: 'Clients Sheets', mandatory: false, optionalChecklist: true, note: 'Optional — upload consolidated client roster as a single PDF file.' }
    ],
    'expedition': [
      { id: 'expedition_itinerary', name: 'Expedition Route Plan & Peak Clearance Dossier', mandatory: true, note: 'Peak details and proposed schedule' },
      { id: 'medical_fitness', name: 'Medical Fitness', mandatory: false, optionalChecklist: true, note: 'Optional checklist document' },
      { id: 'insurance_opt', name: 'Insurance', mandatory: false, optionalChecklist: true, note: 'Optional checklist document' },
      { id: 'guide_details', name: 'Guide Details', mandatory: false, optionalChecklist: true, note: 'Optional checklist document' },
      { id: 'clients_sheets', name: 'Clients Sheets', mandatory: false, optionalChecklist: true, note: 'Optional checklist document' }
    ],
    'drone': [
      { id: 'dgca_uin', name: 'Drone UIN & Remote Pilot Certificate', mandatory: false, note: 'Optional UIN and RPC credentials' },
      { id: 'flight_map', name: 'Flight Area Map & Coordinates Sheet', mandatory: false, note: 'Optional proposed flying zone and AGL details' }
    ],
    'other': [
      { id: 'supporting_doc', name: 'Activity Supporting Document / Clearance', mandatory: false, note: 'Relevant supporting documentation as applicable' }
    ]
  };

  const ALPINE_PEAKS = [
    'Mt. Tinchenkhang (6,010 m)',
    'Mt. Frey (5,830 m)',
    'Mt. Jopuno (5,932 m)',
    'Mt. Brumkhanse (5,635 m)',
    'Lama Wangden (5,835 m)'
  ];

  const DISTRICT_OFFICES = {
    'all': {
      district: 'All Districts',
      toName: 'Statewide Tourism Officer Desk',
      dtoName: 'Statewide District Tourism Officer Panel',
      designation: 'District Tourism Officer (DTO)',
      office: 'Directorate of Tourism, All 6 Circles, Government of Sikkim',
      phone: '03592-202341 / 03592-209090',
      email: 'dto-statewide@sikkimtourism.gov.in'
    },
    'Gangtok': {
      district: 'Gangtok',
      toName: 'Phurba Tshering Bhutia',
      dtoName: 'Karma Lhendup Bhutia',
      designation: 'District Tourism Officer (DTO)',
      office: 'District Tourism Office, Gangtok Circle, M.G. Marg, Gangtok – 737101',
      phone: '03592-202341',
      email: 'dto-gangtok@sikkimtourism.gov.in'
    },
    'Mangan': {
      district: 'Mangan',
      toName: 'Ongden Lepcha',
      dtoName: 'Tenzing Dadul Lepcha',
      designation: 'District Tourism Officer (DTO)',
      office: 'District Tourism Office, Mangan Circle, North Sikkim – 737116',
      phone: '03592-234210',
      email: 'dto-mangan@sikkimtourism.gov.in'
    },
    'Namchi': {
      district: 'Namchi',
      toName: 'Suman Rai',
      dtoName: 'Pema Wangchuk Sherpa',
      designation: 'District Tourism Officer (DTO)',
      office: 'District Tourism Office, Namchi Circle, South Sikkim – 737126',
      phone: '03595-254120',
      email: 'dto-namchi@sikkimtourism.gov.in'
    },
    'Gyalshing': {
      district: 'Gyalshing',
      toName: 'Nima Wangdi Bhutia',
      dtoName: 'Sonam Palzor Bhutia',
      designation: 'District Tourism Officer (DTO)',
      office: 'District Tourism Office, Gyalshing Circle, West Sikkim – 737111',
      phone: '03595-250811',
      email: 'dto-gyalshing@sikkimtourism.gov.in'
    },
    'Pakyong': {
      district: 'Pakyong',
      toName: 'Prakash Gurung',
      dtoName: 'Bikash Tamang',
      designation: 'District Tourism Officer (DTO)',
      office: 'District Tourism Office, Pakyong Circle – 737106',
      phone: '03592-257801',
      email: 'dto-pakyong@sikkimtourism.gov.in'
    },
    'Soreng': {
      district: 'Soreng',
      toName: 'Rinchen Sherpa',
      dtoName: 'Dawa Tshering Lepcha',
      designation: 'District Tourism Officer (DTO)',
      office: 'District Tourism Office, Soreng Circle – 737121',
      phone: '03595-253301',
      email: 'dto-soreng@sikkimtourism.gov.in'
    }
  };

  const HQ_OFFICER = {
    name: 'Dr. Tshering Yangchen Lepcha',
    designation: 'Additional Secretary (Tourism) & HQ Officer',
    office: 'Headquarters, Paryatan Bhawan, Tadong, Gangtok – 737102',
    phone: '03592-209090 / 1800-345-3256',
    email: 'secy-tourism@sikkim.gov.in'
  };

  const ADMIN_OFFICER = {
    name: 'Sonam Rinzing Bhutia',
    designation: 'Department Admin (Liaison Officer Directory Manager)',
    office: 'Directorate of Tourism, Paryatan Bhawan, Tadong, Gangtok – 737102',
    phone: '03592-209091',
    email: 'admin-tourism@sikkim.gov.in'
  };

  const SEED_LIAISON_OFFICERS = [
    { id: 'LO-001', name: 'Tashi Namgyal Bhutia', phone: '+91 98320-11223', contactDetails: 'tashi.lo@sikkimtourism.gov.in | Alt: 03592-209111', address: 'Paryatan Bhawan, Tadong, Gangtok – 737102', active: true },
    { id: 'LO-002', name: 'Roshni Subba', phone: '+91 98320-44556', contactDetails: 'roshni.lo@sikkimtourism.gov.in | Alt: 03595-250812', address: 'District Tourism Office, Gyalshing, West Sikkim – 737111', active: true },
    { id: 'LO-003', name: 'Ganesh Chettri', phone: '+91 98320-77889', contactDetails: 'ganesh.lo@sikkimtourism.gov.in | Alt: 03592-234211', address: 'District Tourism Office, Mangan, North Sikkim – 737116', active: true },
    { id: 'LO-004', name: 'Karma Wangchuk Lepcha', phone: '+91 98321-10004', contactDetails: 'karma.w.lo@sikkimtourism.gov.in | Alt: 03592-209114', address: 'Paryatan Bhawan, Tadong, Gangtok – 737102', active: true },
    { id: 'LO-005', name: 'Pema Dorjee Sherpa', phone: '+91 98321-10005', contactDetails: 'pema.d.lo@sikkimtourism.gov.in | Alt: 03595-263105', address: 'District Tourism Office, Namchi, South Sikkim – 737126', active: true },
    { id: 'LO-006', name: 'Anjali Rai', phone: '+91 98321-10006', contactDetails: 'anjali.lo@sikkimtourism.gov.in | Alt: 03592-257106', address: 'District Tourism Office, Pakyong – 737106', active: true },
    { id: 'LO-007', name: 'Bikash Gurung', phone: '+91 98321-10007', contactDetails: 'bikash.lo@sikkimtourism.gov.in | Alt: 03595-253107', address: 'District Tourism Office, Soreng – 737121', active: true },
    { id: 'LO-008', name: 'Sonam Choden Bhutia', phone: '+91 98321-10008', contactDetails: 'sonam.c.lo@sikkimtourism.gov.in | Alt: 03592-209108', address: 'M.G. Marg Information Desk, Gangtok – 737101', active: true },
    { id: 'LO-009', name: 'Dawa Tshering Tamang', phone: '+91 98321-10009', contactDetails: 'dawa.t.lo@sikkimtourism.gov.in | Alt: 03592-234109', address: 'District Tourism Office, Mangan, North Sikkim – 737116', active: true },
    { id: 'LO-010', name: 'Nirmala Pradhan', phone: '+91 98321-10010', contactDetails: 'nirmala.lo@sikkimtourism.gov.in | Alt: 03595-250110', address: 'Yuksom Trekking Base Desk, Gyalshing – 737113', active: true },
    { id: 'LO-011', name: 'Passang Norbu Sherpa', phone: '+91 98321-10011', contactDetails: 'passang.lo@sikkimtourism.gov.in | Alt: 03592-209112', address: 'Paryatan Bhawan, Tadong, Gangtok – 737102', active: true },
    { id: 'LO-012', name: 'Deepak Sharma', phone: '+91 98321-10012', contactDetails: 'deepak.lo@sikkimtourism.gov.in | Alt: 03595-263112', address: 'District Tourism Office, Namchi, South Sikkim – 737126', active: true },
    { id: 'LO-013', name: 'Yangchen Dolma Bhutia', phone: '+91 98321-10013', contactDetails: 'yangchen.lo@sikkimtourism.gov.in | Alt: 03592-234113', address: 'Lachung Field Office, Mangan, North Sikkim – 737120', active: true },
    { id: 'LO-014', name: 'Suman Limboo', phone: '+91 98321-10014', contactDetails: 'suman.l.lo@sikkimtourism.gov.in | Alt: 03595-250114', address: 'District Tourism Office, Gyalshing, West Sikkim – 737111', active: true },
    { id: 'LO-015', name: 'Phurba Gyaltsen Lepcha', phone: '+91 98321-10015', contactDetails: 'phurba.lo@sikkimtourism.gov.in | Alt: 03592-234115', address: 'Lachen Field Office, Mangan, North Sikkim – 737120', active: true },
    { id: 'LO-016', name: 'Kavita Thapa', phone: '+91 98321-10016', contactDetails: 'kavita.lo@sikkimtourism.gov.in | Alt: 03592-257116', address: 'District Tourism Office, Pakyong – 737106', active: true },
    { id: 'LO-017', name: 'Rigzin Paljor Bhutia', phone: '+91 98321-10017', contactDetails: 'rigzin.lo@sikkimtourism.gov.in | Alt: 03592-209117', address: 'Paryatan Bhawan, Tadong, Gangtok – 737102', active: true },
    { id: 'LO-018', name: 'Manoj Kumar Chhetri', phone: '+91 98321-10018', contactDetails: 'manoj.lo@sikkimtourism.gov.in | Alt: 03595-253118', address: 'District Tourism Office, Soreng – 737121', active: true },
    { id: 'LO-019', name: 'Dechen Ongmu Lepcha', phone: '+91 98321-10019', contactDetails: 'dechen.lo@sikkimtourism.gov.in | Alt: 03592-209119', address: 'Tsomgo Checkpost Desk, Gangtok – 737102', active: true },
    { id: 'LO-020', name: 'Rajeshwar Subba', phone: '+91 98321-10020', contactDetails: 'rajeshwar.lo@sikkimtourism.gov.in | Alt: 03595-250120', address: 'Pelling Tourist Counter, Gyalshing – 737113', active: true },
    { id: 'LO-021', name: 'Lhakpa Tsering Sherpa', phone: '+91 98321-10021', contactDetails: 'lhakpa.lo@sikkimtourism.gov.in | Alt: 03592-234121', address: 'Chungthang Facilitation Desk, Mangan – 737120', active: true },
    { id: 'LO-022', name: 'Sunita Rai', phone: '+91 98321-10022', contactDetails: 'sunita.lo@sikkimtourism.gov.in | Alt: 03595-263122', address: 'Ravangla Tourism Desk, Namchi – 737139', active: true },
    { id: 'LO-023', name: 'Nawang Thinley Bhutia', phone: '+91 98321-10023', contactDetails: 'nawang.lo@sikkimtourism.gov.in | Alt: 03592-209123', address: 'Paryatan Bhawan, Tadong, Gangtok – 737102', active: true },
    { id: 'LO-024', name: 'Prakash Tamang', phone: '+91 98321-10024', contactDetails: 'prakash.lo@sikkimtourism.gov.in | Alt: 03592-257124', address: 'Rhenock Sub-Office, Pakyong – 737133', active: true },
    { id: 'LO-025', name: 'Tshering Lhamu Bhutia', phone: '+91 98321-10025', contactDetails: 'tshering.l.lo@sikkimtourism.gov.in | Alt: 03592-209125', address: 'Paryatan Bhawan, Tadong, Gangtok – 737102', active: true },
    { id: 'LO-026', name: 'Arjun Gurung', phone: '+91 98321-10026', contactDetails: 'arjun.lo@sikkimtourism.gov.in | Alt: 03595-253126', address: 'District Tourism Office, Soreng – 737121', active: true },
    { id: 'LO-027', name: 'Mingma Sherpa', phone: '+91 98321-10027', contactDetails: 'mingma.lo@sikkimtourism.gov.in | Alt: 03595-250127', address: 'Yuksom Trekking Base Desk, Gyalshing – 737113', active: true },
    { id: 'LO-028', name: 'Pavitra Pradhan', phone: '+91 98321-10028', contactDetails: 'pavitra.lo@sikkimtourism.gov.in | Alt: 03595-263128', address: 'District Tourism Office, Namchi, South Sikkim – 737126', active: true },
    { id: 'LO-029', name: 'Kunga Gyatso Lepcha', phone: '+91 98321-10029', contactDetails: 'kunga.lo@sikkimtourism.gov.in | Alt: 03592-234129', address: 'Dzongu Field Office, Mangan, North Sikkim – 737116', active: true },
    { id: 'LO-030', name: 'Binita Limboo', phone: '+91 98321-10030', contactDetails: 'binita.lo@sikkimtourism.gov.in | Alt: 03595-250130', address: 'District Tourism Office, Gyalshing, West Sikkim – 737111', active: true },
    { id: 'LO-031', name: 'Choden Wangmo Bhutia', phone: '+91 98321-10031', contactDetails: 'choden.lo@sikkimtourism.gov.in | Alt: 03592-209131', address: 'Paryatan Bhawan, Tadong, Gangtok – 737102', active: true },
    { id: 'LO-032', name: 'Hemant Thapa', phone: '+91 98321-10032', contactDetails: 'hemant.lo@sikkimtourism.gov.in | Alt: 03592-257132', address: 'District Tourism Office, Pakyong – 737106', active: true },
    { id: 'LO-033', name: 'Dorjee Khandu Sherpa', phone: '+91 98321-10033', contactDetails: 'dorjee.lo@sikkimtourism.gov.in | Alt: 03592-234133', address: 'District Tourism Office, Mangan, North Sikkim – 737116', active: true },
    { id: 'LO-034', name: 'Ritu Rai', phone: '+91 98321-10034', contactDetails: 'ritu.lo@sikkimtourism.gov.in | Alt: 03595-263134', address: 'Namchi Central Facilitation Desk, South Sikkim – 737126', active: true },
    { id: 'LO-035', name: 'Sangay Chopel Bhutia', phone: '+91 98321-10035', contactDetails: 'sangay.lo@sikkimtourism.gov.in | Alt: 03592-209135', address: 'Paryatan Bhawan, Tadong, Gangtok – 737102', active: true },
    { id: 'LO-036', name: 'Usha Chettri', phone: '+91 98321-10036', contactDetails: 'usha.lo@sikkimtourism.gov.in | Alt: 03595-253136', address: 'District Tourism Office, Soreng – 737121', active: true },
    { id: 'LO-037', name: 'Palden Ongchuk Lepcha', phone: '+91 98321-10037', contactDetails: 'palden.lo@sikkimtourism.gov.in | Alt: 03592-234137', address: 'Mangan North Sikkim Desk – 737116', active: true },
    { id: 'LO-038', name: 'Meena Subba', phone: '+91 98321-10038', contactDetails: 'meena.lo@sikkimtourism.gov.in | Alt: 03595-250138', address: 'District Tourism Office, Gyalshing, West Sikkim – 737111', active: true },
    { id: 'LO-039', name: 'Jigme Namgyal Bhutia', phone: '+91 98321-10039', contactDetails: 'jigme.lo@sikkimtourism.gov.in | Alt: 03592-209139', address: 'Paryatan Bhawan, Tadong, Gangtok – 737102', active: true },
    { id: 'LO-040', name: 'Santosh Tamang', phone: '+91 98321-10040', contactDetails: 'santosh.lo@sikkimtourism.gov.in | Alt: 03595-263140', address: 'District Tourism Office, Namchi, South Sikkim – 737126', active: true }
  ];

  function normalizeCategoryKey(cat) {
    if (!cat) return 'other';
    const c = String(cat).toLowerCase().trim();
    if (c.includes('drone')) return 'drone';
    if (c.includes('expedition')) return 'expedition';
    if (c.includes('satellite')) return 'satellite-phone';
    if (c.includes('event') || c.includes('fair') || c.includes('mela') || c.includes('rally') || c.includes('rallies') || c.includes('marathon')) return 'events-fairs';
    if (c.includes('trek')) return 'trekking';
    return 'other';
  }

  // Comprehensive Seed Applications covering TO, DTO, HQ, Payment Activation, Post-Payment, Final Approval, Extensions
  const SEED_APPLICATIONS = [];

  const WorkflowEngine = {
    STORAGE_KEY: STORAGE_KEY,
    NOTIFICATIONS_KEY: NOTIFICATIONS_KEY,
    STATUSES: STATUSES,
    STAGES: STAGES,
    CATEGORIES: CATEGORIES,
    DOCUMENT_REQUIREMENTS: DOCUMENT_REQUIREMENTS,
    ALPINE_PEAKS: ALPINE_PEAKS,
    DISTRICT_OFFICES: DISTRICT_OFFICES,
    HQ_OFFICER: HQ_OFFICER,
    ADMIN_OFFICER: ADMIN_OFFICER,

    normalizeCategoryKey: normalizeCategoryKey,

    isHqApprovalRequired: function (category) {
      const key = normalizeCategoryKey(category);
      return key === 'drone' || key === 'expedition';
    },

    isExtensionAllowed: function (category) {
      const key = normalizeCategoryKey(category);
      return !!(CATEGORIES[key] && CATEGORIES[key].extensionAllowed);
    },

    getCategoryConfig: function (category) {
      const key = normalizeCategoryKey(category);
      return CATEGORIES[key] || CATEGORIES['other'];
    },

    getDocumentRequirements: function (category) {
      const key = normalizeCategoryKey(category);
      return DOCUMENT_REQUIREMENTS[key] || DOCUMENT_REQUIREMENTS['other'];
    },

    // --------------------------------------------------------------
    // LIAISON OFFICER DIRECTORY (Department Admin CRUD)
    // --------------------------------------------------------------
    getLiaisonOfficers: function () {
      try {
        const raw = localStorage.getItem(LO_STORAGE_KEY);
        if (!raw) {
          localStorage.setItem(LO_STORAGE_KEY, JSON.stringify(SEED_LIAISON_OFFICERS));
          return JSON.parse(JSON.stringify(SEED_LIAISON_OFFICERS));
        }
        return JSON.parse(raw);
      } catch (e) {
        return JSON.parse(JSON.stringify(SEED_LIAISON_OFFICERS));
      }
    },

    saveLiaisonOfficers: function (list) {
      try {
        localStorage.setItem(LO_STORAGE_KEY, JSON.stringify(list));
      } catch (e) {
        console.error('Failed saving LO directory', e);
      }
    },

    addLiaisonOfficer: function (lo) {
      const list = this.getLiaisonOfficers();
      const newLo = {
        id: 'LO-' + String(Math.floor(100 + Math.random() * 900)),
        name: (lo.name || '').trim(),
        phone: (lo.phone || '').trim(),
        contactDetails: (lo.contactDetails || '').trim(),
        address: (lo.address || '').trim(),
        active: lo.active !== false
      };
      list.unshift(newLo);
      this.saveLiaisonOfficers(list);
      return { success: true, officer: newLo };
    },

    updateLiaisonOfficer: function (id, updates) {
      const list = this.getLiaisonOfficers();
      const idx = list.findIndex(item => item.id === id);
      if (idx === -1) return { success: false, message: 'Liaison Officer not found.' };
      list[idx] = Object.assign({}, list[idx], {
        name: updates.name !== undefined ? String(updates.name).trim() : list[idx].name,
        phone: updates.phone !== undefined ? String(updates.phone).trim() : list[idx].phone,
        contactDetails: updates.contactDetails !== undefined ? String(updates.contactDetails).trim() : list[idx].contactDetails,
        address: updates.address !== undefined ? String(updates.address).trim() : list[idx].address,
        active: updates.active !== undefined ? updates.active : list[idx].active
      });
      this.saveLiaisonOfficers(list);
      return { success: true, officer: list[idx] };
    },

    deleteLiaisonOfficer: function (id) {
      const list = this.getLiaisonOfficers().filter(item => item.id !== id);
      this.saveLiaisonOfficers(list);
      return { success: true };
    },

    // --------------------------------------------------------------
    // APPLICATION REPOSITORY
    // --------------------------------------------------------------
    getAllApplications: function () {
      try {
        const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
        const raw = localStorage.getItem(STORAGE_KEY);

        if (!raw || storedVersion !== CURRENT_SEED_VERSION) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_APPLICATIONS));
          localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_SEED_VERSION);
          return JSON.parse(JSON.stringify(SEED_APPLICATIONS));
        }

        let apps = JSON.parse(raw);

        // Ingest any citizen submissions recorded in SUBMITTED_STORAGE_KEY
        const rawCitizen = localStorage.getItem(SUBMITTED_STORAGE_KEY);
        if (rawCitizen) {
          try {
            const citizenSubs = JSON.parse(rawCitizen);
            if (Array.isArray(citizenSubs) && citizenSubs.length > 0) {
              let modified = false;
              citizenSubs.forEach(sub => {
                if (sub && sub.refNo && !apps.some(a => a.refNo === sub.refNo)) {
                  const created = this._buildApplicationRecord(sub);
                  apps.unshift(created);
                  modified = true;
                }
              });
              if (modified) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
              }
            }
          } catch (e) { }
        }

        return apps;
      } catch (e) {
        return JSON.parse(JSON.stringify(SEED_APPLICATIONS));
      }
    },

    _buildApplicationRecord: function (sub) {
      const dist = sub.district || 'Gangtok';
      const distInfo = DISTRICT_OFFICES[dist] || DISTRICT_OFFICES['Gangtok'];
      const catKey = normalizeCategoryKey(sub.categoryKey || sub.category);
      const catCfg = CATEGORIES[catKey] || CATEGORIES['other'];
      const requiresHq = (catCfg.approvalLevel === 'HQ');
      const subDate = sub.submissionDate || sub.submittedDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

      const pax = parseInt(sub.participantCount || 1, 10) || 1;
      const computedFee = catCfg.feePerPerson ? (pax * catCfg.feePerPerson) : 0;
      const feeAmount = (sub.feeAmount !== undefined) ? sub.feeAmount : computedFee;
      const feeLabel = feeAmount > 0 ? ('₹' + feeAmount.toLocaleString('en-IN')) : 'Free';

      return {
        refNo: sub.refNo,
        flowType: requiresHq ? 'flow_a' : 'flow_b',
        flowTitle: (requiresHq ? 'HQ-Level Approval' : 'DTO-Level Approval') + ' (' + catCfg.name + ')',
        category: sub.category || catCfg.name,
        categoryKey: catKey,
        customCategoryName: sub.customCategoryName || '',
        district: dist,
        dtoOffice: distInfo.office,
        status: STATUSES.SUBMITTED,
        currentStage: STAGES.STAGE_2, // Citizen -> TO
        currentStageNum: 2,
        assignedRole: 'to',
        applicantName: sub.applicantName || 'Citizen Applicant',
        organizationName: sub.organizationName || '',
        phone: sub.phone || '',
        email: sub.email || '',
        address: sub.address || '',
        activityTitle: sub.activityTitle || (catCfg.name + ' Request'),
        activityDescription: sub.activityDescription || sub.description || '',
        droneDetails: sub.droneDetails || null,
        expeditionDetails: sub.expeditionDetails || null,
        trekkingDetails: sub.trekkingDetails || null,
        liaisonOfficer: sub.liaisonOfficer || null,
        participantCount: pax,
        fee: feeLabel,
        feeAmount: feeAmount,
        paymentActivated: false,
        isPaid: false,
        paymentStatus: 'NOT_ACTIVATED',
        paymentTxnRef: null,
        validityDays: catCfg.validityDays,
        validityLabel: sub.validityLabel || catCfg.validityLabel,
        extensionAllowed: catCfg.extensionAllowed,
        maxExtensionDays: catCfg.maxExtensionDays || 0,
        submissionDate: subDate,
        lastUpdated: subDate,
        requiresHqVerification: requiresHq,
        documents: sub.documents || [],
        approvalSheet: null,
        toRemarks: null,
        dtoRemarks: null,
        hqRemarks: null,
        citizenRemarks: null,
        history: [
          {
            action: 'Application Submitted',
            role: 'Citizen',
            officer: sub.applicantName || 'Citizen Applicant',
            office: 'Applicant Portal',
            date: subDate,
            previousStage: 'New Submission',
            newStage: STAGES.STAGE_2,
            remarks: `Application submitted under ${catCfg.name} (${requiresHq ? 'HQ-Level' : 'DTO-Level'}) and routed to Tourism Officer (TO).`
          }
        ]
      };
    },

    saveAllApplications: function (apps) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
        localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_SEED_VERSION);
        if (syncChannel) {
          syncChannel.postMessage({ type: 'APPS_UPDATED', count: apps.length, ts: Date.now() });
        }
      } catch (e) { }
    },

    _computeApprovedValidity: function (app, approvalDateObj) {
      const startObj = approvalDateObj || new Date();
      const fmt = d => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const iso = d => d.toISOString().slice(0, 10);
      const catKey = normalizeCategoryKey(app.categoryKey || app.category);

      let endObj = null;
      let label = '';

      if (catKey === 'drone') {
        endObj = new Date(startObj.getTime() + (15 * 24 * 60 * 60 * 1000));
        label = `${fmt(startObj)} to ${fmt(endObj)} (15 Days)`;
        app.approvedStartDate = fmt(startObj);
        app.approvedExpiryDate = fmt(endObj);
        app.approvedStartDateIso = iso(startObj);
        app.approvedExpiryDateIso = iso(endObj);
      } else if (catKey === 'expedition' || catKey === 'trekking') {
        const src = catKey === 'expedition' ? (app.expeditionDetails || {}) : (app.trekkingDetails || {});
        const val = parseInt(src.requestedDurationValue || app.requestedDurationValue || 15, 10) || 15;
        const unit = String(src.requestedDurationUnit || app.requestedDurationUnit || 'Days').toLowerCase();
        endObj = new Date(startObj.getTime());
        if (unit.startsWith('month')) {
          endObj.setMonth(endObj.getMonth() + val);
        } else {
          endObj.setDate(endObj.getDate() + val);
        }
        const unitLabel = unit.startsWith('month') ? (val === 1 ? 'Month' : 'Months') : (val === 1 ? 'Day' : 'Days');
        label = `${fmt(startObj)} to ${fmt(endObj)} (${val} ${unitLabel})`;
        app.approvedStartDate = fmt(startObj);
        app.approvedExpiryDate = fmt(endObj);
        app.approvedStartDateIso = iso(startObj);
        app.approvedExpiryDateIso = iso(endObj);
      } else {
        // Event / Mela / Fair / Rally / Marathon, Satellite Phone, Other Permissions -> use proposed/approved date range
        const sRaw = app.startDate || (app.eventDetails && app.eventDetails.startDate) || (app.satPhoneDetails && app.satPhoneDetails.startDate) || '';
        const eRaw = app.endDate || (app.eventDetails && app.eventDetails.endDate) || (app.satPhoneDetails && app.satPhoneDetails.endDate) || '';
        const sDate = sRaw ? new Date(sRaw) : startObj;
        const eDate = eRaw ? new Date(eRaw) : startObj;
        const validS = isNaN(sDate.getTime()) ? startObj : sDate;
        const validE = isNaN(eDate.getTime()) ? validS : eDate;
        app.approvedStartDate = fmt(validS);
        app.approvedExpiryDate = fmt(validE);
        app.approvedStartDateIso = iso(validS);
        app.approvedExpiryDateIso = iso(validE);
        label = `${app.approvedStartDate} to ${app.approvedExpiryDate}`;
      }

      app.validityLabel = label;
      return { start: app.approvedStartDate, expiry: app.approvedExpiryDate, label };
    },

    resetToSeedData: function () {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_APPLICATIONS));
        localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_SEED_VERSION);
        localStorage.removeItem(SUBMITTED_STORAGE_KEY);
        localStorage.removeItem(NOTIFICATIONS_KEY);
        return JSON.parse(JSON.stringify(SEED_APPLICATIONS));
      } catch (e) {
        return JSON.parse(JSON.stringify(SEED_APPLICATIONS));
      }
    },

    // ==============================================================
    // NOTIFICATION & REAL-TIME ACTION ALERT SYSTEM
    // ==============================================================
    _formatNotifTime: function () {
      return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },

    getNotifications: function (roleFilter, districtFilter) {
      try {
        let raw = localStorage.getItem(NOTIFICATIONS_KEY);
        if (raw === null) {
          // First-load initialization: seed actionable notifications from current applications
          localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
          const apps = this.getAllApplications();
          apps.forEach(a => this._notifyForApplicationState(a, true));
          raw = localStorage.getItem(NOTIFICATIONS_KEY);
        }
        let list = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(list)) list = [];

        if (roleFilter) {
          const rf = String(roleFilter).toUpperCase();
          list = list.filter(n => (n.targetRole || '').toUpperCase() === rf);
        }
        if (districtFilter && String(districtFilter).toUpperCase() !== 'ALL') {
          const df = String(districtFilter).toLowerCase();
          list = list.filter(n => !n.district || String(n.district).toLowerCase() === df);
        }
        return list;
      } catch (e) {
        return [];
      }
    },

    markNotificationRead: function (notifId) {
      try {
        const raw = localStorage.getItem(NOTIFICATIONS_KEY);
        const list = raw ? JSON.parse(raw) : [];
        const updated = list.map(n => n.id === notifId ? Object.assign({}, n, { read: true }) : n);
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
        if (syncChannel) syncChannel.postMessage({ type: 'NOTIFICATION_READ', ts: Date.now() });
      } catch (e) {}
    },

    markAllNotificationsRead: function (targetRole, districtFilter) {
      try {
        const raw = localStorage.getItem(NOTIFICATIONS_KEY);
        const list = raw ? JSON.parse(raw) : [];
        const rf = targetRole ? String(targetRole).toUpperCase() : null;
        const df = (districtFilter && String(districtFilter).toUpperCase() !== 'ALL') ? String(districtFilter).toLowerCase() : null;

        const updated = list.map(n => {
          const roleOk = !rf || (n.targetRole || '').toUpperCase() === rf;
          const distOk = !df || !n.district || String(n.district).toLowerCase() === df;
          return (roleOk && distOk) ? Object.assign({}, n, { read: true }) : n;
        });
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
        if (syncChannel) syncChannel.postMessage({ type: 'NOTIFICATION_READ', ts: Date.now() });
      } catch (e) {}
    },

    _pushNotification: function (notif) {
      try {
        const raw = localStorage.getItem(NOTIFICATIONS_KEY);
        let list = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(list)) list = [];

        const dedupeKey = `${notif.refNo || ''}_${notif.targetRole || ''}_${notif.eventKey || notif.title}`;
        list = list.filter(n => n.dedupeKey !== dedupeKey || n.read);

        list.unshift({
          id: 'NTF-' + Date.now() + '-' + Math.floor(100 + Math.random() * 900),
          dedupeKey: dedupeKey,
          refNo: notif.refNo,
          targetRole: notif.targetRole,
          district: notif.district || 'Gangtok',
          title: notif.title,
          message: notif.message,
          type: notif.type || 'info',
          actionType: notif.actionType || 'VIEW',
          actionLabel: notif.actionLabel || 'View Application',
          targetUrl: notif.targetUrl || '',
          timestamp: this._formatNotifTime(),
          date: this._formatNotifTime(),
          read: false
        });

        if (list.length > 80) list = list.slice(0, 80);
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
      } catch (e) {}
    },

    _notifyForApplicationState: function (app, isInitialSeed) {
      if (!app || !app.refNo) return;
      const st = app.currentStage || '';
      const ref = app.refNo;
      const cat = app.category || 'Tourism Permission';
      const dist = app.district || 'Gangtok';
      const applicant = app.applicantName || 'Applicant';

      if (st === STAGES.STAGE_1 || st === STAGES.STAGE_2 || st === STAGES.STAGE_7) {
        const isResub = st === STAGES.STAGE_7;
        this._pushNotification({
          refNo: ref,
          targetRole: 'TO',
          district: dist,
          eventKey: isResub ? 'TO_REVERIFY' : 'TO_REVIEW',
          title: isResub ? `Resubmitted Application: ${ref}` : `New Application for TO Verification: ${ref}`,
          message: `${applicant} (${cat}) in ${dist} Circle requires TO scrutiny.`,
          type: isResub ? 'warning' : 'info',
          actionLabel: isResub ? 'Re-verify Application' : 'Review Application',
          targetUrl: `review.html?arn=${encodeURIComponent(ref)}&role=to`
        });
      } else if (st === STAGES.STAGE_3 || st === STAGES.STAGE_5 || st === STAGES.STAGE_11) {
        const isHqRet = st === STAGES.STAGE_5;
        const isFinalDto = st === STAGES.STAGE_11;
        this._pushNotification({
          refNo: ref,
          targetRole: 'DTO',
          district: dist,
          eventKey: isHqRet ? 'DTO_HQ_RETURN' : (isFinalDto ? 'DTO_FINAL_APPROVAL' : 'DTO_REVIEW'),
          title: isHqRet
            ? `Returned by HQ (${ref})`
            : (isFinalDto ? `Payment Received – Final DTO Approval (${ref})` : `Awaiting DTO Review (${ref})`),
          message: isHqRet
            ? `HQ returned ${cat} (${applicant}) with observations. Action required by DTO.`
            : (isFinalDto ? `${applicant} paid ${app.fee || 'fee'}. Issue final Permission Letter.` : `${cat} by ${applicant} forwarded for DTO verification.`),
          type: isHqRet ? 'danger' : (isFinalDto ? 'success' : 'info'),
          actionLabel: isHqRet ? 'Process HQ Return' : (isFinalDto ? 'Final Approval' : 'Review Application'),
          targetUrl: `review.html?arn=${encodeURIComponent(ref)}&role=dto`
        });
      } else if (st === STAGES.STAGE_4 || st === STAGES.STAGE_4B || st === STAGES.STAGE_9 || st === STAGES.STAGE_10) {
        const isPostPay = st === STAGES.STAGE_9 || st === STAGES.STAGE_10;
        this._pushNotification({
          refNo: ref,
          targetRole: 'HQ',
          district: 'all',
          eventKey: isPostPay ? 'HQ_FINAL_VERIFY' : (st === STAGES.STAGE_4B ? 'HQ_DECISION' : 'HQ_INITIAL_REVIEW'),
          title: isPostPay
            ? `Payment Received – HQ Final Verification (${ref})`
            : `Application Awaiting HQ Action (${ref})`,
          message: isPostPay
            ? `${applicant} (${cat}, ${dist}) completed payment. Complete final verification & issue Approval Letter.`
            : `${cat} by ${applicant} (${dist} Circle) is ready for HQ review.`,
          type: isPostPay ? 'success' : 'info',
          actionLabel: isPostPay ? 'Final Verify & Issue' : 'Review Application',
          targetUrl: `review.html?arn=${encodeURIComponent(ref)}&role=hq`
        });
      } else if (st === STAGES.STAGE_4_UNDER_REVIEW) {
        if (!isInitialSeed) {
          this._pushNotification({
            refNo: ref,
            targetRole: 'Citizen',
            district: dist,
            eventKey: 'CITIZEN_UNDER_HQ_REVIEW',
            title: `Application Under Review by Headquarters`,
            message: `Your ${cat} (${ref}) is currently under review by State Headquarters.`,
            type: 'info',
            actionType: 'TRACK',
            actionLabel: 'Track Status',
            targetUrl: `dashboard.html?view=tracking&arn=${encodeURIComponent(ref)}`
          });
        }
      } else if (st === STAGES.STAGE_6) {
        this._pushNotification({
          refNo: ref,
          targetRole: 'Citizen',
          district: dist,
          eventKey: 'CITIZEN_RETURNED',
          title: `Action Required: Application Returned (${ref})`,
          message: app.returnRemarks || app.hqRemarks || app.dtoRemarks || app.toRemarks || `Your ${cat} was returned for correction.`,
          type: 'danger',
          actionType: 'RESUBMIT',
          actionLabel: 'Fix & Resubmit',
          targetUrl: `apply.html?ref=${encodeURIComponent(ref)}`
        });
      } else if (st === STAGES.STAGE_8) {
        this._pushNotification({
          refNo: ref,
          targetRole: 'Citizen',
          district: dist,
          eventKey: 'CITIZEN_PAYMENT_DUE',
          title: `Payment Activated for ${ref}`,
          message: `Your ${cat} is approved for fee payment (${app.fee || 'Fee'}). Pay now to proceed.`,
          type: 'warning',
          actionType: 'PAY_NOW',
          actionLabel: 'Pay Now',
          targetUrl: `dashboard.html?view=applications&arn=${encodeURIComponent(ref)}`
        });
      } else if (st === STAGES.STAGE_12) {
        if (app.extensionRequest && app.extensionRequest.status === 'Pending DTO Decision') {
          this._pushNotification({
            refNo: ref,
            targetRole: 'DTO',
            district: dist,
            eventKey: 'DTO_EXTENSION_PENDING',
            title: `Extension Request Pending (${ref})`,
            message: `${applicant} requested a validity extension for ${cat}.`,
            type: 'warning',
            actionLabel: 'Decide Extension',
            targetUrl: `review.html?arn=${encodeURIComponent(ref)}&role=dto`
          });
        } else if (!isInitialSeed) {
          this._pushNotification({
            refNo: ref,
            targetRole: 'Citizen',
            district: dist,
            eventKey: 'CITIZEN_APPROVED',
            title: `Approval Letter Issued (${ref})`,
            message: `Your ${cat} has been approved. Download your official Permission Letter.`,
            type: 'success',
            actionType: 'DOWNLOAD_CERT',
            actionLabel: 'Download Letter',
            targetUrl: `permission-letter.html?arn=${encodeURIComponent(ref)}`
          });
          if (app.dtoNotifiedOfIssuance) {
            this._pushNotification({
              refNo: ref,
              targetRole: 'DTO',
              district: dist,
              eventKey: 'DTO_HQ_ISSUED',
              title: `HQ Issued Approval Letter (${ref})`,
              message: `Headquarters issued final Approval Letter for ${cat} (${applicant}).`,
              type: 'success',
              actionLabel: 'View Letter',
              targetUrl: `permission-letter.html?arn=${encodeURIComponent(ref)}&role=dto`
            });
          }
        }
      } else if (st === STAGES.STAGE_13 && !isInitialSeed) {
        this._pushNotification({
          refNo: ref,
          targetRole: 'Citizen',
          district: dist,
          eventKey: 'CITIZEN_REJECTED',
          title: `Application Rejected (${ref})`,
          message: app.hqRemarks || app.dtoRemarks || `Your ${cat} application was rejected.`,
          type: 'danger',
          actionType: 'TRACK',
          actionLabel: 'View Details',
          targetUrl: `dashboard.html?view=tracking&arn=${encodeURIComponent(ref)}`
        });
      }
    },

    getApplication: function (refNo) {
      const apps = this.getAllApplications();
      return apps.find(a => a.refNo === refNo) || null;
    },

    updateApplication: function (updatedApp) {
      const apps = this.getAllApplications();
      const idx = apps.findIndex(a => a.refNo === updatedApp.refNo);
      if (idx >= 0) {
        updatedApp.lastUpdated = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        apps[idx] = updatedApp;
      } else {
        apps.unshift(updatedApp);
      }
      this.saveAllApplications(apps);
      this._notifyForApplicationState(updatedApp, false);
      return updatedApp;
    },

    ingestCitizenSubmission: function (sub) {
      if (!sub || !sub.refNo) return null;
      const apps = this.getAllApplications();
      const existing = apps.find(a => a.refNo === sub.refNo);
      if (existing) return existing;
      const newApp = this._buildApplicationRecord(sub);
      apps.unshift(newApp);
      this.saveAllApplications(apps);
      this._notifyForApplicationState(newApp, false);
      return newApp;
    },

    addHistoryEntry: function (app, entry) {
      if (!app.history) app.history = [];
      app.history.push({
        action: entry.action,
        role: entry.role,
        officer: entry.officer,
        office: entry.office,
        date: entry.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        previousStage: entry.previousStage,
        newStage: entry.newStage,
        remarks: entry.remarks || 'No remarks recorded.'
      });
    },

    // ==============================================================
    // TOURISM OFFICER (TO) ACTIONS
    // ==============================================================

    // TO forwards application to DTO (standard flow) or HQ (if redirected directly where applicable)
    toForwardApplication: function (refNo, officerName, targetAuthority, remarks, droneUpdates) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const officeInfo = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const actingOfficer = officerName || officeInfo.toName || 'Tourism Officer (TO)';
      const oldStage = app.currentStage;

      // For Drone Permission: TO can update Approved Date/Period, Permissible Flying Altitude (AGL), Approved Flying Area
      if (app.categoryKey === 'drone' && droneUpdates) {
        app.droneDetails = app.droneDetails || {};
        if (droneUpdates.approvedPeriod !== undefined) app.droneDetails.approvedPeriod = String(droneUpdates.approvedPeriod).trim();
        if (droneUpdates.permissibleAltitudeAgl !== undefined) app.droneDetails.permissibleAltitudeAgl = String(droneUpdates.permissibleAltitudeAgl).trim();
        if (droneUpdates.approvedFlyingArea !== undefined) app.droneDetails.approvedFlyingArea = String(droneUpdates.approvedFlyingArea).trim();
      }
      // Note: For Expedition Permission, TO is strictly prohibited from modifying requestedDuration.

      const dest = (targetAuthority === 'hq' && this.isHqApprovalRequired(app.categoryKey)) ? 'hq' : 'dto';
      app.status = STATUSES.SUBMITTED;
      app.currentStage = (dest === 'hq') ? STAGES.STAGE_4 : STAGES.STAGE_3;
      app.currentStageNum = (dest === 'hq') ? 4 : 3;
      app.assignedRole = dest;
      if (dest === 'hq') app.hqOfficerName = HQ_OFFICER.name;
      app.toRemarks = remarks || `Initial TO verification completed. Forwarded to ${dest.toUpperCase()}.`;

      this.addHistoryEntry(app, {
        action: `Verified by TO & Forwarded to ${dest === 'hq' ? 'HQ Officer' : 'DTO'}`,
        role: 'Tourism Officer (TO)',
        officer: actingOfficer,
        office: officeInfo.office,
        previousStage: oldStage,
        newStage: app.currentStage,
        remarks: app.toRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    toReturnToCitizen: function (refNo, officerName, remarks) {
      if (!remarks || !remarks.trim()) {
        return { success: false, message: 'Mandatory return remarks explaining the required correction must be provided.' };
      }
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const officeInfo = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const actingOfficer = officerName || officeInfo.toName || 'Tourism Officer (TO)';
      const oldStage = app.currentStage;

      app.status = STATUSES.RETURNED;
      app.currentStage = STAGES.STAGE_6;
      app.currentStageNum = 6;
      app.assignedRole = 'citizen';
      app.toRemarks = remarks.trim();

      this.addHistoryEntry(app, {
        action: 'Returned by TO to Citizen for Correction',
        role: 'Tourism Officer (TO)',
        officer: actingOfficer,
        office: officeInfo.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_6,
        remarks: app.toRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    // TO redirects an "Other Permissions" application to the appropriate category/workflow/authority
    toRedirectApplication: function (refNo, officerName, targetCategoryKey, remarks) {
      if (!remarks || !remarks.trim()) {
        return { success: false, message: 'Mandatory remarks explaining the redirection must be provided.' };
      }
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const officeInfo = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const actingOfficer = officerName || officeInfo.toName || 'Tourism Officer (TO)';
      const oldCategory = app.category;
      const oldStage = app.currentStage;
      const newKey = normalizeCategoryKey(targetCategoryKey);
      const newCfg = CATEGORIES[newKey] || CATEGORIES['other'];
      const requiresHq = (newCfg.approvalLevel === 'HQ');

      app.categoryKey = newKey;
      app.category = newCfg.name;
      app.requiresHqVerification = requiresHq;
      app.flowType = requiresHq ? 'flow_a' : 'flow_b';
      app.flowTitle = (requiresHq ? 'HQ-Level Approval' : 'DTO-Level Approval') + ' (' + newCfg.name + ')';
      app.extensionAllowed = newCfg.extensionAllowed;
      app.maxExtensionDays = newCfg.maxExtensionDays || 0;
      app.status = STATUSES.SUBMITTED;
      app.currentStage = STAGES.STAGE_3;
      app.currentStageNum = 3;
      app.assignedRole = 'dto';
      app.toRemarks = remarks.trim();

      this.addHistoryEntry(app, {
        action: `Redirected from "${oldCategory}" to "${newCfg.name}" & Forwarded to DTO`,
        role: 'Tourism Officer (TO)',
        officer: actingOfficer,
        office: officeInfo.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_3,
        remarks: app.toRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },
    // ==============================================================

    // DTO forwards HQ-level app (Drone / Expedition) to HQ Officer
    dtoVerifyAndForwardToHq: function (refNo, officerName, remarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      if (!this.isHqApprovalRequired(app.categoryKey || app.category)) {
        return { success: false, message: 'Only Drone and Expedition permissions are forwarded to HQ Officer.' };
      }

      const oldStage = app.currentStage;
      const officeInfo = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      app.status = STATUSES.SUBMITTED;
      app.currentStage = STAGES.STAGE_4;
      app.currentStageNum = 4;
      app.assignedRole = 'hq';
      app.hqOfficerName = HQ_OFFICER.name;
      app.dtoRemarks = remarks || 'District review completed. Forwarded to HQ Officer for review and payment activation.';

      this.addHistoryEntry(app, {
        action: 'Forwarded to HQ Officer',
        role: 'District Tourism Officer (DTO)',
        officer: officerName || officeInfo.dtoName,
        office: officeInfo.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_4,
        remarks: app.dtoRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    // DTO activates payment for DTO-level permissions after initial review
    dtoActivatePayment: function (refNo, officerName, remarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      if (this.isHqApprovalRequired(app.categoryKey || app.category)) {
        return { success: false, message: 'HQ-level permissions (Drone & Expedition) must be approved for payment by the HQ Officer.' };
      }

      const oldStage = app.currentStage;
      const officeInfo = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      app.status = STATUSES.PAYMENT_PENDING;
      app.currentStage = STAGES.STAGE_8;
      app.currentStageNum = 8;
      app.assignedRole = 'citizen';
      app.returnToAfterPayment = 'dto';
      app.paymentActivated = true;
      app.paymentStatus = 'PENDING';
      app.dtoRemarks = remarks || 'Initial DTO review completed. Payment / statutory clearance activated for citizen completion.';

      this.addHistoryEntry(app, {
        action: 'Approved for Payment (Payment Activated by DTO)',
        role: 'District Tourism Officer (DTO)',
        officer: officerName || officeInfo.dtoName,
        office: officeInfo.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_8,
        remarks: app.dtoRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    // DTO Final Approval for DTO-level permissions (No Approval Sheet)
    dtoFinalApproval: function (refNo, officerName, remarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      if (this.isHqApprovalRequired(app.categoryKey || app.category)) {
        return { success: false, message: 'HQ-level permissions receive final approval from the HQ Officer.' };
      }

      const oldStage = app.currentStage;
      const officeInfo = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const catCode = (app.categoryKey || 'TP').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
      app.status = STATUSES.APPROVED;
      app.currentStage = STAGES.STAGE_12;
      app.currentStageNum = 12;
      app.assignedRole = 'none';
      app.permissionNumber = app.permissionNumber || `SK-TOUR-2026-${catCode}-${app.refNo.split('-').pop()}`;
      app.certRef = app.permissionNumber;
      app.approvalDate = app.approvalDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      this._computeApprovedValidity(app, new Date());
      app.approvingOfficer = officerName || officeInfo.dtoName;
      app.approvingDesignation = officeInfo.designation || 'District Tourism Officer (DTO)';
      app.approvingOffice = officeInfo.office;
      app.dtoRemarks = remarks || 'Final DTO approval granted. Approval Letter / Permission Certificate issued.';

      this.addHistoryEntry(app, {
        action: 'Final Approval Granted & Permission Certificate Issued',
        role: 'District Tourism Officer (DTO)',
        officer: app.approvingOfficer,
        office: officeInfo.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_12,
        remarks: app.dtoRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    dtoDirectApprove: function (refNo, officerName, remarks) {
      return this.dtoFinalApproval(refNo, officerName, remarks);
    },

    dtoReturnToTo: function (refNo, officerName, remarks) {
      if (!remarks || !remarks.trim()) {
        return { success: false, message: 'Mandatory return remarks must be provided.' };
      }
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const oldStage = app.currentStage;
      const officeInfo = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      app.status = STATUSES.SUBMITTED;
      app.currentStage = STAGES.STAGE_5B;
      app.currentStageNum = 5;
      app.assignedRole = 'to';
      app.dtoRemarks = remarks.trim();

      this.addHistoryEntry(app, {
        action: 'Returned by DTO to TO',
        role: 'District Tourism Officer (DTO)',
        officer: officerName || officeInfo.dtoName,
        office: officeInfo.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_5B,
        remarks: app.dtoRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    dtoReturnToCitizen: function (refNo, officerName, remarks) {
      if (!remarks || !remarks.trim()) {
        return { success: false, message: 'Mandatory return remarks must be provided.' };
      }
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const oldStage = app.currentStage;
      const officeInfo = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      app.status = STATUSES.RETURNED;
      app.currentStage = STAGES.STAGE_6;
      app.currentStageNum = 6;
      app.assignedRole = 'citizen';
      app.dtoRemarks = remarks.trim();

      this.addHistoryEntry(app, {
        action: 'Returned by DTO to Citizen for Clarification',
        role: 'District Tourism Officer (DTO)',
        officer: officerName || officeInfo.dtoName,
        office: officeInfo.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_6,
        remarks: app.dtoRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    dtoRejectApplication: function (refNo, officerName, remarks) {
      if (!remarks || !remarks.trim()) {
        return { success: false, message: 'Mandatory rejection remarks must be provided.' };
      }
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const oldStage = app.currentStage;
      const officeInfo = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      app.status = STATUSES.REJECTED;
      app.currentStage = STAGES.STAGE_13;
      app.currentStageNum = 13;
      app.assignedRole = 'none';
      app.dtoRemarks = remarks.trim();

      this.addHistoryEntry(app, {
        action: 'Application Formally Rejected',
        role: 'District Tourism Officer (DTO)',
        officer: officerName || officeInfo.dtoName,
        office: officeInfo.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_13,
        remarks: app.dtoRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    changeLiaisonOfficer: function (refNo, officerName, newLoName, changeRemarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      if (app.categoryKey !== 'expedition') {
        return { success: false, message: 'Liaison Officer reassignment is only applicable to Expedition Permission.' };
      }
      if (!newLoName || !newLoName.trim()) return { success: false, message: 'Select a valid Liaison Officer.' };
      if (!changeRemarks || !changeRemarks.trim()) return { success: false, message: 'Provide remarks for Liaison Officer change.' };

      const oldLo = app.liaisonOfficer || 'Not Assigned';
      const officeInfo = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const actingOfficer = officerName || officeInfo.dtoName;
      app.liaisonOfficer = newLoName.trim();
      app.loChangeRemarks = changeRemarks.trim();

      this.addHistoryEntry(app, {
        action: 'Liaison Officer Reassigned',
        role: 'Officer',
        officer: actingOfficer,
        office: officeInfo.office,
        previousStage: app.currentStage,
        newStage: app.currentStage,
        remarks: `Liaison Officer changed from "${oldLo}" to "${app.liaisonOfficer}". Remarks: ${app.loChangeRemarks}`
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    // ==============================================================
    // HQ REVIEWING OFFICER & HQ DECISION ACTIONS (Workflow A)
    // ==============================================================

    hqForwardToDecision: function (refNo, officerName, remarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const oldStage = app.currentStage;
      const actingOfficer = officerName || app.hqOfficerName || HQ_OFFICER.name;
      app.hqOfficerName = actingOfficer;
      app.status = STATUSES.SUBMITTED;
      app.currentStage = STAGES.STAGE_4B;
      app.currentStageNum = 5;
      app.assignedRole = 'hq';
      app.hqRemarks = (remarks && remarks.trim()) ? remarks.trim() : 'HQ Reviewing Officer scrutiny completed. Forwarded to HQ Decision stage.';

      this.addHistoryEntry(app, {
        action: 'HQ Reviewing Officer Approved & Forwarded to HQ Decision',
        role: 'HQ Reviewing Officer',
        officer: actingOfficer,
        office: HQ_OFFICER.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_4B,
        remarks: app.hqRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    hqReturnToTo: function (refNo, officerName, remarks) {
      if (!remarks || !remarks.trim()) return { success: false, message: 'Mandatory remarks must be provided.' };
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const oldStage = app.currentStage;
      app.status = STATUSES.SUBMITTED;
      app.currentStage = STAGES.STAGE_5C;
      app.currentStageNum = 2;
      app.assignedRole = 'to';
      app.hqRemarks = remarks.trim();

      this.addHistoryEntry(app, {
        action: 'Returned by HQ to TO',
        role: 'HQ Officer',
        officer: officerName || app.hqOfficerName || HQ_OFFICER.name,
        office: HQ_OFFICER.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_5C,
        remarks: app.hqRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    hqMarkUnderReview: function (refNo, officerName, remarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const oldStage = app.currentStage;
      const actingOfficer = officerName || app.hqOfficerName || HQ_OFFICER.name;
      app.hqOfficerName = actingOfficer;
      app.status = STATUSES.UNDER_HQ_REVIEW;
      app.currentStage = STAGES.STAGE_4_UNDER_REVIEW;
      app.currentStageNum = 4;
      app.assignedRole = 'hq';
      app.hqRemarks = (remarks && remarks.trim()) ? remarks.trim() : 'Application summary downloaded & marked Under Review by Headquarters.';

      this.addHistoryEntry(app, {
        action: 'Marked Under Review by Headquarters',
        role: 'HQ Reviewing Officer',
        officer: actingOfficer,
        office: HQ_OFFICER.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_4_UNDER_REVIEW,
        remarks: app.hqRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    hqApproveForPayment: function (refNo, officerName, remarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      if (!app.approvalSheet) {
        return { success: false, message: 'Please upload the signed External Approval Sheet before marking the application for payment.' };
      }

      const oldStage = app.currentStage;
      const actingOfficer = officerName || app.hqOfficerName || HQ_OFFICER.name;
      app.hqOfficerName = actingOfficer;

      app.status = STATUSES.PAYMENT_PENDING;
      app.currentStage = STAGES.STAGE_8;
      app.currentStageNum = 8;
      app.assignedRole = 'citizen';
      app.returnToAfterPayment = 'hq';
      app.paymentActivated = true;
      app.paymentStatus = 'PENDING';
      app.hqRemarks = (remarks && remarks.trim()) ? remarks.trim() : 'External Approval Sheet uploaded & marked for payment. Application will automatically forward to HQ Final Verification after citizen payment.';

      this.addHistoryEntry(app, {
        action: 'Marked for Payment (Payment Activated)',
        role: 'HQ Officer',
        officer: actingOfficer,
        office: HQ_OFFICER.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_8,
        remarks: app.hqRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    hqUploadApprovalSheet: function (refNo, officerName, fileName, fileSize, sheetNo) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const oldStage = app.currentStage;
      const actingOfficer = officerName || app.hqOfficerName || HQ_OFFICER.name;
      const sheetName = fileName || `HQ_Approval_Sheet_${refNo}.pdf`;
      const sNo = sheetNo || `HQ/APP-SHEET/2026/${refNo.split('-').pop()}`;

      app.approvalSheet = {
        sheetNo: sNo,
        fileName: sheetName,
        size: fileSize || '1.4 MB',
        uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        uploadedBy: actingOfficer,
        designation: HQ_OFFICER.designation,
        office: HQ_OFFICER.office,
        eOfficeNumber: app.eOfficeNumber || `EOF-2026-SK-TOUR-${refNo.split('-').pop()}`,
        concurrenceRemarks: app.hqRemarks || 'Headquarters approval sheet attached.'
      };

      app.currentStage = (app.currentStage === STAGES.STAGE_9 || app.currentStage === STAGES.STAGE_10)
        ? app.currentStage
        : app.currentStage;
      app.assignedRole = 'hq';

      this.addHistoryEntry(app, {
        action: 'External Approval Sheet Uploaded',
        role: 'HQ Officer',
        officer: actingOfficer,
        office: HQ_OFFICER.office,
        previousStage: oldStage,
        newStage: app.currentStage,
        remarks: `Official signed External Approval Sheet [${sheetName}] uploaded by HQ Officer.`
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    hqCompleteFinalApproval: function (refNo, officerName, remarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      if (!app.approvalSheet) {
        return { success: false, message: 'Please upload the HQ Approval Sheet before completing final approval.' };
      }

      const oldStage = app.currentStage;
      const actingOfficer = officerName || app.hqOfficerName || HQ_OFFICER.name;
      const catCode = (app.categoryKey || 'TP').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);

      app.status = STATUSES.APPROVED;
      app.currentStage = STAGES.STAGE_12;
      app.currentStageNum = 12;
      app.assignedRole = 'none';
      app.permissionNumber = app.permissionNumber || `SK-TOUR-2026-${catCode}-${app.refNo.split('-').pop()}`;
      app.certRef = app.permissionNumber;
      app.approvalDate = app.approvalDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      this._computeApprovedValidity(app, new Date());
      app.dtoNotifiedOfIssuance = true;
      app.approvingOfficer = actingOfficer;
      app.approvingDesignation = HQ_OFFICER.designation;
      app.approvingOffice = HQ_OFFICER.office;
      app.hqApprovalStatus = 'Approved';
      app.hqApprovalDate = app.approvalDate;
      app.hqApprovedBy = actingOfficer;
      app.hqRemarks = remarks || 'Final HQ approval completed with Approval Sheet attached. Approval Letter / Permission Certificate issued.';

      this.addHistoryEntry(app, {
        action: 'HQ Final Approval Completed & Approval Letter Issued',
        role: 'HQ Officer',
        officer: actingOfficer,
        office: HQ_OFFICER.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_12,
        remarks: app.hqRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    hqReturnToDto: function (refNo, officerName, remarks) {
      if (!remarks || !remarks.trim()) return { success: false, message: 'Mandatory remarks must be provided.' };
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const oldStage = app.currentStage;
      app.status = STATUSES.SUBMITTED;
      app.currentStage = STAGES.STAGE_5;
      app.currentStageNum = 5;
      app.assignedRole = 'dto';
      app.hqRemarks = remarks.trim();

      this.addHistoryEntry(app, {
        action: 'Returned by HQ to DTO',
        role: 'HQ Officer',
        officer: officerName || app.hqOfficerName || HQ_OFFICER.name,
        office: HQ_OFFICER.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_5,
        remarks: app.hqRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    hqReturnToCitizen: function (refNo, officerName, remarks) {
      if (!remarks || !remarks.trim()) return { success: false, message: 'Mandatory remarks must be provided.' };
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const oldStage = app.currentStage;
      app.status = STATUSES.RETURNED;
      app.currentStage = STAGES.STAGE_6;
      app.currentStageNum = 6;
      app.assignedRole = 'citizen';
      app.hqRemarks = remarks.trim();
      app.returnRemarks = remarks.trim();

      this.addHistoryEntry(app, {
        action: 'Returned by HQ Officer to Citizen for Correction',
        role: 'HQ Officer',
        officer: officerName || app.hqOfficerName || HQ_OFFICER.name,
        office: HQ_OFFICER.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_6,
        remarks: app.hqRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    hqRejectApplication: function (refNo, officerName, remarks) {
      if (!remarks || !remarks.trim()) return { success: false, message: 'Mandatory rejection remarks must be provided.' };
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const oldStage = app.currentStage;
      app.status = STATUSES.REJECTED;
      app.currentStage = STAGES.STAGE_13;
      app.currentStageNum = 13;
      app.assignedRole = 'none';
      app.hqRemarks = remarks.trim();

      this.addHistoryEntry(app, {
        action: 'Application Rejected by HQ Officer',
        role: 'HQ Officer',
        officer: officerName || app.hqOfficerName || HQ_OFFICER.name,
        office: HQ_OFFICER.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_13,
        remarks: app.hqRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    // ==============================================================
    // CITIZEN PAYMENT, RESUBMISSION & EXTENSION ACTIONS
    // ==============================================================

    citizenCompletePayment: function (refNo, txnRef, paymentMode) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const oldStage = app.currentStage;
      const isHq = this.isHqApprovalRequired(app.categoryKey || app.category);
      const returnRole = isHq ? 'hq' : 'dto';
      const nextStage = isHq ? STAGES.STAGE_9 : STAGES.STAGE_11;
      const nextStageNum = isHq ? 9 : 11;

      app.status = STATUSES.SUBMITTED;
      app.currentStage = nextStage;
      app.currentStageNum = nextStageNum;
      app.assignedRole = returnRole;
      app.isPaid = true;
      app.paymentStatus = 'PAID';
      app.paymentTxnRef = txnRef || ('TXN-SK-2026-' + Math.floor(10000 + Math.random() * 89999));

      this.addHistoryEntry(app, {
        action: app.feeAmount > 0 ? `Citizen Payment Completed (${app.fee})` : 'Statutory Fee Clearance Confirmed (Free)',
        role: 'Citizen',
        officer: app.applicantName,
        office: 'Applicant Portal',
        previousStage: oldStage,
        newStage: nextStage,
        remarks: `Transaction Ref: ${app.paymentTxnRef} (${paymentMode || 'Sikkim GO Gateway'}). Automatically routed back to ${isHq ? (app.hqOfficerName || 'HQ Officer') : 'District DTO'} for final approval.`
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    citizenResubmit: function (refNo, updatedData, citizenRemarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const oldStage = app.currentStage;
      if (updatedData) {
        if (updatedData.activityTitle) app.activityTitle = updatedData.activityTitle;
        if (updatedData.activityDescription) app.activityDescription = updatedData.activityDescription;
        if (updatedData.newDoc) {
          if (!app.documents) app.documents = [];
          app.documents.push(updatedData.newDoc);
        }
      }

      app.status = STATUSES.SUBMITTED;
      app.currentStage = STAGES.STAGE_7; // Back to TO Reverification
      app.currentStageNum = 7;
      app.assignedRole = 'to';
      app.citizenRemarks = citizenRemarks || 'Requested corrections made and updated documents attached.';

      this.addHistoryEntry(app, {
        action: 'Corrected Application Resubmitted',
        role: 'Citizen',
        officer: app.applicantName,
        office: 'Applicant Portal',
        previousStage: oldStage,
        newStage: STAGES.STAGE_7,
        remarks: app.citizenRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    // Citizen requests extension (Allowed ONLY for Drone up to 15 days, and Event/Fair/Mela/Rally up to 7 days)
    citizenRequestExtension: function (refNo, requestedDays, reason) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      if (app.status !== STATUSES.APPROVED) {
        return { success: false, message: 'Extensions can only be requested for approved permissions.' };
      }
      if (!this.isExtensionAllowed(app.categoryKey || app.category)) {
        return { success: false, message: `Extension requests are not permitted for ${app.category}.` };
      }

      const catCfg = this.getCategoryConfig(app.categoryKey || app.category);
      const maxDays = catCfg.maxExtensionDays || 7;
      const days = parseInt(requestedDays, 10);
      if (!days || days < 1 || days > maxDays) {
        return { success: false, message: `Requested extension must be between 1 and ${maxDays} days.` };
      }
      if (!reason || !reason.trim()) {
        return { success: false, message: 'Please provide justification remarks for the extension request.' };
      }

      const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      app.extensionRequest = {
        requested: true,
        status: 'Pending DTO Decision',
        requestedDays: days,
        reason: reason.trim(),
        requestedDate: nowStr,
        decidedBy: null,
        decisionDate: null,
        decisionRemarks: null,
        revisedValidUntil: null
      };

      this.addHistoryEntry(app, {
        action: `Extension Requested (+${days} Days)`,
        role: 'Citizen',
        officer: app.applicantName,
        office: 'Applicant Portal',
        previousStage: app.currentStage,
        newStage: app.currentStage,
        remarks: `Extension request of ${days} day(s) submitted and routed to DTO. Reason: ${reason.trim()}`
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    // DTO decides extension request (Even for Drone Permission whose original approval is HQ-level)
    dtoDecideExtension: function (refNo, decision, officerName, remarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      if (!app.extensionRequest || !app.extensionRequest.requested) {
        return { success: false, message: 'No active extension request found for this application.' };
      }
      if (!remarks || !remarks.trim()) {
        return { success: false, message: 'Mandatory remarks explaining the extension decision must be provided.' };
      }

      const officeInfo = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const actingOfficer = officerName || officeInfo.dtoName;
      const nowDate = new Date();
      const nowStr = nowDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const approved = (decision === 'Approved');

      app.extensionRequest.status = approved ? 'Approved' : 'Rejected';
      app.extensionRequest.decidedBy = actingOfficer;
      app.extensionRequest.decisionDate = nowStr;
      app.extensionRequest.decisionRemarks = remarks.trim();

      if (approved) {
        const baseExp = app.approvedExpiryDateIso ? new Date(app.approvedExpiryDateIso) : new Date(nowDate.getTime() + (15 * 24 * 60 * 60 * 1000));
        const revDate = new Date(baseExp.getTime() + (app.extensionRequest.requestedDays * 24 * 60 * 60 * 1000));
        const revStr = revDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        app.extensionRequest.revisedValidUntil = revStr;
        app.approvedExpiryDate = revStr;
        app.approvedExpiryDateIso = revDate.toISOString().slice(0, 10);
        app.validityLabel = `${app.approvedStartDate || app.approvalDate || ''} to ${revStr} (Extended +${app.extensionRequest.requestedDays} Days)`.trim();
      }

      this.addHistoryEntry(app, {
        action: `Extension Request ${approved ? 'Approved' : 'Rejected'} by DTO`,
        role: 'District Tourism Officer (DTO)',
        officer: actingOfficer,
        office: officeInfo.office,
        previousStage: app.currentStage,
        newStage: app.currentStage,
        remarks: `${approved ? 'Extended by +' + app.extensionRequest.requestedDays + ' day(s).' : 'Extension rejected.'} Remarks: ${remarks.trim()}`
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    // ==============================================================
    // DOCUMENT GENERATION PACKAGE
    // ==============================================================
    getDocumentPackage: function (refNo) {
      const app = this.getApplication(refNo);
      if (!app) return null;

      const isHqApplicable = this.isHqApprovalRequired(app.categoryKey || app.category);
      const isSheetUploaded = !!app.approvalSheet;
      const isApproved = (app.status === STATUSES.APPROVED && app.currentStage === STAGES.STAGE_12) || !!app.permissionNumber;
      const isRejected = (app.status === STATUSES.REJECTED || app.currentStage === STAGES.STAGE_13);
      const isReturned = (app.status === STATUSES.RETURNED || app.currentStage === STAGES.STAGE_6);

      return {
        refNo: app.refNo,
        applicantName: app.applicantName,
        category: app.category,
        district: app.district,
        status: app.status,
        currentStage: app.currentStage,
        approvalSheet: {
          applicable: isHqApplicable,
          uploaded: isSheetUploaded,
          data: app.approvalSheet || null,
          title: 'HQ Departmental Approval Sheet',
          statusText: isSheetUploaded ? 'Available for View / Download' : (!isHqApplicable ? 'Not Required (DTO-Level Category)' : (isRejected ? 'Review Terminated (Rejected)' : 'Awaiting HQ Upload')),
          badgeClass: isSheetUploaded ? 'bg-success' : (!isHqApplicable ? 'bg-secondary' : 'bg-warning text-dark'),
          canDownload: isHqApplicable && isSheetUploaded,
          fileName: isSheetUploaded ? app.approvalSheet.fileName : null,
          sheetNo: isSheetUploaded ? app.approvalSheet.sheetNo : null,
          uploadDate: isSheetUploaded ? app.approvalSheet.uploadDate : null,
          url: `approval-sheet.html?arn=${encodeURIComponent(app.refNo)}`
        },
        permissionLetter: {
          available: isApproved,
          permissionNumber: app.permissionNumber || null,
          issueDate: app.approvalDate || null,
          approvingOfficer: app.approvingOfficer || (isHqApplicable ? HQ_OFFICER.name : (DISTRICT_OFFICES[app.district]?.dtoName || 'DTO')),
          approvingDesignation: app.approvingDesignation || (isHqApplicable ? HQ_OFFICER.designation : 'District Tourism Officer (DTO)'),
          approvingOffice: app.approvingOffice || (isHqApplicable ? HQ_OFFICER.office : app.dtoOffice),
          title: 'Approval Letter / Permission Certificate',
          statusText: isApproved ? `Issued by ${isHqApplicable ? 'HQ Officer' : 'District Tourism Officer'}` : (isRejected ? 'Application Rejected' : (isReturned ? 'Returned for Correction' : 'Pending Final Approval')),
          badgeClass: isApproved ? 'bg-success' : (isRejected ? 'bg-danger' : (isReturned ? 'bg-warning text-dark' : 'bg-secondary')),
          canDownload: isApproved,
          url: `permission-letter.html?arn=${encodeURIComponent(app.refNo)}`
        }
      };
    },

    // ==============================================================
    // REPORTS & ANALYTICS HELPERS
    // ==============================================================
    parseSubmissionDate: function (dateStr) {
      if (!dateStr) return null;
      const m = dateStr.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/);
      if (m) {
        const months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
        const month = months[m[2].toLowerCase()];
        if (month !== undefined) return new Date(parseInt(m[3], 10), month, parseInt(m[1], 10));
      }
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? null : d;
    },

    isDateInRange: function (dateStr, fromDateStr, toDateStr) {
      if (!fromDateStr && !toDateStr) return true;
      const d = this.parseSubmissionDate(dateStr);
      if (!d) return true;
      if (fromDateStr && d < new Date(fromDateStr + 'T00:00:00')) return false;
      if (toDateStr && d > new Date(toDateStr + 'T23:59:59')) return false;
      return true;
    },

    getReportData: function (role, district, filters) {
      const allApps = this.getAllApplications();
      const r = (role || 'dto').toLowerCase();
      const f = filters || {};

      let effectiveDistrict = district || 'Gangtok';
      if (r === 'dto' || r === 'to') {
        if (!effectiveDistrict || effectiveDistrict === 'all') effectiveDistrict = 'Gangtok';
      } else {
        effectiveDistrict = (f.district && f.district !== '') ? f.district : (district || 'all');
      }

      let scopedApps = allApps;
      if (r === 'dto' || r === 'to' || (effectiveDistrict && effectiveDistrict !== 'all')) {
        scopedApps = scopedApps.filter(a => a.district === effectiveDistrict);
      }

      const filteredRecords = scopedApps.filter(app => {
        if (f.category && f.category !== 'all') {
          if (app.categoryKey !== f.category && !(app.category || '').toLowerCase().includes(f.category.toLowerCase())) return false;
        }
        if (f.status && f.status !== 'all') {
          if (!app.status || app.status.toLowerCase() !== f.status.toLowerCase()) return false;
        }
        if (f.stage && f.stage !== 'all' && app.currentStage !== f.stage) return false;
        if ((f.fromDate || f.toDate) && !this.isDateInRange(app.submissionDate, f.fromDate, f.toDate)) return false;
        if (f.search && f.search.trim()) {
          const q = f.search.trim().toLowerCase();
          if (!(app.refNo || '').toLowerCase().includes(q) &&
            !(app.applicantName || '').toLowerCase().includes(q) &&
            !(app.activityTitle || '').toLowerCase().includes(q)) return false;
        }
        return true;
      });

      const summary = {
        total: filteredRecords.length,
        submitted: filteredRecords.filter(a => a.status === STATUSES.SUBMITTED || a.status === STATUSES.PAYMENT_PENDING).length,
        returned: filteredRecords.filter(a => a.status === STATUSES.RETURNED).length,
        approved: filteredRecords.filter(a => a.status === STATUSES.APPROVED).length,
        rejected: filteredRecords.filter(a => a.status === STATUSES.REJECTED).length
      };

      const districtsList = ['Gangtok', 'Mangan', 'Namchi', 'Gyalshing', 'Pakyong', 'Soreng'];
      const districtSummary = districtsList.map(dist => {
        const dApps = allApps.filter(a => a.district === dist);
        const total = dApps.length;
        const apprv = dApps.filter(a => a.status === STATUSES.APPROVED).length;
        return {
          district: dist,
          office: DISTRICT_OFFICES[dist] ? DISTRICT_OFFICES[dist].dtoName : `${dist} DTO`,
          total: total,
          submitted: dApps.filter(a => a.status === STATUSES.SUBMITTED || a.status === STATUSES.PAYMENT_PENDING).length,
          returned: dApps.filter(a => a.status === STATUSES.RETURNED).length,
          approved: apprv,
          rejected: dApps.filter(a => a.status === STATUSES.REJECTED).length,
          approvalRate: total > 0 ? Math.round((apprv / total) * 100) : 0
        };
      });

      const categorySummary = Object.values(CATEGORIES).map(cat => {
        const cApps = scopedApps.filter(a => a.categoryKey === cat.key);
        const count = cApps.length;
        return {
          key: cat.key,
          name: cat.name,
          total: count,
          approved: cApps.filter(a => a.status === STATUSES.APPROVED).length,
          submitted: cApps.filter(a => a.status === STATUSES.SUBMITTED || a.status === STATUSES.PAYMENT_PENDING).length,
          feeCollected: cApps.reduce((acc, a) => acc + (a.isPaid && a.feeAmount ? a.feeAmount : 0), 0),
          sharePercent: scopedApps.length > 0 ? Math.round((count / scopedApps.length) * 100) : 0
        };
      });

      return {
        role: r,
        effectiveDistrict: effectiveDistrict,
        filters: f,
        records: filteredRecords,
        summary: summary,
        districtSummary: districtSummary,
        categorySummary: categorySummary
      };
    },

    getStatusAndNextAction: function (app, viewerRole) {
      if (!app) return { statusLabel: 'Unknown', badgeClass: 'bg-secondary text-white', nextAction: '-', authority: '-', actionRequired: false };
      const st = app.currentStage || '';
      const status = app.status || '';
      const role = (viewerRole || 'citizen').toLowerCase();
      const isHqCat = this.isHqApprovalRequired(app.categoryKey || app.category);
      const hasSheet = Boolean(app.approvalSheet);

      if (status === STATUSES.APPROVED || st === STAGES.STAGE_12) {
        if (role === 'dto' && app.extensionRequest && app.extensionRequest.status === 'Pending DTO Decision') {
          return { statusLabel: 'Drone Extension Requested', badgeClass: 'bg-warning text-dark', nextAction: 'Review Extension Request', authority: `DTO (${app.district})`, actionRequired: true };
        }
        return {
          statusLabel: 'Approval Letter Issued',
          badgeClass: 'bg-success text-white',
          nextAction: role === 'citizen' ? 'Download Approval Letter' : 'View Issued Permission',
          authority: isHqCat ? 'HQ Officer' : `DTO (${app.district})`,
          actionRequired: role === 'citizen'
        };
      }

      if (status === STATUSES.REJECTED || st === STAGES.STAGE_13) {
        return {
          statusLabel: 'Rejected',
          badgeClass: 'bg-danger text-white',
          nextAction: 'Application Rejected – View Remarks',
          authority: 'Closed',
          actionRequired: false
        };
      }

      if (status === STATUSES.RETURNED || st === STAGES.STAGE_6) {
        return {
          statusLabel: 'Returned to Applicant',
          badgeClass: 'bg-warning text-dark',
          nextAction: role === 'citizen' ? 'Correct application and resubmit' : 'No action required – Await Applicant',
          authority: 'Citizen / Applicant',
          actionRequired: role === 'citizen'
        };
      }

      if (st === STAGES.STAGE_8 || status === STATUSES.PAYMENT_PENDING) {
        return {
          statusLabel: 'Awaiting Payment',
          badgeClass: 'bg-warning text-dark',
          nextAction: role === 'citizen' ? 'Complete Online Payment' : 'No action required – Awaiting Citizen Payment',
          authority: 'Citizen / Applicant',
          actionRequired: role === 'citizen'
        };
      }

      if (st === STAGES.STAGE_2 || st === STAGES.STAGE_7) {
        return {
          statusLabel: st === STAGES.STAGE_7 ? 'Resubmitted – Pending TO Verification' : 'Submitted',
          badgeClass: 'bg-primary text-white',
          nextAction: role === 'to' ? 'Verify Application' : 'Awaiting TO Verification',
          authority: `TO (${app.district})`,
          actionRequired: role === 'to'
        };
      }

      if (st === STAGES.STAGE_5B) {
        return {
          statusLabel: 'Returned by DTO to TO',
          badgeClass: 'bg-warning text-dark',
          nextAction: role === 'to' ? 'Review and Resubmit to DTO' : 'Awaiting TO Review',
          authority: `TO (${app.district})`,
          actionRequired: role === 'to'
        };
      }

      if (st === STAGES.STAGE_5C) {
        return {
          statusLabel: 'Returned by HQ to TO',
          badgeClass: 'bg-warning text-dark',
          nextAction: role === 'to' ? 'Review and Forward to DTO / HQ' : 'Awaiting TO Review',
          authority: `TO (${app.district})`,
          actionRequired: role === 'to'
        };
      }

      if (st === STAGES.STAGE_3) {
        return {
          statusLabel: 'Pending DTO Verification',
          badgeClass: 'bg-info text-dark',
          nextAction: role === 'dto' ? (isHqCat ? 'Review and Forward to HQ' : 'Review & Approve for Payment') : 'Awaiting DTO Review',
          authority: `DTO (${app.district})`,
          actionRequired: role === 'dto'
        };
      }

      if (st === STAGES.STAGE_5) {
        return {
          statusLabel: 'Returned by HQ to DTO',
          badgeClass: 'bg-warning text-dark',
          nextAction: role === 'dto' ? 'Review and Forward to HQ' : 'Awaiting DTO Review',
          authority: `DTO (${app.district})`,
          actionRequired: role === 'dto'
        };
      }

      if (st === STAGES.STAGE_4) {
        return {
          statusLabel: 'Pending HQ Review',
          badgeClass: 'bg-primary text-white',
          nextAction: role === 'hq' ? (hasSheet ? 'Mark for Payment / Forward' : 'View Summary & Mark Under Review') : 'Awaiting Headquarters Review',
          authority: 'HQ Reviewing Officer',
          actionRequired: role === 'hq'
        };
      }

      if (st === STAGES.STAGE_4_UNDER_REVIEW || status === STATUSES.UNDER_HQ_REVIEW) {
        return {
          statusLabel: 'Under Review by Headquarters',
          badgeClass: 'bg-info-subtle text-info-emphasis border border-info-subtle',
          nextAction: role === 'hq'
            ? (hasSheet ? 'Mark for Payment' : 'Upload External Approval Sheet')
            : 'Under Review – No action required from applicant',
          authority: 'HQ Reviewing Officer',
          actionRequired: role === 'hq'
        };
      }

      if (st === STAGES.STAGE_4B) {
        return {
          statusLabel: 'Pending HQ Decision',
          badgeClass: 'bg-primary text-white',
          nextAction: role === 'hq' ? (hasSheet ? 'Mark for Payment / Return / Reject' : 'Upload External Approval Sheet & Mark for Payment') : 'Awaiting HQ Decision',
          authority: 'HQ Decision Officer',
          actionRequired: role === 'hq'
        };
      }

      if (st === STAGES.STAGE_9 || st === STAGES.STAGE_10) {
        return {
          statusLabel: 'Payment Completed',
          badgeClass: 'bg-success-subtle text-success border border-success-subtle',
          nextAction: role === 'hq' ? 'Perform Final Verification & Issue Approval Letter' : 'Awaiting HQ Final Verification',
          authority: 'HQ Final Verification',
          actionRequired: role === 'hq'
        };
      }

      if (st === STAGES.STAGE_11) {
        return {
          statusLabel: 'Payment Completed',
          badgeClass: 'bg-success-subtle text-success border border-success-subtle',
          nextAction: role === 'dto' ? 'Perform Final Verification & Issue Approval Letter' : 'Awaiting DTO Final Verification',
          authority: `DTO (${app.district})`,
          actionRequired: role === 'dto'
        };
      }

      return { statusLabel: status || 'Submitted', badgeClass: 'bg-secondary text-white', nextAction: st || 'Under Review', authority: 'Department', actionRequired: false };
    },

    generateCsv: function (reportData) {
      const records = reportData.records || [];
      const headers = ['Application ID', 'Applicant Name', 'Phone', 'Email', 'District', 'Category', 'Approval Level', 'Subject', 'Submission Date', 'Current Status', 'Processing Stage', 'Permission Number'];
      const escapeCsv = (s) => '"' + String(s === null || s === undefined ? '' : s).replace(/"/g, '""') + '"';
      const rows = [headers.map(escapeCsv).join(',')];
      records.forEach(a => {
        rows.push([
          escapeCsv(a.refNo), escapeCsv(a.applicantName), escapeCsv(a.phone), escapeCsv(a.email),
          escapeCsv(a.district), escapeCsv(a.category), escapeCsv(a.requiresHqVerification ? 'HQ' : 'DTO'),
          escapeCsv(a.activityTitle), escapeCsv(a.submissionDate), escapeCsv(a.status),
          escapeCsv(a.currentStage), escapeCsv(a.permissionNumber || 'N/A')
        ].join(','));
      });
      return rows.join('\r\n');
    }
  };

  window.WorkflowEngine = WorkflowEngine;

})(window);
