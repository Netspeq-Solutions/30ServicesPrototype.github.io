/**
 * WORKFLOW ENGINE & CENTRAL DATA REPOSITORY (V4 - Stage 04 HQ Referral & Approval Architecture)
 * Service: Tourism Permission
 * Department: Tourism & Civil Aviation Department, Government of Sikkim
 * Stage 04: DTO-Level HQ Referral, HQ Approval & Final Approval Letter Issuance
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'tourism_department_applications';
  const STORAGE_VERSION_KEY = 'tourism_dept_apps_version';
  const CURRENT_SEED_VERSION = 'v7_stage04_lo_reassignment_clean';
  const SUBMITTED_STORAGE_KEY = 'tourism_permission_submitted';

  // The 4 Official Statuses
  const STATUSES = {
    SUBMITTED: 'Submitted',
    RETURNED: 'Returned for Correction',
    REJECTED: 'Rejected',
    APPROVED: 'Approved'
  };

  // The 13 Required Processing Stages
  const STAGES = {
    STAGE_1: 'Application Submitted',
    STAGE_2: 'Awaiting DTO Verification',
    STAGE_3: 'Awaiting HQ Verification',
    STAGE_4: 'Under HQ Review',
    STAGE_5: 'Returned by HQ to DTO',
    STAGE_6: 'Awaiting Citizen Correction',
    STAGE_7: 'Awaiting DTO Reverification',
    STAGE_8: 'Forwarded to HQ After Correction',
    STAGE_9: 'Awaiting HQ Approval Sheet',
    STAGE_10: 'Approval Sheet Uploaded',
    STAGE_11: 'Awaiting Final DTO Approval',
    STAGE_12: 'Approved – Permission Letter Issued',
    STAGE_13: 'Rejected'
  };

  // District to DTO Office Mapping (including Statewide Overview)
  const DISTRICT_OFFICES = {
    'all': {
      district: 'All Districts',
      dtoName: 'Statewide Tourism Officer Panel',
      designation: 'District Tourism Officer (DTO) &circle; Consolidated View',
      office: 'Directorate of Tourism, All 6 Circles, Government of Sikkim',
      phone: '03592-202341 / 03592-209090',
      email: 'dto-statewide@sikkimtourism.gov.in'
    },
    'Gangtok': {
      district: 'Gangtok',
      dtoName: 'Karma Lhendup Bhutia',
      designation: 'District Tourism Officer (DTO)',
      office: 'District Tourism Office, Gangtok Circle, M.G. Marg, Gangtok – 737101',
      phone: '03592-202341',
      email: 'dto-gangtok@sikkimtourism.gov.in'
    },
    'Mangan': {
      district: 'Mangan',
      dtoName: 'Tenzing Dadul Lepcha',
      designation: 'District Tourism Officer (DTO)',
      office: 'District Tourism Office, Mangan Circle, North Sikkim – 737116',
      phone: '03592-234210',
      email: 'dto-mangan@sikkimtourism.gov.in'
    },
    'Namchi': {
      district: 'Namchi',
      dtoName: 'Pema Wangchuk Sherpa',
      designation: 'District Tourism Officer (DTO)',
      office: 'District Tourism Office, Namchi Circle, South Sikkim – 737126',
      phone: '03595-254120',
      email: 'dto-namchi@sikkimtourism.gov.in'
    },
    'Gyalshing': {
      district: 'Gyalshing',
      dtoName: 'Sonam Palzor Bhutia',
      designation: 'District Tourism Officer (DTO)',
      office: 'District Tourism Office, Gyalshing Circle, West Sikkim – 737111',
      phone: '03595-250811',
      email: 'dto-gyalshing@sikkimtourism.gov.in'
    },
    'Pakyong': {
      district: 'Pakyong',
      dtoName: 'Bikash Tamang',
      designation: 'District Tourism Officer (DTO)',
      office: 'District Tourism Office, Pakyong Circle – 737106',
      phone: '03592-257801',
      email: 'dto-pakyong@sikkimtourism.gov.in'
    },
    'Soreng': {
      district: 'Soreng',
      dtoName: 'Dawa Tshering Lepcha',
      designation: 'District Tourism Officer (DTO)',
      office: 'District Tourism Office, Soreng Circle – 737121',
      phone: '03595-253301',
      email: 'dto-soreng@sikkimtourism.gov.in'
    }
  };

  const HQ_OFFICER = {
    name: 'Dr. Tshering Yangchen Lepcha',
    designation: 'Additional Secretary (Tourism) & HQ Administrator',
    office: 'Headquarters, Paryatan Bhawan, Tadong, Gangtok – 737102',
    phone: '03592-209090 / 1800-345-3256',
    email: 'secy-tourism@sikkim.gov.in'
  };

  // 20 Authoritative Seed Applications strictly partitioned between Flow A (HQ Approval) and Flow B (Direct DTO Approval)
  const SEED_APPLICATIONS = [
    // -------------------------------------------------------------
    // SECTION 15.1: DTO DASHBOARD APPLICATIONS
    // -------------------------------------------------------------
    
    // 1. Drone – Newly submitted, awaiting DTO verification (Flow A)
    {
      refNo: 'SK-TP-2026-APP-00621',
      flowType: 'flow_a',
      flowTitle: 'Flow A: Drone Filming (Requires HQ Approval)',
      category: 'Drone',
      categoryKey: 'drone',
      customCategoryName: '',
      district: 'Gangtok',
      dtoOffice: 'District Tourism Office, Gangtok Circle, M.G. Marg, Gangtok – 737101',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_2,
      currentStageNum: 2,
      assignedRole: 'dto',
      applicantName: 'Sonam Tobgay Bhutia',
      phone: '9800778899',
      email: 'sonam.bhutia.drone@himalayafilms.in',
      address: 'Deorali Bazar, Near Ropeway Station, Gangtok – 737102',
      activityTitle: 'Aerial Cinematography of Teesta River & Tsomgo Lake Corridor',
      activityDescription: 'Commercial documentary aerial filming of Teesta river basin and Tsomgo lake corridor using DJI Inspire 3 (UIN registered). Flight plan strictly below 400ft AGL outside prohibited defence perimeter.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-62101',
      submissionDate: '02 Nov 2026, 09:30 AM',
      lastUpdated: '02 Nov 2026, 09:30 AM',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_621_1', name: 'DGCA Drone Pilot Certificate & UIN Registration', fileName: 'DGCA_UIN_Registration_Inspire3.pdf', size: '1.2 MB', date: '02 Nov 2026' },
        { id: 'doc_621_2', name: 'Flight Coordinate Map & Aerial Route Schedule', fileName: 'Teesta_Tsomgo_Flight_Plan.pdf', size: '2.4 MB', date: '02 Nov 2026' },
        { id: 'doc_621_3', name: 'Third-Party Aviation Insurance Coverage', fileName: 'Aviation_Insurance_Policy.pdf', size: '940 KB', date: '02 Nov 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: null },
      approvalSheet: null,
      dtoRemarks: null,
      hqRemarks: null,
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Sonam Tobgay Bhutia',
          office: 'Applicant Portal',
          date: '02 Nov 2026, 09:30 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Application submitted online along with payment of ₹100 via Sikkim GO Gateway.'
        }
      ]
    },

    // 2. Events / Marathon – Newly submitted, awaiting DTO verification (Flow A)
    {
      refNo: 'SK-TP-2026-APP-00635',
      flowType: 'flow_a',
      flowTitle: 'Flow A: Cultural Event & Marathon (Requires HQ Approval)',
      category: 'Events, Fairs, Melas, Rallies and Marathons',
      categoryKey: 'events',
      customCategoryName: '',
      district: 'Gangtok',
      dtoOffice: 'District Tourism Office, Gangtok Circle, M.G. Marg, Gangtok – 737101',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_2,
      currentStageNum: 2,
      assignedRole: 'dto',
      applicantName: 'Karma Tshering Lepcha',
      phone: '9812345678',
      email: 'karma.lepcha@sikkimmarathon.org',
      address: 'Development Area, Gangtok, Sikkim - 737101',
      activityTitle: 'Sikkim Winter Cultural Marathon & Peace Rally 2026',
      activityDescription: 'Annual 21km high-altitude marathon from Paljor Stadium to Rumtek Viewpoint with 450 registered national and international runners. Medical ambulances, water stations, and waste collection marshals deployed along approved road corridor.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-90432',
      submissionDate: '02 Nov 2026, 11:15 AM',
      lastUpdated: '02 Nov 2026, 11:15 AM',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_635_1', name: 'Comprehensive Event Layout & Route Blueprint', fileName: 'Winter_Marathon_Route_Layout.pdf', size: '3.1 MB', date: '02 Nov 2026' },
        { id: 'doc_635_2', name: 'District Police Traffic Clearance & Marshalling Plan', fileName: 'Traffic_Superintendent_NOC.pdf', size: '1.1 MB', date: '02 Nov 2026' },
        { id: 'doc_635_3', name: 'Chief Medical Officer Emergency Medical Support Plan', fileName: 'STNM_Hospital_Ambulance_Clearance.pdf', size: '780 KB', date: '02 Nov 2026' },
        { id: 'doc_635_4', name: 'State Fire & Emergency Services NOC', fileName: 'Fire_Safety_Station_Clearance.pdf', size: '640 KB', date: '02 Nov 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: null },
      approvalSheet: null,
      dtoRemarks: null,
      hqRemarks: null,
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Karma Tshering Lepcha',
          office: 'Applicant Portal',
          date: '02 Nov 2026, 11:15 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Application submitted online along with statutory fee payment of ₹100.'
        }
      ]
    },

    // 3. Trekking – Awaiting DTO verification (Flow B - Direct DTO Approval)
    {
      refNo: 'SK-TP-2026-APP-00481',
      flowType: 'flow_b',
      flowTitle: 'Flow B: Direct DTO Approval (Trekking)',
      category: 'Trekking',
      categoryKey: 'trekking',
      customCategoryName: '',
      district: 'Gangtok',
      dtoOffice: 'District Tourism Office, Gangtok Circle, M.G. Marg, Gangtok – 737101',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_2,
      currentStageNum: 2,
      assignedRole: 'dto',
      applicantName: 'Tenzing Norbu Lepcha',
      phone: '9800123456',
      email: 'tenzing.lepcha@example.in',
      address: 'Near Ridge Park, Below Raj Bhawan, Gangtok, Sikkim - 737101',
      activityTitle: 'Singalila Ridge Scenic Eco-Trek (8 Indian Trekkers)',
      activityDescription: 'Proposed 6-day eco-trekking expedition along the approved Singalila Ridge trail with certified local guides and 8 participants. Strict waste management protocols compliant with Forest Department guidelines will be maintained.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-90142',
      submissionDate: '01 Nov 2026, 10:30 AM',
      lastUpdated: '01 Nov 2026, 10:30 AM',
      requiresHqVerification: false,
      documents: [
        { id: 'doc_481_1', name: 'Route Map / Trail Itinerary', fileName: 'Singalila_Ridge_Trail_Route.pdf', size: '1.4 MB', date: '01 Nov 2026' },
        { id: 'doc_481_2', name: 'Leader Government ID Proof', fileName: 'Tenzing_Voter_ID.pdf', size: '820 KB', date: '01 Nov 2026' },
        { id: 'doc_481_3', name: 'Group Medical Fitness Certificates', fileName: 'Group_Medical_Certificates.pdf', size: '2.1 MB', date: '01 Nov 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: null },
      approvalSheet: null,
      dtoRemarks: null,
      hqRemarks: null,
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Tenzing Norbu Lepcha',
          office: 'Applicant Portal',
          date: '01 Nov 2026, 10:30 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Application submitted online along with payment of ₹100 via Sikkim GO Gateway.'
        }
      ]
    },

    // 4. Expedition – Awaiting DTO verification (Flow B - Direct DTO Approval)
    {
      refNo: 'SK-TP-2026-APP-00890',
      flowType: 'flow_b',
      flowTitle: 'Flow B: Direct DTO Approval (Expedition)',
      category: 'Expedition',
      categoryKey: 'expedition',
      customCategoryName: '',
      district: 'Gyalshing',
      dtoOffice: 'District Tourism Office, Gyalshing Circle, West Sikkim – 737111',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_2,
      currentStageNum: 2,
      assignedRole: 'dto',
      applicantName: 'Passang Dorjee Sherpa',
      phone: '9800334455',
      email: 'passang.sherpa@himalayanclimb.in',
      address: 'Yuksam Bazar, Near Norbugang Throne, West Sikkim - 737111',
      activityTitle: 'Mount Jopuno High-Altitude Alpine Expedition (6 Climbers)',
      activityDescription: 'Proposed 12-day alpine mountaineering expedition to Mt. Jopuno (5,936m). Certified IMF equipment, high-altitude sherpa team, satellite emergency beacons, and full eco-cleanup bond undertaken.',
      liaisonOfficer: 'Sikkim Police Mountaineering Liaison Officer Appointed',
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-90890',
      submissionDate: '01 Nov 2026, 04:00 PM',
      lastUpdated: '01 Nov 2026, 04:00 PM',
      requiresHqVerification: false,
      documents: [
        { id: 'doc_890_1', name: 'IMF Peak Booking Endorsement Letter', fileName: 'IMF_Jopuno_Peak_Sanction.pdf', size: '1.8 MB', date: '01 Nov 2026' },
        { id: 'doc_890_2', name: 'High-Altitude Mountaineering Insurance & Rescue Cover', fileName: 'Himalayan_Evac_Insurance_Group.pdf', size: '2.3 MB', date: '01 Nov 2026' },
        { id: 'doc_890_3', name: 'Yuksam Forest Division Wildlife Transit Permit', fileName: 'Yuksam_Forest_Division_Clearance.pdf', size: '920 KB', date: '01 Nov 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: null },
      approvalSheet: null,
      dtoRemarks: null,
      hqRemarks: null,
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Passang Dorjee Sherpa',
          office: 'Applicant Portal',
          date: '01 Nov 2026, 04:00 PM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Expedition permit requested with IMF sanction endorsement and insurance cover.'
        }
      ]
    },

    // 5. Adventure Activities – Awaiting DTO verification (Flow B - Direct DTO Approval)
    {
      refNo: 'SK-TP-2026-APP-00560',
      flowType: 'flow_b',
      flowTitle: 'Flow B: Direct DTO Approval (Adventure Activities)',
      category: 'Adventure Activities',
      categoryKey: 'adventure',
      customCategoryName: '',
      district: 'Mangan',
      dtoOffice: 'District Tourism Office, Mangan Circle, North Sikkim – 737116',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_2,
      currentStageNum: 2,
      assignedRole: 'dto',
      applicantName: 'Pemba Tenzing Bhutia',
      phone: '9800456789',
      email: 'pemba.bhutia@northadventure.in',
      address: 'Chungthang Road, Mangan, North Sikkim - 737116',
      activityTitle: 'Teesta River Grade IV White Water Kayaking & Camping',
      activityDescription: 'Season commercial whitewater kayaking operations covering Mangan-Singtam stretch. All international life jacket safety certifications and certified swift-water rescue operators on site.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-90560',
      submissionDate: '01 Nov 2026, 11:45 AM',
      lastUpdated: '01 Nov 2026, 11:45 AM',
      requiresHqVerification: false,
      documents: [
        { id: 'doc_560_1', name: 'River Safety Audit & Rescue Certification', fileName: 'Swiftwater_Rescue_Cert_2026.pdf', size: '1.2 MB', date: '01 Nov 2026' },
        { id: 'doc_560_2', name: 'Equipment Safety Inspection Clearance', fileName: 'Inflatable_Kayak_Inspect_Pass.pdf', size: '750 KB', date: '01 Nov 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: null },
      approvalSheet: null,
      dtoRemarks: null,
      hqRemarks: null,
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Pemba Tenzing Bhutia',
          office: 'Applicant Portal',
          date: '01 Nov 2026, 11:45 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Application submitted for seasonal river adventure operations.'
        }
      ]
    },

    // 6. Any Other – Awaiting DTO verification (Flow B - Direct DTO Approval)
    {
      refNo: 'SK-TP-2026-APP-00750',
      flowType: 'flow_b',
      flowTitle: 'Flow B: Direct DTO Approval (Any Other)',
      category: 'Any Other',
      categoryKey: 'other',
      customCategoryName: 'Scientific Botanical Research & Flora Documentation',
      district: 'Pakyong',
      dtoOffice: 'District Tourism Office, Pakyong Circle – 737106',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_2,
      currentStageNum: 2,
      assignedRole: 'dto',
      applicantName: 'Dr. Arvind Subba',
      phone: '9833445566',
      email: 'arvind.subba@himalayanflora.res.in',
      address: 'Rhenock Bazar, Pakyong District – 737133',
      activityTitle: 'Botanical & Rhododendron Research Documentation',
      activityDescription: 'Field scientific photography and non-destructive tissue sampling of high-altitude rare flora in Pakyong sub-alpine belts in collaboration with local community eco-guards.',
      liaisonOfficer: null,
      fee: 'Free',
      feeAmount: 0,
      isPaid: true,
      paymentStatus: 'EXEMPTED',
      paymentTxnRef: 'EXEMPT-GOV-RES-750',
      submissionDate: '01 Nov 2026, 02:20 PM',
      lastUpdated: '01 Nov 2026, 02:20 PM',
      requiresHqVerification: false,
      documents: [
        { id: 'doc_750_1', name: 'Academic Research Authorization Letter', fileName: 'University_Research_Mandate.pdf', size: '1.1 MB', date: '01 Nov 2026' },
        { id: 'doc_750_2', name: 'Institutional ID & Ethical Research Bond', fileName: 'Research_Fellow_Credential.pdf', size: '680 KB', date: '01 Nov 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: null },
      approvalSheet: null,
      dtoRemarks: null,
      hqRemarks: null,
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Dr. Arvind Subba',
          office: 'Applicant Portal',
          date: '01 Nov 2026, 02:20 PM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Application submitted under statutory academic research exemption.'
        }
      ]
    },

    // 7. Satellite Phone – Awaiting DTO verification (Flow B - Direct DTO Approval)
    {
      refNo: 'SK-TP-2026-APP-00950',
      flowType: 'flow_b',
      flowTitle: 'Flow B: Direct DTO Approval (Satellite Phone Usage)',
      category: 'Satellite Phone Usage Permission',
      categoryKey: 'satellite_phone',
      customCategoryName: '',
      district: 'Namchi',
      dtoOffice: 'District Tourism Office, Namchi Circle, South Sikkim – 737126',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_2,
      currentStageNum: 2,
      assignedRole: 'dto',
      applicantName: 'Colonel Rajesh Verma (Retd.)',
      phone: '9811223344',
      email: 'rajesh.verma@himalayaexp.org',
      address: 'Main Market, Namchi, South Sikkim - 737126',
      activityTitle: 'High-Altitude Emergency Satellite Communication System',
      activityDescription: 'Operational clearance for two Inmarsat IsatPhone 2 satellite terminals for alpine emergency communication during mountaineering safety drills along South Sikkim ridge trails.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-90950',
      submissionDate: '01 Nov 2026, 05:15 PM',
      lastUpdated: '01 Nov 2026, 05:15 PM',
      requiresHqVerification: false,
      documents: [
        { id: 'doc_950_1', name: 'DoT / Wireless Planning & Coordination (WPC) Import Licence', fileName: 'DoT_WPC_SatPhone_Licence_2026.pdf', size: '1.6 MB', date: '01 Nov 2026' },
        { id: 'doc_950_2', name: 'IMEI / IMSI Handset Registration Record', fileName: 'Inmarsat_IsatPhone2_IMEI_Manifest.pdf', size: '540 KB', date: '01 Nov 2026' },
        { id: 'doc_950_3', name: 'Ministry of Home Affairs Security Endorsement', fileName: 'MHA_Telecom_Clearance_Letter.pdf', size: '1.2 MB', date: '01 Nov 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: null },
      approvalSheet: null,
      dtoRemarks: null,
      hqRemarks: null,
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Colonel Rajesh Verma (Retd.)',
          office: 'Applicant Portal',
          date: '01 Nov 2026, 05:15 PM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Statutory satellite phone permit requested with valid DoT WPC licence and MHA security clearance.'
        }
      ]
    },

    // 8. Drone – Returned from HQ with Approval Sheet, awaiting DTO final approval (Flow A)
    {
      refNo: 'SK-TP-2026-APP-00625',
      flowType: 'flow_a',
      flowTitle: 'Flow A: Returned from HQ with Approval Sheet (Awaiting DTO Final Sanction)',
      category: 'Drone',
      categoryKey: 'drone',
      customCategoryName: '',
      district: 'Gangtok',
      dtoOffice: 'District Tourism Office, Gangtok Circle, M.G. Marg, Gangtok – 737101',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_11,
      currentStageNum: 11,
      assignedRole: 'dto',
      applicantName: 'Vikramjit Roy',
      phone: '9830112233',
      email: 'vikram.roy@bengalcinema.com',
      address: 'Tibet Road, Gangtok – 737101',
      activityTitle: 'Documentary Drone Filming – Rumtek Monastery & Surrounds',
      activityDescription: 'Feature documentary non-commercial drone photography over approved Buddhist monastery cultural circuits. DGCA micro drone category, fully cleared by Monastery Managing Committee.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-62501',
      submissionDate: '31 Oct 2026, 10:00 AM',
      lastUpdated: '03 Nov 2026, 03:30 PM',
      requiresHqVerification: true,
      dateReceivedAtHq: '01 Nov 2026',
      approvalSheet: {
        sheetNo: 'HQ/APP-SHEET/2026/00625',
        fileName: 'HQ_Approval_Sheet_SK-TP-2026-APP-00625.pdf',
        size: '1.4 MB',
        uploadDate: '03 Nov 2026',
        uploadedBy: 'Dr. Tshering Yangchen Lepcha',
        designation: 'Additional Secretary (Tourism) & HQ Administrator',
        office: 'Headquarters, Paryatan Bhawan, Tadong, Gangtok – 737102',
        eOfficeNumber: 'EOF-2026-SK-TOUR-6251',
        concurrenceRemarks: 'State Home, Police and Ecclesiastical Affairs clearance obtained and verified.'
      },
      hqApprovalStatus: 'Approved',
      hqApprovalDate: '03 Nov 2026, 03:30 PM',
      hqApprovedBy: 'Dr. Tshering Yangchen Lepcha',
      documents: [
        { id: 'doc_625_1', name: 'DGCA Drone Registration & UIN Certificate', fileName: 'DGCA_UIN_Rumtek_Docu.pdf', size: '1.3 MB', date: '31 Oct 2026' },
        { id: 'doc_625_2', name: 'Ecclesiastical Affairs Department NOC', fileName: 'Ecclesiastical_Dept_Rumtek_NOC.pdf', size: '1.1 MB', date: '31 Oct 2026' },
        { id: 'doc_625_3', name: 'HQ Departmental Approval Sheet', fileName: 'HQ_Approval_Sheet_SK-TP-2026-APP-00625.pdf', size: '1.4 MB', date: '03 Nov 2026' }
      ],
      hqVerification: { verified: true, verifiedDate: '03 Nov 2026', eOfficeFileNo: 'EOF-2026-SK-TOUR-6251', remarks: 'Inter-departmental security concurrence cleared under e-Office note sheet #24.' },
      dtoRemarks: null,
      hqRemarks: 'Headquarters verification complete. Sanction sheet attached. Transmitted back to concerned DTO for final approval and issuance.',
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Vikramjit Roy',
          office: 'Applicant Portal',
          date: '31 Oct 2026, 10:00 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Application submitted online.'
        },
        {
          action: 'Forwarded to HQ Admin',
          role: 'District Tourism Officer (DTO)',
          officer: 'Karma Lhendup Bhutia',
          office: 'District Tourism Office, Gangtok Circle',
          date: '01 Nov 2026, 02:15 PM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_3,
          remarks: 'Initial district verification completed. Forwarded to Headquarters for inter-departmental security concurrence.'
        },
        {
          action: 'Headquarters Approval Sheet Attached',
          role: 'Headquarters Administrator (HQ)',
          officer: 'Dr. Tshering Yangchen Lepcha',
          office: 'Headquarters, Paryatan Bhawan, Gangtok',
          date: '03 Nov 2026, 03:15 PM',
          previousStage: STAGES.STAGE_9,
          newStage: STAGES.STAGE_10,
          remarks: 'Official signed sanction sheet [HQ_Approval_Sheet_SK-TP-2026-APP-00625.pdf] uploaded.'
        },
        {
          action: 'Approved at HQ Level',
          role: 'Headquarters Administrator (HQ)',
          officer: 'Dr. Tshering Yangchen Lepcha',
          office: 'Headquarters, Paryatan Bhawan, Gangtok',
          date: '03 Nov 2026, 03:30 PM',
          previousStage: STAGES.STAGE_10,
          newStage: STAGES.STAGE_11,
          remarks: 'Application verified and approved at Headquarters level. Sanction sheet attached. Transmitted to DTO for final approval and Approval Letter issuance.'
        }
      ]
    },

    // 9. Events – Returned from HQ with Approval Sheet, awaiting DTO final approval (Flow A)
    {
      refNo: 'SK-TP-2026-APP-00638',
      flowType: 'flow_a',
      flowTitle: 'Flow A: Returned from HQ with Approval Sheet (Awaiting DTO Final Sanction)',
      category: 'Events, Fairs, Melas, Rallies and Marathons',
      categoryKey: 'events',
      customCategoryName: '',
      district: 'Gangtok',
      dtoOffice: 'District Tourism Office, Gangtok Circle, M.G. Marg, Gangtok – 737101',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_11,
      currentStageNum: 11,
      assignedRole: 'dto',
      applicantName: 'Phurba Wangchuk Lepcha',
      phone: '9800889900',
      email: 'phurba.lepcha@ecofair.in',
      address: 'Tathangchen, Gangtok, Sikkim – 737101',
      activityTitle: 'Kanchendzonga Eco-Tourism Fair & Cultural Festival',
      activityDescription: 'Three-day state eco-tourism promotional fair featuring traditional handicraft pavilions, organic culinary stalls, and indigenous acoustic folk performances at Saramsa Garden.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-63801',
      submissionDate: '30 Oct 2026, 11:30 AM',
      lastUpdated: '03 Nov 2026, 04:15 PM',
      requiresHqVerification: true,
      dateReceivedAtHq: '01 Nov 2026',
      approvalSheet: {
        sheetNo: 'HQ/APP-SHEET/2026/00638',
        fileName: 'HQ_Approval_Sheet_SK-TP-2026-APP-00638.pdf',
        size: '1.6 MB',
        uploadDate: '03 Nov 2026',
        uploadedBy: 'Dr. Tshering Yangchen Lepcha',
        designation: 'Additional Secretary (Tourism) & HQ Administrator',
        office: 'Headquarters, Paryatan Bhawan, Tadong, Gangtok – 737102',
        eOfficeNumber: 'EOF-2026-SK-TOUR-6384',
        concurrenceRemarks: 'State Police, Fire & Emergency, Health, and District Administration clearances obtained.'
      },
      hqApprovalStatus: 'Approved',
      hqApprovalDate: '03 Nov 2026, 04:15 PM',
      hqApprovedBy: 'Dr. Tshering Yangchen Lepcha',
      documents: [
        { id: 'doc_638_1', name: 'Saramsa Garden Event Zoning & Safety Blueprint', fileName: 'Saramsa_Zoning_Map.pdf', size: '2.8 MB', date: '30 Oct 2026' },
        { id: 'doc_638_2', name: 'Comprehensive Multi-Agency NOC Pack', fileName: 'Multi_Agency_NOC_Pakyong_District.pdf', size: '3.4 MB', date: '30 Oct 2026' },
        { id: 'doc_638_3', name: 'HQ Departmental Approval Sheet', fileName: 'HQ_Approval_Sheet_SK-TP-2026-APP-00638.pdf', size: '1.6 MB', date: '03 Nov 2026' }
      ],
      hqVerification: { verified: true, verifiedDate: '03 Nov 2026', eOfficeFileNo: 'EOF-2026-SK-TOUR-6384', remarks: 'Inter-departmental clearance obtained.' },
      dtoRemarks: null,
      hqRemarks: 'Headquarters verification complete. Sanction sheet attached. Transmitted back to concerned DTO for final approval and issuance.',
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Phurba Wangchuk Lepcha',
          office: 'Applicant Portal',
          date: '30 Oct 2026, 11:30 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Application submitted online.'
        },
        {
          action: 'Forwarded to HQ Admin',
          role: 'District Tourism Officer (DTO)',
          officer: 'Karma Lhendup Bhutia',
          office: 'District Tourism Office, Gangtok Circle',
          date: '01 Nov 2026, 03:00 PM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_3,
          remarks: 'Application forwarded to Headquarters for state-level review.'
        },
        {
          action: 'Approved at HQ Level',
          role: 'Headquarters Administrator (HQ)',
          officer: 'Dr. Tshering Yangchen Lepcha',
          office: 'Headquarters, Paryatan Bhawan, Gangtok',
          date: '03 Nov 2026, 04:15 PM',
          previousStage: STAGES.STAGE_10,
          newStage: STAGES.STAGE_11,
          remarks: 'Approved at HQ level with signed approval sheet attached.'
        }
      ]
    },

    // 10. Trekking – Approved, with Approval Letter available (Section 15.3 Completed Flow B Demo)
    {
      refNo: 'SK-TP-2026-APP-00215',
      flowType: 'flow_b',
      flowTitle: 'Flow B: Direct DTO Approval (Completed Demonstration)',
      category: 'Trekking',
      categoryKey: 'trekking',
      customCategoryName: '',
      district: 'Gangtok',
      dtoOffice: 'District Tourism Office, Gangtok Circle, M.G. Marg, Gangtok – 737101',
      status: STATUSES.APPROVED,
      currentStage: STAGES.STAGE_12,
      currentStageNum: 12,
      assignedRole: 'none',
      applicantName: 'Tshering Dorjee Bhutia',
      phone: '9800667788',
      email: 'tshering.bhutia@kanchenjunga-treks.in',
      address: 'Below Enchey Monastery, Gangtok, Sikkim - 737101',
      activityTitle: 'Dzongri – Goecha La High Mountain Trek (12 Trekkers)',
      activityDescription: 'High-altitude 9-day trekking expedition to Goecha La Viewpoint 1 (4,940m). 12 domestic trekkers with certified local mountain guides, porters, and mountain rescue team in place.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-89102',
      permissionNumber: 'SK-TOUR-2026-TREK-00215',
      certRef: 'SK-TOUR-2026-TREK-00215',
      approvalDate: '28 Oct 2026',
      approvingOfficer: 'Karma Lhendup Bhutia',
      approvingDesignation: 'District Tourism Officer (DTO)',
      approvingOffice: 'District Tourism Office, Gangtok Circle, M.G. Marg, Gangtok – 737101',
      submissionDate: '25 Oct 2026, 09:15 AM',
      lastUpdated: '28 Oct 2026, 03:45 PM',
      requiresHqVerification: false,
      documents: [
        { id: 'doc_215_1', name: 'Yuksam-Dzongri-Goechala Forest Route Permit', fileName: 'Goechala_Forest_Permit_Pass.pdf', size: '2.1 MB', date: '25 Oct 2026' },
        { id: 'doc_215_2', name: 'Comprehensive Trekkers Medical Endorsements', fileName: 'Trekkers_Medical_Certificates_Batch12.pdf', size: '3.4 MB', date: '25 Oct 2026' },
        { id: 'doc_215_3', name: 'Official Tourism Permission Letter', fileName: 'Permission_Letter_SK-TOUR-2026-TREK-00215.pdf', size: '1.2 MB', date: '28 Oct 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: null },
      approvalSheet: null,
      dtoRemarks: 'District-level clearance granted directly under delegated authority for local tourism activities. Official permission letter issued.',
      hqRemarks: null,
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Tshering Dorjee Bhutia',
          office: 'Applicant Portal',
          date: '25 Oct 2026, 09:15 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Application submitted online along with payment of ₹100 via Sikkim GO Gateway.'
        },
        {
          action: 'Direct Approval Granted & Approval Letter Issued',
          role: 'District Tourism Officer (DTO)',
          officer: 'Karma Lhendup Bhutia',
          office: 'District Tourism Office, Gangtok Circle',
          date: '28 Oct 2026, 03:45 PM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_12,
          remarks: 'District-level review completed. Official permission letter SK-TOUR-2026-TREK-00215 issued directly.'
        }
      ]
    },

    // -------------------------------------------------------------
    // SECTION 15.2: HQ ADMIN DASHBOARD APPLICATIONS
    // -------------------------------------------------------------

    // 11. Drone – Newly forwarded by DTO, awaiting HQ review (Flow A)
    {
      refNo: 'SK-TP-2026-APP-00620',
      flowType: 'flow_a',
      flowTitle: 'Flow A: Newly Forwarded by DTO (Awaiting HQ Review)',
      category: 'Drone',
      categoryKey: 'drone',
      customCategoryName: '',
      district: 'Pakyong',
      dtoOffice: 'District Tourism Office, Pakyong Circle – 737106',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_3,
      currentStageNum: 3,
      assignedRole: 'hq',
      applicantName: 'Anandita Sen',
      phone: '9833557799',
      email: 'anandita.sen@natgeo-wild.com',
      address: 'Near Pakyong Airport Road, Pakyong – 737106',
      activityTitle: 'National Geographic Aerial Survey – East Sikkim Bio-Corridor',
      activityDescription: 'Professional wildlife cinematographic survey of high-altitude Himalayan bird nesting habitats in Pakyong bio-corridor using DGCA-certified micro drones.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-62001',
      submissionDate: '01 Nov 2026, 10:00 AM',
      lastUpdated: '02 Nov 2026, 11:30 AM',
      requiresHqVerification: true,
      dateReceivedAtHq: '02 Nov 2026',
      documents: [
        { id: 'doc_620_1', name: 'DGCA Commercial Operator Permit', fileName: 'DGCA_Commercial_Permit_NatGeo.pdf', size: '2.1 MB', date: '01 Nov 2026' },
        { id: 'doc_620_2', name: 'Pakyong Airport Air Traffic Control NOC', fileName: 'AAI_Pakyong_Airspace_Clearance.pdf', size: '1.4 MB', date: '01 Nov 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: null },
      approvalSheet: null,
      dtoRemarks: 'DTO Pakyong preliminary verification completed. Forwarded to Headquarters for state-level security concurrence.',
      hqRemarks: null,
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Anandita Sen',
          office: 'Applicant Portal',
          date: '01 Nov 2026, 10:00 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Application submitted online.'
        },
        {
          action: 'Forwarded to HQ Admin',
          role: 'District Tourism Officer (DTO)',
          officer: 'Bikash Tamang',
          office: 'District Tourism Office, Pakyong Circle',
          date: '02 Nov 2026, 11:30 AM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_3,
          remarks: 'Forwarded to Headquarters for state-level security clearance and Approval Sheet preparation.'
        }
      ]
    },

    // 12. Events / Marathon – Awaiting HQ review (Flow A)
    {
      refNo: 'SK-TP-2026-APP-00637',
      flowType: 'flow_a',
      flowTitle: 'Flow A: Under HQ Review (e-Office File Active)',
      category: 'Events, Fairs, Melas, Rallies and Marathons',
      categoryKey: 'events',
      customCategoryName: '',
      district: 'Gangtok',
      dtoOffice: 'District Tourism Office, Gangtok Circle, M.G. Marg, Gangtok – 737101',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_4,
      currentStageNum: 4,
      assignedRole: 'hq',
      applicantName: 'Dawa Tshering Bhutia',
      phone: '9800223344',
      email: 'dawa.bhutia@flowerfestival.in',
      address: 'Ridge Park, Above White Hall, Gangtok – 737101',
      activityTitle: 'Statewide International Flower & Rhododendron Exhibition 2026',
      activityDescription: 'Five-day international horticulture exhibition and floriculture tourism carnival. Expected 2,500 daily attendees, exotic orchid displays, and state cultural performance evening.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-63701',
      submissionDate: '30 Oct 2026, 03:00 PM',
      lastUpdated: '02 Nov 2026, 02:00 PM',
      requiresHqVerification: true,
      dateReceivedAtHq: '02 Nov 2026',
      documents: [
        { id: 'doc_637_1', name: 'White Hall Complex Venue Allotment Order', fileName: 'White_Hall_Allotment_Order.pdf', size: '1.9 MB', date: '30 Oct 2026' },
        { id: 'doc_637_2', name: 'District Disaster Management Authority Clearance', fileName: 'DDMA_Evacuation_Safety_Plan.pdf', size: '2.5 MB', date: '30 Oct 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: 'EOF-2026-SK-TOUR-6372', remarks: 'Under inter-departmental review in e-Office.' },
      approvalSheet: null,
      dtoRemarks: 'Forwarded to HQ for state floriculture festival clearance.',
      hqRemarks: null,
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Dawa Tshering Bhutia',
          office: 'Applicant Portal',
          date: '30 Oct 2026, 03:00 PM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Application submitted online.'
        },
        {
          action: 'Forwarded to HQ Admin',
          role: 'District Tourism Officer (DTO)',
          officer: 'Karma Lhendup Bhutia',
          office: 'District Tourism Office, Gangtok Circle',
          date: '01 Nov 2026, 11:00 AM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_3,
          remarks: 'Forwarded to Headquarters.'
        },
        {
          action: 'Headquarters Review Commenced',
          role: 'Headquarters Administrator (HQ)',
          officer: 'Dr. Tshering Yangchen Lepcha',
          office: 'Headquarters, Paryatan Bhawan, Gangtok',
          date: '02 Nov 2026, 02:00 PM',
          previousStage: STAGES.STAGE_3,
          newStage: STAGES.STAGE_4,
          remarks: 'Application opened for state-level inter-departmental verification and e-Office processing.'
        }
      ]
    },

    // 13. Drone – Awaiting Approval Sheet upload (Flow A)
    {
      refNo: 'SK-TP-2026-APP-00622',
      flowType: 'flow_a',
      flowTitle: 'Flow A: Awaiting HQ Approval Sheet Upload',
      category: 'Drone',
      categoryKey: 'drone',
      customCategoryName: '',
      district: 'Gangtok',
      dtoOffice: 'District Tourism Office, Gangtok Circle, M.G. Marg, Gangtok – 737101',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_9,
      currentStageNum: 9,
      assignedRole: 'hq',
      applicantName: 'Gautam Ghosh',
      phone: '9822446688',
      email: 'gautam.ghosh@agridrone.in',
      address: 'Syari, Below High Court, Gangtok – 737102',
      activityTitle: 'Survey of Sikkim Himalayan Organic Agricultural Terraces',
      activityDescription: 'Multispectral agricultural drone mapping over terraced paddy fields across East Sikkim. Zero payload hazardous items, low-altitude flights adhering strictly to organic mission protocols.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-62201',
      submissionDate: '30 Oct 2026, 09:00 AM',
      lastUpdated: '01 Nov 2026, 04:30 PM',
      requiresHqVerification: true,
      dateReceivedAtHq: '01 Nov 2026',
      documents: [
        { id: 'doc_622_1', name: 'Agriculture Department Endorsement Letter', fileName: 'Organic_Mission_Endorsement.pdf', size: '1.4 MB', date: '30 Oct 2026' },
        { id: 'doc_622_2', name: 'Drone Specs & Flight Coordinates Sheet', fileName: 'Drone_Mapping_Coordinates.pdf', size: '1.7 MB', date: '30 Oct 2026' }
      ],
      hqVerification: { verified: true, verifiedDate: '01 Nov 2026', eOfficeFileNo: 'EOF-2026-SK-TOUR-6229', remarks: 'Inter-departmental security concurrence obtained under e-Office note sheet #18.' },
      approvalSheet: null,
      dtoRemarks: 'Forwarded for state agricultural drone mapping clearance.',
      hqRemarks: 'e-Office concurrence recorded. Official approval sheet under preparation.',
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Gautam Ghosh',
          office: 'Applicant Portal',
          date: '30 Oct 2026, 09:00 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Application submitted online.'
        },
        {
          action: 'Forwarded to HQ Admin',
          role: 'District Tourism Officer (DTO)',
          officer: 'Karma Lhendup Bhutia',
          office: 'District Tourism Office, Gangtok Circle',
          date: '31 Oct 2026, 02:00 PM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_3,
          remarks: 'Forwarded to Headquarters.'
        },
        {
          action: 'e-Office Verification Recorded',
          role: 'Headquarters Administrator (HQ)',
          officer: 'Dr. Tshering Yangchen Lepcha',
          office: 'Headquarters, Paryatan Bhawan, Gangtok',
          date: '01 Nov 2026, 04:30 PM',
          previousStage: STAGES.STAGE_4,
          newStage: STAGES.STAGE_9,
          remarks: 'Concurrence recorded under e-Office File #EOF-2026-SK-TOUR-6229.'
        }
      ]
    },

    // 14. Events – Approval Sheet uploaded, awaiting HQ approval (Flow A)
    {
      refNo: 'SK-TP-2026-APP-00639',
      flowType: 'flow_a',
      flowTitle: 'Flow A: Approval Sheet Uploaded (Awaiting HQ Approval Action)',
      category: 'Events, Fairs, Melas, Rallies and Marathons',
      categoryKey: 'events',
      customCategoryName: '',
      district: 'Namchi',
      dtoOffice: 'District Tourism Office, Namchi Circle, South Sikkim – 737126',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_10,
      currentStageNum: 10,
      assignedRole: 'hq',
      applicantName: 'Santosh Pradhan',
      phone: '9832223344',
      email: 'santosh.pradhan@southfest.org',
      address: 'Central Park, Namchi – 737126',
      activityTitle: 'South Sikkim Traditional Folk Dance Mela & Handicrafts Expo',
      activityDescription: 'Two-day cultural congregation of indigenous folk dance troupes from 8 South Sikkim blocks. Food court, artisan stalls, and open cultural arena at Bhaichung Stadium precincts.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-63901',
      submissionDate: '29 Oct 2026, 11:00 AM',
      lastUpdated: '03 Nov 2026, 05:00 PM',
      requiresHqVerification: true,
      dateReceivedAtHq: '01 Nov 2026',
      approvalSheet: {
        sheetNo: 'HQ/APP-SHEET/2026/00639',
        fileName: 'HQ_Approval_Sheet_SK-TP-2026-APP-00639.pdf',
        size: '1.5 MB',
        uploadDate: '03 Nov 2026',
        uploadedBy: 'Dr. Tshering Yangchen Lepcha',
        designation: 'Additional Secretary (Tourism) & HQ Administrator',
        office: 'Headquarters, Paryatan Bhawan, Tadong, Gangtok – 737102',
        eOfficeNumber: 'EOF-2026-SK-TOUR-6398',
        concurrenceRemarks: 'All inter-departmental security and public safety NOCs verified.'
      },
      hqApprovalStatus: 'Pending HQ Approval Action',
      documents: [
        { id: 'doc_639_1', name: 'Bhaichung Stadium Arena Booking Slip', fileName: 'Stadium_Arena_Booking.pdf', size: '1.2 MB', date: '29 Oct 2026' },
        { id: 'doc_639_2', name: 'District Police Safety & Marshalling Plan', fileName: 'Police_Marshalling_NOC.pdf', size: '1.8 MB', date: '29 Oct 2026' },
        { id: 'doc_639_3', name: 'HQ Departmental Approval Sheet', fileName: 'HQ_Approval_Sheet_SK-TP-2026-APP-00639.pdf', size: '1.5 MB', date: '03 Nov 2026' }
      ],
      hqVerification: { verified: true, verifiedDate: '03 Nov 2026', eOfficeFileNo: 'EOF-2026-SK-TOUR-6398', remarks: 'Inter-departmental security concurrence cleared.' },
      dtoRemarks: 'Forwarded for state cultural festival clearance.',
      hqRemarks: 'Signed sanction sheet uploaded. Awaiting final HQ-level approval click.',
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Santosh Pradhan',
          office: 'Applicant Portal',
          date: '29 Oct 2026, 11:00 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Application submitted online.'
        },
        {
          action: 'Forwarded to HQ Admin',
          role: 'District Tourism Officer (DTO)',
          officer: 'Pema Wangchuk Sherpa',
          office: 'District Tourism Office, Namchi Circle',
          date: '31 Oct 2026, 03:00 PM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_3,
          remarks: 'Forwarded to Headquarters.'
        },
        {
          action: 'Headquarters Approval Sheet Attached',
          role: 'Headquarters Administrator (HQ)',
          officer: 'Dr. Tshering Yangchen Lepcha',
          office: 'Headquarters, Paryatan Bhawan, Gangtok',
          date: '03 Nov 2026, 05:00 PM',
          previousStage: STAGES.STAGE_9,
          newStage: STAGES.STAGE_10,
          remarks: 'Official signed sanction sheet [HQ_Approval_Sheet_SK-TP-2026-APP-00639.pdf] uploaded.'
        }
      ]
    },

    // -------------------------------------------------------------
    // SECTION 15.3: COMPLETED WORKFLOW DEMONSTRATIONS & VARIANTS
    // -------------------------------------------------------------

    // 15. Drone – Completed HQ Path (Section 15.3 Completed Flow A Demo)
    {
      refNo: 'SK-TP-2026-APP-00628',
      flowType: 'flow_a',
      flowTitle: 'Flow A: Completed Demonstration (Citizen → DTO → HQ → DTO → Citizen)',
      category: 'Drone',
      categoryKey: 'drone',
      customCategoryName: '',
      district: 'Gangtok',
      dtoOffice: 'District Tourism Office, Gangtok Circle, M.G. Marg, Gangtok – 737101',
      status: STATUSES.APPROVED,
      currentStage: STAGES.STAGE_12,
      currentStageNum: 12,
      assignedRole: 'none',
      applicantName: 'Arjun Rampal Sharma',
      phone: '9811445566',
      email: 'arjun.sharma@aerialhimalaya.com',
      address: 'Development Area, Gangtok – 737101',
      activityTitle: 'Tourism Promotional Aerial Cinematography – Gangtok to Nathula',
      activityDescription: 'Official promotional cinematography for Sikkim Tourism publicity campaign covering Gangtok, Tsomgo, and Baba Mandir corridor with DGCA category-A drone.',
      liaisonOfficer: 'Sikkim Tourism Senior Information Officer Deputed',
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-62801',
      permissionNumber: 'SK-TOUR-2026-DRO-00628',
      certRef: 'SK-TOUR-2026-DRO-00628',
      approvalDate: '29 Oct 2026',
      approvingOfficer: 'Karma Lhendup Bhutia',
      approvingDesignation: 'District Tourism Officer (DTO)',
      approvingOffice: 'District Tourism Office, Gangtok Circle, M.G. Marg, Gangtok – 737101',
      submissionDate: '22 Oct 2026, 10:00 AM',
      lastUpdated: '29 Oct 2026, 04:30 PM',
      requiresHqVerification: true,
      dateReceivedAtHq: '24 Oct 2026',
      approvalSheet: {
        sheetNo: 'HQ/APP-SHEET/2026/00628',
        fileName: 'HQ_Approval_Sheet_SK-TP-2026-APP-00628.pdf',
        size: '1.4 MB',
        uploadDate: '27 Oct 2026',
        uploadedBy: 'Dr. Tshering Yangchen Lepcha',
        designation: 'Additional Secretary (Tourism) & HQ Administrator',
        office: 'Headquarters, Paryatan Bhawan, Tadong, Gangtok – 737102',
        eOfficeNumber: 'EOF-2026-SK-TOUR-6288',
        concurrenceRemarks: 'Special border corridor aerial security clearance granted by State Home Department.'
      },
      hqApprovalStatus: 'Approved',
      hqApprovalDate: '27 Oct 2026, 02:40 PM',
      hqApprovedBy: 'Dr. Tshering Yangchen Lepcha',
      documents: [
        { id: 'doc_628_1', name: 'DGCA Commercial UIN & Pilot Licence', fileName: 'DGCA_UIN_Sharma_Commercial.pdf', size: '1.5 MB', date: '22 Oct 2026' },
        { id: 'doc_628_2', name: 'Ministry of Defence Border Airspace Clearance', fileName: 'MoD_Army_Eastern_Command_NOC.pdf', size: '2.4 MB', date: '22 Oct 2026' },
        { id: 'doc_628_3', name: 'HQ Departmental Approval Sheet', fileName: 'HQ_Approval_Sheet_SK-TP-2026-APP-00628.pdf', size: '1.4 MB', date: '27 Oct 2026' },
        { id: 'doc_628_4', name: 'Official Tourism Permission Letter', fileName: 'Permission_Letter_SK-TOUR-2026-DRO-00628.pdf', size: '1.1 MB', date: '29 Oct 2026' }
      ],
      hqVerification: { verified: true, verifiedDate: '27 Oct 2026', eOfficeFileNo: 'EOF-2026-SK-TOUR-6288', remarks: 'Inter-departmental clearance obtained.' },
      dtoRemarks: 'Final departmental approval granted following verification of all statutory requirements and HQ sanction sheet. Permission letter issued.',
      hqRemarks: 'Approved at HQ level and forwarded to DTO Gangtok for final issuance.',
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Arjun Rampal Sharma',
          office: 'Applicant Portal',
          date: '22 Oct 2026, 10:00 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Application submitted online along with payment of ₹100 via Sikkim GO Gateway.'
        },
        {
          action: 'Forwarded to HQ Admin',
          role: 'District Tourism Officer (DTO)',
          officer: 'Karma Lhendup Bhutia',
          office: 'District Tourism Office, Gangtok Circle',
          date: '24 Oct 2026, 11:30 AM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_3,
          remarks: 'Initial district verification completed. Application forwarded to Headquarters for state-level review and Approval Sheet issuance.'
        },
        {
          action: 'Approved at HQ Level',
          role: 'Headquarters Administrator (HQ)',
          officer: 'Dr. Tshering Yangchen Lepcha',
          office: 'Headquarters, Paryatan Bhawan, Gangtok',
          date: '27 Oct 2026, 02:40 PM',
          previousStage: STAGES.STAGE_10,
          newStage: STAGES.STAGE_11,
          remarks: 'Application verified and approved at Headquarters level. Sanction sheet attached. Transmitted to DTO for final approval and Approval Letter issuance.'
        },
        {
          action: 'Final Approval Granted & Approval Letter Issued',
          role: 'District Tourism Officer (DTO)',
          officer: 'Karma Lhendup Bhutia',
          office: 'District Tourism Office, Gangtok Circle',
          date: '29 Oct 2026, 04:30 PM',
          previousStage: STAGES.STAGE_11,
          newStage: STAGES.STAGE_12,
          remarks: 'Final departmental approval granted following verification of HQ sanction sheet. Permission letter SK-TOUR-2026-DRO-00628 issued.'
        }
      ]
    },

    // 16. Events – Returned to Citizen for Correction
    {
      refNo: 'SK-TP-2026-APP-00329',
      flowType: 'flow_a',
      flowTitle: 'Flow A: Returned to Citizen for Correction',
      category: 'Events, Fairs, Melas, Rallies and Marathons',
      categoryKey: 'events',
      customCategoryName: '',
      district: 'Namchi',
      dtoOffice: 'District Tourism Office, Namchi Circle, South Sikkim – 737126',
      status: STATUSES.RETURNED,
      currentStage: STAGES.STAGE_6,
      currentStageNum: 6,
      assignedRole: 'citizen',
      applicantName: 'Bikram Chettri',
      phone: '9800776655',
      email: 'bikram.chettri@namchifest.org',
      address: 'Near Central Park, Namchi, South Sikkim - 737126',
      activityTitle: 'Namchi Rock & Acoustic Folk Music Evening',
      activityDescription: 'Open-air musical performance with anticipated 600 attendees. Food and craft stalls along pedestrian zone.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-90329',
      submissionDate: '26 Oct 2026, 02:15 PM',
      lastUpdated: '28 Oct 2026, 04:45 PM',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_329_1', name: 'Venue Layout Diagram', fileName: 'Namchi_Central_Park_Layout.pdf', size: '1.2 MB', date: '26 Oct 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: null },
      approvalSheet: null,
      dtoRemarks: 'Mandatory State Fire & Emergency Services NOC and Police Sound Clearance are missing from application package. Please upload valid certificates and resubmit.',
      hqRemarks: null,
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Bikram Chettri',
          office: 'Applicant Portal',
          date: '26 Oct 2026, 02:15 PM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Application submitted online.'
        },
        {
          action: 'Returned to Citizen for Clarification',
          role: 'District Tourism Officer (DTO)',
          officer: 'Pema Wangchuk Sherpa',
          office: 'District Tourism Office, Namchi Circle',
          date: '28 Oct 2026, 04:45 PM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_6,
          remarks: 'Mandatory State Fire & Emergency Services NOC and Police Sound Clearance are missing. Please upload and resubmit.'
        }
      ]
    },

    // 17. Drone – Rejected with Ground Remarks
    {
      refNo: 'SK-TP-2026-APP-00712',
      flowType: 'flow_a',
      flowTitle: 'Flow A: Application Rejected on Statutory Grounds',
      category: 'Drone',
      categoryKey: 'drone',
      customCategoryName: '',
      district: 'Gangtok',
      dtoOffice: 'District Tourism Office, Gangtok Circle, M.G. Marg, Gangtok – 737101',
      status: STATUSES.REJECTED,
      currentStage: STAGES.STAGE_13,
      currentStageNum: 13,
      assignedRole: 'none',
      applicantName: 'Rohan Malhotra',
      phone: '9810998877',
      email: 'rohan.malhotra@skycam.in',
      address: 'Connaught Place, New Delhi – 110001 (Visiting Gangtok)',
      activityTitle: 'High-Definition Commercial Drone Filming over Nathula Border Zone',
      activityDescription: 'Proposed aerial cinematography directly over Nathula Pass and international border line for international commercial travel video series.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-90712',
      submissionDate: '24 Oct 2026, 03:30 PM',
      lastUpdated: '26 Oct 2026, 11:00 AM',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_712_1', name: 'Proposed Aerial Coordinates Sheet', fileName: 'Nathula_Aerial_Coordinates.pdf', size: '980 KB', date: '24 Oct 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: null },
      approvalSheet: null,
      dtoRemarks: 'Application rejected under Government of India DGCA Red Zone restrictions and Ministry of Home Affairs border security guidelines. Unmanned aerial vehicles strictly prohibited within 25km of international border.',
      hqRemarks: null,
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Rohan Malhotra',
          office: 'Applicant Portal',
          date: '24 Oct 2026, 03:30 PM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Application submitted online.'
        },
        {
          action: 'Application Formally Rejected',
          role: 'District Tourism Officer (DTO)',
          officer: 'Karma Lhendup Bhutia',
          office: 'District Tourism Office, Gangtok Circle',
          date: '26 Oct 2026, 11:00 AM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_13,
          remarks: 'Strict statutory prohibition under DGCA Red Zone border regulations.'
        }
      ]
    },

    // 18. Adventure Activities – Approved Direct DTO (Flow B)
    {
      refNo: 'SK-TP-2026-APP-00561',
      flowType: 'flow_b',
      flowTitle: 'Flow B: Direct DTO Approval (Approved Adventure Permit)',
      category: 'Adventure Activities',
      categoryKey: 'adventure',
      customCategoryName: '',
      district: 'Mangan',
      dtoOffice: 'District Tourism Office, Mangan Circle, North Sikkim – 737116',
      status: STATUSES.APPROVED,
      currentStage: STAGES.STAGE_12,
      currentStageNum: 12,
      assignedRole: 'none',
      applicantName: 'Kailash Gurung',
      phone: '9800771122',
      email: 'kailash.gurung@lachungsky.in',
      address: 'Lachung Valley, North Sikkim – 737120',
      activityTitle: 'Lachung Paragliding & Tandem Flight Expedition',
      activityDescription: 'Commercial tandem paragliding operations over designated launch sites in Lachung with certified tandem masters.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-56101',
      permissionNumber: 'SK-TOUR-2026-ADV-00561',
      certRef: 'SK-TOUR-2026-ADV-00561',
      approvalDate: '30 Oct 2026',
      approvingOfficer: 'Tenzing Dadul Lepcha',
      approvingDesignation: 'District Tourism Officer (DTO)',
      approvingOffice: 'District Tourism Office, Mangan Circle, North Sikkim – 737116',
      submissionDate: '27 Oct 2026, 10:45 AM',
      lastUpdated: '30 Oct 2026, 02:00 PM',
      requiresHqVerification: false,
      documents: [
        { id: 'doc_561_1', name: 'FAI Paragliding Pilot Licence', fileName: 'FAI_Tandem_Pilot_Licence.pdf', size: '1.4 MB', date: '27 Oct 2026' },
        { id: 'doc_561_2', name: 'Official Tourism Permission Letter', fileName: 'Permission_Letter_SK-TOUR-2026-ADV-00561.pdf', size: '1.2 MB', date: '30 Oct 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: null },
      approvalSheet: null,
      dtoRemarks: 'District-level clearance granted directly under delegated authority. Official permission letter issued.',
      hqRemarks: null,
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Kailash Gurung',
          office: 'Applicant Portal',
          date: '27 Oct 2026, 10:45 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Application submitted online.'
        },
        {
          action: 'Direct Approval Granted & Approval Letter Issued',
          role: 'District Tourism Officer (DTO)',
          officer: 'Tenzing Dadul Lepcha',
          office: 'District Tourism Office, Mangan Circle',
          date: '30 Oct 2026, 02:00 PM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_12,
          remarks: 'Direct approval granted. Permission letter SK-TOUR-2026-ADV-00561 issued.'
        }
      ]
    },

    // 19. Events – Approved HQ Path (Flow A)
    {
      refNo: 'SK-TP-2026-APP-00636',
      flowType: 'flow_a',
      flowTitle: 'Flow A: Approved HQ Sanction (Events)',
      category: 'Events, Fairs, Melas, Rallies and Marathons',
      categoryKey: 'events',
      customCategoryName: '',
      district: 'Pakyong',
      dtoOffice: 'District Tourism Office, Pakyong Circle – 737106',
      status: STATUSES.APPROVED,
      currentStage: STAGES.STAGE_12,
      currentStageNum: 12,
      assignedRole: 'none',
      applicantName: 'Devendra Tamang',
      phone: '9833887766',
      email: 'devendra.tamang@pakyongfest.in',
      address: 'Pakyong Bazar, Near DC Office, Pakyong – 737106',
      activityTitle: 'Pakyong Himalayan Orange Festival & Cultural Rally',
      activityDescription: 'Community agro-tourism festival highlighting indigenous Sikkim orange orchards, traditional village cuisine, and eco-heritage walk.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-63601',
      permissionNumber: 'SK-TOUR-2026-EVE-00636',
      certRef: 'SK-TOUR-2026-EVE-00636',
      approvalDate: '29 Oct 2026',
      approvingOfficer: 'Bikash Tamang',
      approvingDesignation: 'District Tourism Officer (DTO)',
      approvingOffice: 'District Tourism Office, Pakyong Circle – 737106',
      submissionDate: '23 Oct 2026, 11:00 AM',
      lastUpdated: '29 Oct 2026, 03:00 PM',
      requiresHqVerification: true,
      dateReceivedAtHq: '25 Oct 2026',
      approvalSheet: {
        sheetNo: 'HQ/APP-SHEET/2026/00636',
        fileName: 'HQ_Approval_Sheet_SK-TP-2026-APP-00636.pdf',
        size: '1.8 MB',
        uploadDate: '28 Oct 2026',
        uploadedBy: 'Dr. Tshering Yangchen Lepcha',
        designation: 'Additional Secretary (Tourism) & HQ Administrator',
        office: 'Headquarters, Paryatan Bhawan, Tadong, Gangtok – 737102',
        eOfficeNumber: 'EOF-2026-SK-TOUR-6362',
        concurrenceRemarks: 'Departmental clearance cleared under e-Office note sheet #31.'
      },
      hqApprovalStatus: 'Approved',
      hqApprovalDate: '28 Oct 2026, 03:00 PM',
      hqApprovedBy: 'Dr. Tshering Yangchen Lepcha',
      documents: [
        { id: 'doc_636_1', name: 'Pakyong Ground Allotment Slip', fileName: 'Pakyong_Festival_Ground.pdf', size: '1.6 MB', date: '23 Oct 2026' },
        { id: 'doc_636_2', name: 'HQ Departmental Approval Sheet', fileName: 'HQ_Approval_Sheet_SK-TP-2026-APP-00636.pdf', size: '1.8 MB', date: '28 Oct 2026' },
        { id: 'doc_636_3', name: 'Official Tourism Permission Letter', fileName: 'Permission_Letter_SK-TOUR-2026-EVE-00636.pdf', size: '1.2 MB', date: '29 Oct 2026' }
      ],
      hqVerification: { verified: true, verifiedDate: '28 Oct 2026', eOfficeFileNo: 'EOF-2026-SK-TOUR-6362', remarks: 'Inter-departmental clearance completed.' },
      dtoRemarks: 'Final departmental approval granted following verification of HQ sanction sheet. Permission letter issued.',
      hqRemarks: 'Approved at HQ level and transmitted to DTO Pakyong.',
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Devendra Tamang',
          office: 'Applicant Portal',
          date: '23 Oct 2026, 11:00 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Application submitted online.'
        },
        {
          action: 'Forwarded to HQ Admin',
          role: 'District Tourism Officer (DTO)',
          officer: 'Bikash Tamang',
          office: 'District Tourism Office, Pakyong Circle',
          date: '25 Oct 2026, 02:00 PM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_3,
          remarks: 'Forwarded to Headquarters.'
        },
        {
          action: 'Approved at HQ Level',
          role: 'Headquarters Administrator (HQ)',
          officer: 'Dr. Tshering Yangchen Lepcha',
          office: 'Headquarters, Paryatan Bhawan, Gangtok',
          date: '28 Oct 2026, 03:00 PM',
          previousStage: STAGES.STAGE_10,
          newStage: STAGES.STAGE_11,
          remarks: 'Approved at HQ level.'
        },
        {
          action: 'Final Approval Granted & Approval Letter Issued',
          role: 'District Tourism Officer (DTO)',
          officer: 'Bikash Tamang',
          office: 'District Tourism Office, Pakyong Circle',
          date: '29 Oct 2026, 03:00 PM',
          previousStage: STAGES.STAGE_11,
          newStage: STAGES.STAGE_12,
          remarks: 'Permission letter SK-TOUR-2026-EVE-00636 issued.'
        }
      ]
    },

    // 20. Trekking – Awaiting DTO Verification (Soreng Circle - Flow B)
    {
      refNo: 'SK-TP-2026-APP-00810',
      flowType: 'flow_b',
      flowTitle: 'Flow B: Direct DTO Approval (Soreng Circle)',
      category: 'Trekking',
      categoryKey: 'trekking',
      customCategoryName: '',
      district: 'Soreng',
      dtoOffice: 'District Tourism Office, Soreng Circle – 737121',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_2,
      currentStageNum: 2,
      assignedRole: 'dto',
      applicantName: 'Norden Lepcha',
      phone: '9832114455',
      email: 'norden.lepcha@barseytreks.in',
      address: 'Hilley Road, Soreng District – 737121',
      activityTitle: 'Barsey Rhododendron Sanctuary Eco-Trek (6 Trekkers)',
      activityDescription: '4-day educational biodiversity trek inside Barsey Sanctuary with certified local naturalist guides. Eco-waste management bond submitted to Soreng Forest Division.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-81001',
      submissionDate: '01 Nov 2026, 03:45 PM',
      lastUpdated: '01 Nov 2026, 03:45 PM',
      requiresHqVerification: false,
      documents: [
        { id: 'doc_810_1', name: 'Barsey Sanctuary Route Schedule & Guide ID', fileName: 'Barsey_Sanctuary_Itinerary.pdf', size: '1.2 MB', date: '01 Nov 2026' },
        { id: 'doc_810_2', name: 'Group Forest Department Entry Permit', fileName: 'Forest_Entry_Permit_Soreng.pdf', size: '1.5 MB', date: '01 Nov 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: null },
      approvalSheet: null,
      dtoRemarks: null,
      hqRemarks: null,
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Norden Lepcha',
          office: 'Applicant Portal',
          date: '01 Nov 2026, 03:45 PM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Application submitted online for Barsey trek.'
        }
      ]
    }
  ];

  // ==============================================================
  // CENTRAL WORKFLOW ENGINE & STATE MACHINE CONTROLLER
  // ==============================================================
  const WorkflowEngine = {
    STATUSES: STATUSES,
    STAGES: STAGES,
    DISTRICT_OFFICES: DISTRICT_OFFICES,
    HQ_OFFICER: HQ_OFFICER,

    // Core rule: Only Drone and Events require HQ approval. All other 5 categories follow Direct DTO Approval.
    isHqApprovalRequired: function (category) {
      if (!category) return false;
      const cat = category.toLowerCase();
      return cat.includes('drone') || cat.includes('event') || cat.includes('mela') || cat.includes('rall') || cat.includes('marathon');
    },

    // Initialize or retrieve applications from localStorage
    getAllApplications: function () {
      try {
        const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
        const raw = localStorage.getItem(STORAGE_KEY);
        
        // Auto-migrate if version is outdated or data is missing
        if (!raw || storedVersion !== CURRENT_SEED_VERSION) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_APPLICATIONS));
          localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_SEED_VERSION);
          return JSON.parse(JSON.stringify(SEED_APPLICATIONS));
        }

        let apps = JSON.parse(raw);

        // Check if citizen submissions exist in live session
        const rawCitizen = localStorage.getItem(SUBMITTED_STORAGE_KEY);
        if (rawCitizen) {
          const citizenSubs = JSON.parse(rawCitizen);
          if (Array.isArray(citizenSubs) && citizenSubs.length > 0) {
            citizenSubs.forEach(sub => {
              this.ingestCitizenSubmission(sub);
            });
            // Reload after potential ingestion
            apps = JSON.parse(localStorage.getItem(STORAGE_KEY));
          }
        }

        return apps;
      } catch (e) {
        console.error('WorkflowEngine: Error reading applications', e);
        return SEED_APPLICATIONS;
      }
    },

    saveAllApplications: function (apps) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
        localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_SEED_VERSION);
      } catch (e) {
        console.error('WorkflowEngine: Error persisting applications', e);
      }
    },

    resetToSeedData: function () {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_APPLICATIONS));
        localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_SEED_VERSION);
        return JSON.parse(JSON.stringify(SEED_APPLICATIONS));
      } catch (e) {
        console.error('WorkflowEngine: Error resetting seed data', e);
        return SEED_APPLICATIONS;
      }
    },

    getApplication: function (refNo) {
      const apps = this.getAllApplications();
      return apps.find(a => a.refNo === refNo) || null;
    },

    updateApplication: function (updatedApp) {
      const apps = this.getAllApplications();
      const idx = apps.findIndex(a => a.refNo === updatedApp.refNo);
      if (idx >= 0) {
        updatedApp.lastUpdated = new Date().toLocaleString('en-GB');
        apps[idx] = updatedApp;
      } else {
        apps.unshift(updatedApp);
      }
      this.saveAllApplications(apps);
      return updatedApp;
    },

    // Ingest new application submitted from citizen journey
    ingestCitizenSubmission: function (sub) {
      const existing = this.getApplication(sub.refNo);
      if (existing) return existing;

      const dist = sub.district || 'Gangtok';
      const distInfo = DISTRICT_OFFICES[dist] || DISTRICT_OFFICES['Gangtok'];
      const requiresHq = this.isHqApprovalRequired(sub.category || sub.categoryKey);

      const newApp = {
        refNo: sub.refNo,
        flowType: requiresHq ? 'flow_a' : 'flow_b',
        flowTitle: requiresHq ? 'Flow A: Requires HQ Approval' : 'Flow B: Direct DTO Approval',
        category: sub.category || 'Trekking',
        categoryKey: sub.categoryKey || 'trekking',
        customCategoryName: sub.customCategoryName || '',
        district: dist,
        dtoOffice: distInfo.office,
        status: STATUSES.SUBMITTED,
        currentStage: STAGES.STAGE_2,
        currentStageNum: 2,
        assignedRole: 'dto', // Immediately assigned to District DTO
        applicantName: sub.applicantName || 'Citizen Applicant',
        phone: sub.phone || '',
        email: sub.email || '',
        address: sub.address || '',
        activityTitle: sub.activityTitle || 'Permission Request',
        activityDescription: sub.activityDescription || sub.description || '',
        liaisonOfficer: sub.liaisonOfficer || null,
        fee: sub.fee || 'Free',
        feeAmount: sub.feeAmount || 0,
        isPaid: sub.isPaid || false,
        paymentStatus: sub.paymentStatus || 'PAID',
        paymentTxnRef: sub.paymentTxnRef || 'TXN-SK-2026-90142',
        submissionDate: sub.submissionDate || new Date().toLocaleString('en-GB'),
        lastUpdated: new Date().toLocaleString('en-GB'),
        requiresHqVerification: requiresHq,
        documents: sub.documents || [
          { id: 'doc_sub_1', name: 'Applicant Identity / Supporting NOC', fileName: 'Citizen_Upload.pdf', size: '1.2 MB', date: new Date().toLocaleDateString('en-GB') }
        ],
        hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: null },
        approvalSheet: null,
        dtoRemarks: null,
        hqRemarks: null,
        citizenRemarks: null,
        history: [
          {
            action: 'Application Submitted',
            role: 'Citizen',
            officer: sub.applicantName || 'Citizen Applicant',
            office: 'Applicant Portal',
            date: sub.submissionDate || new Date().toLocaleString('en-GB'),
            previousStage: 'New Submission',
            newStage: STAGES.STAGE_2,
            remarks: 'Application submitted via citizen online service portal.'
          }
        ]
      };

      const apps = this.getAllApplications();
      apps.unshift(newApp);
      this.saveAllApplications(apps);
      return newApp;
    },

    // Audit History Entry Helper
    addHistoryEntry: function (app, entry) {
      if (!app.history) app.history = [];
      app.history.push({
        action: entry.action,
        role: entry.role,
        officer: entry.officer,
        office: entry.office,
        date: entry.date || new Date().toLocaleString('en-GB'),
        previousStage: entry.previousStage,
        newStage: entry.newStage,
        remarks: entry.remarks || 'No remarks recorded.'
      });
    },

    // ==============================================================
    // WORKFLOW TRANSITION ACTIONS
    // ==============================================================

    // Action 1: DTO Forwards Application to HQ Admin (Flow A: Drone and Events Only)
    dtoVerifyAndForwardToHq: function (refNo, officerName, remarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      if (!this.isHqApprovalRequired(app.category)) {
        return { success: false, message: 'This application category does not require HQ approval and cannot be forwarded.' };
      }

      const oldStage = app.currentStage;
      app.status = STATUSES.SUBMITTED;
      app.currentStage = (oldStage === STAGES.STAGE_7) ? STAGES.STAGE_8 : STAGES.STAGE_3;
      app.currentStageNum = (oldStage === STAGES.STAGE_7) ? 8 : 3;
      app.assignedRole = 'hq'; // Transferred to HQ
      app.dateReceivedAtHq = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      app.dtoRemarks = remarks || 'Initial district verification completed. Application forwarded to Headquarters for state-level review and Approval Sheet issuance.';

      const officeInfo = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];

      this.addHistoryEntry(app, {
        action: 'Forwarded to HQ Admin',
        role: 'District Tourism Officer (DTO)',
        officer: officerName || officeInfo.dtoName,
        office: officeInfo.office,
        previousStage: oldStage,
        newStage: app.currentStage,
        remarks: app.dtoRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    // Action 2: Direct DTO Approval without HQ (Flow B: Trekking, Expedition, Adventure, Other, Sat Phone)
    dtoDirectApprove: function (refNo, officerName, remarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      if (this.isHqApprovalRequired(app.category)) {
        return { success: false, message: 'This category requires HQ approval and must be forwarded to HQ Admin first.' };
      }

      const oldStage = app.currentStage;
      app.status = STATUSES.APPROVED;
      app.currentStage = STAGES.STAGE_12;
      app.currentStageNum = 12;
      app.assignedRole = 'none';
      app.permissionNumber = app.permissionNumber || `SK-TOUR-2026-${(app.categoryKey || 'TP').toUpperCase().slice(0, 3)}-${app.refNo.split('-').pop()}`;
      app.certRef = app.permissionNumber;
      app.approvalDate = app.approvalDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const officeInfo = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      app.approvingOfficer = officerName || officeInfo.dtoName;
      app.approvingDesignation = officeInfo.designation || 'District Tourism Officer (DTO)';
      app.approvingOffice = officeInfo.office;
      app.dtoRemarks = remarks || 'District-level clearance granted directly under delegated authority for local tourism activities. Official permission letter issued.';

      this.addHistoryEntry(app, {
        action: 'Direct Approval Granted & Approval Letter Issued',
        role: 'District Tourism Officer (DTO)',
        officer: officerName || officeInfo.dtoName,
        office: officeInfo.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_12,
        remarks: app.dtoRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    // Action 3: DTO Returns Application to Citizen for Correction
    dtoReturnToCitizen: function (refNo, officerName, remarks) {
      if (!remarks || !remarks.trim()) {
        return { success: false, message: 'Mandatory return remarks explaining the required correction must be provided.' };
      }

      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const oldStage = app.currentStage;
      app.status = STATUSES.RETURNED;
      app.currentStage = STAGES.STAGE_6; // Awaiting Citizen Correction
      app.currentStageNum = 6;
      app.assignedRole = 'citizen';
      app.dtoRemarks = remarks.trim();

      const officeInfo = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];

      this.addHistoryEntry(app, {
        action: 'Returned to Citizen for Clarification',
        role: 'District Tourism Officer (DTO)',
        officer: officerName || officeInfo.dtoName,
        office: officeInfo.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_6,
        remarks: app.dtoRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    // Action 4: DTO Rejects Application
    dtoRejectApplication: function (refNo, officerName, remarks) {
      if (!remarks || !remarks.trim()) {
        return { success: false, message: 'Mandatory rejection remarks explaining the departmental justification must be provided.' };
      }

      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const oldStage = app.currentStage;
      app.status = STATUSES.REJECTED;
      app.currentStage = STAGES.STAGE_13;
      app.currentStageNum = 13;
      app.assignedRole = 'none';
      app.dtoRemarks = remarks.trim();

      const officeInfo = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];

      this.addHistoryEntry(app, {
        action: 'Application Formally Rejected',
        role: 'District Tourism Officer (DTO)',
        officer: officerName || officeInfo.dtoName,
        office: officeInfo.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_13,
        remarks: app.dtoRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    // Action 4b: DTO Reassigns Departmental Liaison Officer (Expedition Category Specific)
    changeLiaisonOfficer: function (refNo, officerName, newLoName, changeRemarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };
      if (app.categoryKey !== 'expedition') {
        return { success: false, message: 'Liaison Officer reassignment is only applicable to the Expedition category.' };
      }
      if (!newLoName || !newLoName.trim()) {
        return { success: false, message: 'Please select or provide a valid Liaison Officer name.' };
      }
      if (!changeRemarks || !changeRemarks.trim()) {
        return { success: false, message: 'Please provide official remarks explaining the reason for changing the Liaison Officer.' };
      }

      const oldLo = app.liaisonOfficer || 'Not Assigned';
      const updatedLo = newLoName.trim();
      const cleanRemarks = changeRemarks.trim();

      const officeInfo = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'] || {};
      const actingOfficer = officerName || officeInfo.dtoName || 'District Tourism Officer (DTO)';

      app.liaisonOfficer = updatedLo;
      app.loChangeRemarks = cleanRemarks;
      app.loChangedBy = actingOfficer;

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      app.loChangeDate = `${dateStr}, ${timeStr}`;
      app.lastUpdated = `${dateStr}, ${timeStr}`;

      this.addHistoryEntry(app, {
        action: 'Liaison Officer Reassigned',
        role: 'District Tourism Officer (DTO)',
        officer: actingOfficer,
        office: app.dtoOffice || officeInfo.office || 'District Tourism Office',
        previousStage: app.currentStage,
        newStage: app.currentStage,
        remarks: `Liaison Officer changed from "${oldLo}" to "${updatedLo}". Reason / Remarks: "${cleanRemarks}"`
      });

      this.updateApplication(app);
      return { success: true, message: `Liaison Officer successfully reassigned to "${updatedLo}".`, application: app };
    },

    // Action 5: HQ Starts Application Review
    hqStartReview: function (refNo, officerName) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const oldStage = app.currentStage;
      app.status = STATUSES.SUBMITTED;
      app.currentStage = STAGES.STAGE_4; // Under HQ Review
      app.currentStageNum = 4;
      app.assignedRole = 'hq';

      this.addHistoryEntry(app, {
        action: 'Headquarters Review Commenced',
        role: 'Headquarters Administrator (HQ)',
        officer: officerName || HQ_OFFICER.name,
        office: HQ_OFFICER.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_4,
        remarks: 'Application opened for state-level inter-departmental verification and e-Office processing.'
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    // Action 6: HQ Records External e-Office Concurrence
    hqRecordEOfficeVerification: function (refNo, officerName, eOfficeFileNo, remarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const oldStage = app.currentStage;
      app.status = STATUSES.SUBMITTED;
      app.currentStage = STAGES.STAGE_9; // Awaiting HQ Approval Sheet
      app.currentStageNum = 9;
      app.assignedRole = 'hq';

      const fileRef = eOfficeFileNo || `EOF-2026-SK-TOUR-${Math.floor(1000 + Math.random() * 9000)}`;
      app.eOfficeNumber = fileRef;
      app.hqVerification = {
        verified: true,
        verifiedDate: new Date().toLocaleDateString('en-GB'),
        eOfficeFileNo: fileRef,
        remarks: remarks || 'Inter-departmental clearance obtained from Home, Forest, and Police departments.'
      };

      this.addHistoryEntry(app, {
        action: 'e-Office Verification Recorded',
        role: 'Headquarters Administrator (HQ)',
        officer: officerName || HQ_OFFICER.name,
        office: HQ_OFFICER.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_9,
        remarks: `Concurrence recorded under e-Office File #${fileRef}: ${app.hqVerification.remarks}`
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    // Action 7: HQ Uploads Official Approval Sheet
    hqUploadApprovalSheet: function (refNo, officerName, fileName, fileSize, sheetNo) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const oldStage = app.currentStage;
      const sheetName = fileName || `HQ_Approval_Sheet_${refNo}.pdf`;
      const sNo = sheetNo || `HQ/APP-SHEET/2026/${refNo.split('-').pop()}`;
      app.approvalSheet = {
        sheetNo: sNo,
        fileName: sheetName,
        size: fileSize || '1.4 MB',
        uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        uploadedBy: officerName || HQ_OFFICER.name,
        designation: 'Additional Secretary (Tourism) & HQ Administrator',
        office: HQ_OFFICER.office,
        eOfficeNumber: app.eOfficeNumber || `EOF-2026-SK-TOUR-${refNo.split('-').pop()}`,
        concurrenceRemarks: app.hqRemarks || 'Inter-departmental security concurrence cleared under e-Office note sheet.'
      };

      app.status = STATUSES.SUBMITTED;
      app.currentStage = STAGES.STAGE_10; // Approval Sheet Uploaded
      app.currentStageNum = 10;
      app.assignedRole = 'hq';

      this.addHistoryEntry(app, {
        action: 'Headquarters Approval Sheet Attached',
        role: 'Headquarters Administrator (HQ)',
        officer: officerName || HQ_OFFICER.name,
        office: HQ_OFFICER.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_10,
        remarks: `Official signed sanction sheet [${sheetName}] uploaded and attached to application record.`
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    // Action 8: HQ Approves at HQ Level & Transmits Back to DTO (Section 9.7)
    hqApproveAtHqLevel: function (refNo, officerName, remarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      if (!app.approvalSheet) {
        return { success: false, message: 'Mandatory HQ Approval Sheet must be uploaded before granting HQ-level approval.' };
      }

      const oldStage = app.currentStage;
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      app.hqApprovalStatus = 'Approved';
      app.hqApprovalDate = `${dateStr}, ${timeStr}`;
      app.hqApprovedBy = officerName || HQ_OFFICER.name;
      app.status = STATUSES.SUBMITTED;
      app.currentStage = STAGES.STAGE_11; // Awaiting Final DTO Approval
      app.currentStageNum = 11;
      app.assignedRole = 'dto'; // Returns to original DTO for final approval and issuance
      app.hqRemarks = remarks || 'Application verified and approved at Headquarters level. Sanction sheet attached. Transmitted to DTO for final approval and Approval Letter issuance.';

      this.addHistoryEntry(app, {
        action: 'Approved at HQ Level',
        role: 'Headquarters Administrator (HQ)',
        officer: officerName || HQ_OFFICER.name,
        office: HQ_OFFICER.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_11,
        remarks: app.hqRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    // Alias for backward compatibility
    hqForwardBackToDto: function (refNo, officerName, remarks) {
      return this.hqApproveAtHqLevel(refNo, officerName, remarks);
    },

    // Action 9: HQ Returns Application to DTO for Correction
    hqReturnToDto: function (refNo, officerName, remarks) {
      if (!remarks || !remarks.trim()) {
        return { success: false, message: 'Mandatory HQ remarks explaining the objection/defect must be provided.' };
      }

      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const oldStage = app.currentStage;
      app.status = STATUSES.SUBMITTED;
      app.currentStage = STAGES.STAGE_5; // Returned by HQ to DTO
      app.currentStageNum = 5;
      app.assignedRole = 'dto'; // Returns to DTO, NOT directly to citizen!
      app.hqRemarks = remarks.trim();

      this.addHistoryEntry(app, {
        action: 'Returned by HQ to DTO',
        role: 'Headquarters Administrator (HQ)',
        officer: officerName || HQ_OFFICER.name,
        office: HQ_OFFICER.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_5,
        remarks: app.hqRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    // Action 10: Final DTO Approval & Permission Letter Issuance (Section 9.9)
    dtoFinalApproval: function (refNo, officerName, remarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      // Verify that if HQ verification was required, approval sheet is present
      if (this.isHqApprovalRequired(app.category) && !app.approvalSheet) {
        return { success: false, message: 'Cannot grant final approval: HQ Approval Sheet is missing.' };
      }

      const oldStage = app.currentStage;
      app.status = STATUSES.APPROVED;
      app.currentStage = STAGES.STAGE_12;
      app.currentStageNum = 12;
      app.assignedRole = 'none';
      app.permissionNumber = app.permissionNumber || `SK-TOUR-2026-${(app.categoryKey || 'TP').toUpperCase().slice(0, 3)}-${app.refNo.split('-').pop()}`;
      app.certRef = app.permissionNumber;
      app.approvalDate = app.approvalDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const officeInfo = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];
      app.approvingOfficer = officerName || officeInfo.dtoName;
      app.approvingDesignation = officeInfo.designation || 'District Tourism Officer (DTO)';
      app.approvingOffice = officeInfo.office;
      app.dtoRemarks = remarks || 'Final departmental approval granted following verification of all statutory requirements and HQ sanction sheet. Official permission letter issued.';

      this.addHistoryEntry(app, {
        action: 'Final Approval Granted & Approval Letter Issued',
        role: 'District Tourism Officer (DTO)',
        officer: officerName || officeInfo.dtoName,
        office: officeInfo.office,
        previousStage: oldStage,
        newStage: STAGES.STAGE_12,
        remarks: app.dtoRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    // STAGE 06: DOCUMENT GENERATION & STATUS PACKAGE
    getDocumentPackage: function (refNo) {
      const app = this.getApplication(refNo);
      if (!app) return null;

      const isHqApplicable = this.isHqApprovalRequired(app.category);
      const isSheetUploaded = !!app.approvalSheet;
      const isApproved = (app.status === STATUSES.APPROVED && app.currentStage === STAGES.STAGE_12) || !!app.permissionNumber;
      const isRejected = (app.status === STATUSES.REJECTED || app.currentStage === STAGES.STAGE_13);
      const isReturned = (app.status === STATUSES.RETURNED || app.currentStage === STAGES.STAGE_6);

      return {
        refNo: app.refNo,
        applicantName: app.applicantName,
        category: app.category,
        district: app.district,
        status: app.status,
        currentStage: app.currentStage,
        approvalSheet: {
          applicable: isHqApplicable,
          uploaded: isSheetUploaded,
          data: app.approvalSheet || null,
          title: 'HQ Departmental Approval Sheet',
          statusText: !isHqApplicable ? 'Not Applicable (Local Activity)' : (isSheetUploaded ? 'Available for View / Download' : (isRejected ? 'Review Terminated (Rejected)' : 'Under Preparation at HQ')),
          badgeClass: !isHqApplicable ? 'bg-secondary' : (isSheetUploaded ? 'bg-success' : (isRejected ? 'bg-secondary' : 'bg-warning text-dark')),
          canDownload: isHqApplicable && isSheetUploaded,
          fileName: isSheetUploaded ? app.approvalSheet.fileName : null,
          sheetNo: isSheetUploaded ? (app.approvalSheet.sheetNo || `HQ/APP-SHEET/2026/${app.refNo.split('-').pop()}`) : null,
          uploadDate: isSheetUploaded ? app.approvalSheet.uploadDate : null,
          url: `approval-sheet.html?arn=${encodeURIComponent(app.refNo)}`
        },
        permissionLetter: {
          available: isApproved,
          permissionNumber: app.permissionNumber || null,
          issueDate: app.approvalDate || null,
          approvingOfficer: app.approvingOfficer || 'Karma Lhendup Bhutia',
          approvingDesignation: app.approvingDesignation || 'District Tourism Officer (DTO)',
          approvingOffice: app.approvingOffice || (app.dtoOffice || 'District Tourism Office'),
          title: 'Official Tourism Permission Letter',
          statusText: isApproved ? 'Issued by District Tourism Officer' : (isRejected ? 'Application Rejected – No Permission Issued' : (isReturned ? 'Application Returned – Pending Clarification' : 'Pending Final DTO Approval')),
          badgeClass: isApproved ? 'bg-success' : (isRejected ? 'bg-danger' : (isReturned ? 'bg-warning text-dark' : 'bg-secondary')),
          canDownload: isApproved,
          url: `permission-letter.html?arn=${encodeURIComponent(app.refNo)}`
        }
      };
    },

    // Citizen Resubmits Corrected Application
    citizenResubmit: function (refNo, updatedData, citizenRemarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const oldStage = app.currentStage;
      if (updatedData) {
        if (updatedData.activityTitle) app.activityTitle = updatedData.activityTitle;
        if (updatedData.activityDescription) app.activityDescription = updatedData.activityDescription;
        if (updatedData.newDoc) {
          app.documents.push(updatedData.newDoc);
        }
      }

      app.status = STATUSES.SUBMITTED;
      app.currentStage = STAGES.STAGE_7; // Awaiting DTO Reverification
      app.currentStageNum = 7;
      app.assignedRole = 'dto'; // Back to DTO
      app.citizenRemarks = citizenRemarks || 'Requested corrections made and additional supporting documents attached.';

      this.addHistoryEntry(app, {
        action: 'Corrected Application Resubmitted',
        role: 'Citizen',
        officer: app.applicantName,
        office: 'Applicant Portal',
        previousStage: oldStage,
        newStage: STAGES.STAGE_7,
        remarks: app.citizenRemarks
      });

      this.updateApplication(app);
      return { success: true, application: app };
    },

    // ==============================================================
    // STAGE 07: REPORTS & ANALYTICS HELPER METHODS
    // ==============================================================
    parseSubmissionDate: function (dateStr) {
      if (!dateStr) return null;
      const m = dateStr.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/);
      if (m) {
        const months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
        const month = months[m[2].toLowerCase()];
        if (month !== undefined) {
          return new Date(parseInt(m[3], 10), month, parseInt(m[1], 10));
        }
      }
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? null : d;
    },

    isDateInRange: function (dateStr, fromDateStr, toDateStr) {
      if (!fromDateStr && !toDateStr) return true;
      const d = this.parseSubmissionDate(dateStr);
      if (!d) return true;
      if (fromDateStr) {
        const from = new Date(fromDateStr + 'T00:00:00');
        if (d < from) return false;
      }
      if (toDateStr) {
        const to = new Date(toDateStr + 'T23:59:59');
        if (d > to) return false;
      }
      return true;
    },

    getReportData: function (role, district, filters) {
      const allApps = this.getAllApplications();
      const r = (role || 'dto').toLowerCase();
      const f = filters || {};

      // 1. Determine Effective District
      // Strict role isolation: DTO CANNOT view other districts
      let effectiveDistrict = district || 'Gangtok';
      if (r === 'dto') {
        if (!effectiveDistrict || effectiveDistrict === 'all') {
          effectiveDistrict = 'Gangtok';
        }
      } else {
        // HQ can choose 'all' or a specific district
        effectiveDistrict = (f.district && f.district !== '') ? f.district : (district || 'all');
      }

      // 2. Base District Scoping
      let scopedApps = allApps;
      if (r === 'dto' || (effectiveDistrict && effectiveDistrict !== 'all')) {
        scopedApps = scopedApps.filter(a => a.district === effectiveDistrict);
      }

      // 3. Apply Filters
      const filteredRecords = scopedApps.filter(app => {
        // Category filter
        if (f.category && f.category !== 'all') {
          const matchCat = (app.categoryKey === f.category) ||
                           (app.category && app.category.toLowerCase().includes(f.category.toLowerCase()));
          if (!matchCat) return false;
        }

        // Status filter (case-insensitive)
        if (f.status && f.status !== 'all') {
          if (!app.status || app.status.toLowerCase() !== f.status.toLowerCase()) return false;
        }

        // Stage filter
        if (f.stage && f.stage !== 'all') {
          if (app.currentStage !== f.stage) return false;
        }

        // Date range filter on submissionDate
        if (f.fromDate || f.toDate) {
          const inRange = this.isDateInRange(app.submissionDate, f.fromDate, f.toDate);
          if (!inRange) return false;
        }

        // Search text filter
        if (f.search && f.search.trim()) {
          const q = f.search.trim().toLowerCase();
          const matchArn = app.refNo && app.refNo.toLowerCase().includes(q);
          const matchName = app.applicantName && app.applicantName.toLowerCase().includes(q);
          const matchTitle = app.activityTitle && app.activityTitle.toLowerCase().includes(q);
          const matchCert = app.permissionNumber && app.permissionNumber.toLowerCase().includes(q);
          if (!matchArn && !matchName && !matchTitle && !matchCert) return false;
        }

        return true;
      });

      // 4. Calculate Summary KPIs from filtered records
      const summary = {
        total: filteredRecords.length,
        submitted: filteredRecords.filter(a => a.status === STATUSES.SUBMITTED).length,
        returned: filteredRecords.filter(a => a.status === STATUSES.RETURNED).length,
        approved: filteredRecords.filter(a => a.status === STATUSES.APPROVED).length,
        rejected: filteredRecords.filter(a => a.status === STATUSES.REJECTED).length
      };

      // 5. Calculate District-wise Summary (for HQ consolidated overview)
      const districtsList = ['Gangtok', 'Mangan', 'Namchi', 'Gyalshing', 'Pakyong', 'Soreng'];
      const districtSummary = districtsList.map(dist => {
        const dApps = allApps.filter(a => a.district === dist);
        // Apply date & category filters if set to keep summary aligned with filters
        const dFiltered = dApps.filter(app => {
          if (f.category && f.category !== 'all') {
            const matchCat = (app.categoryKey === f.category) ||
                             (app.category && app.category.toLowerCase().includes(f.category.toLowerCase()));
            if (!matchCat) return false;
          }
          if (f.fromDate || f.toDate) {
            if (!this.isDateInRange(app.submissionDate, f.fromDate, f.toDate)) return false;
          }
          return true;
        });

        const total = dFiltered.length;
        const sub = dFiltered.filter(a => a.status === STATUSES.SUBMITTED).length;
        const ret = dFiltered.filter(a => a.status === STATUSES.RETURNED).length;
        const apprv = dFiltered.filter(a => a.status === STATUSES.APPROVED).length;
        const rej = dFiltered.filter(a => a.status === STATUSES.REJECTED).length;
        const apprvRate = total > 0 ? Math.round((apprv / total) * 100) : 0;

        return {
          district: dist,
          office: DISTRICT_OFFICES[dist] ? DISTRICT_OFFICES[dist].dtoName : `${dist} DTO`,
          total: total,
          submitted: sub,
          returned: ret,
          approved: apprv,
          rejected: rej,
          approvalRate: apprvRate
        };
      });

      // 6. Calculate Category-wise Summary
      const categoriesList = [
        { key: 'trekking', name: 'Trekking' },
        { key: 'expedition', name: 'Expedition' },
        { key: 'events', name: 'Events, Fairs, Melas, Rallies and Marathons' },
        { key: 'drone', name: 'Drone' },
        { key: 'adventure', name: 'Adventure Activities' },
        { key: 'satellite_phone', name: 'Satellite Phone Usage Permission' },
        { key: 'other', name: 'Any Other' }
      ];

      const categorySummary = categoriesList.map(cat => {
        const cApps = scopedApps.filter(a => {
          const matchCat = (a.categoryKey === cat.key) ||
                           (a.category && a.category.toLowerCase() === cat.name.toLowerCase());
          if (!matchCat) return false;
          if (f.fromDate || f.toDate) {
            if (!this.isDateInRange(a.submissionDate, f.fromDate, f.toDate)) return false;
          }
          if (f.status && f.status !== 'all') {
            if (a.status !== f.status) return false;
          }
          return true;
        });

        const count = cApps.length;
        const approvedCount = cApps.filter(a => a.status === STATUSES.APPROVED).length;
        const submittedCount = cApps.filter(a => a.status === STATUSES.SUBMITTED).length;
        const feeCollected = cApps.reduce((acc, a) => acc + (a.isPaid && a.feeAmount ? a.feeAmount : 0), 0);
        const share = scopedApps.length > 0 ? Math.round((count / scopedApps.length) * 100) : 0;

        return {
          key: cat.key,
          name: cat.name,
          total: count,
          approved: approvedCount,
          submitted: submittedCount,
          feeCollected: feeCollected,
          sharePercent: share
        };
      });

      return {
        role: r,
        effectiveDistrict: effectiveDistrict,
        filters: f,
        records: filteredRecords,
        summary: summary,
        districtSummary: districtSummary,
        categorySummary: categorySummary
      };
    },

    generateCsv: function (reportData) {
      const records = reportData.records || [];
      const headers = [
        'Application ID',
        'Applicant Name',
        'Phone',
        'Email',
        'District',
        'Category',
        'Subject',
        'Submission Date',
        'Current Status',
        'Processing Stage',
        'Last Updated',
        'Approval Date',
        'Permission Number',
        'Approving Officer'
      ];

      const escapeCsv = (str) => {
        if (str === null || str === undefined) return '""';
        const s = String(str).replace(/"/g, '""');
        return `"${s}"`;
      };

      const rows = [headers.map(escapeCsv).join(',')];
      records.forEach(a => {
        rows.push([
          escapeCsv(a.refNo),
          escapeCsv(a.applicantName),
          escapeCsv(a.phone || ''),
          escapeCsv(a.email || ''),
          escapeCsv(a.district),
          escapeCsv(a.category),
          escapeCsv(a.activityTitle),
          escapeCsv(a.submissionDate),
          escapeCsv(a.status),
          escapeCsv(a.currentStage),
          escapeCsv(a.lastUpdated),
          escapeCsv(a.approvalDate || 'N/A'),
          escapeCsv(a.permissionNumber || 'N/A'),
          escapeCsv(a.approvingOfficer || (DISTRICT_OFFICES[a.district] ? DISTRICT_OFFICES[a.district].dtoName : 'N/A'))
        ].join(','));
      });

      return rows.join('\r\n');
    }

  };

  window.WorkflowEngine = WorkflowEngine;

})(window);
