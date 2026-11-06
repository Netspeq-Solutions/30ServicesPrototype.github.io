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
      badge: "Commercial Entity",
      description: "Statutory registration for operating travel agencies, ticketing, and booking desks in Sikkim.",
      requiresInspection: false,
      prerequisites: "Valid Local Trade License, Business Premise Lease/Ownership, COI/Aadhaar, Firm Registration."
    },
    {
      id: "tour-operator",
      code: "TO",
      name: "Tour Operator Registration",
      shortTitle: "Tour Operator",
      categoryNumber: 2,
      icon: "bi-geo-alt",
      badge: "Commercial Operator",
      description: "Statutory registration for organizing commercial tour packages, itineraries, and transport logistics.",
      requiresInspection: false,
      prerequisites: "Registered Office in Sikkim, Fleet Tie-ups, Certified Tour Managers, Firm Incorporation."
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
      badge: "Individual Professional",
      description: "Statutory registration for commercial landscape, adventure, drone, and outdoor photographers in Sikkim.",
      requiresInspection: false,
      prerequisites: "Min Class X Certificate, Training Credential, Photography Portfolio, Local Association Recommendation, GST (if applicable)."
    }
  ],

  // Confirmed 4-Level User Hierarchy
  userHierarchy: [
    { level: "Citizen", designation: "Citizen", abbreviation: "CITIZEN", desc: "Submits and tracks registration applications", landingUrl: "dashboard.html" },
    { level: "Level 0", designation: "Tourism Officer", abbreviation: "TO", desc: "Level 0 Scrutiny, Document Verification & Query Dispatch", landingUrl: "dashboard-to.html" },
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
    { step: 2, key: "TO_SCRUTINY", title: "Level 0: TO Scrutiny", authority: "Tourism Officer (Level 0)", desc: "Initial document check, trade license verification, and eligibility compliance." },
    { step: 3, key: "IA_INSPECTION", title: "Level 1: IA Inspection", authority: "Inspecting Authority (Level 1)", desc: "Physical on-site premises verification & report upload (Mandatory for Dealers)." },
    { step: 4, key: "DTO_APPROVAL", title: "Level 2: DTO Approval", authority: "District Tourism Officer (Level 2)", desc: "Review of TO scrutiny, IA inspection report, and statutory sanction decision." },
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
      name: "Scenario C: Active Applications in Scrutiny",
      badge: "Recommended Demo",
      description: "Tenzing Norbu Lepcha with active applications under Level 0 TO scrutiny and Level 1 IA field inspection.",
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
          refNo: "SK-TBR-2026-DLR-00305",
          category: "dealer",
          categoryName: "Dealer Registration",
          categoryCode: "DLR",
          businessName: "Kanchenjunga Gear & Trekking Store",
          submittedDate: "28 Oct 2026, 11:30 AM",
          status: "UNDER_REVIEW",
          statusLabel: "Level 1: IA Inspection Scheduled",
          district: "Gangtok",
          currentAuthority: "Inspecting Authority (Level 1)",
          stageDescription: "On-site premises inspection scheduled for 08 Nov 2026 by Inspecting Authority.",
          requiresInspection: true,
          hasCertificate: false
        },
        {
          refNo: "SK-TBR-2026-PHO-00402",
          category: "outdoor-photographer",
          categoryName: "Outdoor Photographer Registration",
          categoryCode: "PHO",
          businessName: "Tenzing Norbu (Professional Photography)",
          submittedDate: "02 Nov 2026, 03:15 PM",
          status: "UNDER_REVIEW",
          statusLabel: "Level 0: TO Scrutiny",
          district: "Gangtok",
          currentAuthority: "Tourism Officer (Level 0)",
          stageDescription: "Educational Class X and portfolio credentials undergoing verification.",
          requiresInspection: false,
          hasCertificate: false
        },
        {
          refNo: "SK-TBR-2026-TO-00198",
          category: "tour-operator",
          categoryName: "Tour Operator Registration",
          categoryCode: "TO",
          businessName: "Singalila Eco-Tours Sikkim",
          submittedDate: "15 Oct 2026, 10:00 AM",
          status: "APPROVED",
          statusLabel: "Registered (Approved by DTO)",
          district: "Gangtok",
          currentAuthority: "District Tourism Officer (Level 2)",
          stageDescription: "Statutory 3-Year Tour Operator Registration Certificate Issued.",
          certificateNo: "SK-TCD-REG-2026-TO-00198",
          validUntil: "14 Oct 2029",
          hasCertificate: true
        }
      ],
      notifications: [
        { id: "notif-04", date: "05 Nov 2026", title: "IA Field Inspection Scheduled", message: "Inspecting Authority Tashi Wangdi Lepcha will conduct physical inspection of Kanchenjunga Gear on 08 Nov 2026.", type: "info", read: false },
        { id: "notif-05", date: "20 Oct 2026", title: "Tour Operator Registration Approved", message: "Registration certificate for Singalila Eco-Tours Sikkim is ready for download.", type: "success", read: true }
      ]
    },

    // Scenario D: Returned for correction
    scenarioD: {
      id: "scenarioD",
      name: "Scenario D: Returned for Correction by TO",
      badge: "Action Required",
      description: "Pema Choden Rai has a Travel Agent application returned by Tourism Officer (Level 0) requesting updated trade license.",
      citizen: {
        fullName: "Pema Choden Rai",
        citizenId: "CIT-SK-804104",
        mobile: "9832789123",
        email: "pema.rai@namchi-travels.in",
        district: "Namchi",
        address: "Central Park Bazaar, Namchi – 737126",
        applicantType: "Proprietor"
      },
      stats: { total: 1, draft: 0, underProcess: 0, approved: 0, returned: 1, rejected: 0 },
      actionRequired: {
        title: "Clarification & Updated Document Required by TO",
        desc: "Tourism Officer (Level 0) noted: 'Submitted municipal trade license expired on 31 March 2026. Please upload renewed GPU/Municipal Trade License.'",
        refNo: "SK-TBR-2026-TA-00214",
        actionText: "Upload Updated Trade License",
        type: "danger"
      },
      applications: [
        {
          refNo: "SK-TBR-2026-TA-00214",
          category: "travel-agent",
          categoryName: "Travel Agent Registration",
          categoryCode: "TA",
          businessName: "Namchi Heritage Travel Desk",
          submittedDate: "26 Oct 2026, 02:45 PM",
          status: "RETURNED",
          statusLabel: "Returned for Clarification",
          district: "Namchi",
          currentAuthority: "Applicant Action Pending",
          returnRemarks: "Submitted municipal trade license expired on 31 March 2026. Please upload renewed GPU/Municipal Trade License.",
          stageDescription: "Awaiting applicant resubmission with renewed trade license.",
          canResubmit: true
        }
      ],
      notifications: [
        { id: "notif-06", date: "03 Nov 2026", title: "Application Returned by TO (Level 0)", message: "Please provide renewed trade license for Namchi Heritage Travel Desk.", type: "danger", read: false }
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
        mobile: "9832567890",
        email: "sonam.sherpa@himalayan-gear.in",
        district: "Gyalshing",
        address: "Pelling Main Road, Gyalshing – 737111",
        applicantType: "Managing Partner"
      },
      stats: { total: 1, draft: 0, underProcess: 0, approved: 1, returned: 0, rejected: 0 },
      actionRequired: null,
      applications: [
        {
          refNo: "SK-TBR-2026-DLR-00289",
          category: "dealer",
          categoryName: "Dealer Registration",
          categoryCode: "DLR",
          businessName: "Khangchendzonga Outdoor Gear & Equipment",
          submittedDate: "12 Oct 2026, 11:00 AM",
          status: "APPROVED",
          statusLabel: "Approved by DTO (Inspection Verified)",
          district: "Gyalshing",
          currentAuthority: "District Tourism Officer (Level 2)",
          stageDescription: "Physical premises verified by IA; final approval granted by DTO.",
          certificateNo: "SK-TCD-REG-2026-DLR-00289",
          validUntil: "11 Oct 2029",
          hasCertificate: true,
          inspectionSummary: "Satisfactory: Commercial retail space 450 sq.ft, certified safety stock, valid Shop Act."
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
      refNo: "SK-TBR-2026-TA-00101",
      category: "travel-agent",
      categoryName: "Travel Agent Registration",
      categoryCode: "TA",
      applicantName: "Phurba Tshering Bhutia",
      businessName: "Kanchenjunga Travel Links",
      district: "Gangtok",
      submittedDate: "03 Nov 2026, 10:15 AM",
      status: "SUBMITTED",
      processingStage: "Awaiting Level 0 TO Scrutiny",
      assignedRole: "TO",
      requiresInspection: false,
      applicantContact: "9832101122",
      tradeLicenseNo: "GMC/TL/2026/8941",
      shopAddress: "MG Marg, Gangtok"
    },
    {
      refNo: "SK-TBR-2026-TO-00145",
      category: "tour-operator",
      categoryName: "Tour Operator Registration",
      categoryCode: "TO",
      applicantName: "Bhim Prasad Sharma",
      businessName: "Sikkim Highland Expeditions & Tours",
      district: "Gangtok",
      submittedDate: "01 Nov 2026, 02:30 PM",
      status: "UNDER_REVIEW",
      processingStage: "Under Level 0 TO Verification",
      assignedRole: "TO",
      requiresInspection: false,
      applicantContact: "9832233445",
      tradeLicenseNo: "GMC/TL/2026/7782",
      shopAddress: "Deorali Bazaar, Gangtok"
    },
    {
      refNo: "SK-TBR-2026-DLR-00305",
      category: "dealer",
      categoryName: "Dealer Registration",
      categoryCode: "DLR",
      applicantName: "Tenzing Norbu Lepcha",
      businessName: "Kanchenjunga Gear & Trekking Store",
      district: "Gangtok",
      submittedDate: "28 Oct 2026, 11:30 AM",
      status: "UNDER_REVIEW",
      processingStage: "Assigned for Level 1 IA Physical Inspection",
      assignedRole: "IA",
      requiresInspection: true,
      inspectionStatus: "Scheduled for Inspection",
      inspectionDate: "08 Nov 2026, 11:00 AM",
      inspectingOfficer: "Tashi Wangdi Lepcha (IA)",
      applicantContact: "9832045612",
      tradeLicenseNo: "GMC/TL/2026/6619",
      shopAddress: "Shop #14, Super Market Complex, Gangtok",
      premisesArea: "260 sq.ft",
      stockDetails: "High-altitude climbing tents (12), Crampons (30 pairs), Ice axes (25), Carabiners (120)"
    },
    {
      refNo: "SK-TBR-2026-DLR-00309",
      category: "dealer",
      categoryName: "Dealer Registration",
      categoryCode: "DLR",
      applicantName: "Karma Dorji Bhutia",
      businessName: "Alpine Edge Equipment Hub",
      district: "Gangtok",
      submittedDate: "29 Oct 2026, 03:20 PM",
      status: "UNDER_REVIEW",
      processingStage: "Pending Level 1 IA Physical Inspection",
      assignedRole: "IA",
      requiresInspection: true,
      inspectionStatus: "Pending On-Site Visit",
      inspectingOfficer: "Tashi Wangdi Lepcha (IA)",
      applicantContact: "9832198765",
      tradeLicenseNo: "GMC/TL/2026/7123",
      shopAddress: "Below Star Cinema, Tibet Road, Gangtok",
      premisesArea: "310 sq.ft",
      stockDetails: "Trekking poles, Sleeping bags (-10C), Climbing ropes (UIAA certified), Rucksacks (65L-85L)"
    },
    {
      refNo: "SK-TBR-2026-DLR-00318",
      category: "dealer",
      categoryName: "Dealer Registration",
      categoryCode: "DLR",
      applicantName: "Rinchen Dorjee Bhutia",
      businessName: "Teesta Alpine Outfitters",
      district: "Namchi",
      submittedDate: "25 Oct 2026, 04:00 PM",
      status: "UNDER_REVIEW",
      processingStage: "IA Inspection Report Submitted • Awaiting DTO Approval",
      assignedRole: "DTO",
      requiresInspection: true,
      inspectionStatus: "Inspection Completed • Recommended for Approval",
      inspectingOfficer: "Phurba Tamang (IA)",
      inspectionReportDate: "30 Oct 2026",
      inspectionFindings: "Shop premises 280 sq.ft verified. Fire safety extinguisher valid till Dec 2027. First aid gear maintained. Outdoor inventory in excellent condition.",
      applicantContact: "9832556677",
      tradeLicenseNo: "NMC/TL/2026/3312",
      shopAddress: "Central Park Road, Namchi"
    },
    {
      refNo: "SK-TBR-2026-DLR-00322",
      category: "dealer",
      categoryName: "Dealer Registration",
      categoryCode: "DLR",
      applicantName: "Pemba Tshering Sherpa",
      businessName: "Himalayan Ridge Equipment Store",
      district: "Gangtok",
      submittedDate: "20 Oct 2026, 11:45 AM",
      status: "UNDER_REVIEW",
      processingStage: "IA Inspection Report Submitted • Awaiting DTO Sanction",
      assignedRole: "DTO",
      requiresInspection: true,
      inspectionStatus: "Inspection Completed • Recommended for Approval",
      inspectingOfficer: "Tashi Wangdi Lepcha (IA)",
      inspectionReportDate: "27 Oct 2026",
      inspectionFindings: "Premises area 340 sq.ft exceeds minimum norms. Mandatory Shop Act & Trade License displayed. High-altitude stock certified by UIAA. Recommended for 3-year certificate.",
      applicantContact: "9832889900",
      tradeLicenseNo: "GMC/TL/2026/5541",
      shopAddress: "Development Area, Near Power House, Gangtok"
    },
    {
      refNo: "SK-TBR-2026-TA-00108",
      category: "travel-agent",
      categoryName: "Travel Agent Registration",
      categoryCode: "TA",
      applicantName: "Yangchen Dolkar Lepcha",
      businessName: "Mayal Lyang Tours & Travels",
      district: "Gangtok",
      submittedDate: "22 Oct 2026, 01:15 PM",
      status: "UNDER_REVIEW",
      processingStage: "Level 0 TO Scrutiny Passed • Ready for DTO Sanction",
      assignedRole: "DTO",
      requiresInspection: false,
      toRemarks: "Municipal trade license verified valid till 31 Mar 2027. Office tenancy agreement in order. Recommended for DTO approval.",
      applicantContact: "9832776655",
      tradeLicenseNo: "GMC/TL/2026/4412",
      shopAddress: "Paljor Stadium Road, Gangtok"
    },
    {
      refNo: "SK-TBR-2026-PHO-00402",
      category: "outdoor-photographer",
      categoryName: "Outdoor Photographer Registration",
      categoryCode: "PHO",
      applicantName: "Tenzing Norbu Lepcha",
      businessName: "Tenzing Norbu (Professional Photography)",
      district: "Gangtok",
      submittedDate: "02 Nov 2026, 03:15 PM",
      status: "UNDER_REVIEW",
      processingStage: "Level 0 TO Scrutiny (Credentials Check)",
      assignedRole: "TO",
      requiresInspection: false,
      applicantContact: "9832045612",
      classXBoard: "CBSE / Tashi Namgyal Academy (Class X)",
      portfolioLink: "tenzing-sikkim-portraits.in",
      shopAddress: "Tadong, Gangtok"
    },
    {
      refNo: "SK-TBR-2026-TO-00198",
      category: "tour-operator",
      categoryName: "Tour Operator Registration",
      categoryCode: "TO",
      applicantName: "Tenzing Norbu Lepcha",
      businessName: "Singalila Eco-Tours Sikkim",
      district: "Gangtok",
      submittedDate: "15 Oct 2026, 10:00 AM",
      status: "APPROVED",
      processingStage: "Approved by DTO • Certificate Issued",
      assignedRole: "DTO",
      requiresInspection: false,
      certificateNo: "SK-TCD-REG-2026-TO-00198",
      validUntil: "14 Oct 2029",
      applicantContact: "9832045612",
      tradeLicenseNo: "GMC/TL/2026/1102",
      shopAddress: "MG Marg, Gangtok"
    },
    {
      refNo: "SK-TBR-2026-TA-00214",
      category: "travel-agent",
      categoryName: "Travel Agent Registration",
      categoryCode: "TA",
      applicantName: "Pema Choden Rai",
      businessName: "Namchi Heritage Travel Desk",
      district: "Namchi",
      submittedDate: "26 Oct 2026, 02:45 PM",
      status: "RETURNED",
      processingStage: "Returned to Applicant by TO",
      assignedRole: "TO",
      requiresInspection: false,
      returnRemarks: "Submitted municipal trade license expired on 31 March 2026. Please upload renewed GPU/Municipal Trade License.",
      applicantContact: "9832334411",
      tradeLicenseNo: "NMC/TL/2025/1190",
      shopAddress: "Bhanu Saligram Road, Namchi"
    },
    {
      refNo: "SK-TBR-2026-DLR-00289",
      category: "dealer",
      categoryName: "Dealer Registration",
      categoryCode: "DLR",
      applicantName: "Sonam Gyatso Sherpa",
      businessName: "Khangchendzonga Outdoor Gear & Equipment",
      district: "Gyalshing",
      submittedDate: "12 Oct 2026, 11:00 AM",
      status: "APPROVED",
      processingStage: "Approved by DTO • Certificate Issued",
      assignedRole: "DTO",
      requiresInspection: true,
      certificateNo: "SK-TCD-REG-2026-DLR-00289",
      validUntil: "11 Oct 2029",
      applicantContact: "9832665544",
      tradeLicenseNo: "GYA/TL/2026/8821",
      shopAddress: "Main Bazaar, Pelling, Gyalshing"
    }
  ],

  // Utility Helpers
  getScenario: function (scenarioId) {
    return this.scenarios[scenarioId] || this.scenarios.scenarioC;
  },

  getDistrictOfficers: function (districtName) {
    return this.districts[districtName] || this.districts["Gangtok"];
  },

  getApplicationsByRole: function (role, districtFilter) {
    return this.allApplications.filter(app => {
      const roleMatch = (role === 'ALL' || app.assignedRole === role);
      const distMatch = (!districtFilter || districtFilter === 'ALL' || app.district === districtFilter);
      return roleMatch && distMatch;
    });
  },

  getApplication: function (refNo) {
    // Check in allApplications
    let app = this.allApplications.find(a => a.refNo === refNo);
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
