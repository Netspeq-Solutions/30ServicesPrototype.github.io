/**
 * WORKFLOW ENGINE & CENTRAL SINGLE SOURCE OF TRUTH
 * Service: Travel Agent / Tour Operator, Dealer, Outdoor Photographer Services
 * Department: Tourism & Civil Aviation Department, Government of Sikkim
 * Architecture: Single Persisted Store (localStorage) + Real-Time Cross-Tab Sync (BroadcastChannel + storage)
 *
 * Enforced Workflows:
 *   Workflow 1 (Inspection Required: Travel Agent / Tour Operator, Dealer):
 *     Step 1: Citizen Apply -> TO (Level 0: Pending TO Verification)
 *     Step 2: TO Initial Verification -> [Return to Applicant | Forward to IA]
 *     Step 3: IA Inspection -> [Return to TO | Forward to TO (with Report)] (also Schedule Inspection)
 *     Step 4: TO Post-Inspection Verification -> [Return to IA | Return to Applicant | Forward to DTO]
 *     Step 5: DTO Initial Verification -> [Reject | Approve for Payment]
 *     Step 6: Citizen Online Payment -> Auto-forward on success -> DTO Final Verification
 *     Step 7: DTO Final Verification -> [Return to Applicant | Reject | Approve & Issue Certificate]
 *     Step 8: Citizen Certificate Download & Completed
 *
 *   Workflow 2 (No Inspection: Outdoor Photographer):
 *     Step 1: Citizen Apply -> TO (Level 0: Pending TO Verification)
 *     Step 2: TO Verification -> [Return to Applicant | Forward to DTO]
 *     Step 3: DTO Initial Verification -> [Return to Applicant | Reject | Approve for Payment]
 *     Step 4: Citizen Online Payment -> Auto-forward on success -> DTO Final Verification
 *     Step 5: DTO Final Verification -> [Return to Applicant | Reject | Approve & Issue Certificate]
 *     Step 6: Citizen Certificate Download & Completed
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'tourism_business_department_applications';
  const STORAGE_VERSION_KEY = 'tourism_business_dept_apps_version';
  const CURRENT_SEED_VERSION = 'v16_clean_truth_2026';
  const SUBMITTED_STORAGE_KEY = 'tourism_business_submitted';
  const NOTIFICATIONS_KEY = 'tourism_business_notifications_v1';
  const SYNC_PULSE_KEY = 'tourism_business_sync_pulse_v1';
  const CHANNEL_NAME = 'sikkim_hospitality_workflow_v1';

  const SERVICE_NAME = 'Travel Agent / Tour Operator, Dealer, Outdoor Photographer Services';

  const STATUSES = {
    UNDER_REVIEW: 'Under Review',
    UNDER_VERIFICATION: 'Under Verification',
    RETURNED_BY_TO: 'Action Required – Returned by TO',
    RETURNED_BY_DTO: 'Action Required – Returned by DTO',
    PAYMENT_PENDING: 'Payment Pending',
    REJECTED: 'Rejected',
    COMPLETED: 'Completed'
  };

  const STAGES = {
    STAGE_TO_INITIAL: 'Level 0: Pending TO Verification',
    STAGE_IA_ASSIGNED: 'Level 1: Assigned to IA',
    STAGE_IA_SCHEDULED: 'Level 1: Inspection Scheduled',
    STAGE_IA_RETURNED: 'Level 1: Returned by TO to IA',
    STAGE_TO_POST_INSPECTION: 'Level 0: Post-Inspection Verification',
    STAGE_DTO_INITIAL: 'Level 2: DTO Initial Verification',
    STAGE_PAYMENT_PENDING: 'Payment Pending – Awaiting Citizen Payment',
    STAGE_DTO_FINAL: 'Level 2: DTO Final Verification',
    STAGE_RETURNED_CITIZEN: 'Returned to Applicant for Correction',
    STAGE_REJECTED: 'Rejected & Closed',
    STAGE_COMPLETED: 'Completed – Certificate Issued'
  };

  const DISTRICT_OFFICES = {
    'ALL': {
      district: 'All Circles',
      circleTitle: 'All 6 District Circles',
      office: 'Directorate of Tourism, Paryatan Bhawan, Tadong, Gangtok – 737102',
      phone: '03592-209090 / 1800-345-3256',
      email: 'secy-tourism@sikkim.gov.in',
      dtoName: 'District Tourism Officers Directorate',
      toName: 'Tourism Officers Directorate',
      iaName: 'Inspecting Authorities Directorate'
    },
    'Gangtok': {
      district: 'Gangtok',
      circleTitle: 'Gangtok District Circle',
      toName: 'Karma Lhendup Bhutia',
      toDesignation: 'Tourism Officer (TO)',
      iaName: 'Tashi Wangdi Lepcha',
      iaDesignation: 'Inspecting Authority (IA)',
      dtoName: 'Pema Dorjee Sherpa',
      dtoDesignation: 'District Tourism Officer (DTO)',
      office: 'District Tourism Office, Paryatan Bhawan, Tadong, Gangtok – 737102',
      phone: '03592-209091',
      email: 'dto.gangtok@sikkim.gov.in'
    },
    'Namchi': {
      district: 'Namchi',
      circleTitle: 'Namchi District Circle',
      toName: 'Tshering Norbu Rai',
      toDesignation: 'Tourism Officer (TO)',
      iaName: 'Phurba Tamang',
      iaDesignation: 'Inspecting Authority (IA)',
      dtoName: 'Pempa Tshering Bhutia',
      dtoDesignation: 'District Tourism Officer (DTO)',
      office: 'District Tourism Office, DAC Complex, Namchi – 737126',
      phone: '03595-263720',
      email: 'dto.namchi@sikkim.gov.in'
    },
    'Gyalshing': {
      district: 'Gyalshing',
      circleTitle: 'Gyalshing District Circle',
      toName: 'Lakpa Doma Subba',
      toDesignation: 'Tourism Officer (TO)',
      iaName: 'Sangay Chopel Bhutia',
      iaDesignation: 'Inspecting Authority (IA)',
      dtoName: 'Sonam Gyatso Lepcha',
      dtoDesignation: 'District Tourism Officer (DTO)',
      office: 'District Tourism Office, DAC Complex, Gyalshing – 737111',
      phone: '03595-250810',
      email: 'dto.gyalshing@sikkim.gov.in'
    },
    'Mangan': {
      district: 'Mangan',
      circleTitle: 'Mangan District Circle',
      toName: 'Chewang Norbu Bhutia',
      toDesignation: 'Tourism Officer (TO)',
      iaName: 'Dawa Tshering Lepcha',
      iaDesignation: 'Inspecting Authority (IA)',
      dtoName: 'Rinzing Ongmu Bhutia',
      dtoDesignation: 'District Tourism Officer (DTO)',
      office: 'District Tourism Office, DAC Complex, Mangan – 737116',
      phone: '03592-234205',
      email: 'dto.mangan@sikkim.gov.in'
    },
    'Pakyong': {
      district: 'Pakyong',
      circleTitle: 'Pakyong District Circle',
      toName: 'Prashant Chettri',
      toDesignation: 'Tourism Officer (TO)',
      iaName: 'Bikash Sharma',
      iaDesignation: 'Inspecting Authority (IA)',
      dtoName: 'Nim Lhamu Lepcha',
      dtoDesignation: 'District Tourism Officer (DTO)',
      office: 'District Tourism Office, DAC Complex, Pakyong – 737106',
      phone: '03592-258014',
      email: 'dto.pakyong@sikkim.gov.in'
    },
    'Soreng': {
      district: 'Soreng',
      circleTitle: 'Soreng District Circle',
      toName: 'Youraj Rai',
      toDesignation: 'Tourism Officer (TO)',
      iaName: 'Biren Gurung',
      iaDesignation: 'Inspecting Authority (IA)',
      dtoName: 'Norden Bhutia',
      dtoDesignation: 'District Tourism Officer (DTO)',
      office: 'District Tourism Office, DAC Complex, Soreng – 737121',
      phone: '03595-257002',
      email: 'dto.soreng@sikkim.gov.in'
    }
  };

  const IA_OFFICERS_BY_DISTRICT = {
    'ALL': [
      { name: 'Tashi Wangdi Lepcha', designation: 'Senior Inspecting Authority', circle: 'Gangtok Circle' },
      { name: 'Pema Tshering Bhutia', designation: 'Field Inspecting Officer', circle: 'Gangtok Circle' },
      { name: 'Phurba Tamang', designation: 'Lead Inspecting Authority', circle: 'Namchi Circle' },
      { name: 'Sangay Chopel Bhutia', designation: 'Lead Inspecting Authority', circle: 'Gyalshing Circle' },
      { name: 'Dawa Tshering Lepcha', designation: 'Lead Inspecting Authority', circle: 'Mangan Circle' },
      { name: 'Bikash Sharma', designation: 'Lead Inspecting Authority', circle: 'Pakyong Circle' },
      { name: 'Biren Gurung', designation: 'Lead Inspecting Authority', circle: 'Soreng Circle' }
    ],
    'Gangtok': [
      { name: 'Tashi Wangdi Lepcha', designation: 'Senior Inspecting Authority', circle: 'Gangtok Circle' },
      { name: 'Pema Tshering Bhutia', designation: 'Field Inspecting Officer', circle: 'Gangtok Circle' }
    ],
    'Namchi': [{ name: 'Phurba Tamang', designation: 'Lead Inspecting Authority', circle: 'Namchi Circle' }],
    'Gyalshing': [{ name: 'Sangay Chopel Bhutia', designation: 'Lead Inspecting Authority', circle: 'Gyalshing Circle' }],
    'Mangan': [{ name: 'Dawa Tshering Lepcha', designation: 'Lead Inspecting Authority', circle: 'Mangan Circle' }],
    'Pakyong': [{ name: 'Bikash Sharma', designation: 'Lead Inspecting Authority', circle: 'Pakyong Circle' }],
    'Soreng': [{ name: 'Biren Gurung', designation: 'Lead Inspecting Authority', circle: 'Soreng Circle' }]
  };

  const REGISTRATION_FEES = {
    'ta-to': {
      'Grade A': 20000,
      'Grade B': 7000,
      'Grade C': 5000,
      'Grade D': 1500,
      defaultGrade: 'Grade B',
      defaultFee: 7000,
      hasGrades: true
    },
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

  // Document Manifests updated per Section G approved modifications
  const DOC_MANIFESTS = {
    'A': [
      { name: 'Residential Proof: Domicile / COI / RC', code: 'RES_PROOF', file: 'coi_residential_proof.pdf', size: '1.2 MB', mandatory: true },
      { name: 'Passport Format Photograph', code: 'PHOTO', file: 'applicant_passport_photo.jpg', size: '420 KB', mandatory: true },
      { name: 'Supporting Qualification / Training Certificate (Applicant) (Optional)', code: 'QUAL_PROOF', file: 'training_qualification_cert.pdf', size: '1.8 MB', mandatory: false },
      { name: 'Supporting Qualification Document for Employees (Optional)', code: 'STAFF_QUAL', file: 'employee_qualification.pdf', size: '1.4 MB', mandatory: false },
      { name: 'Memorandum of Association / Society / Firm Deed (Optional)', code: 'DEED', file: 'moa_firm_deed.pdf', size: '2.4 MB', mandatory: false },
      { name: 'Affidavit from Oath Commissioner (Optional)', code: 'AFFIDAVIT', file: 'oath_affidavit.pdf', size: '890 KB', mandatory: false },
      { name: 'Other Supporting Documents (Optional)', code: 'OTHER', file: 'other_supporting_docs.pdf', size: '1.1 MB', mandatory: false }
    ],
    'B': [
      { name: 'Certificate of Identification (COI)', code: 'COI', file: 'applicant_coi_certificate.pdf', size: '1.1 MB', mandatory: true },
      { name: 'Occupancy Certificate / Parcha / Lease Deed (Optional)', code: 'OCCUPANCY', file: 'premises_occupancy_record.pdf', size: '1.8 MB', mandatory: false },
      { name: 'NOC from Fire / Health / Municipal Authorities (Optional)', code: 'NOC', file: 'statutory_clearance_noc.pdf', size: '950 KB', mandatory: false },
      { name: 'PAN Card / GST Certificate (Optional)', code: 'PAN_GST', file: 'pan_gst_copy.pdf', size: '720 KB', mandatory: false },
      { name: 'List of Outdoor Equipment & Safety Gear Stock (Optional)', code: 'STOCK_INV', file: 'equipment_inventory_list.pdf', size: '1.5 MB', mandatory: false }
    ],
    'C': [
      { name: 'Sikkim Subject / Certificate of Identification (COI)', code: 'COI', file: 'photographer_coi_certified.pdf', size: '1.2 MB', mandatory: true },
      { name: 'Education Qualification Certificate (Min. Class X) (Optional)', code: 'EDU_X', file: 'class_10_board_marksheet.pdf', size: '1.5 MB', mandatory: false },
      { name: 'Panchayat / Councillor Recommendation (Optional)', code: 'RECOM_LETTER', file: 'panchayat_recommendation.pdf', size: '920 KB', mandatory: false },
      { name: 'Outdoor Photography Training Certificate (Optional)', code: 'PHOTO_COURSE', file: 'outdoor_photography_training.pdf', size: '1.8 MB', mandatory: false },
      { name: 'Photography Experience Certificate (Optional)', code: 'EXP_CERT', file: 'photography_experience_record.pdf', size: '1.1 MB', mandatory: false },
      { name: 'Paragliding / Adventure Activity Requirement Document (Optional)', code: 'PARAGLIDE_OPT', file: 'adventure_optional_credential.pdf', size: '980 KB', mandatory: false }
    ]
  };

  // Clean environment by default (Zero fabricated sample records)
  const SEED_APPLICATIONS = [];

  // BroadcastChannel for instant real-time cross-tab synchronization
  let bc = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel(CHANNEL_NAME);
    }
  } catch (e) {}

  function formatNow() {
    return new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  function formatIdDate(dateObj) {
    return (dateObj || new Date()).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  function isInspectionRequired(app) {
    if (!app) return true;
    return (app.category || '').toLowerCase() !== 'outdoor-photographer';
  }

  function getCategoryDisplayName(category) {
    const c = (category || '').toLowerCase();
    if (c === 'dealer') return 'Dealer';
    if (c === 'outdoor-photographer') return 'Outdoor Photographer';
    return 'Travel Agent / Tour Operator';
  }

  function getCategoryCode(category) {
    const c = (category || '').toLowerCase();
    if (c === 'dealer') return 'DLR';
    if (c === 'outdoor-photographer') return 'PHO';
    return 'TATO';
  }

  function getResponsibleDepartmentLabel(role) {
    const r = (role || '').toUpperCase();
    if (r === 'TO') return 'Tourist Officer (TO)';
    if (r === 'IA') return 'Inspecting Authority (IA)';
    if (r === 'DTO') return 'District Tourism Officer (DTO)';
    if (r === 'CITIZEN') return 'Applicant / Citizen';
    return 'Closed / None';
  }

  const WorkflowEngine = {
    SERVICE_NAME: SERVICE_NAME,
    STATUSES: STATUSES,
    STAGES: STAGES,
    DISTRICT_OFFICES: DISTRICT_OFFICES,
    CHANNEL_NAME: CHANNEL_NAME,

    init: function () {
      try {
        if (typeof localStorage === 'undefined') return;
        const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
        const storedData = localStorage.getItem(STORAGE_KEY);
        let parsed = null;
        if (storedData) {
          try { parsed = JSON.parse(storedData); } catch (e) {}
        }

        if (!Array.isArray(parsed) || storedVersion !== CURRENT_SEED_VERSION) {
          // Clean slate initialization (retains valid submitted records if any from same session format, otherwise clean [])
          localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
          localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_SEED_VERSION);
          localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
          localStorage.removeItem(SUBMITTED_STORAGE_KEY);
        }
      } catch (e) {
        console.error('WorkflowEngine init error:', e);
      }

      this._syncLegacyGlobal();
    },

    _syncLegacyGlobal: function () {
      if (typeof window !== 'undefined' && window.TourismBusinessData) {
        window.TourismBusinessData.allApplications = this.getAllApplications();
      }
    },

    resetToCleanState: function () {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
          localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_SEED_VERSION);
          localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
          localStorage.removeItem(SUBMITTED_STORAGE_KEY);
        }
      } catch (e) {}
      this._syncLegacyGlobal();
      this._broadcastUpdate('SYSTEM_RESET', null, 'ALL');
      return [];
    },

    // Kept as safe alias for older reset buttons across UI -> resets cleanly to empty single source of truth
    resetToSeedData: function () {
      return this.resetToCleanState();
    },

    getFeeStructure: function (category) {
      return REGISTRATION_FEES[category] || REGISTRATION_FEES['ta-to'];
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
        if (typeof localStorage === 'undefined') return [];
        const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
        if (storedVersion !== CURRENT_SEED_VERSION) {
          this.init();
        }
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    },

    getApplication: function (refNo) {
      if (!refNo) return null;
      const clean = String(refNo).trim().toLowerCase();
      const all = this.getAllApplications();
      const result = all.find(a => a && a.refNo && a.refNo.toLowerCase() === clean) || null;
      if (result) {
        if (!Array.isArray(result.history)) result.history = [];
        if (!Array.isArray(result.auditHistory)) result.auditHistory = [];
        if (!Array.isArray(result.inspectionHistory)) result.inspectionHistory = [];
        if (!Array.isArray(result.paymentHistory)) result.paymentHistory = [];
      }
      return result;
    },

    saveApplication: function (app, eventMeta) {
      if (!app || !app.refNo) return null;
      if (!Array.isArray(app.history)) app.history = [];
      if (!Array.isArray(app.auditHistory)) app.auditHistory = [];
      if (!Array.isArray(app.inspectionHistory)) app.inspectionHistory = [];
      if (!Array.isArray(app.paymentHistory)) app.paymentHistory = [];

      app.updatedAtMs = Date.now();
      app.responsibleDepartment = getResponsibleDepartmentLabel(app.assignedRole);

      const all = this.getAllApplications();
      const idx = all.findIndex(a => a && a.refNo === app.refNo);
      if (idx >= 0) {
        all.splice(idx, 1);
      }
      // Put latest updated transaction at the top of queues
      all.unshift(app);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        localStorage.setItem(SUBMITTED_STORAGE_KEY, JSON.stringify(all));
      } catch (e) {}

      this._syncLegacyGlobal();

      if (eventMeta) {
        this._broadcastUpdate(eventMeta.action || 'WORKFLOW_UPDATE', app, eventMeta.destinationRole || app.assignedRole);
      }
      return app;
    },

    getDocumentsForApplication: function (app) {
      if (!app) return [];
      if (Array.isArray(app.uploadedDocuments) && app.uploadedDocuments.length > 0) {
        return app.uploadedDocuments;
      }
      const config = app.formConfig || (app.category === 'dealer' ? 'B' : (app.category === 'outdoor-photographer' ? 'C' : 'A'));
      return DOC_MANIFESTS[config] || DOC_MANIFESTS['A'];
    },

    // ------------------------------------------------------------------------
    // NOTIFICATION & REAL-TIME EVENT SYSTEM
    // ------------------------------------------------------------------------
    getNotifications: function (roleFilter, districtFilter) {
      try {
        const raw = localStorage.getItem(NOTIFICATIONS_KEY);
        let list = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(list)) list = [];

        if (roleFilter) {
          const rf = String(roleFilter).toUpperCase();
          list = list.filter(n => (n.targetRole || '').toUpperCase() === rf);
        }
        if (districtFilter && String(districtFilter).toUpperCase() !== 'ALL') {
          const df = String(districtFilter).toLowerCase();
          list = list.filter(n => !n.district || n.district.toLowerCase() === df);
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
        this._broadcastUpdate('NOTIFICATION_READ', null, null);
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
          const distOk = !df || !n.district || n.district.toLowerCase() === df;
          return (roleOk && distOk) ? Object.assign({}, n, { read: true }) : n;
        });
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
        this._broadcastUpdate('NOTIFICATION_READ', null, null);
      } catch (e) {}
    },

    _pushNotification: function (notif) {
      try {
        const raw = localStorage.getItem(NOTIFICATIONS_KEY);
        let list = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(list)) list = [];

        // Prevent duplicate active unread notification for exact same event/ref/role
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
          actionLabel: notif.actionLabel || 'View Application',
          targetUrl: notif.targetUrl || '',
          timestamp: formatNow(),
          read: false
        });

        // Keep notification store bounded cleanly
        if (list.length > 80) list = list.slice(0, 80);
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
      } catch (e) {}
    },

    _broadcastUpdate: function (action, app, destinationRole) {
      const payload = {
        action: action,
        refNo: app ? app.refNo : null,
        stage: app ? app.currentStage : null,
        status: app ? app.status : null,
        destinationRole: destinationRole || (app ? app.assignedRole : null),
        district: app ? app.district : null,
        ts: Date.now()
      };
      try {
        if (bc) bc.postMessage(payload);
      } catch (e) {}
      try {
        localStorage.setItem(SYNC_PULSE_KEY, JSON.stringify(payload));
      } catch (e) {}
      try {
        if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') {
          window.dispatchEvent(new CustomEvent('workflowStateChanged', { detail: payload }));
        }
      } catch (e) {}
    },

    subscribeRealtime: function (onUpdate) {
      if (typeof onUpdate !== 'function') return function () {};
      let lastTs = 0;
      const invokeSafe = (detail) => {
        const ts = (detail && detail.ts) ? detail.ts : Date.now();
        if (ts && ts === lastTs) return;
        lastTs = ts;
        onUpdate(detail || {});
      };

      const handleStorage = (e) => {
        if (e.key === STORAGE_KEY || e.key === NOTIFICATIONS_KEY || e.key === SYNC_PULSE_KEY) {
          invokeSafe({ source: 'storage', ts: Date.now() });
        }
      };
      const handleBc = (e) => {
        invokeSafe(Object.assign({ source: 'broadcast' }, e.data || {}));
      };
      const handleCustom = (e) => {
        invokeSafe(Object.assign({ source: 'event' }, e.detail || {}));
      };
      const handleVisibility = () => {
        if (typeof document === 'undefined' || document.visibilityState === 'visible') {
          invokeSafe({ source: 'visibility', ts: Date.now() });
        }
      };
      const handleFocus = () => {
        invokeSafe({ source: 'focus', ts: Date.now() });
      };

      if (typeof window !== 'undefined') {
        window.addEventListener('storage', handleStorage);
        window.addEventListener('workflowStateChanged', handleCustom);
        window.addEventListener('focus', handleFocus);
      }
      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', handleVisibility);
      }
      if (bc) {
        bc.addEventListener('message', handleBc);
      }
      // Reliable fallback reconciliation timer (5s) in case BroadcastChannel/storage is throttled
      const timerId = (typeof setInterval !== 'undefined')
        ? setInterval(() => invokeSafe({ source: 'reconcile', ts: Date.now() }), 5000)
        : null;

      return function unsubscribe() {
        if (typeof window !== 'undefined') {
          window.removeEventListener('storage', handleStorage);
          window.removeEventListener('workflowStateChanged', handleCustom);
          window.removeEventListener('focus', handleFocus);
        }
        if (typeof document !== 'undefined') {
          document.removeEventListener('visibilitychange', handleVisibility);
        }
        if (bc) {
          bc.removeEventListener('message', handleBc);
        }
        if (timerId !== null && typeof clearInterval !== 'undefined') {
          clearInterval(timerId);
        }
      };
    },

    _appendEvent: function (app, actorRole, actorName, action, stage, destinationRole, remarks, outcome) {
      const now = formatNow();
      app.lastUpdated = now;
      if (!Array.isArray(app.history)) app.history = [];
      if (!Array.isArray(app.auditHistory)) app.auditHistory = [];

      const eventRecord = {
        timestamp: now,
        date: now,
        actorRole: actorRole,
        actor: `${actorName} (${actorRole})`,
        actorName: actorName,
        step: action,
        action: action,
        stage: stage,
        destinationRole: destinationRole,
        outcome: outcome || stage,
        remarks: remarks || ''
      };

      app.history.push(eventRecord);
      app.auditHistory.push(eventRecord);
    },

    // ------------------------------------------------------------------------
    // PHASE 1: CITIZEN SUBMISSION (STEP 1)
    // ------------------------------------------------------------------------
    generateRefNo: function (category) {
      const code = getCategoryCode(category);
      const existing = this.getAllApplications();
      const seq = String(existing.length + 1).padStart(4, '0');
      const rand = Math.floor(10 + Math.random() * 90);
      return `SK-${code}-2026-${seq}${rand}`;
    },

    createApplication: function (appData) {
      if (!appData) return null;
      const category = (appData.category || 'ta-to').toLowerCase();
      const isPhotographer = (category === 'outdoor-photographer');
      const refNo = appData.refNo || this.generateRefNo(category);

      if (this.getApplication(refNo)) {
        return { success: false, message: `Application ${refNo} already exists.` };
      }

      const now = formatNow();
      const district = appData.district || 'Gangtok';
      const grade = (category === 'dealer' || isPhotographer) ? 'Not Applicable' : (appData.registrationGrade || 'Grade B');
      const fee = this.calculateFee(category, grade);

      const app = Object.assign({}, appData, {
        refNo: refNo,
        formConfig: category === 'dealer' ? 'B' : (isPhotographer ? 'C' : 'A'),
        category: category,
        categoryName: appData.categoryName || getCategoryDisplayName(category),
        categoryCode: getCategoryCode(category),
        applicantName: appData.applicantName || 'Citizen Applicant',
        businessName: appData.businessName || appData.applicantName || 'Hospitality Enterprise',
        district: district,
        phone: appData.phone || '',
        email: appData.email || '',
        registrationGrade: grade,
        registrationFee: fee,
        requiresInspection: !isPhotographer,
        assignedRole: 'TO',
        status: STATUSES.UNDER_REVIEW,
        currentStage: STAGES.STAGE_TO_INITIAL,
        pendingCitizenAction: null,
        latestRemarks: 'Application submitted online. Pending initial verification by Tourist Officer (TO).',
        paymentActivated: false,
        paymentStatus: 'Unpaid',
        paymentHistory: [],
        inspectionStatus: isPhotographer ? 'Exempt (No Inspection Required)' : 'Pending TO Initial Verification',
        inspectionHistory: [],
        certificateStatus: 'Not Issued',
        submittedDate: appData.submittedDate || now,
        lastUpdated: now,
        history: [],
        auditHistory: []
      });

      this._appendEvent(
        app,
        'Citizen Applicant',
        app.applicantName,
        'Application Submitted Online',
        STAGES.STAGE_TO_INITIAL,
        'Tourist Officer (TO)',
        'Application and supporting documents submitted online via Citizen Portal.',
        'Routed to TO Initial Verification'
      );

      this.saveApplication(app, { action: 'APPLICATION_SUBMITTED', destinationRole: 'TO' });

      this._pushNotification({
        refNo: app.refNo,
        targetRole: 'TO',
        district: app.district,
        eventKey: 'TO_NEW_' + app.history.length,
        title: `New Application Submitted: ${app.refNo}`,
        message: `${app.businessName} (${app.categoryName} • ${app.district}) requires TO initial verification.`,
        type: 'primary',
        actionLabel: 'Verify Application',
        targetUrl: `review.html?arn=${encodeURIComponent(app.refNo)}&role=to&district=${encodeURIComponent(app.district)}`
      });

      return app;
    },

    // ------------------------------------------------------------------------
    // PHASE 2 (STEP 2 / STEP 4): TOURIST OFFICER (TO) ACTIONS
    // ------------------------------------------------------------------------

    /**
     * Explicit TO action: Return to Applicant (Citizen)
     * Permitted ONLY at: TO Initial Verification OR TO Post-Inspection Verification
     */
    toReturnToApplicant: function (refNo, remarks, customOfficerName) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      if (app.assignedRole !== 'TO' || (app.currentStage !== STAGES.STAGE_TO_INITIAL && app.currentStage !== STAGES.STAGE_TO_POST_INSPECTION)) {
        return { success: false, message: 'Action not permitted: Application is not pending TO verification.' };
      }
      if (!remarks || !remarks.trim()) {
        return { success: false, message: 'Mandatory return remarks are required.' };
      }

      const cleanRemarks = remarks.trim();
      const distOffice = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const actorName = customOfficerName || distOffice.toName || 'Tourist Officer';
      const returnSourceStage = app.currentStage;

      app.status = STATUSES.RETURNED_BY_TO;
      app.currentStage = STAGES.STAGE_RETURNED_CITIZEN;
      app.assignedRole = 'Citizen';
      app.pendingCitizenAction = 'EDIT_AND_RESUBMIT';
      app.returnRemarks = cleanRemarks;
      app.returnedBy = `TO (${actorName})`;
      app.returnedByRole = 'TO';
      app.returnedFromStage = returnSourceStage;
      app.returnedDate = formatNow();
      app.latestRemarks = cleanRemarks;

      this._appendEvent(
        app,
        'Tourist Officer (TO)',
        actorName,
        'Return to Applicant',
        STAGES.STAGE_RETURNED_CITIZEN,
        'Applicant / Citizen',
        cleanRemarks,
        `Returned from ${returnSourceStage} to Citizen`
      );

      this.saveApplication(app, { action: 'TO_RETURN_APPLICANT', destinationRole: 'Citizen' });

      this._pushNotification({
        refNo: app.refNo,
        targetRole: 'Citizen',
        district: app.district,
        eventKey: 'CIT_RET_' + app.history.length,
        title: `Action Required – Returned by TO: ${app.refNo}`,
        message: `Remarks: "${cleanRemarks}". Please update and resubmit using the same Reference Number.`,
        type: 'warning',
        actionLabel: 'Fix & Resubmit',
        targetUrl: `apply.html?ref=${encodeURIComponent(app.refNo)}`
      });

      return {
        success: true,
        refNo: app.refNo,
        newStage: app.currentStage,
        destinationRole: 'Applicant / Citizen',
        message: `Application ${app.refNo} returned to Applicant for correction.`
      };
    },

    /**
     * Explicit TO action: Forward to IA (Initial Verification -> Inspection)
     * Permitted ONLY for Travel Agent / Tour Operator & Dealer at Level 0: Pending TO Verification
     */
    toForwardToIA: function (refNo, assignedIaOfficer, remarks, customOfficerName) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      if (!isInspectionRequired(app)) {
        return { success: false, message: 'Action not permitted: Outdoor Photographer is exempt from IA inspection.' };
      }
      if (app.assignedRole !== 'TO' || app.currentStage !== STAGES.STAGE_TO_INITIAL) {
        return { success: false, message: 'Action not permitted: Application is not in TO Initial Verification stage.' };
      }

      const distOffice = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const actorName = customOfficerName || distOffice.toName || 'Tourist Officer';
      const targetIa = assignedIaOfficer || app.assignedIaOfficer || distOffice.iaName || 'Inspecting Authority';
      const cleanRemarks = (remarks && remarks.trim()) ? remarks.trim() : `Initial documents verified. Forwarded to IA (${targetIa}) for on-site inspection.`;

      app.status = STATUSES.UNDER_VERIFICATION;
      app.currentStage = STAGES.STAGE_IA_ASSIGNED;
      app.assignedRole = 'IA';
      app.assignedIaOfficer = targetIa;
      app.inspectionStatus = 'Pending IA Inspection';
      app.toRemarks = cleanRemarks;
      app.latestRemarks = cleanRemarks;

      this._appendEvent(
        app,
        'Tourist Officer (TO)',
        actorName,
        'Forward to IA',
        STAGES.STAGE_IA_ASSIGNED,
        `Inspecting Authority (${targetIa})`,
        cleanRemarks,
        'Forwarded for On-Site Inspection'
      );

      this.saveApplication(app, { action: 'TO_FORWARD_IA', destinationRole: 'IA' });

      this._pushNotification({
        refNo: app.refNo,
        targetRole: 'IA',
        district: app.district,
        eventKey: 'IA_ASSIGN_' + app.history.length,
        title: `New Inspection Assigned: ${app.refNo}`,
        message: `${app.businessName} (${app.categoryName} • ${app.district}) forwarded by TO for physical inspection.`,
        type: 'warning',
        actionLabel: 'Inspect & Upload Report',
        targetUrl: `review.html?arn=${encodeURIComponent(app.refNo)}&role=ia&district=${encodeURIComponent(app.district)}`
      });

      return {
        success: true,
        refNo: app.refNo,
        newStage: app.currentStage,
        destinationRole: `Inspecting Authority (${targetIa})`,
        message: `Application ${app.refNo} forwarded to IA (${targetIa}) for inspection.`
      };
    },

    /**
     * Explicit TO action: Return to IA (Post-Inspection Verification -> IA Correction / Re-inspection)
     * Permitted ONLY at Level 0: Post-Inspection Verification
     */
    toReturnToIA: function (refNo, remarks, assignedIaOfficer, customOfficerName) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      if (!isInspectionRequired(app)) {
        return { success: false, message: 'Action not permitted for Outdoor Photographer.' };
      }
      if (app.assignedRole !== 'TO' || app.currentStage !== STAGES.STAGE_TO_POST_INSPECTION) {
        return { success: false, message: 'Action not permitted: Return to IA is only allowed during TO Post-Inspection Verification.' };
      }
      if (!remarks || !remarks.trim()) {
        return { success: false, message: 'Mandatory remarks explaining required inspection corrections are required.' };
      }

      const cleanRemarks = remarks.trim();
      const distOffice = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const actorName = customOfficerName || distOffice.toName || 'Tourist Officer';
      const targetIa = assignedIaOfficer || app.assignedIaOfficer || distOffice.iaName || 'Inspecting Authority';

      // Archive previous inspection report cleanly before clearing active report fields
      if (app.inspectionDocName || app.inspectionFindings) {
        app.inspectionHistory.push({
          iteration: app.inspectionHistory.length + 1,
          docName: app.inspectionDocName || 'Inspection_Report.pdf',
          docSize: app.inspectionDocSize || '1.8 MB',
          findings: app.inspectionFindings || '',
          remarks: app.inspectionRemarks || '',
          inspectingOfficer: app.inspectingOfficer || targetIa,
          submissionDate: app.inspectionReportDate || formatNow(),
          returnedByToRemarks: cleanRemarks
        });
      }

      app.previousInspectionDocName = app.inspectionDocName;
      app.previousInspectionRemarks = app.inspectionRemarks;
      delete app.inspectionDocName;
      delete app.inspectionDocSize;
      delete app.inspectionFindings;
      delete app.inspectionRemarks;

      app.status = STATUSES.UNDER_VERIFICATION;
      app.currentStage = STAGES.STAGE_IA_RETURNED;
      app.assignedRole = 'IA';
      app.assignedIaOfficer = targetIa;
      app.inspectionStatus = 'Returned by TO for Further Inspection / Report Correction';
      app.reinspectionInstructions = cleanRemarks;
      app.latestRemarks = cleanRemarks;

      this._appendEvent(
        app,
        'Tourist Officer (TO)',
        actorName,
        'Return to IA',
        STAGES.STAGE_IA_RETURNED,
        `Inspecting Authority (${targetIa})`,
        cleanRemarks,
        'Returned to IA for Further Inspection'
      );

      this.saveApplication(app, { action: 'TO_RETURN_IA', destinationRole: 'IA' });

      this._pushNotification({
        refNo: app.refNo,
        targetRole: 'IA',
        district: app.district,
        eventKey: 'IA_RET_' + app.history.length,
        title: `Returned by TO for Inspection Correction: ${app.refNo}`,
        message: `TO Remarks: "${cleanRemarks}". Please re-inspect / submit updated report.`,
        type: 'warning',
        actionLabel: 'Review & Re-submit Report',
        targetUrl: `review.html?arn=${encodeURIComponent(app.refNo)}&role=ia&district=${encodeURIComponent(app.district)}`
      });

      return {
        success: true,
        refNo: app.refNo,
        newStage: app.currentStage,
        destinationRole: `Inspecting Authority (${targetIa})`,
        message: `Application ${app.refNo} returned to IA (${targetIa}) with mandatory remarks.`
      };
    },

    /**
     * Explicit TO action: Forward to DTO
     * Permitted at:
     *   - TO Initial Verification (ONLY Outdoor Photographer)
     *   - TO Post-Inspection Verification (TA/TO & Dealer with Inspection Report submitted)
     */
    toForwardToDTO: function (refNo, remarks, customOfficerName) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      if (app.assignedRole !== 'TO') {
        return { success: false, message: 'Action not permitted: Application is not in TO queue.' };
      }

      const inspReq = isInspectionRequired(app);
      if (inspReq) {
        if (app.currentStage !== STAGES.STAGE_TO_POST_INSPECTION && !app.inspectionDocName && !app.inspectionFindings) {
          return { success: false, message: 'Action not permitted: Physical inspection by IA must be completed before forwarding to DTO.' };
        }
      } else {
        if (app.currentStage !== STAGES.STAGE_TO_INITIAL) {
          return { success: false, message: 'Action not permitted at current stage.' };
        }
      }

      const distOffice = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const actorName = customOfficerName || distOffice.toName || 'Tourist Officer';
      const cleanRemarks = (remarks && remarks.trim())
        ? remarks.trim()
        : (inspReq
            ? 'Post-inspection verification completed and IA inspection report reviewed. Forwarded to DTO.'
            : 'TO verification completed (No-Inspection Category). Forwarded to DTO.');

      // Preserve Final Verification queue if payment was already completed prior to an earlier Citizen return
      const alreadyPaid = (app.paymentStatus === 'Paid');
      const nextStage = alreadyPaid ? STAGES.STAGE_DTO_FINAL : STAGES.STAGE_DTO_INITIAL;

      app.status = STATUSES.UNDER_VERIFICATION;
      app.currentStage = nextStage;
      app.assignedRole = 'DTO';
      app.toInspectionReviewRemarks = cleanRemarks;
      app.toRemarks = cleanRemarks;
      app.latestRemarks = cleanRemarks;

      this._appendEvent(
        app,
        'Tourist Officer (TO)',
        actorName,
        'Forward to DTO',
        nextStage,
        `District Tourism Officer (${app.district})`,
        cleanRemarks,
        alreadyPaid ? 'Forwarded to DTO Final Verification (Fee Already Paid)' : 'Forwarded to DTO Initial Verification'
      );

      this.saveApplication(app, { action: 'TO_FORWARD_DTO', destinationRole: 'DTO' });

      this._pushNotification({
        refNo: app.refNo,
        targetRole: 'DTO',
        district: app.district,
        eventKey: 'DTO_FWD_' + app.history.length,
        title: alreadyPaid ? `Ready for DTO Final Verification: ${app.refNo}` : `Forwarded to DTO Initial Verification: ${app.refNo}`,
        message: `${app.businessName} (${app.categoryName} • ${app.district}) forwarded by TO.`,
        type: 'primary',
        actionLabel: 'Verify Application',
        targetUrl: `review.html?arn=${encodeURIComponent(app.refNo)}&role=dto&district=${encodeURIComponent(app.district)}`
      });

      return {
        success: true,
        refNo: app.refNo,
        newStage: app.currentStage,
        destinationRole: `District Tourism Officer (${app.district})`,
        message: `Application ${app.refNo} forwarded to DTO (${app.district} Circle).`
      };
    },

    // Backward-compatible wrapper mapping cleanly to explicit TO methods
    toVerifyAndForward: function (refNo, checklist, remarks, targetRole, assignedIaOfficer) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      return isInspectionRequired(app)
        ? this.toForwardToIA(refNo, assignedIaOfficer, remarks)
        : this.toForwardToDTO(refNo, remarks);
    },
    toForwardIaReportToDto: function (refNo, remarks) {
      return this.toForwardToDTO(refNo, remarks);
    },
    toRequestReinspection: function (refNo, instructions, assignedIaOfficer) {
      return this.toReturnToIA(refNo, instructions, assignedIaOfficer);
    },

    // ------------------------------------------------------------------------
    // PHASE 2 (STEP 3): INSPECTING AUTHORITY (IA) ACTIONS
    // ------------------------------------------------------------------------

    /**
     * IA Action: Schedule Physical Inspection (Notifies Citizen with date & details per Section G)
     */
    iaScheduleInspection: function (refNo, inspectionDate, timeSlot, notes, iaOfficerName) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      if (!isInspectionRequired(app) || app.assignedRole !== 'IA') {
        return { success: false, message: 'Action not permitted: Only assigned inspection-category applications in IA queue can be scheduled.' };
      }
      if (!inspectionDate) {
        return { success: false, message: 'Inspection date is required.' };
      }

      const distOffice = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const effectiveIa = iaOfficerName || app.assignedIaOfficer || distOffice.iaName || 'Inspecting Authority';
      const cleanNotes = (notes && notes.trim()) ? notes.trim() : 'Applicant must keep original documents and premises ready for inspection.';

      app.status = STATUSES.UNDER_VERIFICATION;
      app.currentStage = STAGES.STAGE_IA_SCHEDULED;
      app.assignedRole = 'IA';
      app.assignedIaOfficer = effectiveIa;
      app.inspectionDate = inspectionDate;
      app.inspectionTimeSlot = timeSlot || '11:00 AM – 01:00 PM';
      app.inspectionScheduleNotes = cleanNotes;
      app.inspectionStatus = `Inspection Scheduled for ${inspectionDate} (${app.inspectionTimeSlot})`;
      app.latestRemarks = `Inspection scheduled on ${inspectionDate} (${app.inspectionTimeSlot}). ${cleanNotes}`;

      this._appendEvent(
        app,
        'Inspecting Authority (IA)',
        effectiveIa,
        'Inspection Scheduled',
        STAGES.STAGE_IA_SCHEDULED,
        'Inspecting Authority (IA) & Applicant Notified',
        app.latestRemarks,
        `Inspection scheduled on ${inspectionDate}`
      );

      this.saveApplication(app, { action: 'IA_SCHEDULED', destinationRole: 'IA' });

      // Section G mandatory rule: Notify citizen when inspection is scheduled
      this._pushNotification({
        refNo: app.refNo,
        targetRole: 'Citizen',
        district: app.district,
        eventKey: 'CIT_INSP_SCHED_' + app.history.length,
        title: `Physical Inspection Scheduled: ${app.refNo}`,
        message: `Inspecting Authority (${effectiveIa}) scheduled your inspection on ${inspectionDate} (${app.inspectionTimeSlot}). ${cleanNotes}`,
        type: 'info',
        actionLabel: 'Track Application',
        targetUrl: `dashboard.html?arn=${encodeURIComponent(app.refNo)}&view=tracking`
      });

      return {
        success: true,
        refNo: app.refNo,
        newStage: app.currentStage,
        destinationRole: 'Inspecting Authority (IA) / Applicant Notified',
        message: `Inspection scheduled for ${inspectionDate} (${app.inspectionTimeSlot}). Applicant has been notified.`
      };
    },

    /**
     * Explicit IA Action: Return to TO (with mandatory remarks)
     * Routes ONLY to Tourist Officer (TO)
     */
    iaReturnToTO: function (refNo, remarks, iaOfficerName) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      if (!isInspectionRequired(app) || app.assignedRole !== 'IA') {
        return { success: false, message: 'Action not permitted: Application is not currently in IA inspection queue.' };
      }
      if (!remarks || !remarks.trim()) {
        return { success: false, message: 'Mandatory return remarks are required when returning to TO.' };
      }

      const cleanRemarks = remarks.trim();
      const distOffice = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const effectiveIa = iaOfficerName || app.assignedIaOfficer || distOffice.iaName || 'Inspecting Authority';

      app.status = STATUSES.UNDER_VERIFICATION;
      app.currentStage = STAGES.STAGE_TO_INITIAL;
      app.assignedRole = 'TO';
      app.inspectionStatus = 'Returned by IA to TO';
      app.iaReturnRemarks = cleanRemarks;
      app.latestRemarks = cleanRemarks;

      this._appendEvent(
        app,
        'Inspecting Authority (IA)',
        effectiveIa,
        'Return to TO',
        STAGES.STAGE_TO_INITIAL,
        'Tourist Officer (TO)',
        cleanRemarks,
        'Returned to TO Initial Verification'
      );

      this.saveApplication(app, { action: 'IA_RETURN_TO', destinationRole: 'TO' });

      this._pushNotification({
        refNo: app.refNo,
        targetRole: 'TO',
        district: app.district,
        eventKey: 'TO_RET_IA_' + app.history.length,
        title: `Returned by IA to TO: ${app.refNo}`,
        message: `IA Remarks: "${cleanRemarks}". Application requires TO re-verification.`,
        type: 'warning',
        actionLabel: 'Verify Application',
        targetUrl: `review.html?arn=${encodeURIComponent(app.refNo)}&role=to&district=${encodeURIComponent(app.district)}`
      });

      return {
        success: true,
        refNo: app.refNo,
        newStage: app.currentStage,
        destinationRole: 'Tourist Officer (TO)',
        message: `Application ${app.refNo} returned to Tourist Officer (TO) with remarks.`
      };
    },

    /**
     * Explicit IA Action: Submit Inspection Report & Forward to TO (Post-Inspection Verification)
     */
    iaSubmitInspectionReport: function (refNo, inspectionData, iaOfficerName) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      if (!isInspectionRequired(app) || app.assignedRole !== 'IA') {
        return { success: false, message: 'Action not permitted: Application is not in IA inspection queue.' };
      }
      if (!inspectionData || !inspectionData.docName) {
        return { success: false, message: 'Uploading the signed Inspection Report document is mandatory.' };
      }

      const now = formatNow();
      const distOffice = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const effectiveIa = iaOfficerName || app.assignedIaOfficer || distOffice.iaName || 'Inspecting Authority';
      const findings = (inspectionData.findings || '').trim() || 'On-site premises and safety facilities inspected and documented.';
      const remarks = (inspectionData.remarks || '').trim();

      app.inspectionReportDate = now;
      app.assignedIaOfficer = effectiveIa;
      app.inspectingOfficer = `${effectiveIa} (IA)`;
      app.inspectionStatus = 'Inspection Report Submitted to TO';
      app.inspectionDocName = inspectionData.docName;
      app.inspectionDocSize = inspectionData.docSize || '1.8 MB';
      app.inspectionFindings = findings;
      app.inspectionRemarks = remarks || findings;
      app.inspectionRecommendation = inspectionData.recommendation || 'RECOMMENDED';
      app.reinspectionInstructions = null;

      app.status = STATUSES.UNDER_VERIFICATION;
      app.currentStage = STAGES.STAGE_TO_POST_INSPECTION;
      app.assignedRole = 'TO';
      app.latestRemarks = `Inspection report uploaded (${app.inspectionDocName}). Findings: ${findings}`;

      this._appendEvent(
        app,
        'Inspecting Authority (IA)',
        effectiveIa,
        'Forward to TO (Inspection Report Submitted)',
        STAGES.STAGE_TO_POST_INSPECTION,
        'Tourist Officer (TO)',
        app.latestRemarks,
        'Submitted to TO Post-Inspection Verification'
      );

      this.saveApplication(app, { action: 'IA_SUBMIT_REPORT', destinationRole: 'TO' });

      this._pushNotification({
        refNo: app.refNo,
        targetRole: 'TO',
        district: app.district,
        eventKey: 'TO_INSP_REP_' + app.history.length,
        title: `Inspection Report Submitted: ${app.refNo}`,
        message: `IA (${effectiveIa}) submitted Inspection Report (${app.inspectionDocName}). Ready for Post-Inspection Verification.`,
        type: 'success',
        actionLabel: 'View Inspection Report',
        targetUrl: `review.html?arn=${encodeURIComponent(app.refNo)}&role=to&district=${encodeURIComponent(app.district)}`
      });

      return {
        success: true,
        refNo: app.refNo,
        newStage: app.currentStage,
        destinationRole: 'Tourist Officer (TO) – Post-Inspection Verification',
        message: `Inspection report for ${app.refNo} submitted to TO for post-inspection verification.`
      };
    },

    // ------------------------------------------------------------------------
    // PHASE 3 & PHASE 5: DISTRICT TOURISM OFFICER (DTO) ACTIONS
    // ------------------------------------------------------------------------

    /**
     * Explicit DTO Action (Initial Verification): Approve for Payment
     * Blocked before DTO Initial Verification or if already activated/paid.
     */
    dtoApproveForPayment: function (refNo, grade, remarks, dtoOfficerNameOverride) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      if (app.assignedRole !== 'DTO' || app.currentStage !== STAGES.STAGE_DTO_INITIAL) {
        return { success: false, message: 'Action not permitted: Payment can only be activated during DTO Initial Verification.' };
      }
      if (app.paymentActivated && app.paymentStatus !== 'Payment Failed') {
        return { success: false, message: 'Statutory payment is already activated for this application.' };
      }

      const now = formatNow();
      const distOffice = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const dtoName = dtoOfficerNameOverride || distOffice.dtoName || 'District Tourism Officer';
      const feeStruct = REGISTRATION_FEES[app.category] || REGISTRATION_FEES['ta-to'];

      let selectedGrade = 'Not Applicable';
      let calculatedFee = feeStruct.defaultFee || 2000;
      if (feeStruct.hasGrades) {
        selectedGrade = grade || app.registrationGrade || feeStruct.defaultGrade;
        calculatedFee = feeStruct[selectedGrade] || feeStruct.defaultFee;
      } else {
        calculatedFee = feeStruct.fixedFee;
      }

      app.registrationGrade = selectedGrade;
      app.registrationFee = calculatedFee;
      app.paymentRequestId = 'PRQ-' + app.refNo + '-' + Math.floor(100 + Math.random() * 900);
      app.paymentActivated = true;
      app.paymentStatus = 'Payment Pending';
      app.paymentActivatedDate = now;
      app.paymentActivatedBy = `${dtoName} (DTO)`;

      app.status = STATUSES.PAYMENT_PENDING;
      app.currentStage = STAGES.STAGE_PAYMENT_PENDING;
      app.assignedRole = 'Citizen';
      app.pendingCitizenAction = 'PAY_ONLINE';

      const gradeInfo = (selectedGrade !== 'Not Applicable') ? ` (${selectedGrade})` : '';
      const cleanRemarks = (remarks && remarks.trim())
        ? remarks.trim()
        : `Approved for payment. Applicable statutory fee: ₹${calculatedFee.toLocaleString('en-IN')}${gradeInfo}.`;
      app.dtoRemarks = cleanRemarks;
      app.latestRemarks = cleanRemarks;

      this._appendEvent(
        app,
        'District Tourism Officer (DTO)',
        dtoName,
        'Approve for Payment',
        STAGES.STAGE_PAYMENT_PENDING,
        'Applicant / Citizen',
        cleanRemarks,
        `Payment Activated (₹${calculatedFee.toLocaleString('en-IN')}${gradeInfo})`
      );

      this.saveApplication(app, { action: 'DTO_APPROVE_PAYMENT', destinationRole: 'Citizen' });

      this._pushNotification({
        refNo: app.refNo,
        targetRole: 'Citizen',
        district: app.district,
        eventKey: 'CIT_PAY_DUE_' + app.history.length,
        title: `Payment Pending – Pay Now: ${app.refNo}`,
        message: `Your application is approved for payment. Applicable fee: ₹${calculatedFee.toLocaleString('en-IN')}${gradeInfo}.`,
        type: 'warning',
        actionLabel: 'Pay Now',
        targetUrl: `dashboard.html?arn=${encodeURIComponent(app.refNo)}&pay=1`
      });

      return {
        success: true,
        refNo: app.refNo,
        fee: calculatedFee,
        grade: selectedGrade,
        newStage: app.currentStage,
        destinationRole: 'Applicant / Citizen (Payment Pending)',
        message: `Statutory fee of ₹${calculatedFee.toLocaleString('en-IN')}${gradeInfo} activated. Applicant notified.`
      };
    },

    dtoActivatePayment: function (refNo, grade, dtoOfficerNameOverride, remarks) {
      return this.dtoApproveForPayment(refNo, grade, remarks, dtoOfficerNameOverride);
    },

    /**
     * Explicit DTO Action: Return to Applicant
     * Rules:
     *   - At DTO Initial Verification: Permitted ONLY for Outdoor Photographer (NOT TA/TO or Dealer!)
     *   - At DTO Final Verification: Permitted for ALL categories
     */
    dtoReturnToApplicant: function (refNo, remarks, customOfficerName) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      if (app.assignedRole !== 'DTO') {
        return { success: false, message: 'Action not permitted: Application is not in DTO queue.' };
      }

      const isFinalStage = (app.currentStage === STAGES.STAGE_DTO_FINAL);
      const isInitialOp = (app.currentStage === STAGES.STAGE_DTO_INITIAL && !isInspectionRequired(app));

      if (!isFinalStage && !isInitialOp) {
        return {
          success: false,
          message: 'Action not permitted: For inspection-based categories (TA/TO & Dealer), DTO Initial Verification only permits Reject or Approve for Payment.'
        };
      }
      if (!remarks || !remarks.trim()) {
        return { success: false, message: 'Mandatory return remarks are required.' };
      }

      const cleanRemarks = remarks.trim();
      const distOffice = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const dtoName = customOfficerName || distOffice.dtoName || 'District Tourism Officer';
      const returnSourceStage = app.currentStage;

      app.status = STATUSES.RETURNED_BY_DTO;
      app.currentStage = STAGES.STAGE_RETURNED_CITIZEN;
      app.assignedRole = 'Citizen';
      app.pendingCitizenAction = 'EDIT_AND_RESUBMIT';
      app.returnRemarks = cleanRemarks;
      app.returnedBy = `DTO (${dtoName})`;
      app.returnedByRole = 'DTO';
      app.returnedFromStage = returnSourceStage;
      app.returnedDate = formatNow();
      app.latestRemarks = cleanRemarks;

      this._appendEvent(
        app,
        'District Tourism Officer (DTO)',
        dtoName,
        'Return to Applicant',
        STAGES.STAGE_RETURNED_CITIZEN,
        'Applicant / Citizen',
        cleanRemarks,
        `Returned from ${returnSourceStage} to Citizen`
      );

      this.saveApplication(app, { action: 'DTO_RETURN_APPLICANT', destinationRole: 'Citizen' });

      this._pushNotification({
        refNo: app.refNo,
        targetRole: 'Citizen',
        district: app.district,
        eventKey: 'CIT_RET_DTO_' + app.history.length,
        title: `Action Required – Returned by DTO: ${app.refNo}`,
        message: `Remarks: "${cleanRemarks}". Please review and resubmit your application.`,
        type: 'warning',
        actionLabel: 'Fix & Resubmit',
        targetUrl: `apply.html?ref=${encodeURIComponent(app.refNo)}`
      });

      return {
        success: true,
        refNo: app.refNo,
        newStage: app.currentStage,
        destinationRole: 'Applicant / Citizen',
        message: `Application ${app.refNo} returned to Applicant with mandatory remarks.`
      };
    },

    /**
     * Explicit DTO Action: Reject & Close
     * Permitted ONLY at DTO Initial Verification OR DTO Final Verification
     */
    dtoReject: function (refNo, remarks, customOfficerName) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      if (app.assignedRole !== 'DTO' || (app.currentStage !== STAGES.STAGE_DTO_INITIAL && app.currentStage !== STAGES.STAGE_DTO_FINAL)) {
        return { success: false, message: 'Action not permitted: Rejection can only be performed by DTO during Initial or Final Verification.' };
      }
      if (!remarks || !remarks.trim()) {
        return { success: false, message: 'Mandatory remarks specifying grounds for rejection are required.' };
      }

      const cleanRemarks = remarks.trim();
      const now = formatNow();
      const distOffice = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const dtoName = customOfficerName || distOffice.dtoName || 'District Tourism Officer';
      const rejectedFromStage = app.currentStage;

      app.status = STATUSES.REJECTED;
      app.currentStage = STAGES.STAGE_REJECTED;
      app.assignedRole = 'None';
      app.pendingCitizenAction = null;
      app.rejectionGrounds = cleanRemarks;
      app.rejectedBy = `${dtoName} (DTO)`;
      app.rejectedDate = now;
      app.rejectedFromStage = rejectedFromStage;
      app.latestRemarks = cleanRemarks;

      this._appendEvent(
        app,
        'District Tourism Officer (DTO)',
        dtoName,
        'Reject',
        STAGES.STAGE_REJECTED,
        'Closed',
        cleanRemarks,
        `Rejected & Closed at ${rejectedFromStage}`
      );

      this.saveApplication(app, { action: 'DTO_REJECTED', destinationRole: 'Citizen' });

      this._pushNotification({
        refNo: app.refNo,
        targetRole: 'Citizen',
        district: app.district,
        eventKey: 'CIT_REJ_' + app.history.length,
        title: `Application Rejected: ${app.refNo}`,
        message: `Rejected by DTO at ${rejectedFromStage}. Remarks: "${cleanRemarks}".`,
        type: 'danger',
        actionLabel: 'View Remarks',
        targetUrl: `dashboard.html?arn=${encodeURIComponent(app.refNo)}&view=tracking`
      });

      return {
        success: true,
        refNo: app.refNo,
        newStage: app.currentStage,
        destinationRole: 'Closed',
        message: `Application ${app.refNo} has been rejected and closed with remarks.`
      };
    },

    /**
     * Explicit DTO Action (Final Verification): Approve & Issue Certificate
     * Requires paymentStatus === 'Paid' and stage === STAGE_DTO_FINAL
     */
    dtoApproveAndIssueCertificate: function (refNo, remarks, customOfficerName) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      if (app.assignedRole !== 'DTO' || app.currentStage !== STAGES.STAGE_DTO_FINAL) {
        return { success: false, message: 'Action not permitted: Final approval is only allowed in DTO Final Verification stage.' };
      }
      if (!app.paymentActivated || app.paymentStatus !== 'Paid') {
        return {
          success: false,
          message: `Cannot issue certificate before payment confirmation (Fee: ₹${(app.registrationFee || 0).toLocaleString('en-IN')}).`
        };
      }

      const now = formatNow();
      const datePart = now.split(',')[0];
      const certSuffix = app.refNo.replace(/[^A-Z0-9]/gi, '').slice(-8);
      const certNo = `SK-TCD-REG-2026-${certSuffix}`;
      const d = new Date();
      d.setFullYear(d.getFullYear() + 1);
      const validUntil = formatIdDate(d);

      const distOffice = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      const dtoOfficerName = customOfficerName || distOffice.dtoName || 'District Tourism Officer';
      const cleanRemarks = (remarks && remarks.trim())
        ? remarks.trim()
        : `Final approval granted. Registration Certificate #${certNo} generated with validity until ${validUntil}.`;

      app.status = STATUSES.COMPLETED;
      app.currentStage = STAGES.STAGE_COMPLETED;
      app.assignedRole = 'None';
      app.pendingCitizenAction = 'DOWNLOAD_CERTIFICATE';
      app.certificateStatus = 'Issued';
      app.certificateNo = certNo;
      app.approvalDate = datePart;
      app.validUntil = validUntil;
      app.dtoRemarks = cleanRemarks;
      app.approvingOfficer = `${dtoOfficerName}, District Tourism Officer (DTO)`;
      app.latestRemarks = cleanRemarks;

      this._appendEvent(
        app,
        'District Tourism Officer (DTO)',
        dtoOfficerName,
        'Approve & Issue Certificate',
        STAGES.STAGE_COMPLETED,
        'Applicant / Citizen',
        cleanRemarks,
        `Completed – Certificate #${certNo} Issued`
      );

      this.saveApplication(app, { action: 'CERTIFICATE_ISSUED', destinationRole: 'Citizen' });

      this._pushNotification({
        refNo: app.refNo,
        targetRole: 'Citizen',
        district: app.district,
        eventKey: 'CIT_CERT_' + certNo,
        title: `Certificate Issued – Ready for Download: ${app.refNo}`,
        message: `Certificate #${certNo} issued (valid until ${validUntil}). Download your official Form 3 Registration Certificate.`,
        type: 'success',
        actionLabel: 'Download Certificate',
        targetUrl: `certificate.html?arn=${encodeURIComponent(app.refNo)}`
      });

      return {
        success: true,
        refNo: app.refNo,
        certificateNo: certNo,
        newStage: app.currentStage,
        destinationRole: 'Applicant / Citizen (Completed)',
        message: `Certificate #${certNo} generated and application ${app.refNo} marked Completed.`
      };
    },

    dtoApprove: function (refNo, remarks, officerName) {
      return this.dtoApproveAndIssueCertificate(refNo, remarks, officerName);
    },

    // Explicit role-validated return router (never generic previous-dept return)
    returnToCitizen: function (refNo, remarks, role, customOfficerName) {
      const r = (role || '').toLowerCase();
      if (r === 'to') return this.toReturnToApplicant(refNo, remarks, customOfficerName);
      if (r === 'dto') return this.dtoReturnToApplicant(refNo, remarks, customOfficerName);
      return { success: false, message: 'Return to Applicant is only permitted for TO or authorized DTO stages.' };
    },

    rejectApplication: function (refNo, remarks, role, customOfficerName) {
      const r = (role || '').toLowerCase();
      if (r !== 'dto') {
        return { success: false, message: 'Action not permitted: Only DTO may reject applications during DTO Initial or Final Verification.' };
      }
      return this.dtoReject(refNo, remarks, customOfficerName);
    },

    // ------------------------------------------------------------------------
    // CITIZEN PAYMENT & RESUBMISSION ACTIONS
    // ------------------------------------------------------------------------

    /**
     * Step 6 (TA/TO & Dealer) / Step 4 (Outdoor Photographer): Process Citizen Payment
     * Auto-forwards ONLY on confirmed success; retains Payment Pending on failed/cancelled.
     * Prevents duplicate payment once Paid.
     */
    processCitizenPayment: function (refNo, paymentDetails) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      if (!app.paymentActivated) {
        return { success: false, message: 'Action blocked: Payment has not been activated by DTO Initial Verification.' };
      }
      if (app.paymentStatus === 'Paid') {
        return { success: false, message: 'Duplicate payment blocked: Statutory fee is already paid for this application.' };
      }
      if (app.assignedRole !== 'Citizen' || app.currentStage !== STAGES.STAGE_PAYMENT_PENDING) {
        return { success: false, message: 'Application is not currently in Payment Pending stage.' };
      }

      const now = formatNow();
      const details = paymentDetails || {};
      const amount = details.amount || app.registrationFee || 7000;

      if (details.simulateFail || details.simulateCancel) {
        const isCancel = Boolean(details.simulateCancel);
        const failStatus = isCancel ? 'Payment Cancelled' : 'Payment Failed';
        const failReason = details.error || (isCancel
          ? 'Payment cancelled by applicant before gateway confirmation.'
          : 'Transaction declined by bank / payment gateway timeout.');

        app.paymentStatus = failStatus;
        app.lastPaymentError = failReason;
        app.status = STATUSES.PAYMENT_PENDING;
        app.currentStage = STAGES.STAGE_PAYMENT_PENDING;
        app.assignedRole = 'Citizen';
        app.latestRemarks = failReason;
        app.paymentHistory.push({
          timestamp: now,
          status: failStatus,
          amount: amount,
          method: details.method || 'Online Gateway',
          remarks: failReason
        });

        this._appendEvent(
          app,
          'Citizen Applicant',
          app.applicantName,
          failStatus,
          STAGES.STAGE_PAYMENT_PENDING,
          'Applicant / Citizen (Payment Retained)',
          `${failReason} Application retained in Payment Pending stage.`,
          failStatus
        );

        this.saveApplication(app, { action: 'CITIZEN_PAYMENT_UNSUCCESSFUL', destinationRole: 'Citizen' });
        return {
          success: false,
          paymentStatus: failStatus,
          message: `${failStatus}: ${failReason} Application remains in Payment Pending stage.`
        };
      }

      // Confirmed Successful Payment -> Automatically forward to DTO Final Verification
      const txnSuffix = Math.floor(100000 + Math.random() * 900000);
      const txnId = details.txnId || `TXN-SK-HSP-2026-${txnSuffix}`;
      const receiptNo = `RCPT-SK-TCD-2026-${app.refNo.slice(-4)}${Math.floor(10 + Math.random() * 90)}`;
      const method = details.method || 'Online Payment (Sikkim State Portal - SBI e-Pay)';

      app.paymentStatus = 'Paid';
      app.paymentTxnId = txnId;
      app.paymentReceiptNo = receiptNo;
      app.paymentDate = now;
      app.paymentMethod = method;
      app.amountPaid = amount;
      delete app.lastPaymentError;

      app.paymentHistory.push({
        timestamp: now,
        status: 'Paid',
        amount: amount,
        txnId: txnId,
        receiptNo: receiptNo,
        method: method
      });

      app.status = STATUSES.UNDER_VERIFICATION;
      app.currentStage = STAGES.STAGE_DTO_FINAL;
      app.assignedRole = 'DTO';
      app.pendingCitizenAction = null;

      const gradeInfo = (app.registrationGrade && app.registrationGrade !== 'Not Applicable') ? ` (${app.registrationGrade})` : '';
      const payRemarks = `Payment Completed: ₹${amount.toLocaleString('en-IN')}${gradeInfo} via ${method}. Transaction Ref #${txnId}, Receipt #${receiptNo}. Automatically routed to DTO Final Verification.`;
      app.latestRemarks = payRemarks;

      this._appendEvent(
        app,
        'Citizen Applicant',
        app.applicantName,
        'Payment Completed',
        STAGES.STAGE_DTO_FINAL,
        `District Tourism Officer (${app.district})`,
        payRemarks,
        'Auto-forwarded to DTO Final Verification'
      );

      this.saveApplication(app, { action: 'PAYMENT_COMPLETED', destinationRole: 'DTO' });

      // Notify BOTH DTO and Citizen
      this._pushNotification({
        refNo: app.refNo,
        targetRole: 'DTO',
        district: app.district,
        eventKey: 'DTO_FINAL_' + txnId,
        title: `Payment Completed – Final Verification Required: ${app.refNo}`,
        message: `${app.businessName} (${app.categoryName} • ${app.district}) paid ₹${amount.toLocaleString('en-IN')} (#${txnId}). Awaiting DTO final verification.`,
        type: 'success',
        actionLabel: 'Final Verification',
        targetUrl: `review.html?arn=${encodeURIComponent(app.refNo)}&role=dto&district=${encodeURIComponent(app.district)}`
      });

      this._pushNotification({
        refNo: app.refNo,
        targetRole: 'Citizen',
        district: app.district,
        eventKey: 'CIT_PAID_' + txnId,
        title: `Payment Completed: ${app.refNo}`,
        message: `Paid ₹${amount.toLocaleString('en-IN')} (#${txnId}). Automatically forwarded to DTO (${app.district}) for final verification.`,
        type: 'info',
        actionLabel: 'Track Application',
        targetUrl: `dashboard.html?arn=${encodeURIComponent(app.refNo)}&view=tracking`
      });

      return {
        success: true,
        refNo: app.refNo,
        txnId: txnId,
        receiptNo: receiptNo,
        amount: amount,
        newStage: app.currentStage,
        destinationRole: `District Tourism Officer (${app.district})`,
        message: `Payment of ₹${amount.toLocaleString('en-IN')} confirmed (#${txnId}). Automatically forwarded to DTO Final Verification.`
      };
    },

    /**
     * Citizen Resubmission after Return
     * Retains exact Reference Number, preserves prior documents & payment state,
     * routes back to Tourist Officer (TO Initial Verification) per Example 3.
     */
    citizenResubmit: function (refNo, updatedData, citizenRemarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      if (app.assignedRole !== 'Citizen' || app.currentStage !== STAGES.STAGE_RETURNED_CITIZEN) {
        return { success: false, message: 'Action not permitted: Application is not returned to citizen for correction.' };
      }

      const now = formatNow();
      const targetStage = STAGES.STAGE_TO_INITIAL;
      const targetRole = 'TO';
      const cleanRemarks = (citizenRemarks && citizenRemarks.trim())
        ? citizenRemarks.trim()
        : 'Applicant updated requested details/documents and resubmitted.';

      // Update editable particulars while preserving refNo, payment, inspection, and history records
      if (updatedData && typeof updatedData === 'object') {
        const protectedKeys = new Set([
          'refNo', 'history', 'auditHistory', 'inspectionHistory', 'paymentHistory',
          'paymentActivated', 'paymentStatus', 'paymentTxnId', 'paymentReceiptNo', 'paymentDate', 'amountPaid',
          'certificateNo', 'approvalDate', 'validUntil'
        ]);
        Object.keys(updatedData).forEach(k => {
          if (k === 'newDoc' && updatedData.newDoc) {
            if (!Array.isArray(app.uploadedDocuments)) {
              app.uploadedDocuments = [...this.getDocumentsForApplication(app)];
            }
            app.uploadedDocuments.push(updatedData.newDoc);
          } else if (!protectedKeys.has(k) && updatedData[k] !== undefined) {
            app[k] = updatedData[k];
          }
        });
      }

      app.status = STATUSES.UNDER_REVIEW;
      app.currentStage = targetStage;
      app.assignedRole = targetRole;
      app.pendingCitizenAction = null;
      app.citizenRemarks = cleanRemarks;
      app.resubmittedDate = now;
      app.returnRemarks = null;
      app.latestRemarks = cleanRemarks;

      this._appendEvent(
        app,
        'Citizen Applicant',
        app.applicantName,
        'Resubmitted After Correction',
        targetStage,
        `Tourist Officer (${app.district})`,
        cleanRemarks,
        'Resubmitted to TO Verification'
      );

      this.saveApplication(app, { action: 'CITIZEN_RESUBMITTED', destinationRole: 'TO' });

      this._pushNotification({
        refNo: app.refNo,
        targetRole: 'TO',
        district: app.district,
        eventKey: 'TO_RESUB_' + app.history.length,
        title: `Corrected Application Resubmitted: ${app.refNo}`,
        message: `${app.businessName} (${app.categoryName}) resubmitted corrections: "${cleanRemarks}".`,
        type: 'primary',
        actionLabel: 'Verify Application',
        targetUrl: `review.html?arn=${encodeURIComponent(app.refNo)}&role=to&district=${encodeURIComponent(app.district)}`
      });

      return {
        success: true,
        refNo: app.refNo,
        newStage: app.currentStage,
        destinationRole: 'Tourist Officer (TO)',
        message: `Application ${app.refNo} resubmitted successfully and routed to TO (${app.district}).`
      };
    }
  };

  WorkflowEngine.init();
  window.WorkflowEngine = WorkflowEngine;

})(typeof window !== 'undefined' ? window : this);
