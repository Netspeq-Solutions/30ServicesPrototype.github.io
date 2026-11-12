/**
 * WORKFLOW ENGINE & CENTRAL STATE CONTROLLER
 * Service: Tourism Business & Outdoor Photography Registration
 * Department: Tourism & Civil Aviation Department, Government of Sikkim
 * Baseline: Tourism Permission Architecture (Alpine Blue Theme)
 * 
 * Confirmed Workflow Routing:
 * Flow A (Tour Operator):        Citizen -> Level 0 TO -> Level 1 IA -> Level 0 TO -> Level 2 DTO
 * Flow B (Travel Agent):         Citizen -> Level 0 TO -> Level 1 IA -> Level 0 TO -> Level 2 DTO
 * Flow C (Dealer):               Citizen -> Level 0 TO -> Level 1 IA -> Level 0 TO -> Level 2 DTO
 * Flow D (Outdoor Photographer): Citizen -> Level 0 TO -> Level 2 DTO (Exempt from Physical Inspection)
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'tourism_business_department_applications';
  const STORAGE_VERSION_KEY = 'tourism_business_dept_apps_version';
  const CURRENT_SEED_VERSION = 'v12_dept_queues_reverified_2026';
  const SUBMITTED_STORAGE_KEY = 'tourism_business_submitted';

  // The 4 Official Statuses
  const STATUSES = {
    SUBMITTED: 'Submitted',
    UNDER_REVIEW: 'Under Verification',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    RETURNED: 'Returned for Clarification'
  };

  // Workflow Stages
  const STAGES = {
    STAGE_CITIZEN_SUBMITTED: 'Submitted – Awaiting Level 0 TO Verification',
    STAGE_TO_PENDING: 'Level 0: Pending TO Verification',
    STAGE_IA_ASSIGNED: 'Level 1: Assigned for IA Physical Inspection',
    STAGE_IA_SCHEDULED: 'Level 1: Physical Inspection Scheduled',
    STAGE_TO_REPORT_RECEIVED: 'Level 0: IA Report Received – Pending TO Review',
    STAGE_DTO_PENDING: 'Level 2: Pending DTO Sanction',
    STAGE_APPROVED: 'Approved – Certificate Issued',
    STAGE_REJECTED: 'Rejected',
    STAGE_RETURNED: 'Returned to Citizen for Clarification'
  };

  // 6 District Tourism Circles & Officer Directory
  const DISTRICT_OFFICES = {
    'ALL': {
      district: 'All Circles',
      circleTitle: 'Statewide Overview (All 6 Circles)',
      office: 'Directorate of Tourism, Paryatan Bhawan, Tadong, Gangtok – 737102',
      phone: '03592-209090 / 1800-345-3256',
      email: 'secy-tourism@sikkim.gov.in',
      dtoName: 'Statewide District Tourism Officer Directorate',
      toName: 'Headquarters Tourism Officers Pool',
      iaName: 'Statewide Inspecting Authorities Pool'
    },
    'Gangtok': {
      district: 'Gangtok',
      circleTitle: 'Gangtok District Circle (Capital)',
      toName: 'Karma Lhendup Bhutia',
      toDesignation: 'Tourism Officer (Level 0)',
      iaName: 'Tashi Wangdi Lepcha',
      iaDesignation: 'Inspecting Authority (Level 1)',
      dtoName: 'Pema Dorjee Sherpa',
      dtoDesignation: 'District Tourism Officer (Level 2)',
      office: 'District Tourism Office, Paryatan Bhawan, Tadong, Gangtok – 737102',
      phone: '03592-209091',
      email: 'dto.gangtok@sikkim.gov.in'
    },
    'Namchi': {
      district: 'Namchi',
      circleTitle: 'Namchi District Circle (South)',
      toName: 'Tshering Norbu Rai',
      toDesignation: 'Tourism Officer (Level 0)',
      iaName: 'Phurba Tamang',
      iaDesignation: 'Inspecting Authority (Level 1)',
      dtoName: 'Pempa Tshering Bhutia',
      dtoDesignation: 'District Tourism Officer (Level 2)',
      office: 'District Tourism Office, DAC Complex, Namchi – 737126',
      phone: '03595-263720',
      email: 'dto.namchi@sikkim.gov.in'
    },
    'Gyalshing': {
      district: 'Gyalshing',
      circleTitle: 'Gyalshing District Circle (West)',
      toName: 'Lakpa Doma Subba',
      toDesignation: 'Tourism Officer (Level 0)',
      iaName: 'Sangay Chopel Bhutia',
      iaDesignation: 'Inspecting Authority (Level 1)',
      dtoName: 'Sonam Gyatso Lepcha',
      dtoDesignation: 'District Tourism Officer (Level 2)',
      office: 'District Tourism Office, DAC Complex, Gyalshing – 737111',
      phone: '03595-250810',
      email: 'dto.gyalshing@sikkim.gov.in'
    },
    'Mangan': {
      district: 'Mangan',
      circleTitle: 'Mangan District Circle (North)',
      toName: 'Chewang Norbu Bhutia',
      toDesignation: 'Tourism Officer (Level 0)',
      iaName: 'Dawa Tshering Lepcha',
      iaDesignation: 'Inspecting Authority (Level 1)',
      dtoName: 'Rinzing Ongmu Bhutia',
      dtoDesignation: 'District Tourism Officer (Level 2)',
      office: 'District Tourism Office, DAC Complex, Mangan – 737116',
      phone: '03592-234205',
      email: 'dto.mangan@sikkim.gov.in'
    },
    'Pakyong': {
      district: 'Pakyong',
      circleTitle: 'Pakyong District Circle',
      toName: 'Prashant Chettri',
      toDesignation: 'Tourism Officer (Level 0)',
      iaName: 'Bikash Sharma',
      iaDesignation: 'Inspecting Authority (Level 1)',
      dtoName: 'Nim Lhamu Lepcha',
      dtoDesignation: 'District Tourism Officer (Level 2)',
      office: 'District Tourism Office, DAC Complex, Pakyong – 737106',
      phone: '03592-258014',
      email: 'dto.pakyong@sikkim.gov.in'
    },
    'Soreng': {
      district: 'Soreng',
      circleTitle: 'Soreng District Circle',
      toName: 'Youraj Rai',
      toDesignation: 'Tourism Officer (Level 0)',
      iaName: 'Biren Gurung',
      iaDesignation: 'Inspecting Authority (Level 1)',
      dtoName: 'Norden Bhutia',
      dtoDesignation: 'District Tourism Officer (Level 2)',
      office: 'District Tourism Office, DAC Complex, Soreng – 737121',
      phone: '03595-257002',
      email: 'dto.soreng@sikkim.gov.in'
    }
  };

  // Directory of Available Inspecting Authorities (IA Officers) by District Circle
  const IA_OFFICERS_BY_DISTRICT = {
    'ALL': [
      { name: 'Tashi Wangdi Lepcha', designation: 'Senior Inspecting Authority', circle: 'Gangtok Circle' },
      { name: 'Pema Tshering Bhutia', designation: 'Field Inspecting Officer', circle: 'Gangtok Circle' },
      { name: 'Sonam Dorjee Lepcha', designation: 'Technical Inspecting Officer', circle: 'Gangtok Circle' },
      { name: 'Phurba Tamang', designation: 'Lead Inspecting Authority', circle: 'Namchi Circle' },
      { name: 'Bikram Gurung', designation: 'Field Inspecting Officer', circle: 'Namchi Circle' },
      { name: 'Sangay Chopel Bhutia', designation: 'Lead Inspecting Authority', circle: 'Gyalshing Circle' },
      { name: 'Dawa Subba', designation: 'Field Inspecting Officer', circle: 'Gyalshing Circle' },
      { name: 'Dawa Tshering Lepcha', designation: 'Lead Inspecting Authority', circle: 'Mangan Circle' },
      { name: 'Passang Bhutia', designation: 'Field Inspecting Officer', circle: 'Mangan Circle' },
      { name: 'Bikash Sharma', designation: 'Lead Inspecting Authority', circle: 'Pakyong Circle' },
      { name: 'Kipchu Lepcha', designation: 'Field Inspecting Officer', circle: 'Pakyong Circle' },
      { name: 'Biren Gurung', designation: 'Lead Inspecting Authority', circle: 'Soreng Circle' },
      { name: 'Rinchen Rai', designation: 'Field Inspecting Officer', circle: 'Soreng Circle' }
    ],
    'Gangtok': [
      { name: 'Tashi Wangdi Lepcha', designation: 'Senior Inspecting Authority', circle: 'Gangtok Circle' },
      { name: 'Pema Tshering Bhutia', designation: 'Field Inspecting Officer', circle: 'Gangtok Circle' },
      { name: 'Sonam Dorjee Lepcha', designation: 'Technical Inspecting Officer', circle: 'Gangtok Circle' }
    ],
    'Namchi': [
      { name: 'Phurba Tamang', designation: 'Lead Inspecting Authority', circle: 'Namchi Circle' },
      { name: 'Bikram Gurung', designation: 'Field Inspecting Officer', circle: 'Namchi Circle' }
    ],
    'Gyalshing': [
      { name: 'Sangay Chopel Bhutia', designation: 'Lead Inspecting Authority', circle: 'Gyalshing Circle' },
      { name: 'Dawa Subba', designation: 'Field Inspecting Officer', circle: 'Gyalshing Circle' }
    ],
    'Mangan': [
      { name: 'Dawa Tshering Lepcha', designation: 'Lead Inspecting Authority', circle: 'Mangan Circle' },
      { name: 'Passang Bhutia', designation: 'Field Inspecting Officer', circle: 'Mangan Circle' }
    ],
    'Pakyong': [
      { name: 'Bikash Sharma', designation: 'Lead Inspecting Authority', circle: 'Pakyong Circle' },
      { name: 'Kipchu Lepcha', designation: 'Field Inspecting Officer', circle: 'Pakyong Circle' }
    ],
    'Soreng': [
      { name: 'Biren Gurung', designation: 'Lead Inspecting Authority', circle: 'Soreng Circle' },
      { name: 'Rinchen Rai', designation: 'Field Inspecting Officer', circle: 'Soreng Circle' }
    ]
  };

  // Statutory Registration Fee Structure (The Sikkim Registration of Tourist Trade Rules)
  // Tour Operator & Travel Agent share grade-based fees; Dealer & Photographer have fixed fees
  const REGISTRATION_FEES = {
    'tour-operator': {
      'Grade A': 20000,
      'Grade B': 7000,
      'Grade C': 5000,
      'Grade D': 1500,
      defaultGrade: 'Grade B',
      defaultFee: 7000,
      hasGrades: true
    },
    'travel-agent': {
      'Grade A': 20000,
      'Grade B': 7000,
      'Grade C': 5000,
      'Grade D': 1500,
      defaultGrade: 'Grade B',
      defaultFee: 7000,
      hasGrades: true
    },
    'dealer': {
      fixedFee: 2000,
      defaultFee: 2000,
      hasGrades: false
    },
    'outdoor-photographer': {
      fixedFee: 1500,
      defaultFee: 1500,
      hasGrades: false
    }
  };

  // Standard Document Manifests by Form Configuration
  const DOC_MANIFESTS = {
    'A': [
      { name: 'Passport Format Photograph', code: 'PHOTO', file: 'applicant_passport_photo.jpg', size: '420 KB', status: 'VERIFIED' },
      { name: 'Residential Proof (COI / Domicile / RC)', code: 'RES_PROOF', file: 'coi_certificate_copy.pdf', size: '1.2 MB', status: 'VERIFIED' },
      { name: 'Supporting Qualification / Training Certificate', code: 'QUAL_PROOF', file: 'tourism_diploma_certificate.pdf', size: '2.1 MB', status: 'VERIFIED' },
      { name: 'Attested Qualification Certificate (Min Class 10)', code: 'EDU_PROOF', file: 'class_10_pass_certificate.pdf', size: '1.4 MB', status: 'VERIFIED' },
      { name: 'Supporting Qualification Document for Employees', code: 'STAFF_QUAL', file: 'staff_mountaineering_hmi.pdf', size: '2.8 MB', status: 'VERIFIED' },
      { name: 'NOC from Ward / Panchayat / Councillor', code: 'NOC_WARD', file: 'panchayat_noc_certified.pdf', size: '890 KB', status: 'VERIFIED' },
      { name: 'Memorandum of Association / Society / Firm Deed', code: 'DEED', file: 'partnership_deed_registered.pdf', size: '3.4 MB', status: 'VERIFIED' },
      { name: 'Affidavit from Oath Commissioner', code: 'AFFIDAVIT', file: 'oath_commissioner_affidavit.pdf', size: '1.1 MB', status: 'VERIFIED' },
      { name: 'GST Clearance Certificate (if applicable)', code: 'GST', file: 'gst_clearance_cert_2026.pdf', size: '750 KB', status: 'VERIFIED' },
      { name: 'Aadhaar Card', code: 'AADHAAR', file: 'aadhaar_card_masked.pdf', size: '920 KB', status: 'VERIFIED' },
      { name: 'Identity & Address Proof of Promoter/Manager', code: 'ID_PROOF', file: 'promoter_voter_id_copy.pdf', size: '1.1 MB', status: 'VERIFIED' },
      { name: 'PAN Card', code: 'PAN', file: 'pan_card_firm_attested.pdf', size: '640 KB', status: 'VERIFIED' },
      { name: 'Office Premises Photographs (Max 3)', code: 'OFFICE_IMG', file: 'office_premises_photos_geo.pdf', size: '4.2 MB', status: 'VERIFIED' }
    ],
    'B': [
      { name: 'Proof of Ownership / Lease Agreement of Showroom', code: 'LEASE', file: 'showroom_lease_deed_registered.pdf', size: '2.6 MB', status: 'VERIFIED' },
      { name: 'Certificate of Identification (COI) / Residential Proof', code: 'COI', file: 'applicant_coi_gazetted.pdf', size: '1.1 MB', status: 'VERIFIED' },
      { name: 'Municipal / GPU Trade License (Shop Act)', code: 'TRADE_LIC', file: 'gmc_trade_license_2026.pdf', size: '1.4 MB', status: 'VERIFIED' },
      { name: 'PAN Card of Firm / Enterprise', code: 'PAN', file: 'pan_card_enterprise.pdf', size: '580 KB', status: 'VERIFIED' },
      { name: 'GST Registration Certificate', code: 'GST', file: 'gst_registration_cert_regular.pdf', size: '1.3 MB', status: 'VERIFIED' },
      { name: 'Fire Safety Extinguisher Installation Proof', code: 'FIRE_NOC', file: 'fire_extinguisher_certificate.pdf', size: '890 KB', status: 'VERIFIED' },
      { name: 'List of Outdoor Equipment & Safety Gear Stock', code: 'STOCK_INV', file: 'safety_gear_inventory_manifest.pdf', size: '1.8 MB', status: 'VERIFIED' },
      { name: 'Photographs of Showroom & Display Area', code: 'SHOP_PICS', file: 'showroom_interior_exterior_photos.pdf', size: '3.9 MB', status: 'VERIFIED' }
    ],
    'C': [
      { name: 'Passport Size Photograph', code: 'PHOTO', file: 'photographer_formal_photo.jpg', size: '380 KB', status: 'VERIFIED' },
      { name: 'Certificate of Identification (COI) / Domicile Certificate', code: 'COI', file: 'photographer_coi_certified.pdf', size: '1.2 MB', status: 'VERIFIED' },
      { name: 'Minimum Class X Educational Pass Certificate', code: 'EDU_X', file: 'class_10_board_marksheet.pdf', size: '1.5 MB', status: 'VERIFIED' },
      { name: 'Photography Course / Technical Training Certificate', code: 'PHOTO_COURSE', file: 'diploma_outdoor_photography.pdf', size: '2.4 MB', status: 'VERIFIED' },
      { name: 'Portfolio of Sikkim Landscapes / Wildlife (Web/PDF)', code: 'PORTFOLIO', file: 'sikkim_landscape_portfolio.pdf', size: '6.8 MB', status: 'VERIFIED' },
      { name: 'Recommendation Letter from Registered Media/Association', code: 'RECOM_LETTER', file: 'sikkim_press_club_recommendation.pdf', size: '920 KB', status: 'VERIFIED' },
      { name: 'Aadhaar Card of Applicant', code: 'AADHAAR', file: 'aadhaar_card_masked.pdf', size: '880 KB', status: 'VERIFIED' },
      { name: 'Equipment Manifest (Cameras, Lenses, Drone Permits)', code: 'EQUIP_LIST', file: 'camera_drone_inventory_dgca.pdf', size: '1.6 MB', status: 'VERIFIED' }
    ]
  };

  // 20 Complete Dummy Seed Applications (5 per Category)
    // 23 Comprehensive Master Seed Applications across all 4 categories and circles
    // 23 Comprehensive Master Seed Applications across all 4 categories and circles
  const SEED_APPLICATIONS = [
  {
    "refNo": "SK-TBR-2026-TO-00101",
    "formConfig": "A",
    "category": "tour-operator",
    "categoryName": "Tour Operator Registration",
    "categoryCode": "TO",
    "applicantName": "Karma Lhendup Bhutia",
    "gender": "Male",
    "dob": "14 May 1988",
    "residentialProof": "Certificate of Identification (COI #COI-GTK-2012-984)",
    "address": "Near Ridge Park, Below Raj Bhawan, Gangtok, Sikkim – 737101",
    "phone": "9832101122",
    "email": "karma.bhutia@himalayantrails.in",
    "website": "www.himalayantrails.in",
    "district": "Gangtok",
    "eduQualification": "Graduate (B.A. Tourism & Travel Management)",
    "techQualification": "Post Graduate Diploma in Adventure Tourism & Operations",
    "training": "State Tourism Facilitator Training (Sikkim Tourism Dept, 2023)",
    "businessName": "Himalayan Trails & Expeditions",
    "constitution": "Registered Partnership Firm",
    "ownership": "Rented Commercial Office",
    "tradeLicenseNo": "GMC/TL/2026/8841",
    "pan": "AAHFH1234K",
    "gstin": "11AAHFH1234K1Z8",
    "officeAddress": "Shop #12, First Floor, Ridge View Complex, M.G. Marg, Gangtok – 737101",
    "officeSizeStandard": "420 sq.ft commercial office with client consultation lounge and digital ticketing counter",
    "association": "Travel Agents Association of Sikkim (TAAS) & SATO Member",
    "activitiesSummary": "Specialized in customized Himalayan trek itineraries (Dzongri, Goecha La, Green Lake), monastery circuits and cultural village tours.",
    "partners": [
      {
        "name": "Karma Lhendup Bhutia",
        "role": "Managing Partner",
        "phone": "9832101122",
        "aadhaar": "XXXX-XXXX-4412",
        "address": "Ridge Park, Gangtok"
      },
      {
        "name": "Tshering Lhamu Lepcha",
        "role": "Operations Partner",
        "phone": "9832101123",
        "aadhaar": "XXXX-XXXX-5521",
        "address": "Tadong, Gangtok"
      }
    ],
    "staff": [
      {
        "name": "Dawa Tamang",
        "role": "Senior Trek Leader",
        "qualification": "Advanced Mountaineering Course (HMI Darjeeling)",
        "training": "Wilderness First Aid (WFR Certified)"
      },
      {
        "name": "Pempa Sherpa",
        "role": "Logistics Manager",
        "qualification": "B.A. Tourism",
        "training": "Eco-Tourism Field Management (IHCAE Chemchey)"
      }
    ],
    "ecoPractices": "Strict Leave-No-Trace trail ethics, zero single-use plastic, and solar-powered portable camp lighting.",
    "officeEquipment": "4 workstations, client consultation lounge, high-speed fiber internet, digital billing and fire extinguisher.",
    "requiresInspection": true,
    "assignedRole": "TO",
    "status": "Submitted",
    "currentStage": "Level 0: Pending TO Verification",
    "submittedDate": "04 Nov 2026, 10:15 AM",
    "lastUpdated": "04 Nov 2026, 10:15 AM",
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Karma Lhendup Bhutia)",
        "date": "04 Nov 2026, 10:15 AM",
        "remarks": "Application submitted via Sikkim Single Sign-On Portal. Statutory declaration accepted."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "04 Nov 2026, 10:15 AM",
        "actorRole": "Citizen",
        "actorName": "Karma Lhendup Bhutia",
        "action": "Application Submitted Online",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Application submitted via Single Sign-On. Statutory declaration accepted."
      }
    ]
  },
  {
    "refNo": "SK-TBR-2026-TO-00102",
    "formConfig": "A",
    "category": "tour-operator",
    "categoryName": "Tour Operator Registration",
    "categoryCode": "TO",
    "applicantName": "Passang Tshering Sherpa",
    "gender": "Male",
    "dob": "18 Aug 1990",
    "residentialProof": "Certificate of Identification (COI #COI-NAM-2015-321)",
    "address": "Development Area, Gangtok, Sikkim – 737101",
    "phone": "9832223344",
    "email": "passang.sherpa@alpinehorizon.in",
    "website": "www.alpinehorizon.in",
    "district": "Gangtok",
    "eduQualification": "B.Com (Honours)",
    "techQualification": "Certificate in High Altitude Mountain Guiding (NIM Uttarkashi)",
    "training": "Disaster Management & First Aid in Alpine Terrains (Sikkim SDRF)",
    "businessName": "Alpine Horizon Adventures",
    "constitution": "Sole Proprietorship",
    "ownership": "Owned Commercial Premise",
    "tradeLicenseNo": "NMC/TL/2026/3412",
    "pan": "BBTPS5432M",
    "gstin": "11BBTPS5432M1Z2",
    "officeAddress": "Suite 4, Second Floor, Star Cinema Complex, M.G. Marg, Gangtok – 737101",
    "officeSizeStandard": "310 sq.ft ground-floor office with display counter and tour equipment storage room",
    "association": "Sikkim Amateur Mountaineering Association (SAMA)",
    "activitiesSummary": "Operates eco-trails in South and West Sikkim, Birdwatching itineraries in Maenam Wildlife Sanctuary, and village homestay bookings.",
    "partners": [
      {
        "name": "Passang Tshering Sherpa",
        "role": "Sole Proprietor",
        "phone": "9832223344",
        "aadhaar": "XXXX-XXXX-6612",
        "address": "Namchi Bazaar"
      }
    ],
    "staff": [
      {
        "name": "Lakpa Doma Sherpa",
        "role": "Trek Coordinator",
        "qualification": "Basic Mountaineering Course (HMI)",
        "training": "Hospitality & Guest Handling"
      }
    ],
    "ecoPractices": "Partnership with local panchayats for waste collection along trekking trails.",
    "officeEquipment": "3 workstations, VHF radio sets for trail emergencies, display racks and first aid kit.",
    "requiresInspection": true,
    "assignedIaOfficer": "Tashi Wangdi Lepcha",
    "assignedRole": "IA",
    "status": "Under Verification",
    "currentStage": "Level 1: Assigned for IA Physical Inspection",
    "inspectionStatus": "Scheduled for Physical Inspection",
    "inspectingOfficer": "Phurba Tamang (Inspecting Authority, Namchi)",
    "submittedDate": "03 Nov 2026, 02:30 PM",
    "lastUpdated": "05 Nov 2026, 11:45 AM",
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Passang Tshering Sherpa)",
        "date": "03 Nov 2026, 02:30 PM",
        "remarks": "Application submitted with Trade License NMC/TL/2026/3412 and property tax proof."
      },
      {
        "step": "Level 0 TO Verification Satisfactory & Assigned to IA",
        "actor": "Tshering Norbu Rai (Tourism Officer, Level 0)",
        "date": "05 Nov 2026, 11:45 AM",
        "remarks": "All statutory documents, COI, and municipal trade license verified in order. Assigned to Level 1 IA Phurba Tamang for on-site physical inspection."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "03 Nov 2026, 02:30 PM",
        "actorRole": "Citizen",
        "actorName": "Passang Tshering Sherpa",
        "action": "Application Submitted Online",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Application submitted with complete credentials."
      },
      {
        "timestamp": "05 Nov 2026, 11:45 AM",
        "actorRole": "Level 0 – Tourism Officer (TO)",
        "actorName": "Tshering Norbu Rai",
        "action": "Verified Statutory Credentials & Assigned to Level 1 IA for Physical Inspection",
        "stage": "Level 1: Assigned for IA Physical Inspection",
        "remarks": "Documents verified in order. Assigned for mandatory physical premises inspection."
      }
    ]
  },
  {
    "refNo": "SK-TBR-2026-TO-00103",
    "formConfig": "A",
    "category": "tour-operator",
    "categoryName": "Tour Operator Registration",
    "categoryCode": "TO",
    "applicantName": "Chungda Lepcha",
    "gender": "Male",
    "dob": "22 Sep 1985",
    "residentialProof": "Certificate of Identification (COI #COI-GTK-2010-441)",
    "address": "Development Area, Gangtok, Sikkim – 737101",
    "phone": "9832334455",
    "email": "chungda.lepcha@kanchenjungaeco.in",
    "website": "www.kanchenjungaeco.in",
    "district": "Gangtok",
    "eduQualification": "Master in Tourism Administration (MTA)",
    "techQualification": "Advanced Mountain Search & Rescue Certification",
    "training": "Wilderness Medical Society First Responder",
    "businessName": "Kanchenjunga Eco-Treks",
    "constitution": "Private Limited Company",
    "ownership": "Rented Commercial Office",
    "tradeLicenseNo": "GMC/TL/2025/1109",
    "pan": "CCPLC9876P",
    "gstin": "11CCPLC9876P1Z5",
    "officeAddress": "Suite 4, Denzong Cinema Building, Lal Bazaar, Gangtok – 737101",
    "officeSizeStandard": "480 sq.ft multi-room office suite with client briefing room",
    "association": "Adventure Tour Operators Association of India (ATOAI)",
    "activitiesSummary": "Mountaineering expeditions, high-altitude alpine passes, Goecha La & Singalila circuits.",
    "partners": [
      {
        "name": "Chungda Lepcha",
        "role": "Managing Director",
        "phone": "9832334455",
        "aadhaar": "XXXX-XXXX-7721",
        "address": "Development Area, Gangtok"
      }
    ],
    "staff": [
      {
        "name": "Norbu Lepcha",
        "role": "Operations Lead",
        "qualification": "Graduate",
        "training": "HMI Advanced Course"
      }
    ],
    "ecoPractices": "Zero-emission cooking fuel used during all field expeditions.",
    "officeEquipment": "5 PCs, client lounge, satellite communicators, and fire extinguishers.",
    "requiresInspection": true,
    "assignedRole": "TO",
    "status": "Returned for Clarification",
    "currentStage": "Returned to Citizen for Clarification",
    "returnRemarks": "Commercial office lease deed expired on 30 Sep 2026. Please upload renewed registered lease agreement with landlord NOC and updated municipal trade license renewal receipt.",
    "returnedBy": "Karma Lhendup Bhutia (Tourism Officer, Level 0)",
    "returnedDate": "06 Nov 2026, 03:20 PM",
    "submittedDate": "02 Nov 2026, 11:00 AM",
    "lastUpdated": "06 Nov 2026, 03:20 PM",
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Chungda Lepcha)",
        "date": "02 Nov 2026, 11:00 AM",
        "remarks": "Initial online submission."
      },
      {
        "step": "Application Returned to Citizen for Clarification by TO",
        "actor": "Karma Lhendup Bhutia (Tourism Officer, Level 0)",
        "date": "06 Nov 2026, 03:20 PM",
        "remarks": "Clarification Required: Office lease deed expired on 30 Sep 2026. Please upload renewed registered lease agreement with landlord NOC and updated municipal trade license renewal receipt."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "02 Nov 2026, 11:00 AM",
        "actorRole": "Citizen",
        "actorName": "Chungda Lepcha",
        "action": "Application Submitted Online",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Initial online submission."
      },
      {
        "timestamp": "06 Nov 2026, 03:20 PM",
        "actorRole": "Level 0 – Tourism Officer (TO)",
        "actorName": "Karma Lhendup Bhutia",
        "action": "Returned Application to Citizen for Clarification",
        "stage": "Returned to Citizen for Clarification",
        "remarks": "Commercial office lease deed expired. Upload renewed registered lease agreement with landlord NOC."
      }
    ]
  },
  {
    "refNo": "SK-TBR-2026-TO-00104",
    "formConfig": "A",
    "category": "tour-operator",
    "categoryName": "Tour Operator Registration",
    "categoryCode": "TO",
    "applicantName": "Dawa Norbu Bhutia",
    "gender": "Male",
    "dob": "12 Dec 1989",
    "residentialProof": "Certificate of Identification (COI #COI-GYL-2013-119)",
    "address": "Tadong 6th Mile, Gangtok, Sikkim – 737102",
    "phone": "9832445566",
    "email": "dawa.bhutia@khangchendzonga.in",
    "website": "www.khangchendzongatrailways.in",
    "district": "Gangtok",
    "eduQualification": "B.A. (History & Tourism)",
    "techQualification": "Trek Leader Certification (IHCAE Chemchey)",
    "training": "Wilderness Life Support & Camp Hygiene",
    "businessName": "Khangchendzonga Trailways",
    "constitution": "Registered Partnership Firm",
    "ownership": "Owned Commercial Premise",
    "tradeLicenseNo": "GMC/TL/2026/7788",
    "pan": "DDGNF8765L",
    "gstin": "11DDGNF8765L1Z1",
    "officeAddress": "Unit 301, 3rd Floor, Metro Point Building, Tadong, Gangtok – 737102",
    "officeSizeStandard": "360 sq.ft dedicated tour booking counter with equipment briefing lounge",
    "association": "Pelling Tourism Development Committee (PTDC)",
    "activitiesSummary": "Heritage tours, Kanchenjunga viewpoint treks, monastery circuits, and rural eco-trails.",
    "partners": [
      {
        "name": "Dawa Norbu Bhutia",
        "role": "Managing Partner",
        "phone": "9832445566",
        "aadhaar": "XXXX-XXXX-8832",
        "address": "Upper Pelling"
      },
      {
        "name": "Sonam Doma Bhutia",
        "role": "Partner",
        "phone": "9832445567",
        "aadhaar": "XXXX-XXXX-9943",
        "address": "Upper Pelling"
      }
    ],
    "staff": [
      {
        "name": "Mingma Tamang",
        "role": "Lead Guide",
        "qualification": "Class 12",
        "training": "HMI Basic Mountaineering"
      }
    ],
    "ecoPractices": "Plastic-free trails, water refill stations in office, and biodegradable waste composting.",
    "officeEquipment": "3 workstations, trail first aid kit, client consultation desks, and fire extinguisher.",
    "requiresInspection": true,
    "assignedIaOfficer": "Tashi Wangdi Lepcha",
    "assignedRole": "TO",
    "status": "Under Verification",
    "currentStage": "Level 0: IA Report Received – Pending TO Review",
    "inspectionStatus": "Submitted to TO",
    "inspectingOfficer": "Sangay Chopel Bhutia (Inspecting Authority, Gyalshing)",
    "inspectionReportDate": "08 Nov 2026, 04:30 PM",
    "inspectionDocName": "Inspection_Report_SK-TBR-2026-TO-00104.pdf",
    "inspectionDocSize": "1.9 MB",
    "inspectionFindings": "Commercial premises inspected at Tadong Metro Point. Office measures 450 sq.ft, adequate client seating, high-speed fiber internet, compliant fire extinguishers and trained mountaineering staff verified. Recommended for Grade B Tour Operator Registration.",
    "inspectionRemarks": "Premise fully compliant with Sikkim Registration of Tourist Trade Rules. Highly recommended for 3-Year statutory registration.",
    "inspectionRecommendation": "RECOMMENDED_FOR_APPROVAL",
    "submittedDate": "01 Nov 2026, 09:30 AM",
    "lastUpdated": "08 Nov 2026, 04:30 PM",
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Dawa Norbu Bhutia)",
        "date": "01 Nov 2026, 09:30 AM",
        "remarks": "Application submitted with ownership documents and trade license."
      },
      {
        "step": "Level 0 TO Verification Satisfactory & Assigned to IA",
        "actor": "Lakpa Doma Subba (Tourism Officer, Level 0)",
        "date": "03 Nov 2026, 11:15 AM",
        "remarks": "Level 0 scrutiny cleared. Forwarded to Level 1 IA Sangay Chopel Bhutia for physical on-site verification."
      },
      {
        "step": "Level 1 IA Physical Inspection Report Submitted to TO",
        "actor": "Sangay Chopel Bhutia (Inspecting Authority, Level 1)",
        "date": "08 Nov 2026, 04:30 PM",
        "remarks": "On-site physical inspection completed. Premises, fire safety norms, and staff manifests verified in order. Uploaded Physical_Inspection_Report_SK-TBR-2026-TO-00104.pdf and transmitted to Level 0 TO for review."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "01 Nov 2026, 09:30 AM",
        "actorRole": "Citizen",
        "actorName": "Dawa Norbu Bhutia",
        "action": "Application Submitted Online",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Application submitted online with ownership proof."
      },
      {
        "timestamp": "03 Nov 2026, 11:15 AM",
        "actorRole": "Level 0 – Tourism Officer (TO)",
        "actorName": "Lakpa Doma Subba",
        "action": "Verified Statutory Credentials & Assigned to Level 1 IA for Physical Inspection",
        "stage": "Level 1: Assigned for IA Physical Inspection",
        "remarks": "Statutory credentials verified. Assigned to Level 1 IA for on-site inspection."
      },
      {
        "timestamp": "08 Nov 2026, 04:30 PM",
        "actorRole": "Level 1 – Inspecting Authority (IA)",
        "actorName": "Sangay Chopel Bhutia",
        "action": "Submitted Physical Inspection Report to Level 0 TO",
        "stage": "Level 0: IA Report Received – Pending TO Review",
        "remarks": "Physical premises verified compliant. Uploaded report document and transmitted to TO."
      }
    ],
    "inspectionDate": "03 Nov 2026, 02:00 PM"
  },
  {
    "refNo": "SK-TBR-2026-TO-00105",
    "formConfig": "A",
    "category": "tour-operator",
    "categoryName": "Tour Operator Registration",
    "categoryCode": "TO",
    "applicantName": "Tenzing Wangchuk Lepcha",
    "gender": "Male",
    "dob": "05 Jul 1987",
    "residentialProof": "Certificate of Identification (COI #COI-GTK-2011-872)",
    "address": "Tadong, Below 5th Mile, Gangtok, Sikkim – 737102",
    "phone": "9832556677",
    "email": "tenzing.wangchuk@singalilatours.in",
    "website": "www.singalilatours.in",
    "district": "Gangtok",
    "eduQualification": "Graduate (B.Sc. Environmental Science)",
    "techQualification": "Mountaineering & High Altitude Safety Course (HMI Darjeeling)",
    "training": "First Aid & CPR Certified (Indian Red Cross)",
    "businessName": "Singalila Ridge Expeditions",
    "constitution": "Registered Partnership Firm",
    "ownership": "Owned Commercial Premise",
    "tradeLicenseNo": "GMC/TL/2026/9021",
    "pan": "EETWL7654K",
    "gstin": "11EETWL7654K1Z9",
    "officeAddress": "Shop #4, Ridge View Complex, MG Marg, Gangtok – 737101",
    "officeSizeStandard": "350 sq.ft commercial office with client consultation lounge and digital ticketing counter",
    "association": "Travel Agents Association of Sikkim (TAAS) & SATO Member",
    "activitiesSummary": "Specialized in guided eco-treks along Singalila Ridge, Goecha La circuits, and nature tourism packages.",
    "partners": [
      {
        "name": "Tenzing Wangchuk Lepcha",
        "role": "Managing Partner",
        "phone": "9832556677",
        "aadhaar": "XXXX-XXXX-1122",
        "address": "Tadong, Gangtok"
      },
      {
        "name": "Phurba Lhamu Bhutia",
        "role": "Partner",
        "phone": "9832556678",
        "aadhaar": "XXXX-XXXX-3344",
        "address": "Tadong, Gangtok"
      }
    ],
    "staff": [
      {
        "name": "Dawa Sherpa",
        "role": "Senior Guide",
        "qualification": "Class 12",
        "training": "HMI Advanced Course"
      }
    ],
    "ecoPractices": "Strict zero-plastic policy, Leave-No-Trace trail ethics, and solar-powered camp logistics.",
    "officeEquipment": "4 workstations, client lounge, high-speed fiber internet, and fire extinguisher.",
    "requiresInspection": true,
    "assignedIaOfficer": "Tashi Wangdi Lepcha",
    "assignedRole": "DTO",
    "status": "Approved",
    "currentStage": "Approved – Certificate Issued",
    "certificateNo": "SK-TCD-REG-2026-TO-00105",
    "validUntil": "10 Nov 2029",
    "approvalDate": "10 Nov 2026",
    "approvingOfficer": "Pema Dorjee Sherpa, District Tourism Officer (DTO)",
    "dtoRemarks": "Statutory approval granted under The Sikkim Registration of Tourist Trade Rules. 3-Year Form 3 Registration Certificate issued.",
    "inspectingOfficer": "Tashi Wangdi Lepcha (Inspecting Authority, Gangtok)",
    "inspectionReportDate": "05 Nov 2026, 03:00 PM",
    "inspectionDocName": "Physical_Inspection_Report_SK-TBR-2026-TO-00105.pdf",
    "inspectionDocSize": "1.8 MB",
    "inspectionFindings": "Commercial tour office at Ridge View Complex physically inspected. All fire safety extinguishers, equipment storage, and staff training credentials verified in top order.",
    "inspectionRemarks": "Recommended for unconditional statutory approval.",
    "toInspectionReviewRemarks": "Level 0 TO reviewed IA inspection report and verified all prerequisites. Endorsed and recommended for DTO approval.",
    "submittedDate": "28 Oct 2026, 10:00 AM",
    "lastUpdated": "10 Nov 2026, 04:00 PM",
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Tenzing Wangchuk Lepcha)",
        "date": "28 Oct 2026, 10:00 AM",
        "remarks": "Application submitted online with required documents."
      },
      {
        "step": "Level 0 TO Verification Satisfactory & Assigned to IA",
        "actor": "Karma Lhendup Bhutia (Tourism Officer, Level 0)",
        "date": "31 Oct 2026, 02:30 PM",
        "remarks": "Documents and trade license verified in order. Assigned to Level 1 IA Tashi Wangdi Lepcha for physical inspection."
      },
      {
        "step": "Level 1 IA Physical Inspection Report Submitted to TO",
        "actor": "Tashi Wangdi Lepcha (Inspecting Authority, Level 1)",
        "date": "05 Nov 2026, 03:00 PM",
        "remarks": "Physical premises verified. Uploaded Physical_Inspection_Report_SK-TBR-2026-TO-00105.pdf and submitted to Level 0 TO."
      },
      {
        "step": "Level 0 TO Reviewed IA Report & Forwarded to DTO",
        "actor": "Karma Lhendup Bhutia (Tourism Officer, Level 0)",
        "date": "07 Nov 2026, 11:30 AM",
        "remarks": "Level 0 TO reviewed IA physical inspection report. Endorsed and forwarded to DTO for final sanction."
      },
      {
        "step": "Final Approval Granted & Certificate Issued",
        "actor": "Pema Dorjee Sherpa (District Tourism Officer, Level 2)",
        "date": "10 Nov 2026, 04:00 PM",
        "remarks": "Statutory sanction granted. Registration Certificate #SK-TCD-REG-2026-TO-00105 generated with 3-year validity until 10 Nov 2029."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "28 Oct 2026, 10:00 AM",
        "actorRole": "Citizen",
        "actorName": "Tenzing Wangchuk Lepcha",
        "action": "Application Submitted Online",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Application submitted online."
      },
      {
        "timestamp": "31 Oct 2026, 02:30 PM",
        "actorRole": "Level 0 – Tourism Officer (TO)",
        "actorName": "Karma Lhendup Bhutia",
        "action": "Verified Statutory Credentials & Assigned to Level 1 IA for Physical Inspection",
        "stage": "Level 1: Assigned for IA Physical Inspection",
        "remarks": "Verified credentials. Mandated IA on-site inspection."
      },
      {
        "timestamp": "05 Nov 2026, 03:00 PM",
        "actorRole": "Level 1 – Inspecting Authority (IA)",
        "actorName": "Tashi Wangdi Lepcha",
        "action": "Submitted Physical Inspection Report to Level 0 TO",
        "stage": "Level 0: IA Report Received – Pending TO Review",
        "remarks": "Physical inspection report uploaded and transmitted to TO."
      },
      {
        "timestamp": "07 Nov 2026, 11:30 AM",
        "actorRole": "Level 0 – Tourism Officer (TO)",
        "actorName": "Karma Lhendup Bhutia",
        "action": "Endorsed IA Physical Inspection Report & Forwarded to DTO for Statutory Sanction",
        "stage": "Level 2: Pending DTO Sanction",
        "remarks": "TO endorsed IA inspection report. Forwarded to DTO."
      },
      {
        "timestamp": "10 Nov 2026, 04:00 PM",
        "actorRole": "Level 2 – District Tourism Officer (DTO)",
        "actorName": "Pema Dorjee Sherpa",
        "action": "Granted Statutory Approval & Issued Form 3 Certificate",
        "stage": "Approved – Certificate Issued",
        "remarks": "Registration approved. Form 3 Certificate generated."
      }
    ]
  },
  {
    "refNo": "SK-TBR-2026-TA-00201",
    "formConfig": "A",
    "category": "travel-agent",
    "categoryName": "Travel Agent Registration",
    "categoryCode": "TA",
    "applicantName": "Tshering Ongmu Bhutia",
    "gender": "Female",
    "dob": "20 Jan 1991",
    "residentialProof": "Certificate of Identification (COI #COI-GTK-2014-554)",
    "address": "Deorali Bazaar, Gangtok, Sikkim – 737102",
    "phone": "9832667788",
    "email": "tshering.ongmu@sikkimbliss.in",
    "website": "www.sikkimblisstravels.in",
    "district": "Gangtok",
    "eduQualification": "Master in Business Administration (Tourism & Hospitality)",
    "techQualification": "IATA / UFTAA Certified Travel Consultant",
    "training": "Digital Ticketing & GDS Operations (Amadeus/Galileo)",
    "businessName": "Sikkim Bliss Travels & Tours",
    "constitution": "Sole Proprietorship",
    "ownership": "Rented Commercial Office",
    "tradeLicenseNo": "GMC/TL/2026/4102",
    "pan": "FFTOB6543J",
    "gstin": "11FFTOB6543J1Z4",
    "officeAddress": "First Floor, Deorali Taxi Stand Complex, Gangtok – 737102",
    "officeSizeStandard": "280 sq.ft commercial ticketing office with customer counter",
    "association": "Travel Agents Association of Sikkim (TAAS)",
    "activitiesSummary": "Air/rail ticketing, customized package tours, hotel reservations, and helicopter joy ride bookings.",
    "partners": [
      {
        "name": "Tshering Ongmu Bhutia",
        "role": "Sole Proprietor",
        "phone": "9832667788",
        "aadhaar": "XXXX-XXXX-4433",
        "address": "Deorali Bazaar, Gangtok"
      }
    ],
    "staff": [
      {
        "name": "Bikram Chettri",
        "role": "Ticketing Executive",
        "qualification": "Graduate (B.Com)",
        "training": "IATA Foundation"
      }
    ],
    "ecoPractices": "100% digital e-tickets and paperless client itineraries.",
    "officeEquipment": "3 desktop computers, multi-function laser printer, client chairs, and fire extinguisher.",
    "requiresInspection": true,
    "assignedRole": "TO",
    "status": "Submitted",
    "currentStage": "Level 0: Pending TO Verification",
    "submittedDate": "05 Nov 2026, 11:20 AM",
    "lastUpdated": "05 Nov 2026, 11:20 AM",
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Tshering Ongmu Bhutia)",
        "date": "05 Nov 2026, 11:20 AM",
        "remarks": "Application submitted via Single Sign-On Portal."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "05 Nov 2026, 11:20 AM",
        "actorRole": "Citizen",
        "actorName": "Tshering Ongmu Bhutia",
        "action": "Application Submitted Online",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Application submitted via Single Sign-On Portal."
      }
    ]
  },
  {
    "refNo": "SK-TBR-2026-TA-00202",
    "formConfig": "A",
    "category": "travel-agent",
    "categoryName": "Travel Agent Registration",
    "categoryCode": "TA",
    "applicantName": "Mingma Norbu Sherpa",
    "gender": "Male",
    "dob": "15 Mar 1986",
    "residentialProof": "Certificate of Identification (COI #COI-NAM-2012-781)",
    "address": "Tadong 5th Mile, Gangtok, Sikkim – 737102",
    "phone": "9832778899",
    "email": "mingma.sherpa@southsikkimholidays.in",
    "website": "www.southsikkimholidays.in",
    "district": "Gangtok",
    "eduQualification": "Graduate (B.A. General)",
    "techQualification": "Certificate in Travel Agency Operations (Sikkim Univ)",
    "training": "Customer Relations Management (State Tourism Board)",
    "businessName": "South Sikkim Holiday Planners",
    "constitution": "Registered Partnership Firm",
    "ownership": "Rented Commercial Office",
    "tradeLicenseNo": "NMC/TL/2026/8921",
    "pan": "GGMNS5432H",
    "gstin": "11GGMNS5432H1Z6",
    "officeAddress": "Shop #8, First Floor, Metro Point Complex, Tadong, Gangtok – 737102",
    "officeSizeStandard": "300 sq.ft commercial office with front consultation desk",
    "association": "Namchi Tour & Travel Operators Association",
    "activitiesSummary": "Pilgrimage tours to Char Dham and Samdruptse, South Sikkim village excursions, and vehicle rentals.",
    "partners": [
      {
        "name": "Mingma Norbu Sherpa",
        "role": "Managing Partner",
        "phone": "9832778899",
        "aadhaar": "XXXX-XXXX-8822",
        "address": "Namchi"
      },
      {
        "name": "Pempa Doma Sherpa",
        "role": "Partner",
        "phone": "9832778890",
        "aadhaar": "XXXX-XXXX-9911",
        "address": "Namchi"
      }
    ],
    "staff": [
      {
        "name": "Rinchen Lepcha",
        "role": "Booking Clerk",
        "qualification": "Class 12",
        "training": "Basic Ticketing"
      }
    ],
    "ecoPractices": "Promotes local organic homestays and community cultural tours.",
    "officeEquipment": "2 workstations, broadband internet, client sofas, and fire extinguisher.",
    "requiresInspection": true,
    "assignedIaOfficer": "Tashi Wangdi Lepcha",
    "assignedRole": "IA",
    "status": "Under Verification",
    "currentStage": "Level 1: Physical Inspection Scheduled",
    "inspectionStatus": "Visit Scheduled",
    "inspectionDate": "08 Nov 2026, 11:00 AM",
    "inspectingOfficer": "Phurba Tamang (Inspecting Authority, Namchi)",
    "submittedDate": "03 Nov 2026, 03:45 PM",
    "lastUpdated": "06 Nov 2026, 12:15 PM",
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Mingma Norbu Sherpa)",
        "date": "03 Nov 2026, 03:45 PM",
        "remarks": "Application submitted online with required proofs."
      },
      {
        "step": "Level 0 TO Verification Satisfactory & Assigned to IA",
        "actor": "Tshering Norbu Rai (Tourism Officer, Level 0)",
        "date": "05 Nov 2026, 10:30 AM",
        "remarks": "Credentials checked in order. Assigned to Level 1 IA Phurba Tamang for physical inspection."
      },
      {
        "step": "Level 1 IA Physical Inspection Visit Scheduled",
        "actor": "Phurba Tamang (Inspecting Authority, Level 1)",
        "date": "06 Nov 2026, 12:15 PM",
        "remarks": "On-site commercial premise verification scheduled for 15 Nov 2026, 11:30 AM at Shop #8, District Shopping Centre."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "03 Nov 2026, 03:45 PM",
        "actorRole": "Citizen",
        "actorName": "Mingma Norbu Sherpa",
        "action": "Application Submitted Online",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Application submitted online."
      },
      {
        "timestamp": "05 Nov 2026, 10:30 AM",
        "actorRole": "Level 0 – Tourism Officer (TO)",
        "actorName": "Tshering Norbu Rai",
        "action": "Verified Statutory Credentials & Assigned to Level 1 IA for Physical Inspection",
        "stage": "Level 1: Assigned for IA Physical Inspection",
        "remarks": "Verified credentials. Forwarded to IA."
      },
      {
        "timestamp": "06 Nov 2026, 12:15 PM",
        "actorRole": "Level 1 – Inspecting Authority (IA)",
        "actorName": "Phurba Tamang",
        "action": "Scheduled On-Site Physical Inspection Visit",
        "stage": "Level 1: Physical Inspection Scheduled",
        "remarks": "Inspection scheduled for 15 Nov 2026, 11:30 AM."
      }
    ]
  },
  {
    "refNo": "SK-TBR-2026-TA-00203",
    "formConfig": "A",
    "category": "travel-agent",
    "categoryName": "Travel Agent Registration",
    "categoryCode": "TA",
    "applicantName": "Sonam Palden Bhutia",
    "gender": "Male",
    "dob": "11 Nov 1984",
    "residentialProof": "Certificate of Identification (COI #COI-NAM-2009-192)",
    "address": "Damthang Road, Namchi, Sikkim – 737126",
    "phone": "9832889900",
    "email": "sonam.palden@namchiexpress.in",
    "website": "www.namchiexpress.in",
    "district": "Namchi",
    "eduQualification": "B.A. (Pass)",
    "techQualification": "Computer Application & Accounting Diploma",
    "training": "Customer Service Orientation",
    "businessName": "Namchi Express Travel Desk",
    "constitution": "Sole Proprietorship",
    "ownership": "Rented Commercial Office",
    "tradeLicenseNo": "NMC/TL/2025/2219",
    "pan": "HHSPB4321G",
    "gstin": "11HHSPB4321G1Z7",
    "officeAddress": "Damthang Road, Near Helipad, Namchi – 737126",
    "officeSizeStandard": "240 sq.ft booking booth",
    "association": "Local Taxi & Travel Drivers Syndicate",
    "activitiesSummary": "Point-to-point tourist vehicle arrangements and budget package bookings.",
    "partners": [
      {
        "name": "Sonam Palden Bhutia",
        "role": "Sole Proprietor",
        "phone": "9832889900",
        "aadhaar": "XXXX-XXXX-6655",
        "address": "Damthang Road"
      }
    ],
    "staff": [],
    "ecoPractices": "Waste disposal bins at vehicle pickup bays.",
    "officeEquipment": "1 desktop computer, internet connection, printer.",
    "requiresInspection": true,
    "assignedRole": "TO",
    "status": "Returned for Clarification",
    "currentStage": "Returned to Citizen for Clarification",
    "returnRemarks": "Aadhaar Card uploaded does not match applicant name spelling in Certificate of Identification. Please upload official name correction deed or updated Aadhaar card copy.",
    "returnedBy": "Tshering Norbu Rai (Tourism Officer, Level 0)",
    "returnedDate": "05 Nov 2026, 04:10 PM",
    "submittedDate": "01 Nov 2026, 02:00 PM",
    "lastUpdated": "05 Nov 2026, 04:10 PM",
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Sonam Palden Bhutia)",
        "date": "01 Nov 2026, 02:00 PM",
        "remarks": "Initial online submission."
      },
      {
        "step": "Application Returned to Citizen for Clarification by TO",
        "actor": "Tshering Norbu Rai (Tourism Officer, Level 0)",
        "date": "05 Nov 2026, 04:10 PM",
        "remarks": "Clarification Required: Aadhaar Card uploaded does not match applicant name spelling in COI. Please re-upload updated Aadhaar copy."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "01 Nov 2026, 02:00 PM",
        "actorRole": "Citizen",
        "actorName": "Sonam Palden Bhutia",
        "action": "Application Submitted Online",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Initial online submission."
      },
      {
        "timestamp": "05 Nov 2026, 04:10 PM",
        "actorRole": "Level 0 – Tourism Officer (TO)",
        "actorName": "Tshering Norbu Rai",
        "action": "Returned Application to Citizen for Clarification",
        "stage": "Returned to Citizen for Clarification",
        "remarks": "Aadhaar name spelling mismatch with COI."
      }
    ]
  },
  {
    "refNo": "SK-TBR-2026-TA-00204",
    "formConfig": "A",
    "category": "travel-agent",
    "categoryName": "Travel Agent Registration",
    "categoryCode": "TA",
    "applicantName": "Rinzing Wangdi Lepcha",
    "gender": "Male",
    "dob": "25 May 1988",
    "residentialProof": "Certificate of Identification (COI #COI-GTK-2013-882)",
    "address": "Tadong, Below Sikkim University, Gangtok – 737102",
    "phone": "9832990011",
    "email": "rinzing.lepcha@sikkimgateway.in",
    "website": "www.sikkimgateway.in",
    "district": "Gangtok",
    "eduQualification": "Graduate (B.Sc. IT)",
    "techQualification": "Diploma in Airline Ticketing & Tourism Management",
    "training": "Advanced Sabre / Galileo Ticketing Certified",
    "businessName": "Sikkim Gateway Holidays",
    "constitution": "Private Limited Company",
    "ownership": "Owned Commercial Premise",
    "tradeLicenseNo": "GMC/TL/2026/6633",
    "pan": "IIRWL3210F",
    "gstin": "11IIRWL3210F1Z8",
    "officeAddress": "Unit 2, City Centre Mall, 5th Mile, Tadong, Gangtok – 737102",
    "officeSizeStandard": "380 sq.ft fully furnished digital travel lounge",
    "association": "Travel Agents Association of Sikkim (TAAS) & IATO",
    "activitiesSummary": "Corporate conferences, luxury car rentals, customized North Sikkim tour permits, and flight bookings.",
    "partners": [
      {
        "name": "Rinzing Wangdi Lepcha",
        "role": "Managing Director",
        "phone": "9832990011",
        "aadhaar": "XXXX-XXXX-1199",
        "address": "Tadong"
      }
    ],
    "staff": [
      {
        "name": "Pooja Sharma",
        "role": "Senior Travel Consultant",
        "qualification": "Graduate (B.A.)",
        "training": "IATA Certified"
      },
      {
        "name": "Sonam Tshering Lepcha",
        "role": "Permits Officer",
        "qualification": "Class 12",
        "training": "Government Liaison"
      }
    ],
    "ecoPractices": "Carbon-offset options integrated in travel packages; reusable metal water bottles provided to clients.",
    "officeEquipment": "4 workstations, server, video conferencing screen, digital ticketing terminals, and fire extinguisher.",
    "requiresInspection": true,
    "assignedIaOfficer": "Tashi Wangdi Lepcha",
    "assignedRole": "DTO",
    "status": "Under Verification",
    "currentStage": "Level 2: Pending DTO Sanction",
    "inspectionStatus": "Inspection Cleared & TO Endorsed",
    "inspectingOfficer": "Tashi Wangdi Lepcha (Inspecting Authority, Gangtok)",
    "inspectionReportDate": "07 Nov 2026, 02:45 PM",
    "inspectionDocName": "Inspection_Report_SK-TBR-2026-TA-00204.pdf",
    "inspectionDocSize": "2.1 MB",
    "inspectionFindings": "Physical premise inspected. Verified 300 sq.ft commercial ticketing office with digital reservation counter and fire extinguisher. Recommended for Grade B Travel Agent Registration.",
    "inspectionRemarks": "Outstanding infrastructure and compliance. Highly recommended for statutory registration.",
    "toInspectionReviewRemarks": "Level 0 TO reviewed IA physical inspection report. All prerequisites and trade credentials verified in order. Endorsed and forwarded to Level 2 DTO for final statutory sanction.",
    "submittedDate": "29 Oct 2026, 11:15 AM",
    "lastUpdated": "09 Nov 2026, 03:30 PM",
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Rinzing Wangdi Lepcha)",
        "date": "29 Oct 2026, 11:15 AM",
        "remarks": "Application submitted with complete corporate documents."
      },
      {
        "step": "Level 0 TO Verification Satisfactory & Assigned to IA",
        "actor": "Karma Lhendup Bhutia (Tourism Officer, Level 0)",
        "date": "02 Nov 2026, 10:00 AM",
        "remarks": "Statutory credentials verified. Assigned to Level 1 IA Tashi Wangdi Lepcha for physical inspection."
      },
      {
        "step": "Level 1 IA Physical Inspection Report Submitted to TO",
        "actor": "Tashi Wangdi Lepcha (Inspecting Authority, Level 1)",
        "date": "07 Nov 2026, 02:45 PM",
        "remarks": "Physical premises verified compliant. Uploaded Physical_Inspection_Report_SK-TBR-2026-TA-00204.pdf and transmitted to Level 0 TO."
      },
      {
        "step": "Level 0 TO Reviewed IA Report & Forwarded to DTO",
        "actor": "Karma Lhendup Bhutia (Tourism Officer, Level 0)",
        "date": "09 Nov 2026, 03:30 PM",
        "remarks": "Level 0 TO reviewed IA inspection report. Endorsed and forwarded to DTO for final sanction."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "29 Oct 2026, 11:15 AM",
        "actorRole": "Citizen",
        "actorName": "Rinzing Wangdi Lepcha",
        "action": "Application Submitted Online",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Application submitted online."
      },
      {
        "timestamp": "02 Nov 2026, 10:00 AM",
        "actorRole": "Level 0 – Tourism Officer (TO)",
        "actorName": "Karma Lhendup Bhutia",
        "action": "Verified Statutory Credentials & Assigned to Level 1 IA for Physical Inspection",
        "stage": "Level 1: Assigned for IA Physical Inspection",
        "remarks": "Verified credentials. Forwarded to IA."
      },
      {
        "timestamp": "07 Nov 2026, 02:45 PM",
        "actorRole": "Level 1 – Inspecting Authority (IA)",
        "actorName": "Tashi Wangdi Lepcha",
        "action": "Submitted Physical Inspection Report to Level 0 TO",
        "stage": "Level 0: IA Report Received – Pending TO Review",
        "remarks": "Physical premises verified compliant. Uploaded report document and transmitted to TO."
      },
      {
        "timestamp": "09 Nov 2026, 03:30 PM",
        "actorRole": "Level 0 – Tourism Officer (TO)",
        "actorName": "Karma Lhendup Bhutia",
        "action": "Endorsed IA Physical Inspection Report & Forwarded to DTO for Statutory Sanction",
        "stage": "Level 2: Pending DTO Sanction",
        "remarks": "TO endorsed IA inspection report. Forwarded to DTO."
      }
    ],
    "gradeAssigned": "Grade B",
    "registrationFee": 7000
  },
  {
    "refNo": "SK-TBR-2026-TA-00205",
    "formConfig": "A",
    "category": "travel-agent",
    "categoryName": "Travel Agent Registration",
    "categoryCode": "TA",
    "applicantName": "Nim Lhamu Bhutia",
    "gender": "Female",
    "dob": "14 Feb 1989",
    "residentialProof": "Certificate of Identification (COI #COI-MNG-2012-321)",
    "address": "Deorali, Gangtok, Sikkim – 737102",
    "phone": "9832001122",
    "email": "nim.lhamu@northsikkimhighlands.in",
    "website": "www.northsikkimhighlands.in",
    "district": "Gangtok",
    "eduQualification": "Graduate (B.A. Geography)",
    "techQualification": "Certificate in Rural Tourism & Travel Management",
    "training": "Disaster Preparedness & Landslide Safety Protocol",
    "businessName": "North Sikkim Highland Travels",
    "constitution": "Sole Proprietorship",
    "ownership": "Owned Commercial Premise",
    "tradeLicenseNo": "MNC/TL/2026/1029",
    "pan": "JJNLB2109E",
    "gstin": "11JJNLB2109E1Z9",
    "officeAddress": "Shop #14, Deorali Motor Stand, Gangtok – 737102",
    "officeSizeStandard": "260 sq.ft office with travel information center",
    "association": "Mangan Travel Operators Union",
    "activitiesSummary": "Permit facilitation for Gurudongmar Lake, Yumthang Valley, and high-altitude border circuits.",
    "partners": [
      {
        "name": "Nim Lhamu Bhutia",
        "role": "Sole Proprietor",
        "phone": "9832001122",
        "aadhaar": "XXXX-XXXX-9900",
        "address": "Mangan Bazaar"
      }
    ],
    "staff": [
      {
        "name": "Kezang Lepcha",
        "role": "Permit Agent",
        "qualification": "Class 12",
        "training": "Local Logistics"
      }
    ],
    "ecoPractices": "Zero-plastic guidelines enforced for all tourist groups entering Lachung and Lachen.",
    "officeEquipment": "2 computers, document scanner, emergency first aid kit, and fire extinguisher.",
    "requiresInspection": true,
    "assignedIaOfficer": "Dawa Tshering Lepcha",
    "assignedRole": "DTO",
    "status": "Approved",
    "currentStage": "Approved – Certificate Issued",
    "certificateNo": "SK-TA-GTK-2026-0031",
    "validUntil": "08 Nov 2029",
    "approvalDate": "08 Nov 2026",
    "approvingOfficer": "Rinzing Ongmu Bhutia, District Tourism Officer (DTO)",
    "dtoRemarks": "Statutory sanction granted. Form 3 Certificate issued with 3-year validity.",
    "inspectingOfficer": "Dawa Tshering Lepcha (Inspecting Authority, Mangan)",
    "inspectionReportDate": "03 Nov 2026, 01:15 PM",
    "inspectionDocName": "Physical_Inspection_Report_SK-TBR-2026-TA-00205.pdf",
    "inspectionDocSize": "1.7 MB",
    "inspectionFindings": "Commercial travel agency office at Mangan Main Bazaar physically verified. All safety standards, municipal trade license, and permit advisory manuals verified in order.",
    "toInspectionReviewRemarks": "Level 0 TO reviewed IA inspection report. Fully compliant. Forwarded to DTO for sanction.",
    "submittedDate": "25 Oct 2026, 10:30 AM",
    "lastUpdated": "08 Nov 2026, 02:00 PM",
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Nim Lhamu Bhutia)",
        "date": "25 Oct 2026, 10:30 AM",
        "remarks": "Application submitted online with required proofs."
      },
      {
        "step": "Level 0 TO Verification Satisfactory & Assigned to IA",
        "actor": "Chewang Norbu Bhutia (Tourism Officer, Level 0)",
        "date": "28 Oct 2026, 11:00 AM",
        "remarks": "Verified credentials. Forwarded to Level 1 IA Dawa Tshering Lepcha for physical inspection."
      },
      {
        "step": "Level 1 IA Physical Inspection Report Submitted to TO",
        "actor": "Dawa Tshering Lepcha (Inspecting Authority, Level 1)",
        "date": "03 Nov 2026, 01:15 PM",
        "remarks": "Physical premises verified compliant. Uploaded report document and transmitted to Level 0 TO."
      },
      {
        "step": "Level 0 TO Reviewed IA Report & Forwarded to DTO",
        "actor": "Chewang Norbu Bhutia (Tourism Officer, Level 0)",
        "date": "06 Nov 2026, 10:30 AM",
        "remarks": "Level 0 TO reviewed IA inspection report. Endorsed and forwarded to DTO for final sanction."
      },
      {
        "step": "Final Approval Granted & Certificate Issued",
        "actor": "Rinzing Ongmu Bhutia (District Tourism Officer, Level 2)",
        "date": "08 Nov 2026, 02:00 PM",
        "remarks": "Statutory sanction granted. Registration Certificate #SK-TCD-REG-2026-TA-00205 generated with 3-year validity until 08 Nov 2029."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "25 Oct 2026, 10:30 AM",
        "actorRole": "Citizen",
        "actorName": "Nim Lhamu Bhutia",
        "action": "Application Submitted Online",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Application submitted online."
      },
      {
        "timestamp": "28 Oct 2026, 11:00 AM",
        "actorRole": "Level 0 – Tourism Officer (TO)",
        "actorName": "Chewang Norbu Bhutia",
        "action": "Verified Statutory Credentials & Assigned to Level 1 IA for Physical Inspection",
        "stage": "Level 1: Assigned for IA Physical Inspection",
        "remarks": "Verified credentials. Mandated IA inspection."
      },
      {
        "timestamp": "03 Nov 2026, 01:15 PM",
        "actorRole": "Level 1 – Inspecting Authority (IA)",
        "actorName": "Dawa Tshering Lepcha",
        "action": "Submitted Physical Inspection Report to Level 0 TO",
        "stage": "Level 0: IA Report Received – Pending TO Review",
        "remarks": "Physical inspection report uploaded and transmitted to TO."
      },
      {
        "timestamp": "06 Nov 2026, 10:30 AM",
        "actorRole": "Level 0 – Tourism Officer (TO)",
        "actorName": "Chewang Norbu Bhutia",
        "action": "Endorsed IA Physical Inspection Report & Forwarded to DTO for Statutory Sanction",
        "stage": "Level 2: Pending DTO Sanction",
        "remarks": "TO endorsed IA inspection report. Forwarded to DTO."
      },
      {
        "timestamp": "08 Nov 2026, 02:00 PM",
        "actorRole": "Level 2 – District Tourism Officer (DTO)",
        "actorName": "Rinzing Ongmu Bhutia",
        "action": "Granted Statutory Approval & Issued Form 3 Certificate",
        "stage": "Approved – Certificate Issued",
        "remarks": "Registration approved. Form 3 Certificate generated."
      }
    ],
    "paymentActivated": true,
    "paymentStatus": "Paid",
    "registrationFee": 7000,
    "amountPaid": 7000
  },
  {
    "refNo": "SK-TBR-2026-DLR-00301",
    "formConfig": "B",
    "category": "dealer",
    "categoryName": "Equipment Dealer Registration",
    "categoryCode": "DLR",
    "applicantName": "Phurba Tshering Lepcha",
    "fatherName": "Late Dorjee Lepcha",
    "gender": "Male",
    "dob": "16 Apr 1983",
    "residentialProof": "Certificate of Identification (COI #COI-GTK-2008-661)",
    "coiNo": "COI-GTK-2008-661",
    "address": "Syari, Below High Court, Gangtok, Sikkim – 737102",
    "phone": "9832112233",
    "email": "phurba.lepcha@sikkimmountaingear.in",
    "district": "Gangtok",
    "businessName": "Sikkim Mountain Gear & Trekking Supplies",
    "constitution": "Sole Proprietorship",
    "ownership": "Rented Commercial Showroom",
    "leaseValidUntil": "31 Mar 2029",
    "tradeLicenseNo": "GMC/SHOP/2026/5541",
    "pan": "KKPTL1098D",
    "gstin": "11KKPTL1098D1Z3",
    "officeAddress": "Shop #14, Super Market Complex, Gangtok – 737101",
    "premisesArea": "290 sq.ft commercial showroom with safety equipment display",
    "fireSafetyCert": "Certified ABC Dry Powder Extinguisher (Valid till Dec 2027)",
    "firstAidAvailable": true,
    "equipmentTypes": "Mountaineering Ropes (UIAA/CE), Harnesses, Carabiners, Sleeping Bags (-20C), Tents, Snow Crampons, Trekking Poles",
    "inventoryValuation": "Rs. 18,50,000/- certified inventory stock",
    "requiresInspection": true,
    "assignedRole": "TO",
    "status": "Submitted",
    "currentStage": "Level 0: Pending TO Verification",
    "submittedDate": "06 Nov 2026, 09:15 AM",
    "lastUpdated": "06 Nov 2026, 09:15 AM",
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Phurba Tshering Lepcha)",
        "date": "06 Nov 2026, 09:15 AM",
        "remarks": "Application submitted with Shop Act license and gear stock manifest."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "06 Nov 2026, 09:15 AM",
        "actorRole": "Citizen",
        "actorName": "Phurba Tshering Lepcha",
        "action": "Application Submitted Online",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Application submitted online."
      }
    ]
  },
  {
    "refNo": "SK-TBR-2026-DLR-00302",
    "formConfig": "B",
    "category": "dealer",
    "categoryName": "Equipment Dealer Registration",
    "categoryCode": "DLR",
    "applicantName": "Karma Tshering Bhutia",
    "fatherName": "Tashi Bhutia",
    "gender": "Male",
    "dob": "24 Aug 1985",
    "residentialProof": "Certificate of Identification (COI #COI-GTK-2010-883)",
    "coiNo": "COI-GTK-2010-883",
    "address": "Tibet Road, Gangtok, Sikkim – 737101",
    "phone": "9832224455",
    "email": "karma.bhutia@alpinehardware.in",
    "district": "Gangtok",
    "businessName": "Alpine Hardware & Climbing Equipments",
    "constitution": "Registered Partnership Firm",
    "ownership": "Rented Commercial Showroom",
    "leaseValidUntil": "30 Jun 2028",
    "tradeLicenseNo": "GMC/SHOP/2026/6672",
    "pan": "LLKTB0987C",
    "gstin": "11LLKTB0987C1Z2",
    "officeAddress": "Shop #3, Kazi Road, Gangtok – 737101",
    "premisesArea": "320 sq.ft commercial store with basement storage",
    "fireSafetyCert": "Certified CO2 & ABC Extinguishers (Valid till Oct 2027)",
    "firstAidAvailable": true,
    "equipmentTypes": "Ice Axes, Crampons, Static & Dynamic Climbing Ropes, Helmets, Avalanche Beacons",
    "inventoryValuation": "Rs. 24,00,000/- certified inventory stock",
    "requiresInspection": true,
    "assignedIaOfficer": "Tashi Wangdi Lepcha",
    "assignedRole": "IA",
    "status": "Under Verification",
    "currentStage": "Level 1: Assigned for IA Physical Inspection",
    "inspectionStatus": "Scheduled for Physical Inspection",
    "inspectingOfficer": "Tashi Wangdi Lepcha (Inspecting Authority, Gangtok)",
    "submittedDate": "04 Nov 2026, 02:15 PM",
    "lastUpdated": "06 Nov 2026, 11:30 AM",
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Karma Tshering Bhutia)",
        "date": "04 Nov 2026, 02:15 PM",
        "remarks": "Application submitted online with registered lease deed and fire safety certificate."
      },
      {
        "step": "Level 0 TO Verification Satisfactory & Assigned to IA",
        "actor": "Karma Lhendup Bhutia (Tourism Officer, Level 0)",
        "date": "06 Nov 2026, 11:30 AM",
        "remarks": "Verified statutory credentials and municipal trade license. Assigned to Level 1 IA Tashi Wangdi Lepcha for mandatory on-site physical inspection."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "04 Nov 2026, 02:15 PM",
        "actorRole": "Citizen",
        "actorName": "Karma Tshering Bhutia",
        "action": "Application Submitted Online",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Application submitted online."
      },
      {
        "timestamp": "06 Nov 2026, 11:30 AM",
        "actorRole": "Level 0 – Tourism Officer (TO)",
        "actorName": "Karma Lhendup Bhutia",
        "action": "Verified Statutory Credentials & Assigned to Level 1 IA for Physical Inspection",
        "stage": "Level 1: Assigned for IA Physical Inspection",
        "remarks": "Verified credentials. Forwarded to IA."
      }
    ]
  },
  {
    "refNo": "SK-TBR-2026-DLR-00303",
    "formConfig": "B",
    "category": "dealer",
    "categoryName": "Equipment Dealer Registration",
    "categoryCode": "DLR",
    "applicantName": "Lobsang Dorjee Sherpa",
    "fatherName": "Ang Tshering Sherpa",
    "gender": "Male",
    "dob": "19 Dec 1987",
    "residentialProof": "Certificate of Identification (COI #COI-GTK-2012-441)",
    "coiNo": "COI-GTK-2012-441",
    "address": "Arithang, Gangtok, Sikkim – 737101",
    "phone": "9832335566",
    "email": "lobsang.sherpa@kanchenjungaoutfitter.in",
    "district": "Gangtok",
    "businessName": "Kanchenjunga Outfitter & Retailers",
    "constitution": "Sole Proprietorship",
    "ownership": "Owned Commercial Premise",
    "tradeLicenseNo": "GMC/SHOP/2026/7781",
    "pan": "MMLDS9876B",
    "gstin": "11MMLDS9876B1Z1",
    "officeAddress": "Arithang Main Road, Near Old Bus Stand, Gangtok – 737101",
    "premisesArea": "340 sq.ft retail store",
    "fireSafetyCert": "Certified Fire Extinguisher & Smoke Detector (Valid till Jan 2028)",
    "firstAidAvailable": true,
    "equipmentTypes": "Trekking Boots, Down Jackets, Thermal Base Layers, Trekking Poles, Expedition Stoves",
    "inventoryValuation": "Rs. 15,20,000/- stock",
    "requiresInspection": true,
    "assignedIaOfficer": "Tashi Wangdi Lepcha",
    "assignedRole": "IA",
    "status": "Under Verification",
    "currentStage": "Level 1: Physical Inspection Scheduled",
    "inspectionStatus": "Visit Scheduled",
    "inspectionDate": "16 Nov 2026, 02:00 PM",
    "inspectingOfficer": "Tashi Wangdi Lepcha (Inspecting Authority, Gangtok)",
    "submittedDate": "02 Nov 2026, 04:00 PM",
    "lastUpdated": "07 Nov 2026, 01:45 PM",
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Lobsang Dorjee Sherpa)",
        "date": "02 Nov 2026, 04:00 PM",
        "remarks": "Application submitted online with ownership deed."
      },
      {
        "step": "Level 0 TO Verification Satisfactory & Assigned to IA",
        "actor": "Karma Lhendup Bhutia (Tourism Officer, Level 0)",
        "date": "04 Nov 2026, 12:00 PM",
        "remarks": "Level 0 verification completed. Assigned to Level 1 IA Tashi Wangdi Lepcha."
      },
      {
        "step": "Level 1 IA Physical Inspection Visit Scheduled",
        "actor": "Tashi Wangdi Lepcha (Inspecting Authority, Level 1)",
        "date": "07 Nov 2026, 01:45 PM",
        "remarks": "On-site physical inspection booked for 16 Nov 2026, 02:00 PM at Arithang retail premise."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "02 Nov 2026, 04:00 PM",
        "actorRole": "Citizen",
        "actorName": "Lobsang Dorjee Sherpa",
        "action": "Application Submitted Online",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Application submitted online."
      },
      {
        "timestamp": "04 Nov 2026, 12:00 PM",
        "actorRole": "Level 0 – Tourism Officer (TO)",
        "actorName": "Karma Lhendup Bhutia",
        "action": "Verified Statutory Credentials & Assigned to Level 1 IA for Physical Inspection",
        "stage": "Level 1: Assigned for IA Physical Inspection",
        "remarks": "Credentials checked. Assigned to IA."
      },
      {
        "timestamp": "07 Nov 2026, 01:45 PM",
        "actorRole": "Level 1 – Inspecting Authority (IA)",
        "actorName": "Tashi Wangdi Lepcha",
        "action": "Scheduled On-Site Physical Inspection Visit",
        "stage": "Level 1: Physical Inspection Scheduled",
        "remarks": "Inspection scheduled for 16 Nov 2026, 02:00 PM."
      }
    ]
  },
  {
    "refNo": "SK-TBR-2026-DLR-00304",
    "formConfig": "B",
    "category": "dealer",
    "categoryName": "Equipment Dealer Registration",
    "categoryCode": "DLR",
    "applicantName": "Norden Tshering Bhutia",
    "fatherName": "Sonam Bhutia",
    "gender": "Male",
    "dob": "08 Oct 1982",
    "residentialProof": "Certificate of Identification (COI #COI-GTK-2007-992)",
    "coiNo": "COI-GTK-2007-992",
    "address": "Ranipool Bazaar, Gangtok Circle, Sikkim – 737135",
    "phone": "9832446677",
    "email": "norden.bhutia@himalayanoutfitters.in",
    "district": "Gangtok",
    "businessName": "Himalayan Expedition Outfitters",
    "constitution": "Registered Partnership Firm",
    "ownership": "Owned Commercial Premise",
    "tradeLicenseNo": "GMC/SHOP/2026/8892",
    "pan": "NNNTB8765A",
    "gstin": "11NNNTB8765A1Z5",
    "officeAddress": "NH-10 Highway Junction, Ranipool, Gangtok – 737135",
    "premisesArea": "420 sq.ft showroom with gear maintenance workshop",
    "fireSafetyCert": "Certified Dual ABC Extinguishers & Fire Blanket (Valid till Mar 2028)",
    "firstAidAvailable": true,
    "equipmentTypes": "High-Altitude Tents (North Face / Mountain Hardwear), Sleeping Bags, Safety Ropes, Oxygen Cylinders, VHF Radios",
    "inventoryValuation": "Rs. 32,00,000/- certified gear stock",
    "requiresInspection": true,
    "assignedIaOfficer": "Tashi Wangdi Lepcha",
    "assignedRole": "TO",
    "status": "Under Verification",
    "currentStage": "Level 0: IA Report Received – Pending TO Review",
    "inspectionStatus": "Submitted to TO",
    "inspectingOfficer": "Tashi Wangdi Lepcha (Inspecting Authority, Gangtok)",
    "inspectionReportDate": "08 Nov 2026, 05:15 PM",
    "inspectionDocName": "Inspection_Report_SK-TBR-2026-DLR-00304.pdf",
    "inspectionDocSize": "2.3 MB",
    "inspectionFindings": "Showroom premise inspected. Adequate floor space of 420 sq.ft, fire safety extinguisher installed, climbing ropes and safety harnesses meet CE/UIAA safety standards. Recommended for Dealer Registration.",
    "inspectionRemarks": "Stock inventory matches declared manifest. Highly recommended for statutory 3-year dealer registration.",
    "inspectionRecommendation": "RECOMMENDED_FOR_APPROVAL",
    "submittedDate": "01 Nov 2026, 10:00 AM",
    "lastUpdated": "08 Nov 2026, 05:15 PM",
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Norden Tshering Bhutia)",
        "date": "01 Nov 2026, 10:00 AM",
        "remarks": "Application submitted online with ownership proof and inventory manifest."
      },
      {
        "step": "Level 0 TO Verification Satisfactory & Assigned to IA",
        "actor": "Karma Lhendup Bhutia (Tourism Officer, Level 0)",
        "date": "03 Nov 2026, 02:00 PM",
        "remarks": "Level 0 verification completed. Assigned to Level 1 IA Tashi Wangdi Lepcha for physical inspection."
      },
      {
        "step": "Level 1 IA Physical Inspection Report Submitted to TO",
        "actor": "Tashi Wangdi Lepcha (Inspecting Authority, Level 1)",
        "date": "08 Nov 2026, 05:15 PM",
        "remarks": "On-site physical inspection completed. Premises, fire safety norms, and safety gear inventory verified in order. Uploaded Physical_Inspection_Report_SK-TBR-2026-DLR-00304.pdf and transmitted to Level 0 TO for review."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "01 Nov 2026, 10:00 AM",
        "actorRole": "Citizen",
        "actorName": "Norden Tshering Bhutia",
        "action": "Application Submitted Online",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Application submitted online."
      },
      {
        "timestamp": "03 Nov 2026, 02:00 PM",
        "actorRole": "Level 0 – Tourism Officer (TO)",
        "actorName": "Karma Lhendup Bhutia",
        "action": "Verified Statutory Credentials & Assigned to Level 1 IA for Physical Inspection",
        "stage": "Level 1: Assigned for IA Physical Inspection",
        "remarks": "Verified credentials. Forwarded to IA."
      },
      {
        "timestamp": "08 Nov 2026, 05:15 PM",
        "actorRole": "Level 1 – Inspecting Authority (IA)",
        "actorName": "Tashi Wangdi Lepcha",
        "action": "Submitted Physical Inspection Report to Level 0 TO",
        "stage": "Level 0: IA Report Received – Pending TO Review",
        "remarks": "Physical premises verified compliant. Uploaded report document and transmitted to TO."
      }
    ],
    "inspectionDate": "02 Nov 2026, 03:00 PM"
  },
  {
    "refNo": "SK-TBR-2026-DLR-00305",
    "formConfig": "B",
    "category": "dealer",
    "categoryName": "Equipment Dealer Registration",
    "categoryCode": "DLR",
    "applicantName": "Sonam Wangdi Lepcha",
    "fatherName": "Dorjee Lepcha",
    "gender": "Male",
    "dob": "14 Jun 1980",
    "residentialProof": "Certificate of Identification (COI #COI-GYL-2006-221)",
    "coiNo": "COI-GYL-2006-221",
    "address": "Yuksam Bazaar, Gyalshing District, Sikkim – 737113",
    "phone": "9832557788",
    "email": "sonam.wangdi@westadventuredepot.in",
    "district": "Gangtok",
    "businessName": "Western Sikkim Adventure Depot",
    "constitution": "Sole Proprietorship",
    "ownership": "Owned Commercial Premise",
    "tradeLicenseNo": "GMC/SHOP/2026/1190",
    "pan": "OOSWL7654Z",
    "gstin": "11OOSWL7654Z1Z7",
    "officeAddress": "Main Trailhead, Yuksam Bazaar – 737113",
    "premisesArea": "310 sq.ft outfitter showroom",
    "fireSafetyCert": "Certified Fire Extinguisher (Valid till Feb 2028)",
    "firstAidAvailable": true,
    "equipmentTypes": "Tents, Expedition Sleeping Bags, Climbing Ropes, Trekking Poles, Portable Camp Stoves",
    "inventoryValuation": "Rs. 19,00,000/- certified stock",
    "requiresInspection": true,
    "assignedIaOfficer": "Sangay Chopel Bhutia",
    "assignedRole": "DTO",
    "status": "Approved",
    "currentStage": "Approved – Certificate Issued",
    "certificateNo": "SK-DLR-GTK-2026-0012",
    "validUntil": "07 Nov 2029",
    "approvalDate": "07 Nov 2026",
    "approvingOfficer": "Sonam Gyatso Lepcha, District Tourism Officer (DTO)",
    "dtoRemarks": "Statutory sanction granted. Form 3 Dealer Registration Certificate issued with 3-year validity.",
    "inspectingOfficer": "Sangay Chopel Bhutia (Inspecting Authority, Gyalshing)",
    "inspectionReportDate": "02 Nov 2026, 03:30 PM",
    "inspectionDocName": "Inspection_Report_SK-TBR-2026-DLR-00305.pdf",
    "inspectionDocSize": "1.9 MB",
    "inspectionFindings": "Physical inspection completed. Equipment showroom and certified stock warehouse verified. Meets statutory dealer standards.",
    "toInspectionReviewRemarks": "Level 0 TO reviewed IA physical inspection report. All prerequisites and equipment safety verified in order. Endorsed and forwarded to DTO for sanction.",
    "submittedDate": "26 Oct 2026, 09:30 AM",
    "lastUpdated": "07 Nov 2026, 03:00 PM",
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Sonam Wangdi Lepcha)",
        "date": "26 Oct 2026, 09:30 AM",
        "remarks": "Application submitted online with required proofs."
      },
      {
        "step": "Level 0 TO Verification Satisfactory & Assigned to IA",
        "actor": "Lakpa Doma Subba (Tourism Officer, Level 0)",
        "date": "29 Oct 2026, 11:30 AM",
        "remarks": "Statutory credentials checked. Forwarded to Level 1 IA Sangay Chopel Bhutia for physical on-site inspection."
      },
      {
        "step": "Level 1 IA Physical Inspection Report Submitted to TO",
        "actor": "Sangay Chopel Bhutia (Inspecting Authority, Level 1)",
        "date": "02 Nov 2026, 03:30 PM",
        "remarks": "Physical premises verified compliant. Uploaded report document and transmitted to Level 0 TO."
      },
      {
        "step": "Level 0 TO Reviewed IA Report & Forwarded to DTO",
        "actor": "Lakpa Doma Subba (Tourism Officer, Level 0)",
        "date": "05 Nov 2026, 10:15 AM",
        "remarks": "Level 0 TO reviewed IA inspection report. Endorsed and forwarded to DTO for final sanction."
      },
      {
        "step": "Final Approval Granted & Certificate Issued",
        "actor": "Sonam Gyatso Lepcha (District Tourism Officer, Level 2)",
        "date": "07 Nov 2026, 03:00 PM",
        "remarks": "Statutory sanction granted. Registration Certificate #SK-TCD-REG-2026-DLR-00305 generated with 3-year validity until 07 Nov 2029."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "26 Oct 2026, 09:30 AM",
        "actorRole": "Citizen",
        "actorName": "Sonam Wangdi Lepcha",
        "action": "Application Submitted Online",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Application submitted online."
      },
      {
        "timestamp": "29 Oct 2026, 11:30 AM",
        "actorRole": "Level 0 – Tourism Officer (TO)",
        "actorName": "Lakpa Doma Subba",
        "action": "Verified Statutory Credentials & Assigned to Level 1 IA for Physical Inspection",
        "stage": "Level 1: Assigned for IA Physical Inspection",
        "remarks": "Verified credentials. Forwarded to IA."
      },
      {
        "timestamp": "02 Nov 2026, 03:30 PM",
        "actorRole": "Level 1 – Inspecting Authority (IA)",
        "actorName": "Sangay Chopel Bhutia",
        "action": "Submitted Physical Inspection Report to Level 0 TO",
        "stage": "Level 0: IA Report Received – Pending TO Review",
        "remarks": "Physical premises verified compliant. Uploaded report document and transmitted to TO."
      },
      {
        "timestamp": "05 Nov 2026, 10:15 AM",
        "actorRole": "Level 0 – Tourism Officer (TO)",
        "actorName": "Lakpa Doma Subba",
        "action": "Endorsed IA Physical Inspection Report & Forwarded to DTO for Statutory Sanction",
        "stage": "Level 2: Pending DTO Sanction",
        "remarks": "TO endorsed IA inspection report. Forwarded to DTO."
      },
      {
        "timestamp": "07 Nov 2026, 03:00 PM",
        "actorRole": "Level 2 – District Tourism Officer (DTO)",
        "actorName": "Sonam Gyatso Lepcha",
        "action": "Granted Statutory Approval & Issued Form 3 Certificate",
        "stage": "Approved – Certificate Issued",
        "remarks": "Registration approved. Form 3 Certificate generated."
      }
    ],
    "paymentActivated": true,
    "paymentStatus": "Paid",
    "registrationFee": 2000,
    "amountPaid": 2000
  },
  {
    "refNo": "SK-TBR-2026-PHO-00401",
    "formConfig": "C",
    "category": "outdoor-photographer",
    "categoryName": "Outdoor Photographer Registration",
    "categoryCode": "PHO",
    "applicantName": "Tenzing Norbu Lepcha",
    "fatherName": "Dorjee Tshering Lepcha",
    "gender": "Male",
    "dob": "14 May 1992",
    "residentialProof": "Certificate of Identification (COI #COI-GTK-2012-8841)",
    "coiNo": "COI-GTK-2012-8841",
    "address": "Near Ridge Park, Below Raj Bhawan, Gangtok, Sikkim – 737101",
    "phone": "9832045612",
    "email": "tenzing.norbu@kanchenjungaframes.in",
    "district": "Gangtok",
    "businessName": "Kanchenjunga Frames Photography",
    "tradeLicenseNo": "GMC/SHOP/2026/4412",
    "pan": "PPTNL6543Y",
    "gstin": "11PPTNL6543Y1Z8",
    "officeAddress": "Near Ridge Park, Gangtok – 737101",
    "photoCourse": "Diploma in Outdoor & Landscape Photography, Himalayan Institute",
    "portfolioLink": "www.kanchenjungaframes.in/portfolio",
    "experienceYears": "6 years commercial landscape and cultural documentation across Sikkim Himalayas",
    "recomOrg": "Sikkim Press Club & Photographers Guild",
    "equipmentList": "Nikon Z8 Mirrorless, 24-70mm f/2.8, 70-200mm f/2.8, DJI Mavic 3 Pro (DGCA Registered)",
    "droneRegistered": true,
    "droneUin": "UIN-2026-SK-88124",
    "requiresInspection": false,
    "assignedRole": "TO",
    "status": "Submitted",
    "currentStage": "Level 0: Pending TO Verification",
    "submittedDate": "05 Nov 2026, 12:45 PM",
    "lastUpdated": "05 Nov 2026, 12:45 PM",
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Tenzing Norbu Lepcha)",
        "date": "05 Nov 2026, 12:45 PM",
        "remarks": "Application submitted online with photography portfolio and technical training diploma."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "05 Nov 2026, 12:45 PM",
        "actorRole": "Citizen",
        "actorName": "Tenzing Norbu Lepcha",
        "action": "Application Submitted Online",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Application submitted online."
      }
    ]
  },
  {
    "refNo": "SK-TBR-2026-PHO-00402",
    "formConfig": "C",
    "category": "outdoor-photographer",
    "categoryName": "Outdoor Photographer Registration",
    "categoryCode": "PHO",
    "applicantName": "Pemba Tshering Sherpa",
    "fatherName": "Passang Sherpa",
    "gender": "Male",
    "dob": "28 Jul 1994",
    "residentialProof": "Certificate of Identification (COI #COI-NAM-2016-339)",
    "coiNo": "COI-NAM-2016-339",
    "address": "Bhanu Saligram Ward, Namchi, Sikkim – 737126",
    "phone": "9832113355",
    "email": "pemba.sherpa@alpineglowstudio.in",
    "district": "Namchi",
    "businessName": "Alpine Glow Wildlife & Landscape Studio",
    "tradeLicenseNo": "NMC/TL/2026/1944",
    "pan": "QQPTS5432X",
    "gstin": "11QQPTS5432X1Z9",
    "officeAddress": "Main Market, Namchi – 737126",
    "photoCourse": "Certificate in High-Altitude Wildlife Photography, WII Dehradun",
    "portfolioLink": "www.alpineglowstudio.in/wildlife",
    "experienceYears": "5 years Red Panda and Himalayan Avian Documentation in Maenam & Barsey Sanctuaries",
    "recomOrg": "Sikkim Birding & Wildlife Photographers Union",
    "equipmentList": "Sony A7 IV, 200-600mm f/5.6-6.3, 16-35mm f/2.8, Carbon Fiber Tripods",
    "droneRegistered": false,
    "requiresInspection": false,
    "assignedRole": "TO",
    "status": "Under Verification",
    "currentStage": "Level 0: Pending TO Verification",
    "submittedDate": "04 Nov 2026, 03:00 PM",
    "lastUpdated": "04 Nov 2026, 03:00 PM",
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Pemba Tshering Sherpa)",
        "date": "04 Nov 2026, 03:00 PM",
        "remarks": "Application submitted online with wildlife photo portfolio."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "04 Nov 2026, 03:00 PM",
        "actorRole": "Citizen",
        "actorName": "Pemba Tshering Sherpa",
        "action": "Application Submitted Online",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Application submitted online."
      }
    ]
  },
  {
    "refNo": "SK-TBR-2026-PHO-00403",
    "formConfig": "C",
    "category": "outdoor-photographer",
    "categoryName": "Outdoor Photographer Registration",
    "categoryCode": "PHO",
    "applicantName": "Dechen Ongmu Bhutia",
    "fatherName": "Karma Bhutia",
    "gender": "Female",
    "dob": "17 Sep 1995",
    "residentialProof": "Certificate of Identification (COI #COI-GTK-2015-772)",
    "coiNo": "COI-GTK-2015-772",
    "address": "Tadong, Below Sikkim Manipal Hospital, Gangtok – 737102",
    "phone": "9832224466",
    "email": "dechen.bhutia@sikkimskies.in",
    "district": "Gangtok",
    "businessName": "Sikkim Skies Aerial Cinematography",
    "tradeLicenseNo": "GMC/SHOP/2026/2219",
    "pan": "RRDOB4321W",
    "gstin": "11RRDOB4321W1Z0",
    "officeAddress": "Tadong 5th Mile, Gangtok – 737102",
    "photoCourse": "Commercial Drone Pilot Certification (DGCA Remote Pilot License)",
    "portfolioLink": "www.sikkimskies.in/aerials",
    "experienceYears": "4 years commercial drone cinematography for travel documentaries",
    "recomOrg": "Sikkim Cine Association",
    "equipmentList": "DJI Inspire 3, DJI Mavic 3 Enterprise, Sony FX3 Cinema Camera",
    "droneRegistered": true,
    "droneUin": "UIN-2026-SK-99120",
    "requiresInspection": false,
    "assignedRole": "TO",
    "status": "Returned for Clarification",
    "currentStage": "Returned to Citizen for Clarification",
    "returnRemarks": "DGCA Remote Pilot Certificate upload is blurred and expiry date cannot be authenticated. Please re-upload clear digital copy of valid DGCA Pilot Certificate with QR code.",
    "returnedBy": "Karma Lhendup Bhutia (Tourism Officer, Level 0)",
    "returnedDate": "05 Nov 2026, 02:30 PM",
    "submittedDate": "02 Nov 2026, 01:15 PM",
    "lastUpdated": "05 Nov 2026, 02:30 PM",
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Dechen Ongmu Bhutia)",
        "date": "02 Nov 2026, 01:15 PM",
        "remarks": "Application submitted online with drone portfolio."
      },
      {
        "step": "Application Returned to Citizen for Clarification by TO",
        "actor": "Karma Lhendup Bhutia (Tourism Officer, Level 0)",
        "date": "05 Nov 2026, 02:30 PM",
        "remarks": "Clarification Required: DGCA Remote Pilot Certificate upload is blurred. Please re-upload clear digital copy."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "02 Nov 2026, 01:15 PM",
        "actorRole": "Citizen",
        "actorName": "Dechen Ongmu Bhutia",
        "action": "Application Submitted Online",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Application submitted online."
      },
      {
        "timestamp": "05 Nov 2026, 02:30 PM",
        "actorRole": "Level 0 – Tourism Officer (TO)",
        "actorName": "Karma Lhendup Bhutia",
        "action": "Returned Application to Citizen for Clarification",
        "stage": "Returned to Citizen for Clarification",
        "remarks": "DGCA drone certificate blurred. Re-upload requested."
      }
    ]
  },
  {
    "refNo": "SK-TBR-2026-PHO-00404",
    "formConfig": "C",
    "category": "outdoor-photographer",
    "categoryName": "Outdoor Photographer Registration",
    "categoryCode": "PHO",
    "applicantName": "Passang Doma Lepcha",
    "fatherName": "Tashi Lepcha",
    "gender": "Female",
    "dob": "11 Mar 1993",
    "residentialProof": "Certificate of Identification (COI #COI-GYL-2014-991)",
    "coiNo": "COI-GYL-2014-991",
    "address": "Upper Pelling, Gyalshing District, Sikkim – 737113",
    "phone": "9832335577",
    "email": "passang.lepcha@rhododendronvalley.in",
    "district": "Gyalshing",
    "businessName": "Rhododendron Valley Photography",
    "tradeLicenseNo": "GMC/SHOP/2026/8812",
    "pan": "SSPDL3210V",
    "gstin": "11SSPDL3210V1Z1",
    "officeAddress": "Upper Pelling Main Road – 737113",
    "photoCourse": "Advance Diploma in Nature Photography (Sikkim Alpine Academy)",
    "portfolioLink": "www.rhododendronvalley.in/gallery",
    "experienceYears": "7 years botanical and landscape documentation in Kanchenjunga Biosphere Reserve",
    "recomOrg": "Sikkim Nature Conservation & Photography Society",
    "equipmentList": "Canon EOS R5, RF 15-35mm f/2.8, RF 100-500mm f/4.5-7.1, Macro Ring Flash",
    "droneRegistered": false,
    "requiresInspection": false,
    "assignedRole": "DTO",
    "status": "Under Verification",
    "currentStage": "Level 2: Pending DTO Sanction",
    "inspectionStatus": "Exempt (Direct Route)",
    "toRemarks": "Level 0 TO verified educational credentials, COI, and nature photography portfolio. Outdoor Photographer category is exempt from physical inspection. Forwarded directly to Level 2 DTO for final sanction.",
    "submittedDate": "30 Oct 2026, 11:00 AM",
    "lastUpdated": "04 Nov 2026, 04:15 PM",
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Passang Doma Lepcha)",
        "date": "30 Oct 2026, 11:00 AM",
        "remarks": "Application submitted online with complete credentials."
      },
      {
        "step": "Level 0 TO Verification Completed & Forwarded to DTO",
        "actor": "Lakpa Doma Subba (Tourism Officer, Level 0)",
        "date": "04 Nov 2026, 04:15 PM",
        "remarks": "Level 0 TO verified all statutory documents, COI, and high-altitude photography portfolio. Category exempt from physical inspection. Forwarded directly to Level 2 DTO Sonam Gyatso Lepcha for final sanction."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "30 Oct 2026, 11:00 AM",
        "actorRole": "Citizen",
        "actorName": "Passang Doma Lepcha",
        "action": "Application Submitted Online",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Application submitted online."
      },
      {
        "timestamp": "04 Nov 2026, 04:15 PM",
        "actorRole": "Level 0 – Tourism Officer (TO)",
        "actorName": "Lakpa Doma Subba",
        "action": "Verified Statutory Credentials & Forwarded Directly to Level 2 DTO (Physical Inspection Exempt)",
        "stage": "Level 2: Pending DTO Sanction",
        "remarks": "Verified credentials. Category exempt from physical inspection. Forwarded directly to DTO."
      }
    ]
  },
  {
    "refNo": "SK-TBR-2026-PHO-00405",
    "formConfig": "C",
    "category": "outdoor-photographer",
    "categoryName": "Outdoor Photographer Registration",
    "categoryCode": "PHO",
    "applicantName": "Rinzing Tshering Bhutia",
    "fatherName": "Sonam Tshering Bhutia",
    "gender": "Male",
    "dob": "04 Feb 1990",
    "residentialProof": "Certificate of Identification (COI #COI-PAK-2012-108)",
    "coiNo": "COI-PAK-2012-108",
    "address": "Pakyong Bazaar, Near Airport Road, Pakyong – 737106",
    "phone": "9832446688",
    "email": "rinzing.bhutia@easthimalayanvisuals.in",
    "district": "Gangtok",
    "businessName": "Eastern Himalayan Visuals",
    "tradeLicenseNo": "PMC/TL/2026/3321",
    "pan": "TTRTB2109U",
    "gstin": "11TTRTB2109U1Z2",
    "officeAddress": "Airport Road, Pakyong – 737106",
    "photoCourse": "Bachelor of Fine Arts (Photography), Calcutta University",
    "portfolioLink": "www.easthimalayanvisuals.in/works",
    "experienceYears": "8 years professional landscape, aerial, and travel magazine feature photography",
    "recomOrg": "All Sikkim Professional Photographers Guild",
    "equipmentList": "Fujifilm GFX 100 II Medium Format, GF 32-64mm, GF 110mm f/2, DJI Mavic 3 Cine",
    "droneRegistered": true,
    "droneUin": "UIN-2026-SK-77341",
    "requiresInspection": false,
    "assignedRole": "DTO",
    "status": "Approved",
    "currentStage": "Approved – Certificate Issued",
    "certificateNo": "SK-PHO-GTK-2026-0008",
    "validUntil": "06 Nov 2029",
    "approvalDate": "06 Nov 2026",
    "approvingOfficer": "Nim Lhamu Lepcha, District Tourism Officer (DTO)",
    "dtoRemarks": "Statutory sanction granted. Form 3 Outdoor Photographer Registration Certificate issued with 3-year validity.",
    "inspectionStatus": "Exempt (Direct Route)",
    "toRemarks": "Level 0 verification completed in order. Exempt from physical inspection. Forwarded to DTO for sanction.",
    "submittedDate": "27 Oct 2026, 02:00 PM",
    "lastUpdated": "06 Nov 2026, 03:30 PM",
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Rinzing Tshering Bhutia)",
        "date": "27 Oct 2026, 02:00 PM",
        "remarks": "Application submitted online with BFA degree and aerial drone license."
      },
      {
        "step": "Level 0 TO Verification Completed & Forwarded to DTO",
        "actor": "Prashant Chettri (Tourism Officer, Level 0)",
        "date": "30 Oct 2026, 11:30 AM",
        "remarks": "Level 0 TO verified all statutory credentials, DGCA drone certificate, and BFA degree. Exempt from physical inspection. Forwarded directly to Level 2 DTO."
      },
      {
        "step": "Final Approval Granted & Certificate Issued",
        "actor": "Nim Lhamu Lepcha (District Tourism Officer, Level 2)",
        "date": "06 Nov 2026, 03:30 PM",
        "remarks": "Statutory sanction granted. Registration Certificate #SK-TCD-REG-2026-PHO-00405 generated with 3-year validity until 06 Nov 2029."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "27 Oct 2026, 02:00 PM",
        "actorRole": "Citizen",
        "actorName": "Rinzing Tshering Bhutia",
        "action": "Application Submitted Online",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Application submitted online."
      },
      {
        "timestamp": "30 Oct 2026, 11:30 AM",
        "actorRole": "Level 0 – Tourism Officer (TO)",
        "actorName": "Prashant Chettri",
        "action": "Verified Statutory Credentials & Forwarded Directly to Level 2 DTO (Physical Inspection Exempt)",
        "stage": "Level 2: Pending DTO Sanction",
        "remarks": "Verified credentials. Category exempt from physical inspection. Forwarded directly to DTO."
      },
      {
        "timestamp": "06 Nov 2026, 03:30 PM",
        "actorRole": "Level 2 – District Tourism Officer (DTO)",
        "actorName": "Nim Lhamu Lepcha",
        "action": "Granted Statutory Approval & Issued Form 3 Certificate",
        "stage": "Approved – Certificate Issued",
        "remarks": "Registration approved. Form 3 Certificate generated."
      }
    ],
    "paymentActivated": true,
    "paymentStatus": "Paid",
    "registrationFee": 1500,
    "amountPaid": 1500
  },
  {
    "refNo": "SK-TBR-2026-TO-00107",
    "formConfig": "A",
    "category": "tour-operator",
    "categoryName": "Tour Operator Registration",
    "categoryCode": "TO",
    "applicantName": "Norbu Wangdi Bhutia",
    "gender": "Male",
    "dob": "08 Sep 1987",
    "residentialProof": "Sikkim Certificate of Identification (COI #COI-GTK-2011-551)",
    "address": "Development Area, Gangtok, Sikkim – 737101",
    "phone": "9832101129",
    "email": "norbu.bhutia@sikkimholidays.in",
    "website": "www.sikkimholidays.in",
    "district": "Gangtok",
    "eduQualification": "Graduate (B.A. Tourism)",
    "techQualification": "Expedition Management (HMI Darjeeling)",
    "training": "Wilderness Safety Protocol (Sikkim Tourism 2023)",
    "businessName": "Sikkim Panoramic Expeditions",
    "constitution": "Proprietorship",
    "ownership": "Rented Commercial Office",
    "tradeLicenseNo": "GMC/TL/2026/8991",
    "pan": "ABNWB6654Q",
    "gstin": "11ABNWB6654Q1Z3",
    "officeAddress": "Unit 12, Second Floor, Paljor Stadium Road, Gangtok – 737101",
    "officeSizeStandard": "410 sq.ft commercial space with client lounge and digital ticketing desk",
    "association": "TAAS Member",
    "activitiesSummary": "North Sikkim high plateau tours, Dzongri trekking circuits, and monastery tours.",
    "partners": [
      {
        "name": "Norbu Wangdi Bhutia",
        "role": "Proprietor",
        "phone": "9832101129",
        "aadhaar": "XXXX-XXXX-7781",
        "address": "Development Area, Gangtok"
      }
    ],
    "staff": [
      {
        "name": "Kunzang Lepcha",
        "role": "Trek Leader",
        "qualification": "Basic Mountaineering Course",
        "training": "First Aid Certified"
      }
    ],
    "ecoPractices": "Leave-No-Trace trail ethics, zero plastic policy.",
    "officeEquipment": "3 workstations, fire extinguisher, guest consultation zone.",
    "requiresInspection": true,
    "assignedRole": "DTO",
    "assignedIaOfficer": "Tashi Wangdi Lepcha",
    "status": "Under Verification",
    "currentStage": "Level 2: Pending DTO Sanction",
    "submittedDate": "28 Oct 2026, 10:30 AM",
    "lastUpdated": "04 Nov 2026, 04:00 PM",
    "inspectionDate": "02 Nov 2026, 03:00 PM",
    "inspectionFindings": "Premises inspected by IA Tashi Wangdi Lepcha. Office meets commercial standards with 410 sq.ft carpet area. Fire safety equipment and qualified guide staff verified. Recommended for Grade B Tour Operator Registration.",
    "inspectionDocName": "Inspection_Report_SK-TBR-2026-TO-00107.pdf",
    "toRemarks": "IA report reviewed and endorsed. Forwarded to Level 2 DTO for fee activation and final statutory sanction.",
    "gradeAssigned": "Grade B",
    "registrationFee": 7000,
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Norbu Wangdi Bhutia)",
        "date": "28 Oct 2026, 10:30 AM",
        "remarks": "Application submitted."
      },
      {
        "step": "Level 0 TO Verification",
        "actor": "Tourism Officer (Karma Lhendup Bhutia)",
        "date": "30 Oct 2026, 11:00 AM",
        "remarks": "Trade license verified. Assigned to IA Tashi Wangdi Lepcha."
      },
      {
        "step": "Level 1 IA Physical Inspection",
        "actor": "Inspecting Authority (Tashi Wangdi Lepcha)",
        "date": "02 Nov 2026, 03:00 PM",
        "remarks": "Inspection completed. Premise compliant."
      },
      {
        "step": "Level 0 TO Endorsement",
        "actor": "Tourism Officer (Karma Lhendup Bhutia)",
        "date": "04 Nov 2026, 04:00 PM",
        "remarks": "IA report endorsed. Forwarded to Level 2 DTO for sanction."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "28 Oct 2026, 10:30 AM",
        "actorRole": "Citizen",
        "actorName": "Norbu Wangdi Bhutia",
        "action": "Submitted Application",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Application submitted."
      },
      {
        "timestamp": "30 Oct 2026, 11:00 AM",
        "actorRole": "TO",
        "actorName": "Karma Lhendup Bhutia",
        "action": "Assigned to IA",
        "stage": "Level 1: Assigned for IA Physical Inspection",
        "remarks": "Assigned to IA."
      },
      {
        "timestamp": "02 Nov 2026, 03:00 PM",
        "actorRole": "IA",
        "actorName": "Tashi Wangdi Lepcha",
        "action": "Physical Inspection Conducted",
        "stage": "Level 0: IA Report Received – Pending TO Review",
        "remarks": "Recommended for Grade B."
      },
      {
        "timestamp": "04 Nov 2026, 04:00 PM",
        "actorRole": "TO",
        "actorName": "Karma Lhendup Bhutia",
        "action": "Endorsed to Level 2 DTO",
        "stage": "Level 2: Pending DTO Sanction",
        "remarks": "Forwarded to DTO for sanction."
      }
    ]
  },
  {
    "refNo": "SK-TBR-2026-DLR-00306",
    "formConfig": "B",
    "category": "dealer",
    "categoryName": "Equipment Dealer Registration",
    "categoryCode": "DLR",
    "applicantName": "Phurba Wangdi Sherpa",
    "gender": "Male",
    "dob": "15 Mar 1988",
    "residentialProof": "Certificate of Identification (COI #COI-GTK-2012-701)",
    "address": "Development Area, Gangtok, Sikkim – 737101",
    "phone": "9832101130",
    "email": "phurba.sherpa@sikkimgear.in",
    "website": "www.sikkimgear.in",
    "district": "Gangtok",
    "eduQualification": "Graduate (B.Com)",
    "techQualification": "UIAA Certified Equipment Inspection & Testing",
    "training": "Adventure Gear Safety Standards (IMF 2023)",
    "businessName": "Himalayan Technical Gear & Outfitters",
    "constitution": "Registered Partnership Firm",
    "ownership": "Rented Commercial Showroom",
    "tradeLicenseNo": "GMC/TL/2026/8944",
    "pan": "AALPS8891B",
    "gstin": "11AALPS8891B1Z3",
    "officeAddress": "Unit 102, Ground Floor, Paljor Stadium Road, Gangtok – 737101",
    "officeSizeStandard": "480 sq.ft commercial showroom with specialized mountaineering gear storage and testing rig",
    "association": "Sikkim Adventure Gear Association (SAGA)",
    "activitiesSummary": "Retail sales, technical rental, and mandatory annual inspection of mountaineering safety equipment, dynamic ropes, carabiners, crampons and harnesses.",
    "equipmentBrands": "Petzl, Black Diamond, Mammut, Camp, Grivel (UIAA / CE certified)",
    "requiresInspection": true,
    "assignedRole": "DTO",
    "assignedIaOfficer": "Tashi Wangdi Lepcha",
    "status": "Under Verification",
    "currentStage": "Level 2: Pending DTO Sanction",
    "submittedDate": "29 Oct 2026, 11:00 AM",
    "lastUpdated": "04 Nov 2026, 04:30 PM",
    "inspectionDate": "02 Nov 2026, 02:30 PM",
    "inspectionFindings": "Showroom and testing workshop inspected by IA Tashi Wangdi Lepcha. Showroom measures 480 sq.ft, compliant fire safety, equipment calibration register maintained, and genuine UIAA/CE certificates verified for all climbing hardware. Recommended for statutory Dealer Registration.",
    "inspectionDocName": "Inspection_Report_SK-TBR-2026-DLR-00306.pdf",
    "toRemarks": "Physical inspection report verified and endorsed. Statutory compliance established. Forwarded to Level 2 DTO for fee activation and final sanction.",
    "registrationFee": 2000,
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Phurba Wangdi Sherpa)",
        "date": "29 Oct 2026, 11:00 AM",
        "remarks": "Application submitted via Sikkim Single Sign-On."
      },
      {
        "step": "Level 0 TO Document Verification",
        "actor": "Tourism Officer (Karma Lhendup Bhutia)",
        "date": "31 Oct 2026, 10:30 AM",
        "remarks": "Municipal trade license and equipment dealership agreements verified. Assigned to IA Tashi Wangdi Lepcha."
      },
      {
        "step": "Level 1 IA Physical Inspection",
        "actor": "Inspecting Authority (Tashi Wangdi Lepcha)",
        "date": "02 Nov 2026, 02:30 PM",
        "remarks": "Showroom premise, gear testing rig, and stock manifests verified on-site."
      },
      {
        "step": "Level 0 TO Endorsement",
        "actor": "Tourism Officer (Karma Lhendup Bhutia)",
        "date": "04 Nov 2026, 04:30 PM",
        "remarks": "IA Report endorsed. Forwarded to Level 2 DTO for statutory sanction."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "29 Oct 2026, 11:00 AM",
        "actorRole": "Citizen",
        "actorName": "Phurba Wangdi Sherpa",
        "action": "Submitted Application",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Application submitted."
      },
      {
        "timestamp": "31 Oct 2026, 10:30 AM",
        "actorRole": "TO",
        "actorName": "Karma Lhendup Bhutia",
        "action": "Assigned to IA",
        "stage": "Level 1: Assigned for IA Physical Inspection",
        "remarks": "Assigned to IA Tashi Wangdi Lepcha."
      },
      {
        "timestamp": "02 Nov 2026, 02:30 PM",
        "actorRole": "IA",
        "actorName": "Tashi Wangdi Lepcha",
        "action": "Physical Inspection Conducted",
        "stage": "Level 0: IA Report Received – Pending TO Review",
        "remarks": "Recommended for dealer registration."
      },
      {
        "timestamp": "04 Nov 2026, 04:30 PM",
        "actorRole": "TO",
        "actorName": "Karma Lhendup Bhutia",
        "action": "Endorsed to Level 2 DTO",
        "stage": "Level 2: Pending DTO Sanction",
        "remarks": "Forwarded to DTO for sanction."
      }
    ]
  },
  {
    "refNo": "SK-TBR-2026-PHO-00406",
    "formConfig": "C",
    "category": "outdoor-photographer",
    "categoryName": "Outdoor Photographer Registration",
    "categoryCode": "PHO",
    "applicantName": "Tshering Doma Bhutia",
    "gender": "Female",
    "dob": "24 Nov 1993",
    "residentialProof": "Certificate of Identification (COI #COI-GTK-2016-892)",
    "address": "Tadong 6th Mile, Gangtok, Sikkim – 737102",
    "phone": "9832101131",
    "email": "tshering.doma@sikkimlenses.in",
    "website": "www.sikkimlenses.in",
    "district": "Gangtok",
    "eduQualification": "Graduate (B.A. Mass Communication & Journalism)",
    "techQualification": "Diploma in Professional Landscape & Wildlife Photography (IIP)",
    "training": "Advanced Drone & High Altitude Cinematography (DGCA Certified)",
    "businessName": "Sikkim Lenses Outdoor Media",
    "constitution": "Proprietorship",
    "ownership": "Owned Studio",
    "tradeLicenseNo": "GMC/TL/2026/9110",
    "pan": "AALPD4412R",
    "gstin": "11AALPD4412R1Z6",
    "officeAddress": "Studio 2, Green View Building, Tadong, Gangtok – 737102",
    "officeSizeStandard": "280 sq.ft editing studio with professional post-production suites and camera equipment vault",
    "association": "Sikkim Photographers Association (SPA)",
    "activitiesSummary": "Commercial outdoor landscape photography, tourist photo tours, high-altitude drone cinematography, and biodiversity documentation.",
    "camerasOwned": "Sony A7R V, Canon EOS R5, DJI Mavic 3 Pro Cine, Sony FX3",
    "requiresInspection": false,
    "assignedRole": "DTO",
    "status": "Under Verification",
    "currentStage": "Level 2: Pending DTO Sanction",
    "submittedDate": "30 Oct 2026, 02:00 PM",
    "lastUpdated": "04 Nov 2026, 05:00 PM",
    "toRemarks": "Outdoor photographer direct route: DGCA drone pilot remote certification and professional equipment invoices verified. Exempt from IA physical inspection. Recommended for Level 2 DTO statutory sanction.",
    "registrationFee": 1500,
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Tshering Doma Bhutia)",
        "date": "30 Oct 2026, 02:00 PM",
        "remarks": "Application submitted via Sikkim Single Sign-On."
      },
      {
        "step": "Level 0 TO Document Verification",
        "actor": "Tourism Officer (Karma Lhendup Bhutia)",
        "date": "02 Nov 2026, 11:00 AM",
        "remarks": "Photographer credentials and drone license verified. Forwarded directly to Level 2 DTO."
      },
      {
        "step": "Level 0 TO Endorsement",
        "actor": "Tourism Officer (Karma Lhendup Bhutia)",
        "date": "04 Nov 2026, 05:00 PM",
        "remarks": "Endorsed for DTO sanction (Physical inspection exempt)."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "30 Oct 2026, 02:00 PM",
        "actorRole": "Citizen",
        "actorName": "Tshering Doma Bhutia",
        "action": "Submitted Application",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Application submitted."
      },
      {
        "timestamp": "02 Nov 2026, 11:00 AM",
        "actorRole": "TO",
        "actorName": "Karma Lhendup Bhutia",
        "action": "Verified Credentials (Direct Route)",
        "stage": "Level 2: Pending DTO Sanction",
        "remarks": "Direct route TO-to-DTO endorsement."
      }
    ]
  },
  {
    "refNo": "SK-TBR-2026-TA-00206",
    "formConfig": "A",
    "category": "travel-agent",
    "categoryName": "Travel Agent Registration",
    "categoryCode": "TA",
    "applicantName": "Karma Sonam Lepcha",
    "gender": "Male",
    "dob": "14 Apr 1991",
    "residentialProof": "Certificate of Identification (COI #COI-MNG-2015-104)",
    "address": "Mangan Bazaar, North Sikkim – 737116",
    "phone": "9832101132",
    "email": "karma.lepcha@northsikkimtravel.in",
    "website": "www.northsikkimtravel.in",
    "district": "Mangan",
    "eduQualification": "Graduate (B.A.)",
    "techQualification": "Travel Operations & Itinerary Design",
    "training": "State Tourism Facilitator (Sikkim Tourism 2022)",
    "businessName": "North Sikkim High Plateau Travels",
    "constitution": "Proprietorship",
    "ownership": "Rented Commercial Office",
    "tradeLicenseNo": "MDC/TL/2026/1109",
    "pan": "AALPK9912C",
    "gstin": "11AALPK9912C1Z4",
    "officeAddress": "Unit 4, Main Market, Mangan – 737116",
    "officeSizeStandard": "310 sq.ft commercial ticketing office",
    "association": "TAAS Member",
    "activitiesSummary": "Permit facilitation, local taxi fleet operations, and Yumthang-Gurudongmar travel packages.",
    "partners": [
      {
        "name": "Karma Sonam Lepcha",
        "role": "Proprietor",
        "phone": "9832101132",
        "aadhaar": "XXXX-XXXX-9901",
        "address": "Mangan Bazaar"
      }
    ],
    "staff": [
      {
        "name": "Tshering Lepcha",
        "role": "Ticketing Agent",
        "qualification": "Higher Secondary",
        "training": "Digital Reservations"
      }
    ],
    "ecoPractices": "Plastic-free travel briefings, eco-dustbin supply to tourist cabs.",
    "officeEquipment": "2 workstations, high-speed fiber internet, fire extinguisher.",
    "requiresInspection": true,
    "assignedRole": "DTO",
    "assignedIaOfficer": "Passang Gyatso Bhutia",
    "status": "Approved",
    "currentStage": "Approved – Certificate Issued",
    "submittedDate": "10 Oct 2026, 10:00 AM",
    "lastUpdated": "25 Oct 2026, 03:00 PM",
    "inspectionDate": "15 Oct 2026, 01:00 PM",
    "inspectionFindings": "Commercial premise in Mangan Market inspected. Office measures 310 sq.ft, compliant fire safety, digital reservation system verified. Recommended for Grade B Travel Agent Registration.",
    "inspectionDocName": "Inspection_Report_SK-TBR-2026-TA-00206.pdf",
    "certificateNo": "SK-TA-MNG-2026-0005",
    "certificateIssueDate": "25 Oct 2026",
    "certificateExpiryDate": "24 Oct 2029",
    "paymentActivated": true,
    "paymentStatus": "Paid",
    "gradeAssigned": "Grade B",
    "registrationFee": 7000,
    "amountPaid": 7000,
    "transactionId": "TXN-SK-TBR-2026-1109",
    "receiptNo": "RCPT-SK-TCD-2026-00206",
    "history": [
      {
        "step": "Application Submitted Online",
        "actor": "Citizen (Karma Sonam Lepcha)",
        "date": "10 Oct 2026, 10:00 AM",
        "remarks": "Application submitted."
      },
      {
        "step": "Statutory Approval & Certificate Issued",
        "actor": "District Tourism Officer (Mangan DTO)",
        "date": "25 Oct 2026, 03:00 PM",
        "remarks": "Approved. Form 3 Certificate issued."
      }
    ],
    "auditHistory": [
      {
        "timestamp": "10 Oct 2026, 10:00 AM",
        "actorRole": "Citizen",
        "actorName": "Karma Sonam Lepcha",
        "action": "Submitted Application",
        "stage": "Level 0: Pending TO Verification",
        "remarks": "Online application submitted."
      },
      {
        "timestamp": "25 Oct 2026, 03:00 PM",
        "actorRole": "DTO",
        "actorName": "Mangan DTO",
        "action": "Statutory Approval Granted",
        "stage": "Approved – Certificate Issued",
        "remarks": "Certificate #SK-TA-MNG-2026-0005 generated."
      }
    ]
  }
];

  // WorkflowEngine API Object
  const WorkflowEngine = {
    STATUSES: STATUSES,
    STAGES: STAGES,
    DISTRICT_OFFICES: DISTRICT_OFFICES,

    // Initializer with guaranteed self-healing
    init: function () {
      try {
        const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
        const storedData = localStorage.getItem(STORAGE_KEY);
        let parsed = null;
        if (storedData) {
          try { parsed = JSON.parse(storedData); } catch (e) {}
        }

        if (!parsed || !Array.isArray(parsed) || parsed.length < 20 || storedVersion !== CURRENT_SEED_VERSION) {
          this.resetToSeedData();
        } else {
          this.syncCitizenSubmissions();
        }
      } catch (e) {
        console.error('WorkflowEngine init error:', e);
        this.resetToSeedData();
      }

      // Synchronize TourismBusinessData.allApplications if present
      if (typeof window !== 'undefined' && window.TourismBusinessData) {
        window.TourismBusinessData.allApplications = this.getAllApplications();
      }
    },

    resetToSeedData: function () {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_APPLICATIONS));
          localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_SEED_VERSION);
        }
      } catch (e) {}
      this.syncCitizenSubmissions();
      try {
        if (typeof localStorage !== 'undefined') {
          const currentRaw = localStorage.getItem(STORAGE_KEY);
          if (currentRaw) {
            const parsed = JSON.parse(currentRaw);
            if (Array.isArray(parsed) && parsed.length >= 20) {
              return parsed;
            }
          }
        }
      } catch (e) {}
      return [...SEED_APPLICATIONS];
    },

    syncCitizenSubmissions: function () {
      try {
        if (typeof localStorage === 'undefined') return;
        const citizenRaw = localStorage.getItem(SUBMITTED_STORAGE_KEY);
        if (!citizenRaw) return;
        const citizenApps = JSON.parse(citizenRaw);
        if (!Array.isArray(citizenApps) || citizenApps.length === 0) return;

        const currentDeptApps = this.getAllApplications();
        citizenApps.forEach(cApp => {
          const exists = currentDeptApps.some(d => d.refNo === cApp.refNo);
          if (!exists) {
            const mapped = {
              refNo: cApp.refNo,
              formConfig: (cApp.category === 'dealer' ? 'B' : (cApp.category === 'outdoor-photographer' ? 'C' : 'A')),
              category: cApp.category,
              categoryName: cApp.categoryName || 'Tourism Registration',
              categoryCode: (cApp.category === 'tour-operator' ? 'TO' : (cApp.category === 'travel-agent' ? 'TA' : (cApp.category === 'dealer' ? 'DLR' : 'PHO'))),
              applicantName: cApp.applicantName || 'Citizen Applicant',
              businessName: cApp.businessName || 'Tourism Enterprise',
              district: cApp.district || 'Gangtok',
              phone: '9832000000',
              email: 'applicant@example.in',
              requiresInspection: (cApp.category !== 'outdoor-photographer'),
              assignedRole: 'TO',
              status: 'Submitted',
              currentStage: 'Level 0: Pending TO Verification',
              submittedDate: cApp.submittedDate || new Date().toLocaleDateString('en-GB'),
              lastUpdated: new Date().toLocaleDateString('en-GB'),
              history: [
                {
                  step: 'Application Submitted Online',
                  actor: 'Citizen (' + (cApp.applicantName || 'Applicant') + ')',
                  date: cApp.submittedDate || new Date().toLocaleDateString('en-GB'),
                  remarks: 'Application submitted via Sikkim Single Sign-On portal.'
                }
              ],
              auditHistory: [
                {
                  timestamp: cApp.submittedDate || new Date().toLocaleDateString('en-GB'),
                  actorRole: 'Citizen',
                  actorName: cApp.applicantName || 'Applicant',
                  action: 'Application Submitted Online',
                  stage: 'Level 0: Pending TO Verification',
                  remarks: 'Application submitted via Single Sign-On.'
                }
              ]
            };
            currentDeptApps.unshift(mapped);
          }
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentDeptApps));
      } catch (e) {
        console.warn('Error syncing citizen submission:', e);
      }
    },

            getFeeStructure: function (category) {
      return REGISTRATION_FEES[category] || REGISTRATION_FEES['tour-operator'];
    },

    calculateFee: function (category, grade) {
      const struct = REGISTRATION_FEES[category];
      if (!struct) return 5000;
      if (!struct.hasGrades) return struct.fixedFee;
      return struct[grade] || struct.defaultFee;
    },

    getIaOfficers: function (district) {
      const d = district || 'Gangtok';
      return IA_OFFICERS_BY_DISTRICT[d] || IA_OFFICERS_BY_DISTRICT['Gangtok'] || [];
    },

    getAllApplications: function () {
      try {
        const hasStorage = (typeof localStorage !== 'undefined');
        const storedVersion = hasStorage ? localStorage.getItem(STORAGE_VERSION_KEY) : null;
        const raw = hasStorage ? localStorage.getItem(STORAGE_KEY) : null;
        
        // Auto-heal if version mismatch, missing storage, or corrupted records
        if (!raw || storedVersion !== CURRENT_SEED_VERSION) {
          return this.resetToSeedData();
        }

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || parsed.length < 20) {
          return this.resetToSeedData();
        }

        // Validate that items have refNo, district, category, and assignedRole
        const sampleValid = parsed.slice(0, 10).every(a => a && a.refNo && a.district && a.category && a.assignedRole);
        if (!sampleValid) {
          return this.resetToSeedData();
        }

        return parsed;
      } catch (e) {
        console.error('Error loading applications:', e);
        return this.resetToSeedData();
      }
    },

    getApplication: function (refNo) {
      const all = this.getAllApplications();
      let match = all.find(a => a.refNo === refNo);
      if (!match) {
        if (typeof TourismBusinessData !== 'undefined' && TourismBusinessData.getApplication) {
          match = TourismBusinessData.getApplication(refNo);
        }
      }
      return match || null;
    },

    saveApplication: function (app) {
      const all = this.getAllApplications();
      const idx = all.findIndex(a => a.refNo === app.refNo);
      if (idx >= 0) {
        all[idx] = app;
      } else {
        all.unshift(app);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      } catch (e) {}
    },

    getDocumentsForApplication: function (app) {
      if (!app) return [];
      const config = app.formConfig || (app.category === 'dealer' ? 'B' : (app.category === 'outdoor-photographer' ? 'C' : 'A'));
      return DOC_MANIFESTS[config] || DOC_MANIFESTS['A'];
    },

    // ------------------------------------------------------------
    // LEVEL 0: TO Initial Verification Actions
    // ------------------------------------------------------------
        toVerifyAndForward: function (refNo, checklist, remarks, targetRole, assignedIaOfficer) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const now = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
      const distOffice = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];

      // Outdoor Photographer is EXEMPT from physical inspection (Direct TO -> DTO route)
      // Tour Operator, Travel Agent, and Dealer MUST go through Level 1 IA
      const requiresInspection = app.category !== 'outdoor-photographer';

      if (requiresInspection) {
        const designatedIa = assignedIaOfficer || app.assignedIaOfficer || (distOffice.iaName || 'Tashi Wangdi Lepcha');
        app.status = 'Under Verification';
        app.currentStage = 'Level 1: Assigned for IA Physical Inspection';
        app.assignedRole = 'IA';
        app.assignedIaOfficer = designatedIa;
        app.inspectionStatus = 'Scheduled for Physical Inspection';
        app.toRemarks = remarks || 'Level 0 verification completed. Assigned to ' + designatedIa + ' for mandatory on-site physical inspection.';
        app.lastUpdated = now;

        app.history.push({
          step: 'Level 0 TO Verification Completed & Assigned to IA ' + designatedIa,
          actor: (distOffice.toName || 'Karma Lhendup Bhutia') + ' (Tourism Officer, Level 0)',
          date: now,
          remarks: app.toRemarks
        });
        if (!app.auditHistory) app.auditHistory = [];
        app.auditHistory.push({
          timestamp: now,
          actorRole: 'Level 0 – Tourism Officer (TO)',
          actorName: distOffice.toName || 'Karma Lhendup Bhutia',
          action: 'Verified Statutory Credentials & Assigned to IA ' + designatedIa + ' for Physical Inspection',
          stage: 'Level 1: Assigned for IA Physical Inspection',
          remarks: app.toRemarks
        });

        this.saveApplication(app);
        return { success: true, message: 'Application ' + refNo + ' verified and assigned to Inspecting Authority ' + designatedIa + ' for mandatory physical inspection.' };
      } else {
        // Direct TO -> DTO route for Outdoor Photographer
        app.status = 'Under Verification';
        app.currentStage = 'Level 2: Pending DTO Sanction';
        app.assignedRole = 'DTO';
        app.inspectionStatus = 'Exempt (Direct Route)';
        app.toRemarks = remarks || 'Level 0 verification satisfactory. Category exempt from physical inspection. Recommended for DTO approval.';
        app.lastUpdated = now;

        app.history.push({
          step: 'Level 0 TO Verification Completed & Forwarded to DTO',
          actor: (distOffice.toName || 'Karma Lhendup Bhutia') + ' (Tourism Officer, Level 0)',
          date: now,
          remarks: app.toRemarks
        });
        if (!app.auditHistory) app.auditHistory = [];
        app.auditHistory.push({
          timestamp: now,
          actorRole: 'Level 0 – Tourism Officer (TO)',
          actorName: distOffice.toName || 'Karma Lhendup Bhutia',
          action: 'Verified Statutory Credentials & Forwarded Directly to Level 2 DTO (Physical Inspection Exempt)',
          stage: 'Level 2: Pending DTO Sanction',
          remarks: app.toRemarks
        });

        this.saveApplication(app);
        return { success: true, message: 'Application ' + refNo + ' verified and forwarded directly to Level 2 DTO for final sanction.' };
      }
    },

    // ------------------------------------------------------------
    // LEVEL 1: IA Physical Inspection Submission (Submits to TO!)
    // ------------------------------------------------------------
        iaSubmitInspectionReport: function (refNo, inspectionData, iaOfficerName) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      if (!inspectionData || !inspectionData.docName) {
        return { success: false, message: 'Inspection Report Document is mandatory for submission.' };
      }

      const now = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
      const distOffice = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const effectiveIaOfficer = iaOfficerName || app.assignedIaOfficer || (distOffice.iaName || 'Tashi Wangdi Lepcha');

      app.inspectionReportDate = now;
      app.assignedIaOfficer = effectiveIaOfficer;
      app.inspectingOfficer = effectiveIaOfficer + ' (Inspecting Authority, Level 1)';
      app.inspectionStatus = 'Inspection Report Submitted to TO';
      app.inspectionDocName = inspectionData.docName;
      app.inspectionDocSize = inspectionData.docSize || '1.8 MB';
      app.inspectionRemarks = (inspectionData.remarks || '').trim();
      app.inspectionFindings = inspectionData.findings || 'On-site physical inspection completed. Commercial premises, trade license, and safety standards verified in order.';
      app.inspectionRecommendation = 'RECOMMENDED_FOR_APPROVAL';

      // Crucial: Returns to Level 0 TO for review!
      app.status = 'Under Verification';
      app.currentStage = 'Level 0: IA Report Received – Pending TO Review';
      app.assignedRole = 'TO';
      app.lastUpdated = now;

      const remarksSummary = app.inspectionRemarks ? (' Remarks: "' + app.inspectionRemarks + '".') : ' No additional remarks provided.';

      app.history.push({
        step: 'Level 1 IA Physical Inspection Report Submitted to TO',
        actor: effectiveIaOfficer + ' (Inspecting Authority, Level 1)',
        date: now,
        remarks: 'Physical Inspection Completed. Uploaded: ' + app.inspectionDocName + '.' + remarksSummary + ' Transmitted to Level 0 TO for review.'
      });
      if (!app.auditHistory) app.auditHistory = [];
      app.auditHistory.push({
        timestamp: now,
        actorRole: 'Level 1 – Inspecting Authority (IA)',
        actorName: effectiveIaOfficer,
        action: 'Submitted Physical Inspection Report to Level 0 TO',
        stage: 'Level 0: IA Report Received – Pending TO Review',
        remarks: 'Uploaded: ' + app.inspectionDocName + '.' + remarksSummary
      });

      this.saveApplication(app);
      return { success: true, message: 'Inspection report for ' + refNo + ' submitted successfully and transmitted to Level 0 TO for review.' };
    },

    // ------------------------------------------------------------
    // LEVEL 0: TO Review of IA Inspection Report -> Forward to DTO
    // ------------------------------------------------------------
    toForwardIaReportToDto: function (refNo, remarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const now = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

      const distOffice = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const toOfficerName = distOffice.toName || 'Karma Lhendup Bhutia';

      app.status = 'Under Verification';
      app.currentStage = 'Level 2: Pending DTO Sanction';
      app.assignedRole = 'DTO';
      app.toInspectionReviewRemarks = remarks || 'Level 0 TO reviewed IA Physical Inspection Report. Endorsed and forwarded to DTO for final statutory sanction.';
      app.lastUpdated = now;

      app.history.push({
        step: 'Level 0 TO Reviewed IA Report & Forwarded to DTO',
        actor: toOfficerName + ' (Tourism Officer, Level 0)',
        date: now,
        remarks: app.toInspectionReviewRemarks
      });
      if (!app.auditHistory) app.auditHistory = [];
      app.auditHistory.push({
        timestamp: now,
        actorRole: 'Level 0 – Tourism Officer (TO)',
        actorName: toOfficerName,
        action: 'Endorsed IA Physical Inspection Report & Forwarded to DTO for Statutory Sanction',
        stage: 'Level 2: Pending DTO Sanction',
        remarks: app.toInspectionReviewRemarks
      });

      this.saveApplication(app);
      return { success: true, message: 'Application ' + refNo + ' with IA Inspection Report endorsed and forwarded to Level 2 DTO for final sanction.' };
    },

    // ------------------------------------------------------------
    // LEVEL 2: DTO Final Statutory Approval & Form 3 Issuance
    // ------------------------------------------------------------
        // ------------------------------------------------------------
    // LEVEL 0: TO Request Re-inspection by IA (Option 2)
    // ------------------------------------------------------------
    toRequestReinspection: function (refNo, instructions, assignedIaOfficer) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      if (!instructions || !instructions.trim()) {
        return { success: false, message: 'Re-inspection instructions are mandatory.' };
      }

      const now = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
      const distOffice = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const toOfficerName = distOffice.toName || 'Karma Lhendup Bhutia';
      const targetIaOfficer = assignedIaOfficer || app.assignedIaOfficer || (distOffice.iaName || 'Tashi Wangdi Lepcha');

      // Preserve existing inspection report in history archive
      if (!app.inspectionHistory) app.inspectionHistory = [];
      if (app.inspectionDocName) {
        app.inspectionHistory.push({
          iteration: app.inspectionHistory.length + 1,
          docName: app.inspectionDocName,
          docSize: app.inspectionDocSize || '1.8 MB',
          remarks: app.inspectionRemarks || 'No additional remarks provided.',
          inspectingOfficer: app.inspectingOfficer || app.assignedIaOfficer,
          submissionDate: app.inspectionReportDate || now,
          toInstructions: instructions.trim()
        });
      }

      // Clear active report fields so IA can upload fresh report
      app.previousInspectionDocName = app.inspectionDocName;
      app.previousInspectionRemarks = app.inspectionRemarks;
      delete app.inspectionDocName;
      delete app.inspectionDocSize;
      delete app.inspectionRemarks;

      app.status = 'Under Verification';
      app.currentStage = 'Level 1: Re-inspection Required';
      app.assignedRole = 'IA';
      app.assignedIaOfficer = targetIaOfficer;
      app.inspectionStatus = 'Re-inspection Required by TO';
      app.reinspectionInstructions = instructions.trim();
      app.reinspectionRequestedDate = now;
      app.lastUpdated = now;

      app.history.push({
        step: 'Level 0 TO Requested Physical Re-inspection',
        actor: toOfficerName + ' (Tourism Officer, Level 0)',
        date: now,
        remarks: 'Re-inspection Instructions: "' + instructions.trim() + '". Reassigned to IA: ' + targetIaOfficer + '.'
      });
      if (!app.auditHistory) app.auditHistory = [];
      app.auditHistory.push({
        timestamp: now,
        actorRole: 'Level 0 – Tourism Officer (TO)',
        actorName: toOfficerName,
        action: 'Requested Physical Re-inspection & Reassigned to IA ' + targetIaOfficer,
        stage: 'Level 1: Re-inspection Required',
        remarks: instructions.trim()
      });

      this.saveApplication(app);
      return { success: true, message: 'Application ' + refNo + ' reassigned to IA ' + targetIaOfficer + ' for re-inspection.' };
    },

        // ------------------------------------------------------------
    // LEVEL 2: DTO Activate Registration Payment (Stage 05)
    // ------------------------------------------------------------
    dtoActivatePayment: function (refNo, grade, dtoOfficerNameOverride) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const now = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
      const distOffice = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const dtoName = dtoOfficerNameOverride || distOffice.dtoName || 'Pema Dorjee Sherpa';

      const feeStruct = REGISTRATION_FEES[app.category] || REGISTRATION_FEES['tour-operator'];
      let selectedGrade = 'Not Applicable';
      let calculatedFee = 0;

      if (feeStruct.hasGrades) {
        selectedGrade = grade || app.registrationGrade || feeStruct.defaultGrade;
        calculatedFee = feeStruct[selectedGrade] || feeStruct.defaultFee;
      } else {
        selectedGrade = 'Not Applicable';
        calculatedFee = feeStruct.fixedFee;
      }

      app.registrationGrade = selectedGrade;
      app.registrationFee = calculatedFee;
      app.paymentActivated = true;
      app.paymentStatus = 'Payment Pending';
      app.status = 'Payment Pending';
      app.currentStage = 'Payment Pending – Awaiting Citizen Fee Deposit';
      app.assignedRole = 'Citizen';
      app.paymentActivatedDate = now;
      app.paymentActivatedBy = dtoName + ' (District Tourism Officer, Level 2)';
      app.lastUpdated = now;

      const gradeInfo = (selectedGrade !== 'Not Applicable') ? (' (' + selectedGrade + ')') : '';
      const stepRemarks = 'Statutory fee payment activated. Category: ' + (app.categoryName || app.category) + gradeInfo + '. Applicable Registration Fee: ₹' + calculatedFee.toLocaleString('en-IN') + '. Transmitted to applicant for online fee deposit.';

      app.history.push({
        step: 'Registration Fee Payment Activated by Level 2 DTO',
        actor: dtoName + ' (District Tourism Officer, Level 2)',
        date: now,
        remarks: stepRemarks
      });
      if (!app.auditHistory) app.auditHistory = [];
      app.auditHistory.push({
        timestamp: now,
        actorRole: 'Level 2 – District Tourism Officer (DTO)',
        actorName: dtoName,
        action: 'Activated Statutory Registration Fee Payment',
        stage: 'Payment Pending – Awaiting Citizen Fee Deposit',
        remarks: stepRemarks
      });

      this.saveApplication(app);
      return {
        success: true,
        fee: calculatedFee,
        grade: selectedGrade,
        message: 'Statutory registration fee of ₹' + calculatedFee.toLocaleString('en-IN') + gradeInfo + ' activated successfully. Applicant notified for online payment.'
      };
    },

    // ------------------------------------------------------------
    // CITIZEN: Process Registration Fee Payment (Stage 05)
    // ------------------------------------------------------------
    processCitizenPayment: function (refNo, paymentDetails) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const now = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
      const details = paymentDetails || {};

      if (details.simulateFail) {
        app.paymentStatus = 'Payment Failed';
        app.lastPaymentError = details.error || 'Transaction declined by bank / payment gateway timeout.';
        app.lastUpdated = now;

        app.history.push({
          step: 'Online Payment Transaction Failed',
          actor: app.applicantName + ' (Citizen Applicant)',
          date: now,
          remarks: 'Payment attempt failed: ' + app.lastPaymentError + '. Application remains in Payment Pending status.'
        });
        if (!app.auditHistory) app.auditHistory = [];
        app.auditHistory.push({
          timestamp: now,
          actorRole: 'Citizen Applicant',
          actorName: app.applicantName,
          action: 'Online Payment Attempt Failed',
          stage: app.currentStage,
          remarks: app.lastPaymentError
        });

        this.saveApplication(app);
        return { success: false, message: 'Payment transaction failed: ' + app.lastPaymentError + '. Please retry payment.' };
      }

      // Successful Payment Flow
      const txnSuffix = Math.floor(100000 + Math.random() * 900000);
      const txnId = details.txnId || ('TXN-SK-TBR-2026-' + txnSuffix);
      const receiptNo = 'RCPT-SK-TCD-2026-' + (app.refNo.slice(-5));
      const method = details.method || 'Online Payment (Sikkim State Portal - SBI e-Pay)';
      const amountPaid = details.amount || app.registrationFee || 7000;

      app.paymentStatus = 'Paid';
      app.paymentTxnId = txnId;
      app.paymentReceiptNo = receiptNo;
      app.paymentDate = now;
      app.paymentMethod = method;
      app.amountPaid = amountPaid;
      delete app.lastPaymentError;

      // CRITICAL WORKFLOW REQUIREMENT:
      // After payment confirmation, application returns DIRECTLY to Level 2 DTO!
      app.status = 'Under Verification';
      app.currentStage = 'Payment Successful – Awaiting DTO Final Review';
      app.assignedRole = 'DTO';
      app.lastUpdated = now;

      const gradeInfo = (app.registrationGrade && app.registrationGrade !== 'Not Applicable') ? (' (' + app.registrationGrade + ')') : '';
      const payRemarks = 'Paid ₹' + amountPaid.toLocaleString('en-IN') + gradeInfo + ' via ' + method + '. Transaction Ref: #' + txnId + ', Receipt #' + receiptNo + '. Application returned directly to Level 2 DTO for final review and statutory sanction.';

      app.history.push({
        step: 'Registration Fee Payment Completed by Citizen',
        actor: app.applicantName + ' (Citizen Applicant)',
        date: now,
        remarks: payRemarks
      });
      if (!app.auditHistory) app.auditHistory = [];
      app.auditHistory.push({
        timestamp: now,
        actorRole: 'Citizen Applicant',
        actorName: app.applicantName,
        action: 'Completed Statutory Registration Fee Payment Online',
        stage: 'Payment Successful – Awaiting DTO Final Review',
        remarks: payRemarks
      });

      this.saveApplication(app);
      return {
        success: true,
        txnId: txnId,
        receiptNo: receiptNo,
        amount: amountPaid,
        message: 'Payment of ₹' + amountPaid.toLocaleString('en-IN') + ' completed successfully. Application returned directly to Level 2 DTO for final review.'
      };
    },

    dtoApprove: function (refNo, remarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      // Mandatory statutory check: If payment was activated, verify it has been completed
      if (app.paymentActivated && app.paymentStatus !== 'Paid') {
        return {
          success: false,
          message: 'Cannot grant final statutory approval: Registration fee payment of ₹' + (app.registrationFee || 0).toLocaleString('en-IN') + ' is pending.'
        };
      }

      const now = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
      const datePart = now.split(',')[0];
      const certSuffix = refNo.substring(refNo.length - 8);
      const certNo = 'SK-TCD-REG-2026-' + certSuffix;

      const d = new Date();
      d.setFullYear(d.getFullYear() + 3);
      const validUntil = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      const distOffice = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const dtoOfficerName = distOffice.dtoName || 'Pema Dorjee Sherpa';

      app.status = 'Approved';
      app.currentStage = 'Approved – Certificate Issued';
      app.assignedRole = 'DTO';
      app.approvalDate = datePart;
      app.certificateNo = certNo;
      app.validUntil = validUntil;
      app.dtoRemarks = remarks || 'Statutory approval granted under The Sikkim Registration of Tourist Trade Rules. 3-Year Registration Certificate issued.';
      app.approvingOfficer = dtoOfficerName + ', District Tourism Officer (DTO)';
      app.lastUpdated = now;

      app.history.push({
        step: 'Final Approval Granted & Certificate Issued',
        actor: dtoOfficerName + ' (District Tourism Officer, Level 2)',
        date: now,
        remarks: 'Statutory sanction granted. Registration Certificate #' + certNo + ' generated with 3-year validity until ' + validUntil + '.'
      });
      if (!app.auditHistory) app.auditHistory = [];
      app.auditHistory.push({
        timestamp: now,
        actorRole: 'Level 2 – District Tourism Officer (DTO)',
        actorName: dtoOfficerName,
        action: 'Granted Statutory Approval & Issued Form 3 Certificate',
        stage: 'Approved – Certificate Issued',
        remarks: 'Statutory approval granted. Certificate #' + certNo + ' valid until ' + validUntil + '.'
      });

      this.saveApplication(app);
      return { success: true, message: 'Application ' + refNo + ' has been granted statutory approval and Certificate #' + certNo + ' has been generated.' };
    },

    // Return to Citizen for Clarification
    returnToCitizen: function (refNo, remarks, role) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const now = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

      const distOffice = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const actorName = (role === 'dto')
        ? (distOffice.dtoName + ' (District Tourism Officer, Level 2)')
        : ((role === 'ia')
          ? (distOffice.iaName + ' (Inspecting Authority, Level 1)')
          : (distOffice.toName + ' (Tourism Officer, Level 0)'));

      app.status = 'Returned for Clarification';
      app.currentStage = 'Returned to Citizen for Clarification';
      app.assignedRole = 'Citizen';
      app.returnRemarks = remarks;
      app.returnedBy = actorName;
      app.returnedDate = now;
      app.lastUpdated = now;

      app.history.push({
        step: 'Application Returned to Citizen for Clarification by ' + (role ? role.toUpperCase() : 'Department'),
        actor: actorName,
        date: now,
        remarks: 'Clarification Required: "' + remarks + '"'
      });
      if (!app.auditHistory) app.auditHistory = [];
      app.auditHistory.push({
        timestamp: now,
        actorRole: role ? role.toUpperCase() : 'Department',
        actorName: actorName,
        action: 'Returned Application to Citizen for Clarification',
        stage: 'Returned to Citizen for Clarification',
        remarks: remarks
      });

      this.saveApplication(app);
      return { success: true, message: 'Application ' + refNo + ' has been returned to the citizen with clarification instructions.' };
    },

    // Reject Application
        rejectApplication: function (refNo, remarks, role) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      if (!remarks || !remarks.trim()) {
        return { success: false, message: 'Statutory grounds for rejection are mandatory.' };
      }

      const now = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
      const distOffice = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const isTo = (role === 'to');
      const actorName = isTo
        ? ((distOffice.toName || 'Karma Lhendup Bhutia') + ' (Tourism Officer, Level 0)')
        : ((role === 'dto') ? ((distOffice.dtoName || 'Pema Dorjee Sherpa') + ' (District Tourism Officer, Level 2)') : 'Department Approving Authority');
      const actorRoleName = isTo ? 'Level 0 – Tourism Officer (TO)' : 'Level 2 – District Tourism Officer (DTO)';

      app.status = 'Rejected';
      app.currentStage = 'Rejected';
      app.assignedRole = 'None';
      app.rejectionGrounds = remarks.trim();
      app.rejectedBy = actorName;
      app.rejectedDate = now;
      app.lastUpdated = now;

      app.history.push({
        step: isTo ? 'Level 0 TO Rejected Application' : 'Application Rejected',
        actor: actorName,
        date: now,
        remarks: 'Departmental Grounds for Rejection: "' + remarks.trim() + '"'
      });
      if (!app.auditHistory) app.auditHistory = [];
      app.auditHistory.push({
        timestamp: now,
        actorRole: actorRoleName,
        actorName: actorName,
        action: 'Rejected Application on Statutory Grounds',
        stage: 'Rejected',
        remarks: remarks.trim()
      });

      this.saveApplication(app);
      return { success: true, message: 'Application ' + refNo + ' has been officially rejected with recorded statutory grounds.' };
    }
  };

  // Initialize engine immediately
  WorkflowEngine.init();

  window.WorkflowEngine = WorkflowEngine;

})(typeof window !== 'undefined' ? window : this);
