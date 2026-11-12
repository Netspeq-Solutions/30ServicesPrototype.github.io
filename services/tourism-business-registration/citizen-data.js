/**
 * CITIZEN & DEPARTMENT WORKSPACE MOCK DATA REPOSITORY
 * Service: Tourism Business & Outdoor Photography Registration
 * Department: Tourism & Civil Aviation Department, Government of Sikkim
 * Theme: Alpine Blue (data-theme="alpine-blue")
 * Roles: Citizen, Level 0 (TO), Level 1 (IA), Level 2 (DTO)
 */

const TourismBusinessData = {
  serviceId: "tourism-business-registration",
  serviceName: "Tourism Business & Outdoor Photography Registration",
  departmentName: "Tourism & Civil Aviation Department",
  governmentName: "Government of Sikkim",
  officeAddress: "Paryatan Bhawan, Tadong, Gangtok, Sikkim – 737102",
  helpline: "03592-209090 / 1800-345-3256",
  email: "secy-tourism@sikkim.gov.in",
  theme: "alpine-blue",

  // 4 Confirmed Registration Categories
  categories: [
    {
      id: "travel-agent",
      code: "TA",
      name: "Travel Agent Registration",
      shortTitle: "Travel Agent",
      categoryNumber: 1,
      icon: "bi-compass",
      badge: "Inspection Mandatory",
      description: "Statutory registration for operating travel agencies, ticketing, and booking desks in Sikkim.",
      requiresInspection: true,
      inspectionBy: "Level 1: Inspecting Authority (IA)",
      prerequisites: "Valid Local Trade License, Business Premise Lease/Ownership, COI/Aadhaar, Firm Registration, Mandatory On-Site Physical Inspection."
    },
    {
      id: "tour-operator",
      code: "TO",
      name: "Tour Operator Registration",
      shortTitle: "Tour Operator",
      categoryNumber: 2,
      icon: "bi-geo-alt",
      badge: "Inspection Mandatory",
      description: "Statutory registration for organizing commercial tour packages, itineraries, and transport logistics.",
      requiresInspection: true,
      inspectionBy: "Level 1: Inspecting Authority (IA)",
      prerequisites: "Registered Office in Sikkim, Fleet Tie-ups, Certified Tour Managers, Firm Incorporation, Mandatory On-Site Physical Inspection."
    },
    {
      id: "dealer",
      code: "DLR",
      name: "Dealer Registration",
      shortTitle: "Equipment Dealer",
      categoryNumber: 3,
      icon: "bi-cart-check",
      badge: "Inspection Mandatory",
      description: "Statutory registration for retail, rental, or maintenance of trekking, mountaineering, and outdoor equipment.",
      requiresInspection: true,
      inspectionBy: "Level 1: Inspecting Authority (IA)",
      prerequisites: "Physical Shop/Showroom Premise, Shop Act License, Stock Inventory, Landlord NOC, Mandatory On-Site Physical Inspection."
    },
    {
      id: "outdoor-photographer",
      code: "PHO",
      name: "Outdoor Photographer Registration",
      shortTitle: "Outdoor Photographer",
      categoryNumber: 4,
      icon: "bi-camera",
      badge: "Direct Route (Exempt from Inspection)",
      description: "Statutory registration for commercial landscape, adventure, drone, and outdoor photographers in Sikkim.",
      requiresInspection: false,
      prerequisites: "Min Class X Certificate, Training Credential, Photography Portfolio, Local Association Recommendation, GST (if applicable)."
    }
  ],

  // Confirmed 4-Level User Hierarchy
  userHierarchy: [
    { level: "Citizen", designation: "Citizen", abbreviation: "CITIZEN", desc: "Submits and tracks registration applications", landingUrl: "dashboard.html" },
    { level: "Level 0", designation: "Tourism Officer", abbreviation: "TO", desc: "Level 0 Verification, Document Check & Query Dispatch", landingUrl: "dashboard-to.html" },
    { level: "Level 1", designation: "Inspecting Authority", abbreviation: "IA", desc: "Level 1 On-Site Premises Inspection & Report Upload", landingUrl: "dashboard-ia.html" },
    { level: "Level 2", designation: "District Tourism Officer", abbreviation: "DTO", desc: "Level 2 District Final Approval & Registration Certificate Issuance", landingUrl: "dashboard-dto.html" }
  ],

  // 6 Sikkim Administrative Districts & Officer Directory
  districts: {
    "Gangtok": {
      name: "Gangtok District",
      dacOffice: "Paryatan Bhawan, Tadong, Gangtok – 737102",
      officers: {
        to: { name: "Karma Lhendup Bhutia", designation: "Tourism Officer (Level 0)", phone: "03592-209091", email: "to.gangtok@sikkim.gov.in" },
        ia: { name: "Tashi Wangdi Lepcha", designation: "Inspecting Authority (Level 1)", phone: "03592-209092", email: "ia.gangtok@sikkim.gov.in" },
        dto: { name: "Pema Dorjee Sherpa", designation: "District Tourism Officer (Level 2)", phone: "03592-209090", email: "dto.gangtok@sikkim.gov.in" }
      }
    },
    "Namchi": {
      name: "Namchi District",
      dacOffice: "DAC Complex, Namchi – 737126",
      officers: {
        to: { name: "Tshering Norbu Rai", designation: "Tourism Officer (Level 0)", phone: "03595-263721", email: "to.namchi@sikkim.gov.in" },
        ia: { name: "Phurba Tamang", designation: "Inspecting Authority (Level 1)", phone: "03595-263722", email: "ia.namchi@sikkim.gov.in" },
        dto: { name: "Pempa Tshering Bhutia", designation: "District Tourism Officer (Level 2)", phone: "03595-263720", email: "dto.namchi@sikkim.gov.in" }
      }
    },
    "Gyalshing": {
      name: "Gyalshing District",
      dacOffice: "DAC Complex, Gyalshing – 737111",
      officers: {
        to: { name: "Lakpa Doma Subba", designation: "Tourism Officer (Level 0)", phone: "03595-250811", email: "to.gyalshing@sikkim.gov.in" },
        ia: { name: "Sangay Chopel Bhutia", designation: "Inspecting Authority (Level 1)", phone: "03595-250812", email: "ia.gyalshing@sikkim.gov.in" },
        dto: { name: "Sonam Gyatso Lepcha", designation: "District Tourism Officer (Level 2)", phone: "03595-250810", email: "dto.gyalshing@sikkim.gov.in" }
      }
    },
    "Mangan": {
      name: "Mangan District",
      dacOffice: "DAC Complex, Mangan – 737116",
      officers: {
        to: { name: "Chewang Norbu Bhutia", designation: "Tourism Officer (Level 0)", phone: "03592-234206", email: "to.mangan@sikkim.gov.in" },
        ia: { name: "Dawa Tshering Lepcha", designation: "Inspecting Authority (Level 1)", phone: "03592-234207", email: "ia.mangan@sikkim.gov.in" },
        dto: { name: "Rinzing Ongmu Bhutia", designation: "District Tourism Officer (Level 2)", phone: "03592-234205", email: "dto.mangan@sikkim.gov.in" }
      }
    },
    "Pakyong": {
      name: "Pakyong District",
      dacOffice: "DAC Complex, Pakyong – 737106",
      officers: {
        to: { name: "Prashant Chettri", designation: "Tourism Officer (Level 0)", phone: "03592-258015", email: "to.pakyong@sikkim.gov.in" },
        ia: { name: "Bikash Sharma", designation: "Inspecting Authority (Level 1)", phone: "03592-258016", email: "ia.pakyong@sikkim.gov.in" },
        dto: { name: "Nim Lhamu Lepcha", designation: "District Tourism Officer (Level 2)", phone: "03592-258014", email: "dto.pakyong@sikkim.gov.in" }
      }
    },
    "Soreng": {
      name: "Soreng District",
      dacOffice: "DAC Complex, Soreng – 737121",
      officers: {
        to: { name: "Youraj Rai", designation: "Tourism Officer (Level 0)", phone: "03595-257003", email: "to.soreng@sikkim.gov.in" },
        ia: { name: "Biren Gurung", designation: "Inspecting Authority (Level 1)", phone: "03595-257004", email: "ia.soreng@sikkim.gov.in" },
        dto: { name: "Norden Bhutia", designation: "District Tourism Officer (Level 2)", phone: "03595-257002", email: "dto.soreng@sikkim.gov.in" }
      }
    }
  },

  // 5-Stage Workflow Lifecycle
  workflowStages: [
    { step: 1, key: "SUBMITTED", title: "Application Submitted", authority: "Citizen / Portal", desc: "Registration form, credentials, and business proofs submitted." },
    { step: 2, key: "TO_SCRUTINY", title: "Level 0: TO Verification", authority: "Tourism Officer (Level 0)", desc: "Initial document check, trade license verification, and eligibility compliance." },
    { step: 3, key: "IA_INSPECTION", title: "Level 1: IA Inspection", authority: "Inspecting Authority (Level 1)", desc: "Physical on-site premises verification & report upload (Mandatory for Dealers)." },
    { step: 4, key: "DTO_APPROVAL", title: "Level 2: DTO Approval", authority: "District Tourism Officer (Level 2)", desc: "Review of TO verification, IA inspection report, and statutory sanction decision." },
    { step: 5, key: "ISSUED", title: "Registration Certificate Issued", authority: "Tourism & Civil Aviation Dept", desc: "Digitally signed registration certificate with QR verification issued." }
  ],

  // 6 Citizen Demonstration Scenarios
  scenarios: {
    // Scenario A: First-time clean state
    scenarioA: {
      id: "scenarioA",
      name: "Scenario A: First-Time Applicant",
      badge: "No Prior Registrations",
      description: "First-time visitor to the portal with empty history, ready to review requirements and start a registration application.",
      citizen: {
        fullName: "Passang Doma Bhutia",
        citizenId: "CIT-SK-804101",
        mobile: "9832014589",
        email: "passang.bhutia@example.in",
        district: "Pakyong",
        address: "Near Pakyong Airport Road, Pakyong – 737106",
        applicantType: "Individual Professional"
      },
      stats: { total: 0, draft: 0, underProcess: 0, approved: 0, returned: 0, rejected: 0 },
      actionRequired: null,
      emptyStateMessage: "You have not submitted any Tourism Business or Outdoor Photography applications yet.",
      applications: [],
      notifications: [
        { id: "notif-01", date: "Just now", title: "Welcome to Unified Tourism Business Portal", message: "Apply online for Travel Agent, Tour Operator, Dealer, and Outdoor Photographer registrations.", type: "info", read: false },
        { id: "notif-02", date: "Earlier today", title: "Sikkim GO Single Sign-On Authenticated", message: "Your citizen identity has been verified through Sikkim GO.", type: "success", read: true }
      ]
    },

    // Scenario B: Draft saved
    scenarioB: {
      id: "scenarioB",
      name: "Scenario B: Incomplete Draft Application",
      badge: "Draft Saved",
      description: "Applicant has started a Travel Agent registration and saved incomplete business details; can resume or discard draft.",
      citizen: {
        fullName: "Karma Tshering Lepcha",
        citizenId: "CIT-SK-804102",
        mobile: "9832145698",
        email: "karma.lepcha@himalayan-escapes.in",
        district: "Gangtok",
        address: "Development Area, Gangtok – 737101",
        applicantType: "Proprietor / Travel Agency"
      },
      stats: { total: 1, draft: 1, underProcess: 0, approved: 0, returned: 0, rejected: 0 },
      actionRequired: {
        title: "Incomplete Travel Agent Registration Draft",
        desc: "Draft saved on Step 2 (Commercial Premise & Trade License Proof). Resume to finalize and submit to Tourism Officer.",
        refNo: "DRAFT-SK-TBR-2026-089",
        actionText: "Resume Draft Application",
        type: "warning"
      },
      applications: [
        {
          refNo: "DRAFT-SK-TBR-2026-089",
          draftId: "DRAFT-SK-TBR-2026-089",
          category: "travel-agent",
          categoryName: "Travel Agent Registration",
          categoryCode: "TA",
          businessName: "Himalayan Escapes & Trails",
          submittedDate: "Saved 04 Nov 2026",
          status: "DRAFT",
          statusLabel: "Draft (Incomplete)",
          district: "Gangtok",
          currentAuthority: "Citizen (Pending Submission)",
          stageDescription: "Premises & trade license details partially completed.",
          canResume: true,
          canDelete: true
        }
      ],
      notifications: [
        { id: "notif-03", date: "04 Nov 2026", title: "Draft Auto-Saved", message: "Your Travel Agent registration draft was saved successfully.", type: "warning", read: false }
      ]
    },

    // Scenario C: Active Applications (Multiple categories in review)
    scenarioC: {
      id: "scenarioC",
      name: "Scenario C: Active Applications Under Verification",
      badge: "Recommended Demo",
      description: "Tenzing Norbu Lepcha with active applications under Level 0 TO verification and Level 1 IA field inspection.",
      citizen: {
        fullName: "Tenzing Norbu Lepcha",
        citizenId: "CIT-SK-804103",
        mobile: "9832045612",
        email: "tenzing.lepcha@sikkim-adventures.in",
        district: "Gangtok",
        address: "Tibet Road, Gangtok – 737101",
        applicantType: "Registered Firm & Outdoor Professional"
      },
      stats: { total: 3, draft: 0, underProcess: 2, approved: 1, returned: 0, rejected: 0 },
      actionRequired: null,
      applications: [
        {
          refNo: "SK-TBR-2026-DLR-00303",
          category: "dealer",
          categoryName: "Dealer Registration",
          categoryCode: "DLR",
          businessName: "Kanchenjunga Gear & Trekking Store",
          submittedDate: "26 Oct 2026, 11:30 AM",
          status: "UNDER_REVIEW",
          statusLabel: "Level 1: IA Inspection Scheduled",
          district: "Gangtok",
          currentAuthority: "Inspecting Authority (Level 1)",
          stageDescription: "On-site premises inspection scheduled for 18 Nov 2026 by Inspecting Authority.",
          requiresInspection: true,
          hasCertificate: false
        },
        {
          refNo: "SK-TBR-2026-PHO-00401",
          category: "outdoor-photographer",
          categoryName: "Outdoor Photographer Registration",
          categoryCode: "PHO",
          businessName: "Himalayan Lens Studio",
          submittedDate: "04 Nov 2026, 09:10 AM",
          status: "UNDER_REVIEW",
          statusLabel: "Level 0: Pending TO Verification",
          district: "Gangtok",
          currentAuthority: "Tourism Officer (Level 0)",
          stageDescription: "Educational credentials and SPA recommendation undergoing verification.",
          requiresInspection: false,
          hasCertificate: false
        },
        {
          refNo: "SK-TBR-2026-TO-00105",
          category: "tour-operator",
          categoryName: "Tour Operator Registration",
          categoryCode: "TO",
          businessName: "Mountain Quest Travels",
          submittedDate: "20 Oct 2026, 10:00 AM",
          status: "APPROVED",
          statusLabel: "Registered (Approved by DTO)",
          district: "Gangtok",
          currentAuthority: "District Tourism Officer (Level 2)",
          stageDescription: "Statutory 5-Year Tour Operator Registration Certificate Issued.",
          certificateNo: "SK-TR-CERT-2026-TO-0042",
          validUntil: "01 Nov 2031",
          hasCertificate: true
        }
      ],
      notifications: [
        { id: "notif-04", date: "03 Nov 2026", title: "IA Field Inspection Scheduled", message: "Inspecting Authority Tashi Wangdi Lepcha will conduct physical inspection of Kanchenjunga Gear on 18 Nov 2026.", type: "info", read: false },
        { id: "notif-05", date: "02 Nov 2026", title: "Tour Operator Registration Approved", message: "Registration certificate for Mountain Quest Travels is ready for download.", type: "success", read: true }
      ]
    },

    // Scenario D: Returned for correction
    scenarioD: {
      id: "scenarioD",
      name: "Scenario D: Returned for Correction by TO",
      badge: "Action Required",
      description: "Pema Choden Rai has a Travel Agent application returned by Tourism Officer (Level 0) requesting updated notary affidavit.",
      citizen: {
        fullName: "Pema Choden Rai",
        citizenId: "CIT-SK-804104",
        mobile: "9832667788",
        email: "pema.rai@summitroute.in",
        district: "Namchi",
        address: "Bhanu Saligram Ward, Namchi – 737126",
        applicantType: "Proprietor"
      },
      stats: { total: 1, draft: 0, underProcess: 0, approved: 0, returned: 1, rejected: 0 },
      actionRequired: {
        title: "Clarification & Updated Document Required by TO",
        desc: "Tourism Officer (Level 0) noted: 'Affidavit from Oath Commissioner is missing notary stamp on page 2. Kindly upload attested copy.'",
        refNo: "SK-TBR-2026-TA-00203",
        actionText: "Upload Attested Affidavit",
        type: "danger"
      },
      applications: [
        {
          refNo: "SK-TBR-2026-TA-00203",
          category: "travel-agent",
          categoryName: "Travel Agent Registration",
          categoryCode: "TA",
          businessName: "Summit Route Holidays",
          submittedDate: "28 Oct 2026, 11:20 AM",
          status: "RETURNED",
          statusLabel: "Returned for Clarification",
          district: "Namchi",
          currentAuthority: "Applicant Action Pending",
          returnRemarks: "Affidavit from Oath Commissioner is missing notary stamp on page 2. Kindly upload attested copy.",
          stageDescription: "Awaiting applicant resubmission with properly executed affidavit.",
          canResubmit: true
        }
      ],
      notifications: [
        { id: "notif-06", date: "30 Oct 2026", title: "Application Returned by TO (Level 0)", message: "Please provide properly stamped oath affidavit for Summit Route Holidays.", type: "danger", read: false }
      ]
    },

    // Scenario E: Fully Approved with Certificate
    scenarioE: {
      id: "scenarioE",
      name: "Scenario E: Approved Dealer with IA Inspection Cleared",
      badge: "Approved & Certified",
      description: "Sonam Gyatso Sherpa whose Dealer registration passed IA physical inspection and received final DTO approval.",
      citizen: {
        fullName: "Sonam Gyatso Sherpa",
        citizenId: "CIT-SK-804105",
        mobile: "9832335577",
        email: "sonam.sherpa@mountainessentials.in",
        district: "Gyalshing",
        address: "Pelling Bazaar, West Sikkim – 737113",
        applicantType: "Proprietor"
      },
      stats: { total: 1, draft: 0, underProcess: 0, approved: 1, returned: 0, rejected: 0 },
      actionRequired: null,
      applications: [
        {
          refNo: "SK-TBR-2026-DLR-00305",
          category: "dealer",
          categoryName: "Dealer Registration",
          categoryCode: "DLR",
          businessName: "Mountain Essentials Trading",
          submittedDate: "15 Oct 2026, 09:00 AM",
          status: "APPROVED",
          statusLabel: "Approved by DTO (Inspection Verified)",
          district: "Gyalshing",
          currentAuthority: "District Tourism Officer (Level 2)",
          stageDescription: "Physical premises verified by IA; final approval granted by DTO.",
          certificateNo: "SK-TR-CERT-2026-DLR-0019",
          validUntil: "31 Oct 2029",
          hasCertificate: true,
          inspectionSummary: "Satisfactory: Commercial retail space 310 sq.ft, certified safety stock, valid Shop Act."
        }
      ],
      notifications: [
        { id: "notif-07", date: "25 Oct 2026", title: "Dealer Certificate Generated", message: "Official Registration Certificate with QR verification code is ready for download.", type: "success", read: true }
      ]
    }
  },

  // Statewide Master Application Repository (for Department TO, IA, DTO Queues)
  allApplications: [
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
],

  getApplicationsByRole: function (role, districtFilter) {
    const list = (typeof window !== 'undefined' && window.WorkflowEngine && typeof window.WorkflowEngine.getAllApplications === 'function')
      ? window.WorkflowEngine.getAllApplications()
      : (this.allApplications || []);
    return list.filter(app => {
      const roleMatch = (role === 'ALL' || (app.assignedRole || '').toUpperCase() === role.toUpperCase());
      const distMatch = (!districtFilter || districtFilter.toUpperCase() === 'ALL' || (app.district || '').toLowerCase() === districtFilter.toLowerCase());
      return roleMatch && distMatch;
    });
  },

  getApplication: function (refNo) {
    if (typeof window !== 'undefined' && window.WorkflowEngine && typeof window.WorkflowEngine.getApplication === 'function') {
      const weApp = window.WorkflowEngine.getApplication(refNo);
      if (weApp) return weApp;
    }
    // Check in allApplications
    let app = (this.allApplications || []).find(a => a.refNo === refNo);
    if (app) return app;

    // Check across scenarios
    for (let sKey in this.scenarios) {
      const scen = this.scenarios[sKey];
      if (scen.applications) {
        const match = scen.applications.find(a => a.refNo === refNo);
        if (match) return match;
      }
    }
    return null;
  }
};

// Export to window
if (typeof window !== 'undefined') {
  window.TourismBusinessData = TourismBusinessData;
  window.TourismCitizenData = TourismBusinessData;
}
