/**
 * WORKFLOW ENGINE & CENTRAL DATA REPOSITORY (V2 - Complete Simulation Dataset)
 * Service: Tourism Permission
 * Department: Tourism & Civil Aviation Department, Government of Sikkim
 * Stage 04: Department Dashboard & Application Workflow
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'tourism_department_applications';
  const STORAGE_VERSION_KEY = 'tourism_dept_apps_version';
  const CURRENT_SEED_VERSION = 'v3_reports_enriched';
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
      dtoName: 'Nima Tshering Lepcha',
      designation: 'District Tourism Officer (DTO)',
      office: 'District Tourism Office, Soreng Circle – 737121',
      phone: '03595-253300',
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

  // 12 Comprehensive Seed Applications covering EVERY application state and workflow branch
  const SEED_APPLICATIONS = [
    // 1. TYPE 1: New / Awaiting DTO Verification (Flow 1: Standard Trekking)
    {
      refNo: 'SK-TP-2026-APP-00481',
      flowType: 'flow1',
      flowTitle: 'Flow 1: Standard HQ Verification & Approval',
      category: 'Trekking',
      categoryKey: 'trekking',
      customCategoryName: '',
      district: 'Gangtok',
      dtoOffice: 'District Tourism Office, Gangtok Circle',
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
      requiresHqVerification: true,
      documents: [
        { id: 'doc_1', name: 'Route Map / Trail Itinerary', fileName: 'Singalila_Ridge_Trail_Route.pdf', size: '1.4 MB', date: '01 Nov 2026' },
        { id: 'doc_2', name: 'Leader Government ID Proof', fileName: 'Tenzing_Voter_ID.pdf', size: '820 KB', date: '01 Nov 2026' },
        { id: 'doc_3', name: 'Group Medical Fitness Certificates', fileName: 'Group_Medical_Certificates.pdf', size: '2.1 MB', date: '01 Nov 2026' }
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
          office: 'Applicant',
          date: '01 Nov 2026, 10:30 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Application submitted online along with payment of ₹100 via Sikkim GO Gateway.'
        }
      ]
    },

    // 2. TYPE 2: New / Awaiting DTO Verification (Flow 4: Direct DTO Approval - Adventure)
    {
      refNo: 'SK-TP-2026-APP-00560',
      flowType: 'flow4',
      flowTitle: 'Flow 4: Direct DTO Approval (Local Adventure Activity)',
      category: 'Adventure Activities',
      categoryKey: 'adventure',
      customCategoryName: '',
      district: 'Mangan',
      dtoOffice: 'District Tourism Office, Mangan Circle',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_2,
      currentStageNum: 2,
      assignedRole: 'dto',
      applicantName: 'Bikram Rai',
      phone: '9733112233',
      email: 'bikram.rafting@northsikkim.org',
      address: 'Near Teesta Bridge, Dikchu, Mangan District, Sikkim - 737116',
      activityTitle: 'Commercial White Water Rafting Season Clearance – Teesta River Zone',
      activityDescription: 'Annual commercial river rafting operations on Grade III-IV rapids between Dikchu and Singtam stretch, operating with licensed rescue kayakers and certified safety gear.',
      liaisonOfficer: null,
      fee: 'Free',
      feeAmount: 0,
      isPaid: false,
      paymentStatus: 'NOT_APPLICABLE',
      paymentTxnRef: 'N/A',
      submissionDate: '02 Nov 2026, 09:15 AM',
      lastUpdated: '02 Nov 2026, 09:15 AM',
      requiresHqVerification: false, // DTO can directly approve!
      documents: [
        { id: 'doc_1', name: 'River Rafting Safety Audit Certificate', fileName: 'Teesta_Rafting_Audit_2026.pdf', size: '1.6 MB', date: '02 Nov 2026' },
        { id: 'doc_2', name: 'River Guide CPR & Rescue Licenses', fileName: 'Guides_Safety_Licenses.pdf', size: '1.2 MB', date: '02 Nov 2026' }
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
          officer: 'Bikram Rai',
          office: 'Applicant',
          date: '02 Nov 2026, 09:15 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Commercial adventure permission request submitted directly for District Circle clearance.'
        }
      ]
    },

    // 3. TYPE 3: Awaiting DTO Reverification (Citizen Resubmitted after Correction)
    {
      refNo: 'SK-TP-2026-APP-00635',
      flowType: 'flow2',
      flowTitle: 'Resubmitted by Citizen (Awaiting DTO Reverification)',
      category: 'Events, Fairs, Melas, Rallies and Marathons',
      categoryKey: 'events',
      customCategoryName: '',
      district: 'Gangtok',
      dtoOffice: 'District Tourism Office, Gangtok Circle',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_7, // Awaiting DTO Reverification!
      currentStageNum: 7,
      assignedRole: 'dto',
      applicantName: 'Pema Dorjee Bhutia',
      phone: '9434123890',
      email: 'pema.dorjee@gangtok-events.org',
      address: 'Deorali, Gangtok Circle, Sikkim - 737102',
      activityTitle: 'Gangtok Winter Cultural Festival & Himalayan Marathon 2026',
      activityDescription: '4-day state-level eco-marathon and cultural fair from Paljor Stadium to Tashi View Point with 350 runners and evening food stalls.',
      liaisonOfficer: null,
      fee: 'Free',
      feeAmount: 0,
      isPaid: false,
      paymentStatus: 'NOT_APPLICABLE',
      paymentTxnRef: 'N/A',
      submissionDate: '26 Oct 2026, 11:00 AM',
      lastUpdated: '04 Nov 2026, 03:30 PM',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_1', name: 'Marathon Route & Medical Support Plan', fileName: 'Gangtok_Marathon_Plan.pdf', size: '2.1 MB', date: '26 Oct 2026' },
        { id: 'doc_2', name: 'Paljor Stadium Venue Allotment Letter', fileName: 'Paljor_Stadium_NOC.pdf', size: '750 KB', date: '26 Oct 2026' },
        { id: 'doc_3', name: 'Certified Fire Safety Clearance NOC', fileName: 'Gangtok_Fire_NOC_Rectified.pdf', size: '1.1 MB', date: '04 Nov 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: null },
      approvalSheet: null,
      dtoRemarks: 'Earlier returned on 30 Oct for missing Fire Safety NOC. Citizen has now attached Fire NOC from Gangtok Fire Station.',
      hqRemarks: null,
      citizenRemarks: 'Attached certified Fire Safety Clearance NOC from Gangtok Municipal Fire Service Station as instructed.',
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Pema Dorjee Bhutia',
          office: 'Applicant',
          date: '26 Oct 2026, 11:00 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Initial application submitted.'
        },
        {
          action: 'Returned to Citizen for Correction',
          role: 'District Tourism Officer (DTO)',
          officer: 'Karma Lhendup Bhutia',
          office: 'District Tourism Office, Gangtok Circle',
          date: '30 Oct 2026, 02:30 PM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_6,
          remarks: 'Fire Safety NOC is mandatory for the proposed food stalls and marathon gathering at Paljor Stadium.'
        },
        {
          action: 'Corrected Application Resubmitted',
          role: 'Citizen',
          officer: 'Pema Dorjee Bhutia',
          office: 'Applicant',
          date: '04 Nov 2026, 03:30 PM',
          previousStage: STAGES.STAGE_6,
          newStage: STAGES.STAGE_7,
          remarks: 'Attached certified Fire Safety Clearance NOC from Gangtok Municipal Fire Service Station as instructed.'
        }
      ]
    },

    // 4. TYPE 4: Forwarded to Headquarters / Awaiting HQ Review (Flow 5: Expedition)
    {
      refNo: 'SK-TP-2026-APP-00890',
      flowType: 'flow5',
      flowTitle: 'Flow 5: High-Altitude Mountaineering Expedition (Under HQ Scrutiny)',
      category: 'Expedition',
      categoryKey: 'expedition',
      customCategoryName: '',
      district: 'Gyalshing',
      dtoOffice: 'District Tourism Office, Gyalshing Circle',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_3, // Awaiting HQ Verification
      currentStageNum: 3,
      assignedRole: 'hq', // At Headquarters
      applicantName: 'Pempa Tshering Bhutia',
      phone: '9434098765',
      email: 'pempa.peaks@sikkim.org',
      address: 'Yuksam, Gyalshing District, Sikkim - 737113',
      activityTitle: 'Mt. Kabru Dome Alpine Mountaineering Peak Expedition (10 Climbers)',
      activityDescription: 'High-altitude mountaineering peak expedition to Mt. Kabru Dome (6,600m) via Goecha La axis. Requires dedicated Departmental Liaison Officer and high-altitude emergency rescue protocol.',
      liaisonOfficer: 'Tashi',
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-90415',
      submissionDate: '27 Oct 2026, 04:00 PM',
      lastUpdated: '01 Nov 2026, 11:30 AM',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_1', name: 'IMF Peak Booking Endorsement', fileName: 'IMF_Kabru_Dome_Clearance.pdf', size: '1.9 MB', date: '27 Oct 2026' },
        { id: 'doc_2', name: 'Forest Department Eco-Permit', fileName: 'Forest_Clearance_Gyalshing.pdf', size: '1.1 MB', date: '27 Oct 2026' },
        { id: 'doc_3', name: 'Expedition Team Member Roster & High-Altitude Medicals', fileName: 'Climbers_Medical_Fitness.pdf', size: '2.4 MB', date: '27 Oct 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: null },
      approvalSheet: null,
      dtoRemarks: 'Local trail logistics, certified mountain guides, and baseline high-altitude insurance verified. Forwarded to State Headquarters for e-Office concurrence.',
      hqRemarks: null,
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Pempa Tshering Bhutia',
          office: 'Applicant',
          date: '27 Oct 2026, 04:00 PM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Expedition application submitted with fee payment of ₹100.'
        },
        {
          action: 'DTO Scrutiny Completed & Transmitted to HQ',
          role: 'District Tourism Officer (DTO)',
          officer: 'Sonam Palzor Bhutia',
          office: 'District Tourism Office, Gyalshing Circle',
          date: '01 Nov 2026, 11:30 AM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_3,
          remarks: 'Local trail logistics, certified mountain guides, and baseline high-altitude insurance verified. Forwarded to State Headquarters for e-Office concurrence.'
        }
      ]
    },

    // 5. TYPE 5: Under Inter-Departmental HQ Review (e-Office File Opened)
    {
      refNo: 'SK-TP-2026-APP-00620',
      flowType: 'flow1',
      flowTitle: 'Under Inter-Departmental HQ Review (e-Office File Active)',
      category: 'Drone',
      categoryKey: 'drone',
      customCategoryName: '',
      district: 'Pakyong',
      dtoOffice: 'District Tourism Office, Pakyong Circle',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_4, // Under HQ Review!
      currentStageNum: 4,
      assignedRole: 'hq',
      applicantName: 'Karma Sonam Lepcha',
      phone: '9832045612',
      email: 'karma.drone@sikkimmedia.in',
      address: 'Pakyong Bazaar, Pakyong District, Sikkim - 737106',
      activityTitle: 'Aerial Documentary Filming – Pakyong Green Airport Buffer Sector',
      activityDescription: '4-day professional drone filming for Sikkim Tourism promotional documentary across approved rural scenic corridors surrounding Pakyong valley, observing DGCA civil aviation restrictions.',
      liaisonOfficer: null,
      fee: 'Free',
      feeAmount: 0,
      isPaid: false,
      paymentStatus: 'NOT_APPLICABLE',
      paymentTxnRef: 'N/A',
      submissionDate: '29 Oct 2026, 02:45 PM',
      lastUpdated: '03 Nov 2026, 12:00 PM',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_1', name: 'DGCA Remote Pilot License & Drone UIN Certificate', fileName: 'DGCA_Pilot_License_UIN.pdf', size: '1.3 MB', date: '29 Oct 2026' },
        { id: 'doc_2', name: 'Pakyong District Police Security NOC', fileName: 'Police_Clearance_Pakyong.pdf', size: '920 KB', date: '29 Oct 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: 'EOF-2026-SK-TOUR-0620', remarks: 'Under Home Department and Airport Authority coordination.' },
      approvalSheet: null,
      dtoRemarks: 'District police clearance verified. Forwarded to Directorate for state aviation security review.',
      hqRemarks: 'Review commenced at Directorate. Coordinating with Civil Aviation cell for runway buffer clearance.',
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Karma Sonam Lepcha',
          office: 'Applicant',
          date: '29 Oct 2026, 02:45 PM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Drone filming permission requested.'
        },
        {
          action: 'Forwarded to Headquarters',
          role: 'District Tourism Officer (DTO)',
          officer: 'Bikash Tamang',
          office: 'District Tourism Office, Pakyong Circle',
          date: '31 Oct 2026, 10:15 AM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_3,
          remarks: 'District police clearance verified. Forwarded to Directorate for state aviation security review.'
        },
        {
          action: 'Headquarters Review Commenced',
          role: 'Headquarters Administrator (HQ)',
          officer: 'Dr. Tshering Yangchen Lepcha',
          office: 'Paryatan Bhawan, Tadong, Gangtok',
          date: '03 Nov 2026, 12:00 PM',
          previousStage: STAGES.STAGE_3,
          newStage: STAGES.STAGE_4,
          remarks: 'Review commenced at Directorate. Coordinating with Civil Aviation cell for runway buffer clearance.'
        }
      ]
    },

    // 6. TYPE 6: Awaiting HQ Approval Sheet (e-Office Concurrence Recorded)
    {
      refNo: 'SK-TP-2026-APP-00914',
      flowType: 'flow1',
      flowTitle: 'Awaiting HQ Approval Sheet Upload (e-Office Concurrence Recorded)',
      category: 'Trekking',
      categoryKey: 'trekking',
      customCategoryName: '',
      district: 'Namchi',
      dtoOffice: 'District Tourism Office, Namchi Circle',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_9, // Awaiting HQ Approval Sheet!
      currentStageNum: 9,
      assignedRole: 'hq',
      applicantName: 'Mingma Sherpa',
      phone: '9811445566',
      email: 'mingma.treks@namchi.org',
      address: 'Damthang Road, Namchi District, Sikkim - 737126',
      activityTitle: 'Tendong Hill Botanical Eco-Trail (12 Trekkers)',
      activityDescription: '4-day educational botanical trekking expedition through Tendong State Biodiversity Reserve for university botany researchers.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-90812',
      submissionDate: '25 Oct 2026, 10:00 AM',
      lastUpdated: '03 Nov 2026, 04:15 PM',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_1', name: 'Tendong Trail Route & Camp Plan', fileName: 'Tendong_Route_Plan.pdf', size: '1.2 MB', date: '25 Oct 2026' },
        { id: 'doc_2', name: 'Forest Department Botanical Collection NOC', fileName: 'Forest_Botanical_NOC.pdf', size: '1.5 MB', date: '25 Oct 2026' }
      ],
      hqVerification: { verified: true, verifiedDate: '03 Nov 2026', eOfficeFileNo: 'EOF-2026-SK-TOUR-0722', remarks: 'Forest and Home Departments have recorded formal concurrence under e-Office note sheet #24.' },
      approvalSheet: null, // Ready for HQ to upload!
      dtoRemarks: 'Trail route and local guides verified. Forwarded to HQ.',
      hqRemarks: 'e-Office concurrence recorded. Preparing official sanction approval sheet for upload.',
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Mingma Sherpa',
          office: 'Applicant',
          date: '25 Oct 2026, 10:00 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Trekking application submitted.'
        },
        {
          action: 'Forwarded to Headquarters',
          role: 'District Tourism Officer (DTO)',
          officer: 'Pema Wangchuk Sherpa',
          office: 'District Tourism Office, Namchi Circle',
          date: '28 Oct 2026, 11:30 AM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_3,
          remarks: 'Trail route and local guides verified. Forwarded to HQ.'
        },
        {
          action: 'e-Office Concurrence Recorded',
          role: 'Headquarters Administrator (HQ)',
          officer: 'Dr. Tshering Yangchen Lepcha',
          office: 'Paryatan Bhawan, Tadong, Gangtok',
          date: '03 Nov 2026, 04:15 PM',
          previousStage: STAGES.STAGE_4,
          newStage: STAGES.STAGE_9,
          remarks: 'Forest and Home Departments have recorded formal concurrence under e-Office note sheet #24.'
        }
      ]
    },

    // 7. TYPE 7: Returned by HQ to DTO with Objections (Urgent DTO Action Needed - Flow 5)
    {
      refNo: 'SK-TP-2026-APP-00778',
      flowType: 'flow5',
      flowTitle: 'Flow 5: Returned by HQ to DTO with Objections (Urgent DTO Action Needed)',
      category: 'Expedition',
      categoryKey: 'expedition',
      customCategoryName: '',
      district: 'Gangtok',
      dtoOffice: 'District Tourism Office, Gangtok Circle',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_5, // Returned by HQ to DTO!
      currentStageNum: 5,
      assignedRole: 'dto', // DTO must take action!
      applicantName: 'Lobsang Gyatso',
      phone: '9800778899',
      email: 'lobsang.expeditions@sikkim.org',
      address: 'Tadong, Gangtok Circle, Sikkim - 737102',
      activityTitle: 'Mt. Jopuno Technical Alpine Reconnaissance Expedition',
      activityDescription: 'Technical alpine climbing reconnaissance expedition on Mt. Jopuno (5,936m) via Oglathang glacier route with 6 international climbers.',
      liaisonOfficer: 'Roshni',
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-90654',
      submissionDate: '24 Oct 2026, 03:00 PM',
      lastUpdated: '04 Nov 2026, 01:15 PM',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_1', name: 'Expedition Route Map', fileName: 'Jopuno_Alpine_Route.pdf', size: '2.3 MB', date: '24 Oct 2026' },
        { id: 'doc_2', name: 'Medical & High-Altitude Insurance Certificates', fileName: 'Climbers_Insurance.pdf', size: '1.7 MB', date: '24 Oct 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: null },
      approvalSheet: null,
      dtoRemarks: 'Application forwarded to Headquarters on 28 Oct.',
      hqRemarks: 'IMF clearance registration certificate missing and high-altitude emergency satellite communication protocol incomplete. Return to applicant for mandatory submission before sanction can be considered.',
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Lobsang Gyatso',
          office: 'Applicant',
          date: '24 Oct 2026, 03:00 PM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Expedition request submitted.'
        },
        {
          action: 'Forwarded to Headquarters',
          role: 'District Tourism Officer (DTO)',
          officer: 'Karma Lhendup Bhutia',
          office: 'District Tourism Office, Gangtok Circle',
          date: '28 Oct 2026, 09:30 AM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_3,
          remarks: 'Forwarded for state clearances.'
        },
        {
          action: 'Returned by HQ to DTO with Objections',
          role: 'Headquarters Administrator (HQ)',
          officer: 'Dr. Tshering Yangchen Lepcha',
          office: 'Paryatan Bhawan, Tadong, Gangtok',
          date: '04 Nov 2026, 01:15 PM',
          previousStage: STAGES.STAGE_4,
          newStage: STAGES.STAGE_5,
          remarks: 'IMF clearance registration certificate missing and high-altitude emergency satellite communication protocol incomplete. Return to applicant for mandatory submission before sanction can be considered.'
        }
      ]
    },

    // 8. TYPE 8: Returned to Citizen for Correction (Flow 2: Awaiting Citizen Action)
    {
      refNo: 'SK-TP-2026-APP-00329',
      flowType: 'flow2',
      flowTitle: 'Flow 2: Returned to Citizen for Correction (Awaiting Citizen Action)',
      category: 'Events, Fairs, Melas, Rallies and Marathons',
      categoryKey: 'events',
      customCategoryName: '',
      district: 'Namchi',
      dtoOffice: 'District Tourism Office, Namchi Circle',
      status: STATUSES.RETURNED,
      currentStage: STAGES.STAGE_6, // Awaiting Citizen Correction!
      currentStageNum: 6,
      assignedRole: 'citizen',
      applicantName: 'Kinzang Ongmu Bhutia',
      phone: '9733054128',
      email: 'kinzang.bhutia@events-sikkim.org',
      address: 'Central Park Area, Namchi District, Sikkim - 737126',
      activityTitle: 'Namchi Winter Marathon & Eco-Cultural Tourism Fair 2026',
      activityDescription: 'State-level winter eco-marathon across scenic rural tracks starting from Bhaichung Stadium to Char Dham, expected to host 250 runners and public spectators.',
      liaisonOfficer: null,
      fee: 'Free',
      feeAmount: 0,
      isPaid: false,
      paymentStatus: 'NOT_APPLICABLE',
      paymentTxnRef: 'N/A',
      submissionDate: '28 Oct 2026, 02:15 PM',
      lastUpdated: '02 Nov 2026, 04:30 PM',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_1', name: 'Event Route & Venue Map', fileName: 'Namchi_Marathon_Track_Route.pdf', size: '1.8 MB', date: '28 Oct 2026' },
        { id: 'doc_2', name: 'District Police Safety NOC', fileName: 'Namchi_Police_Clearance.pdf', size: '640 KB', date: '28 Oct 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: null },
      approvalSheet: null,
      dtoRemarks: 'Fire Safety NOC and certified crowd management layout for the proposed marathon venue at Namchi Public Ground are missing. Please attach the Fire NOC and resubmit.',
      hqRemarks: null,
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Kinzang Ongmu Bhutia',
          office: 'Applicant',
          date: '28 Oct 2026, 02:15 PM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Marathon permission requested.'
        },
        {
          action: 'Returned to Citizen for Correction',
          role: 'District Tourism Officer (DTO)',
          officer: 'Pema Wangchuk Sherpa',
          office: 'District Tourism Office, Namchi Circle',
          date: '02 Nov 2026, 04:30 PM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_6,
          remarks: 'Fire Safety NOC and certified crowd management layout for the proposed marathon venue at Namchi Public Ground are missing. Please attach the Fire NOC and resubmit.'
        }
      ]
    },

    // 9. TYPE 9: Awaiting Final DTO Approval (HQ Clearance & Approval Sheet Attached!)
    {
      refNo: 'SK-TP-2026-APP-00512',
      flowType: 'flow1',
      flowTitle: 'Awaiting Final DTO Approval (HQ Approval Sheet Attached)',
      category: 'Trekking',
      categoryKey: 'trekking',
      customCategoryName: '',
      district: 'Gangtok',
      dtoOffice: 'District Tourism Office, Gangtok Circle',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_11, // Awaiting Final DTO Approval!
      currentStageNum: 11,
      assignedRole: 'dto', // DTO can issue right now!
      applicantName: 'Dawa Tshering Lepcha',
      phone: '9800334455',
      email: 'dawa.treks@sikkim.in',
      address: 'Chandmari, Gangtok Circle, Sikkim - 737103',
      activityTitle: 'Dzongri - Goecha La High-Altitude Trekking Expedition (6 Trekkers)',
      activityDescription: '8-day alpine high-pass trekking expedition to Goecha La view point via Dzongri with 6 domestic trekkers and licensed mountaineering guides.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-90512',
      submissionDate: '22 Oct 2026, 11:30 AM',
      lastUpdated: '03 Nov 2026, 05:00 PM',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_1', name: 'Goecha La Trail Itinerary & Acclimatization Plan', fileName: 'Goecha_La_Route.pdf', size: '1.7 MB', date: '22 Oct 2026' },
        { id: 'doc_2', name: 'Forest Department KNP Eco-Permit', fileName: 'KNP_Forest_Clearance.pdf', size: '1.2 MB', date: '22 Oct 2026' }
      ],
      hqVerification: { verified: true, verifiedDate: '02 Nov 2026', eOfficeFileNo: 'EOF-2026-SK-TOUR-0512', remarks: 'Inter-departmental security concurrence cleared under e-Office note sheet #18.' },
      approvalSheet: {
        sheetNo: 'HQ/APP-SHEET/2026/00512',
        fileName: 'HQ_Approval_Sheet_SK-TP-00512.pdf',
        designation: 'Additional Secretary (Tourism) & HQ Administrator',
        office: 'Headquarters, Paryatan Bhawan, Tadong, Gangtok',
        size: '1.4 MB',
        uploadDate: '03 Nov 2026, 04:45 PM',
        uploadedBy: 'Dr. Tshering Yangchen Lepcha, Additional Secretary (Tourism)'
      },
      dtoRemarks: 'Pending final review and digital signature issuance.',
      hqRemarks: 'Headquarters verification complete. Sanction sheet attached. Transmitted back to concerned DTO for final approval and issuance.',
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Dawa Tshering Lepcha',
          office: 'Applicant',
          date: '22 Oct 2026, 11:30 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Trekking request submitted.'
        },
        {
          action: 'Forwarded to Headquarters',
          role: 'District Tourism Officer (DTO)',
          officer: 'Karma Lhendup Bhutia',
          office: 'District Tourism Office, Gangtok Circle',
          date: '26 Oct 2026, 10:00 AM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_3,
          remarks: 'Local trail and guide clearances verified. Forwarded to HQ.'
        },
        {
          action: 'Approval Sheet Uploaded & Transmitted to DTO',
          role: 'Headquarters Administrator (HQ)',
          officer: 'Dr. Tshering Yangchen Lepcha',
          office: 'Paryatan Bhawan, Tadong, Gangtok',
          date: '03 Nov 2026, 05:00 PM',
          previousStage: STAGES.STAGE_10,
          newStage: STAGES.STAGE_11,
          remarks: 'Headquarters verification complete. Sanction sheet attached. Transmitted back to concerned DTO for final approval and issuance.'
        }
      ]
    },

    // 10. TYPE 10: Approved Permission (Permission Letter Issued)
    {
      refNo: 'SK-TP-2026-APP-00215',
      flowType: 'flow1',
      flowTitle: 'Approved Permission (Official Permission Letter Issued)',
      category: 'Trekking',
      categoryKey: 'trekking',
      customCategoryName: '',
      district: 'Gangtok',
      dtoOffice: 'District Tourism Office, Gangtok Circle',
      status: STATUSES.APPROVED,
      currentStage: STAGES.STAGE_12, // Approved!
      currentStageNum: 12,
      assignedRole: 'none',
      applicantName: 'Passang Doma Bhutia',
      phone: '9832109876',
      email: 'passang.doma@sikkim.org',
      address: 'Below Enchey Monastery, Gangtok, Sikkim - 737101',
      activityTitle: 'Green Lake Reconnaissance Trek (4 Pax)',
      activityDescription: '4-person scientific and botanical reconnaissance trek along Green Lake trail in North Sikkim under authorized ecological research guidelines.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-90215',
      submissionDate: '15 Oct 2026, 09:30 AM',
      lastUpdated: '28 Oct 2026, 03:00 PM',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_1', name: 'Green Lake Research & Route Map', fileName: 'Green_Lake_Route.pdf', size: '2.1 MB', date: '15 Oct 2026' },
        { id: 'doc_2', name: 'Forest Department Research Clearance', fileName: 'Forest_Research_NOC.pdf', size: '1.4 MB', date: '15 Oct 2026' }
      ],
      hqVerification: { verified: true, verifiedDate: '25 Oct 2026', eOfficeFileNo: 'EOF-2026-SK-TOUR-0215', remarks: 'Inter-departmental clearance granted.' },
      approvalSheet: {
        sheetNo: 'HQ/APP-SHEET/2026/00215',
        fileName: 'HQ_Approval_Sheet_SK-TP-00215.pdf',
        designation: 'Additional Secretary (Tourism) & HQ Administrator',
        office: 'Headquarters, Paryatan Bhawan, Tadong, Gangtok',
        size: '1.3 MB',
        uploadDate: '27 Oct 2026, 11:00 AM',
        uploadedBy: 'Dr. Tshering Yangchen Lepcha, Additional Secretary (Tourism)'
      },
      permissionNumber: 'SK-TOUR-2026-TRE-00215',
      certRef: 'SK-TOUR-2026-TRE-00215',
      approvalDate: '28 Oct 2026',
      approvingOfficer: 'Karma Lhendup Bhutia',
      approvingDesignation: 'District Tourism Officer (DTO)',
      approvingOffice: 'District Tourism Office, Gangtok Circle, Government of Sikkim',
      dtoRemarks: 'Final departmental approval granted following verification of all statutory requirements and HQ sanction sheet. Permission letter issued.',
      hqRemarks: 'Approved at State Directorate level.',
      citizenRemarks: null,
      history: [
        {
          action: 'Final Approval Granted',
          role: 'District Tourism Officer (DTO)',
          officer: 'Karma Lhendup Bhutia',
          office: 'District Tourism Office, Gangtok Circle',
          date: '28 Oct 2026, 03:00 PM',
          previousStage: STAGES.STAGE_11,
          newStage: STAGES.STAGE_12,
          remarks: 'Final departmental approval granted following verification of all statutory requirements and HQ sanction sheet. Permission letter issued.'
        }
      ]
    },

    // 11. TYPE 11: Rejected Application (Flow 3: Statutory Rejection with Grounds)
    {
      refNo: 'SK-TP-2026-APP-00712',
      flowType: 'flow3',
      flowTitle: 'Flow 3: Application Rejected with Ground Remarks',
      category: 'Drone',
      categoryKey: 'drone',
      customCategoryName: '',
      district: 'Gangtok',
      dtoOffice: 'District Tourism Office, Gangtok Circle',
      status: STATUSES.REJECTED,
      currentStage: STAGES.STAGE_13, // Rejected!
      currentStageNum: 13,
      assignedRole: 'none',
      applicantName: 'Tashi Namgyal',
      phone: '9434055667',
      email: 'tashi.media@himalayas.tv',
      address: 'Development Area, Gangtok, Sikkim - 737101',
      activityTitle: 'Commercial Aerial Documentary Filming – Indo-China Border Buffer Airspace',
      activityDescription: 'Proposed high-altitude drone videography and 4K aerial filming along Nathula pass axis and high ridges within 10km of the international border.',
      liaisonOfficer: null,
      fee: 'Free',
      feeAmount: 0,
      isPaid: false,
      paymentStatus: 'NOT_APPLICABLE',
      paymentTxnRef: 'N/A',
      submissionDate: '20 Oct 2026, 01:00 PM',
      lastUpdated: '25 Oct 2026, 10:45 AM',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_1', name: 'Aerial Flight Coordinates & Drone Specs', fileName: 'Border_Flight_Plan.pdf', size: '1.8 MB', date: '20 Oct 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: null },
      approvalSheet: null,
      dtoRemarks: 'Permission rejected pursuant to Ministry of Defence border security buffer protocols. High-altitude commercial drone flights within 25km of the international border line are strictly prohibited without written clearance from HQ 17 Mountain Division.',
      hqRemarks: null,
      citizenRemarks: null,
      history: [
        {
          action: 'Application Submitted',
          role: 'Citizen',
          officer: 'Tashi Namgyal',
          office: 'Applicant',
          date: '20 Oct 2026, 01:00 PM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'Drone filming clearance requested.'
        },
        {
          action: 'Application Rejected',
          role: 'District Tourism Officer (DTO)',
          officer: 'Karma Lhendup Bhutia',
          office: 'District Tourism Office, Gangtok Circle',
          date: '25 Oct 2026, 10:45 AM',
          previousStage: STAGES.STAGE_2,
          newStage: STAGES.STAGE_13,
          remarks: 'Permission rejected pursuant to Ministry of Defence border security buffer protocols. High-altitude commercial drone flights within 25km of the international border line are strictly prohibited without written clearance from HQ 17 Mountain Division.'
        }
      ]
    },

    // 12. TYPE 12: Soreng District Local Trekking
    {
      refNo: 'SK-TP-2026-APP-00810',
      flowType: 'flow1',
      flowTitle: 'Barsey Sanctuary Eco-Trek (Soreng Circle)',
      category: 'Trekking',
      categoryKey: 'trekking',
      customCategoryName: '',
      district: 'Soreng',
      dtoOffice: 'District Tourism Office, Soreng Circle',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_2,
      currentStageNum: 2,
      assignedRole: 'dto',
      applicantName: 'Chungda Sherpa',
      phone: '9800554433',
      email: 'chungda.soreng@trek.in',
      address: 'Okhrey Village, Soreng District, Sikkim - 737121',
      activityTitle: 'Barsey Rhododendron Sanctuary Botanical Trail (6 Trekkers)',
      activityDescription: '3-day botanical nature trail through Barsey Rhododendron Sanctuary with certified local birding guides.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-90810',
      submissionDate: '03 Nov 2026, 09:00 AM',
      lastUpdated: '03 Nov 2026, 09:00 AM',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_1', name: 'Barsey Sanctuary Route Map', fileName: 'Barsey_Route.pdf', size: '1.1 MB', date: '03 Nov 2026' }
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
          officer: 'Chungda Sherpa',
          office: 'Applicant',
          date: '03 Nov 2026, 09:00 AM',
          previousStage: 'New Submission',
          newStage: STAGES.STAGE_2,
          remarks: 'New botanical trek application.'
        }
      ]
    },

    // 13. TYPE 13: Mangan Circle - Rafting Clearance (Approved)
    {
      refNo: 'SK-TP-2026-APP-00561',
      flowType: 'flow4',
      flowTitle: 'Flow 4: Direct DTO Approval (Mangan Circle Adventure Rafting)',
      category: 'Adventure Activities',
      categoryKey: 'adventure',
      customCategoryName: '',
      district: 'Mangan',
      dtoOffice: 'District Tourism Office, Mangan Circle',
      status: STATUSES.APPROVED,
      currentStage: STAGES.STAGE_12,
      currentStageNum: 12,
      assignedRole: 'none',
      applicantName: 'Norbu Wangyal',
      phone: '9800778899',
      email: 'norbu.wangyal@mangan-raft.in',
      address: 'Near Teesta Bridge, Dikchu, Mangan District, Sikkim - 737116',
      activityTitle: 'Teesta Grade IV White-Water Kayaking Training Camp',
      activityDescription: 'Professional 5-day white-water kayaking training camp on Teesta River stretch between Chungthang and Mangan with certified rescue kayakers.',
      liaisonOfficer: null,
      fee: 'Free',
      feeAmount: 0,
      isPaid: false,
      paymentStatus: 'NOT_APPLICABLE',
      paymentTxnRef: 'N/A',
      submissionDate: '18 Oct 2026, 11:00 AM',
      lastUpdated: '29 Oct 2026, 04:00 PM',
      approvalDate: '29 Oct 2026',
      permissionNumber: 'SK-TOUR-2026-ADV-00561',
      approvingOfficer: 'Tenzing Dadul Lepcha',
      approvingDesignation: 'District Tourism Officer (DTO)',
      approvingOffice: 'District Tourism Office, Mangan Circle, Government of Sikkim',
      requiresHqVerification: false,
      documents: [
        { id: 'doc_1', name: 'Rescue Kayak Certification', fileName: 'Kayak_Safety_Cert.pdf', size: '1.2 MB', date: '18 Oct 2026' }
      ],
      hqVerification: { verified: true, verifiedDate: '28 Oct 2026', eOfficeFileNo: 'N/A (Local Sanction)', remarks: 'Local safety clearance' },
      approvalSheet: null,
      dtoRemarks: 'Safety inspection completed. Annual permit issued.',
      history: [
        { action: 'Permission Approved', role: 'DTO', officer: 'Tenzing Dadul Lepcha', office: 'Mangan DTO', date: '29 Oct 2026, 04:00 PM', previousStage: STAGES.STAGE_2, newStage: STAGES.STAGE_12, remarks: 'Statutory adventure permit issued.' }
      ]
    },

    // 14. TYPE 14: Gyalshing Circle - Dzongri Mountaineering (Approved)
    {
      refNo: 'SK-TP-2026-APP-00891',
      flowType: 'flow5',
      flowTitle: 'Flow 5: High-Altitude Mountaineering Expedition (Gyalshing)',
      category: 'Expedition',
      categoryKey: 'expedition',
      customCategoryName: '',
      district: 'Gyalshing',
      dtoOffice: 'District Tourism Office, Gyalshing Circle',
      status: STATUSES.APPROVED,
      currentStage: STAGES.STAGE_12,
      currentStageNum: 12,
      assignedRole: 'none',
      applicantName: 'Dawa Tshering Bhutia',
      phone: '9800112244',
      email: 'dawa.yuksom@west-expeditions.org',
      address: 'Yuksom Heritage Trail, Gyalshing District, Sikkim - 737111',
      activityTitle: 'Yuksom – Dzongri Alpine Mountaineering Advance Peak Permit',
      activityDescription: 'High-altitude mountaineering team expedition to Dzongri ridge with licensed Liaison Officer and eco-waste management protocol.',
      liaisonOfficer: 'Tenzing Gyatso Lepcha',
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-88912',
      submissionDate: '12 Oct 2026, 09:30 AM',
      lastUpdated: '27 Oct 2026, 02:30 PM',
      approvalDate: '27 Oct 2026',
      permissionNumber: 'SK-TOUR-2026-EXP-00891',
      approvingOfficer: 'Sonam Palzor Bhutia',
      approvingDesignation: 'District Tourism Officer (DTO)',
      approvingOffice: 'District Tourism Office, Gyalshing Circle, Government of Sikkim',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_1', name: 'Mountaineering Clearance', fileName: 'IMF_Clearance.pdf', size: '1.8 MB', date: '12 Oct 2026' }
      ],
      hqVerification: { verified: true, verifiedDate: '25 Oct 2026', eOfficeFileNo: 'EOF-2026-SK-TOUR-8910', remarks: 'Inter-departmental clearance completed' },
      approvalSheet: { fileName: 'HQ_Approval_Sheet_00891.pdf', size: '1.4 MB', uploadDate: '25 Oct 2026, 11:00 AM', uploadedBy: 'HQ Administrator' },
      dtoRemarks: 'Final approval granted with assigned Liaison Officer.',
      history: [
        { action: 'Permission Approved', role: 'DTO', officer: 'Sonam Palzor Bhutia', office: 'Gyalshing DTO', date: '27 Oct 2026, 02:30 PM', previousStage: STAGES.STAGE_11, newStage: STAGES.STAGE_12, remarks: 'Statutory expedition permission letter issued.' }
      ]
    },

    // 15. TYPE 15: Gyalshing Circle - Goecha La Trek (Returned for Correction)
    {
      refNo: 'SK-TP-2026-APP-00892',
      flowType: 'flow2',
      flowTitle: 'Flow 2: Returned to Citizen (Gyalshing)',
      category: 'Trekking',
      categoryKey: 'trekking',
      customCategoryName: '',
      district: 'Gyalshing',
      dtoOffice: 'District Tourism Office, Gyalshing Circle',
      status: STATUSES.RETURNED,
      currentStage: STAGES.STAGE_6,
      currentStageNum: 6,
      assignedRole: 'citizen',
      applicantName: 'Prakash Pradhan',
      phone: '9434889911',
      email: 'prakash.pradhan@himalayavistas.in',
      address: 'Pelling Helipad Road, Gyalshing District, Sikkim - 737111',
      activityTitle: 'Goecha La Autumn Sunrise Trek (4 Pax)',
      activityDescription: 'Autumn wilderness trek to Goecha La viewpoint 1 with local mountain guide.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-89230',
      submissionDate: '29 Oct 2026, 03:15 PM',
      lastUpdated: '03 Nov 2026, 11:45 AM',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_1', name: 'Applicant Voter Card', fileName: 'Voter_ID.pdf', size: '640 KB', date: '29 Oct 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: null },
      approvalSheet: null,
      dtoRemarks: 'High-altitude medical fitness certificate missing for 2 trekkers.',
      history: [
        { action: 'Returned for Clarification', role: 'DTO', officer: 'Sonam Palzor Bhutia', office: 'Gyalshing DTO', date: '03 Nov 2026, 11:45 AM', previousStage: STAGES.STAGE_2, newStage: STAGES.STAGE_6, remarks: 'Please upload physician-signed medical certificates.' }
      ]
    },

    // 16. TYPE 16: Pakyong Circle - Aviation & Tourism Cultural Mela (Approved)
    {
      refNo: 'SK-TP-2026-APP-00636',
      flowType: 'flow1',
      flowTitle: 'Flow 1: Pakyong Cultural Mela Sanction (Approved)',
      category: 'Events, Fairs, Melas, Rallies and Marathons',
      categoryKey: 'events',
      customCategoryName: '',
      district: 'Pakyong',
      dtoOffice: 'District Tourism Office, Pakyong Circle',
      status: STATUSES.APPROVED,
      currentStage: STAGES.STAGE_12,
      currentStageNum: 12,
      assignedRole: 'none',
      applicantName: 'Sunita Chettri',
      phone: '9832044556',
      email: 'sunita.chettri@pakyong-culture.org',
      address: 'Main Bazaar, Pakyong District, Sikkim - 737106',
      activityTitle: 'Pakyong Green Aviation & Tourism Cultural Mela 2026',
      activityDescription: 'State tourism and organic cultural festival promoting local eco-homestays and handicraft exhibitions.',
      liaisonOfficer: null,
      fee: 'Free',
      feeAmount: 0,
      isPaid: false,
      paymentStatus: 'NOT_APPLICABLE',
      paymentTxnRef: 'N/A',
      submissionDate: '14 Oct 2026, 10:00 AM',
      lastUpdated: '26 Oct 2026, 05:00 PM',
      approvalDate: '26 Oct 2026',
      permissionNumber: 'SK-TOUR-2026-EVE-00636',
      approvingOfficer: 'Bikash Tamang',
      approvingDesignation: 'District Tourism Officer (DTO)',
      approvingOffice: 'District Tourism Office, Pakyong Circle, Government of Sikkim',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_1', name: 'Event Management Plan', fileName: 'Event_Plan.pdf', size: '2.1 MB', date: '14 Oct 2026' }
      ],
      hqVerification: { verified: true, verifiedDate: '24 Oct 2026', eOfficeFileNo: 'EOF-2026-SK-TOUR-6360', remarks: 'Police and district administration concurred' },
      approvalSheet: { fileName: 'HQ_Approval_Sheet_00636.pdf', size: '1.2 MB', uploadDate: '24 Oct 2026, 03:00 PM', uploadedBy: 'HQ Administrator' },
      dtoRemarks: 'All clearances in order. Statutory event permission granted.',
      history: [
        { action: 'Permission Approved', role: 'DTO', officer: 'Bikash Tamang', office: 'Pakyong DTO', date: '26 Oct 2026, 05:00 PM', previousStage: STAGES.STAGE_11, newStage: STAGES.STAGE_12, remarks: 'Statutory permission issued.' }
      ]
    },

    // 17. TYPE 17: Soreng Circle - Barsey Nature Camp (Returned for Correction)
    {
      refNo: 'SK-TP-2026-APP-00811',
      flowType: 'flow2',
      flowTitle: 'Flow 2: Soreng Circle Camping Permit (Returned)',
      category: 'Adventure Activities',
      categoryKey: 'adventure',
      customCategoryName: '',
      district: 'Soreng',
      dtoOffice: 'District Tourism Office, Soreng Circle',
      status: STATUSES.RETURNED,
      currentStage: STAGES.STAGE_6,
      currentStageNum: 6,
      assignedRole: 'citizen',
      applicantName: 'Mingma Dorjee Lepcha',
      phone: '9733556677',
      email: 'mingma.dorjee@soreng-wild.in',
      address: 'Rinchenpong Axis, Soreng District, Sikkim - 737121',
      activityTitle: 'Barsey Eco-Camping & Mountain Biking Trail',
      activityDescription: '4-day wilderness camping and mountain cycling trail along outer buffer zone of Barsey sanctuary.',
      liaisonOfficer: null,
      fee: 'Free',
      feeAmount: 0,
      isPaid: false,
      paymentStatus: 'NOT_APPLICABLE',
      paymentTxnRef: 'N/A',
      submissionDate: '28 Oct 2026, 01:30 PM',
      lastUpdated: '02 Nov 2026, 03:00 PM',
      requiresHqVerification: false,
      documents: [
        { id: 'doc_1', name: 'Camping Route Sketch', fileName: 'Camping_Route.pdf', size: '920 KB', date: '28 Oct 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: null },
      approvalSheet: null,
      dtoRemarks: 'Forest territorial clearance document is required for designated camping spots.',
      history: [
        { action: 'Returned for Clarification', role: 'DTO', officer: 'Nima Tshering Lepcha', office: 'Soreng DTO', date: '02 Nov 2026, 03:00 PM', previousStage: STAGES.STAGE_2, newStage: STAGES.STAGE_6, remarks: 'Please attach territorial forest range clearance.' }
      ]
    },

    // 18. TYPE 18: Soreng Circle - Village Cultural Trek (Approved)
    {
      refNo: 'SK-TP-2026-APP-00812',
      flowType: 'flow4',
      flowTitle: 'Flow 4: Soreng Village Trek (Approved)',
      category: 'Trekking',
      categoryKey: 'trekking',
      customCategoryName: '',
      district: 'Soreng',
      dtoOffice: 'District Tourism Office, Soreng Circle',
      status: STATUSES.APPROVED,
      currentStage: STAGES.STAGE_12,
      currentStageNum: 12,
      assignedRole: 'none',
      applicantName: 'Karma Tshering Lepcha',
      phone: '9800332211',
      email: 'karma.soreng@ecotrails.in',
      address: 'Hee Bermiok, Soreng District, Sikkim - 737121',
      activityTitle: 'Dentam – Hee Bermiok Village Cultural Trek',
      activityDescription: 'Heritage village walking trail with 6 domestic eco-tourists staying at registered local homestays.',
      liaisonOfficer: null,
      fee: '₹100',
      feeAmount: 100,
      isPaid: true,
      paymentStatus: 'PAID',
      paymentTxnRef: 'TXN-SK-2026-81200',
      submissionDate: '16 Oct 2026, 11:15 AM',
      lastUpdated: '30 Oct 2026, 04:30 PM',
      approvalDate: '30 Oct 2026',
      permissionNumber: 'SK-TOUR-2026-TRE-00812',
      approvingOfficer: 'Nima Tshering Lepcha',
      approvingDesignation: 'District Tourism Officer (DTO)',
      approvingOffice: 'District Tourism Office, Soreng Circle, Government of Sikkim',
      requiresHqVerification: false,
      documents: [
        { id: 'doc_1', name: 'Village Route Itinerary', fileName: 'Village_Trek_Route.pdf', size: '1.0 MB', date: '16 Oct 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: 'Local sanction' },
      approvalSheet: null,
      dtoRemarks: 'Local route verified. Statutory trekking permit granted.',
      history: [
        { action: 'Permission Approved', role: 'DTO', officer: 'Nima Tshering Lepcha', office: 'Soreng DTO', date: '30 Oct 2026, 04:30 PM', previousStage: STAGES.STAGE_2, newStage: STAGES.STAGE_12, remarks: 'Statutory village trekking permit issued.' }
      ]
    },

    // 19. TYPE 19: Namchi Circle - Char Dham Marathon (Approved)
    {
      refNo: 'SK-TP-2026-APP-00330',
      flowType: 'flow1',
      flowTitle: 'Flow 1: Namchi Cultural Marathon Sanction (Approved)',
      category: 'Events, Fairs, Melas, Rallies and Marathons',
      categoryKey: 'events',
      customCategoryName: '',
      district: 'Namchi',
      dtoOffice: 'District Tourism Office, Namchi Circle',
      status: STATUSES.APPROVED,
      currentStage: STAGES.STAGE_12,
      currentStageNum: 12,
      assignedRole: 'none',
      applicantName: 'Bhaichung Subba',
      phone: '9434112233',
      email: 'bhaichung.subba@namchi-fest.org',
      address: 'Central Park, Namchi District, Sikkim - 737126',
      activityTitle: 'Char Dham High-Altitude Heritage Half Marathon',
      activityDescription: 'Annual 21km high-altitude marathon promoting sports tourism and eco-awareness in South Sikkim.',
      liaisonOfficer: null,
      fee: 'Free',
      feeAmount: 0,
      isPaid: false,
      paymentStatus: 'NOT_APPLICABLE',
      paymentTxnRef: 'N/A',
      submissionDate: '15 Oct 2026, 08:30 AM',
      lastUpdated: '29 Oct 2026, 03:45 PM',
      approvalDate: '29 Oct 2026',
      permissionNumber: 'SK-TOUR-2026-EVE-00330',
      approvingOfficer: 'Pema Wangchuk Sherpa',
      approvingDesignation: 'District Tourism Officer (DTO)',
      approvingOffice: 'District Tourism Office, Namchi Circle, Government of Sikkim',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_1', name: 'Marathon Route Security Plan', fileName: 'Marathon_Plan.pdf', size: '1.9 MB', date: '15 Oct 2026' }
      ],
      hqVerification: { verified: true, verifiedDate: '27 Oct 2026', eOfficeFileNo: 'EOF-2026-SK-TOUR-3300', remarks: 'Police traffic & medical clearance approved' },
      approvalSheet: { fileName: 'HQ_Approval_Sheet_00330.pdf', size: '1.3 MB', uploadDate: '27 Oct 2026, 10:00 AM', uploadedBy: 'HQ Administrator' },
      dtoRemarks: 'Traffic and medical arrangements verified. Sanction issued.',
      history: [
        { action: 'Permission Approved', role: 'DTO', officer: 'Pema Wangchuk Sherpa', office: 'Namchi DTO', date: '29 Oct 2026, 03:45 PM', previousStage: STAGES.STAGE_11, newStage: STAGES.STAGE_12, remarks: 'Statutory event permit issued.' }
      ]
    },

    // 20. TYPE 20: Gangtok Circle - Satellite Phone Telecommunication Clearance (Submitted)
    {
      refNo: 'SK-TP-2026-APP-00950',
      flowType: 'flow1',
      flowTitle: 'Flow 1: Statutory Satellite Phone Telecommunication Clearance',
      category: 'Satellite Phone Usage Permission',
      categoryKey: 'satellite_phone',
      customCategoryName: '',
      district: 'Gangtok',
      dtoOffice: 'District Tourism Office, Gangtok Circle',
      status: STATUSES.SUBMITTED,
      currentStage: STAGES.STAGE_2,
      currentStageNum: 2,
      assignedRole: 'dto',
      applicantName: 'Arun Sharma',
      phone: '9811002233',
      email: 'arun.sharma@geo-survey.org',
      address: 'Development Area, Gangtok, Sikkim - 737101',
      activityTitle: 'Thangu – Gurudongmar Geological Remote Telecommunication Clearance',
      activityDescription: 'Statutory telecommunication clearance for satellite phone emergency transceiver during geological study in remote wilderness zones.',
      liaisonOfficer: null,
      fee: 'Free',
      feeAmount: 0,
      isPaid: false,
      paymentStatus: 'NOT_APPLICABLE',
      paymentTxnRef: 'N/A',
      submissionDate: '02 Nov 2026, 02:00 PM',
      lastUpdated: '02 Nov 2026, 02:00 PM',
      requiresHqVerification: true,
      documents: [
        { id: 'doc_1', name: 'DoT License / Transceiver Specs', fileName: 'DoT_SatPhone_License.pdf', size: '1.5 MB', date: '02 Nov 2026' }
      ],
      hqVerification: { verified: false, verifiedDate: null, eOfficeFileNo: null, remarks: null },
      approvalSheet: null,
      dtoRemarks: null,
      history: [
        { action: 'Application Submitted', role: 'Citizen', officer: 'Arun Sharma', office: 'Applicant', date: '02 Nov 2026, 02:00 PM', previousStage: 'New Submission', newStage: STAGES.STAGE_2, remarks: 'Statutory satellite phone telecommunication clearance requested.' }
      ]
    }

  ];

  // Public API & State Machine Controller
  const WorkflowEngine = {
    STATUSES: STATUSES,
    STAGES: STAGES,
    DISTRICT_OFFICES: DISTRICT_OFFICES,
    HQ_OFFICER: HQ_OFFICER,

    // Initialize or retrieve applications from localStorage
    getAllApplications: function () {
      try {
        const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
        const raw = localStorage.getItem(STORAGE_KEY);
        
        // Auto-migrate if version is outdated or data is missing
        if (!raw || storedVersion !== CURRENT_SEED_VERSION) {
          this.resetToSeedData();
        }

        const currentRaw = localStorage.getItem(STORAGE_KEY);
        let apps = currentRaw ? JSON.parse(currentRaw) : [];

        // Check if any citizen submission was made via Stage 03 apply.html
        const citizenSubRaw = localStorage.getItem(SUBMITTED_STORAGE_KEY);
        if (citizenSubRaw) {
          const citizenSubs = JSON.parse(citizenSubRaw);
          if (Array.isArray(citizenSubs)) {
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
        return SEED_APPLICATIONS;
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

    // Ingest new application submitted from Stage 03 apply.html
    ingestCitizenSubmission: function (sub) {
      const existing = this.getApplication(sub.refNo);
      if (existing) return existing;

      const dist = sub.district || 'Gangtok';
      const distInfo = DISTRICT_OFFICES[dist] || DISTRICT_OFFICES['Gangtok'];

      const newApp = {
        refNo: sub.refNo,
        flowType: 'flow1',
        flowTitle: 'Standard Application Submission',
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
        requiresHqVerification: (sub.categoryKey === 'trekking' || sub.categoryKey === 'expedition' || sub.categoryKey === 'events' || sub.categoryKey === 'drone'),
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

    // Action 1: DTO Verifies & Forwards Application to HQ (Flow 1, Flow 5)
    dtoVerifyAndForwardToHq: function (refNo, officerName, remarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const oldStage = app.currentStage;
      app.status = STATUSES.SUBMITTED;
      app.currentStage = (oldStage === STAGES.STAGE_7) ? STAGES.STAGE_8 : STAGES.STAGE_3;
      app.currentStageNum = (oldStage === STAGES.STAGE_7) ? 8 : 3;
      app.assignedRole = 'hq'; // Transferred to HQ
      app.dtoRemarks = remarks || 'Local district verification complete. Forwarded to Directorate Headquarters for inter-departmental security concurrence.';

      const officeInfo = DISTRICT_OFFICES[app.district] || DISTRICT_OFFICES['Gangtok'];

      this.addHistoryEntry(app, {
        action: 'Verified & Forwarded to Headquarters',
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

    // Action 2: Direct DTO Approval without HQ (Flow 4 - Local Adventure Activities)
    dtoDirectApprove: function (refNo, officerName, remarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

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
        action: 'Direct Final Approval Granted',
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

    // Action 3: DTO Returns Application to Citizen for Correction (Flow 2)
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

    // Action 4: DTO Rejects Application (Flow 3)
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

    // Action 5: HQ Starts Application Review (Flow 1, Flow 5)
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

    // Action 6: HQ Records External e-Office Concurrence (Flow 1, Flow 5)
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

    // Action 7: HQ Uploads Official Approval Sheet (Flow 1, Flow 5)
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

    // Action 8: HQ Forwards Sanctioned Application Back to DTO (Flow 1, Flow 5)
    hqForwardBackToDto: function (refNo, officerName, remarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      if (!app.approvalSheet) {
        return { success: false, message: 'Cannot forward to DTO: HQ Approval Sheet must be uploaded first.' };
      }

      const oldStage = app.currentStage;
      app.status = STATUSES.SUBMITTED;
      app.currentStage = STAGES.STAGE_11; // Awaiting Final DTO Approval
      app.currentStageNum = 11;
      app.assignedRole = 'dto'; // Back in DTO queue for final approval
      app.hqRemarks = remarks || 'Headquarters verification complete. Sanction sheet attached. Transmitted back to concerned DTO for final approval and issuance.';

      this.addHistoryEntry(app, {
        action: 'Transmitted to DTO with Approval Sheet',
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

    // Action 9: HQ Returns Application to DTO for Correction (Flow 5)
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

    // Action 10: Final DTO Approval (Flow 1, Flow 4, Flow 5)
    dtoFinalApproval: function (refNo, officerName, remarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      // Verify that if HQ verification was required, approval sheet is present
      if (app.requiresHqVerification && !app.approvalSheet) {
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
      app.dtoRemarks = remarks || 'Final departmental approval granted following verification of all statutory requirements and HQ sanction sheet. Permission letter issued.';

      this.addHistoryEntry(app, {
        action: 'Final Approval Granted',
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


    // ==============================================================
    // STAGE 06: DOCUMENT GENERATION & STATUS PACKAGE
    // ==============================================================
    getDocumentPackage: function (refNo) {
      const app = this.getApplication(refNo);
      if (!app) return null;

      const isHqApplicable = !!app.requiresHqVerification;
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

    // Action 11: Citizen Resubmits Corrected Application (Flow 2 & Flow 5)
    citizenResubmit: function (refNo, updatedData, citizenRemarks) {
      const app = this.getApplication(refNo);
      if (!app) return { success: false, message: 'Application not found.' };

      const oldStage = app.currentStage;
      // Preserve ARN, update editable fields
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
        office: 'Applicant',
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
