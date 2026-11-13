/**
 * CITIZEN & DEPARTMENT WORKSPACE MOCK DATA REPOSITORY
 * Service: Adventure Tour Operator & Guide Registration
 * Department: Tourism & Civil Aviation Department, Government of Sikkim
 * Theme: Royal Navy (data-theme="royal-navy")
 * Roles: Citizen, Department - TA, Department - IA, Department - Asst. Dir., Department - DTO (6 Districts)
 */

const AdventureServiceData = {
  serviceId: "adventure-tour-operator-guide-registration",
  serviceName: "Adventure Tour Operator & Guide Registration",
  serviceShortName: "Adventure Operator & Guide",
  departmentName: "Tourism & Civil Aviation Department",
  governmentName: "Government of Sikkim",
  officeAddress: "Paryatan Bhawan, Tadong, Gangtok, Sikkim – 737102",
  helpline: "03592-209090 / 1800-345-3256",
  email: "secy-tourism@sikkim.gov.in",
  theme: "royal-navy",

  // 2 Distinct Registration Categories
  categories: [
    {
      id: "adventure-tour-operator",
      code: "ATO",
      name: "Adventure Tour Operator",
      shortTitle: "Adventure Operator",
      categoryNumber: 1,
      icon: "bi-compass",
      badge: "Commercial Enterprise",
      description: "Statutory registration for operating commercial mountaineering, trekking, river rafting, paragliding, and adventure tourism in Sikkim.",
      requiresInspection: true,
      inspectionBy: "Department – IA (Inspecting Authority)",
      prerequisites: "Agency Registration / Trade License, Qualified Technical Team, Equipment Safety Inspection Report, Public Liability Insurance."
    },
    {
      id: "guide-registration",
      code: "GR",
      name: "Guide Registration",
      shortTitle: "Tour Guide",
      categoryNumber: 2,
      icon: "bi-person-badge",
      badge: "Professional Certification",
      description: "Official government accreditation for individual professional tourist guides for trekking, mountaineering, cultural and eco-tourism.",
      requiresInspection: false,
      prerequisites: "Sikkim Resident / Domicile, Age ≥ 18, Mountaineering / Guide Course from recognized institute (HMI / NIM / IITTM), Medical Fitness Certificate, Police Clearance."
    }
  ],

  // 5 User Roles in Hierarchy
  userHierarchy: [
    { roleKey: "citizen", level: "Citizen", designation: "Citizen Applicant", abbreviation: "CITIZEN", desc: "Applies for Adventure Operator or Guide registration and tracks status", landingUrl: "dashboard.html" },
    { roleKey: "ta", level: "Department", designation: "Technical Assistant", abbreviation: "TA", desc: "Initial technical verification, equipment checklist review and scrutiny", landingUrl: "dashboard-ta.html" },
    { roleKey: "ia", level: "Department", designation: "Inspecting Authority", abbreviation: "IA", desc: "Field & equipment safety inspection, physical verification & report upload", landingUrl: "dashboard-ia.html" },
    { roleKey: "asst-dir", level: "Department", designation: "Assistant Director", abbreviation: "Asst. Dir.", desc: "State-level technical review, policy compliance & concurrence desk", landingUrl: "dashboard-asst-dir.html" },
    { roleKey: "dto", level: "Department", designation: "District Tourism Officer", abbreviation: "DTO", desc: "District-level administrative sanction, final approval & certificate issuance", landingUrl: "dashboard-dto.html" }
  ],

  // 6 Sikkim Administrative Districts & Demonstration DTO Officers
  districts: {
    "Gangtok": {
      name: "Gangtok District",
      shortCode: "GTK",
      dacOffice: "Paryatan Bhawan, Tadong, Gangtok – 737102",
      officer: {
        name: "Pema Dorjee Sherpa",
        designation: "District Tourism Officer (Gangtok)",
        phone: "03592-209090",
        email: "dto.gangtok@sikkim.gov.in"
      }
    },
    "Mangan": {
      name: "Mangan District",
      shortCode: "MGN",
      dacOffice: "DAC Complex, Mangan, North Sikkim – 737116",
      officer: {
        name: "Rinzing Ongmu Bhutia",
        designation: "District Tourism Officer (Mangan)",
        phone: "03592-234205",
        email: "dto.mangan@sikkim.gov.in"
      }
    },
    "Namchi": {
      name: "Namchi District",
      shortCode: "NMC",
      dacOffice: "DAC Complex, Namchi, South Sikkim – 737126",
      officer: {
        name: "Pempa Tshering Bhutia",
        designation: "District Tourism Officer (Namchi)",
        phone: "03595-263720",
        email: "dto.namchi@sikkim.gov.in"
      }
    },
    "Gyalshing": {
      name: "Gyalshing District",
      shortCode: "GLS",
      dacOffice: "DAC Complex, Gyalshing, West Sikkim – 737111",
      officer: {
        name: "Sonam Gyatso Lepcha",
        designation: "District Tourism Officer (Gyalshing)",
        phone: "03595-250810",
        email: "dto.gyalshing@sikkim.gov.in"
      }
    },
    "Pakyong": {
      name: "Pakyong District",
      shortCode: "PKG",
      dacOffice: "DAC Complex, Pakyong, Sikkim – 737106",
      officer: {
        name: "Nim Lhamu Lepcha",
        designation: "District Tourism Officer (Pakyong)",
        phone: "03592-258014",
        email: "dto.pakyong@sikkim.gov.in"
      }
    },
    "Soreng": {
      name: "Soreng District",
      shortCode: "SRG",
      dacOffice: "DAC Complex, Soreng, Sikkim – 737121",
      officer: {
        name: "Norden Bhutia",
        designation: "District Tourism Officer (Soreng)",
        phone: "03595-257002",
        email: "dto.soreng@sikkim.gov.in"
      }
    }
  },

  // Citizen Demonstration Scenarios
  scenarios: {
    // Scenario A: First-time citizen with 0 applications
    scenarioA: {
      id: "scenarioA",
      name: "Scenario A: First-Time Citizen",
      badge: "No Prior Applications",
      description: "First-time citizen with empty history, ready to explore registration options and start an application.",
      citizen: {
        fullName: "Passang Doma Bhutia",
        citizenId: "CIT-SK-901101",
        mobile: "9832014589",
        email: "passang.bhutia@example.in",
        district: "Gangtok",
        address: "Tadong, Gangtok – 737102"
      },
      stats: { total: 0, underProcess: 0, actionRequired: 0, approved: 0, rejected: 0 },
      actionRequired: null,
      activeApplication: null,
      approvedApplication: null,
      emptyState: {
        title: "You haven't submitted any registration applications yet.",
        description: "Select the registration type and review the application instructions before starting your application.",
        ctaText: "Explore Registration Options"
      },
      applications: [],
      notifications: [
        { id: "notif-01", date: "Just now", title: "Welcome to Adventure Tour Operator & Guide Portal", message: "Apply online for Adventure Tour Operator or Guide Registration through Sikkim GO.", type: "info", read: false },
        { id: "notif-02", date: "Today", title: "Single Sign-On Authenticated", message: "Your identity has been verified through Sikkim GO.", type: "success", read: true }
      ]
    },

    // Scenario B: Citizen with Ongoing Application (Under Process)
    scenarioB: {
      id: "scenarioB",
      name: "Scenario B: Ongoing Application",
      badge: "Under Verification",
      description: "Citizen with an active application under technical verification and scheduled field inspection.",
      citizen: {
        fullName: "Tenzing Norbu Lepcha",
        citizenId: "CIT-SK-901102",
        mobile: "9832145698",
        email: "tenzing.norbu@himalayantrails.in",
        district: "Gangtok",
        address: "Development Area, Gangtok – 737101"
      },
      stats: { total: 1, underProcess: 1, actionRequired: 0, approved: 0, rejected: 0 },
      actionRequired: null,
      activeApplication: {
        refNo: "SK-ATO-2026-0042",
        typeId: "adventure-tour-operator",
        typeName: "Adventure Tour Operator",
        badge: "Under Review",
        enterpriseName: "Khangchendzonga Adventure Trails LLP",
        submittedDate: "08 Nov 2026",
        currentStage: "Stage 2: Technical Assistant (TA) Scrutiny",
        currentStatus: "Under Review",
        lastUpdated: "12 Nov 2026",
        district: "Gangtok",
        nextExpectedStep: "On-site safety equipment and safety harness inspection by Inspecting Authority (IA).",
        timeline: [
          { stage: "Application Submitted", date: "08 Nov 2026", status: "Completed", authority: "Citizen / Portal", remarks: "Application and statutory credentials uploaded successfully." },
          { stage: "TA Document Verification", date: "10 Nov 2026", status: "In Progress", authority: "Department – TA (Gangtok)", remarks: "Lead instructor mountaineering certificates and equipment checklist under review." },
          { stage: "IA Field Inspection", date: "Pending", status: "Pending", authority: "Department – IA", remarks: "Physical on-site inspection of adventure gear and safety harness." },
          { stage: "Asst. Dir. Review", date: "Pending", status: "Pending", authority: "Department – Asst. Dir.", remarks: "State-level technical concurrence and review." },
          { stage: "DTO Approval & Certificate", date: "Pending", status: "Pending", authority: "Department – DTO (Gangtok)", remarks: "Final statutory sanction and digital QR certificate issuance." }
        ]
      },
      approvedApplication: null,
      applications: [
        {
          refNo: "SK-ATO-2026-0042",
          typeId: "adventure-tour-operator",
          typeName: "Adventure Tour Operator",
          categoryCode: "ATO",
          title: "Khangchendzonga Adventure Trails LLP",
          submittedDate: "08 Nov 2026",
          status: "UNDER_REVIEW",
          statusBadge: "bg-info-subtle text-info border border-info-subtle",
          statusLabel: "Under Review",
          currentStage: "TA Technical Scrutiny",
          district: "Gangtok"
        }
      ],
      notifications: [
        { id: "notif-03", date: "10 Nov 2026", title: "Technical Verification Initiated", message: "Application SK-ATO-2026-0042 is being verified by Technical Assistant, Gangtok.", type: "info", read: false },
        { id: "notif-04", date: "08 Nov 2026", title: "Application Successfully Submitted", message: "Your application for Adventure Tour Operator has been received with Application ID SK-ATO-2026-0042.", type: "success", read: true }
      ]
    },

    // Scenario C: Citizen with Application Requiring Action (Returned for Remarks)
    scenarioC: {
      id: "scenarioC",
      name: "Scenario C: Action Required (Returned for Remarks)",
      badge: "Action Required",
      description: "Application returned by scrutiny officer requesting missing medical fitness or equipment certificates.",
      citizen: {
        fullName: "Karma Tshering Lepcha",
        citizenId: "CIT-SK-901103",
        mobile: "9832258741",
        email: "karma.tshering@example.in",
        district: "Namchi",
        address: "Upper Bazaar, Namchi – 737126"
      },
      stats: { total: 1, underProcess: 0, actionRequired: 1, approved: 0, rejected: 0 },
      actionRequired: {
        refNo: "ATO-2026-006",
        typeId: "adventure-tour-operator",
        typeName: "Adventure Tour Operator",
        badge: "Correction Required",
        currentStatus: "Returned for Remarks",
        remarks: "Annual equipment inspection log for mountaineering ropes and carabiners missing UIAA batch certification numbers. Please re-upload updated equipment register.",
        returnedBy: "Technical Assistant (TA HQ), Gangtok",
        returnDate: "11 Nov 2026",
        requiredAction: "Upload updated equipment log & re-submit.",
        actionUrl: "apply.html?ref=ATO-2026-006&type=adventure-tour-operator"
      },
      activeApplication: null,
      approvedApplication: null,
      applications: [
        {
          refNo: "ATO-2026-006",
          typeId: "adventure-tour-operator",
          typeName: "Adventure Tour Operator",
          categoryCode: "ATO",
          title: "Singalila Ridge Treks & Expeditions",
          submittedDate: "05 Nov 2026",
          status: "RETURNED",
          statusBadge: "bg-warning-subtle text-warning-emphasis border border-warning-subtle",
          statusLabel: "Correction Required",
          currentStage: "Returned to Applicant",
          district: "Namchi"
        }
      ],
      notifications: [
        { id: "notif-05", date: "11 Nov 2026", title: "Remarks Received on Application", message: "Action required on ATO-2026-006: Equipment log missing UIAA certification numbers.", type: "warning", read: false }
      ]
    },

    // Scenario F: Citizen with Fee Payment Due (₹1,500 Statutory Fee)
    scenarioPayment: {
      id: "scenarioPayment",
      name: "Scenario F: Statutory Fee Due (₹1,500)",
      badge: "Payment Activated",
      description: "DTO has verified and concurred the application; statutory registration fee of ₹1,500 is activated and awaiting payment.",
      citizen: {
        fullName: "Dawa Tshering Bhutia",
        citizenId: "CIT-SK-901108",
        mobile: "9832771234",
        email: "dawa.bhutia@himalayansummits.in",
        district: "Gangtok",
        address: "Deorali, Gangtok – 737102"
      },
      stats: { total: 1, underProcess: 0, actionRequired: 1, approved: 0, rejected: 0 },
      actionRequired: null,
      paymentRequired: {
        refNo: "ATO-2026-004",
        typeId: "adventure-tour-operator",
        typeName: "Adventure Tour Operator",
        enterpriseName: "Himalayan Summit Expeditions LLP",
        feeAmount: 1500,
        activatedBy: "District Tourism Officer (HQ), Gangtok",
        activatedDate: "13 Nov 2026",
        dueDate: "27 Nov 2026 (14 Days)",
        accountHead: "0070-02-105-01 (Tourism Reg. Fees)",
        remarks: "Inspection completed with satisfactory grade and Asst. Director concurrence received. Please deposit the statutory fee of ₹1,500 to proceed for final certificate sanction."
      },
      activeApplication: null,
      approvedApplication: null,
      applications: [
        {
          refNo: "ATO-2026-004",
          typeId: "adventure-tour-operator",
          typeName: "Adventure Tour Operator",
          categoryCode: "ATO",
          title: "Himalayan Summit Expeditions LLP",
          submittedDate: "03 Nov 2026",
          status: "PAYMENT_ACTIVATED",
          statusBadge: "bg-warning-subtle text-warning-emphasis border border-warning-subtle",
          statusLabel: "Fee Payment Due (₹1,500)",
          currentStage: "Payment Activated",
          district: "Gangtok"
        }
      ],
      notifications: [
        { id: "notif-08", date: "Today", title: "Statutory Fee Activated (₹1,500)", message: "DTO Gangtok has approved your inspection report and activated statutory fee payment for ATO-2026-004.", type: "warning", read: false }
      ]
    },

    // Scenario D: Citizen with Approved Application (Certificate Ready)
    scenarioD: {
      id: "scenarioD",
      name: "Scenario D: Approved Application (Certificate Ready)",
      badge: "Certificate Issued",
      description: "Applicant has an approved registration with a tamper-proof QR-verified certificate ready for preview.",
      citizen: {
        fullName: "Sonam Gyatso Sherpa",
        citizenId: "CIT-SK-901104",
        mobile: "9832369852",
        email: "sonam.sherpa@sikkimadventures.in",
        district: "Gangtok",
        address: "Tibet Road, Gangtok – 737101"
      },
      stats: { total: 1, underProcess: 0, actionRequired: 0, approved: 1, rejected: 0 },
      actionRequired: null,
      activeApplication: null,
      approvedApplication: {
        refNo: "ATO-2026-005",
        certificateNo: "RC-SK-ATO-2026-0005",
        typeId: "adventure-tour-operator",
        typeName: "Adventure Tour Operator",
        enterpriseName: "Teesta Rapid River Runners",
        approvedDate: "11 Nov 2026",
        validTill: "10 Nov 2028",
        approvingAuthority: "District Tourism Officer (HQ), Gangtok",
        status: "APPROVED",
        statusLabel: "Active & Certified",
        qrStatus: "Verified & Tamper-Proof"
      },
      applications: [
        {
          refNo: "ATO-2026-005",
          typeId: "adventure-tour-operator",
          typeName: "Adventure Tour Operator",
          categoryCode: "ATO",
          title: "Teesta Rapid River Runners",
          submittedDate: "20 Oct 2026",
          status: "APPROVED",
          statusBadge: "bg-success-subtle text-success border border-success-subtle",
          statusLabel: "Approved / Issued",
          currentStage: "Registration Issued",
          district: "Gangtok"
        }
      ],
      notifications: [
        { id: "notif-06", date: "11 Nov 2026", title: "Registration Approved & Certificate Issued", message: "Congratulations! Your Adventure Tour Operator Registration Certificate (RC-SK-ATO-2026-0005) is now available.", type: "success", read: false }
      ]
    },

    // Scenario G: Guide Registration - Other District (Digital ID & Logbook Issued)
    scenarioGuideDistrict: {
      id: "scenarioGuideDistrict",
      name: "Scenario G: Other-District Guide (Digital ID & Logbook)",
      badge: "Digital ID & Logbook",
      description: "District Guide (Mangan) approved at HQ DTO desk; Digital ID card issued and manual logbook issuance officially recorded.",
      citizen: {
        fullName: "Wangchuk Lepcha",
        citizenId: "CIT-SK-901116",
        mobile: "9832881234",
        email: "wangchuk.lepcha@mangan.in",
        district: "Mangan",
        address: "Lachung Road, Mangan – 737116"
      },
      stats: { total: 1, underProcess: 0, actionRequired: 0, approved: 1, rejected: 0 },
      actionRequired: null,
      activeApplication: null,
      approvedApplication: {
        refNo: "GR-2026-016",
        certificateNo: "DIG-GR-2026-0016",
        logbookSerial: "LB-2026-0082",
        typeId: "guide-registration",
        typeName: "Guide Registration (Other District)",
        enterpriseName: "Wangchuk Lepcha (High Altitude Guide)",
        approvedDate: "12 Nov 2026",
        validTill: "11 Nov 2029",
        approvingAuthority: "District Tourism Officer (Headquarters), Gangtok",
        status: "APPROVED",
        statusLabel: "Digital ID & Logbook Issued",
        qrStatus: "HQ Digital ID Verified",
        isOtherDistrictGuide: true
      },
      applications: [
        {
          refNo: "GR-2026-016",
          typeId: "guide-registration",
          typeName: "Guide Registration",
          categoryCode: "GR",
          title: "Wangchuk Lepcha (High Altitude Trekking Guide)",
          submittedDate: "28 Oct 2026",
          status: "APPROVED",
          statusBadge: "bg-success-subtle text-success border border-success-subtle",
          statusLabel: "Approved / ID & Logbook Issued",
          currentStage: "Digital ID & Logbook Recorded",
          district: "Mangan"
        }
      ],
      notifications: [
        { id: "notif-09", date: "12 Nov 2026", title: "Digital ID & Manual Logbook Issued", message: "HQ DTO has issued Digital ID DIG-GR-2026-0016 and logged Manual Physical Logbook LB-2026-0082.", type: "success", read: false }
      ]
    },

    // Scenario E: Citizen with Rejected Application
    scenarioE: {
      id: "scenarioE",
      name: "Scenario E: Rejected Application",
      badge: "Application Ineligible",
      description: "Applicant whose registration was rejected due to inadequate adventure safety gear or ineligible training credentials.",
      citizen: {
        fullName: "Rahul Sharma",
        citizenId: "CIT-SK-901105",
        mobile: "9832987654",
        email: "rahul.sharma@example.in",
        district: "Mangan",
        address: "Singhik, Mangan – 737116"
      },
      stats: { total: 1, underProcess: 0, actionRequired: 0, approved: 0, rejected: 1 },
      actionRequired: null,
      activeApplication: null,
      approvedApplication: null,
      rejectedApplication: {
        refNo: "SK-ATO-2026-0031",
        typeId: "adventure-tour-operator",
        typeName: "Adventure Tour Operator",
        enterpriseName: "North Ridge Expedition Agency",
        rejectedDate: "29 Oct 2026",
        decisionBy: "District Tourism Officer, Mangan",
        reasons: "During on-site IA safety inspection, high-altitude mountaineering harnesses and ropes lacked UIAA/CE certifications. Minimum lead guide experience requirements not met."
      },
      applications: [
        {
          refNo: "SK-ATO-2026-0031",
          typeId: "adventure-tour-operator",
          typeName: "Adventure Tour Operator",
          categoryCode: "ATO",
          title: "North Ridge Expedition Agency",
          submittedDate: "15 Oct 2026",
          status: "REJECTED",
          statusBadge: "bg-danger-subtle text-danger border border-danger-subtle",
          statusLabel: "Application Ineligible",
          currentStage: "Closed (Rejected)",
          district: "Mangan"
        }
      ],
      notifications: [
        { id: "notif-07", date: "29 Oct 2026", title: "Registration Application Order Issued", message: "Application SK-ATO-2026-0031 was not approved. Review detailed inspection report remarks.", type: "danger", read: true }
      ]
    }
  },

  // District Scoped Applications for DTO Dashboard (All 6 Districts)
  districtApplications: {
    "Gangtok": [
      { id: "SK-ATO-2026-0042", applicant: "Tenzing Norbu Lepcha", type: "Adventure Tour Operator", categoryCode: "ATO", submittedDate: "08 Nov 2026", stage: "TA Scrutiny", status: "UNDER_REVIEW", statusLabel: "Under Scrutiny", badge: "bg-info-subtle text-info", actionText: "Review File" },
      { id: "SK-ATO-2026-0009", applicant: "Sonam Gyatso Sherpa", type: "Adventure Tour Operator", categoryCode: "ATO", submittedDate: "20 Oct 2026", stage: "Certificate Issued", status: "APPROVED", statusLabel: "Approved", badge: "bg-success-subtle text-success", actionText: "View Certificate" },
      { id: "SK-GR-2026-0033", applicant: "Phurba Dawa Bhutia", type: "Guide Registration", categoryCode: "GR", submittedDate: "09 Nov 2026", stage: "Ready for DTO Sanction", status: "PENDING_SANCTION", statusLabel: "Pending Sanction", badge: "bg-warning-subtle text-warning-emphasis", actionText: "Sanction Decision" }
    ],
    "Mangan": [
      { id: "SK-ATO-2026-0031", applicant: "Rahul Sharma", type: "Adventure Tour Operator", categoryCode: "ATO", submittedDate: "15 Oct 2026", stage: "Closed (Rejected)", status: "REJECTED", statusLabel: "Rejected", badge: "bg-danger-subtle text-danger", actionText: "View Order" },
      { id: "SK-GR-2026-0045", applicant: "Dorjee Tshering Lepcha", type: "Guide Registration", categoryCode: "GR", submittedDate: "07 Nov 2026", stage: "Ready for DTO Sanction", status: "PENDING_SANCTION", statusLabel: "Pending Sanction", badge: "bg-warning-subtle text-warning-emphasis", actionText: "Sanction Decision" }
    ],
    "Namchi": [
      { id: "SK-GR-2026-0018", applicant: "Karma Tshering Lepcha", type: "Guide Registration", categoryCode: "GR", submittedDate: "05 Nov 2026", stage: "Returned to Applicant", status: "RETURNED", statusLabel: "Returned", badge: "bg-warning-subtle text-warning-emphasis", actionText: "Inspect Query" },
      { id: "SK-ATO-2026-0051", applicant: "South Sikkim Paragliding Co.", type: "Adventure Tour Operator", categoryCode: "ATO", submittedDate: "04 Nov 2026", stage: "Ready for DTO Sanction", status: "PENDING_SANCTION", statusLabel: "Pending Sanction", badge: "bg-warning-subtle text-warning-emphasis", actionText: "Sanction Decision" }
    ],
    "Gyalshing": [
      { id: "SK-ATO-2026-0022", applicant: "Yuksam Treks & Expeditions", type: "Adventure Tour Operator", categoryCode: "ATO", submittedDate: "28 Oct 2026", stage: "Certificate Issued", status: "APPROVED", statusLabel: "Approved", badge: "bg-success-subtle text-success", actionText: "View Certificate" },
      { id: "SK-GR-2026-0039", applicant: "Lakpa Subba", type: "Guide Registration", categoryCode: "GR", submittedDate: "06 Nov 2026", stage: "IA Field Verification", status: "UNDER_REVIEW", statusLabel: "Under Review", badge: "bg-info-subtle text-info", actionText: "Review File" }
    ],
    "Pakyong": [
      { id: "SK-GR-2026-0056", applicant: "Chungda Bhutia", type: "Guide Registration", categoryCode: "GR", submittedDate: "10 Nov 2026", stage: "TA Scrutiny", status: "UNDER_REVIEW", statusLabel: "Under Scrutiny", badge: "bg-info-subtle text-info", actionText: "Review File" }
    ],
    "Soreng": [
      { id: "SK-ATO-2026-0063", applicant: "Barsey Rhododendron Trails", type: "Adventure Tour Operator", categoryCode: "ATO", submittedDate: "09 Nov 2026", stage: "Ready for DTO Sanction", status: "PENDING_SANCTION", statusLabel: "Pending Sanction", badge: "bg-warning-subtle text-warning-emphasis", actionText: "Sanction Decision" }
    ]
  },

  // Department Work Queues for TA, IA, Asst. Dir.
  departmentQueues: {
    ta: [
      { id: "SK-ATO-2026-0042", applicant: "Tenzing Norbu Lepcha", enterprise: "Khangchendzonga Adventure Trails LLP", type: "Adventure Tour Operator", district: "Gangtok", submitted: "08 Nov 2026", status: "Verification In Progress", action: "Verify Documents" },
      { id: "SK-GR-2026-0056", applicant: "Chungda Bhutia", enterprise: "Chungda Bhutia (Eco Guide)", type: "Guide Registration", district: "Pakyong", submitted: "10 Nov 2026", status: "Pending Intake Check", action: "Verify Documents" },
      { id: "SK-GR-2026-0018", applicant: "Karma Tshering Lepcha", enterprise: "Karma Tshering (Mountain Guide)", type: "Guide Registration", district: "Namchi", submitted: "05 Nov 2026", status: "Query Dispatched", action: "View Remarks" }
    ],
    ia: [
      { id: "SK-ATO-2026-0042", applicant: "Tenzing Norbu Lepcha", enterprise: "Khangchendzonga Adventure Trails LLP", type: "Adventure Tour Operator", district: "Gangtok", scheduledDate: "16 Nov 2026", inspectionType: "Safety Gear & Ropes Check", status: "Inspection Scheduled", action: "Upload Report" },
      { id: "SK-GR-2026-0039", applicant: "Lakpa Subba", enterprise: "Lakpa Subba (Yuksam Escort)", type: "Guide Registration", district: "Gyalshing", scheduledDate: "14 Nov 2026", inspectionType: "Credential & First-Aid Check", status: "Inspection Scheduled", action: "Upload Report" },
      { id: "SK-ATO-2026-0051", applicant: "South Sikkim Paragliding Co.", enterprise: "South Sikkim Paragliding Co.", type: "Adventure Tour Operator", district: "Namchi", scheduledDate: "09 Nov 2026", inspectionType: "Glider Airworthiness Check", status: "Report Uploaded (Compliant)", action: "View Report" }
    ],
    asstDir: [
      { id: "SK-ATO-2026-0051", applicant: "South Sikkim Paragliding Co.", type: "Adventure Tour Operator", district: "Namchi", submitted: "04 Nov 2026", iaReport: "Compliant / Recommended", status: "Pending Concurrence", action: "Concur / Endorse" },
      { id: "SK-GR-2026-0033", applicant: "Phurba Dawa Bhutia", type: "Guide Registration", district: "Gangtok", submitted: "09 Nov 2026", iaReport: "HMI Certified / Verified", status: "Recommended for DTO Sanction", action: "View Concurrence" },
      { id: "SK-ATO-2026-0063", applicant: "Barsey Rhododendron Trails", type: "Adventure Tour Operator", district: "Soreng", submitted: "09 Nov 2026", iaReport: "Safety Harness Compliant", status: "Under Review", action: "Review File" }
    ]
  }
};

// Global Helper Functions for Scenarios and Districts
function getAdventureActiveDistrict() {
  return localStorage.getItem("adv_active_district") || "Gangtok";
}

function setAdventureActiveDistrict(dist) {
  localStorage.setItem("adv_active_district", dist);
}

function getAdventureCitizenScenario() {
  const urlParams = new URLSearchParams(window.location.search);
  const scenarioFromUrl = urlParams.get("scenario");
  if (scenarioFromUrl && AdventureServiceData.scenarios[scenarioFromUrl]) {
    localStorage.setItem("adv_citizen_scenario", scenarioFromUrl);
    return scenarioFromUrl;
  }
  return localStorage.getItem("adv_citizen_scenario") || "scenarioB";
}

function setAdventureCitizenScenario(scenKey) {
  localStorage.setItem("adv_citizen_scenario", scenKey);
}

