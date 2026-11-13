/**
 * WORKFLOW ENGINE & CENTRAL DATA REPOSITORY
 * Service: Adventure Tour Operator & Guide Registration
 * Department: Tourism & Civil Aviation Department, Government of Sikkim
 * Stage 04: Department Dashboard & Application Workflow
 * Theme: Royal Navy (data-theme="royal-navy")
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'adv_workflow_applications_v6';
  const SEED_VERSION_KEY = 'adv_workflow_version_v6';
  const CURRENT_SEED_VERSION = 'v6.0_stage06_reports';

  // 4 Primary Statuses
  const STATUSES = {
    UNDER_REVIEW: 'Under Review',
    PAYMENT_PENDING: 'Payment Pending',
    RETURNED: 'Returned for Correction',
    REJECTED: 'Rejected',
    APPROVED: 'Approved'
  };

  // 15 Authoritative Processing Stages across the 3 Workflows
  const STAGES = {
    // Shared initial
    SUBMITTED: 'Application Submitted',
    
    // Workflow 1: Adventure Tour Operator
    ATO_AWAITING_TA: 'Awaiting HQ TA Review',
    ATO_AWAITING_IO: 'Awaiting Inspecting Officer Assignment',
    ATO_UNDER_INSPECTION: 'Assigned to IO &bull; Inspection in Progress',
    ATO_REPORT_SUBMITTED: 'Inspection Report Submitted &bull; Awaiting TA Review',
    ATO_AWAITING_ASST_DIR: 'Awaiting HQ Assistant Director Review',
    ATO_AWAITING_DTO: 'Awaiting HQ DTO Review',
    ATO_PAYMENT_ACTIVATED: 'Payment Activated &bull; Awaiting Applicant Payment',
    ATO_PAYMENT_SUBMITTED: 'Payment Submitted &bull; Awaiting HQ DTO Approval',
    ATO_APPROVED: 'Approved &bull; Certificate Issued',

    // Workflow 2: Guide Registration (Gangtok / HQ)
    GR_HQ_AWAITING_TA: 'Awaiting HQ TA Review',
    GR_HQ_AWAITING_ASST_DIR: 'Awaiting HQ Assistant Director Review',
    GR_HQ_AWAITING_DTO: 'Awaiting HQ DTO Review',
    GR_HQ_PAYMENT_ACTIVATED: 'Payment Activated &bull; Awaiting Applicant Payment',
    GR_HQ_PAYMENT_SUBMITTED: 'Payment Submitted &bull; Awaiting HQ DTO Approval',
    GR_HQ_APPROVED: 'Approved &bull; Certificate Issued',

    // Workflow 3: Guide Registration (Other Districts: Mangan, Namchi, Gyalshing, Pakyong, Soreng)
    GR_DIST_AWAITING_TA: 'Awaiting District TA Review',
    GR_DIST_AWAITING_DTO: 'Awaiting District DTO Review',
    GR_DIST_PAYMENT_ACTIVATED: 'Payment Activated &bull; Awaiting Applicant Payment',
    GR_DIST_PAYMENT_SUBMITTED: 'Payment Submitted &bull; Awaiting District DTO Action',
    GR_DIST_AWAITING_HQ_ASST_DIR: 'Forwarded to HQ Assistant Director',
    GR_DIST_AWAITING_HQ_DTO: 'Awaiting HQ DTO Issuance Desk',
    GR_DIST_APPROVED: 'Approved &bull; Digital ID Card &amp; Manual Logbook Issued',

    // Universal return & rejection
    RETURNED_CORRECTION: 'Returned for Correction',
    REJECTED: 'Rejected'
  };

  // District Mapping & Officer Identities
  const DISTRICT_OFFICES = {
    'Gangtok': {
      district: 'Gangtok',
      isHQ: true,
      office: 'Paryatan Bhawan, Tadong, Gangtok – 737102',
      taName: 'Tashi Namgyal Bhutia',
      dtoName: 'Pema Dorjee Sherpa',
      phone: '03592-209090',
      email: 'dto.gangtok@sikkim.gov.in'
    },
    'Mangan': {
      district: 'Mangan',
      isHQ: false,
      office: 'DAC Complex, Mangan, North Sikkim – 737116',
      taName: 'Ongdi Tshering Lepcha',
      dtoName: 'Rinzing Ongmu Bhutia',
      phone: '03592-234205',
      email: 'dto.mangan@sikkim.gov.in'
    },
    'Namchi': {
      district: 'Namchi',
      isHQ: false,
      office: 'DAC Complex, Namchi, South Sikkim – 737126',
      taName: 'Karma Dawa Sherpa',
      dtoName: 'Pempa Tshering Bhutia',
      phone: '03595-263720',
      email: 'dto.namchi@sikkim.gov.in'
    },
    'Gyalshing': {
      district: 'Gyalshing',
      isHQ: false,
      office: 'DAC Complex, Gyalshing, West Sikkim – 737111',
      taName: 'Passang Lhamu Bhutia',
      dtoName: 'Sonam Gyatso Lepcha',
      phone: '03595-250810',
      email: 'dto.gyalshing@sikkim.gov.in'
    },
    'Pakyong': {
      district: 'Pakyong',
      isHQ: false,
      office: 'DAC Complex, Pakyong, Sikkim – 737106',
      taName: 'Kunzang Norbu',
      dtoName: 'Nim Lhamu Lepcha',
      phone: '03592-258014',
      email: 'dto.pakyong@sikkim.gov.in'
    },
    'Soreng': {
      district: 'Soreng',
      isHQ: false,
      office: 'DAC Complex, Soreng, Sikkim – 737121',
      taName: 'Dawa Tshering Bhutia',
      dtoName: 'Norden Bhutia',
      phone: '03595-257002',
      email: 'dto.soreng@sikkim.gov.in'
    }
  };

  const HQ_OFFICERS = {
    ta: {
      name: 'Tashi Namgyal Bhutia',
      designation: 'Technical Assistant (Headquarters Scrutiny)',
      office: 'Paryatan Bhawan, Tadong, Gangtok',
      phone: '03592-209090 Ext 104'
    },
    io: {
      name: 'Tashi Wangdi Lepcha',
      designation: 'Inspecting Officer (Adventure Safety & Equipment)',
      office: 'Paryatan Bhawan, Tadong, Gangtok',
      phone: '03592-209090 Ext 112'
    },
    asstDir: {
      name: 'Karma Lhamu Bhutia',
      designation: 'Assistant Director (Adventure Concurrence Desk)',
      office: 'Paryatan Bhawan, Tadong, Gangtok',
      phone: '03592-209090 Ext 201'
    },
    dto: {
      name: 'Pema Dorjee Sherpa',
      designation: 'District Tourism Officer (Headquarters Licensing Authority)',
      office: 'Paryatan Bhawan, Tadong, Gangtok',
      phone: '03592-209090 Ext 205'
    }
  };

  // ==========================================================================
  // SEED APPLICATIONS DATASET (Comprehensive: covering ALL 3 workflows & stages)
  // ==========================================================================
  const SEED_APPLICATIONS = [
    // ------------------------------------------------------------------------
    // WORKFLOW 1: ADVENTURE TOUR OPERATOR (ATO)
    // ------------------------------------------------------------------------
    {
      arn: 'SK-ATO-2026-0042',
      type: 'adventure-tour-operator',
      typeName: 'Adventure Tour Operator',
      applicantName: 'Tenzing Norbu Lepcha',
      enterpriseName: 'Khangchendzonga Adventure Trails LLP',
      district: 'Gangtok',
      submittedDate: '08 Nov 2026',
      lastUpdated: '13 Nov 2026',
      status: STATUSES.UNDER_REVIEW,
      stage: STAGES.ATO_AWAITING_TA,
      currentRole: 'ta-hq',
      assignedIO: null,
      inspectionReport: null,
      payment: {
        amount: 1500,
        activated: false,
        activatedBy: null,
        activatedDate: null,
        paid: false,
        transactionRef: null,
        paidDate: null
      },
      documents: [
        { name: 'coi_certificate_tenzing_norbu.pdf', type: 'COI / SSC Proof', size: '1.2 MB', verified: true },
        { name: 'llp_agreement_kat_2024.pdf', type: 'LLP Agreement / Deed', size: '2.4 MB', verified: true },
        { name: 'commercial_lease_deed_gangtok.pdf', type: 'Tenancy Agreement', size: '1.8 MB', verified: true },
        { name: 'gst_registration_cert_kat.pdf', type: 'GST Certificate', size: '940 KB', verified: true },
        { name: 'pan_card_kat_firm.pdf', type: 'PAN Card Attachment', size: '780 KB', verified: true },
        { name: 'national_insurance_public_liability.pdf', type: 'Insurance Policy', size: '1.6 MB', verified: true }
      ],
      details: {
        guardian: 'Late Sonam Lepcha (Father)',
        coiNumber: 'COI-GTK-2015-8842',
        registeredAddress: 'Development Area, Kazi Road, Gangtok – 737101',
        mobile: '9832145698',
        email: 'tenzing.norbu@himalayantrails.in',
        orgType: 'Limited Liability Partnership (LLP)',
        ownership: 'Rented / Leased Premises',
        gstin: '11AAECK4589M1Z8',
        pan: 'AAECK4589M',
        academicQual: 'B.Sc. Environmental Science, Sikkim University',
        techQual: "HMI Advance Mountaineering & Search & Rescue Grade 'A'",
        staffStrength: 8,
        activities: ['Trekking', 'Mountain expedition', 'Rock climbing', 'Paragliding', 'River rafting'],
        equipmentCount: 8
      },
      history: [
        { action: 'Application Submitted Online', role: 'Citizen Applicant', officer: 'Tenzing Norbu Lepcha', timestamp: '08 Nov 2026, 11:30 AM', remarks: 'Statutory registration dossier submitted via Sikkim GO.' },
        { action: 'Assigned to HQ Technical Assistant', role: 'System Dispatch', officer: 'Auto-Routing', timestamp: '08 Nov 2026, 11:31 AM', remarks: 'Routed to TA – Headquarters for initial document scrutiny.' }
      ]
    },

    {
      arn: 'SK-ATO-2026-0051',
      type: 'adventure-tour-operator',
      typeName: 'Adventure Tour Operator',
      applicantName: 'Prem Kumar Rai',
      enterpriseName: 'South Sikkim Paragliding & Aero Sports',
      district: 'Namchi',
      submittedDate: '04 Nov 2026',
      lastUpdated: '12 Nov 2026',
      status: STATUSES.UNDER_REVIEW,
      stage: STAGES.ATO_UNDER_INSPECTION,
      currentRole: 'io',
      assignedIO: {
        name: 'Tashi Wangdi Lepcha',
        assignedDate: '10 Nov 2026',
        instructions: 'Conduct physical inspection of paragliding tandem canopies, reserve chutes, pilot licenses and takeoff safety clearances at Jorethang site.'
      },
      inspectionReport: null,
      payment: {
        amount: 1500,
        activated: false,
        activatedBy: null,
        activatedDate: null,
        paid: false,
        transactionRef: null,
        paidDate: null
      },
      documents: [
        { name: 'coi_prem_kumar_rai.pdf', type: 'COI / SSC Proof', size: '1.1 MB', verified: true },
        { name: 'partnership_deed_sspa.pdf', type: 'Partnership Deed', size: '2.1 MB', verified: true },
        { name: 'land_lease_takeoff_site.pdf', type: 'Takeoff Tenancy Deed', size: '1.7 MB', verified: true },
        { name: 'fai_paragliding_pilot_licence.pdf', type: 'Pilot Credentials', size: '1.4 MB', verified: true }
      ],
      details: {
        guardian: 'Tek Bahadur Rai (Father)',
        coiNumber: 'COI-NMC-2016-5120',
        registeredAddress: 'Upper Bazaar, Jorethang, Namchi – 737121',
        mobile: '9832267890',
        email: 'southsikkim.paragliding@gmail.com',
        orgType: 'Partnership Firm',
        ownership: 'Rented / Leased Premises',
        gstin: '11AALFS5678K1Z5',
        pan: 'AALFS5678K',
        academicQual: 'Bachelor of Arts (B.A. Tourism)',
        techQual: 'FAI Certified Tandem Paragliding Pilot & CPR Trained',
        staffStrength: 6,
        activities: ['Paragliding', 'Para Motor', 'Camping / outdoor pursuits'],
        equipmentCount: 6
      },
      history: [
        { action: 'Application Submitted Online', role: 'Citizen Applicant', officer: 'Prem Kumar Rai', timestamp: '04 Nov 2026, 02:15 PM', remarks: 'Applied for commercial paragliding registration.' },
        { action: 'TA Document Scrutiny Passed', role: 'TA – Headquarters', officer: 'Tashi Namgyal Bhutia', timestamp: '10 Nov 2026, 10:45 AM', remarks: 'Pilot certificates and agency credentials verified compliant. Assigned to IO.' },
        { action: 'Assigned to Inspecting Officer', role: 'TA – Headquarters', officer: 'Tashi Namgyal Bhutia', timestamp: '10 Nov 2026, 11:00 AM', remarks: 'Assigned to Tashi Wangdi Lepcha for field safety check.' }
      ]
    },

    {
      arn: 'SK-ATO-2026-0063',
      type: 'adventure-tour-operator',
      typeName: 'Adventure Tour Operator',
      applicantName: 'Mingma Dorjee',
      enterpriseName: 'Barsey Rhododendron Trails Agency',
      district: 'Soreng',
      submittedDate: '09 Nov 2026',
      lastUpdated: '13 Nov 2026',
      status: STATUSES.UNDER_REVIEW,
      stage: STAGES.ATO_REPORT_SUBMITTED,
      currentRole: 'ta-hq',
      assignedIO: {
        name: 'Tashi Wangdi Lepcha',
        assignedDate: '10 Nov 2026'
      },
      inspectionReport: {
        submittedDate: '12 Nov 2026',
        status: 'Compliant & Recommended',
        summary: 'On-site safety gear and winter mountaineering inventory inspected at Soreng Base. 12 UIAA certified dynamic ropes, 16 Petzl helmets, and emergency satellite transponder verified in prime operating order.',
        remarks: 'Agency meets all mountaineering safety directives under Rule 8. Recommended for concurrence.'
      },
      payment: {
        amount: 1500,
        activated: false,
        activatedBy: null,
        activatedDate: null,
        paid: false,
        transactionRef: null,
        paidDate: null
      },
      documents: [
        { name: 'coi_mingma_dorjee.pdf', type: 'COI Proof', size: '1.2 MB', verified: true },
        { name: 'firm_registration_barsey.pdf', type: 'Firm Registration', size: '1.9 MB', verified: true }
      ],
      details: {
        guardian: 'Lhakpa Dorjee (Father)',
        coiNumber: 'COI-SRG-2018-9124',
        registeredAddress: 'Near Sub-Divisional Complex, Soreng – 737121',
        mobile: '9832876543',
        email: 'info@barseytrails.in',
        orgType: 'Sole Proprietorship',
        ownership: 'Owned Premises',
        gstin: '11ABCFM4321R1Z9',
        pan: 'ABCFM4321R',
        academicQual: 'B.Com, Sikkim University',
        techQual: 'HMI Basic & Advance Mountaineering Course Grade A',
        staffStrength: 5,
        activities: ['Trekking', 'Mountain expedition', 'Camping / outdoor pursuits', 'Nature walk'],
        equipmentCount: 7
      },
      history: [
        { action: 'Application Submitted Online', role: 'Citizen Applicant', officer: 'Mingma Dorjee', timestamp: '09 Nov 2026, 09:30 AM', remarks: 'Submission complete.' },
        { action: 'Inspecting Officer Assigned', role: 'TA – Headquarters', officer: 'Tashi Namgyal Bhutia', timestamp: '10 Nov 2026, 02:00 PM', remarks: 'Field gear verification scheduled.' },
        { action: 'Inspection Report Submitted', role: 'Inspecting Officer', officer: 'Tashi Wangdi Lepcha', timestamp: '12 Nov 2026, 04:30 PM', remarks: 'Safety gear compliant. Submitted back to TA.' }
      ]
    },

    {
      arn: 'SK-ATO-2026-0078',
      type: 'adventure-tour-operator',
      typeName: 'Adventure Tour Operator',
      applicantName: 'Karma Doma Bhutia',
      enterpriseName: 'Teesta White Water Rapids',
      district: 'Gangtok',
      submittedDate: '01 Nov 2026',
      lastUpdated: '13 Nov 2026',
      status: STATUSES.PAYMENT_PENDING,
      stage: STAGES.ATO_PAYMENT_ACTIVATED,
      currentRole: 'citizen',
      assignedIO: { name: 'Tashi Wangdi Lepcha', assignedDate: '03 Nov 2026' },
      inspectionReport: {
        submittedDate: '05 Nov 2026',
        status: 'Compliant & Recommended',
        summary: 'Commercial rafts, life jackets (Type V PFDs), and throw ropes inspected and certified airworthy.',
        remarks: 'Compliant with River Rafting Safety Guidelines.'
      },
      payment: {
        amount: 1500,
        activated: true,
        activatedBy: 'Pema Dorjee Sherpa (DTO HQ)',
        activatedDate: '12 Nov 2026, 03:00 PM',
        paid: false,
        transactionRef: null,
        paidDate: null
      },
      documents: [
        { name: 'coi_karma_doma.pdf', type: 'COI Proof', size: '1.3 MB', verified: true }
      ],
      details: {
        guardian: 'Tshering Bhutia (Spouse)',
        coiNumber: 'COI-GTK-2014-4412',
        registeredAddress: 'Singtam Bazaar, NH-10, Gangtok – 737134',
        mobile: '9832998877',
        email: 'teesta.rapids@gmail.com',
        orgType: 'Partnership Firm',
        ownership: 'Owned Premises',
        gstin: '11AAKFT8821M1Z2',
        pan: 'AAKFT8821M',
        academicQual: 'Graduate',
        techQual: 'National River Rafting Guide Licence & WFR',
        staffStrength: 10,
        activities: ['River rafting', 'Kayaking'],
        equipmentCount: 9
      },
      history: [
        { action: 'Inspection Report Approved', role: 'TA – Headquarters', officer: 'Tashi Namgyal Bhutia', timestamp: '06 Nov 2026, 11:00 AM', remarks: 'Forwarded to Asst. Dir.' },
        { action: 'Concurrence Endorsed', role: 'Assistant Director (HQ)', officer: 'Karma Lhamu Bhutia', timestamp: '09 Nov 2026, 02:30 PM', remarks: 'Technical clearance granted. Forwarded to DTO.' },
        { action: 'Statutory Fee Activated (₹1,500)', role: 'DTO – Headquarters', officer: 'Pema Dorjee Sherpa', timestamp: '12 Nov 2026, 03:00 PM', remarks: 'Payment link activated for applicant.' }
      ]
    },

    {
      arn: 'SK-ATO-2026-0009',
      type: 'adventure-tour-operator',
      typeName: 'Adventure Tour Operator',
      applicantName: 'Sonam Gyatso Sherpa',
      enterpriseName: 'Peak Explorers & Mountaineering Expeditions',
      district: 'Gangtok',
      submittedDate: '20 Oct 2026',
      lastUpdated: '02 Nov 2026',
      status: STATUSES.APPROVED,
      stage: STAGES.ATO_APPROVED,
      currentRole: null,
      certificateNo: 'RC-SK-ATO-2026-0009',
      certificateRegNo: 'RC-SK-ATO-2026-0009',
      certificateSerialNo: 'SR-2026-ATO-0077',
      issueDate: '02 Nov 2026',
      prescribedAuthority: 'Prescribed Authority, Dept. of Tourism & Civil Aviation',
      place: 'Gangtok',
      validTill: '01 Nov 2028',
      assignedIO: { name: 'Tashi Wangdi Lepcha' },
      inspectionReport: { submittedDate: '24 Oct 2026', status: 'Compliant' },
      payment: {
        amount: 1500,
        activated: true,
        activatedBy: 'Pema Dorjee Sherpa (DTO HQ)',
        activatedDate: '28 Oct 2026',
        paid: true,
        transactionRef: 'TXN-SK-ATO-992104',
        paidDate: '29 Oct 2026'
      },
      documents: [
        { name: 'coi_certificate.pdf', type: 'COI Proof', size: '1.2 MB', verified: true }
      ],
      details: {
        guardian: 'Pemba Sherpa',
        coiNumber: 'COI-GTK-2012-1002',
        registeredAddress: 'Tibet Road, Gangtok – 737101',
        mobile: '9832369852',
        email: 'sonam.sherpa@sikkimadventures.in',
        orgType: 'Private Limited Company',
        ownership: 'Owned Premises',
        gstin: '11AABCP9912M1Z0',
        pan: 'AABCP9912M',
        academicQual: 'M.Sc. Geography',
        techQual: 'Everest Summiteer & HMI Instructor',
        staffStrength: 15,
        activities: ['Mountaineering', 'Trekking'],
        equipmentCount: 12
      },
      history: [
        { action: 'Application Approved', role: 'DTO – Headquarters', officer: 'Pema Dorjee Sherpa', timestamp: '02 Nov 2026, 11:30 AM', remarks: 'Registration Certificate RC-SK-ATO-2026-0009 issued.' }
      ]
    },

    {
      arn: 'SK-ATO-2026-0031',
      type: 'adventure-tour-operator',
      typeName: 'Adventure Tour Operator',
      applicantName: 'Rahul Sharma',
      enterpriseName: 'North Ridge Expedition Agency',
      district: 'Mangan',
      submittedDate: '15 Oct 2026',
      lastUpdated: '29 Oct 2026',
      status: STATUSES.REJECTED,
      stage: STAGES.REJECTED,
      currentRole: null,
      rejectionRemarks: 'During on-site IA safety inspection, high-altitude mountaineering harnesses and dynamic ropes lacked UIAA/CE certifications. Minimum lead guide experience requirements not met under Rule 8(2).',
      rejectedBy: 'Rinzing Ongmu Bhutia (District Tourism Officer, Mangan)',
      assignedIO: { name: 'Tashi Wangdi Lepcha' },
      payment: { amount: 1500, activated: false, paid: false },
      documents: [{ name: 'ineligible_gear_doc.pdf', type: 'Gear Record', size: '820 KB', verified: false }],
      details: {
        guardian: 'K. P. Sharma',
        coiNumber: 'COI-MGN-2017-3109',
        registeredAddress: 'Singhik, Mangan – 737116',
        mobile: '9832987654',
        email: 'rahul.sharma@example.in',
        orgType: 'Proprietorship',
        ownership: 'Rented',
        gstin: '11ABCPR1120M1Z8',
        pan: 'ABCPR1120M',
        academicQual: 'Class XII',
        techQual: 'Basic Mountaineering',
        staffStrength: 3,
        activities: ['Trekking'],
        equipmentCount: 4
      },
      history: [
        { action: 'Application Rejected', role: 'DTO – Headquarters', officer: 'Pema Dorjee Sherpa', timestamp: '29 Oct 2026, 04:15 PM', remarks: 'Rejected due to uncertified safety gear.' }
      ]
    },

    // ------------------------------------------------------------------------
    // WORKFLOW 2: GUIDE REGISTRATION – GANGTOK (HQ ROUTE)
    // ------------------------------------------------------------------------
    {
      arn: 'SK-GR-2026-0033',
      type: 'guide-registration',
      typeName: 'Guide Registration',
      applicantName: 'Phurba Dawa Bhutia',
      enterpriseName: 'Phurba Dawa (Mountain & Eco Guide)',
      district: 'Gangtok',
      submittedDate: '09 Nov 2026',
      lastUpdated: '13 Nov 2026',
      status: STATUSES.UNDER_REVIEW,
      stage: STAGES.GR_HQ_AWAITING_TA,
      currentRole: 'ta-hq',
      assignedIO: null, // Strictly NO IO in Guide Registration!
      payment: {
        amount: 1500,
        activated: false,
        paid: false
      },
      documents: [
        { name: 'voter_id_phurba_dawa.pdf', type: 'Identity Proof (Inferred: Voter ID)', size: '850 KB', verified: true },
        { name: 'coi_phurba_dawa.pdf', type: 'Domicile / COI Proof', size: '1.1 MB', verified: true },
        { name: 'class_xii_cbse_marksheet.pdf', type: 'Education Certificate', size: '780 KB', verified: true },
        { name: 'hmi_advance_guide_course.pdf', type: 'Experience Certificate', size: '1.4 MB', verified: true },
        { name: 'personal_accident_insurance_policy.pdf', type: 'Insurance Document', size: '1.2 MB', verified: true }
      ],
      details: {
        dob: '12/04/1993',
        gender: 'Male',
        residentialAddress: 'Syari, Deorali, Gangtok – 737102',
        pincode: '737102',
        mobile: '9832776655',
        email: 'phurba.dawa@sikkimguides.org',
        eduQual: 'Bachelor of Arts (B.A. History)',
        workExp: '6 years guiding trekking groups across Dzongri, Goechala, and Singalila.',
        categories: ['Tour Guide', 'Trekking Guide', 'Birdwatching Guide'],
        languages: 'English, Hindi, Nepali, Bhutia',
        foreignLang: 'Basic Japanese'
      },
      history: [
        { action: 'Application Submitted Online', role: 'Citizen Applicant', officer: 'Phurba Dawa Bhutia', timestamp: '09 Nov 2026, 10:15 AM', remarks: 'Submitted Gangtok Guide application.' },
        { action: 'Assigned to HQ Technical Assistant', role: 'System Dispatch', officer: 'Auto-Routing', timestamp: '09 Nov 2026, 10:16 AM', remarks: 'Gangtok Guide follows HQ TA route.' }
      ]
    },

    {
      arn: 'SK-GR-2026-0037',
      type: 'guide-registration',
      typeName: 'Guide Registration',
      applicantName: 'Tashi Tshering Bhutia',
      enterpriseName: 'Tashi Tshering (Heritage Guide)',
      district: 'Gangtok',
      submittedDate: '07 Nov 2026',
      lastUpdated: '13 Nov 2026',
      status: STATUSES.UNDER_REVIEW,
      stage: STAGES.GR_HQ_AWAITING_ASST_DIR,
      currentRole: 'asst-dir-hq',
      assignedIO: null,
      payment: { amount: 1500, activated: false, paid: false },
      documents: [
        { name: 'voter_id_tashi.pdf', type: 'Identity Proof', size: '920 KB', verified: true },
        { name: 'coi_tashi.pdf', type: 'COI Proof', size: '1.0 MB', verified: true }
      ],
      details: {
        dob: '19/09/1991',
        gender: 'Male',
        residentialAddress: 'Development Area, Gangtok – 737101',
        pincode: '737101',
        mobile: '9832881122',
        email: 'tashi.heritage@gmail.com',
        eduQual: 'M.A. History',
        workExp: '8 years heritage guide in Sikkim monasteries.',
        categories: ['Tour Guide'],
        languages: 'English, Hindi, Nepali, Tibetan',
        foreignLang: 'French'
      },
      history: [
        { action: 'TA Scrutiny Complete', role: 'TA – Headquarters', officer: 'Tashi Namgyal Bhutia', timestamp: '11 Nov 2026, 03:00 PM', remarks: 'Forwarded to HQ Assistant Director.' }
      ]
    },

    {
      arn: 'SK-GR-2026-0089',
      type: 'guide-registration',
      typeName: 'Guide Registration',
      applicantName: 'Kinzang Lepcha',
      enterpriseName: 'Kinzang Lepcha (Trek Escort)',
      district: 'Gangtok',
      submittedDate: '02 Nov 2026',
      lastUpdated: '13 Nov 2026',
      status: STATUSES.PAYMENT_PENDING,
      stage: STAGES.GR_HQ_PAYMENT_SUBMITTED,
      currentRole: 'dto-hq',
      assignedIO: null,
      payment: {
        amount: 1500,
        activated: true,
        activatedBy: 'Pema Dorjee Sherpa (DTO HQ)',
        activatedDate: '10 Nov 2026, 04:00 PM',
        paid: true,
        transactionRef: 'TXN-SK-GR-441098',
        paidDate: '11 Nov 2026, 11:45 AM'
      },
      documents: [
        { name: 'voter_id_kinzang.pdf', type: 'Identity Proof', size: '890 KB', verified: true }
      ],
      details: {
        dob: '05/02/1995',
        gender: 'Male',
        residentialAddress: 'Burtuk, Gangtok – 737101',
        pincode: '737101',
        mobile: '9832445566',
        email: 'kinzang.lepcha@gmail.com',
        eduQual: 'Class XII',
        workExp: '5 years trekking guide.',
        categories: ['Trekking Guide', 'Trekking Cook'],
        languages: 'English, Hindi, Nepali',
        foreignLang: 'None'
      },
      history: [
        { action: 'Statutory Fee Activated (₹1,500)', role: 'DTO – Headquarters', officer: 'Pema Dorjee Sherpa', timestamp: '10 Nov 2026, 04:00 PM', remarks: 'Payment activated.' },
        { action: 'Payment Submitted by Citizen', role: 'Citizen Applicant', officer: 'Kinzang Lepcha', timestamp: '11 Nov 2026, 11:45 AM', remarks: '₹1,500 simulated payment submitted with Ref TXN-SK-GR-441098.' }
      ]
    },

    {
      arn: 'SK-GR-2026-0044',
      type: 'guide-registration',
      typeName: 'Guide Registration',
      applicantName: 'Srijana Rai',
      enterpriseName: 'Tour Guide',
      district: 'Gangtok',
      submittedDate: '28 Aug 2023',
      lastUpdated: '04 Sep 2023',
      status: STATUSES.APPROVED,
      stage: STAGES.GR_HQ_APPROVED,
      currentRole: null,
      certificateNo: 'RC-SK-GR-2026-0044',
      certificateSerialNo: 'SR-2026-GR-0044',
      certificateRegNo: 'RC-SK-GR-2026-0044',
      cardReference: '133/DoT&CAv/GTK/23/TG',
      issueDate: '04.09.2023',
      validTill: '03.09.2024',
      prescribedAuthority: 'Additional Secretary, Tourism and Civil Aviation Department',
      place: 'Gangtok',
      assignedIO: null,
      payment: {
        amount: 1500,
        activated: true,
        activatedBy: 'Pema Dorjee Sherpa (DTO HQ)',
        activatedDate: '01 Sep 2023',
        paid: true,
        transactionRef: 'TXN-SK-GR-889123',
        paidDate: '02 Sep 2023'
      },
      documents: [
        { name: 'voter_id_srijana.pdf', type: 'Identity Proof', size: '820 KB', verified: true },
        { name: 'coi_srijana.pdf', type: 'COI Proof', size: '1.1 MB', verified: true },
        { name: 'hmi_guide_certificate.pdf', type: 'Guide Training Certificate', size: '1.4 MB', verified: true }
      ],
      details: {
        dob: '14/08/1997',
        gender: 'Female',
        guardian: 'B. B. Rai (Father)',
        fatherName: 'B. B. Rai',
        residentialAddress: 'Shyari, Namchi, Gangtok',
        pincode: '737102',
        mobile: '8391974093',
        email: 'srijana.rai@example.com',
        bloodGroup: 'B+',
        eduQual: 'Graduate (B.Sc. Tourism)',
        workExp: '3 years professional cultural & eco tour guiding across Gangtok & Namchi.',
        categories: ['Tour Guide'],
        languages: 'English, Hindi, Nepali',
        foreignLang: 'Basic Japanese'
      },
      history: [
        { action: 'Application Approved', role: 'DTO – Headquarters', officer: 'Pema Dorjee Sherpa', timestamp: '04 Sep 2023, 11:30 AM', remarks: 'Guide Certificate (Annexure XVIII) and Tour Guide ID Card (133/DoT&CAv/GTK/23/TG) generated.' }
      ]
    },

    // ------------------------------------------------------------------------
    // WORKFLOW 3: GUIDE REGISTRATION – OTHER DISTRICTS (MANGAN, NAMCHI, ETC.)
    // ------------------------------------------------------------------------
    {
      arn: 'SK-GR-2026-0018',
      type: 'guide-registration',
      typeName: 'Guide Registration',
      applicantName: 'Karma Tshering Lepcha',
      enterpriseName: 'Karma Tshering (Mountain Guide)',
      district: 'Namchi',
      submittedDate: '05 Nov 2026',
      lastUpdated: '11 Nov 2026',
      status: STATUSES.RETURNED,
      stage: STAGES.RETURNED_CORRECTION,
      currentRole: 'citizen',
      assignedIO: null,
      returnRemarks: 'The uploaded Medical Fitness Certificate is missing the signature of the Government District Hospital Chief Medical Officer (CMO). Please upload a signed certificate along with updated First-Aid card.',
      returnedBy: 'Karma Dawa Sherpa (Technical Assistant, Namchi)',
      payment: { amount: 1500, activated: false, paid: false },
      documents: [
        { name: 'voter_id_karma_tshering.pdf', type: 'Identity Proof', size: '940 KB', verified: true },
        { name: 'coi_karma_tshering.pdf', type: 'COI Proof', size: '1.2 MB', verified: true },
        { name: 'medical_fitness_unsigned.pdf', type: 'Medical Certificate (Deficient)', size: '610 KB', verified: false }
      ],
      details: {
        dob: '28/11/1990',
        gender: 'Male',
        residentialAddress: 'Upper Bazaar, Namchi – 737126',
        pincode: '737126',
        mobile: '9832258741',
        email: 'karma.tshering@example.in',
        eduQual: 'Class XII Pass',
        workExp: '7 years guiding south Sikkim nature walks.',
        categories: ['Tour Guide', 'Birdwatching Guide'],
        languages: 'English, Hindi, Nepali, Lepcha',
        foreignLang: 'None'
      },
      history: [
        { action: 'Application Submitted Online', role: 'Citizen Applicant', officer: 'Karma Tshering Lepcha', timestamp: '05 Nov 2026, 03:00 PM', remarks: 'Submitted to Namchi District.' },
        { action: 'Returned for Correction', role: 'District TA (Namchi)', officer: 'Karma Dawa Sherpa', timestamp: '11 Nov 2026, 11:30 AM', remarks: 'Missing CMO signature on medical fitness certificate.' }
      ]
    },

    {
      arn: 'SK-GR-2026-0045',
      type: 'guide-registration',
      typeName: 'Guide Registration',
      applicantName: 'Dorjee Tshering Lepcha',
      enterpriseName: 'Dorjee Tshering (North Sikkim Guide)',
      district: 'Mangan',
      submittedDate: '07 Nov 2026',
      lastUpdated: '13 Nov 2026',
      status: STATUSES.UNDER_REVIEW,
      stage: STAGES.GR_DIST_AWAITING_DTO,
      currentRole: 'dist-dto',
      assignedIO: null,
      payment: { amount: 1500, activated: false, paid: false },
      documents: [
        { name: 'voter_id_dorjee.pdf', type: 'Identity Proof', size: '890 KB', verified: true },
        { name: 'coi_mangan_dorjee.pdf', type: 'COI Proof', size: '1.2 MB', verified: true }
      ],
      details: {
        dob: '15/06/1992',
        gender: 'Male',
        residentialAddress: 'Ringhim, Mangan – 737116',
        pincode: '737116',
        mobile: '9832112233',
        email: 'dorjee.mangan@gmail.com',
        eduQual: 'Graduate (B.A.)',
        workExp: '6 years guiding Yumthang & Gurudongmar routes.',
        categories: ['Tour Guide', 'Trekking Guide'],
        languages: 'English, Hindi, Nepali, Lepcha, Tibetan',
        foreignLang: 'None'
      },
      history: [
        { action: 'District TA Scrutiny Complete', role: 'District TA (Mangan)', officer: 'Ongdi Tshering Lepcha', timestamp: '10 Nov 2026, 04:00 PM', remarks: 'Forwarded to District DTO Mangan for payment activation.' }
      ]
    },

    {
      arn: 'SK-GR-2026-0039',
      type: 'guide-registration',
      typeName: 'Guide Registration',
      applicantName: 'Lakpa Subba',
      enterpriseName: 'Lakpa Subba (Yuksam Escort)',
      district: 'Gyalshing',
      submittedDate: '06 Nov 2026',
      lastUpdated: '13 Nov 2026',
      status: STATUSES.UNDER_REVIEW,
      stage: STAGES.GR_DIST_AWAITING_HQ_DTO,
      currentRole: 'dto-hq',
      assignedIO: null,
      payment: {
        amount: 1500,
        activated: true,
        activatedBy: 'Sonam Gyatso Lepcha (District DTO Gyalshing)',
        activatedDate: '09 Nov 2026, 02:00 PM',
        paid: true,
        transactionRef: 'TXN-SK-GR-771239',
        paidDate: '10 Nov 2026, 09:30 AM'
      },
      documents: [
        { name: 'voter_id_lakpa.pdf', type: 'Identity Proof', size: '920 KB', verified: true },
        { name: 'coi_gyalshing_lakpa.pdf', type: 'COI Proof', size: '1.1 MB', verified: true }
      ],
      details: {
        dob: '08/07/1989',
        gender: 'Male',
        residentialAddress: 'Yuksam, Gyalshing – 737113',
        pincode: '737113',
        mobile: '9832554433',
        email: 'lakpa.yuksam@gmail.com',
        eduQual: 'Class XII',
        workExp: '9 years chief trekking escort in West Sikkim.',
        categories: ['Trekking Guide', 'Trekking Cook'],
        languages: 'English, Hindi, Nepali, Limboo',
        foreignLang: 'Basic German'
      },
      history: [
        { action: 'Payment Activated by District DTO', role: 'District DTO (Gyalshing)', officer: 'Sonam Gyatso Lepcha', timestamp: '09 Nov 2026, 02:00 PM', remarks: '₹1,500 activated.' },
        { action: 'Applicant Payment Submitted', role: 'Citizen Applicant', officer: 'Lakpa Subba', timestamp: '10 Nov 2026, 09:30 AM', remarks: 'Paid Ref TXN-SK-GR-771239.' },
        { action: 'Forwarded to HQ Asst. Dir.', role: 'District DTO (Gyalshing)', officer: 'Sonam Gyatso Lepcha', timestamp: '11 Nov 2026, 11:00 AM', remarks: 'Forwarded to HQ for final accreditation.' },
        { action: 'HQ Asst. Dir. Review Endorsed', role: 'Assistant Director (HQ)', officer: 'Karma Lhamu Bhutia', timestamp: '12 Nov 2026, 03:30 PM', remarks: 'Endorsed and forwarded to HQ DTO for Digital ID Card & Logbook issuance.' }
      ]
    },

    {
      arn: 'SK-GR-2026-0056',
      type: 'guide-registration',
      typeName: 'Guide Registration',
      applicantName: 'Chungda Bhutia',
      enterpriseName: 'Chungda Bhutia (Eco Guide)',
      district: 'Pakyong',
      submittedDate: '10 Nov 2026',
      lastUpdated: '13 Nov 2026',
      status: STATUSES.UNDER_REVIEW,
      stage: STAGES.GR_DIST_AWAITING_TA,
      currentRole: 'dist-ta',
      assignedIO: null,
      payment: { amount: 1500, activated: false, paid: false },
      documents: [
        { name: 'voter_id_chungda.pdf', type: 'Identity Proof', size: '890 KB', verified: true }
      ],
      details: {
        dob: '22/03/1996',
        gender: 'Male',
        residentialAddress: 'Rhenock, Pakyong – 737133',
        pincode: '737133',
        mobile: '9832667788',
        email: 'chungda.eco@gmail.com',
        eduQual: 'Graduate',
        workExp: '4 years eco guide around Silk Route.',
        categories: ['Birdwatching Guide', 'Tour Guide'],
        languages: 'English, Hindi, Nepali, Bhutia',
        foreignLang: 'None'
      },
      history: [
        { action: 'Application Submitted Online', role: 'Citizen Applicant', officer: 'Chungda Bhutia', timestamp: '10 Nov 2026, 04:30 PM', remarks: 'Assigned to Pakyong District TA.' }
      ]
    },

    {
      arn: 'SK-GR-2026-0099',
      type: 'guide-registration',
      typeName: 'Guide Registration',
      applicantName: 'Dawa Norbu Sherpa',
      enterpriseName: 'Dawa Norbu (Alpine Guide)',
      district: 'Namchi',
      submittedDate: '18 Oct 2026',
      lastUpdated: '01 Nov 2026',
      status: STATUSES.APPROVED,
      stage: STAGES.GR_DIST_APPROVED,
      currentRole: null,
      certificateNo: 'RC-SK-GR-2026-0099',
      certificateRegNo: 'RC-SK-GR-2026-0099',
      certificateSerialNo: 'SR-2026-GR-0099',
      cardReference: '082/DoT&CAv/NMC/26/TG',
      idCardNo: 'ID-SK-GR-2026-0099',
      issueDate: '01 Nov 2026',
      place: 'Namchi',
      prescribedAuthority: 'Prescribed Authority, Dept. of Tourism & Civil Aviation',
      logbookNo: 'LB-SK-GR-2026-0099',
      logbookIssuedDate: '01 Nov 2026',
      logbookStatus: 'Manually Issued & Recorded in District Register',
      validTill: '31 Oct 2029',
      payment: {
        amount: 1500,
        activated: true,
        paid: true,
        transactionRef: 'TXN-SK-GR-110099',
        paidDate: '26 Oct 2026'
      },
      documents: [{ name: 'voter_id_dawa.pdf', type: 'Identity Proof', size: '940 KB', verified: true }],
      details: {
        dob: '14/10/1988',
        gender: 'Male',
        guardian: 'Phurba Sherpa (Father)',
        fatherName: 'Phurba Sherpa',
        residentialAddress: 'Ravangla, Namchi – 737139',
        pincode: '737139',
        mobile: '9832123999',
        email: 'dawa.ravangla@gmail.com',
        bloodGroup: 'Not Provided',
        eduQual: 'Class XII',
        workExp: '10 years alpine guide.',
        categories: ['Trekking Guide', 'Tour Guide'],
        languages: 'English, Hindi, Nepali',
        foreignLang: 'None'
      },
      history: [
        { action: 'Digital ID Card Generated', role: 'DTO – Headquarters', officer: 'Pema Dorjee Sherpa', timestamp: '01 Nov 2026, 11:00 AM', remarks: 'Digital ID Card ID-SK-GR-2026-0099 generated.' },
        { action: 'Manual Logbook Recorded', role: 'DTO – Headquarters', officer: 'Pema Dorjee Sherpa', timestamp: '01 Nov 2026, 11:15 AM', remarks: 'Physical Guide Logbook LB-SK-GR-2026-0099 dispatched to Namchi District Office.' }
      ]
    },
    // Supplementary Seed Records for 100% 6-District Coverage
    {
      arn: 'SK-GR-2026-0067',
      type: 'guide-registration',
      typeName: 'Tour Guide Registration',
      applicantName: 'Rinzing Ongmu Bhutia',
      district: 'Soreng',
      submittedDate: '05 Nov 2026',
      lastUpdated: '10 Nov 2026',
      status: STATUSES.UNDER_REVIEW,
      stage: STAGES.GR_DIST_AWAITING_TA,
      currentRole: 'dist-ta',
      payment: {
        amount: 1500,
        activated: false,
        paid: false
      },
      documents: [{ name: 'coi_rinzing_soreng.pdf', type: 'COI / SSC Proof', size: '1.1 MB', verified: true }],
      details: {
        dob: '22/04/1994',
        gender: 'Female',
        fatherName: 'Sonam Pintso Bhutia',
        residentialAddress: 'Chumbong, Soreng – 737121',
        mobile: '9800234567',
        email: 'rinzing.soreng@gmail.com',
        bloodGroup: 'Not Provided',
        categories: ['Tour Guide', 'Bird Watching']
      },
      history: [
        { action: 'Submitted', role: 'Citizen', officer: 'Rinzing Ongmu Bhutia', timestamp: '05 Nov 2026, 02:30 PM', remarks: 'Application submitted online.' }
      ]
    },
    {
      arn: 'SK-ATO-2026-0071',
      type: 'adventure-tour-operator',
      typeName: 'Adventure Tour Operator',
      applicantName: 'Sonam Gyatso Bhutia',
      enterpriseName: 'West Sikkim Alpine Treks LLP',
      district: 'Gyalshing',
      submittedDate: '03 Nov 2026',
      lastUpdated: '11 Nov 2026',
      status: STATUSES.UNDER_REVIEW,
      stage: STAGES.ATO_UNDER_INSPECTION,
      currentRole: 'io',
      assignedIO: 'Tashi Wangdi Lepcha',
      inspectionReport: null,
      payment: {
        amount: 1500,
        activated: false,
        paid: false
      },
      documents: [{ name: 'llp_west_sikkim_alpine.pdf', type: 'Partnership Deed', size: '2.3 MB', verified: true }],
      details: {
        enterpriseType: 'LLP',
        registeredOffice: 'Pelling Helipad Road, Gyalshing – 737111',
        mobile: '9832098765',
        email: 'info@westsikkimalpine.com',
        disciplines: ['Mountaineering', 'Trekking']
      },
      history: [
        { action: 'Assigned to IO', role: 'TA – Headquarters', officer: 'Tashi Namgyal Bhutia', timestamp: '04 Nov 2026, 11:30 AM', remarks: 'Assigned to Inspecting Officer Tashi Wangdi Lepcha for Pelling base gear inspection.' }
      ]
    },
    {
      arn: 'SK-ATO-2026-0084',
      type: 'adventure-tour-operator',
      typeName: 'Adventure Tour Operator',
      applicantName: 'Karma Tsering Lepcha',
      enterpriseName: 'Silk Route High Altitude Expeditions',
      district: 'Pakyong',
      submittedDate: '01 Nov 2026',
      lastUpdated: '09 Nov 2026',
      status: STATUSES.PAYMENT_PENDING,
      stage: STAGES.ATO_PAYMENT_ACTIVATED,
      currentRole: 'dto-hq',
      assignedIO: 'Tashi Wangdi Lepcha',
      inspectionReport: {
        inspectionDate: '06 Nov 2026',
        result: 'RECOMMENDED',
        remarks: 'All high-altitude safety equipment verified at Pakyong depot.'
      },
      payment: {
        amount: 1500,
        activated: true,
        activatedBy: 'Pema Dorjee Sherpa (HQ DTO)',
        activatedDate: '09 Nov 2026',
        paid: false
      },
      documents: [{ name: 'brn_certificate_pakyong.pdf', type: 'Business Registration', size: '1.4 MB', verified: true }],
      details: {
        enterpriseType: 'Proprietorship',
        registeredOffice: 'Rhenock Bazaar, Pakyong – 737133',
        mobile: '9733054321',
        email: 'silkroute.expeditions@gmail.com',
        disciplines: ['High Altitude Trekking', 'Paragliding']
      },
      history: [
        { action: 'Payment Activated', role: 'DTO – Headquarters', officer: 'Pema Dorjee Sherpa', timestamp: '09 Nov 2026, 03:00 PM', remarks: 'Inspection cleared. Statutory fee ₹1,500 activated.' }
      ]
    }
  ];

  // ==========================================================================
  // WORKFLOW ENGINE REPOSITORY IMPLEMENTATION
  // ==========================================================================
  const AdventureWorkflowEngine = {
    STATUSES: STATUSES,
    STAGES: STAGES,
    DISTRICT_OFFICES: DISTRICT_OFFICES,
    HQ_OFFICERS: HQ_OFFICERS,

    // Initialize or restore applications repository
    init: function () {
      const storedVersion = localStorage.getItem(SEED_VERSION_KEY);
      const storedApps = localStorage.getItem(STORAGE_KEY);

      if (!storedApps || storedVersion !== CURRENT_SEED_VERSION) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_APPLICATIONS));
        localStorage.setItem(SEED_VERSION_KEY, CURRENT_SEED_VERSION);
      }
    },

    // Get all applications
    getAllApplications: function () {
      this.init();
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      } catch (e) {
        return SEED_APPLICATIONS;
      }
    },

    // Get specific application by ARN
    getApplicationByArn: function (arn) {
      const all = this.getAllApplications();
      return all.find(a => a.arn === arn) || null;
    },

    // Save/Update application
    saveApplication: function (app) {
      const all = this.getAllApplications();
      const idx = all.findIndex(a => a.arn === app.arn);
      if (idx !== -1) {
        all[idx] = app;
      } else {
        all.unshift(app);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      return app;
    },

    // Reset database to initial seed
    resetDatabase: function () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_APPLICATIONS));
      localStorage.setItem(SEED_VERSION_KEY, CURRENT_SEED_VERSION);
      return SEED_APPLICATIONS;
    },

    // Helper: Add History Event
    _addHistory: function (app, action, role, officer, remarks) {
      const now = new Date();
      const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
      const timestamp = now.toLocaleDateString('en-GB', options);

      if (!app.history) app.history = [];
      app.history.unshift({
        action: action,
        role: role,
        officer: officer,
        timestamp: timestamp,
        remarks: remarks || ''
      });
      app.lastUpdated = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    },

    // ------------------------------------------------------------------------
    // WORKFLOW TRANSITION ACTIONS
    // ------------------------------------------------------------------------

    // Action 1: Assign Inspecting Officer (TA HQ -> IO) [ATO Only]
    assignInspectingOfficer: function (arn, ioName, instructions, officerName) {
      const app = this.getApplicationByArn(arn);
      if (!app || app.type !== 'adventure-tour-operator') return false;

      app.assignedIO = {
        name: ioName || 'Tashi Wangdi Lepcha',
        assignedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        instructions: instructions || 'Conduct physical safety gear and equipment inspection.'
      };
      app.currentRole = 'io';
      app.stage = STAGES.ATO_UNDER_INSPECTION;
      app.status = STATUSES.UNDER_REVIEW;

      this._addHistory(
        app,
        'Assigned to Inspecting Officer (IO)',
        'TA – Headquarters',
        officerName || 'Tashi Namgyal Bhutia (TA)',
        `Assigned to ${app.assignedIO.name}. Instructions: ${instructions}`
      );

      this.saveApplication(app);
      return app;
    },

    // Action 2: Submit Inspection Report (IO -> TA HQ) [ATO Only]
    submitInspectionReport: function (arn, summary, remarks, isCompliant, officerName) {
      const app = this.getApplicationByArn(arn);
      if (!app || app.type !== 'adventure-tour-operator') return false;

      const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      app.inspectionReport = {
        submittedDate: nowStr,
        status: isCompliant ? 'Compliant & Recommended' : 'Safety Deficiencies Flagged',
        summary: summary || 'Equipment verified on site.',
        remarks: remarks || ''
      };
      app.currentRole = 'ta-hq';
      app.stage = STAGES.ATO_REPORT_SUBMITTED;
      app.status = STATUSES.UNDER_REVIEW;

      this._addHistory(
        app,
        'Inspection Report Submitted to TA',
        'Inspecting Officer (IO)',
        officerName || 'Tashi Wangdi Lepcha (IO)',
        `Findings: ${app.inspectionReport.status}. ${remarks}`
      );

      this.saveApplication(app);
      return app;
    },

    // Action 3: Forward to Assistant Director
    forwardToAssistantDirector: function (arn, remarks, officerName, officerRole) {
      const app = this.getApplicationByArn(arn);
      if (!app) return false;

      app.currentRole = 'asst-dir-hq';
      if (app.type === 'adventure-tour-operator') {
        app.stage = STAGES.ATO_AWAITING_ASST_DIR;
      } else if (app.district === 'Gangtok') {
        app.stage = STAGES.GR_HQ_AWAITING_ASST_DIR;
      } else {
        app.stage = STAGES.GR_DIST_AWAITING_HQ_ASST_DIR;
      }
      app.status = STATUSES.UNDER_REVIEW;

      this._addHistory(
        app,
        'Forwarded to HQ Assistant Director',
        officerRole || 'Technical Assistant',
        officerName || 'Technical Assistant',
        remarks || 'Forwarded for state-level review and concurrence.'
      );

      this.saveApplication(app);
      return app;
    },

    // Action 4: Forward to DTO (HQ or District)
    forwardToDto: function (arn, targetRole, remarks, officerName, officerRole) {
      const app = this.getApplicationByArn(arn);
      if (!app) return false;

      app.currentRole = targetRole || 'dto-hq';
      if (app.type === 'adventure-tour-operator') {
        app.stage = STAGES.ATO_AWAITING_DTO;
      } else if (app.district === 'Gangtok') {
        app.stage = STAGES.GR_HQ_AWAITING_DTO;
      } else if (targetRole === 'dist-dto') {
        app.stage = STAGES.GR_DIST_AWAITING_DTO;
      } else {
        app.stage = STAGES.GR_DIST_AWAITING_HQ_DTO;
      }
      app.status = STATUSES.UNDER_REVIEW;

      this._addHistory(
        app,
        `Forwarded to ${targetRole === 'dist-dto' ? 'District DTO' : 'HQ DTO'}`,
        officerRole || 'Assistant Director (HQ)',
        officerName || 'Karma Lhamu Bhutia',
        remarks || 'Forwarded for statutory review.'
      );

      this.saveApplication(app);
      return app;
    },

    // Action 5: Activate Payment (DTO only: HQ DTO for ATO & Gangtok GR; District DTO for Other GR)
    activatePayment: function (arn, officerName, officerRole) {
      const app = this.getApplicationByArn(arn);
      if (!app) return false;

      app.payment = app.payment || { amount: 1500, paid: false };
      app.payment.amount = 1500;
      app.payment.activated = true;
      app.payment.activatedBy = officerName || 'District Tourism Officer';
      app.payment.activatedDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

      app.currentRole = 'citizen';
      app.status = STATUSES.PAYMENT_PENDING;

      if (app.type === 'adventure-tour-operator') {
        app.stage = STAGES.ATO_PAYMENT_ACTIVATED;
      } else if (app.district === 'Gangtok') {
        app.stage = STAGES.GR_HQ_PAYMENT_ACTIVATED;
      } else {
        app.stage = STAGES.GR_DIST_PAYMENT_ACTIVATED;
      }

      this._addHistory(
        app,
        'Statutory Fee Activated (₹1,500)',
        officerRole || 'DTO Desk',
        officerName || 'District Tourism Officer',
        'Application fee of ₹1,500 activated. Notification dispatched to citizen.'
      );

      this.saveApplication(app);
      return app;
    },

    // Action 6: Submit Citizen Payment (Citizen -> DTO)
    submitCitizenPayment: function (arn, transactionRef, applicantName) {
      const app = this.getApplicationByArn(arn);
      if (!app) return false;

      const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      app.payment.paid = true;
      app.payment.transactionRef = transactionRef || `TXN-SK-ADV-${Math.floor(100000 + Math.random() * 900000)}`;
      app.payment.paidDate = nowStr;

      app.status = STATUSES.UNDER_REVIEW;

      if (app.type === 'adventure-tour-operator') {
        app.currentRole = 'dto-hq';
        app.stage = STAGES.ATO_PAYMENT_SUBMITTED;
      } else if (app.district === 'Gangtok') {
        app.currentRole = 'dto-hq';
        app.stage = STAGES.GR_HQ_PAYMENT_SUBMITTED;
      } else {
        app.currentRole = 'dist-dto';
        app.stage = STAGES.GR_DIST_PAYMENT_SUBMITTED;
      }

      this._addHistory(
        app,
        'Statutory Fee Paid (₹1,500)',
        'Citizen Applicant',
        applicantName || app.applicantName,
        `Demonstration payment submitted. Ref: ${app.payment.transactionRef}. Returning to DTO.`
      );

      this.saveApplication(app);
      return app;
    },

    // Action 7: Return for Correction (TA, Asst. Dir., DTO)
    returnForCorrection: function (arn, remarks, officerName, officerRole) {
      const app = this.getApplicationByArn(arn);
      if (!app) return false;

      app.returnRemarks = remarks;
      app.returnedBy = `${officerName} (${officerRole})`;
      app.currentRole = 'citizen';
      app.status = STATUSES.RETURNED;
      app.stage = STAGES.RETURNED_CORRECTION;

      this._addHistory(
        app,
        'Returned for Correction',
        officerRole,
        officerName,
        `Correction Remarks: ${remarks}`
      );

      this.saveApplication(app);
      return app;
    },

    // Action 8: Reject Application (TA, Asst. Dir., DTO)
    rejectApplication: function (arn, remarks, officerName, officerRole) {
      const app = this.getApplicationByArn(arn);
      if (!app) return false;

      app.rejectionRemarks = remarks;
      app.rejectedBy = `${officerName} (${officerRole})`;
      app.currentRole = null;
      app.status = STATUSES.REJECTED;
      app.stage = STAGES.REJECTED;

      this._addHistory(
        app,
        'Application Rejected',
        officerRole,
        officerName,
        `Rejection Decision: ${remarks}`
      );

      this.saveApplication(app);
      return app;
    },

    // Action 9: Final Approval & Certificate Issuance (HQ DTO for ATO & Gangtok GR)
    approveAndIssueCertificate: function (arn, officerName) {
      const app = this.getApplicationByArn(arn);
      if (!app) return false;

      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const isGuide = (app.type === 'guide-registration');
      const certNo = isGuide 
        ? `RC-SK-GR-2026-${randomDigits}` 
        : `RC-SK-ATO-2026-${randomDigits}`;

      app.certificateNo = certNo;
      app.certificateRegNo = certNo;
      app.certificateSerialNo = `SR-2026-${isGuide ? 'GR' : 'ATO'}-${randomDigits}`;
      app.issueDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      app.place = app.district || 'Gangtok';
      app.prescribedAuthority = isGuide 
        ? 'Additional Secretary, Tourism and Civil Aviation Department' 
        : 'Prescribed Authority, Dept. of Tourism & Civil Aviation';
      app.validTill = isGuide ? '13 Nov 2027' : '13 Nov 2028';
      
      if (isGuide) {
        app.cardReference = `${Math.floor(100 + Math.random() * 900)}/DoT&CAv/${(app.district || 'GTK').substring(0,3).toUpperCase()}/26/TG`;
        app.idCardNo = `ID-SK-GR-2026-${randomDigits}`;
      }

      app.currentRole = null;
      app.status = STATUSES.APPROVED;
      app.stage = (app.type === 'adventure-tour-operator') ? STAGES.ATO_APPROVED : STAGES.GR_HQ_APPROVED;

      this._addHistory(
        app,
        'Approved & Certificate Issued',
        'DTO – Headquarters',
        officerName || 'Pema Dorjee Sherpa',
        `Registration Certificate ${certNo} issued digitally. Active till ${app.validTill}.`
      );

      this.saveApplication(app);
      return app;
    },

    // Action 10: Final Issuance for Other-District Guide (HQ DTO: Digital ID Card + Manual Logbook)
    issueDigitalIdAndLogbook: function (arn, officerName) {
      const app = this.getApplicationByArn(arn);
      if (!app || app.type !== 'guide-registration') return false;

      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const certNo = `RC-SK-GR-2026-${randomDigits}`;
      app.idCardNo = `ID-SK-GR-2026-${randomDigits}`;
      app.cardReference = `${Math.floor(100 + Math.random() * 900)}/DoT&CAv/${(app.district || 'NMC').substring(0,3).toUpperCase()}/26/TG`;
      app.certificateNo = certNo;
      app.certificateRegNo = certNo;
      app.certificateSerialNo = `SR-2026-GR-${randomDigits}`;
      app.issueDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      app.place = app.district || 'Namchi';
      app.prescribedAuthority = 'Prescribed Authority, Dept. of Tourism & Civil Aviation';
      app.logbookNo = `LB-SK-GR-2026-${randomDigits}`;
      app.logbookIssuedDate = app.issueDate;
      app.logbookStatus = 'Manually Issued & Recorded in District Register';
      app.validTill = '13 Nov 2029';
      app.currentRole = null;
      app.status = STATUSES.APPROVED;
      app.stage = STAGES.GR_DIST_APPROVED;

      this._addHistory(
        app,
        'Digital ID Card & Logbook Issued',
        'DTO – Headquarters',
        officerName || 'Pema Dorjee Sherpa',
        `Digital ID Card ${app.idCardNo} generated. Physical Logbook ${app.logbookNo} recorded as manually issued.`
      );

      this.saveApplication(app);
      return app;
    },

    // RFC 4180 Standard CSV Generator for Reports (Stage 06)
    generateCsv: function (reportMeta, records) {
      records = records || [];
      const escapeCsv = (str) => {
        if (str === null || str === undefined) return '""';
        const s = String(str).replace(/"/g, '""');
        return `"${s}"`;
      };

      const lines = [
        '# Government of Sikkim - Tourism & Civil Aviation Department',
        '# Adventure Tour Operator & Guide Registration Operational Report',
        `# Report Title: ${escapeCsv(reportMeta.title || 'Application Status & Summary Report')}`,
        `# Reporting Authority: ${escapeCsv(reportMeta.roleName || 'Department Authority')}`,
        `# District Scope: ${escapeCsv(reportMeta.districtScope || 'All Districts')}`,
        `# Reporting Period: ${escapeCsv(reportMeta.dateRange || 'All Time')}`,
        `# Generated On: ${escapeCsv(new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB'))}`,
        `# Total Filtered Records: ${records.length}`,
        '',
        // Exact 4 primary columns + supplementary context
        ['Application ID', 'Applicant Name / Enterprise', 'District', 'Current Status', 'Category', 'Workflow Stage', 'Submission Date'].map(escapeCsv).join(',')
      ];

      records.forEach(app => {
        const displayName = (app.enterpriseName && app.enterpriseName !== app.applicantName)
          ? `${app.applicantName} (${app.enterpriseName})`
          : app.applicantName;
        const categoryLabel = (app.type === 'adventure-tour-operator')
          ? 'Adventure Tour Operator'
          : 'Tour Guide';

        lines.push([
          escapeCsv(app.arn),
          escapeCsv(displayName),
          escapeCsv(app.district || 'Gangtok'),
          escapeCsv(app.status),
          escapeCsv(categoryLabel),
          escapeCsv(app.stage ? app.stage.replace(/&bull;/g, '-').replace(/&amp;/g, '&') : ''),
          escapeCsv(app.submittedDate || '')
        ].join(','));
      });

      return lines.join('\r\n');
    }
  };

  // Expose to global window
  window.AdventureWorkflowEngine = AdventureWorkflowEngine;
  AdventureWorkflowEngine.init();

})(window);
