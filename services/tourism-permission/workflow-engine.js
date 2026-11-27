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
  const CURRENT_SEED_VERSION = 'v9_final_scope_2026';
  const SUBMITTED_STORAGE_KEY = 'tourism_permission_submitted';
  const LO_STORAGE_KEY = 'tourism_permission_lo_directory';

  const STATUSES = {
    SUBMITTED: 'Submitted',
    PAYMENT_PENDING: 'Payment Pending',
    RETURNED: 'Returned for Correction',
    REJECTED: 'Rejected',
    APPROVED: 'Approved'
  };

  const STAGES = {
    STAGE_1: 'Application Submitted',
    STAGE_2: 'Awaiting TO Verification',
    STAGE_3: 'Awaiting DTO Review',
    STAGE_4: 'Awaiting HQ Officer Review',
    STAGE_5: 'Returned by HQ to DTO',
    STAGE_5B: 'Returned by DTO to TO',
    STAGE_6: 'Awaiting Citizen Correction',
    STAGE_7: 'Awaiting TO Reverification',
    STAGE_8: 'Payment Activated – Awaiting Citizen Payment',
    STAGE_9: 'Payment Received – Awaiting HQ Final Approval',
    STAGE_10: 'Approval Sheet Uploaded',
    STAGE_11: 'Payment Received – Awaiting DTO Final Approval',
    STAGE_12: 'Approved – Permission Letter Issued',
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
      validityDays: 7,
      validityLabel: '1 Week (7 Days)',
      extensionAllowed: true,
      maxExtensionDays: 7,
      extensionLabel: 'Up to 1 additional week (DTO Decision)'
    },
    'trekking': {
      key: 'trekking',
      name: 'Trekking',
      approvalLevel: 'DTO',
      feePerPerson: 100,
      feeLabel: '₹100 / person',
      validityDays: 10,
      validityLabel: '10 Days',
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
      { id: 'fire_noc', name: 'Fire NOC', mandatory: true, note: 'Mandatory for Event / Mela / Fair / Rallies / Marathons' },
      { id: 'police_noc', name: 'Police NOC', mandatory: true, note: 'Mandatory for Event / Mela / Fair / Rallies / Marathons' },
      { id: 'panchayat_noc', name: 'Councillor / Panchayat NOC', mandatory: true, note: 'Mandatory local body clearance' }
    ],
    'satellite-phone': [
      { id: 'imf_rec', name: 'Letter of Recommendation issued by IMF', mandatory: true, note: 'Only required supporting document for Satellite Phone Permission' }
    ],
    'trekking': [
      { id: 'passport', name: 'Passport', mandatory: true, note: 'Required for trekking participants' },
      { id: 'visa', name: 'Visa (where applicable)', mandatory: false, conditionalOnForeigner: true, note: 'Mandatory for foreign nationals' },
      { id: 'med_insurance', name: 'Medical Insurance', mandatory: true, note: 'Required trekking medical insurance' },
      { id: 'trekker_photos', name: 'Photograph of Each Trekker', mandatory: true, note: 'Individual participant photographs for certificate' },
      { id: 'operator_photo', name: 'Tour Operator Photograph', mandatory: true, note: 'Displayed on generated Trekking Certificate' },
      { id: 'medical_fitness', name: 'Medical Fitness', mandatory: false, optionalChecklist: true, note: 'Optional checklist document' },
      { id: 'insurance_opt', name: 'Insurance (Additional)', mandatory: false, optionalChecklist: true, note: 'Optional checklist document' },
      { id: 'guide_details', name: 'Guide Details', mandatory: false, optionalChecklist: true, note: 'Optional checklist document' },
      { id: 'clients_sheets', name: 'Clients Sheets', mandatory: false, optionalChecklist: true, note: 'Optional checklist document' }
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
  const SEED_APPLICATIONS = [
    // 1. Drone Permission – Newly submitted, Awaiting TO Verification (HQ Workflow)
    {
      refNo: 'SK-TP-2026-APP-00621',
      flowType: 'flow_a',
      flowTitle: 'HQ-Level Approval (Drone Permission)',
      category: 'Drone Permission',
      categoryKey: 'drone',
      district: 'Gangtok',
      dtoOffice: DISTRICT_OFFICES['Gangtok'].office,
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_2,
      currentStageNum: 2,
      assignedRole: 'to',
      applicantName: 'Sonam Tobgay Bhutia',
      organizationName: 'Himalaya Aerial Films Pvt. Ltd.',
      phone: '9800778899',
      email: 'sonam.bhutia.drone@himalayafilms.in',
      address: 'Deorali Bazar, Near Ropeway Station, Gangtok – 737102',
      activityTitle: 'Aerial Cinematography of Tsomgo Lake Corridor',
      activityDescription: 'Commercial documentary aerial filming using DJI Inspire 3 (UIN registered) strictly outside restricted defence perimeters.',
      droneDetails: {
        purpose: 'Tourism Promotional Documentary Filming',
        location: 'Tsomgo Lake Outer Viewing Deck',
        district: 'Gangtok',
        latitude: '27.3742° N',
        longitude: '88.7619° E',
        makeModel: 'DJI Inspire 3',
        categoryWeight: 'Small Category (3.99 kg)',
        uin: 'UA-0026-INSP3-9921',
        remotePilotName: 'Sonam Tobgay Bhutia',
        remotePilotCertNo: 'RPC-DGCA-2025-4410',
        approvedPeriod: '',
        permissibleAltitudeAgl: '',
        approvedFlyingArea: ''
      },
      validityDays: 15,
      validityLabel: '15 Days',
      extensionAllowed: true,
      maxExtensionDays: 15,
      participantCount: 1,
      fee: 'Free',
      feeAmount: 0,
      paymentActivated: false,
      isPaid: false,
      paymentStatus: 'NOT_ACTIVATED',
      submissionDate: '18 Nov 2026, 09:30 AM',
      lastUpdated: '18 Nov 2026, 09:30 AM',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_621_1', name: 'Drone UIN & Remote Pilot Certificate', fileName: 'DGCA_UIN_RPC_Inspire3.pdf', size: '1.2 MB', date: '18 Nov 2026' },
        { id: 'doc_621_2', name: 'Flight Area Map & Coordinates Sheet', fileName: 'Tsomgo_Coordinates_Map.pdf', size: '2.4 MB', date: '18 Nov 2026' }
      ],
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Sonam Tobgay Bhutia',
          office: 'Applicant Portal',
          date: '18 Nov 2026, 09:30 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Drone Permission dossier submitted online for initial TO verification.'
        }
      ]
    },

    // 2. Expedition Permission – Awaiting TO Verification (HQ Workflow, Fee = 5 * 100 = ₹500)
    {
      refNo: 'SK-TP-2026-APP-00890',
      flowType: 'flow_a',
      flowTitle: 'HQ-Level Approval (Expedition Permission)',
      category: 'Expedition Permission',
      categoryKey: 'expedition',
      district: 'Gyalshing',
      dtoOffice: DISTRICT_OFFICES['Gyalshing'].office,
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_2,
      currentStageNum: 2,
      assignedRole: 'to',
      applicantName: 'Nima Dorjee Sherpa',
      organizationName: 'Khangchendzonga Alpine Expeditions',
      phone: '9832445566',
      email: 'nima.sherpa@alpine-sikkim.in',
      address: 'Yuksom Bazar, Gyalshing, West Sikkim – 737113',
      activityTitle: 'Mt. Tinchenkhang (6,010 m) Alpine Expedition',
      activityDescription: 'High-altitude mountaineering expedition to Mt. Tinchenkhang with 5 certified climbers and Liaison Officer Roshni Subba.',
      expeditionDetails: {
        peakName: 'Mt. Tinchenkhang (6,010 m)',
        requestedDurationValue: '21',
        requestedDurationUnit: 'Days',
        requestedDurationText: '21 Days',
        participantCount: 5
      },
      liaisonOfficer: 'Roshni Subba',
      participantCount: 5,
      fee: '₹500',
      feeAmount: 500,
      paymentActivated: false,
      isPaid: false,
      paymentStatus: 'NOT_ACTIVATED',
      extensionAllowed: false,
      submissionDate: '19 Nov 2026, 10:15 AM',
      lastUpdated: '19 Nov 2026, 10:15 AM',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_890_1', name: 'Expedition Route Plan & Peak Clearance Dossier', fileName: 'Tinchenkhang_Expedition_Plan.pdf', size: '2.1 MB', date: '19 Nov 2026' },
        { id: 'doc_890_2', name: 'Medical Fitness (Optional)', fileName: 'Climbers_Medical_Optional.pdf', size: '950 KB', date: '19 Nov 2026' }
      ],
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Nima Dorjee Sherpa',
          office: 'Applicant Portal',
          date: '19 Nov 2026, 10:15 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Expedition Permission submitted for 5 participants (21 Days requested).'
        }
      ]
    },

    // 3. Trekking Permission – Awaiting DTO Review (DTO Workflow, 4 trekkers = ₹400)
    {
      refNo: 'SK-TP-2026-APP-00481',
      flowType: 'flow_b',
      flowTitle: 'DTO-Level Approval (Trekking)',
      category: 'Trekking',
      categoryKey: 'trekking',
      district: 'Gangtok',
      dtoOffice: DISTRICT_OFFICES['Gangtok'].office,
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_3,
      currentStageNum: 3,
      assignedRole: 'dto',
      applicantName: 'Tenzing Norbu Lepcha',
      organizationName: 'Singalila Eco Treks',
      phone: '9800123456',
      email: 'tenzing.lepcha@example.in',
      address: 'Near Ridge Park, Below Raj Bhawan, Gangtok – 737101',
      activityTitle: 'Singalila Ridge Scenic Eco-Trek (4 Participants)',
      activityDescription: '6-day eco-trekking route along Singalila Ridge with 4 Indian trekkers and 3 certified porters.',
      trekkingDetails: {
        participantCount: 4,
        composition: 'Indians only',
        porterCount: 3,
        validityDays: 10,
        operatorPhotoName: 'Operator_Tenzing.jpg',
        trekkerPhotos: [
          { name: 'Trekker 1 – Tenzing Norbu', fileName: 'trekker_1.jpg' },
          { name: 'Trekker 2 – Pema Bhutia', fileName: 'trekker_2.jpg' },
          { name: 'Trekker 3 – Karma Wangdi', fileName: 'trekker_3.jpg' },
          { name: 'Trekker 4 – Doma Lepcha', fileName: 'trekker_4.jpg' }
        ]
      },
      participantCount: 4,
      fee: '₹400',
      feeAmount: 400,
      paymentActivated: false,
      isPaid: false,
      paymentStatus: 'NOT_ACTIVATED',
      validityDays: 10,
      validityLabel: '10 Days',
      extensionAllowed: false,
      submissionDate: '17 Nov 2026, 11:00 AM',
      lastUpdated: '18 Nov 2026, 02:20 PM',
      requiresHqVerification: false,
      documents: [
        { id: 'doc_481_1', name: 'Passport / Government IDs', fileName: 'Trekker_Passports_IDs.pdf', size: '1.8 MB', date: '17 Nov 2026' },
        { id: 'doc_481_2', name: 'Medical Insurance', fileName: 'Trek_Medical_Insurance.pdf', size: '820 KB', date: '17 Nov 2026' },
        { id: 'doc_481_3', name: 'Photograph of Each Trekker & Operator', fileName: 'Trekker_Operator_Photos.zip', size: '2.4 MB', date: '17 Nov 2026' }
      ],
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Tenzing Norbu Lepcha',
          office: 'Applicant Portal',
          date: '17 Nov 2026, 11:00 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Trekking application submitted for 4 Indian participants and 3 porters.'
        },
        {
          action: 'Verified & Forwarded to DTO',
          role: 'Tourism Officer (TO)',
          officer: 'Phurba Tshering Bhutia',
          office: DISTRICT_OFFICES['Gangtok'].office,
          date: '18 Nov 2026, 02:20 PM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_3,
          remarks: 'Participant cap (<=10), minimum porters (>=2), and trekking documents verified. Forwarded to DTO.'
        }
      ]
    },

    // 4. Drone Permission – Awaiting HQ Officer Initial Review (HQ Workflow, TO already updated AGL & Area)
    {
      refNo: 'SK-TP-2026-APP-00622',
      flowType: 'flow_a',
      flowTitle: 'HQ-Level Approval (Drone Permission)',
      category: 'Drone Permission',
      categoryKey: 'drone',
      district: 'Pakyong',
      dtoOffice: DISTRICT_OFFICES['Pakyong'].office,
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_4,
      currentStageNum: 4,
      assignedRole: 'hq',
      hqOfficerName: HQ_OFFICER.name,
      applicantName: 'Rajeshwari Tamang',
      organizationName: 'Sikkim GeoSurvey Drones',
      phone: '9733112200',
      email: 'rajeshwari@sikkimgeosurvey.in',
      address: 'Pakyong Bazar, East Sikkim – 737106',
      activityTitle: 'Tea Garden Ecological Aerial Mapping – Temi & Pakyong',
      activityDescription: 'Non-invasive multispectral drone survey for agricultural tourism brochure.',
      droneDetails: {
        purpose: 'Agricultural & Eco-Tourism Mapping',
        location: 'Pakyong Valley Ridge',
        district: 'Pakyong',
        latitude: '27.2435° N',
        longitude: '88.5912° E',
        makeModel: 'DJI Mavic 3 Enterprise',
        categoryWeight: 'Small Category (915 g)',
        uin: 'UA-0026-MV3E-1140',
        remotePilotName: 'Rajeshwari Tamang',
        remotePilotCertNo: 'RPC-DGCA-2024-8821',
        approvedPeriod: '01 Dec 2026 to 15 Dec 2026 (15 Days)',
        permissibleAltitudeAgl: '120 meters (393 ft) AGL',
        approvedFlyingArea: 'Pakyong Valley Sector B (2 km radius)'
      },
      validityDays: 15,
      validityLabel: '15 Days',
      extensionAllowed: true,
      maxExtensionDays: 15,
      fee: 'Free',
      feeAmount: 0,
      paymentActivated: false,
      isPaid: false,
      paymentStatus: 'NOT_ACTIVATED',
      submissionDate: '16 Nov 2026, 09:00 AM',
      lastUpdated: '18 Nov 2026, 04:00 PM',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_622_1', name: 'Drone UIN & Remote Pilot Certificate', fileName: 'Mavic3E_UIN_RPC.pdf', size: '1.1 MB', date: '16 Nov 2026' },
        { id: 'doc_622_2', name: 'Flight Area Map & Coordinates Sheet', fileName: 'Pakyong_Flight_Zone.pdf', size: '1.9 MB', date: '16 Nov 2026' }
      ],
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Rajeshwari Tamang',
          office: 'Applicant Portal',
          date: '16 Nov 2026, 09:00 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Submitted online.'
        },
        {
          action: 'TO Updated Drone Parameters & Forwarded to DTO',
          role: 'Tourism Officer (TO)',
          officer: 'Prakash Gurung',
          office: DISTRICT_OFFICES['Pakyong'].office,
          date: '17 Nov 2026, 11:30 AM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_3,
          remarks: 'Updated Approved Period, Permissible Altitude (120m AGL), and Flying Area.'
        },
        {
          action: 'Forwarded to HQ Officer',
          role: 'District Tourism Officer (DTO)',
          officer: 'Bikash Tamang',
          office: DISTRICT_OFFICES['Pakyong'].office,
          date: '18 Nov 2026, 04:00 PM',
          previousStage: STAGES.STAGE_3,
          newStage: STAGES.STAGE_4,
          remarks: 'District review completed; forwarded to HQ Officer for payment approval.'
        }
      ]
    },

    // 5. Expedition Permission – Payment Received, Returned to Same HQ Officer for Approval Sheet & Final Approval
    {
      refNo: 'SK-TP-2026-APP-00914',
      flowType: 'flow_a',
      flowTitle: 'HQ-Level Approval (Expedition Permission)',
      category: 'Expedition Permission',
      categoryKey: 'expedition',
      district: 'Namchi',
      dtoOffice: DISTRICT_OFFICES['Namchi'].office,
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_9,
      currentStageNum: 9,
      assignedRole: 'hq',
      hqOfficerName: HQ_OFFICER.name,
      applicantName: 'Bikramjit Singh',
      organizationName: 'Eastern Himalaya Mountaineers',
      phone: '9832776655',
      email: 'bikram@ehmountaineers.org',
      address: 'Central Park Road, Namchi, South Sikkim – 737126',
      activityTitle: 'Mt. Frey (5,830 m) Technical Climbing Expedition',
      activityDescription: 'Technical alpine climb of Mt. Frey with 6 experienced climbers.',
      expeditionDetails: {
        peakName: 'Mt. Frey (5,830 m)',
        requestedDurationValue: '1',
        requestedDurationUnit: 'Months',
        requestedDurationText: '1 Month',
        participantCount: 6
      },
      liaisonOfficer: 'Tashi Namgyal Bhutia',
      participantCount: 6,
      fee: '₹600',
      feeAmount: 600,
      paymentActivated: true,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-91401',
      extensionAllowed: false,
      submissionDate: '12 Nov 2026, 10:00 AM',
      lastUpdated: '19 Nov 2026, 11:00 AM',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_914_1', name: 'Expedition Route Plan & Peak Clearance Dossier', fileName: 'Mt_Frey_Plan.pdf', size: '2.5 MB', date: '12 Nov 2026' }
      ],
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Bikramjit Singh',
          office: 'Applicant Portal',
          date: '12 Nov 2026, 10:00 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Submitted for 6 participants (1 Month).'
        },
        {
          action: 'Verified & Forwarded to DTO',
          role: 'Tourism Officer (TO)',
          officer: 'Suman Rai',
          office: DISTRICT_OFFICES['Namchi'].office,
          date: '13 Nov 2026, 03:00 PM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_3,
          remarks: 'Verified.'
        },
        {
          action: 'Forwarded to HQ Officer',
          role: 'District Tourism Officer (DTO)',
          officer: 'Pema Wangchuk Sherpa',
          office: DISTRICT_OFFICES['Namchi'].office,
          date: '14 Nov 2026, 12:00 PM',
          previousStage: STAGES.STAGE_3,
          newStage: STAGES.STAGE_4,
          remarks: 'Forwarded to HQ.'
        },
        {
          action: 'HQ Approved for Payment (Payment Activated)',
          role: 'HQ Officer',
          officer: HQ_OFFICER.name,
          office: HQ_OFFICER.office,
          date: '16 Nov 2026, 04:00 PM',
          previousStage: STAGES.STAGE_4,
          newStage: STAGES.STAGE_8,
          remarks: 'Cleared at HQ; statutory fee ₹600 activated for citizen payment.'
        },
        {
          action: 'Citizen Payment Completed',
          role: 'Citizen',
          officer: 'Bikramjit Singh',
          office: 'Applicant Portal',
          date: '19 Nov 2026, 11:00 AM',
          previousStage: STAGES.STAGE_8,
          newStage: STAGES.STAGE_9,
          remarks: 'Payment of ₹600 completed (Ref: TXN-SK-2026-91401). Automatically routed back to same HQ Officer for Approval Sheet upload & final approval.'
        }
      ]
    },

    // 6. Rally Permission – Payment Activated (Awaiting Citizen Payment - DTO Level)
    {
      refNo: 'SK-TP-2026-APP-00710',
      flowType: 'flow_b',
      flowTitle: 'DTO-Level Approval (Event / Mela / Fair / Rallies / Marathons)',
      category: 'Event / Mela / Fair / Rallies / Marathons',
      categoryKey: 'events-fairs',
      district: 'Gangtok',
      dtoOffice: DISTRICT_OFFICES['Gangtok'].office,
      status: STATUSES.PAYMENT_PENDING,
      currentStage: STAGES.STAGE_8,
      currentStageNum: 8,
      assignedRole: 'citizen',
      returnToAfterPayment: 'dto',
      applicantName: 'Karma Tshering Lepcha',
      organizationName: 'Sikkim Youth Heritage Club',
      phone: '9812345678',
      email: 'karma.lepcha@sikkimheritage.org',
      address: 'Development Area, Gangtok – 737101',
      activityTitle: 'Sikkim Clean Mountain Awareness Cycle Rally',
      activityDescription: 'Peaceful bicycle awareness rally from M.G. Marg to Tadong with 80 cyclists.',
      validityDays: 7,
      validityLabel: '1 Week (7 Days)',
      extensionAllowed: true,
      maxExtensionDays: 7,
      fee: 'Free',
      feeAmount: 0,
      paymentActivated: true,
      isPaid: false,
      paymentStatus: 'PENDING',
      submissionDate: '15 Nov 2026, 11:15 AM',
      lastUpdated: '18 Nov 2026, 03:30 PM',
      requiresHqVerification: false,
      documents: [
        { id: 'doc_710_1', name: 'Police NOC', fileName: 'Traffic_Police_Rally_NOC.pdf', size: '1.1 MB', date: '15 Nov 2026' },
        { id: 'doc_710_2', name: 'Councillor / Panchayat NOC', fileName: 'GMC_Councillor_NOC.pdf', size: '780 KB', date: '15 Nov 2026' }
      ],
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Karma Tshering Lepcha',
          office: 'Applicant Portal',
          date: '15 Nov 2026, 11:15 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Rally Permission submitted with Police NOC and Councillor NOC (Fire NOC not required for Rally).'
        },
        {
          action: 'Verified & Forwarded to DTO',
          role: 'Tourism Officer (TO)',
          officer: 'Phurba Tshering Bhutia',
          office: DISTRICT_OFFICES['Gangtok'].office,
          date: '16 Nov 2026, 01:00 PM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_3,
          remarks: 'Documents verified.'
        },
        {
          action: 'DTO Activated Payment / Clearance',
          role: 'District Tourism Officer (DTO)',
          officer: 'Karma Lhendup Bhutia',
          office: DISTRICT_OFFICES['Gangtok'].office,
          date: '18 Nov 2026, 03:30 PM',
          previousStage: STAGES.STAGE_3,
          newStage: STAGES.STAGE_8,
          remarks: 'Initial DTO review approved; payment/fee step activated for citizen confirmation.'
        }
      ]
    },

    // 7. Satellite Phone Permission – Payment Received, Awaiting DTO Final Approval
    {
      refNo: 'SK-TP-2026-APP-00560',
      flowType: 'flow_b',
      flowTitle: 'DTO-Level Approval (Satellite Phone Permission)',
      category: 'Satellite Phone Permission',
      categoryKey: 'satellite-phone',
      district: 'Mangan',
      dtoOffice: DISTRICT_OFFICES['Mangan'].office,
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_11,
      currentStageNum: 11,
      assignedRole: 'dto',
      applicantName: 'Dr. Ananya Sharma',
      organizationName: 'Himalayan Glaciology Research Team',
      phone: '9832009988',
      email: 'ananya.sharma@glaciology.edu.in',
      address: 'Lachen Valley Camp, Mangan District – 737120',
      activityTitle: 'Iridium Satellite Phone Usage for High-Altitude Field Survey',
      activityDescription: 'Emergency satellite communication permit for 6-member research expedition in Lachen/Gurudongmar sector.',
      extensionAllowed: false,
      fee: 'Free',
      feeAmount: 0,
      paymentActivated: true,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-56001',
      submissionDate: '14 Nov 2026, 02:00 PM',
      lastUpdated: '19 Nov 2026, 09:45 AM',
      requiresHqVerification: false,
      documents: [
        { id: 'doc_560_1', name: 'Letter of Recommendation issued by IMF', fileName: 'IMF_Recommendation_Letter_2026.pdf', size: '1.0 MB', date: '14 Nov 2026' }
      ],
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Dr. Ananya Sharma',
          office: 'Applicant Portal',
          date: '14 Nov 2026, 02:00 PM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Submitted with IMF Letter of Recommendation.'
        },
        {
          action: 'Verified & Forwarded to DTO',
          role: 'Tourism Officer (TO)',
          officer: 'Ongden Lepcha',
          office: DISTRICT_OFFICES['Mangan'].office,
          date: '15 Nov 2026, 11:00 AM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_3,
          remarks: 'IMF Recommendation Letter verified.'
        },
        {
          action: 'DTO Activated Payment / Clearance',
          role: 'District Tourism Officer (DTO)',
          officer: 'Tenzing Dadul Lepcha',
          office: DISTRICT_OFFICES['Mangan'].office,
          date: '17 Nov 2026, 02:00 PM',
          previousStage: STAGES.STAGE_3,
          newStage: STAGES.STAGE_8,
          remarks: 'Approved for payment activation.'
        },
        {
          action: 'Citizen Payment / Clearance Confirmed',
          role: 'Citizen',
          officer: 'Dr. Ananya Sharma',
          office: 'Applicant Portal',
          date: '19 Nov 2026, 09:45 AM',
          previousStage: STAGES.STAGE_8,
          newStage: STAGES.STAGE_11,
          remarks: 'Returned to Mangan DTO for final approval and certificate issuance.'
        }
      ]
    },

    // 8. Event Permission – Returned to Citizen for Correction (Scenario D)
    {
      refNo: 'SK-TP-2026-APP-00329',
      flowType: 'flow_b',
      flowTitle: 'DTO-Level Approval (Event / Mela / Fair / Rallies / Marathons)',
      category: 'Event / Mela / Fair / Rallies / Marathons',
      categoryKey: 'events-fairs',
      district: 'Namchi',
      dtoOffice: DISTRICT_OFFICES['Namchi'].office,
      status: STATUSES.RETURNED,
      currentStage: STAGES.STAGE_6,
      currentStageNum: 6,
      assignedRole: 'citizen',
      applicantName: 'Pema Choden Tamang',
      organizationName: 'South Sikkim Cultural Society',
      phone: '9733445566',
      email: 'pema.cultural@namchi.in',
      address: 'Bhanjyang Road, Namchi – 737126',
      activityTitle: 'Namchi Winter Folk & Music Event 2026',
      activityDescription: '3-day evening cultural music event at Namchi Central Park.',
      validityDays: 7,
      validityLabel: '1 Week (7 Days)',
      extensionAllowed: true,
      maxExtensionDays: 7,
      fee: 'Free',
      feeAmount: 0,
      paymentActivated: false,
      isPaid: false,
      paymentStatus: 'NOT_ACTIVATED',
      toRemarks: 'Attached Fire NOC has expired. Please upload a valid Fire NOC issued for Nov/Dec 2026.',
      dtoRemarks: null,
      submissionDate: '10 Nov 2026, 01:20 PM',
      lastUpdated: '12 Nov 2026, 04:10 PM',
      requiresHqVerification: false,
      documents: [
        { id: 'doc_329_1', name: 'Fire NOC', fileName: 'Expired_Fire_NOC.pdf', size: '650 KB', date: '10 Nov 2026' },
        { id: 'doc_329_2', name: 'Police NOC', fileName: 'Namchi_Police_NOC.pdf', size: '920 KB', date: '10 Nov 2026' },
        { id: 'doc_329_3', name: 'Councillor / Panchayat NOC', fileName: 'Namchi_MC_NOC.pdf', size: '540 KB', date: '10 Nov 2026' }
      ],
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Pema Choden Tamang',
          office: 'Applicant Portal',
          date: '10 Nov 2026, 01:20 PM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Submitted Event application.'
        },
        {
          action: 'Returned to Citizen for Clarification',
          role: 'Tourism Officer (TO)',
          officer: 'Suman Rai',
          office: DISTRICT_OFFICES['Namchi'].office,
          date: '12 Nov 2026, 04:10 PM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_6,
          remarks: 'Attached Fire NOC has expired. Please upload a valid Fire NOC issued for Nov/Dec 2026.'
        }
      ]
    },

    // 9. Approved Drone Permission WITH Pending Extension Request (for DTO Decision)
    {
      refNo: 'SK-TP-2026-APP-00215',
      flowType: 'flow_a',
      flowTitle: 'HQ-Level Approval (Drone Permission)',
      category: 'Drone Permission',
      categoryKey: 'drone',
      district: 'Gangtok',
      dtoOffice: DISTRICT_OFFICES['Gangtok'].office,
      status: STATUSES.APPROVED,
      currentStage: STAGES.STAGE_12,
      currentStageNum: 12,
      assignedRole: 'none',
      applicantName: 'Passang Doma Bhutia',
      organizationName: 'Sikkim Heritage Lens',
      phone: '9832109876',
      email: 'passang.doma@sikkim.org',
      address: 'Below Enchey Monastery, Gangtok – 737101',
      activityTitle: 'Enchey & Tashi View Point Heritage Drone Shoot',
      activityDescription: 'Aerial documentation of monastery architecture and Kanchenjunga sunrise viewpoints.',
      droneDetails: {
        purpose: 'Heritage Architecture Aerial Documentation',
        location: 'Enchey & Tashi View Point',
        district: 'Gangtok',
        latitude: '27.3358° N',
        longitude: '88.6194° E',
        makeModel: 'DJI Air 3',
        categoryWeight: 'Micro Category (720 g)',
        uin: 'UA-0026-AIR3-5501',
        remotePilotName: 'Passang Doma Bhutia',
        remotePilotCertNo: 'RPC-DGCA-2025-1102',
        approvedPeriod: '10 Nov 2026 to 24 Nov 2026 (15 Days)',
        permissibleAltitudeAgl: '100 meters (328 ft) AGL',
        approvedFlyingArea: 'Tashi View Point & Enchey Outer Corridor (1.5 km)'
      },
      validityDays: 15,
      validityLabel: '15 Days (10 Nov 2026 – 24 Nov 2026)',
      extensionAllowed: true,
      maxExtensionDays: 15,
      extensionRequest: {
        requested: true,
        status: 'Pending DTO Decision',
        requestedDays: 10,
        reason: 'Heavy morning fog delayed aerial shooting by 8 days; requesting 10-day extension.',
        requestedDate: '22 Nov 2026, 10:15 AM',
        decidedBy: null,
        decisionDate: null,
        decisionRemarks: null,
        revisedValidUntil: null
      },
      fee: 'Free',
      feeAmount: 0,
      paymentActivated: true,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-21501',
      permissionNumber: 'SK-TOUR-2026-DRO-00215',
      certRef: 'SK-TOUR-2026-DRO-00215',
      approvalDate: '09 Nov 2026',
      approvingOfficer: HQ_OFFICER.name,
      approvingDesignation: HQ_OFFICER.designation,
      approvingOffice: HQ_OFFICER.office,
      approvalSheet: {
        sheetNo: 'HQ/APP-SHEET/2026/00215',
        fileName: 'HQ_Approval_Sheet_00215.pdf',
        size: '1.4 MB',
        uploadDate: '09 Nov 2026',
        uploadedBy: HQ_OFFICER.name,
        designation: HQ_OFFICER.designation,
        office: HQ_OFFICER.office,
        eOfficeNumber: 'EOF-2026-SK-TOUR-0215',
        concurrenceRemarks: 'Airspace clearance and security conditions verified at HQ.'
      },
      submissionDate: '01 Nov 2026, 09:00 AM',
      lastUpdated: '22 Nov 2026, 10:15 AM',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_215_1', name: 'Drone UIN & Remote Pilot Certificate', fileName: 'Air3_UIN_RPC.pdf', size: '1.1 MB', date: '01 Nov 2026' }
      ],
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Passang Doma Bhutia',
          office: 'Applicant Portal',
          date: '01 Nov 2026, 09:00 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Submitted online.'
        },
        {
          action: 'HQ Final Approval & Permission Letter Issued',
          role: 'HQ Officer',
          officer: HQ_OFFICER.name,
          office: HQ_OFFICER.office,
          date: '09 Nov 2026, 03:30 PM',
          previousStage: STAGES.STAGE_9,
          newStage: STAGES.STAGE_12,
          remarks: 'Approval Sheet uploaded and final Approval Letter SK-TOUR-2026-DRO-00215 issued.'
        },
        {
          action: 'Extension Requested (10 Days)',
          role: 'Citizen',
          officer: 'Passang Doma Bhutia',
          office: 'Applicant Portal',
          date: '22 Nov 2026, 10:15 AM',
          previousStage: STAGES.STAGE_12,
          newStage: STAGES.STAGE_12,
          remarks: 'Requested 10-day extension routed to Gangtok DTO: Heavy morning fog delayed aerial shooting.'
        }
      ]
    },

    // 10. Approved Trekking Permission (DTO Level, No Approval Sheet, 3 Trekker Photos + Operator Photo)
    {
      refNo: 'SK-TP-2026-APP-00484',
      flowType: 'flow_b',
      flowTitle: 'DTO-Level Approval (Trekking)',
      category: 'Trekking',
      categoryKey: 'trekking',
      district: 'Gyalshing',
      dtoOffice: DISTRICT_OFFICES['Gyalshing'].office,
      status: STATUSES.APPROVED,
      currentStage: STAGES.STAGE_12,
      currentStageNum: 12,
      assignedRole: 'none',
      applicantName: 'Chewang Dorjee Bhutia',
      organizationName: 'West Sikkim Alpine Treks',
      phone: '9832556677',
      email: 'chewang@westsikkimtreks.in',
      address: 'Pelling Upper Bazar, Gyalshing – 737113',
      activityTitle: 'Dzongri – Goecha La Heritage Trek (3 Participants)',
      activityDescription: 'Approved 10-day trekking permit along Dzongri-Goecha La route with 3 foreign/Indian trekkers and 2 porters.',
      trekkingDetails: {
        participantCount: 3,
        composition: 'Both foreigners and Indians',
        porterCount: 2,
        validityDays: 10,
        operatorPhotoName: 'Operator_Chewang.jpg',
        trekkerPhotos: [
          { name: 'Trekker 1 – Elena Vance (UK)', fileName: 'elena_vance.jpg' },
          { name: 'Trekker 2 – Marcus Thorne (UK)', fileName: 'marcus_thorne.jpg' },
          { name: 'Trekker 3 – Aarav Mehta (India)', fileName: 'aarav_mehta.jpg' }
        ]
      },
      participantCount: 3,
      fee: '₹300',
      feeAmount: 300,
      paymentActivated: true,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-48401',
      validityDays: 10,
      validityLabel: '10 Days (15 Nov 2026 – 24 Nov 2026)',
      extensionAllowed: false,
      permissionNumber: 'SK-TOUR-2026-TRE-00484',
      certRef: 'SK-TOUR-2026-TRE-00484',
      approvalDate: '14 Nov 2026',
      approvingOfficer: DISTRICT_OFFICES['Gyalshing'].dtoName,
      approvingDesignation: 'District Tourism Officer (DTO)',
      approvingOffice: DISTRICT_OFFICES['Gyalshing'].office,
      approvalSheet: null,
      submissionDate: '08 Nov 2026, 11:00 AM',
      lastUpdated: '14 Nov 2026, 04:00 PM',
      requiresHqVerification: false,
      documents: [
        { id: 'doc_484_1', name: 'Passport & Visa Copies', fileName: 'Passports_Visas_Group.pdf', size: '2.1 MB', date: '08 Nov 2026' },
        { id: 'doc_484_2', name: 'Medical Insurance', fileName: 'Trek_Medical_Insurance.pdf', size: '1.1 MB', date: '08 Nov 2026' },
        { id: 'doc_484_3', name: 'Participant & Operator Photographs', fileName: 'All_Photos.zip', size: '1.9 MB', date: '08 Nov 2026' }
      ],
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Chewang Dorjee Bhutia',
          office: 'Applicant Portal',
          date: '08 Nov 2026, 11:00 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Submitted for 3 participants.'
        },
        {
          action: 'DTO Final Approval & Permission Letter Issued',
          role: 'District Tourism Officer (DTO)',
          officer: DISTRICT_OFFICES['Gyalshing'].dtoName,
          office: DISTRICT_OFFICES['Gyalshing'].office,
          date: '14 Nov 2026, 04:00 PM',
          previousStage: STAGES.STAGE_11,
          newStage: STAGES.STAGE_12,
          remarks: 'Final approval granted by Gyalshing DTO. Permission Letter SK-TOUR-2026-TRE-00484 issued.'
        }
      ]
    },

    // 11. Approved Fair Permission (DTO Level, Extension Eligible up to 1 week)
    {
      refNo: 'SK-TP-2026-APP-00636',
      flowType: 'flow_b',
      flowTitle: 'DTO-Level Approval (Event / Mela / Fair / Rallies / Marathons)',
      category: 'Event / Mela / Fair / Rallies / Marathons',
      categoryKey: 'events-fairs',
      district: 'Pakyong',
      dtoOffice: DISTRICT_OFFICES['Pakyong'].office,
      status: STATUSES.APPROVED,
      currentStage: STAGES.STAGE_12,
      currentStageNum: 12,
      assignedRole: 'none',
      applicantName: 'Dawa Gyaltsen',
      organizationName: 'Pakyong Artisans Cooperative',
      phone: '9832998877',
      email: 'dawa.pakyong@artisans.in',
      address: 'Pakyong Haat Complex, Pakyong – 737106',
      activityTitle: 'Pakyong Organic Handicrafts & Tourism Fair',
      activityDescription: '7-day regional artisan handicraft fair at Pakyong Ground.',
      validityDays: 7,
      validityLabel: '1 Week (16 Nov 2026 – 22 Nov 2026)',
      extensionAllowed: true,
      maxExtensionDays: 7,
      fee: 'Free',
      feeAmount: 0,
      paymentActivated: true,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-63601',
      permissionNumber: 'SK-TOUR-2026-FAI-00636',
      certRef: 'SK-TOUR-2026-FAI-00636',
      approvalDate: '15 Nov 2026',
      approvingOfficer: DISTRICT_OFFICES['Pakyong'].dtoName,
      approvingDesignation: 'District Tourism Officer (DTO)',
      approvingOffice: DISTRICT_OFFICES['Pakyong'].office,
      approvalSheet: null,
      submissionDate: '10 Nov 2026, 09:30 AM',
      lastUpdated: '15 Nov 2026, 03:00 PM',
      requiresHqVerification: false,
      documents: [
        { id: 'doc_636_1', name: 'Fire NOC', fileName: 'Fire_NOC_Pakyong.pdf', size: '640 KB', date: '10 Nov 2026' },
        { id: 'doc_636_2', name: 'Police NOC', fileName: 'Police_NOC_Pakyong.pdf', size: '780 KB', date: '10 Nov 2026' },
        { id: 'doc_636_3', name: 'Councillor / Panchayat NOC', fileName: 'Panchayat_NOC_Pakyong.pdf', size: '510 KB', date: '10 Nov 2026' }
      ],
      history: [
        {
          action: 'DTO Final Approval & Permission Letter Issued',
          role: 'District Tourism Officer (DTO)',
          officer: DISTRICT_OFFICES['Pakyong'].dtoName,
          office: DISTRICT_OFFICES['Pakyong'].office,
          date: '15 Nov 2026, 03:00 PM',
          previousStage: STAGES.STAGE_11,
          newStage: STAGES.STAGE_12,
          remarks: 'Fair permission SK-TOUR-2026-FAI-00636 issued for 1 week.'
        }
      ]
    },

    // 12. Rejected Drone Permission
    {
      refNo: 'SK-TP-2026-APP-00712',
      flowType: 'flow_a',
      flowTitle: 'HQ-Level Approval (Drone Permission)',
      category: 'Drone Permission',
      categoryKey: 'drone',
      district: 'Gangtok',
      dtoOffice: DISTRICT_OFFICES['Gangtok'].office,
      status: STATUSES.REJECTED,
      currentStage: STAGES.STAGE_13,
      currentStageNum: 13,
      assignedRole: 'none',
      applicantName: 'Vikramjit Das',
      organizationName: 'SkyHigh Media',
      phone: '9800443322',
      email: 'vikram@skyhigh.in',
      address: 'Tadong, Gangtok – 737102',
      activityTitle: 'Drone Aerial Filming near Restricted Border Zone',
      activityDescription: 'Proposed aerial shoot within restricted perimeter.',
      droneDetails: {
        purpose: 'Commercial Filming',
        location: 'Nathula Restricted Perimeter',
        district: 'Gangtok',
        latitude: '27.3866° N',
        longitude: '88.8309° E',
        makeModel: 'DJI Phantom 4',
        categoryWeight: 'Small Category (1.38 kg)',
        uin: 'UA-0026-PH4-7712',
        remotePilotName: 'Vikramjit Das',
        remotePilotCertNo: 'RPC-DGCA-2024-9090'
      },
      fee: 'Free',
      feeAmount: 0,
      hqRemarks: 'Proposed coordinates fall inside restricted border security Red Zone where civilian UAS operations are prohibited.',
      submissionDate: '05 Nov 2026, 10:00 AM',
      lastUpdated: '08 Nov 2026, 05:00 PM',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_712_1', name: 'Drone UIN & Remote Pilot Certificate', fileName: 'PH4_UIN.pdf', size: '1.0 MB', date: '05 Nov 2026' }
      ],
      history: [
        {
          action: 'Application Formally Rejected',
          role: 'HQ Officer',
          officer: HQ_OFFICER.name,
          office: HQ_OFFICER.office,
          date: '08 Nov 2026, 05:00 PM',
          previousStage: STAGES.STAGE_4,
          newStage: STAGES.STAGE_13,
          remarks: 'Rejected: Coordinates fall inside Red Zone prohibited airspace.'
        }
      ]
    }
  ];

  const WorkflowEngine = {
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
      } catch (e) { }
    },

    resetToSeedData: function () {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_APPLICATIONS));
        localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_SEED_VERSION);
        localStorage.removeItem(SUBMITTED_STORAGE_KEY);
        return JSON.parse(JSON.stringify(SEED_APPLICATIONS));
      } catch (e) {
        return JSON.parse(JSON.stringify(SEED_APPLICATIONS));
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

    // ==============================================================
    // DISTRICT TOURISM OFFICER (DTO) ACTIONS
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
    // SINGLE HQ OFFICER ACTIONS (Initial Review + Final Approval)
    // ==============================================================

    hqApproveForPayment: function (refNo, officerName, remarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const oldStage = app.currentStage;
      const actingOfficer = officerName || app.hqOfficerName || HQ_OFFICER.name;
      const isFreeDrone = (normalizeCategoryKey(app.categoryKey || app.category) === 'drone' || Number(app.feeAmount || 0) === 0);
      app.hqOfficerName = actingOfficer;

      if (isFreeDrone) {
        app.status = STATUSES.UNDER_HQ_REVIEW;
        app.currentStage = STAGES.STAGE_9;
        app.currentStageNum = 9;
        app.assignedRole = 'hq';
        app.paymentActivated = false;
        app.isPaid = true;
        app.paymentStatus = 'WAIVED_FREE';
        app.hqRemarks = remarks || 'Free category — payment activation not required. Ready for HQ Approval Sheet upload & final approval.';

        this.addHistoryEntry(app, {
          action: 'HQ Initial Review Approved (No Payment Required)',
          role: 'HQ Officer',
          officer: actingOfficer,
          office: HQ_OFFICER.office,
          previousStage: oldStage,
          newStage: STAGES.STAGE_9,
          remarks: app.hqRemarks
        });

        this.updateApplication(app);
        return { success: true, application: app };
      }

      app.status = STATUSES.PAYMENT_PENDING;
      app.currentStage = STAGES.STAGE_8;
      app.currentStageNum = 8;
      app.assignedRole = 'citizen';
      app.returnToAfterPayment = 'hq';
      app.paymentActivated = true;
      app.paymentStatus = 'PENDING';
      app.hqRemarks = remarks || 'Approved at HQ for payment. Statutory payment activated; application will automatically return to this HQ Officer after payment.';

      this.addHistoryEntry(app, {
        action: 'HQ Approved for Payment (Payment Activated)',
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

      app.currentStage = STAGES.STAGE_10;
      app.currentStageNum = 10;
      app.assignedRole = 'hq';

      this.addHistoryEntry(app, {
        action: 'HQ Approval Sheet Uploaded',
        role: 'HQ Officer',
        officer: actingOfficer,
        office: HQ_OFFICER.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_10,
        remarks: `Official signed Approval Sheet [${sheetName}] uploaded by HQ Officer.`
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
        const revDate = new Date(nowDate.getTime() + (app.extensionRequest.requestedDays * 24 * 60 * 60 * 1000));
        const revStr = revDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        app.extensionRequest.revisedValidUntil = revStr;
        app.validityLabel = `${app.validityLabel || ''} (+${app.extensionRequest.requestedDays} Days Extended up to ${revStr})`.trim();
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
