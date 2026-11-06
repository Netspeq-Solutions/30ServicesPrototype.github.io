/**
 * CITIZEN WORKSPACE MOCK DATA & SCENARIO REPOSITORY
 * Service: Tourism Permission
 * Department: Tourism & Civil Aviation Department, Government of Sikkim
 * Framework: Sikkim Government Services Prototype Framework (Stage 02)
 */

const TourismCitizenData = {
  // Service Metadata
  serviceName: "Tourism Permission",
  departmentName: "Tourism & Civil Aviation Department",
  governmentName: "Government of Sikkim",
  officeAddress: "Paryatan Bhawan, Tadong, Gangtok – 737102",
  helpline: "03592-209090 / 1800-345-3256",
  email: "secy-tourism@sikkim.gov.in",

  // 7 Confirmed Application Categories & Fees (Stage 03)
  categories: [
    { id: "trekking", name: "Trekking", fee: "₹100", feeAmount: 100, badge: "Permit", icon: "bi-person-walking", isPaid: true },
    { id: "expedition", name: "Expedition", fee: "₹100", feeAmount: 100, badge: "High Altitude", icon: "bi-snow", isPaid: true, requiresLO: true },
    { id: "events", name: "Events, Fairs, Melas, Rallies and Marathons", fee: "Free", feeAmount: 0, badge: "Public Gathering", icon: "bi-calendar-event", isPaid: false },
    { id: "drone", name: "Drone", fee: "Free", feeAmount: 0, badge: "Aerial Filming", icon: "bi-camera-video", isPaid: false },
    { id: "adventure", name: "Adventure Activities", fee: "Free", feeAmount: 0, badge: "Sports & Eco", icon: "bi-water", isPaid: false },
    { id: "other", name: "Any Other", fee: "Free", feeAmount: 0, badge: "General Activity", icon: "bi-three-dots", isPaid: false },
    { id: "satellite-phone", name: "Satellite Phone Usage Permission", fee: "Free", feeAmount: 0, badge: "Communication", icon: "bi-broadcast-pin", isPaid: false }
  ],

  // Departmental Liaison Officers (Expedition Category Specific)
  liaisonOfficers: [
    { id: "Tashi", name: "Tashi", designation: "Authorized Liaison Officer", experience: "High Altitude Expeditions" },
    { id: "Roshni", name: "Roshni", designation: "Authorized Liaison Officer", experience: "Alpine Logistics & Safety" },
    { id: "Ganesh", name: "Ganesh", designation: "Authorized Liaison Officer", experience: "Restricted Peak Clearances" }
  ],

  // District to DTO Mapping
  districtDtoMapping: {
    "Gangtok": { dtoOffice: "District Tourism Office, Gangtok Circle", officer: "DTO Gangtok", address: "M.G. Marg, Gangtok – 737101" },
    "Mangan": { dtoOffice: "District Tourism Office, Mangan Circle", officer: "DTO Mangan", address: "DAC Complex, Mangan – 737116" },
    "Namchi": { dtoOffice: "District Tourism Office, Namchi Circle", officer: "DTO Namchi", address: "DAC Complex, Namchi – 737126" },
    "Gyalshing": { dtoOffice: "District Tourism Office, Gyalshing Circle", officer: "DTO Gyalshing", address: "DAC Complex, Gyalshing – 737111" },
    "Pakyong": { dtoOffice: "District Tourism Office, Pakyong Circle", officer: "DTO Pakyong", address: "DAC Complex, Pakyong – 737106" },
    "Soreng": { dtoOffice: "District Tourism Office, Soreng Circle", officer: "DTO Soreng", address: "DAC Complex, Soreng – 737121" }
  },

  // 7-Stage Tourism Permission Workflow Definition
  workflowStages: [
    { step: 1, key: "SUBMITTED", title: "Application Submitted", authority: "Citizen / Portal", desc: "Application form, activity outline, and clearances submitted online." },
    { step: 2, key: "DTO_VERIFY", title: "District DTO Verification", authority: "District Tourism Officer (DTO)", desc: "Initial scrutiny of documents, route/venue feasibility, and local police/panchayat coordination." },
    { step: 3, key: "FWD_HQ", title: "Forwarded to Headquarters", authority: "District Tourism Office", desc: "Application package transmitted to Paryatan Bhawan, Gangtok for departmental assessment." },
    { step: 4, key: "HQ_REVIEW", title: "Headquarters Review", authority: "Joint Director / Director (Tourism)", desc: "State-level clearance review, inter-departmental (Forest/Home/DM) coordination." },
    { step: 5, key: "FWD_DTO_FINAL", title: "Forwarded to District DTO for Final Processing", authority: "Headquarters (Gangtok)", desc: "HQ clearance endorsement communicated back to District Tourism Office." },
    { step: 6, key: "FINAL_DECISION", title: "Final Decision", authority: "Competent Departmental Authority", desc: "Administrative sanction recorded in the system." },
    { step: 7, key: "ISSUED", title: "Permission Issued", authority: "Tourism & Civil Aviation Department", desc: "Digitally signed Tourism Permission Certificate generated with tamper-proof QR code." }
  ],

  // 6 Predefined Citizen Scenarios
  scenarios: {
    // ------------------------------------------------------------------
    // SCENARIO A: First-Time Citizen
    // ------------------------------------------------------------------
    scenarioA: {
      id: "scenarioA",
      name: "Scenario A: First-Time Citizen",
      badge: "No Previous Applications",
      description: "First-time visitor to the portal with an empty history, ready to explore guidelines and start a new application.",
      citizen: {
        fullName: "Passang Doma Bhutia",
        citizenId: "CIT-SK-901428",
        mobile: "9832014589",
        email: "passang.bhutia@example.in",
        district: "Pakyong",
        address: "Near Pakyong Airport Road, Pakyong, Sikkim – 737106",
        applicantType: "Individual Citizen / Trekker"
      },
      stats: {
        total: 0,
        draft: 0,
        underProcess: 0,
        approved: 0,
        returned: 0,
        rejected: 0
      },
      actionRequired: null,
      emptyStateMessage: "You have not submitted any Tourism Permission applications yet.",
      applications: [],
      notifications: [
        {
          id: "notif-01",
          date: "Just now",
          title: "Welcome to Sikkim Tourism Permission Portal",
          message: "You can apply online for Trekking, Expedition, Events, Drone, and Adventure activity clearances.",
          type: "info",
          read: false
        },
        {
          id: "notif-02",
          date: "Earlier today",
          title: "Sikkim GO SSO Authentication Verified",
          message: "Your citizen profile has been authenticated via Sikkim GO Single Sign-On.",
          type: "success",
          read: true
        }
      ]
    },

    // ------------------------------------------------------------------
    // SCENARIO B: Citizen with Draft Applications
    // ------------------------------------------------------------------
    scenarioB: {
      id: "scenarioB",
      name: "Scenario B: Citizen with Draft Applications",
      badge: "Draft in Progress",
      description: "Citizen who started an application, saved their progress, and needs to resume submission.",
      citizen: {
        fullName: "Karma Tshering Lepcha",
        citizenId: "CIT-SK-841920",
        mobile: "9733054128",
        email: "karma.lepcha@trek-sikkim.in",
        district: "Mangan",
        address: "Upper Dzongu, Mangan District, Sikkim – 737116",
        applicantType: "Certified Mountain Trekking Leader"
      },
      stats: {
        total: 1,
        draft: 1,
        underProcess: 0,
        approved: 0,
        returned: 0,
        rejected: 0
      },
      actionRequired: null,
      emptyStateMessage: null,
      applications: [
        {
          refNo: "SK-TP-2026-DFT-0012",
          category: "Trekking",
          categoryName: "Trekking",
          activityTitle: "Dzongri – Goecha La High Altitude Trek (6 Pax)",
          district: "Gyalshing",
          createdDate: "02 Nov 2026",
          lastUpdated: "03 Nov 2026, 04:30 PM",
          status: "DRAFT",
          statusLabel: "Draft Saved",
          statusClass: "gov-badge-draft",
          fee: "₹100",
          currentStage: 1,
          actions: ["continue", "delete"]
        }
      ],
      notifications: [
        {
          id: "notif-b1",
          date: "03 Nov 2026",
          title: "Draft Application Saved",
          message: "Your application for Trekking (Ref: SK-TP-2026-DFT-0012) is saved. You can resume and submit anytime.",
          type: "warning",
          read: false
        }
      ]
    },

    // ------------------------------------------------------------------
    // SCENARIO C: Citizen with Submitted Applications
    // ------------------------------------------------------------------
    scenarioC: {
      id: "scenarioC",
      name: "Scenario C: Citizen with Submitted Applications",
      badge: "Multiple Active Applications",
      description: "Citizen with multiple applications across different categories at various processing stages.",
      citizen: {
        fullName: "Tenzing Norbu Lepcha",
        citizenId: "CIT-SK-882109",
        mobile: "9800123456",
        email: "tenzing.lepcha@example.in",
        district: "Gangtok",
        address: "Near Ridge Park, Below Raj Bhawan, Gangtok, Sikkim – 737101",
        applicantType: "Registered Tour & Adventure Operator"
      },
      stats: {
        total: 3,
        draft: 0,
        underProcess: 2,
        approved: 1,
        returned: 0,
        rejected: 0
      },
      actionRequired: null,
      emptyStateMessage: null,
      applications: [
        {
          refNo: "SK-TP-2026-APP-00481",
          category: "Trekking",
          categoryName: "Trekking",
          activityTitle: "Singalila Ridge Scenic Eco-Trek (8 Indian Trekkers)",
          district: "Gyalshing",
          submissionDate: "01 Nov 2026",
          lastUpdated: "03 Nov 2026, 11:15 AM",
          status: "UNDER_REVIEW",
          statusLabel: "DTO Verification",
          statusClass: "gov-badge-review",
          fee: "₹100 (Paid via UPI)",
          currentStage: 2,
          handlingOfficer: "P. T. Bhutia, Dealing Assistant (DTO Gyalshing)",
          remarks: "Initial scrutiny of applicant identity credentials and guide certifications completed.",
          actions: ["track", "details"]
        },
        {
          refNo: "SK-TP-2026-APP-00390",
          category: "Adventure Activities",
          categoryName: "Adventure Activities",
          activityTitle: "Commercial White Water Rafting Season Clearance – Teesta River Zone",
          district: "Gangtok",
          submissionDate: "25 Oct 2026",
          lastUpdated: "02 Nov 2026, 02:40 PM",
          status: "UNDER_REVIEW",
          statusLabel: "Headquarters Review",
          statusClass: "gov-badge-review",
          fee: "Free",
          currentStage: 4,
          handlingOfficer: "Joint Director (Tourism), Paryatan Bhawan, Gangtok",
          remarks: "Safety equipment audit certificate and river guide certifications forwarded for state-level clearance.",
          actions: ["track", "details"]
        },
        {
          refNo: "SK-TP-2026-APP-00215",
          category: "Trekking",
          categoryName: "Trekking",
          activityTitle: "Green Lake Reconnaissance Trek (4 Pax)",
          district: "Mangan",
          submissionDate: "10 Oct 2026",
          lastUpdated: "20 Oct 2026, 10:00 AM",
          status: "APPROVED",
          statusLabel: "Approved & Issued",
          statusClass: "gov-badge-approved",
          fee: "₹100 (Paid)",
          currentStage: 7,
          handlingOfficer: "Director (Tourism), Government of Sikkim",
          remarks: "All clearances validated. Official Permission Certificate issued.",
          actions: ["certificate", "track"]
        }
      ],
      notifications: [
        {
          id: "notif-c1",
          date: "03 Nov 2026",
          title: "Application SK-TP-2026-APP-00481 Scrutinized",
          message: "District Tourism Officer (Gyalshing) has commenced initial document verification.",
          type: "info",
          read: false
        },
        {
          id: "notif-c2",
          date: "02 Nov 2026",
          title: "Application SK-TP-2026-APP-00390 Under State Review",
          message: "Your Adventure Rafting application has been received by Headquarters, Gangtok.",
          type: "info",
          read: false
        },
        {
          id: "notif-c3",
          date: "20 Oct 2026",
          title: "Permission Issued for SK-TP-2026-APP-00215",
          message: "Green Lake Trek permission approved. You may download your digital certificate.",
          type: "success",
          read: true
        }
      ]
    },

    // ------------------------------------------------------------------
    // SCENARIO D: Citizen with Returned Application
    // ------------------------------------------------------------------
    scenarioD: {
      id: "scenarioD",
      name: "Scenario D: Citizen with Returned Application",
      badge: "Action Required / Clarification Needed",
      description: "Application returned by the departmental scrutiny officer requesting specific corrections and re-upload.",
      citizen: {
        fullName: "Pema Choden Rai",
        citizenId: "CIT-SK-792831",
        mobile: "9434089123",
        email: "pema.rai@namchifest.org",
        district: "Namchi",
        address: "DAC Complex Road, Namchi, South Sikkim – 737126",
        applicantType: "Cultural Society / Event Coordinator"
      },
      stats: {
        total: 2,
        draft: 0,
        underProcess: 1,
        approved: 0,
        returned: 1,
        rejected: 0
      },
      actionRequired: {
        refNo: "SK-TP-2026-APP-00329",
        category: "Events, Fairs, Melas, Rallies and Marathons",
        title: "South Sikkim Eco-Tourism Cultural Fair & Marathon 2026",
        returnedDate: "02 Nov 2026",
        returnedBy: "Dealing Officer, DTO Namchi",
        remarks: "The uploaded Fire Safety NOC is illegible and missing official station seal. Please re-upload a clear, high-resolution scanned copy of the valid Fire Safety Clearance from Namchi Fire Station. Also attach revised crowd safety and parking layout.",
        deadline: "09 Nov 2026 (7 Days to respond)"
      },
      emptyStateMessage: null,
      applications: [
        {
          refNo: "SK-TP-2026-APP-00329",
          category: "Events, Fairs, Melas, Rallies and Marathons",
          categoryName: "Events & Fairs",
          activityTitle: "South Sikkim Eco-Tourism Cultural Fair & Marathon 2026",
          district: "Namchi",
          submissionDate: "28 Oct 2026",
          lastUpdated: "02 Nov 2026, 03:15 PM",
          status: "RETURNED",
          statusLabel: "Returned for Clarification",
          statusClass: "gov-badge-returned",
          fee: "Free",
          currentStage: 2,
          handlingOfficer: "Dealing Officer (DTO Namchi)",
          remarks: "Fire NOC illegible; revised layout required.",
          actions: ["resubmit", "track", "details"]
        },
        {
          refNo: "SK-TP-2026-APP-00104",
          category: "Drone",
          categoryName: "Drone",
          activityTitle: "Tourism Promotional Video Aerial Drone Coverage – Namchi & Ravangla",
          district: "Namchi",
          submissionDate: "15 Oct 2026",
          lastUpdated: "30 Oct 2026, 11:00 AM",
          status: "UNDER_REVIEW",
          statusLabel: "Under Review",
          statusClass: "gov-badge-review",
          fee: "Free",
          currentStage: 3,
          handlingOfficer: "DTO Namchi",
          remarks: "Forwarded to District Administration and Police for security nod.",
          actions: ["track", "details"]
        }
      ],
      notifications: [
        {
          id: "notif-d1",
          date: "02 Nov 2026",
          title: "ACTION REQUIRED: Application Returned",
          message: "Application SK-TP-2026-APP-00329 returned by DTO Namchi for re-uploading Fire Safety NOC.",
          type: "danger",
          read: false
        }
      ]
    },

    // ------------------------------------------------------------------
    // SCENARIO E: Citizen with Approved Application
    // ------------------------------------------------------------------
    scenarioE: {
      id: "scenarioE",
      name: "Scenario E: Citizen with Approved Application",
      badge: "Permission Issued",
      description: "Demonstrates an approved mountaineering expedition permit complete with tamper-proof QR certificate preview access.",
      citizen: {
        fullName: "Sonam Gyatso Sherpa",
        citizenId: "CIT-SK-861042",
        mobile: "9812048912",
        email: "sonam.sherpa@himalayan-expeditions.in",
        district: "Gyalshing",
        address: "Yuksom Historic Zone, Gyalshing District, Sikkim – 737111",
        applicantType: "Certified Expedition Leader / Agency"
      },
      stats: {
        total: 2,
        draft: 0,
        underProcess: 0,
        approved: 2,
        returned: 0,
        rejected: 0
      },
      actionRequired: null,
      emptyStateMessage: null,
      applications: [
        {
          refNo: "SK-TP-2026-APP-00198",
          category: "Expedition",
          categoryName: "Expedition",
          activityTitle: "Mt. Kabru Dome Peak Expedition (10 Climbers + Liaison Officer)",
          district: "Gyalshing",
          submissionDate: "12 Oct 2026",
          lastUpdated: "26 Oct 2026, 04:00 PM",
          status: "APPROVED",
          statusLabel: "Approved & Issued",
          statusClass: "gov-badge-approved",
          fee: "₹100 (Paid)",
          currentStage: 7,
          handlingOfficer: "Secretary, Tourism & Civil Aviation Department",
          remarks: "Expedition sanctioned. Departmental Liaison Officer assigned: Sri T. W. Lepcha (DTO Office).",
          certRef: "SK-TOUR-2026-EXP-00198",
          validUntil: "30 Nov 2026",
          actions: ["certificate", "track", "details"]
        },
        {
          refNo: "SK-TP-2026-APP-00142",
          category: "Trekking",
          categoryName: "Trekking",
          activityTitle: "Kasturi Orar – Labdang Trek (5 Pax)",
          district: "Gyalshing",
          submissionDate: "05 Oct 2026",
          lastUpdated: "18 Oct 2026, 02:30 PM",
          status: "APPROVED",
          statusLabel: "Approved & Issued",
          statusClass: "gov-badge-approved",
          fee: "₹100 (Paid)",
          currentStage: 7,
          handlingOfficer: "Director (Tourism)",
          remarks: "Permission granted for stipulated 7-day window.",
          certRef: "SK-TOUR-2026-TRK-00142",
          validUntil: "25 Oct 2026",
          actions: ["certificate", "track", "details"]
        }
      ],
      notifications: [
        {
          id: "notif-e1",
          date: "26 Oct 2026",
          title: "Expedition Permission Sanctioned!",
          message: "Permission SK-TP-2026-APP-00198 approved. Digital QR Certificate is available for download.",
          type: "success",
          read: false
        }
      ]
    },

    // ------------------------------------------------------------------
    // SCENARIO F: Citizen with Rejected Application
    // ------------------------------------------------------------------
    scenarioF: {
      id: "scenarioF",
      name: "Scenario F: Citizen with Rejected Application",
      badge: "Application Rejected",
      description: "Demonstrates an application that could not be approved due to statutory defense/security restricted airspace guidelines.",
      citizen: {
        fullName: "Rahul Sharma",
        citizenId: "CIT-SK-923810",
        mobile: "9832049182",
        email: "rahul.sharma@aerialfilms.in",
        district: "Soreng",
        address: "Near DAC Soreng, Soreng District, Sikkim – 737121",
        applicantType: "Commercial Aerial Cinematographer"
      },
      stats: {
        total: 1,
        draft: 0,
        underProcess: 0,
        approved: 0,
        returned: 0,
        rejected: 1
      },
      actionRequired: null,
      emptyStateMessage: null,
      applications: [
        {
          refNo: "SK-TP-2026-APP-00277",
          category: "Drone",
          categoryName: "Drone",
          activityTitle: "Commercial Aerial Cinematography & Drone Mapping – West Sikkim Border Zone",
          district: "Soreng",
          submissionDate: "20 Oct 2026",
          lastUpdated: "29 Oct 2026, 05:00 PM",
          status: "REJECTED",
          statusLabel: "Rejected",
          statusClass: "gov-badge-rejected",
          fee: "Free",
          currentStage: 6,
          handlingOfficer: "Joint Director (Tourism) / State Security Committee",
          remarks: "Proposed aerial flight coordinates fall within prohibited defense buffer and international border restricted airspace under DGCA and Ministry of Home Affairs security guidelines. Security clearance was withheld by concerned authorities.",
          actions: ["track", "details"]
        }
      ],
      notifications: [
        {
          id: "notif-f1",
          date: "29 Oct 2026",
          title: "Decision Notice: Application Rejected",
          message: "Application SK-TP-2026-APP-00277 for Drone operation has been rejected due to border airspace restrictions.",
          type: "danger",
          read: false
        }
      ]
    }
  },

  // ------------------------------------------------------------------
  // DEPARTMENT ADMIN: DTO (District Tourism Officer) MOCK DATA
  // ------------------------------------------------------------------
  dtoData: {
    officer: {
      name: "Karma Lhendup Bhutia",
      designation: "District Tourism Officer (DTO)",
      circle: "Gangtok Circle",
      district: "Gangtok",
      office: "District Tourism Office, M.G. Marg, Gangtok – 737101",
      email: "dto-gangtok@sikkimtourism.gov.in",
      phone: "03592-202341"
    },
    metrics: {
      received: 14,
      awaitingVerification: 5,
      forwardedToHq: 7,
      returnedForAction: 2
    },
    pendingQueue: [
      {
        refNo: "SK-TP-2026-APP-00481",
        category: "Trekking",
        categoryBadge: "Permit",
        applicantName: "Tenzing Norbu Lepcha",
        applicantPhone: "9800123456",
        activityTitle: "Singalila Ridge Scenic Eco-Trek (8 Indian Trekkers)",
        appliedDate: "01 Nov 2026",
        location: "Uttarey – Singalila Ridge Trail",
        feeStatus: "Paid (₹100)",
        status: "Pending Scrutiny",
        statusBadge: "bg-warning text-dark",
        priority: "High",
        documentsCount: 4,
        stage: 2
      },
      {
        refNo: "SK-TP-2026-APP-00492",
        category: "Events, Fairs, Melas, Rallies and Marathons",
        categoryBadge: "Public Gathering",
        applicantName: "Dawa Pintso Bhutia",
        applicantPhone: "9733081234",
        activityTitle: "Gangtok Winter Eco-Carnival & Heritage Walk",
        appliedDate: "02 Nov 2026",
        location: "Ridge Park to Paljor Stadium, Gangtok",
        feeStatus: "Free",
        status: "Pending Scrutiny",
        statusBadge: "bg-warning text-dark",
        priority: "Medium",
        documentsCount: 5,
        stage: 2
      },
      {
        refNo: "SK-TP-2026-APP-00501",
        category: "Drone",
        categoryBadge: "Aerial Filming",
        applicantName: "Rinchen Dorjee",
        applicantPhone: "9832019876",
        activityTitle: "Aerial Survey for Urban Tourism Documentary – Tashi View Point",
        appliedDate: "03 Nov 2026",
        location: "Tashi View Point & Enchey Environs",
        feeStatus: "Free",
        status: "Pending Police Nod",
        statusBadge: "bg-info text-dark",
        priority: "Low",
        documentsCount: 3,
        stage: 2
      },
      {
        refNo: "SK-TP-2026-APP-00465",
        category: "Adventure Activities",
        categoryBadge: "Sports & Eco",
        applicantName: "Sunil Pradhan",
        applicantPhone: "9434056789",
        activityTitle: "Paragliding Season Commercial Permit – Bulbuley Ridge",
        appliedDate: "29 Oct 2026",
        location: "Bulbuley Takeoff to Reshithang Landing Ground",
        feeStatus: "Free",
        status: "Pending Scrutiny",
        statusBadge: "bg-warning text-dark",
        priority: "High",
        documentsCount: 6,
        stage: 2
      },
      {
        refNo: "SK-TP-2026-APP-00440",
        category: "Any Other",
        categoryBadge: "General Activity",
        applicantName: "Bishnu Maya Sharma",
        applicantPhone: "9609012345",
        activityTitle: "Commercial Photography and Documentary Filming at Rumtek Zone",
        appliedDate: "28 Oct 2026",
        location: "Rumtek Heritage Buffer Zone",
        feeStatus: "Free",
        status: "Pending Scrutiny",
        statusBadge: "bg-warning text-dark",
        priority: "Medium",
        documentsCount: 3,
        stage: 2
      }
    ]
  },

  // ------------------------------------------------------------------
  // DEPARTMENT ADMIN: HQ (Headquarters Administrator) MOCK DATA
  // ------------------------------------------------------------------
  hqData: {
    officer: {
      name: "Dr. Tshering Yangchen Lepcha",
      designation: "Additional Secretary (Tourism) & HQ Administrator",
      office: "Headquarters, Paryatan Bhawan, Tadong, Gangtok – 737102",
      email: "secy-tourism@sikkim.gov.in",
      phone: "03592-209090 / 1800-345-3256"
    },
    metrics: {
      receivedFromDto: 12,
      awaitingHqReview: 4,
      underReview: 5,
      forwardedForFinal: 3
    },
    pendingQueue: [
      {
        refNo: "SK-TP-2026-APP-00390",
        category: "Adventure Activities",
        applicantName: "Tenzing Norbu Lepcha",
        originatingDistrict: "Gangtok",
        activityTitle: "Commercial White Water Rafting Season Clearance – Teesta River Zone",
        forwardedDate: "02 Nov 2026",
        forwardedBy: "DTO Gangtok",
        status: "Awaiting HQ Review",
        statusBadge: "bg-primary text-white",
        priority: "High",
        stage: 4
      },
      {
        refNo: "SK-TP-2026-APP-00412",
        category: "Expedition",
        applicantName: "Pempa Tshering",
        originatingDistrict: "Gyalshing",
        activityTitle: "Mount Pandim Mountaineering Expedition (8 Pax + Assigned LO)",
        forwardedDate: "01 Nov 2026",
        forwardedBy: "DTO Gyalshing",
        status: "Awaiting HQ Review",
        statusBadge: "bg-primary text-white",
        priority: "High",
        stage: 4
      },
      {
        refNo: "SK-TP-2026-APP-00385",
        category: "Events, Fairs, Melas, Rallies and Marathons",
        applicantName: "Lhamo Doma",
        originatingDistrict: "Mangan",
        activityTitle: "North Sikkim Snow & Cultural Festival 2026 – Lachung",
        forwardedDate: "31 Oct 2026",
        forwardedBy: "DTO Mangan",
        status: "Under Inter-Dept Review",
        statusBadge: "bg-info text-dark",
        priority: "Medium",
        stage: 4
      },
      {
        refNo: "SK-TP-2026-APP-00366",
        category: "Drone",
        applicantName: "Vikramaditya Sen",
        originatingDistrict: "Pakyong",
        activityTitle: "National Geographic Valley Aerial Filming – Pakyong Green Belt",
        forwardedDate: "30 Oct 2026",
        forwardedBy: "DTO Pakyong",
        status: "Awaiting Security Clearance",
        statusBadge: "bg-secondary text-white",
        priority: "High",
        stage: 4
      }
    ]
  }
};

// Global Browser Exports
window.TourismCitizenData = TourismCitizenData;
window.TourismDepartmentData = {
  dto: TourismCitizenData.dtoData,
  hq: TourismCitizenData.hqData
};


