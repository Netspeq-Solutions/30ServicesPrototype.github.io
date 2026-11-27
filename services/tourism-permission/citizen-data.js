/**
 * UNIFIED DATA ADAPTER (SINGLE SOURCE OF TRUTH OVER WorkflowEngine)
 * Service: Tourism Permission
 * Department: Tourism & Civil Aviation Department, Government of Sikkim
 *
 * All citizen & departmental views read directly from persisted WorkflowEngine storage.
 * Zero hardcoded or fabricated application queues are maintained here.
 */

const TourismCitizenData = {
  serviceName: "Tourism Permission",
  departmentName: "Tourism & Civil Aviation Department",
  governmentName: "Government of Sikkim",
  officeAddress: "Paryatan Bhawan, Tadong, Gangtok – 737102",
  helpline: "03592-209090 / 1800-345-3256",
  email: "secy-tourism@sikkim.gov.in",

  // 6 Approved Permission Categories & Fee Rules
  categories: [
    { id: "drone", name: "Drone Permission", fee: "Free", feeAmount: 0, badge: "HQ Level", icon: "bi-camera-video", isPaid: false },
    { id: "expedition", name: "Expedition Permission", fee: "₹100 / person", feeAmount: 100, badge: "HQ Level", icon: "bi-snow", isPaid: true, requiresLO: true },
    { id: "trekking", name: "Trekking", fee: "₹100 / person", feeAmount: 100, badge: "DTO Level", icon: "bi-person-walking", isPaid: true, requiresLO: true },
    { id: "events-fairs", name: "Event / Mela / Fair / Rallies / Marathons", fee: "Free", feeAmount: 0, badge: "DTO Level", icon: "bi-calendar-event", isPaid: false },
    { id: "satellite-phone", name: "Satellite Phone Permission", fee: "Free", feeAmount: 0, badge: "DTO Level", icon: "bi-broadcast-pin", isPaid: false },
    { id: "other", name: "Other Permissions", fee: "Free", feeAmount: 0, badge: "DTO Level", icon: "bi-three-dots", isPaid: false }
  ],

  districtDtoMapping: {
    "Gangtok": { dtoOffice: "District Tourism Office, Gangtok Circle", officer: "DTO Gangtok", address: "M.G. Marg, Gangtok – 737101" },
    "Mangan": { dtoOffice: "District Tourism Office, Mangan Circle", officer: "DTO Mangan", address: "DAC Complex, Mangan – 737116" },
    "Namchi": { dtoOffice: "District Tourism Office, Namchi Circle", officer: "DTO Namchi", address: "DAC Complex, Namchi – 737126" },
    "Gyalshing": { dtoOffice: "District Tourism Office, Gyalshing Circle", officer: "DTO Gyalshing", address: "DAC Complex, Gyalshing – 737111" },
    "Pakyong": { dtoOffice: "District Tourism Office, Pakyong Circle", officer: "DTO Pakyong", address: "DAC Complex, Pakyong – 737106" },
    "Soreng": { dtoOffice: "District Tourism Office, Soreng Circle", officer: "DTO Soreng", address: "DAC Complex, Soreng – 737121" }
  },

  // Lightweight live workspace container (reads exclusively from WorkflowEngine)
  scenarios: {
    live: {
      id: "live",
      name: "Live Portal",
      badge: "Live Portal",
      description: "Submit Tourism Permission applications, respond to returns, complete payments, and download Approval Letters.",
      citizen: {
        fullName: "Registered Citizen",
        citizenId: "CIT-SK-2026-4412",
        mobile: "9832014589",
        email: "citizen.applicant@sikkim.in",
        district: "Gangtok",
        address: "Tadong, Gangtok – 737102"
      },
      stats: { total: 0, underProcess: 0, actionRequired: 0, approved: 0, rejected: 0 },
      actionRequired: null,
      activeApplication: null,
      approvedApplication: null,
      applications: [],
      notifications: []
    }
  },

  getAllApplications: function () {
    if (typeof window !== "undefined" && window.WorkflowEngine && typeof window.WorkflowEngine.getAllApplications === "function") {
      return window.WorkflowEngine.getAllApplications();
    }
    return [];
  },

  getApplication: function (refNo) {
    if (typeof window !== "undefined" && window.WorkflowEngine && typeof window.WorkflowEngine.getApplication === "function") {
      return window.WorkflowEngine.getApplication(refNo);
    }
    return null;
  }
};

TourismCitizenData.scenarios.scenarioA = TourismCitizenData.scenarios.live;

function getActiveCitizenScenario() {
  return "live";
}

function setActiveCitizenScenario() {
  // Single live source of truth
}

if (typeof window !== "undefined") {
  window.TourismCitizenData = TourismCitizenData;
}
