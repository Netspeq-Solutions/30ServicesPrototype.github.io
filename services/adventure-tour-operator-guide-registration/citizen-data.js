/**
 * UNIFIED DATA ADAPTER (SINGLE SOURCE OF TRUTH OVER AdventureWorkflowEngine)
 * Service: Adventure Tour Operator & Guide Registration
 * Department: Tourism & Civil Aviation Department, Government of Sikkim
 *
 * All citizen & departmental views read directly from persisted AdventureWorkflowEngine storage.
 * Zero hardcoded or fabricated application queues are maintained here.
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
  theme: "alpine-blue",

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

  // User Roles in Hierarchy
  userHierarchy: [
    { roleKey: "citizen", level: "Citizen", designation: "Citizen Applicant", abbreviation: "CITIZEN", desc: "Applies for Adventure Operator or Guide registration and tracks status", landingUrl: "dashboard.html" },
    { roleKey: "ta", level: "Department", designation: "Tourism Officer", abbreviation: "TO", desc: "Initial technical verification, equipment checklist review and scrutiny", landingUrl: "dashboard-ta.html" },
    { roleKey: "ia", level: "Department", designation: "Inspecting Authority", abbreviation: "IA", desc: "Field & equipment safety inspection, physical verification & report upload", landingUrl: "dashboard-io.html" },
    { roleKey: "dto", level: "Department", designation: "District Tourism Officer", abbreviation: "DTO", desc: "District-level administrative sanction, payment activation & certificate issuance", landingUrl: "dashboard-dto.html" }
  ],

  // 6 Sikkim Administrative Districts & DTO Officers
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

  // Lightweight live workspace container (reads exclusively from AdventureWorkflowEngine)
  scenarios: {
    live: {
      id: "live",
      name: "Live Portal",
      badge: "Live Portal",
      description: "Apply for Adventure Tour Operator or Guide registration, respond to returns, pay statutory fees, and download certificates.",
      citizen: {
        fullName: "Registered Citizen",
        citizenId: "CIT-SK-2026-4412",
        mobile: "9832011223",
        email: "citizen.applicant@sikkim.in",
        district: "Gangtok",
        address: "Development Area, Gangtok – 737101"
      },
      applications: [],
      notifications: []
    }
  },

  getAllApplications: function () {
    if (typeof window !== "undefined" && window.AdventureWorkflowEngine && typeof window.AdventureWorkflowEngine.getAllApplications === "function") {
      return window.AdventureWorkflowEngine.getAllApplications();
    }
    return [];
  },

  getApplicationsByRole: function (role, districtFilter) {
    const list = this.getAllApplications();
    return list.filter(app => {
      const roleMatch = (!role || role === "ALL" || (app.currentRole || "").toLowerCase() === role.toLowerCase());
      const distMatch = (!districtFilter || districtFilter.toUpperCase() === "ALL" || (app.district || "").toLowerCase() === districtFilter.toLowerCase());
      return roleMatch && distMatch;
    });
  },

  getApplication: function (arn) {
    if (typeof window !== "undefined" && window.AdventureWorkflowEngine && typeof window.AdventureWorkflowEngine.getApplicationByArn === "function") {
      return window.AdventureWorkflowEngine.getApplicationByArn(arn);
    }
    return null;
  }
};

// Backwards-compatibility alias
AdventureServiceData.scenarios.scenarioA = AdventureServiceData.scenarios.live;

function getAdventureActiveDistrict() {
  return localStorage.getItem("adv_active_district") || "Gangtok";
}

function setAdventureActiveDistrict(dist) {
  localStorage.setItem("adv_active_district", dist);
}

function getAdventureCitizenScenario() {
  return "live";
}

function setAdventureCitizenScenario() {
  // Single live source of truth; no fabricated scenario overrides
}

if (typeof window !== "undefined") {
  window.AdventureServiceData = AdventureServiceData;
}
