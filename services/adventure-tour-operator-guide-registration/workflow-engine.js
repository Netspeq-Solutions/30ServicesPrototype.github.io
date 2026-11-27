/**
 * WORKFLOW ENGINE & CENTRAL DATA REPOSITORY
 * Service: Adventure Tour Operator & Guide Registration
 * Department: Tourism & Civil Aviation Department, Government of Sikkim
 * Stage 04: Department Dashboard & Application Workflow
 * Theme: Royal Navy (data-theme="royal-navy")
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'adv_workflow_applications_v7';
  const SEED_VERSION_KEY = 'adv_workflow_version_v7';
  const CURRENT_SEED_VERSION = 'v8.0_clean_empty_state';
  const ATO_SEQ_KEY = 'adv_seq_counter_ato_v7';
  const GR_SEQ_KEY = 'adv_seq_counter_gr_v7';

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
    ATO_AWAITING_TA: 'Awaiting TO Review',
    ATO_AWAITING_IO: 'Awaiting Inspecting Officer Assignment',
    ATO_UNDER_INSPECTION: 'Assigned to IO &bull; Inspection in Progress',
    ATO_REPORT_SUBMITTED: 'Inspection Report Submitted &bull; Awaiting DTO Review',
    ATO_AWAITING_DTO: 'Awaiting District DTO Review',
    ATO_PAYMENT_ACTIVATED: 'Payment Activated &bull; Awaiting Applicant Payment',
    ATO_PAYMENT_SUBMITTED: 'Payment Submitted &bull; Awaiting District DTO Approval',
    ATO_APPROVED: 'Approved &bull; Certificate Issued',

    // Workflow 2: Guide Registration (Gangtok)
    GR_HQ_AWAITING_TA: 'Awaiting TO Review',
    GR_HQ_AWAITING_DTO: 'Awaiting District DTO Review',
    GR_HQ_PAYMENT_ACTIVATED: 'Payment Activated &bull; Awaiting Applicant Payment',
    GR_HQ_PAYMENT_SUBMITTED: 'Payment Submitted &bull; Awaiting District DTO Approval',
    GR_HQ_APPROVED: 'Approved &bull; Certificate &amp; ID Card Issued',

    // Workflow 3: Guide Registration (Other Districts: Mangan, Namchi, Gyalshing, Pakyong, Soreng)
    GR_DIST_AWAITING_TA: 'Awaiting District TO Review',
    GR_DIST_AWAITING_DTO: 'Awaiting District DTO Review',
    GR_DIST_PAYMENT_ACTIVATED: 'Payment Activated &bull; Awaiting Applicant Payment',
    GR_DIST_PAYMENT_SUBMITTED: 'Payment Submitted &bull; Awaiting District DTO Action',
    GR_DIST_APPROVED: 'Approved &bull; Certificate &amp; ID Card Issued',

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
      designation: 'Tourism Officer (Headquarters Scrutiny)',
      office: 'Paryatan Bhawan, Tadong, Gangtok',
      phone: '03592-209090 Ext 104'
    },
    io: {
      name: 'Tashi Wangdi Lepcha',
      designation: 'Inspecting Officer (Adventure Safety & Equipment)',
      office: 'Paryatan Bhawan, Tadong, Gangtok',
      phone: '03592-209090 Ext 112'
    },
    dto: {
      name: 'Pema Dorjee Sherpa',
      designation: 'District Tourism Officer (Gangtok Circle)',
      office: 'Paryatan Bhawan, Tadong, Gangtok',
      phone: '03592-209090 Ext 205'
    }
  };

  // ==========================================================================
  // SEED APPLICATIONS DATASET (Comprehensive: covering ALL 3 workflows & stages)
  // ==========================================================================
  const SEED_APPLICATIONS = [];

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

    // Get all applications (auto-merging any locally submitted drafts or external filings)
    getAllApplications: function () {
      this.init();
      let apps = [];
      try {
        apps = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      } catch (e) {
        apps = [...SEED_APPLICATIONS];
      }

      // Check if there are newly submitted applications from apply.html not yet merged
      try {
        const submitted = JSON.parse(localStorage.getItem('adv_submitted_applications') || '[]');
        if (Array.isArray(submitted) && submitted.length > 0) {
          let updated = false;
          submitted.forEach(sub => {
            const subArn = sub.id || sub.arn;
            if (subArn && !apps.some(a => a.arn === subArn)) {
              const isGuide = (sub.type === 'guide-registration' || (subArn && subArn.includes('GR')));
              const dist = sub.district || 'Gangtok';
              const created = {
                arn: subArn,
                type: isGuide ? 'guide-registration' : 'adventure-tour-operator',
                typeName: isGuide ? 'Guide Registration' : 'Adventure Tour Operator',
                applicantName: sub.applicant || sub.applicantName || 'Citizen Applicant',
                enterpriseName: sub.enterpriseName || (isGuide ? (sub.applicant + ' (Guide)') : (sub.applicant + ' Expeditions')),
                district: dist,
                submittedDate: sub.submittedDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                status: STATUSES.UNDER_REVIEW,
                stage: isGuide ? ((dist || '').toLowerCase() === 'gangtok' ? STAGES.GR_HQ_AWAITING_TA : STAGES.GR_DIST_AWAITING_TA) : STAGES.ATO_AWAITING_TA,
                currentRole: isGuide ? ((dist || '').toLowerCase() === 'gangtok' ? 'ta-hq' : 'dist-ta') : 'ta-hq',
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
                documents: sub.documents || [
                  { name: isGuide ? 'identity_proof_applicant.pdf' : 'agency_reg_certificate.pdf', type: isGuide ? 'Identity Proof' : 'Agency Registration', size: '1.2 MB', verified: true },
                  { name: isGuide ? 'coi_certificate_applicant.pdf' : 'coi_certificate_director.pdf', type: 'COI / Domicile Certificate', size: '1.4 MB', verified: true }
                ],
                details: sub.details || {},
                history: [
                  {
                    action: 'Application Submitted Online',
                    role: 'Citizen Applicant',
                    officer: sub.applicant || 'Citizen Applicant',
                    timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    remarks: `Initial online filing submitted via Sikkim Single-Window Citizen Portal (${dist} District).`
                  }
                ]
              };
              apps.unshift(created);
              updated = true;
            }
          });
          if (updated) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
          }
        }
      } catch (e) {}

      return apps;
    },

    // Get specific application by ARN (with alias mapping & case-insensitivity)
    getApplicationByArn: function (arn) {
      if (!arn) return null;
      const cleanArn = String(arn).trim();
      const all = this.getAllApplications();

      // Direct match
      let match = all.find(a => a.arn.toLowerCase() === cleanArn.toLowerCase());
      if (match) return match;

      // Handle common demo scenario aliases
      const aliasMap = {
        'ATO-2026-004': 'SK-ATO-2026-0078',
        'ATO-2026-005': 'SK-ATO-2026-0009',
        'ATO-2026-006': 'SK-ATO-2026-0063',
        'GR-2026-016': 'SK-GR-2026-0099'
      };
      if (aliasMap[cleanArn]) {
        match = all.find(a => a.arn === aliasMap[cleanArn]);
        if (match) return match;
      }

      return null;
    },

    // Save/Update application (moves latest transaction to top of list)
    saveApplication: function (app) {
      if (!app || !app.arn) return null;
      const all = this.getAllApplications();
      const idx = all.findIndex(a => a.arn.toLowerCase() === app.arn.toLowerCase());
      if (idx !== -1) {
        all.splice(idx, 1);
      }
      app.updatedAtMs = Date.now();
      all.unshift(app);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      return app;
    },

    // Reset database to initial seed
    resetDatabase: function () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_APPLICATIONS));
      localStorage.setItem(SEED_VERSION_KEY, CURRENT_SEED_VERSION);
      localStorage.removeItem('adv_submitted_applications');
      return SEED_APPLICATIONS;
    },

    // Helper: Add History Event
    _addHistory: function (app, action, role, officer, remarks) {
      const now = new Date();
      const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
      const timestamp = now.toLocaleDateString('en-GB', options);

      if (!Array.isArray(app.history)) app.history = [];
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
    // WORKFLOW CREATION & RESUBMISSION
    // ------------------------------------------------------------------------

    // Action: Create New Application (Citizen submission)
    createApplication: function (appData) {
      this.init();
      const now = new Date();
      const nowStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const nowTimeStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

      const type = appData.type || (appData.category === 'guide-registration' ? 'guide-registration' : 'adventure-tour-operator');
      const isGuide = (type === 'guide-registration');
      const catCode = isGuide ? 'GR' : 'ATO';
      let nextSeq = isGuide ? 251 : 101;
      try {
        const seqKey = isGuide ? GR_SEQ_KEY : ATO_SEQ_KEY;
        const prev = parseInt(localStorage.getItem(seqKey) || (isGuide ? '250' : '100'), 10);
        nextSeq = prev + 1;
        localStorage.setItem(seqKey, String(nextSeq));
      } catch (e) {}
      const arn = appData.arn || `SK-${catCode}-2026-${String(nextSeq).padStart(4, '0')}`;
      const district = appData.district || 'Gangtok';

      const isGangtok = ((district || '').toLowerCase() === 'gangtok');
      let stage = STAGES.ATO_AWAITING_TA;
      let currentRole = isGangtok ? 'ta-hq' : 'dist-ta';

      if (isGuide) {
        stage = isGangtok ? STAGES.GR_HQ_AWAITING_TA : STAGES.GR_DIST_AWAITING_TA;
      } else {
        stage = STAGES.ATO_AWAITING_TA;
      }

      const statutoryFee = 1500;

      const newApp = {
        arn: arn,
        type: type,
        typeName: isGuide ? 'Guide Registration' : 'Adventure Tour Operator',
        applicantName: appData.applicantName || 'Citizen Applicant',
        enterpriseName: appData.enterpriseName || (isGuide ? (appData.applicantName + ' (Guide)') : (appData.applicantName + ' Expeditions')),
        district: district,
        submittedDate: nowStr,
        lastUpdated: nowStr,
        status: STATUSES.UNDER_REVIEW,
        stage: stage,
        currentRole: currentRole,
        assignedIO: null,
        inspectionReport: null,
        payment: {
          amount: statutoryFee,
          activated: false,
          activatedBy: null,
          activatedDate: null,
          paid: false,
          transactionRef: null,
          paidDate: null
        },
        documents: appData.documents || [
          { name: isGuide ? 'identity_proof_applicant.pdf' : 'agency_reg_certificate.pdf', type: isGuide ? 'Identity Proof' : 'Agency Registration', size: '1.2 MB', verified: true },
          { name: isGuide ? 'coi_certificate_applicant.pdf' : 'coi_certificate_director.pdf', type: 'COI / Domicile Certificate', size: '1.4 MB', verified: true },
          { name: isGuide ? 'hmi_advance_cert.pdf' : 'lead_mountaineering_cert.pdf', type: isGuide ? 'Guide Training Certificate' : 'Lead Instructor Credentials', size: '2.1 MB', verified: true }
        ],
        details: appData.details || {},
        history: [
          {
            action: 'Application Submitted Online',
            role: 'Citizen Applicant',
            officer: appData.applicantName || 'Citizen Applicant',
            timestamp: nowTimeStr,
            remarks: `Initial online application submitted for ${isGuide ? 'Guide Registration' : 'Adventure Tour Operator'} (${district} District).`
          }
        ]
      };

      this.saveApplication(newApp);

      // Keep adv_submitted_applications in sync
      try {
        let existing = JSON.parse(localStorage.getItem('adv_submitted_applications') || '[]');
        existing.unshift({
          id: arn,
          arn: arn,
          type: type,
          applicant: newApp.applicantName,
          district: district,
          submittedDate: nowStr,
          status: 'UNDER_REVIEW',
          stage: stage
        });
        localStorage.setItem('adv_submitted_applications', JSON.stringify(existing));
      } catch (e) {}

      return newApp;
    },

    // Action: Citizen Resubmit after clarification / correction
    citizenResubmit: function (arn, updatedData, citizenRemarks) {
      const app = this.getApplicationByArn(arn);
      if (!app) return false;

      const now = new Date();
      const nowStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      app.lastUpdated = nowStr;
      app.status = STATUSES.UNDER_REVIEW;

      if (updatedData && updatedData.details) {
        app.details = Object.assign({}, app.details || {}, updatedData.details);
      }
      if (updatedData && updatedData.documents && Array.isArray(updatedData.documents)) {
        app.documents = updatedData.documents;
      }

      // Route back to the returning authority
      const returnedByStr = (app.returnedBy || '').toLowerCase();
      const returnedFromRole = (app.returnedFromRole || '').toLowerCase();
      const returnedFromStage = app.returnedFromStage || '';
      const isDtoReturn = (returnedFromRole === 'dto-hq' || returnedFromRole === 'dist-dto' || returnedByStr.includes('dto'));
      const isGangtok = ((app.district || 'Gangtok').toLowerCase() === 'gangtok');
      if (app.type === 'adventure-tour-operator') {
        if (isDtoReturn && (returnedFromStage === STAGES.ATO_PAYMENT_SUBMITTED || (app.payment && app.payment.paid))) {
          app.currentRole = isGangtok ? 'dto-hq' : 'dist-dto';
          app.stage = STAGES.ATO_PAYMENT_SUBMITTED;
        } else if (isDtoReturn) {
          app.currentRole = isGangtok ? 'dto-hq' : 'dist-dto';
          app.stage = STAGES.ATO_AWAITING_DTO;
        } else if (app.inspectionReport) {
          app.currentRole = isGangtok ? 'ta-hq' : 'dist-ta';
          app.stage = STAGES.ATO_REPORT_SUBMITTED;
        } else {
          app.currentRole = isGangtok ? 'ta-hq' : 'dist-ta';
          app.stage = STAGES.ATO_AWAITING_TA;
        }
      } else {
        // Guide Registration
        if (isGangtok) {
          if (isDtoReturn && (returnedFromStage === STAGES.GR_HQ_PAYMENT_SUBMITTED || (app.payment && app.payment.paid))) {
            app.currentRole = 'dto-hq';
            app.stage = STAGES.GR_HQ_PAYMENT_SUBMITTED;
          } else if (isDtoReturn) {
            app.currentRole = 'dto-hq';
            app.stage = STAGES.GR_HQ_AWAITING_DTO;
          } else {
            app.currentRole = 'ta-hq';
            app.stage = STAGES.GR_HQ_AWAITING_TA;
          }
        } else {
          // Other District Guide
          if (isDtoReturn && (returnedFromStage === STAGES.GR_DIST_PAYMENT_SUBMITTED || (app.payment && app.payment.paid))) {
            app.currentRole = 'dist-dto';
            app.stage = STAGES.GR_DIST_PAYMENT_SUBMITTED;
          } else if (isDtoReturn) {
            app.currentRole = 'dist-dto';
            app.stage = STAGES.GR_DIST_AWAITING_DTO;
          } else {
            app.currentRole = 'dist-ta';
            app.stage = STAGES.GR_DIST_AWAITING_TA;
          }
        }
      }

      const remarksText = citizenRemarks || 'Applicant submitted requested clarifications and updated documentation.';
      this._addHistory(
        app,
        'Clarification & Corrections Resubmitted',
        'Citizen Applicant',
        app.applicantName || 'Citizen Applicant',
        remarksText
      );

      // Clear returned status flags
      app.returnRemarks = null;
      app.returnedFromStage = null;
      app.returnedFromRole = null;

      this.saveApplication(app);
      try {
        const cur = JSON.parse(localStorage.getItem('adv_citizen_live_alert_v1') || 'null');
        if (cur && cur.arn === app.arn) localStorage.removeItem('adv_citizen_live_alert_v1');
        if (app.currentRole === 'dto-hq' || app.currentRole === 'dist-dto') {
          localStorage.setItem('adv_dto_live_alert_v1', JSON.stringify({
            arn: app.arn,
            stage: (app.payment && app.payment.paid) ? 'final' : 'initial',
            district: app.district,
            timestamp: Date.now()
          }));
        }
      } catch (e) {}
      return app;
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
      app.deptReturnInfo = null;
      app.returnRemarks = null;

      this._addHistory(
        app,
        'Assigned to Inspecting Officer (IO)',
        'TA – Headquarters',
        officerName || 'Tashi Namgyal Bhutia (TO)',
        `Assigned to ${app.assignedIO.name}. Instructions: ${instructions || 'Physical safety gear and equipment inspection.'}`
      );

      this.saveApplication(app);
      try {
        localStorage.setItem('adv_io_live_alert_v1', JSON.stringify({
          arn: app.arn, title: `New Inspection Assigned: ${app.arn}`, timestamp: Date.now()
        }));
      } catch (e) {}
      return app;
    },

    // Action 2: Submit Inspection Report (IO -> TA HQ) [ATO Only]
    submitInspectionReport: function (arn, reportDataOrSummary, remarks, isCompliant, officerName) {
      const app = this.getApplicationByArn(arn);
      if (!app || app.type !== 'adventure-tour-operator') return false;

      const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      let docName = 'OnSite_Gear_Safety_Inspection_Report.pdf';
      let docSize = '2.4 MB';
      let reportRemarks = '';
      let compliant = (isCompliant !== false);
      let statusStr = compliant ? 'Compliant & Recommended' : 'Safety Deficiencies Flagged';
      let summaryText = compliant 
        ? 'On-site physical inspection of adventure equipment, safety gear, and operational standards completed. Compliant with safety standards.'
        : 'On-site physical inspection revealed safety gear deficiencies requiring remediation.';
      let officer = officerName;
      let checklist = null;

      if (reportDataOrSummary && typeof reportDataOrSummary === 'object') {
        docName = reportDataOrSummary.docName || docName;
        docSize = reportDataOrSummary.docSize || docSize;
        reportRemarks = reportDataOrSummary.remarks || remarks || '';
        if (reportDataOrSummary.isCompliant !== undefined) {
          compliant = Boolean(reportDataOrSummary.isCompliant);
        }
        statusStr = reportDataOrSummary.status || (compliant ? 'Compliant & Recommended' : 'Safety Deficiencies Flagged');
        summaryText = reportDataOrSummary.summary || summaryText;
        officer = reportDataOrSummary.officer || officerName;
        checklist = reportDataOrSummary.checklist || null;
      } else {
        summaryText = reportDataOrSummary || summaryText;
        reportRemarks = remarks || '';
        compliant = (isCompliant !== false);
        statusStr = compliant ? 'Compliant & Recommended' : 'Safety Deficiencies Flagged';
      }

      app.inspectionReport = {
        submittedDate: nowStr,
        status: statusStr,
        isCompliant: compliant,
        docName: docName,
        docSize: docSize,
        summary: summaryText,
        remarks: reportRemarks || (compliant ? 'Physical inspection verified compliant with safety standards.' : 'Safety deficiencies flagged during inspection.'),
        officer: officer || (app.assignedIO && app.assignedIO.name ? app.assignedIO.name : 'Tashi Wangdi Lepcha (IO)'),
        checklist: checklist
      };

      // Add or update document in application's Documents & Clearances
      if (!Array.isArray(app.documents)) app.documents = [];
      const existingDocIdx = app.documents.findIndex(d => (d.type && d.type.includes('Inspection')) || (d.name && d.name.toLowerCase().includes('inspection')));
      const docEntry = {
        name: docName,
        type: 'On-Site Physical Inspection Report (IO Signed)',
        size: docSize,
        uploadedDate: nowStr,
        status: compliant ? 'Verified' : 'Deficiencies Flagged'
      };
      if (existingDocIdx >= 0) {
        app.documents[existingDocIdx] = docEntry;
      } else {
        app.documents.push(docEntry);
      }

      app.currentRole = (app.district === 'Gangtok') ? 'ta-hq' : 'dist-ta';
      app.stage = STAGES.ATO_REPORT_SUBMITTED;
      app.status = STATUSES.UNDER_REVIEW;
      app.deptReturnInfo = null;
      app.returnRemarks = null;

      this._addHistory(
        app,
        `Inspection Report Submitted (${compliant ? 'Compliant' : 'Safety Deficiencies Flagged'})`,
        'Inspecting Authority (IA)',
        app.inspectionReport.officer,
        `Physical report attached: ${docName}. Outcome: ${statusStr}. ${reportRemarks ? 'Remarks: ' + reportRemarks : ''}`
      );

      this.saveApplication(app);
      try {
        const curIo = JSON.parse(localStorage.getItem('adv_io_live_alert_v1') || 'null');
        if (curIo && curIo.arn === app.arn) localStorage.removeItem('adv_io_live_alert_v1');
      } catch (e) {}
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
        officerRole || 'Tourism Officer',
        officerName || 'Tourism Officer',
        remarks || 'Forwarded for state-level review and concurrence.'
      );

      this.saveApplication(app);
      return app;
    },

    // Action 4: Forward to DTO (HQ or District)
    forwardToDto: function (arn, targetRole, remarks, officerName, officerRole) {
      const app = this.getApplicationByArn(arn);
      if (!app) return false;

      app.deptReturnInfo = null;
      app.returnRemarks = null;
      app.currentRole = targetRole || 'dto-hq';
      const isPaid = Boolean(app.payment && app.payment.paid);
      if (app.type === 'adventure-tour-operator') {
        app.stage = isPaid ? STAGES.ATO_PAYMENT_SUBMITTED : STAGES.ATO_AWAITING_DTO;
      } else if (app.district === 'Gangtok') {
        app.stage = isPaid ? STAGES.GR_HQ_PAYMENT_SUBMITTED : STAGES.GR_HQ_AWAITING_DTO;
      } else if (targetRole === 'dist-dto') {
        app.stage = isPaid ? STAGES.GR_DIST_PAYMENT_SUBMITTED : STAGES.GR_DIST_AWAITING_DTO;
      } else {
        app.stage = isPaid ? STAGES.GR_DIST_PAYMENT_SUBMITTED : STAGES.GR_DIST_AWAITING_HQ_DTO;
      }
      app.status = STATUSES.UNDER_REVIEW;

      this._addHistory(
        app,
        `Forwarded to ${targetRole === 'dist-dto' ? 'District DTO' : 'HQ DTO'}`,
        officerRole || 'Tourism Officer (TO)',
        officerName || 'Tourism Officer',
        remarks || 'Forwarded for statutory review.'
      );

      this.saveApplication(app);
      try {
        localStorage.setItem('adv_dto_live_alert_v1', JSON.stringify({
          arn: app.arn, stage: 'initial', district: app.district, timestamp: Date.now()
        }));
      } catch (e) {}
      return app;
    },

    // Action 5: Activate Payment (DTO only: HQ DTO for ATO & Gangtok GR; District DTO for Other GR)
    activatePayment: function (arn, officerName, officerRole) {
      const app = this.getApplicationByArn(arn);
      if (!app) return false;

      const isGuide = (app.type === 'guide-registration' || (app.arn && app.arn.includes('GR')));
      const fee = 1500;

      app.payment = app.payment || {};
      app.payment.amount = fee;
      app.payment.activated = true;
      app.payment.paid = false;
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
        `Statutory Fee Activated (₹${fee.toLocaleString('en-IN')})`,
        officerRole || 'DTO Desk',
        officerName || 'District Tourism Officer',
        `Application fee of ₹${fee.toLocaleString('en-IN')} activated. Notification dispatched to citizen.`
      );

      this.saveApplication(app);
      try {
        const curDto = JSON.parse(localStorage.getItem('adv_dto_live_alert_v1') || 'null');
        if (curDto && curDto.arn === app.arn) localStorage.removeItem('adv_dto_live_alert_v1');
        localStorage.setItem('adv_citizen_live_alert_v1', JSON.stringify({
          arn: app.arn, actionType: 'payment', fee: fee, title: app.enterpriseName || app.applicantName,
          typeName: app.typeName, district: app.district, remarks: `Fee of ₹${fee.toLocaleString('en-IN')} activated for payment.`, timestamp: Date.now()
        }));
      } catch (e) {}
      return app;
    },

    // Action 6: Submit Citizen Payment (Citizen -> DTO)
    submitCitizenPayment: function (arn, transactionRef, applicantName, paymentMode) {
      const app = this.getApplicationByArn(arn);
      if (!app) return false;

      if (app.payment && app.payment.paid) {
        return app; // Prevent duplicate payment
      }

      const isGuide = (app.type === 'guide-registration' || (app.arn && app.arn.includes('GR')));
      const fee = (app.payment && app.payment.amount) ? app.payment.amount : 1500;

      const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      app.payment = app.payment || {};
      app.payment.amount = fee;
      app.payment.paid = true;
      app.payment.transactionRef = transactionRef || `TXN-SK-ADV-${Math.floor(100000 + Math.random() * 900000)}`;
      app.payment.paidDate = nowStr;
      app.payment.mode = paymentMode || 'UPI / Bharat QR';

      app.status = STATUSES.UNDER_REVIEW;

      const isGangtok = ((app.district || 'Gangtok').toLowerCase() === 'gangtok');
      if (app.type === 'adventure-tour-operator') {
        app.currentRole = isGangtok ? 'dto-hq' : 'dist-dto';
        app.stage = STAGES.ATO_PAYMENT_SUBMITTED;
      } else if (isGangtok) {
        app.currentRole = 'dto-hq';
        app.stage = STAGES.GR_HQ_PAYMENT_SUBMITTED;
      } else {
        app.currentRole = 'dist-dto';
        app.stage = STAGES.GR_DIST_PAYMENT_SUBMITTED;
      }

      this._addHistory(
        app,
        `Statutory Fee Paid (₹${fee.toLocaleString('en-IN')})`,
        'Citizen Applicant',
        applicantName || app.applicantName,
        `Demonstration payment submitted via ${app.payment.mode}. Ref: ${app.payment.transactionRef}. Returning to DTO.`
      );

      this.saveApplication(app);
      try {
        localStorage.setItem('adv_dto_live_alert_v1', JSON.stringify({
          arn: app.arn, stage: 'final', district: app.district, timestamp: Date.now()
        }));
      } catch (e) {}
      try {
        const cur = JSON.parse(localStorage.getItem('adv_citizen_live_alert_v1') || 'null');
        if (cur && cur.arn === app.arn) localStorage.removeItem('adv_citizen_live_alert_v1');
      } catch (e) {}
      return app;
    },

    // Action 7: Return for Correction (TO, DTO)
    returnForCorrection: function (arn, remarks, officerName, officerRole) {
      const app = this.getApplicationByArn(arn);
      if (!app) return false;

      app.returnedFromStage = app.stage;
      app.returnedFromRole = app.currentRole;
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
      try {
        const curDto = JSON.parse(localStorage.getItem('adv_dto_live_alert_v1') || 'null');
        if (curDto && curDto.arn === app.arn) localStorage.removeItem('adv_dto_live_alert_v1');
        localStorage.setItem('adv_citizen_live_alert_v1', JSON.stringify({
          arn: app.arn, actionType: 'returned', title: app.enterpriseName || app.applicantName,
          typeName: app.typeName, district: app.district, remarks: remarks || 'Clarification required.', timestamp: Date.now()
        }));
      } catch (e) {}
      return app;
    },

    // Action 8: Reject Application (DTO)
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
      try {
        const curDto = JSON.parse(localStorage.getItem('adv_dto_live_alert_v1') || 'null');
        if (curDto && curDto.arn === app.arn) localStorage.removeItem('adv_dto_live_alert_v1');
        localStorage.setItem('adv_citizen_live_alert_v1', JSON.stringify({
          arn: app.arn, actionType: 'rejected', title: app.enterpriseName || app.applicantName,
          typeName: app.typeName, district: app.district, remarks: remarks || 'Rejected.', timestamp: Date.now()
        }));
      } catch (e) {}
      return app;
    },

    // Action 9: Final Approval & Certificate Issuance (DTO for ATO & Guide across all districts)
    approveAndIssueCertificate: function (arn, officerName) {
      const app = this.getApplicationByArn(arn);
      if (!app) return false;

      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const isGuide = (app.type === 'guide-registration' || (app.arn && app.arn.includes('GR')));
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

      const isGangtok = ((app.district || 'Gangtok').toLowerCase() === 'gangtok');
      app.currentRole = null;
      app.status = STATUSES.APPROVED;
      app.stage = (app.type === 'adventure-tour-operator')
        ? STAGES.ATO_APPROVED
        : (isGangtok ? STAGES.GR_HQ_APPROVED : STAGES.GR_DIST_APPROVED);

      this._addHistory(
        app,
        isGuide ? 'Approved & Certificate + ID Card Issued' : 'Approved & Certificate Issued',
        `DTO – ${isGangtok ? 'Gangtok' : app.district} Circle`,
        officerName || 'District Tourism Officer',
        `Registration Certificate ${certNo}${isGuide ? ' & Integrated Guide ID Card ' + app.idCardNo : ''} issued digitally. Active till ${app.validTill}.`
      );

      this.saveApplication(app);
      try {
        const curDto = JSON.parse(localStorage.getItem('adv_dto_live_alert_v1') || 'null');
        if (curDto && curDto.arn === app.arn) localStorage.removeItem('adv_dto_live_alert_v1');
        localStorage.setItem('adv_citizen_live_alert_v1', JSON.stringify({
          arn: app.arn, actionType: 'approved', certNo: certNo, title: app.enterpriseName || app.applicantName,
          typeName: app.typeName, district: app.district, remarks: `Certificate ${certNo} is ready for download.`, timestamp: Date.now()
        }));
      } catch (e) {}
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
    },

    // Return to Previous Department (IA -> TO Step 2; TO Post-Inspection -> IA Step 3; DTO -> TO)
    returnToPreviousDepartment: function (arn, officerRole, officerName, remarks) {
      const app = this.getApplicationByArn(arn);
      if (!app) return false;
      const isGangtok = ((app.district || 'Gangtok').toLowerCase() === 'gangtok');
      const prevStage = app.stage || '';

      if (app.type === 'adventure-tour-operator' && (app.currentRole === 'io' || app.currentRole === 'io-hq')) {
        // Step 3 Option A: IA returns to TO Initial Verification (Step 2)
        app.currentRole = isGangtok ? 'ta-hq' : 'dist-ta';
        app.stage = STAGES.ATO_AWAITING_TA;
        app.assignedIO = null;
        app.returnRemarks = remarks || 'Returned by Inspecting Authority (IA) to TO.';
        try { localStorage.removeItem('adv_io_live_alert_v1'); } catch (e) {}
      } else if (app.type === 'adventure-tour-operator' && prevStage === STAGES.ATO_REPORT_SUBMITTED) {
        // Step 4 Option A: TO post-inspection returns to IA for report correction (Step 3)
        app.currentRole = 'io';
        app.stage = STAGES.ATO_UNDER_INSPECTION;
        app.inspectionReport = null;
        app.returnRemarks = remarks || 'Inspection report returned by TO for re-verification.';
        try {
          localStorage.setItem('adv_io_live_alert_v1', JSON.stringify({
            arn: app.arn, title: `Returned for Re-Inspection: ${app.arn}`, timestamp: Date.now()
          }));
        } catch (e) {}
      } else if (app.type === 'adventure-tour-operator') {
        // DTO returns to TO post-inspection
        app.currentRole = isGangtok ? 'ta-hq' : 'dist-ta';
        app.stage = STAGES.ATO_REPORT_SUBMITTED;
        app.returnRemarks = remarks || 'Returned by District Tourism Officer (DTO) to TO for re-verification.';
        try {
          const curDto = JSON.parse(localStorage.getItem('adv_dto_live_alert_v1') || 'null');
          if (curDto && curDto.arn === app.arn) localStorage.removeItem('adv_dto_live_alert_v1');
        } catch (e) {}
      } else {
        // Guide Registration: DTO returns to TO
        app.currentRole = isGangtok ? 'ta-hq' : 'dist-ta';
        app.stage = isGangtok ? STAGES.GR_HQ_AWAITING_TA : STAGES.GR_DIST_AWAITING_TA;
        app.returnRemarks = remarks || 'Returned by District Tourism Officer (DTO) to TO for re-verification.';
        try {
          const curDto = JSON.parse(localStorage.getItem('adv_dto_live_alert_v1') || 'null');
          if (curDto && curDto.arn === app.arn) localStorage.removeItem('adv_dto_live_alert_v1');
        } catch (e) {}
      }

      app.status = STATUSES.UNDER_REVIEW;
      app.deptReturnInfo = {
        fromRole: officerRole || 'Departmental Officer',
        fromOfficer: officerName || 'Departmental Officer',
        targetRole: app.currentRole,
        remarks: remarks || 'Returned to previous department for review/correction.',
        timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      this._addHistory(
        app,
        'Returned to Previous Department',
        officerRole || 'Departmental Officer',
        officerName || 'Departmental Officer',
        remarks || 'Returned to previous department for review/correction.'
      );
      this.saveApplication(app);
      return app;
    }
  };

  // Expose to global window
  window.AdventureWorkflowEngine = AdventureWorkflowEngine;
  AdventureWorkflowEngine.init();

})(window);
