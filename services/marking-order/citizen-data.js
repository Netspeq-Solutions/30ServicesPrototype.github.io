/**
 * MARKING ORDER SERVICE - STAGE 02 UNIFIED MOCK DATASET &SHARED HELPERS
 * Department: Forest and Environment Department, Government of Sikkim
 * Theme: forest-green
 *
 * Single source of truth for all six roles:
 * 1. Citizen
 * 2. Range Officer (RO)
 * 3. Block Officer (BO)
 * 4. Assistant Conservator of Forests (ACF)
 * 5. Divisional Forest Officer (DFO)
 * 6. Super Admin
 */

window.MarkingOrderData = (function () {
  'use strict';

  // =========================================================================
  // 1. STATUTORY AUTHORITY LIMITS (Section 18 Authority Matrix)
  // RO: Firewood Up to 3 | Timber Up to 3
  // ACF: Firewood Up to 6 | Timber Up to 6
  // DFO: Firewood Up to 10 | Timber Up to 10
  // =========================================================================
  const statutoryLimits = {
    RO: {
      roleName: 'Range Officer (RO)',
      Firewood: 3,
      Timber: 3,
      escalationTarget: 'Assistant Conservator of Forests (ACF)'
    },
    ACF: {
      roleName: 'Assistant Conservator of Forests (ACF)',
      Firewood: 6,
      Timber: 6,
      escalationTarget: 'Divisional Forest Officer (DFO)'
    },
    DFO: {
      roleName: 'Divisional Forest Officer (DFO)',
      Firewood: 10,
      Timber: 10,
      escalationTarget: 'Final In-Scope Approval Authority'
    },
    maxTreesPerApplication: 10
  };

  /**
   * Determine statutory authority classification for an application
   */
  function evaluateAuthority(purpose, treeCount) {
    const roLimit = statutoryLimits.RO[purpose] || 3;
    const acfLimit = statutoryLimits.ACF[purpose] || 6;
    const dfoLimit = statutoryLimits.DFO[purpose] || 10;

    const withinRO = treeCount <= roLimit;
    const withinACF = treeCount <= acfLimit;
    const withinDFO = treeCount <= dfoLimit;

    let competentAuthority = 'DFO';
    if (withinRO) {
      competentAuthority = 'RO';
    } else if (withinACF) {
      competentAuthority = 'ACF';
    }

    return {
      purpose: purpose,
      treeCount: treeCount,
      roLimit: roLimit,
      acfLimit: acfLimit,
      dfoLimit: dfoLimit,
      withinRO: withinRO,
      withinACF: withinACF,
      withinDFO: withinDFO,
      competentAuthority: competentAuthority,
      roClassificationText: withinRO
        ? 'Within RO Authority (' + purpose + ' \u2264 ' + roLimit + ')'
        : 'Exceeds RO Authority (' + purpose + ' > ' + roLimit + ') \u2192 Forward to ACF',
      acfClassificationText: withinACF
        ? 'Within ACF Authority (' + purpose + ' \u2264 ' + acfLimit + ')'
        : 'Exceeds ACF Authority (' + purpose + ' > ' + acfLimit + ') \u2192 Forward to DFO',
      dfoClassificationText: withinDFO
        ? 'Within DFO Final Authority (' + purpose + ' \u2264 ' + dfoLimit + ')'
        : 'Exceeds In-Scope Limit'
    };
  }

  // =========================================================================
  // 2. MASTER CONFIGURATION DATA (Districts, Divisions, Ranges, Species, Purpose)
  // =========================================================================
  const districtsMaster = [
    { code: 'DIST-GTK', name: 'Gangtok', headquarters: 'Gangtok', blocks: ['Ranka GPU', 'Assam Lingzey GPU', 'Samdong Kambal GPU', 'Gangtok Municipal Corporation'] },
    { code: 'DIST-MGN', name: 'Mangan', headquarters: 'Mangan', blocks: ['Kabi Lungchok GPU', 'Chungthang GPU', 'Mangan Nagar Panchayat'] },
    { code: 'DIST-NMC', name: 'Namchi', headquarters: 'Namchi', blocks: ['Namthang GPU', 'Ravangla GPU', 'Namchi Municipal Council'] },
    { code: 'DIST-GYL', name: 'Gyalshing', headquarters: 'Gyalshing', blocks: ['Yuksom GPU', 'Pelling GPU', 'Gyalshing Nagar Panchayat'] },
    { code: 'DIST-PKY', name: 'Pakyong', headquarters: 'Pakyong', blocks: ['Pakyong GPU', 'Rhenock GPU', 'Rongli GPU'] },
    { code: 'DIST-SRG', name: 'Soreng', headquarters: 'Soreng', blocks: ['Soreng GPU', 'Sombaria GPU', 'Mangalbarey GPU'] }
  ];

  const divisionsMaster = [
    { code: 'DIV-GTK', name: 'Gangtok', fullTitle: 'Gangtok Territorial Division', district: 'Gangtok', ranges: ['Ranipool Range', 'Gangtok Range'] },
    { code: 'DIV-MGN', name: 'Mangan', fullTitle: 'Mangan Territorial Division', district: 'Mangan', ranges: ['Mangan Range'] },
    { code: 'DIV-NMC', name: 'Namchi', fullTitle: 'Namchi Territorial Division', district: 'Namchi', ranges: ['Namchi Range', 'Ravangla Range'] },
    { code: 'DIV-GYL', name: 'Gyalshing', fullTitle: 'Gyalshing Territorial Division', district: 'Gyalshing', ranges: ['Gyalshing Range'] },
    { code: 'DIV-PKY', name: 'Pakyong', fullTitle: 'Pakyong Territorial Division', district: 'Pakyong', ranges: ['Pakyong Range'] },
    { code: 'DIV-SRG', name: 'Soreng', fullTitle: 'Soreng Territorial Division', district: 'Soreng', ranges: ['Soreng Range'] }
  ];

  const rangesMaster = [
    { code: 'RNG-RNP', name: 'Ranipool Range', division: 'Gangtok', district: 'Gangtok', blocksCovered: ['Ranka GPU', 'Assam Lingzey GPU'] },
    { code: 'RNG-GTK', name: 'Gangtok Range', division: 'Gangtok', district: 'Gangtok', blocksCovered: ['Samdong Kambal GPU', 'Gangtok Municipal Corporation'] },
    { code: 'RNG-MGN', name: 'Mangan Range', division: 'Mangan', district: 'Mangan', blocksCovered: ['Kabi Lungchok GPU', 'Mangan Nagar Panchayat'] },
    { code: 'RNG-NMC', name: 'Namchi Range', division: 'Namchi', district: 'Namchi', blocksCovered: ['Namthang GPU', 'Namchi Municipal Council'] },
    { code: 'RNG-RVG', name: 'Ravangla Range', division: 'Namchi', district: 'Namchi', blocksCovered: ['Ravangla GPU'] },
    { code: 'RNG-GYL', name: 'Gyalshing Range', division: 'Gyalshing', district: 'Gyalshing', blocksCovered: ['Yuksom GPU', 'Gyalshing Nagar Panchayat'] },
    { code: 'RNG-PKY', name: 'Pakyong Range', division: 'Pakyong', district: 'Pakyong', blocksCovered: ['Pakyong GPU', 'Rhenock GPU'] },
    { code: 'RNG-SRG', name: 'Soreng Range', division: 'Soreng', district: 'Soreng', blocksCovered: ['Soreng GPU', 'Sombaria GPU'] }
  ];

  const treeSpeciesMaster = [
    { code: 'SP-01', commonName: 'Utis', scientificName: 'Alnus nepalensis', category: 'Non-Conifer / Fast Growing' },
    { code: 'SP-02', commonName: 'Chilaune', scientificName: 'Schima wallichii', category: 'Hardwood / Timber & Fuelwood' },
    { code: 'SP-03', commonName: 'Katus', scientificName: 'Castanopsis indica', category: 'Hardwood / Local Construction' },
    { code: 'SP-04', commonName: 'Pipli', scientificName: 'Bucklandia populnea', category: 'High-Value Timber' },
    { code: 'SP-05', commonName: 'Dhupi (Cryptomeria)', scientificName: 'Cryptomeria japonica', category: 'Conifer / Timber' },
    { code: 'SP-06', commonName: 'Tooni', scientificName: 'Toona ciliata', category: 'Timber Species' },
    { code: 'SP-07', commonName: 'Panisaj', scientificName: 'Terminalia myriocarpa', category: 'Hardwood Timber' },
    { code: 'SP-08', commonName: 'Sauer', scientificName: 'Betula alnoides', category: 'Mid-Hill Hardwood' }
  ];

  const purposeMaster = [
    { code: 'PUR-FW', name: 'Firewood', description: 'Domestic / Bonafide household firewood utilization', roMaxTrees: 3, acfMaxTrees: 6, dfoMaxTrees: 10 },
    { code: 'PUR-TM', name: 'Timber', description: 'Domestic / Bonafide house construction & structural repair', roMaxTrees: 3, acfMaxTrees: 6, dfoMaxTrees: 10 }
  ];

  // =========================================================================
  // 3. DEMONSTRATION USERS (Clearly identified as Prototype Demo Users)
  // =========================================================================
  const demoUsers = {
    citizens: [
      {
        id: 'CIT-DEMO-01',
        name: 'Citizen Demo User (Primary)',
        role: 'Citizen',
        department: 'Public Applicant (Sikkim GO Demo)',
        district: 'Gangtok',
        division: 'Gangtok',
        range: 'Ranipool Range',
        mobile: '98000-00101',
        address: 'House No. 42, Upper Ranka Ward, Ranka GPU, Gangtok District, Sikkim - 737103',
        status: 'Active'
      },
      {
        id: 'CIT-DEMO-02',
        name: 'First-Time Citizen Demo User',
        role: 'Citizen',
        department: 'Public Applicant (Sikkim GO Demo)',
        district: 'Mangan',
        division: 'Mangan',
        range: 'Mangan Range',
        mobile: '98000-00102',
        address: 'Kabi Village, Kabi Lungchok GPU, Mangan District, Sikkim - 737116',
        status: 'Active'
      }
    ],
    rangeOfficers: [
      {
        id: 'RO-RANIPOOL',
        name: 'RO Demo User (Ranipool)',
        role: 'Range Officer (RO)',
        department: 'Forest and Environment Department',
        district: 'Gangtok',
        division: 'Gangtok',
        range: 'Ranipool Range',
        status: 'Active'
      },
      {
        id: 'RO-GANGTOK',
        name: 'RO Demo User (Gangtok Range)',
        role: 'Range Officer (RO)',
        department: 'Forest and Environment Department',
        district: 'Gangtok',
        division: 'Gangtok',
        range: 'Gangtok Range',
        status: 'Active'
      },
      {
        id: 'RO-NAMCHI',
        name: 'RO Demo User (Namchi Range)',
        role: 'Range Officer (RO)',
        department: 'Forest and Environment Department',
        district: 'Namchi',
        division: 'Namchi',
        range: 'Namchi Range',
        status: 'Active'
      },
      {
        id: 'RO-PAKYONG',
        name: 'RO Demo User (Pakyong Range)',
        role: 'Range Officer (RO)',
        department: 'Forest and Environment Department',
        district: 'Pakyong',
        division: 'Pakyong',
        range: 'Pakyong Range',
        status: 'Active'
      }
    ],
    blockOfficers: [
      {
        id: 'BO-RANIPOOL-1',
        name: 'BO Demo User 1 (Ranipool Block)',
        role: 'Block Officer (BO)',
        department: 'Forest and Environment Department',
        district: 'Gangtok',
        division: 'Gangtok',
        range: 'Ranipool Range',
        blockName: 'Ranipool Forest Block',
        status: 'Active'
      },
      {
        id: 'BO-RANIPOOL-2',
        name: 'BO Demo User 2 (Assam Lingzey Block)',
        role: 'Block Officer (BO)',
        department: 'Forest and Environment Department',
        district: 'Gangtok',
        division: 'Gangtok',
        range: 'Ranipool Range',
        blockName: 'Assam Lingzey Forest Block',
        status: 'Active'
      },
      {
        id: 'BO-GANGTOK-1',
        name: 'BO Demo User 3 (Gangtok Block)',
        role: 'Block Officer (BO)',
        department: 'Forest and Environment Department',
        district: 'Gangtok',
        division: 'Gangtok',
        range: 'Gangtok Range',
        blockName: 'Gangtok North Block',
        status: 'Active'
      },
      {
        id: 'BO-NAMCHI-1',
        name: 'BO Demo User 4 (Namchi Block)',
        role: 'Block Officer (BO)',
        department: 'Forest and Environment Department',
        district: 'Namchi',
        division: 'Namchi',
        range: 'Namchi Range',
        blockName: 'Namthang Forest Block',
        status: 'Active'
      }
    ],
    acfUsers: [
      {
        id: 'ACF-GANGTOK',
        name: 'ACF Demo User (Gangtok Division)',
        role: 'Assistant Conservator of Forests (ACF)',
        department: 'Forest and Environment Department',
        district: 'Gangtok',
        division: 'Gangtok',
        range: 'All Ranges in Gangtok Division',
        status: 'Active'
      },
      {
        id: 'ACF-NAMCHI',
        name: 'ACF Demo User (Namchi Division)',
        role: 'Assistant Conservator of Forests (ACF)',
        department: 'Forest and Environment Department',
        district: 'Namchi',
        division: 'Namchi',
        range: 'All Ranges in Namchi Division',
        status: 'Active'
      }
    ],
    dfoUsers: [
      {
        id: 'DFO-GANGTOK',
        name: 'DFO Demo User (Gangtok Division)',
        role: 'Divisional Forest Officer (DFO)',
        department: 'Forest and Environment Department',
        district: 'Gangtok',
        division: 'Gangtok',
        range: 'All Ranges in Gangtok Division',
        status: 'Active'
      },
      {
        id: 'DFO-NAMCHI',
        name: 'DFO Demo User (Namchi Division)',
        role: 'Divisional Forest Officer (DFO)',
        department: 'Forest and Environment Department',
        district: 'Namchi',
        division: 'Namchi',
        range: 'All Ranges in Namchi Division',
        status: 'Active'
      }
    ],
    superAdmins: [
      {
        id: 'ADMIN-STATE',
        name: 'Super Admin Demo User',
        role: 'Super Admin',
        department: 'Forest and Environment Department (Headquarters)',
        district: 'Statewide (All 6 Districts)',
        division: 'All Divisions',
        range: 'All Ranges',
        status: 'Active'
      }
    ]
  };

  // Flatten all users for Super Admin User Management table
  function getAllDemoUsers() {
    return [].concat(
      demoUsers.citizens,
      demoUsers.rangeOfficers,
      demoUsers.blockOfficers,
      demoUsers.acfUsers,
      demoUsers.dfoUsers,
      demoUsers.superAdmins
    );
  }

  // =========================================================================
  // 4. UNIFIED APPLICATION DATASET (Consistent across Citizen, RO, BO, ACF, DFO, Super Admin)
  //    Approved Workflow Hierarchy:
  //    1. Application Submitted
  //    2. Verification Scheduled
  //    3. BO Verified
  //    4. RO Review
  //    5. Forwarded to ACF / Marking Order Issue
  //    6. Transit Permit Issue
  // =========================================================================
  const applications = [
    // =========================================================================
    // SECTION 5 & 6 DEMONSTRATION APPLICATIONS (GTK/RAN/2026-27/001 - 008)
    // =========================================================================
    {
      appNo: 'GTK/RAN/2026-27/001',
      ackNo: 'ACK-FED-2026-00201',
      submittedDate: '18 Nov 2026',
      lastUpdatedDate: '18 Nov 2026',
      currentStatus: 'Pending RO Review',
      statusClass: 'status-submitted',
      applicantName: 'Ramesh Kumar',
      relationType: 'Son of',
      relationName: 'Mohan Kumar',
      applicantCategory: 'Individual Citizen',
      phone: '9876543210',
      email: 'ramesh.kumar@sikkimdemo.in',
      address: 'Near Ranipool Bridge, Ranipool',
      district: 'Gangtok',
      division: 'Gangtok Territorial Division',
      range: 'Ranipool Range (T)',
      revenueBlock: 'Ranipool Block',
      gpu: 'Ranipool GPU',
      khasraNo: '101',
      khatiyanParchaNo: 'KP-2024-RNK-0101',
      totalAreaAcres: '1.25 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation (Sukha Khet)',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-01',
      appliedByRole: 'citizen',
      appliedByUserName: 'Ramesh Kumar',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Firewood',
      fellingReason: 'Bonafide domestic firewood and hearth use for winter season.',
      trees: [
        { id: 'T-001-1', species: 'Alnus (Utis)', girthInches: 30, gbhFeet: '2.50 ft', plotNo: '101', estimatedVolumeCuM: 0.85, condition: 'Green / Mature', photoId: 'P-001-1' },
        { id: 'T-001-2', species: 'Alnus (Utis)', girthInches: 28, gbhFeet: '2.33 ft', plotNo: '101', estimatedVolumeCuM: 0.75, condition: 'Over-mature / Top Drying', photoId: 'P-001-2' }
      ],
      assignedBoId: null,
      assignedBoName: null,
      verificationScheduledDate: null,
      verificationCompletedDate: null,
      approvalAuthority: 'RO',
      approvalStatus: 'Pending Preliminary Review',
      approvedByOfficer: null,
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Pending Approval',
      paymentAmount: 50,
      paymentReceiptNo: null,
      paymentDate: null,
      isTransitPermitRequired: false,
      transitPermitStatus: 'Not Required',
      transitPermitNo: null,
      markingOrderNo: null,
      markingOrderIssueDate: null,
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '18 Nov 2026', actor: 'Ramesh Kumar (Citizen)', remarks: 'Application submitted online for 2 Firewood trees in Ranipool Range.' }
      ]
    },
    {
      appNo: 'GTK/RAN/2026-27/002',
      ackNo: 'ACK-FED-2026-00202',
      submittedDate: '17 Nov 2026',
      lastUpdatedDate: '18 Nov 2026',
      currentStatus: 'Verification Scheduled',
      statusClass: 'status-scheduled',
      applicantName: 'Suresh Sharma',
      relationType: 'Son of',
      relationName: 'G. P. Sharma',
      applicantCategory: 'Individual Citizen',
      phone: '9832011223',
      email: 'suresh.sharma@sikkimdemo.in',
      address: 'Martam Busty, Ranipool',
      district: 'Gangtok',
      division: 'Gangtok Territorial Division',
      range: 'Ranipool Range (T)',
      revenueBlock: 'Ranipool Block',
      gpu: 'Martam GPU',
      khasraNo: '102',
      khatiyanParchaNo: 'KP-2024-RNK-0102',
      totalAreaAcres: '2.10 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation (Sukha Khet)',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-01',
      appliedByRole: 'citizen',
      appliedByUserName: 'Suresh Sharma',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Timber',
      fellingReason: 'Bonafide rural house repair and wooden framing material.',
      trees: [
        { id: 'T-002-1', species: 'Oak (Katus)', girthInches: 42, gbhFeet: '3.50 ft', plotNo: '102', estimatedVolumeCuM: 1.45, condition: 'Mature', photoId: 'P-002-1' },
        { id: 'T-002-2', species: 'Pine (Dhupi)', girthInches: 36, gbhFeet: '3.00 ft', plotNo: '102', estimatedVolumeCuM: 1.15, condition: 'Mature', photoId: 'P-002-2' }
      ],
      assignedBoId: 'BO-RANIPOOL-1',
      assignedBoName: 'BO Demo User 1 (Ranipool Block)',
      verificationScheduledDate: '25 Nov 2026',
      verificationCompletedDate: null,
      approvalAuthority: 'RO',
      approvalStatus: 'Verification Scheduled',
      approvedByOfficer: null,
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Pending Verification & Approval',
      paymentAmount: 50,
      paymentReceiptNo: null,
      paymentDate: null,
      isTransitPermitRequired: false,
      transitPermitStatus: 'Not Required',
      transitPermitNo: null,
      markingOrderNo: null,
      markingOrderIssueDate: null,
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '17 Nov 2026', actor: 'Suresh Sharma (Citizen)', remarks: 'Application submitted online for 2 Timber trees.' },
        { stage: 'Verification Scheduled', date: '18 Nov 2026', actor: 'RO Demo User (Ranipool Range)', remarks: 'Scheduled on-site field verification for 25 Nov 2026 and assigned to BO Demo User 1.' }
      ]
    },
    {
      appNo: 'GTK/RAN/2026-27/003',
      ackNo: 'ACK-FED-2026-00203',
      submittedDate: '14 Nov 2026',
      lastUpdatedDate: '16 Nov 2026',
      currentStatus: 'BO Verification Completed',
      statusClass: 'status-verified',
      applicantName: 'Amit Rai',
      relationType: 'Son of',
      relationName: 'B. K. Rai',
      applicantCategory: 'Individual Citizen',
      phone: '9811223344',
      email: 'amit.rai@sikkimdemo.in',
      address: 'Ranka GPU, Gangtok',
      district: 'Gangtok',
      division: 'Gangtok Territorial Division',
      range: 'Ranipool Range (T)',
      revenueBlock: 'Ranipool Block',
      gpu: 'Ranka GPU',
      khasraNo: '103',
      khatiyanParchaNo: 'KP-2024-RNK-0103',
      totalAreaAcres: '1.80 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-01',
      appliedByRole: 'citizen',
      appliedByUserName: 'Amit Rai',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Firewood',
      fellingReason: 'Domestic firewood for bonafide household heating.',
      trees: [
        { id: 'T-003-1', species: 'Alnus (Utis)', girthInches: 32, gbhFeet: '2.67 ft', plotNo: '103', estimatedVolumeCuM: 0.90, condition: 'Mature', photoId: 'P-003-1', verified: true, verifiedSpecies: 'Alnus (Utis)', verifiedGbhFeet: '2.67 ft' },
        { id: 'T-003-2', species: 'Saur', girthInches: 34, gbhFeet: '2.83 ft', plotNo: '103', estimatedVolumeCuM: 0.95, condition: 'Mature', photoId: 'P-003-2', verified: true, verifiedSpecies: 'Saur', verifiedGbhFeet: '2.83 ft' },
        { id: 'T-003-3', species: 'Utis', girthInches: 30, gbhFeet: '2.50 ft', plotNo: '103', estimatedVolumeCuM: 0.80, condition: 'Mature', photoId: 'P-003-3', verified: true, verifiedSpecies: 'Utis', verifiedGbhFeet: '2.50 ft' }
      ],
      assignedBoId: 'BO-RANIPOOL-1',
      assignedBoName: 'BO Demo User 1 (Ranipool Block)',
      verificationScheduledDate: '15 Nov 2026',
      verificationCompletedDate: '16 Nov 2026',
      verificationReport: {
        boName: 'BO Demo User 1 (Ranipool Block)',
        verificationDate: '16 Nov 2026',
        gpsCoordinates: '27.3114� N, 88.5912� E',
        boundaryFindings: 'Verified within private boundaries as per Khatiyan Parcha No. KP-2024-RNK-0103.',
        safetyCompliance: 'Safe for silvicultural removal without hazard to adjoining structures or power lines.',
        treeObservations: 'All 3 trees physically inspected, hammer numbered and eligible for removal.',
        overallRecommendation: 'Recommended for approval under RO statutory limit (3 Firewood trees).'
      },
      approvalAuthority: 'RO',
      approvalStatus: 'Verification Completed � Awaiting RO Decision',
      approvedByOfficer: null,
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Pending RO Decision',
      paymentAmount: 50,
      paymentReceiptNo: null,
      paymentDate: null,
      isTransitPermitRequired: false,
      transitPermitStatus: 'Not Required',
      transitPermitNo: null,
      markingOrderNo: null,
      markingOrderIssueDate: null,
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '14 Nov 2026', actor: 'Amit Rai (Citizen)', remarks: 'Submitted application for 3 Firewood trees.' },
        { stage: 'Verification Scheduled', date: '15 Nov 2026', actor: 'RO Demo User (Ranipool Range)', remarks: 'Assigned to BO Demo User 1.' },
        { stage: 'Field Verification Completed', date: '16 Nov 2026', actor: 'BO Demo User 1 (Ranipool Block)', remarks: 'Completed site inspection and submitted field verification report.' }
      ]
    },
    {
      appNo: 'GTK/RAN/2026-27/004',
      ackNo: 'ACK-FED-2026-00204',
      submittedDate: '12 Nov 2026',
      lastUpdatedDate: '18 Nov 2026',
      currentStatus: 'Forwarded to ACF',
      statusClass: 'status-forwarded',
      applicantName: 'Pema Bhutia',
      relationType: 'Daughter of',
      relationName: 'Tenzing Bhutia',
      applicantCategory: 'Individual Citizen',
      phone: '9733445566',
      email: 'pema.bhutia@sikkimdemo.in',
      address: 'Syari, Gangtok',
      district: 'Gangtok',
      division: 'Gangtok Territorial Division',
      range: 'Ranipool Range (T)',
      revenueBlock: 'Ranipool Block',
      gpu: 'Syari GPU',
      khasraNo: '104',
      khatiyanParchaNo: 'KP-2024-RNK-0104',
      totalAreaAcres: '2.50 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-01',
      appliedByRole: 'citizen',
      appliedByUserName: 'Pema Bhutia',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Timber',
      fellingReason: 'Timber required for traditional wooden house construction and repair.',
      trees: [
        { id: 'T-004-1', species: 'Oak (Katus)', girthInches: 44, gbhFeet: '3.67 ft', plotNo: '104', estimatedVolumeCuM: 1.50, condition: 'Mature', photoId: 'P-004-1', verified: true, verifiedSpecies: 'Oak', verifiedGbhFeet: '3.67 ft' },
        { id: 'T-004-2', species: 'Pine (Dhupi)', girthInches: 40, gbhFeet: '3.33 ft', plotNo: '104', estimatedVolumeCuM: 1.30, condition: 'Mature', photoId: 'P-004-2', verified: true, verifiedSpecies: 'Pine', verifiedGbhFeet: '3.33 ft' },
        { id: 'T-004-3', species: 'Cryptomeria', girthInches: 38, gbhFeet: '3.17 ft', plotNo: '104', estimatedVolumeCuM: 1.20, condition: 'Mature', photoId: 'P-004-3', verified: true, verifiedSpecies: 'Cryptomeria', verifiedGbhFeet: '3.17 ft' },
        { id: 'T-004-4', species: 'Utis', girthInches: 36, gbhFeet: '3.00 ft', plotNo: '104', estimatedVolumeCuM: 1.10, condition: 'Mature', photoId: 'P-004-4', verified: true, verifiedSpecies: 'Utis', verifiedGbhFeet: '3.00 ft' },
        { id: 'T-004-5', species: 'Champ', girthInches: 34, gbhFeet: '2.83 ft', plotNo: '104', estimatedVolumeCuM: 1.05, condition: 'Mature', photoId: 'P-004-5', verified: true, verifiedSpecies: 'Champ', verifiedGbhFeet: '2.83 ft' }
      ],
      assignedBoId: 'BO-RANIPOOL-1',
      assignedBoName: 'BO Demo User 1 (Ranipool Block)',
      verificationScheduledDate: '14 Nov 2026',
      verificationCompletedDate: '15 Nov 2026',
      verificationReport: {
        boName: 'BO Demo User 1 (Ranipool Block)',
        verificationDate: '15 Nov 2026',
        gpsCoordinates: '27.3195� N, 88.6015� E',
        boundaryFindings: 'Verified on private holding. Safe from public road and boundary line.',
        safetyCompliance: 'Silviculturally sound for selective felling.',
        treeObservations: '5 Timber trees inspected and verified.',
        overallRecommendation: 'Recommended. Exceeds RO statutory limit of 3; forwarded to ACF.'
      },
      approvalAuthority: 'ACF',
      approvalStatus: 'Forwarded to ACF Desk (Within ACF limit: 5 Timber <= 6)',
      approvedByOfficer: null,
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Pending ACF Approval',
      paymentAmount: 50,
      paymentReceiptNo: null,
      paymentDate: null,
      isTransitPermitRequired: false,
      transitPermitStatus: 'Not Required',
      transitPermitNo: null,
      markingOrderNo: null,
      markingOrderIssueDate: null,
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '12 Nov 2026', actor: 'Pema Bhutia (Citizen)', remarks: 'Submitted for 5 Timber trees.' },
        { stage: 'BO Verification Completed', date: '15 Nov 2026', actor: 'BO Demo User 1', remarks: 'Site inspection completed.' },
        { stage: 'Forwarded to ACF', date: '18 Nov 2026', actor: 'RO Demo User (Ranipool Range)', remarks: 'Tree count (5 Timber) exceeds RO authority (<=3); forwarded to ACF Gangtok Division.' }
      ]
    },
    {
      appNo: 'GTK/RAN/2026-27/005',
      ackNo: 'ACK-FED-2026-00205',
      submittedDate: '10 Nov 2026',
      lastUpdatedDate: '19 Nov 2026',
      currentStatus: 'Pending DFO Review',
      statusClass: 'status-forwarded',
      applicantName: 'Dinesh Sharma',
      relationType: 'Son of',
      relationName: 'K. L. Sharma',
      applicantCategory: 'Individual Citizen',
      phone: '9800112233',
      email: 'dinesh.sharma@sikkimdemo.in',
      address: 'Tadong, Gangtok',
      district: 'Gangtok',
      division: 'Gangtok Territorial Division',
      range: 'Ranipool Range (T)',
      revenueBlock: 'Ranipool Block',
      gpu: 'Tadong GPU',
      khasraNo: '105',
      khatiyanParchaNo: 'KP-2024-RNK-0105',
      totalAreaAcres: '3.40 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-01',
      appliedByRole: 'citizen',
      appliedByUserName: 'Dinesh Sharma',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Firewood',
      fellingReason: 'Bonafide domestic firewood and winter heating for multi-family holding.',
      trees: [
        { id: 'T-005-1', species: 'Oak', girthInches: 34, gbhFeet: '2.83 ft', plotNo: '105', estimatedVolumeCuM: 0.95, condition: 'Mature', photoId: 'P-005-1', verified: true, verifiedSpecies: 'Oak', verifiedGbhFeet: '2.83 ft' },
        { id: 'T-005-2', species: 'Alnus', girthInches: 32, gbhFeet: '2.67 ft', plotNo: '105', estimatedVolumeCuM: 0.90, condition: 'Mature', photoId: 'P-005-2', verified: true, verifiedSpecies: 'Alnus', verifiedGbhFeet: '2.67 ft' },
        { id: 'T-005-3', species: 'Pine', girthInches: 30, gbhFeet: '2.50 ft', plotNo: '105', estimatedVolumeCuM: 0.85, condition: 'Mature', photoId: 'P-005-3', verified: true, verifiedSpecies: 'Pine', verifiedGbhFeet: '2.50 ft' },
        { id: 'T-005-4', species: 'Chilaune', girthInches: 30, gbhFeet: '2.50 ft', plotNo: '105', estimatedVolumeCuM: 0.85, condition: 'Mature', photoId: 'P-005-4', verified: true, verifiedSpecies: 'Chilaune', verifiedGbhFeet: '2.50 ft' },
        { id: 'T-005-5', species: 'Tooni', girthInches: 28, gbhFeet: '2.33 ft', plotNo: '105', estimatedVolumeCuM: 0.75, condition: 'Mature', photoId: 'P-005-5', verified: true, verifiedSpecies: 'Tooni', verifiedGbhFeet: '2.33 ft' },
        { id: 'T-005-6', species: 'Champ', girthInches: 28, gbhFeet: '2.33 ft', plotNo: '105', estimatedVolumeCuM: 0.75, condition: 'Mature', photoId: 'P-005-6', verified: true, verifiedSpecies: 'Champ', verifiedGbhFeet: '2.33 ft' },
        { id: 'T-005-7', species: 'Saur', girthInches: 26, gbhFeet: '2.17 ft', plotNo: '105', estimatedVolumeCuM: 0.70, condition: 'Mature', photoId: 'P-005-7', verified: true, verifiedSpecies: 'Saur', verifiedGbhFeet: '2.17 ft' },
        { id: 'T-005-8', species: 'Utis', girthInches: 26, gbhFeet: '2.17 ft', plotNo: '105', estimatedVolumeCuM: 0.70, condition: 'Mature', photoId: 'P-005-8', verified: true, verifiedSpecies: 'Utis', verifiedGbhFeet: '2.17 ft' }
      ],
      assignedBoId: 'BO-RANIPOOL-1',
      assignedBoName: 'BO Demo User 1 (Ranipool Block)',
      verificationScheduledDate: '13 Nov 2026',
      verificationCompletedDate: '14 Nov 2026',
      verificationReport: {
        boName: 'BO Demo User 1 (Ranipool Block)',
        verificationDate: '14 Nov 2026',
        gpsCoordinates: '27.3201� N, 88.6102� E',
        boundaryFindings: 'Verified on private holding. Safe from public infrastructure.',
        safetyCompliance: 'Proper spacing maintained.',
        treeObservations: 'All 8 trees verified and measured.',
        overallRecommendation: 'Exceeds RO (3) and ACF (6) limits; forwarded through ACF to DFO for final decision.'
      },
      approvalAuthority: 'DFO',
      approvalStatus: 'Forwarded to DFO Desk for Final Decision (8 Firewood <= 10)',
      approvedByOfficer: null,
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Pending DFO Approval',
      paymentAmount: 50,
      paymentReceiptNo: null,
      paymentDate: null,
      isTransitPermitRequired: false,
      transitPermitStatus: 'Not Required',
      transitPermitNo: null,
      markingOrderNo: null,
      markingOrderIssueDate: null,
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '10 Nov 2026', actor: 'Dinesh Sharma (Citizen)', remarks: 'Submitted for 8 Firewood trees.' },
        { stage: 'BO Verification Completed', date: '14 Nov 2026', actor: 'BO Demo User 1', remarks: 'Verification report submitted.' },
        { stage: 'Forwarded to ACF', date: '16 Nov 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Forwarded beyond RO limit.' },
        { stage: 'Forwarded to DFO', date: '19 Nov 2026', actor: 'ACF Demo User (Gangtok)', remarks: 'Tree count (8) exceeds ACF limit (<=6); escalated to DFO for final decision.' }
      ]
    },
    {
      appNo: 'GTK/RAN/2026-27/006',
      ackNo: 'ACK-FED-2026-00206',
      submittedDate: '20 Sep 2026',
      lastUpdatedDate: '26 Sep 2026',
      currentStatus: 'Marking Order Issued',
      statusClass: 'status-order-issued',
      applicantName: 'Ramesh Kumar',
      relationType: 'Son of',
      relationName: 'Mohan Kumar',
      applicantCategory: 'Individual Citizen',
      phone: '9876543210',
      email: 'ramesh.kumar@sikkimdemo.in',
      address: 'Ranipool, Gangtok',
      district: 'Gangtok',
      division: 'Gangtok Territorial Division',
      range: 'Ranipool Range (T)',
      revenueBlock: 'Ranipool Block',
      gpu: 'Ranipool GPU',
      khasraNo: '101',
      khatiyanParchaNo: 'KP-2024-RNK-0101',
      totalAreaAcres: '2.50 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation (Sukha Khet)',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-01',
      appliedByRole: 'citizen',
      appliedByUserName: 'Ramesh Kumar',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Timber',
      fellingReason: 'Bonafide domestic timber requirement for rural house repair and woodwork.',
      trees: [
        { id: 'T-006-1', species: 'Oak', girthInches: 49, gbhFeet: '4.10 ft', plotNo: '101', estimatedVolumeCuM: 1.85, condition: 'Mature', photoId: 'P-006-1', verified: true, verifiedSpecies: 'Oak', verifiedGbhFeet: '4.10 ft' },
        { id: 'T-006-2', species: 'Pine', girthInches: 38, gbhFeet: '3.20 ft', plotNo: '101', estimatedVolumeCuM: 1.30, condition: 'Mature', photoId: 'P-006-2', verified: true, verifiedSpecies: 'Pine', verifiedGbhFeet: '3.20 ft' },
        { id: 'T-006-3', species: 'Alnus', girthInches: 32, gbhFeet: '2.70 ft', plotNo: '102', estimatedVolumeCuM: 0.95, condition: 'Mature', photoId: 'P-006-3', verified: true, verifiedSpecies: 'Alnus', verifiedGbhFeet: '2.70 ft' }
      ],
      assignedBoId: 'BO-RANIPOOL-1',
      assignedBoName: 'Block Officer, Ranipool',
      verificationScheduledDate: '23 Sep 2026',
      verificationCompletedDate: '24 Sep 2026',
      verificationReport: {
        boName: 'Block Officer, Ranipool',
        verificationDate: '24 Sep 2026',
        gpsCoordinates: '27.3115� N, 88.5915� E',
        boundaryFindings: 'Verified on private holding as per Khatiyan Parcha No. KP-2024-RNK-0101.',
        safetyCompliance: 'Proper safety clearance verified. No hazard to nearby buildings or road.',
        treeObservations: 'All 3 trees physically inspected, hammer marked on saw bench and verified.',
        overallRecommendation: 'Recommended for approval. Within RO statutory limit (3 Timber trees).'
      },
      approvalAuthority: 'RO',
      approvalStatus: 'Approved by RO (Ranipool Range)',
      approvedByOfficer: 'Range Officer / Competent Issuing Officer',
      approvedByRole: 'Range Officer, Ranipool Range (T)',
      approvalDate: '25 Sep 2026',
      paymentStatus: 'Paid / Completed (?50 Paid via Sikkim GO)',
      paymentAmount: 50,
      paymentReceiptNo: 'RCP-SK-2026-0926-0042',
      paymentDate: '26 Sep 2026',
      isTransitPermitRequired: false,
      transitPermitStatus: 'Not Required',
      transitPermitNo: null,
      markingOrderNo: 'MO/GTK/RAN/2026-27/006',
      markingOrderIssueDate: '26 Sep 2026',
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '20 Sep 2026', actor: 'Ramesh Kumar (Citizen)', remarks: 'Application submitted for 3 Timber trees.' },
        { stage: 'Verification Scheduled', date: '22 Sep 2026', actor: 'Range Officer (Ranipool)', remarks: 'Assigned to Block Officer, Ranipool for 23 Sep 2026.' },
        { stage: 'BO Verification Completed', date: '24 Sep 2026', actor: 'Block Officer, Ranipool', remarks: 'Site inspection completed and report submitted.' },
        { stage: 'Application Approved', date: '25 Sep 2026', actor: 'Range Officer (Ranipool)', remarks: 'Approved under RO statutory limit (3 Timber trees <= 3).' },
        { stage: 'Payment Completed', date: '26 Sep 2026', actor: 'Ramesh Kumar (Citizen)', remarks: 'Statutory fee of ?50.00 paid. Transit Permit opted: No.' },
        { stage: 'Marking Order Issued', date: '26 Sep 2026', actor: 'Range Officer / Competent Issuing Officer', remarks: 'Official Marking Order (FORM - D) MO/GTK/RAN/2026-27/006 generated.' }
      ]
    },
    {
      appNo: 'GTK/RAN/2026-27/007',
      ackNo: 'ACK-FED-2026-00207',
      submittedDate: '22 Sep 2026',
      lastUpdatedDate: '29 Sep 2026',
      currentStatus: 'Marking Order Issued',
      statusClass: 'status-order-issued',
      applicantName: 'Karma Dorjee Bhutia',
      relationType: 'Son of',
      relationName: 'Sonam Bhutia',
      applicantCategory: 'Individual Citizen',
      phone: '9833445566',
      email: 'karma.bhutia@sikkimdemo.in',
      address: 'Ranka GPU, Gangtok',
      district: 'Gangtok',
      division: 'Gangtok Territorial Division',
      range: 'Ranipool Range (T)',
      revenueBlock: 'Ranipool Block',
      gpu: 'Ranka GPU',
      khasraNo: '103',
      khatiyanParchaNo: 'KP-2024-RNK-0107',
      totalAreaAcres: '3.10 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      appliedByUserId: 'CIT-DEMO-01',
      appliedByRole: 'citizen',
      appliedByUserName: 'Karma Dorjee Bhutia',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Timber',
      fellingReason: 'Commercial felling with material transport to registered sawmill.',
      trees: [
        { id: 'T-007-1', species: 'Oak', girthInches: 54, gbhFeet: '4.50 ft', plotNo: '103', estimatedVolumeCuM: 2.10, condition: 'Mature', photoId: 'P-007-1', verified: true, verifiedSpecies: 'Oak', verifiedGbhFeet: '4.50 ft' },
        { id: 'T-007-2', species: 'Pine', girthInches: 46, gbhFeet: '3.80 ft', plotNo: '103', estimatedVolumeCuM: 1.60, condition: 'Mature', photoId: 'P-007-2', verified: true, verifiedSpecies: 'Pine', verifiedGbhFeet: '3.80 ft' },
        { id: 'T-007-3', species: 'Chilaune', girthInches: 37, gbhFeet: '3.10 ft', plotNo: '104', estimatedVolumeCuM: 1.25, condition: 'Mature', photoId: 'P-007-3', verified: true, verifiedSpecies: 'Chilaune', verifiedGbhFeet: '3.10 ft' }
      ],
      assignedBoId: 'BO-RANIPOOL-1',
      assignedBoName: 'Block Officer, Ranipool',
      verificationScheduledDate: '25 Sep 2026',
      verificationCompletedDate: '26 Sep 2026',
      verificationReport: {
        boName: 'Block Officer, Ranipool',
        verificationDate: '26 Sep 2026',
        gpsCoordinates: '27.3188� N, 88.5980� E',
        boundaryFindings: 'Verified on private holding. Clear of boundaries.',
        safetyCompliance: 'Proper safety clearance observed.',
        treeObservations: 'All 3 trees physically inspected and verified.',
        overallRecommendation: 'Approved with Transit Permit for highway corridor movement.'
      },
      approvalAuthority: 'RO',
      approvalStatus: 'Approved by RO (Ranipool Range)',
      approvedByOfficer: 'Range Officer / Competent Issuing Officer',
      approvedByRole: 'Range Officer, Ranipool Range (T)',
      approvalDate: '27 Sep 2026',
      paymentStatus: 'Paid / Completed (?50 Paid via Sikkim GO)',
      paymentAmount: 50,
      paymentReceiptNo: 'RCP-SK-2026-0928-0058',
      paymentDate: '28 Sep 2026',
      isTransitPermitRequired: true,
      transitPermitStatus: 'Approved/Issued',
      transitPermitNo: 'TP/SK/2026/014',
      transitPermitIssueDate: '29 Sep 2026',
      transitPermitRoute: 'Ranka GPU to Ranipool Sawmill via NH-10',
      transitPermitOfficer: 'DFO (Gangtok Territorial Division)',
      transitPermitRemarks: 'Transit Permit issued for felling material movement along approved NH-10 corridor.',
      markingOrderNo: 'MO/GTK/RAN/2026-27/007',
      markingOrderIssueDate: '28 Sep 2026',
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '22 Sep 2026', actor: 'Karma Dorjee Bhutia', remarks: 'Submitted for 3 Timber trees.' },
        { stage: 'BO Verification Completed', date: '26 Sep 2026', actor: 'Block Officer, Ranipool', remarks: 'Verification report submitted.' },
        { stage: 'Application Approved', date: '27 Sep 2026', actor: 'Range Officer (Ranipool)', remarks: 'Approved within RO limit.' },
        { stage: 'Payment Completed', date: '28 Sep 2026', actor: 'Karma Dorjee Bhutia', remarks: 'Fee paid. Transit Permit opted: Yes.' },
        { stage: 'Marking Order Issued', date: '28 Sep 2026', actor: 'Range Officer', remarks: 'Marking Order issued.' },
        { stage: 'Transit Permit Issued', date: '29 Sep 2026', actor: 'DFO (Gangtok Territorial Division)', remarks: 'Transit Permit TP/SK/2026/014 issued for NH-10 corridor movement.' }
      ]
    },
    {
      appNo: 'GTK/RAN/2026-27/008',
      ackNo: 'ACK-FED-2026-00208',
      submittedDate: '24 Sep 2026',
      lastUpdatedDate: '30 Sep 2026',
      currentStatus: 'Payment Completed � Transit Permit Pending',
      statusClass: 'status-verified',
      applicantName: 'Sonam Wangdi Lepcha',
      relationType: 'Son of',
      relationName: 'Tashi Lepcha',
      applicantCategory: 'Individual Citizen',
      phone: '9811002233',
      email: 'sonam.lepcha@sikkimdemo.in',
      address: 'Assam Lingzey, Ranipool',
      district: 'Gangtok',
      division: 'Gangtok Territorial Division',
      range: 'Ranipool Range (T)',
      revenueBlock: 'Ranipool Block',
      gpu: 'Assam Lingzey GPU',
      khasraNo: '108',
      khatiyanParchaNo: 'KP-2024-RNK-0108',
      totalAreaAcres: '2.80 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      appliedByUserId: 'CIT-DEMO-01',
      appliedByRole: 'citizen',
      appliedByUserName: 'Sonam Wangdi Lepcha',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Timber',
      fellingReason: 'Timber required for domestic construction with inter-block movement.',
      trees: [
        { id: 'T-008-1', species: 'Oak', girthInches: 46, gbhFeet: '3.83 ft', plotNo: '108', estimatedVolumeCuM: 1.60, condition: 'Mature', photoId: 'P-008-1', verified: true, verifiedSpecies: 'Oak', verifiedGbhFeet: '3.83 ft' },
        { id: 'T-008-2', species: 'Pine', girthInches: 40, gbhFeet: '3.33 ft', plotNo: '108', estimatedVolumeCuM: 1.30, condition: 'Mature', photoId: 'P-008-2', verified: true, verifiedSpecies: 'Pine', verifiedGbhFeet: '3.33 ft' },
        { id: 'T-008-3', species: 'Cryptomeria', girthInches: 36, gbhFeet: '3.00 ft', plotNo: '108', estimatedVolumeCuM: 1.15, condition: 'Mature', photoId: 'P-008-3', verified: true, verifiedSpecies: 'Cryptomeria', verifiedGbhFeet: '3.00 ft' },
        { id: 'T-008-4', species: 'Alnus', girthInches: 32, gbhFeet: '2.67 ft', plotNo: '108', estimatedVolumeCuM: 0.90, condition: 'Mature', photoId: 'P-008-4', verified: true, verifiedSpecies: 'Alnus', verifiedGbhFeet: '2.67 ft' }
      ],
      assignedBoId: 'BO-RANIPOOL-2',
      assignedBoName: 'Block Officer, Assam Lingzey',
      verificationScheduledDate: '27 Sep 2026',
      verificationCompletedDate: '28 Sep 2026',
      verificationReport: {
        boName: 'Block Officer, Assam Lingzey',
        verificationDate: '28 Sep 2026',
        gpsCoordinates: '27.2980� N, 88.5820� E',
        boundaryFindings: 'Verified within private plot. Clear title verified.',
        safetyCompliance: 'Proper safety observed.',
        treeObservations: 'All 4 trees physically inspected.',
        overallRecommendation: 'Approved. Forwarded for ACF approval and Transit Permit issuance.'
      },
      approvalAuthority: 'ACF',
      approvalStatus: 'Approved by ACF (Gangtok Division)',
      approvedByOfficer: 'ACF Demo User (Gangtok Division)',
      approvedByRole: 'Assistant Conservator of Forests',
      approvalDate: '29 Sep 2026',
      paymentStatus: 'Paid / Completed (?50 Paid via Sikkim GO)',
      paymentAmount: 50,
      paymentReceiptNo: 'RCP-SK-2026-0930-0071',
      paymentDate: '30 Sep 2026',
      isTransitPermitRequired: true,
      transitPermitStatus: 'Pending with ACF/DFO',
      transitPermitNo: null,
      markingOrderNo: 'MO/GTK/RAN/2026-27/008',
      markingOrderIssueDate: '30 Sep 2026',
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '24 Sep 2026', actor: 'Sonam Wangdi Lepcha', remarks: 'Submitted for 4 Timber trees.' },
        { stage: 'BO Verification Completed', date: '28 Sep 2026', actor: 'Block Officer, Assam Lingzey', remarks: 'Verification completed.' },
        { stage: 'Approved by ACF', date: '29 Sep 2026', actor: 'ACF Gangtok Division', remarks: 'Approved within ACF statutory limit (4 Timber <= 6).' },
        { stage: 'Payment Completed', date: '30 Sep 2026', actor: 'Sonam Wangdi Lepcha', remarks: 'Payment of ?50.00 confirmed. Transit Permit opted: Yes.' },
        { stage: 'Transit Permit Pending Action', date: '30 Sep 2026', actor: 'System Gateway', remarks: 'Transit Permit action pending clearance by ACF/DFO desk. Official document download locked until Transit Permit is issued.' }
      ]
    },
    // 1. Submitted Application (Pending RO Preliminary Scrutiny) - Citizen Scenario 2
    {
      appNo: 'SK-MO-2026-00101',
      submittedByCitizenId: 'CIT-DEMO-01',
      submittedByCitizenName: 'Citizen Demo User (Primary)',
      applicationFor: 'Self',
      applicantName: 'Citizen Demo User (Primary)',
      firstName: 'Citizen',
      middleName: 'Demo',
      lastName: 'User',
      relationType: 'Father',
      relationName: 'Guardian Demo Record A',
      mobile: '98000-00101',
      permanentAddress: {
        address1: 'House No. 42, Upper Ranka Ward',
        address2: 'Near Ranka Monastery Road',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'House No. 42, Upper Ranka Ward',
        address2: 'Near Ranka Monastery Road',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Ranipool Range',
      purpose: 'Firewood',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_104_ranka.pdf', mandatory: true, status: 'Attached' }
      ],
      trees: [
        { treeNo: 1, species: 'Utis (Alnus nepalensis)', plotNo: '104/A', gbhFeet: '4.2 ft', boMatchStatus: 'Pending' },
        { treeNo: 2, species: 'Utis (Alnus nepalensis)', plotNo: '104/A', gbhFeet: '3.8 ft', boMatchStatus: 'Pending' },
        { treeNo: 3, species: 'Chilaune (Schima wallichii)', plotNo: '104/B', gbhFeet: '4.5 ft', boMatchStatus: 'Pending' }
      ],
      additionalRemarks: 'Requesting tree marking for bonafide domestic household firewood before winter.',
      submissionDate: '16 Nov 2026',
      lastUpdatedDate: '16 Nov 2026',
      workflowStageIndex: 1, // 1: Application Submitted
      currentStatus: 'Application Submitted',
      roQueue: 'pending',
      assignedBoId: null,
      assignedBoName: 'Unassigned (Pending RO Assignment)',
      verificationDate: null,
      boAssignedDate: null,
      boReportDate: null,
      boForwardedWithRemarks: false,
      boRemarks: null,
      forwardedByRo: null,
      forwardedToAcfDate: null,
      forwardedByAcf: null,
      forwardedToDfoDate: null,
      approvalStatus: 'Pending',
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Not Applicable Yet',
      markingOrderStatus: 'Not Issued',
      markingOrderNo: null,
      markingOrderIssueDate: null,
      markingOrderValidity: null,
      transitPermitStatus: 'Not Applicable Yet',
      transitPermitNo: null,
      rejectionDate: null,
      rejectionReason: null,
      departmentRemarks: 'Application received online and routed to Range Officer, Ranipool Range for preliminary verification.',
      nextExpectedAction: 'Range Officer (Ranipool Range) will perform preliminary verification and schedule field verification.',
      requiresCitizenAction: false,
      requiredCitizenActionText: null,
      pendingWithRole: 'Range Officer (Ranipool Range)',
      pendingSinceDate: '16 Nov 2026',
      daysDelayed: 3,
      history: [
        { stage: 'Application Submitted', date: '16 Nov 2026', actor: 'Citizen Demo User (Primary)', remarks: 'Application submitted online with Land Parcha/Khatiyan and 3 tree entries.' }
      ]
    },

    // 2. Verification Scheduled (Due Today for BO-RANIPOOL-1) - Citizen Scenario 3
    {
      appNo: 'SK-MO-2026-00102',
      submittedByCitizenId: 'CIT-DEMO-01',
      submittedByCitizenName: 'Citizen Demo User (Primary)',
      applicationFor: 'Self',
      applicantName: 'Citizen Demo User (Primary)',
      firstName: 'Citizen',
      middleName: 'Demo',
      lastName: 'User',
      relationType: 'Father',
      relationName: 'Guardian Demo Record A',
      mobile: '98000-00101',
      permanentAddress: {
        address1: 'House No. 42, Upper Ranka Ward',
        address2: 'Near Ranka Monastery Road',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'House No. 42, Upper Ranka Ward',
        address2: 'Near Ranka Monastery Road',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Ranipool Range',
      purpose: 'Timber',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_215_ranka.pdf', mandatory: true, status: 'Verified by RO' }
      ],
      trees: [
        { treeNo: 1, species: 'Chilaune (Schima wallichii)', plotNo: '215', gbhFeet: '5.1 ft', boMatchStatus: 'Scheduled' },
        { treeNo: 2, species: 'Katus (Castanopsis indica)', plotNo: '215', gbhFeet: '4.9 ft', boMatchStatus: 'Scheduled' }
      ],
      additionalRemarks: 'Timber required for residential roof beam repair.',
      submissionDate: '12 Nov 2026',
      lastUpdatedDate: '15 Nov 2026',
      workflowStageIndex: 2, // 2: Verification Scheduled
      currentStatus: 'Verification Scheduled',
      roQueue: 'scheduled',
      assignedBoId: 'BO-RANIPOOL-1',
      assignedBoName: 'BO Demo User 1 (Ranipool Block)',
      boAssignedDate: '15 Nov 2026',
      verificationDate: '19 Nov 2026',
      boScheduleTag: 'Due Today',
      boReportDate: null,
      boForwardedWithRemarks: false,
      boRemarks: null,
      forwardedByRo: null,
      forwardedToAcfDate: null,
      forwardedByAcf: null,
      forwardedToDfoDate: null,
      approvalStatus: 'Pending',
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Not Applicable Yet',
      markingOrderStatus: 'Not Issued',
      markingOrderNo: null,
      markingOrderIssueDate: null,
      markingOrderValidity: null,
      transitPermitStatus: 'Not Applicable Yet',
      transitPermitNo: null,
      rejectionDate: null,
      rejectionReason: null,
      departmentRemarks: 'Preliminary scrutiny completed by RO. On-site field verification scheduled for 19 Nov 2026 and assigned to BO Demo User 1 (Ranipool Block).',
      nextExpectedAction: 'Block Officer will conduct on-site verification of land and 2 trees on the scheduled date.',
      requiresCitizenAction: false,
      requiredCitizenActionText: null,
      pendingWithRole: 'BO Demo User 1 (Ranipool Block)',
      pendingSinceDate: '15 Nov 2026',
      daysDelayed: 4,
      history: [
        { stage: 'Application Submitted', date: '12 Nov 2026', actor: 'Citizen Demo User (Primary)', remarks: 'Application submitted for 2 Timber trees.' },
        { stage: 'Verification Scheduled', date: '15 Nov 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Assigned to BO Demo User 1 (Ranipool Block) for field verification on 19 Nov 2026.' }
      ]
    },

    // 3. BO Verification Completed (Report Submitted to RO) - Citizen Scenario 4
    {
      appNo: 'SK-MO-2026-00103',
      submittedByCitizenId: 'CIT-DEMO-01',
      submittedByCitizenName: 'Citizen Demo User (Primary)',
      applicationFor: 'Self',
      applicantName: 'Citizen Demo User (Primary)',
      firstName: 'Citizen',
      middleName: 'Demo',
      lastName: 'User',
      relationType: 'Father',
      relationName: 'Guardian Demo Record A',
      mobile: '98000-00101',
      permanentAddress: {
        address1: 'House No. 42, Upper Ranka Ward',
        address2: 'Near Ranka Monastery Road',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'House No. 42, Upper Ranka Ward',
        address2: 'Near Ranka Monastery Road',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Ranipool Range',
      purpose: 'Firewood',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_118_ranka.pdf', mandatory: true, status: 'Verified' },
        { name: 'BO Field Verification Report', fileName: 'bo_verification_report_00103.pdf', mandatory: false, status: 'Uploaded by BO' }
      ],
      trees: [
        { treeNo: 1, species: 'Utis (Alnus nepalensis)', plotNo: '118', gbhFeet: '4.0 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 2, species: 'Utis (Alnus nepalensis)', plotNo: '118', gbhFeet: '4.4 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 3, species: 'Chilaune (Schima wallichii)', plotNo: '118', gbhFeet: '3.9 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 4, species: 'Sauer (Betula alnoides)', plotNo: '119', gbhFeet: '4.1 ft', boMatchStatus: 'Matched on Site' }
      ],
      additionalRemarks: '4 mature trees on private dry field edge.',
      submissionDate: '08 Nov 2026',
      lastUpdatedDate: '16 Nov 2026',
      workflowStageIndex: 3, // 3: BO Verified
      currentStatus: 'BO Verified',
      roQueue: 'reports_submitted',
      assignedBoId: 'BO-RANIPOOL-1',
      assignedBoName: 'BO Demo User 1 (Ranipool Block)',
      boAssignedDate: '11 Nov 2026',
      verificationDate: '15 Nov 2026',
      boScheduleTag: 'Report Submitted',
      boReportDate: '16 Nov 2026',
      boForwardedWithRemarks: false,
      boRemarks: 'All 4 trees physically inspected on Plot 118/119. Species and GBH match application records. GPS coordinates and site photographs recorded.',
      forwardedByRo: null,
      forwardedToAcfDate: null,
      forwardedByAcf: null,
      forwardedToDfoDate: null,
      approvalStatus: 'Pending RO Decision',
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Not Applicable Yet',
      markingOrderStatus: 'Not Issued',
      markingOrderNo: null,
      markingOrderIssueDate: null,
      markingOrderValidity: null,
      transitPermitStatus: 'Not Applicable Yet',
      transitPermitNo: null,
      rejectionDate: null,
      rejectionReason: null,
      departmentRemarks: 'Block Officer has completed site inspection and submitted the verification report to the Range Officer.',
      nextExpectedAction: 'Range Officer review of submitted BO verification report (Within RO statutory limit: Firewood \u2264 5 trees).',
      requiresCitizenAction: false,
      requiredCitizenActionText: null,
      pendingWithRole: 'RO Demo User (Ranipool)',
      pendingSinceDate: '16 Nov 2026',
      daysDelayed: 3,
      history: [
        { stage: 'Application Submitted', date: '08 Nov 2026', actor: 'Citizen Demo User (Primary)', remarks: 'Submitted for 4 Firewood trees.' },
        { stage: 'Verification Scheduled', date: '11 Nov 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Field verification scheduled for 15 Nov 2026.' },
        { stage: 'BO Verified', date: '16 Nov 2026', actor: 'BO Demo User 1 (Ranipool Block)', remarks: 'On-site tree verification completed and report submitted to RO.' }
      ]
    },

    // 4. Application Under RO Review + APPLY FOR OTHERS Demo - Citizen Scenario 5 & Section 13.2
    {
      appNo: 'SK-MO-2026-00104',
      submittedByCitizenId: 'CIT-DEMO-01',
      submittedByCitizenName: 'Citizen Demo User (Primary)',
      applicationFor: 'Apply for Others',
      applicantName: 'Beneficiary Applicant Demo (Landowner)',
      firstName: 'Beneficiary',
      middleName: 'Applicant',
      lastName: 'Demo',
      relationType: 'Husband',
      relationName: 'Spouse Demo Record B',
      mobile: '98000-00222',
      permanentAddress: {
        address1: 'Plot No. 88, Lower Assam Lingzey',
        address2: 'Assam Lingzey Ward 3',
        district: 'Gangtok',
        blockGpu: 'Assam Lingzey GPU',
        sameAsPermanent: false
      },
      residentialAddress: {
        address1: 'C/O Citizen Demo User, House No. 42, Upper Ranka',
        address2: 'Ranka Monastery Road',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Ranipool Range',
      purpose: 'Timber',
      khatiyanInApplicantName: false,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_309_assam_lingzey.pdf', mandatory: true, status: 'Verified' },
        { name: 'NOC from Land Owner / Revenue Officer', fileName: 'noc_landowner_revenue_309.pdf', mandatory: true, status: 'Verified' },
        { name: 'BO Field Verification Report', fileName: 'bo_verification_report_00104.pdf', mandatory: false, status: 'Verified' }
      ],
      trees: [
        { treeNo: 1, species: 'Dhupi (Cryptomeria japonica)', plotNo: '309', gbhFeet: '5.4 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 2, species: 'Dhupi (Cryptomeria japonica)', plotNo: '309', gbhFeet: '5.0 ft', boMatchStatus: 'Matched on Site' }
      ],
      additionalRemarks: 'Submitted on behalf of senior landowner residing temporarily with family in Ranka.',
      submissionDate: '05 Nov 2026',
      lastUpdatedDate: '17 Nov 2026',
      workflowStageIndex: 4, // 4: RO Review
      currentStatus: 'RO Review',
      roQueue: 'reports_submitted',
      assignedBoId: 'BO-RANIPOOL-2',
      assignedBoName: 'BO Demo User 2 (Assam Lingzey Block)',
      boAssignedDate: '08 Nov 2026',
      verificationDate: '13 Nov 2026',
      boScheduleTag: 'Report Submitted',
      boReportDate: '14 Nov 2026',
      boForwardedWithRemarks: false,
      boRemarks: 'Both Cryptomeria trees verified on Plot 309. Land Owner NOC verified on site.',
      forwardedByRo: null,
      forwardedToAcfDate: null,
      forwardedByAcf: null,
      forwardedToDfoDate: null,
      approvalStatus: 'Under RO Final Review',
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Not Applicable Yet',
      markingOrderStatus: 'Not Issued',
      markingOrderNo: null,
      markingOrderIssueDate: null,
      markingOrderValidity: null,
      transitPermitStatus: 'Not Applicable Yet',
      transitPermitNo: null,
      rejectionDate: null,
      rejectionReason: null,
      departmentRemarks: 'Application submitted under "Apply for Others" is currently under Range Officer review following BO verification.',
      nextExpectedAction: 'Range Officer decision (Within RO authority: Timber \u2264 2 trees).',
      requiresCitizenAction: false,
      requiredCitizenActionText: null,
      pendingWithRole: 'RO Demo User (Ranipool)',
      pendingSinceDate: '14 Nov 2026',
      daysDelayed: 5,
      history: [
        { stage: 'Application Submitted', date: '05 Nov 2026', actor: 'Citizen Demo User (Primary) [On behalf of Beneficiary Applicant Demo]', remarks: 'Submitted under Apply for Others with Land Parcha and Land Owner NOC.' },
        { stage: 'Verification Scheduled', date: '08 Nov 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Assigned to BO Demo User 2 (Assam Lingzey Block).' },
        { stage: 'BO Verified', date: '14 Nov 2026', actor: 'BO Demo User 2 (Assam Lingzey Block)', remarks: 'Site verification report submitted.' },
        { stage: 'RO Review', date: '17 Nov 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Verification report under final scrutiny by Range Officer.' }
      ]
    },

    // 5. Application Forwarded to ACF (Exceeds RO limit: Firewood 8 trees > 5, Within ACF limit <= 10) - Citizen Scenario 6
    {
      appNo: 'SK-MO-2026-00105',
      submittedByCitizenId: 'CIT-DEMO-01',
      submittedByCitizenName: 'Citizen Demo User (Primary)',
      applicationFor: 'Self',
      applicantName: 'Citizen Demo User (Primary)',
      firstName: 'Citizen',
      middleName: 'Demo',
      lastName: 'User',
      relationType: 'Father',
      relationName: 'Guardian Demo Record A',
      mobile: '98000-00101',
      permanentAddress: {
        address1: 'House No. 42, Upper Ranka Ward',
        address2: 'Near Ranka Monastery Road',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'House No. 42, Upper Ranka Ward',
        address2: 'Near Ranka Monastery Road',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Ranipool Range',
      purpose: 'Firewood',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_410_ranka.pdf', mandatory: true, status: 'Verified' },
        { name: 'BO Field Verification Report', fileName: 'bo_verification_report_00105.pdf', mandatory: false, status: 'Verified' }
      ],
      trees: [
        { treeNo: 1, species: 'Utis (Alnus nepalensis)', plotNo: '410', gbhFeet: '4.1 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 2, species: 'Utis (Alnus nepalensis)', plotNo: '410', gbhFeet: '3.9 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 3, species: 'Utis (Alnus nepalensis)', plotNo: '410', gbhFeet: '4.3 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 4, species: 'Chilaune (Schima wallichii)', plotNo: '410', gbhFeet: '4.6 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 5, species: 'Chilaune (Schima wallichii)', plotNo: '411', gbhFeet: '4.2 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 6, species: 'Katus (Castanopsis indica)', plotNo: '411', gbhFeet: '4.8 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 7, species: 'Sauer (Betula alnoides)', plotNo: '411', gbhFeet: '3.7 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 8, species: 'Utis (Alnus nepalensis)', plotNo: '411', gbhFeet: '4.0 ft', boMatchStatus: 'Matched on Site' }
      ],
      additionalRemarks: '8 dry/over-mature firewood trees on private holding.',
      submissionDate: '01 Nov 2026',
      lastUpdatedDate: '15 Nov 2026',
      workflowStageIndex: 5, // 5: Forwarded to ACF / Marking Order Issue
      currentStatus: 'Forwarded to ACF',
      roQueue: 'forwarded',
      acfQueue: 'pending',
      assignedBoId: 'BO-RANIPOOL-1',
      assignedBoName: 'BO Demo User 1 (Ranipool Block)',
      boAssignedDate: '04 Nov 2026',
      verificationDate: '09 Nov 2026',
      boScheduleTag: 'Report Submitted',
      boReportDate: '10 Nov 2026',
      boForwardedWithRemarks: false,
      boRemarks: 'All 8 trees verified on Plots 410 & 411. Recommended for marking.',
      forwardedByRo: 'RO Demo User (Ranipool)',
      forwardedToAcfDate: '15 Nov 2026',
      forwardedByAcf: null,
      forwardedToDfoDate: null,
      approvalStatus: 'Pending ACF Review',
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Not Applicable Yet',
      markingOrderStatus: 'Not Issued',
      markingOrderNo: null,
      markingOrderIssueDate: null,
      markingOrderValidity: null,
      transitPermitStatus: 'Not Applicable Yet',
      transitPermitNo: null,
      rejectionDate: null,
      rejectionReason: null,
      departmentRemarks: 'Forwarded by Range Officer to Assistant Conservator of Forests (ACF, Gangtok Division) as requested Firewood count (8 trees) exceeds RO statutory limit of 5 trees.',
      nextExpectedAction: 'ACF (Gangtok Division) review and decision within ACF statutory limit (Firewood \u2264 10 trees).',
      requiresCitizenAction: false,
      requiredCitizenActionText: null,
      pendingWithRole: 'ACF Demo User (Gangtok Division)',
      pendingSinceDate: '15 Nov 2026',
      daysDelayed: 4,
      history: [
        { stage: 'Application Submitted', date: '01 Nov 2026', actor: 'Citizen Demo User (Primary)', remarks: 'Application submitted for 8 Firewood trees.' },
        { stage: 'Verification Scheduled', date: '04 Nov 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Scheduled verification with BO Demo User 1.' },
        { stage: 'BO Verified', date: '10 Nov 2026', actor: 'BO Demo User 1 (Ranipool Block)', remarks: 'All 8 trees verified on site.' },
        { stage: 'RO Review', date: '14 Nov 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Report reviewed; tree count (8) exceeds RO statutory authority (Firewood \u2264 5).' },
        { stage: 'Forwarded to ACF', date: '15 Nov 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Forwarded to ACF (Gangtok Division) for statutory decision.' }
      ]
    },

    // 6. Approved - Application Fee Payment Pending (ACTION REQUIRED) - Citizen Scenario 7
    {
      appNo: 'SK-MO-2026-00106',
      submittedByCitizenId: 'CIT-DEMO-01',
      submittedByCitizenName: 'Citizen Demo User (Primary)',
      applicationFor: 'Self',
      applicantName: 'Citizen Demo User (Primary)',
      firstName: 'Citizen',
      middleName: 'Demo',
      lastName: 'User',
      relationType: 'Father',
      relationName: 'Guardian Demo Record A',
      mobile: '98000-00101',
      permanentAddress: {
        address1: 'House No. 42, Upper Ranka Ward',
        address2: 'Near Ranka Monastery Road',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'House No. 42, Upper Ranka Ward',
        address2: 'Near Ranka Monastery Road',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Ranipool Range',
      purpose: 'Firewood',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_109_ranka.pdf', mandatory: true, status: 'Verified' },
        { name: 'BO Field Verification Report', fileName: 'bo_verification_report_00106.pdf', mandatory: false, status: 'Verified' }
      ],
      trees: [
        { treeNo: 1, species: 'Utis (Alnus nepalensis)', plotNo: '109', gbhFeet: '4.3 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 2, species: 'Utis (Alnus nepalensis)', plotNo: '109', gbhFeet: '4.0 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 3, species: 'Chilaune (Schima wallichii)', plotNo: '109', gbhFeet: '4.5 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 4, species: 'Chilaune (Schima wallichii)', plotNo: '109', gbhFeet: '4.1 ft', boMatchStatus: 'Matched on Site' }
      ],
      additionalRemarks: '4 Firewood trees approved by RO.',
      submissionDate: '25 Oct 2026',
      lastUpdatedDate: '16 Nov 2026',
      workflowStageIndex: 4, // Approved at RO Review; awaiting payment before Stage 5 Marking Order Issue
      currentStatus: 'Approved � Fee Payment Pending',
      roQueue: 'approved',
      assignedBoId: 'BO-RANIPOOL-1',
      assignedBoName: 'BO Demo User 1 (Ranipool Block)',
      boAssignedDate: '28 Oct 2026',
      verificationDate: '04 Nov 2026',
      boScheduleTag: 'Report Submitted',
      boReportDate: '05 Nov 2026',
      boForwardedWithRemarks: false,
      boRemarks: '4 Firewood trees verified on Plot 109.',
      forwardedByRo: null,
      forwardedToAcfDate: null,
      forwardedByAcf: null,
      forwardedToDfoDate: null,
      approvalStatus: 'Application Approved',
      approvedByRole: 'Range Officer (Ranipool Range)',
      approvalDate: '16 Nov 2026',
      paymentStatus: 'Application Fee Payment Pending',
      markingOrderStatus: 'Pending Payment Confirmation (Not Yet Issued)',
      markingOrderNo: null,
      markingOrderIssueDate: null,
      markingOrderValidity: null,
      transitPermitStatus: 'Not Applicable Yet',
      transitPermitNo: null,
      rejectionDate: null,
      rejectionReason: null,
      departmentRemarks: 'Application approved by Range Officer within statutory authority (Firewood \u2264 5 trees). Please complete the applicable fee payment so that the Marking Order can be issued.',
      nextExpectedAction: 'Citizen action required: Complete application fee payment to enable Marking Order issuance.',
      requiresCitizenAction: true,
      requiredCitizenActionType: 'PAYMENT_PENDING',
      requiredCitizenActionText: 'Application Fee Payment Pending after approval. Marking Order will be issued only after payment confirmation.',
      pendingWithRole: 'Applicant (Fee Payment Pending)',
      pendingSinceDate: '16 Nov 2026',
      daysDelayed: 3,
      history: [
        { stage: 'Application Submitted', date: '25 Oct 2026', actor: 'Citizen Demo User (Primary)', remarks: 'Application submitted for 4 Firewood trees.' },
        { stage: 'Verification Scheduled', date: '28 Oct 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Verification scheduled for 04 Nov 2026.' },
        { stage: 'BO Verified', date: '05 Nov 2026', actor: 'BO Demo User 1 (Ranipool Block)', remarks: 'Field verification completed and submitted.' },
        { stage: 'RO Review (Approved � Fee Payment Pending)', date: '16 Nov 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Application approved within RO authority. Fee payment unlocked for applicant.' }
      ]
    },

    // 7. Approved & Payment Completed - Marking Order Pending Issuance - Citizen Scenario 8
    {
      appNo: 'SK-MO-2026-00107',
      submittedByCitizenId: 'CIT-DEMO-01',
      submittedByCitizenName: 'Citizen Demo User (Primary)',
      applicationFor: 'Self',
      applicantName: 'Citizen Demo User (Primary)',
      firstName: 'Citizen',
      middleName: 'Demo',
      lastName: 'User',
      relationType: 'Father',
      relationName: 'Guardian Demo Record A',
      mobile: '98000-00101',
      permanentAddress: {
        address1: 'House No. 42, Upper Ranka Ward',
        address2: 'Near Ranka Monastery Road',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'House No. 42, Upper Ranka Ward',
        address2: 'Near Ranka Monastery Road',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Ranipool Range',
      purpose: 'Timber',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_140_ranka.pdf', mandatory: true, status: 'Verified' },
        { name: 'BO Field Verification Report', fileName: 'bo_verification_report_00107.pdf', mandatory: false, status: 'Verified' }
      ],
      trees: [
        { treeNo: 1, species: 'Pipli (Bucklandia populnea)', plotNo: '140', gbhFeet: '5.2 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 2, species: 'Tooni (Toona ciliata)', plotNo: '140', gbhFeet: '4.8 ft', boMatchStatus: 'Matched on Site' }
      ],
      additionalRemarks: '2 Timber trees approved; payment completed.',
      submissionDate: '20 Oct 2026',
      lastUpdatedDate: '17 Nov 2026',
      workflowStageIndex: 4, // Payment completed, awaiting Stage 5 Marking Order Issue
      currentStatus: 'Payment Completed � Marking Order Pending',
      roQueue: 'approved',
      assignedBoId: 'BO-RANIPOOL-1',
      assignedBoName: 'BO Demo User 1 (Ranipool Block)',
      boAssignedDate: '23 Oct 2026',
      verificationDate: '30 Oct 2026',
      boScheduleTag: 'Report Submitted',
      boReportDate: '31 Oct 2026',
      boForwardedWithRemarks: false,
      boRemarks: '2 Timber trees verified on Plot 140.',
      forwardedByRo: null,
      forwardedToAcfDate: null,
      forwardedByAcf: null,
      forwardedToDfoDate: null,
      approvalStatus: 'Application Approved',
      approvedByRole: 'Range Officer (Ranipool Range)',
      approvalDate: '14 Nov 2026',
      paymentStatus: 'Payment Completed',
      markingOrderStatus: 'Pending Marking Order Issuance',
      markingOrderNo: null,
      markingOrderIssueDate: null,
      markingOrderValidity: null,
      transitPermitStatus: 'Not Applicable Yet',
      transitPermitNo: null,
      rejectionDate: null,
      rejectionReason: null,
      departmentRemarks: 'Application approved and fee payment confirmed on 17 Nov 2026. Marking Order generation is queued at the department desk.',
      nextExpectedAction: 'Departmental issuance of the official Marking Order document.',
      requiresCitizenAction: false,
      requiredCitizenActionText: null,
      pendingWithRole: 'RO Demo User (Ranipool)',
      pendingSinceDate: '17 Nov 2026',
      daysDelayed: 2,
      history: [
        { stage: 'Application Submitted', date: '20 Oct 2026', actor: 'Citizen Demo User (Primary)', remarks: 'Submitted for 2 Timber trees.' },
        { stage: 'Verification Scheduled', date: '23 Oct 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Verification scheduled for 30 Oct 2026.' },
        { stage: 'BO Verified', date: '31 Oct 2026', actor: 'BO Demo User 1 (Ranipool Block)', remarks: 'Field verification completed.' },
        { stage: 'RO Review (Approved)', date: '14 Nov 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Application approved within RO authority (Timber \u2264 2).' },
        { stage: 'Payment Confirmation', date: '17 Nov 2026', actor: 'Citizen Demo User (Primary)', remarks: 'Application fee payment confirmed. Awaiting Marking Order issuance.' }
      ]
    },

    // 8. Marking Order Issued - Citizen Scenario 9
    {
      appNo: 'SK-MO-2026-00108',
      submittedByCitizenId: 'CIT-DEMO-01',
      submittedByCitizenName: 'Citizen Demo User (Primary)',
      applicationFor: 'Self',
      applicantName: 'Citizen Demo User (Primary)',
      firstName: 'Citizen',
      middleName: 'Demo',
      lastName: 'User',
      relationType: 'Father',
      relationName: 'Guardian Demo Record A',
      mobile: '98000-00101',
      permanentAddress: {
        address1: 'House No. 42, Upper Ranka Ward',
        address2: 'Near Ranka Monastery Road',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'House No. 42, Upper Ranka Ward',
        address2: 'Near Ranka Monastery Road',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Ranipool Range',
      purpose: 'Firewood',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_95_ranka.pdf', mandatory: true, status: 'Verified' },
        { name: 'BO Field Verification Report', fileName: 'bo_verification_report_00108.pdf', mandatory: false, status: 'Verified' }
      ],
      trees: [
        { treeNo: 1, species: 'Utis (Alnus nepalensis)', plotNo: '95', gbhFeet: '4.4 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 2, species: 'Utis (Alnus nepalensis)', plotNo: '95', gbhFeet: '4.1 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 3, species: 'Chilaune (Schima wallichii)', plotNo: '95', gbhFeet: '4.7 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 4, species: 'Katus (Castanopsis indica)', plotNo: '96', gbhFeet: '4.3 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 5, species: 'Utis (Alnus nepalensis)', plotNo: '96', gbhFeet: '3.9 ft', boMatchStatus: 'Matched on Site' }
      ],
      additionalRemarks: '5 Firewood trees marked and order issued.',
      submissionDate: '10 Oct 2026',
      lastUpdatedDate: '05 Nov 2026',
      workflowStageIndex: 5, // 5: Marking Order Issue completed
      currentStatus: 'Marking Order Issued',
      roQueue: 'approved',
      assignedBoId: 'BO-RANIPOOL-1',
      assignedBoName: 'BO Demo User 1 (Ranipool Block)',
      boAssignedDate: '12 Oct 2026',
      verificationDate: '18 Oct 2026',
      boScheduleTag: 'Report Submitted',
      boReportDate: '19 Oct 2026',
      boForwardedWithRemarks: false,
      boRemarks: 'All 5 Firewood trees verified on Plots 95 & 96.',
      forwardedByRo: null,
      forwardedToAcfDate: null,
      forwardedByAcf: null,
      forwardedToDfoDate: null,
      approvalStatus: 'Application Approved',
      approvedByRole: 'Range Officer (Ranipool Range)',
      approvalDate: '28 Oct 2026',
      paymentStatus: 'Payment Completed',
      markingOrderStatus: 'Marking Order Issued',
      markingOrderNo: 'MO/FED/GTK/2026/0042',
      markingOrderIssueDate: '05 Nov 2026',
      markingOrderValidity: 'As per Marking Order conditions',
      transitPermitStatus: 'Pending Transit Permit Stage',
      transitPermitNo: null,
      rejectionDate: null,
      rejectionReason: null,
      departmentRemarks: 'Marking Order MO/FED/GTK/2026/0042 has been officially issued following payment confirmation.',
      nextExpectedAction: 'View Marking Order details or proceed to Transit Permit stage if transit is required.',
      requiresCitizenAction: false,
      requiredCitizenActionText: null,
      pendingWithRole: 'Completed (Marking Order Issued)',
      pendingSinceDate: '05 Nov 2026',
      daysDelayed: 0,
      history: [
        { stage: 'Application Submitted', date: '10 Oct 2026', actor: 'Citizen Demo User (Primary)', remarks: 'Application submitted for 5 Firewood trees.' },
        { stage: 'Verification Scheduled', date: '12 Oct 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Scheduled field verification for 18 Oct 2026.' },
        { stage: 'BO Verified', date: '19 Oct 2026', actor: 'BO Demo User 1 (Ranipool Block)', remarks: '5 trees verified and report uploaded.' },
        { stage: 'RO Review', date: '28 Oct 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Approved within RO authority (Firewood \u2264 5 trees).' },
        { stage: 'Marking Order Issue', date: '05 Nov 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Payment confirmed and Marking Order MO/FED/GTK/2026/0042 issued.' }
      ]
    },

    // 9. Rejected Application - Citizen Scenario 10
    {
      appNo: 'SK-MO-2026-00109',
      submittedByCitizenId: 'CIT-DEMO-01',
      submittedByCitizenName: 'Citizen Demo User (Primary)',
      applicationFor: 'Self',
      applicantName: 'Citizen Demo User (Primary)',
      firstName: 'Citizen',
      middleName: 'Demo',
      lastName: 'User',
      relationType: 'Father',
      relationName: 'Guardian Demo Record A',
      mobile: '98000-00101',
      permanentAddress: {
        address1: 'House No. 42, Upper Ranka Ward',
        address2: 'Near Ranka Monastery Road',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'House No. 42, Upper Ranka Ward',
        address2: 'Near Ranka Monastery Road',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Ranipool Range',
      purpose: 'Timber',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_512_ranka.pdf', mandatory: true, status: 'Reviewed' },
        { name: 'BO Field Verification Report', fileName: 'bo_verification_report_00109.pdf', mandatory: false, status: 'Discrepancy Reported' }
      ],
      trees: [
        { treeNo: 1, species: 'Pipli (Bucklandia populnea)', plotNo: '512', gbhFeet: '5.5 ft', boMatchStatus: 'Mismatch - Reserve Forest Buffer' },
        { treeNo: 2, species: 'Panisaj (Terminalia myriocarpa)', plotNo: '512', gbhFeet: '5.0 ft', boMatchStatus: 'Mismatch - Reserve Forest Buffer' }
      ],
      additionalRemarks: 'Request for 2 Timber trees near upper boundary.',
      submissionDate: '14 Oct 2026',
      lastUpdatedDate: '29 Oct 2026',
      workflowStageIndex: 4, // Rejected at RO Review
      currentStatus: 'Rejected',
      roQueue: 'rejected',
      assignedBoId: 'BO-RANIPOOL-1',
      assignedBoName: 'BO Demo User 1 (Ranipool Block)',
      boAssignedDate: '16 Oct 2026',
      verificationDate: '22 Oct 2026',
      boScheduleTag: 'Report Submitted',
      boReportDate: '23 Oct 2026',
      boForwardedWithRemarks: true,
      boRemarks: 'Field verification found both trees located outside private Khatiyan Plot 512 within the adjoining Reserve Forest boundary buffer. Forwarded to RO with discrepancy remarks.',
      forwardedByRo: null,
      forwardedToAcfDate: null,
      forwardedByAcf: null,
      forwardedToDfoDate: null,
      approvalStatus: 'Rejected',
      approvedByRole: 'Range Officer (Ranipool Range)',
      approvalDate: null,
      paymentStatus: 'Not Applicable',
      markingOrderStatus: 'Not Issued',
      markingOrderNo: null,
      markingOrderIssueDate: null,
      markingOrderValidity: null,
      transitPermitStatus: 'Not Applicable',
      transitPermitNo: null,
      rejectionDate: '29 Oct 2026',
      rejectionReason: 'Plot boundary discrepancy identified during field verification',
      departmentRemarks: 'Based on the Block Officer field verification report and GPS plot verification, the requested trees fall outside the private Khatiyan boundary. Application is rejected.',
      nextExpectedAction: 'No further processing. Review department remarks for details.',
      requiresCitizenAction: false,
      requiredCitizenActionText: null,
      pendingWithRole: 'Closed (Rejected)',
      pendingSinceDate: '29 Oct 2026',
      daysDelayed: 0,
      history: [
        { stage: 'Application Submitted', date: '14 Oct 2026', actor: 'Citizen Demo User (Primary)', remarks: 'Application submitted for 2 Timber trees.' },
        { stage: 'Verification Scheduled', date: '16 Oct 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Scheduled field verification for 22 Oct 2026.' },
        { stage: 'BO Verified (Forwarded with Remarks)', date: '23 Oct 2026', actor: 'BO Demo User 1 (Ranipool Block)', remarks: 'BO recorded boundary mismatch and forwarded report with remarks to RO (BO cannot reject).' },
        { stage: 'RO Review (Rejected)', date: '29 Oct 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Application rejected by Range Officer based on field verification boundary report.' }
      ]
    },

    // 10. Returned for Correction / Additional Document Requested (ACTION REQUIRED) - Section 4.4
    {
      appNo: 'SK-MO-2026-00110',
      submittedByCitizenId: 'CIT-DEMO-01',
      submittedByCitizenName: 'Citizen Demo User (Primary)',
      applicationFor: 'Apply for Others',
      applicantName: 'Co-Shared Landowner Demo Applicant',
      firstName: 'Co-Shared',
      middleName: 'Landowner',
      lastName: 'Demo',
      relationType: 'Father',
      relationName: 'Guardian Demo Record C',
      mobile: '98000-00333',
      permanentAddress: {
        address1: 'Ward No. 2, Ranka Lingdum Road',
        address2: 'Ranka GPU',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'Ward No. 2, Ranka Lingdum Road',
        address2: 'Ranka GPU',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Ranipool Range',
      purpose: 'Firewood',
      khatiyanInApplicantName: false,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_77_ranka.pdf', mandatory: true, status: 'Verified' },
        { name: 'NOC from Land Owner / Revenue Officer', fileName: 'noc_illegible_scan.pdf', mandatory: true, status: 'Correction Required' }
      ],
      trees: [
        { treeNo: 1, species: 'Utis (Alnus nepalensis)', plotNo: '77', gbhFeet: '4.0 ft', boMatchStatus: 'Pending' },
        { treeNo: 2, species: 'Utis (Alnus nepalensis)', plotNo: '77', gbhFeet: '3.9 ft', boMatchStatus: 'Pending' }
      ],
      additionalRemarks: 'Submitted on behalf of joint family plot holder.',
      submissionDate: '14 Nov 2026',
      lastUpdatedDate: '17 Nov 2026',
      workflowStageIndex: 1,
      currentStatus: 'Returned for Correction',
      roQueue: 'pending',
      assignedBoId: null,
      assignedBoName: 'Unassigned',
      boAssignedDate: null,
      verificationDate: null,
      boScheduleTag: null,
      boReportDate: null,
      boForwardedWithRemarks: false,
      boRemarks: null,
      forwardedByRo: null,
      forwardedToAcfDate: null,
      forwardedByAcf: null,
      forwardedToDfoDate: null,
      approvalStatus: 'Pending Correction',
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Not Applicable Yet',
      markingOrderStatus: 'Not Issued',
      markingOrderNo: null,
      markingOrderIssueDate: null,
      markingOrderValidity: null,
      transitPermitStatus: 'Not Applicable Yet',
      transitPermitNo: null,
      rejectionDate: null,
      rejectionReason: null,
      departmentRemarks: 'Since the Khatiyan/Parcha is not in the name of the applicant, a clear, legible copy of the mandatory NOC from the Land Owner / Revenue Officer is required before scheduling field verification.',
      nextExpectedAction: 'Citizen action required: Re-upload clear NOC from Land Owner / Revenue Officer.',
      requiresCitizenAction: true,
      requiredCitizenActionType: 'DOCUMENT_CORRECTION',
      requiredCitizenActionText: 'Application returned for correction: Upload legible NOC from Land Owner / Revenue Officer.',
      pendingWithRole: 'Applicant (Correction Required)',
      pendingSinceDate: '17 Nov 2026',
      daysDelayed: 2,
      history: [
        { stage: 'Application Submitted', date: '14 Nov 2026', actor: 'Citizen Demo User (Primary)', remarks: 'Application submitted under Apply for Others.' },
        { stage: 'Returned for Correction', date: '17 Nov 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Requested clear upload of mandatory NOC from Land Owner / Revenue Officer.' }
      ]
    },

    // =====================================================================
    // ADDITIONAL DEPARTMENTAL QUEUE RECORDS (RO, BO, ACF, DFO, Super Admin)
    // =====================================================================

    // 11. Pending RO Scrutiny (Exceeds RO limit: Timber 4 trees > 2) & Delayed 9 days
    {
      appNo: 'SK-MO-2026-00111',
      submittedByCitizenId: 'CIT-OTHER-01',
      submittedByCitizenName: 'Applicant Demo Record � Samdong',
      applicationFor: 'Self',
      applicantName: 'Applicant Demo Record � Samdong',
      firstName: 'Applicant',
      middleName: 'Demo',
      lastName: 'Samdong',
      relationType: 'Father',
      relationName: 'Parent Demo Record 11',
      mobile: '98000-00411',
      permanentAddress: {
        address1: 'Lower Samdong Ward 1',
        address2: 'Ranipool Circle',
        district: 'Gangtok',
        blockGpu: 'Assam Lingzey GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'Lower Samdong Ward 1',
        address2: 'Ranipool Circle',
        district: 'Gangtok',
        blockGpu: 'Assam Lingzey GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Ranipool Range',
      purpose: 'Timber',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_62_samdong.pdf', mandatory: true, status: 'Attached' }
      ],
      trees: [
        { treeNo: 1, species: 'Chilaune (Schima wallichii)', plotNo: '62', gbhFeet: '5.2 ft', boMatchStatus: 'Pending' },
        { treeNo: 2, species: 'Chilaune (Schima wallichii)', plotNo: '62', gbhFeet: '4.9 ft', boMatchStatus: 'Pending' },
        { treeNo: 3, species: 'Katus (Castanopsis indica)', plotNo: '63', gbhFeet: '5.0 ft', boMatchStatus: 'Pending' },
        { treeNo: 4, species: 'Tooni (Toona ciliata)', plotNo: '63', gbhFeet: '5.3 ft', boMatchStatus: 'Pending' }
      ],
      additionalRemarks: '4 Timber trees for house construction.',
      submissionDate: '10 Nov 2026',
      lastUpdatedDate: '10 Nov 2026',
      workflowStageIndex: 1,
      currentStatus: 'Application Submitted',
      roQueue: 'pending',
      assignedBoId: null,
      assignedBoName: 'Unassigned (Pending RO Assignment)',
      boAssignedDate: null,
      verificationDate: null,
      boScheduleTag: null,
      boReportDate: null,
      boForwardedWithRemarks: false,
      boRemarks: null,
      forwardedByRo: null,
      forwardedToAcfDate: null,
      forwardedByAcf: null,
      forwardedToDfoDate: null,
      approvalStatus: 'Pending',
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Not Applicable Yet',
      markingOrderStatus: 'Not Issued',
      markingOrderNo: null,
      markingOrderIssueDate: null,
      markingOrderValidity: null,
      transitPermitStatus: 'Not Applicable Yet',
      transitPermitNo: null,
      rejectionDate: null,
      rejectionReason: null,
      departmentRemarks: 'Awaiting preliminary scrutiny and BO assignment by Range Officer (Ranipool Range).',
      nextExpectedAction: 'RO preliminary review and verification scheduling.',
      requiresCitizenAction: false,
      requiredCitizenActionText: null,
      pendingWithRole: 'RO Demo User (Ranipool)',
      pendingSinceDate: '10 Nov 2026',
      daysDelayed: 9,
      history: [
        { stage: 'Application Submitted', date: '10 Nov 2026', actor: 'Applicant Demo Record � Samdong', remarks: 'Submitted for 4 Timber trees.' }
      ]
    },

    // 12. Verification Scheduled (Upcoming Verification for BO-RANIPOOL-1)
    {
      appNo: 'SK-MO-2026-00112',
      submittedByCitizenId: 'CIT-OTHER-02',
      submittedByCitizenName: 'Applicant Demo Record � Ranka East',
      applicationFor: 'Self',
      applicantName: 'Applicant Demo Record � Ranka East',
      firstName: 'Applicant',
      middleName: 'Demo',
      lastName: 'Ranka',
      relationType: 'Father',
      relationName: 'Parent Demo Record 12',
      mobile: '98000-00412',
      permanentAddress: {
        address1: 'Ranka Rai Gaon',
        address2: 'Ranka GPU',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'Ranka Rai Gaon',
        address2: 'Ranka GPU',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Ranipool Range',
      purpose: 'Firewood',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_81_ranka.pdf', mandatory: true, status: 'Verified by RO' }
      ],
      trees: [
        { treeNo: 1, species: 'Utis (Alnus nepalensis)', plotNo: '81', gbhFeet: '4.0 ft', boMatchStatus: 'Scheduled' },
        { treeNo: 2, species: 'Utis (Alnus nepalensis)', plotNo: '81', gbhFeet: '4.1 ft', boMatchStatus: 'Scheduled' },
        { treeNo: 3, species: 'Utis (Alnus nepalensis)', plotNo: '81', gbhFeet: '3.8 ft', boMatchStatus: 'Scheduled' },
        { treeNo: 4, species: 'Chilaune (Schima wallichii)', plotNo: '82', gbhFeet: '4.4 ft', boMatchStatus: 'Scheduled' },
        { treeNo: 5, species: 'Chilaune (Schima wallichii)', plotNo: '82', gbhFeet: '4.2 ft', boMatchStatus: 'Scheduled' }
      ],
      additionalRemarks: '5 Firewood trees scheduled for upcoming verification.',
      submissionDate: '14 Nov 2026',
      lastUpdatedDate: '17 Nov 2026',
      workflowStageIndex: 2,
      currentStatus: 'Verification Scheduled',
      roQueue: 'scheduled',
      assignedBoId: 'BO-RANIPOOL-1',
      assignedBoName: 'BO Demo User 1 (Ranipool Block)',
      boAssignedDate: '17 Nov 2026',
      verificationDate: '22 Nov 2026',
      boScheduleTag: 'Upcoming Verification',
      boReportDate: null,
      boForwardedWithRemarks: false,
      boRemarks: null,
      forwardedByRo: null,
      forwardedToAcfDate: null,
      forwardedByAcf: null,
      forwardedToDfoDate: null,
      approvalStatus: 'Pending',
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Not Applicable Yet',
      markingOrderStatus: 'Not Issued',
      markingOrderNo: null,
      markingOrderIssueDate: null,
      markingOrderValidity: null,
      transitPermitStatus: 'Not Applicable Yet',
      transitPermitNo: null,
      rejectionDate: null,
      rejectionReason: null,
      departmentRemarks: 'Field verification scheduled for 22 Nov 2026 with BO Demo User 1 (Ranipool Block).',
      nextExpectedAction: 'Upcoming on-site inspection by Block Officer on 22 Nov 2026.',
      requiresCitizenAction: false,
      requiredCitizenActionText: null,
      pendingWithRole: 'BO Demo User 1 (Ranipool Block)',
      pendingSinceDate: '17 Nov 2026',
      daysDelayed: 2,
      history: [
        { stage: 'Application Submitted', date: '14 Nov 2026', actor: 'Applicant Demo Record � Ranka East', remarks: 'Submitted for 5 Firewood trees.' },
        { stage: 'Verification Scheduled', date: '17 Nov 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Assigned to BO Demo User 1 for field verification on 22 Nov 2026.' }
      ]
    },

    // 13. Verification Scheduled (Past Scheduled Date / Report Pending - Delayed 11 days)
    {
      appNo: 'SK-MO-2026-00113',
      submittedByCitizenId: 'CIT-OTHER-03',
      submittedByCitizenName: 'Applicant Demo Record � Lingzey Upper',
      applicationFor: 'Self',
      applicantName: 'Applicant Demo Record � Lingzey Upper',
      firstName: 'Applicant',
      middleName: 'Demo',
      lastName: 'Lingzey',
      relationType: 'Father',
      relationName: 'Parent Demo Record 13',
      mobile: '98000-00413',
      permanentAddress: {
        address1: 'Upper Assam Lingzey Ward 4',
        address2: 'Assam Lingzey GPU',
        district: 'Gangtok',
        blockGpu: 'Assam Lingzey GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'Upper Assam Lingzey Ward 4',
        address2: 'Assam Lingzey GPU',
        district: 'Gangtok',
        blockGpu: 'Assam Lingzey GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Ranipool Range',
      purpose: 'Timber',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_190_lingzey.pdf', mandatory: true, status: 'Verified by RO' },
        { name: 'NOC / Verification Report from Panchayat', fileName: 'panchayat_noc_190.pdf', mandatory: false, status: 'Attached' }
      ],
      trees: [
        { treeNo: 1, species: 'Katus (Castanopsis indica)', plotNo: '190', gbhFeet: '5.0 ft', boMatchStatus: 'Pending Report' },
        { treeNo: 2, species: 'Katus (Castanopsis indica)', plotNo: '190', gbhFeet: '4.8 ft', boMatchStatus: 'Pending Report' },
        { treeNo: 3, species: 'Chilaune (Schima wallichii)', plotNo: '191', gbhFeet: '5.1 ft', boMatchStatus: 'Pending Report' }
      ],
      additionalRemarks: '3 Timber trees; scheduled verification date passed, report upload pending.',
      submissionDate: '04 Nov 2026',
      lastUpdatedDate: '08 Nov 2026',
      workflowStageIndex: 2,
      currentStatus: 'Verification Scheduled',
      roQueue: 'scheduled',
      assignedBoId: 'BO-RANIPOOL-1',
      assignedBoName: 'BO Demo User 1 (Ranipool Block)',
      boAssignedDate: '06 Nov 2026',
      verificationDate: '08 Nov 2026',
      boScheduleTag: 'Past Scheduled Date \u2022 Report Pending',
      boReportDate: null,
      boForwardedWithRemarks: false,
      boRemarks: null,
      forwardedByRo: null,
      forwardedToAcfDate: null,
      forwardedByAcf: null,
      forwardedToDfoDate: null,
      approvalStatus: 'Pending',
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Not Applicable Yet',
      markingOrderStatus: 'Not Issued',
      markingOrderNo: null,
      markingOrderIssueDate: null,
      markingOrderValidity: null,
      transitPermitStatus: 'Not Applicable Yet',
      transitPermitNo: null,
      rejectionDate: null,
      rejectionReason: null,
      departmentRemarks: 'Scheduled verification date (08 Nov 2026) has passed; awaiting BO verification report submission.',
      nextExpectedAction: 'BO report submission to Range Officer.',
      requiresCitizenAction: false,
      requiredCitizenActionText: null,
      pendingWithRole: 'BO Demo User 1 (Ranipool Block)',
      pendingSinceDate: '08 Nov 2026',
      daysDelayed: 11,
      history: [
        { stage: 'Application Submitted', date: '04 Nov 2026', actor: 'Applicant Demo Record � Lingzey Upper', remarks: 'Submitted for 3 Timber trees.' },
        { stage: 'Verification Scheduled', date: '06 Nov 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Verification scheduled for 08 Nov 2026.' }
      ]
    },

    // 14. BO Verified & Forwarded with Remarks (Discrepancy found; BO cannot reject; Exceeds RO limit: Firewood 7 trees > 5)
    {
      appNo: 'SK-MO-2026-00114',
      submittedByCitizenId: 'CIT-OTHER-04',
      submittedByCitizenName: 'Applicant Demo Record � Nandok',
      applicationFor: 'Self',
      applicantName: 'Applicant Demo Record � Nandok',
      firstName: 'Applicant',
      middleName: 'Demo',
      lastName: 'Nandok',
      relationType: 'Father',
      relationName: 'Parent Demo Record 14',
      mobile: '98000-00414',
      permanentAddress: {
        address1: 'Nandok Block Ward 2',
        address2: 'Ranipool Circle',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'Nandok Block Ward 2',
        address2: 'Ranipool Circle',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Ranipool Range',
      purpose: 'Firewood',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_330_nandok.pdf', mandatory: true, status: 'Verified' },
        { name: 'BO Field Verification Report', fileName: 'bo_verification_report_00114.pdf', mandatory: false, status: 'Forwarded with Remarks' }
      ],
      trees: [
        { treeNo: 1, species: 'Utis (Alnus nepalensis)', plotNo: '330', gbhFeet: '4.2 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 2, species: 'Utis (Alnus nepalensis)', plotNo: '330', gbhFeet: '4.0 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 3, species: 'Utis (Alnus nepalensis)', plotNo: '330', gbhFeet: '3.9 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 4, species: 'Chilaune (Schima wallichii)', plotNo: '331', gbhFeet: '4.5 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 5, species: 'Chilaune (Schima wallichii)', plotNo: '331', gbhFeet: '4.3 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 6, species: 'Katus (Castanopsis indica)', plotNo: '331', gbhFeet: '4.6 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 7, species: 'Pipli (Bucklandia populnea)', plotNo: '332', gbhFeet: '2.4 ft', boMatchStatus: 'Mismatch - Undersized GBH & Stream Buffer' }
      ],
      additionalRemarks: '7 Firewood trees requested.',
      submissionDate: '06 Nov 2026',
      lastUpdatedDate: '16 Nov 2026',
      workflowStageIndex: 3,
      currentStatus: 'BO Verified',
      roQueue: 'reports_submitted',
      assignedBoId: 'BO-RANIPOOL-1',
      assignedBoName: 'BO Demo User 1 (Ranipool Block)',
      boAssignedDate: '09 Nov 2026',
      verificationDate: '14 Nov 2026',
      boScheduleTag: 'Forwarded with Remarks',
      boReportDate: '16 Nov 2026',
      boForwardedWithRemarks: true,
      boRemarks: 'Trees 1 to 6 match plot records. Tree No. 7 (Pipli on Plot 332) has undersized GBH (2.4 ft) and stands on a seasonal jhora/stream bank. Forwarded to RO with discrepancy remarks for decision/escalation to ACF.',
      forwardedByRo: null,
      forwardedToAcfDate: null,
      forwardedByAcf: null,
      forwardedToDfoDate: null,
      approvalStatus: 'Pending RO Review',
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Not Applicable Yet',
      markingOrderStatus: 'Not Issued',
      markingOrderNo: null,
      markingOrderIssueDate: null,
      markingOrderValidity: null,
      transitPermitStatus: 'Not Applicable Yet',
      transitPermitNo: null,
      rejectionDate: null,
      rejectionReason: null,
      departmentRemarks: 'BO submitted verification report with discrepancy remarks on Tree No. 7. Also note: total 7 Firewood trees exceeds RO statutory limit (Firewood \u2264 5) and requires forwarding to ACF if processed.',
      nextExpectedAction: 'RO review of BO remarks and forwarding to ACF (Exceeds RO limit: Firewood > 5).',
      requiresCitizenAction: false,
      requiredCitizenActionText: null,
      pendingWithRole: 'RO Demo User (Ranipool)',
      pendingSinceDate: '16 Nov 2026',
      daysDelayed: 3,
      history: [
        { stage: 'Application Submitted', date: '06 Nov 2026', actor: 'Applicant Demo Record � Nandok', remarks: 'Submitted for 7 Firewood trees.' },
        { stage: 'Verification Scheduled', date: '09 Nov 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Verification scheduled for 14 Nov 2026.' },
        { stage: 'BO Verified (Forwarded with Remarks)', date: '16 Nov 2026', actor: 'BO Demo User 1 (Ranipool Block)', remarks: 'BO recorded stream-bank & GBH discrepancy on Tree #7 and forwarded report to RO.' }
      ]
    },

    // 15. Forwarded to ACF (Within ACF Authority: Timber 4 trees <= 5, Delayed 10 days at ACF Desk)
    {
      appNo: 'SK-MO-2026-00115',
      submittedByCitizenId: 'CIT-OTHER-05',
      submittedByCitizenName: 'Applicant Demo Record � Tadong',
      applicationFor: 'Self',
      applicantName: 'Applicant Demo Record � Tadong',
      firstName: 'Applicant',
      middleName: 'Demo',
      lastName: 'Tadong',
      relationType: 'Father',
      relationName: 'Parent Demo Record 15',
      mobile: '98000-00415',
      permanentAddress: {
        address1: 'Upper Tadong Block',
        address2: 'Ranipool Range Jurisdiction',
        district: 'Gangtok',
        blockGpu: 'Samdong Kambal GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'Upper Tadong Block',
        address2: 'Ranipool Range Jurisdiction',
        district: 'Gangtok',
        blockGpu: 'Samdong Kambal GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Ranipool Range',
      purpose: 'Timber',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_202_tadong.pdf', mandatory: true, status: 'Verified' },
        { name: 'BO Field Verification Report', fileName: 'bo_verification_report_00115.pdf', mandatory: false, status: 'Verified' }
      ],
      trees: [
        { treeNo: 1, species: 'Chilaune (Schima wallichii)', plotNo: '202', gbhFeet: '5.1 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 2, species: 'Katus (Castanopsis indica)', plotNo: '202', gbhFeet: '5.3 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 3, species: 'Tooni (Toona ciliata)', plotNo: '203', gbhFeet: '4.9 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 4, species: 'Dhupi (Cryptomeria japonica)', plotNo: '203', gbhFeet: '5.5 ft', boMatchStatus: 'Matched on Site' }
      ],
      additionalRemarks: '4 Timber trees forwarded by RO to ACF.',
      submissionDate: '30 Oct 2026',
      lastUpdatedDate: '09 Nov 2026',
      workflowStageIndex: 5,
      currentStatus: 'Forwarded to ACF',
      roQueue: 'forwarded',
      acfQueue: 'pending',
      assignedBoId: 'BO-RANIPOOL-1',
      assignedBoName: 'BO Demo User 1 (Ranipool Block)',
      boAssignedDate: '01 Nov 2026',
      verificationDate: '05 Nov 2026',
      boScheduleTag: 'Report Submitted',
      boReportDate: '06 Nov 2026',
      boForwardedWithRemarks: false,
      boRemarks: 'All 4 Timber trees verified on Plots 202 & 203.',
      forwardedByRo: 'RO Demo User (Ranipool)',
      forwardedToAcfDate: '09 Nov 2026',
      forwardedByAcf: null,
      forwardedToDfoDate: null,
      approvalStatus: 'Pending ACF Review',
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Not Applicable Yet',
      markingOrderStatus: 'Not Issued',
      markingOrderNo: null,
      markingOrderIssueDate: null,
      markingOrderValidity: null,
      transitPermitStatus: 'Not Applicable Yet',
      transitPermitNo: null,
      rejectionDate: null,
      rejectionReason: null,
      departmentRemarks: 'Forwarded by RO (Ranipool Range) to ACF (Gangtok Division) as 4 Timber trees exceed RO limit (Timber \u2264 2). Falls within ACF authority (Timber \u2264 5).',
      nextExpectedAction: 'ACF review and approval/rejection decision.',
      requiresCitizenAction: false,
      requiredCitizenActionText: null,
      pendingWithRole: 'ACF Demo User (Gangtok Division)',
      pendingSinceDate: '09 Nov 2026',
      daysDelayed: 10,
      history: [
        { stage: 'Application Submitted', date: '30 Oct 2026', actor: 'Applicant Demo Record � Tadong', remarks: 'Submitted for 4 Timber trees.' },
        { stage: 'Verification Scheduled', date: '01 Nov 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Verification scheduled.' },
        { stage: 'BO Verified', date: '06 Nov 2026', actor: 'BO Demo User 1 (Ranipool Block)', remarks: '4 trees verified.' },
        { stage: 'Forwarded to ACF', date: '09 Nov 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Forwarded to ACF (Timber 4 > RO limit 2; within ACF limit 5).' }
      ]
    },

    // 16. Forwarded to ACF (Exceeds ACF Authority: Timber 7 trees > 5 -> Must be forwarded by ACF to DFO!)
    {
      appNo: 'SK-MO-2026-00116',
      submittedByCitizenId: 'CIT-OTHER-06',
      submittedByCitizenName: 'Applicant Demo Record � Pangthang',
      applicationFor: 'Self',
      applicantName: 'Applicant Demo Record � Pangthang',
      firstName: 'Applicant',
      middleName: 'Demo',
      lastName: 'Pangthang',
      relationType: 'Father',
      relationName: 'Parent Demo Record 16',
      mobile: '98000-00416',
      permanentAddress: {
        address1: 'Pangthang Ridge Ward',
        address2: 'Gangtok Range',
        district: 'Gangtok',
        blockGpu: 'Samdong Kambal GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'Pangthang Ridge Ward',
        address2: 'Gangtok Range',
        district: 'Gangtok',
        blockGpu: 'Samdong Kambal GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Gangtok Range',
      purpose: 'Timber',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_401_pangthang.pdf', mandatory: true, status: 'Verified' },
        { name: 'BO Field Verification Report', fileName: 'bo_verification_report_00116.pdf', mandatory: false, status: 'Verified' }
      ],
      trees: [
        { treeNo: 1, species: 'Dhupi (Cryptomeria japonica)', plotNo: '401', gbhFeet: '5.4 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 2, species: 'Dhupi (Cryptomeria japonica)', plotNo: '401', gbhFeet: '5.2 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 3, species: 'Dhupi (Cryptomeria japonica)', plotNo: '401', gbhFeet: '5.0 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 4, species: 'Chilaune (Schima wallichii)', plotNo: '402', gbhFeet: '4.9 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 5, species: 'Chilaune (Schima wallichii)', plotNo: '402', gbhFeet: '5.1 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 6, species: 'Katus (Castanopsis indica)', plotNo: '402', gbhFeet: '4.8 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 7, species: 'Tooni (Toona ciliata)', plotNo: '403', gbhFeet: '5.3 ft', boMatchStatus: 'Matched on Site' }
      ],
      additionalRemarks: '7 Timber trees (Exceeds ACF limit of 5 Timber trees; requires escalation to DFO).',
      submissionDate: '03 Nov 2026',
      lastUpdatedDate: '15 Nov 2026',
      workflowStageIndex: 5,
      currentStatus: 'Forwarded to ACF',
      roQueue: 'forwarded',
      acfQueue: 'pending',
      assignedBoId: 'BO-GANGTOK-1',
      assignedBoName: 'BO Demo User 3 (Gangtok Block)',
      boAssignedDate: '05 Nov 2026',
      verificationDate: '10 Nov 2026',
      boScheduleTag: 'Report Submitted',
      boReportDate: '11 Nov 2026',
      boForwardedWithRemarks: false,
      boRemarks: 'All 7 Timber trees verified on Plots 401�403.',
      forwardedByRo: 'RO Demo User (Gangtok Range)',
      forwardedToAcfDate: '15 Nov 2026',
      forwardedByAcf: null,
      forwardedToDfoDate: null,
      approvalStatus: 'Exceeds ACF Limit � To Forward to DFO',
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Not Applicable Yet',
      markingOrderStatus: 'Not Issued',
      markingOrderNo: null,
      markingOrderIssueDate: null,
      markingOrderValidity: null,
      transitPermitStatus: 'Not Applicable Yet',
      transitPermitNo: null,
      rejectionDate: null,
      rejectionReason: null,
      departmentRemarks: 'Received at ACF Desk from RO (Gangtok Range). Since 7 Timber trees exceed ACF statutory limit (Timber \u2264 5), ACF must forward this application to DFO.',
      nextExpectedAction: 'ACF review and mandatory forwarding to DFO (Timber 7 > ACF limit 5; within DFO limit 10).',
      requiresCitizenAction: false,
      requiredCitizenActionText: null,
      pendingWithRole: 'ACF Demo User (Gangtok Division)',
      pendingSinceDate: '15 Nov 2026',
      daysDelayed: 4,
      history: [
        { stage: 'Application Submitted', date: '03 Nov 2026', actor: 'Applicant Demo Record � Pangthang', remarks: 'Submitted for 7 Timber trees.' },
        { stage: 'BO Verified', date: '11 Nov 2026', actor: 'BO Demo User 3 (Gangtok Block)', remarks: '7 Timber trees verified.' },
        { stage: 'Forwarded to ACF', date: '15 Nov 2026', actor: 'RO Demo User (Gangtok Range)', remarks: 'Forwarded to ACF; exceeds RO and ACF Timber limits.' }
      ]
    },

    // 17. Approved by ACF & Marking Order Issued (Awaiting Transit Permit)
    {
      appNo: 'SK-MO-2026-00117',
      submittedByCitizenId: 'CIT-OTHER-07',
      submittedByCitizenName: 'Applicant Demo Record � Rumtek',
      applicationFor: 'Self',
      applicantName: 'Applicant Demo Record � Rumtek',
      firstName: 'Applicant',
      middleName: 'Demo',
      lastName: 'Rumtek',
      relationType: 'Father',
      relationName: 'Parent Demo Record 17',
      mobile: '98000-00417',
      permanentAddress: {
        address1: 'Rumtek Sajong Road',
        address2: 'Ranka GPU',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'Rumtek Sajong Road',
        address2: 'Ranka GPU',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Ranipool Range',
      purpose: 'Firewood',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_501_rumtek.pdf', mandatory: true, status: 'Verified' },
        { name: 'BO Field Verification Report', fileName: 'bo_verification_report_00117.pdf', mandatory: false, status: 'Verified' }
      ],
      trees: [
        { treeNo: 1, species: 'Utis (Alnus nepalensis)', plotNo: '501', gbhFeet: '4.1 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 2, species: 'Utis (Alnus nepalensis)', plotNo: '501', gbhFeet: '4.3 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 3, species: 'Utis (Alnus nepalensis)', plotNo: '501', gbhFeet: '4.0 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 4, species: 'Chilaune (Schima wallichii)', plotNo: '502', gbhFeet: '4.5 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 5, species: 'Chilaune (Schima wallichii)', plotNo: '502', gbhFeet: '4.4 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 6, species: 'Katus (Castanopsis indica)', plotNo: '502', gbhFeet: '4.7 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 7, species: 'Sauer (Betula alnoides)', plotNo: '503', gbhFeet: '3.9 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 8, species: 'Utis (Alnus nepalensis)', plotNo: '503', gbhFeet: '4.2 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 9, species: 'Utis (Alnus nepalensis)', plotNo: '503', gbhFeet: '4.0 ft', boMatchStatus: 'Matched on Site' }
      ],
      additionalRemarks: '9 Firewood trees approved by ACF within ACF statutory limit (Firewood <= 10).',
      submissionDate: '12 Oct 2026',
      lastUpdatedDate: '08 Nov 2026',
      workflowStageIndex: 5,
      currentStatus: 'Marking Order Issued',
      roQueue: 'forwarded',
      acfQueue: 'approved',
      assignedBoId: 'BO-RANIPOOL-1',
      assignedBoName: 'BO Demo User 1 (Ranipool Block)',
      boAssignedDate: '14 Oct 2026',
      verificationDate: '20 Oct 2026',
      boScheduleTag: 'Report Submitted',
      boReportDate: '21 Oct 2026',
      boForwardedWithRemarks: false,
      boRemarks: 'All 9 Firewood trees verified on Plots 501�503.',
      forwardedByRo: 'RO Demo User (Ranipool)',
      forwardedToAcfDate: '24 Oct 2026',
      forwardedByAcf: null,
      forwardedToDfoDate: null,
      approvalStatus: 'Application Approved',
      approvedByRole: 'ACF (Gangtok Division)',
      approvalDate: '02 Nov 2026',
      paymentStatus: 'Payment Completed',
      markingOrderStatus: 'Marking Order Issued',
      markingOrderNo: 'MO/FED/GTK/2026/0039',
      markingOrderIssueDate: '08 Nov 2026',
      markingOrderValidity: 'As per Marking Order conditions',
      transitPermitStatus: 'Eligible for Transit Permit Review',
      transitPermitNo: null,
      rejectionDate: null,
      rejectionReason: null,
      departmentRemarks: 'Approved by ACF (Gangtok Division) within statutory authority (Firewood \u2264 10). Fee paid and Marking Order MO/FED/GTK/2026/0039 issued.',
      nextExpectedAction: 'Transit Permit processing by ACF where applicable.',
      requiresCitizenAction: false,
      requiredCitizenActionText: null,
      pendingWithRole: 'Completed (Marking Order Issued)',
      pendingSinceDate: '08 Nov 2026',
      daysDelayed: 0,
      history: [
        { stage: 'Application Submitted', date: '12 Oct 2026', actor: 'Applicant Demo Record � Rumtek', remarks: 'Submitted for 9 Firewood trees.' },
        { stage: 'BO Verified', date: '21 Oct 2026', actor: 'BO Demo User 1 (Ranipool Block)', remarks: '9 trees verified on site.' },
        { stage: 'Forwarded to ACF', date: '24 Oct 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Forwarded to ACF (Firewood 9 > RO limit 5).' },
        { stage: 'Marking Order Issue', date: '08 Nov 2026', actor: 'ACF Demo User (Gangtok Division)', remarks: 'Approved by ACF, fee payment confirmed, Marking Order MO/FED/GTK/2026/0039 issued.' }
      ]
    },

    // 18. Approved by ACF & Transit Permit Issued (Stage 6 complete)
    {
      appNo: 'SK-MO-2026-00118',
      submittedByCitizenId: 'CIT-OTHER-08',
      submittedByCitizenName: 'Applicant Demo Record � Burtuk',
      applicationFor: 'Self',
      applicantName: 'Applicant Demo Record � Burtuk',
      firstName: 'Applicant',
      middleName: 'Demo',
      lastName: 'Burtuk',
      relationType: 'Father',
      relationName: 'Parent Demo Record 18',
      mobile: '98000-00418',
      permanentAddress: {
        address1: 'Burtuk Ward',
        address2: 'Gangtok Range',
        district: 'Gangtok',
        blockGpu: 'Gangtok Municipal Corporation',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'Burtuk Ward',
        address2: 'Gangtok Range',
        district: 'Gangtok',
        blockGpu: 'Gangtok Municipal Corporation'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Gangtok Range',
      purpose: 'Timber',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_312_burtuk.pdf', mandatory: true, status: 'Verified' },
        { name: 'BO Field Verification Report', fileName: 'bo_verification_report_00118.pdf', mandatory: false, status: 'Verified' }
      ],
      trees: [
        { treeNo: 1, species: 'Dhupi (Cryptomeria japonica)', plotNo: '312', gbhFeet: '5.3 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 2, species: 'Dhupi (Cryptomeria japonica)', plotNo: '312', gbhFeet: '5.1 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 3, species: 'Chilaune (Schima wallichii)', plotNo: '313', gbhFeet: '4.9 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 4, species: 'Tooni (Toona ciliata)', plotNo: '313', gbhFeet: '5.0 ft', boMatchStatus: 'Matched on Site' }
      ],
      additionalRemarks: '4 Timber trees approved by ACF; Marking Order and Transit Permit issued.',
      submissionDate: '02 Oct 2026',
      lastUpdatedDate: '04 Nov 2026',
      workflowStageIndex: 6, // 6: Transit Permit Issue
      currentStatus: 'Transit Permit Issued',
      roQueue: 'forwarded',
      acfQueue: 'approved',
      assignedBoId: 'BO-GANGTOK-1',
      assignedBoName: 'BO Demo User 3 (Gangtok Block)',
      boAssignedDate: '04 Oct 2026',
      verificationDate: '09 Oct 2026',
      boScheduleTag: 'Report Submitted',
      boReportDate: '10 Oct 2026',
      boForwardedWithRemarks: false,
      boRemarks: 'All 4 Timber trees verified on Plots 312 & 313.',
      forwardedByRo: 'RO Demo User (Gangtok Range)',
      forwardedToAcfDate: '13 Oct 2026',
      forwardedByAcf: null,
      forwardedToDfoDate: null,
      approvalStatus: 'Application Approved',
      approvedByRole: 'ACF (Gangtok Division)',
      approvalDate: '22 Oct 2026',
      paymentStatus: 'Payment Completed',
      markingOrderStatus: 'Marking Order Issued',
      markingOrderNo: 'MO/FED/GTK/2026/0031',
      markingOrderIssueDate: '27 Oct 2026',
      markingOrderValidity: 'As per Marking Order conditions',
      transitPermitStatus: 'Transit Permit Issued',
      transitPermitNo: 'TP/FED/GTK/2026/0018',
      rejectionDate: null,
      rejectionReason: null,
      departmentRemarks: 'Marking Order MO/FED/GTK/2026/0031 and Transit Permit TP/FED/GTK/2026/0018 issued.',
      nextExpectedAction: 'All workflow stages completed.',
      requiresCitizenAction: false,
      requiredCitizenActionText: null,
      pendingWithRole: 'Completed (Transit Permit Issued)',
      pendingSinceDate: '04 Nov 2026',
      daysDelayed: 0,
      history: [
        { stage: 'Application Submitted', date: '02 Oct 2026', actor: 'Applicant Demo Record � Burtuk', remarks: 'Submitted for 4 Timber trees.' },
        { stage: 'BO Verified', date: '10 Oct 2026', actor: 'BO Demo User 3 (Gangtok Block)', remarks: 'Verified on site.' },
        { stage: 'Forwarded to ACF', date: '13 Oct 2026', actor: 'RO Demo User (Gangtok Range)', remarks: 'Forwarded to ACF (Timber 4 > RO limit 2).' },
        { stage: 'Marking Order Issue', date: '27 Oct 2026', actor: 'ACF Demo User (Gangtok Division)', remarks: 'Marking Order MO/FED/GTK/2026/0031 issued after fee payment.' },
        { stage: 'Transit Permit Issue', date: '04 Nov 2026', actor: 'ACF Demo User (Gangtok Division)', remarks: 'Transit Permit TP/FED/GTK/2026/0018 issued.' }
      ]
    },

    // 19. Forwarded by ACF to DFO (Timber 8 trees > ACF limit 5, Within DFO limit <= 10; Delayed 14 days!)
    {
      appNo: 'SK-MO-2026-00119',
      submittedByCitizenId: 'CIT-OTHER-09',
      submittedByCitizenName: 'Applicant Demo Record � Martam',
      applicationFor: 'Self',
      applicantName: 'Applicant Demo Record � Martam',
      firstName: 'Applicant',
      middleName: 'Demo',
      lastName: 'Martam',
      relationType: 'Father',
      relationName: 'Parent Demo Record 19',
      mobile: '98000-00419',
      permanentAddress: {
        address1: 'Martam Nazitam Ward',
        address2: 'Ranipool Range',
        district: 'Gangtok',
        blockGpu: 'Assam Lingzey GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'Martam Nazitam Ward',
        address2: 'Ranipool Range',
        district: 'Gangtok',
        blockGpu: 'Assam Lingzey GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Ranipool Range',
      purpose: 'Timber',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_710_martam.pdf', mandatory: true, status: 'Verified' },
        { name: 'BO Field Verification Report', fileName: 'bo_verification_report_00119.pdf', mandatory: false, status: 'Verified' }
      ],
      trees: [
        { treeNo: 1, species: 'Dhupi (Cryptomeria japonica)', plotNo: '710', gbhFeet: '5.5 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 2, species: 'Dhupi (Cryptomeria japonica)', plotNo: '710', gbhFeet: '5.2 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 3, species: 'Chilaune (Schima wallichii)', plotNo: '710', gbhFeet: '5.0 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 4, species: 'Chilaune (Schima wallichii)', plotNo: '711', gbhFeet: '4.9 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 5, species: 'Katus (Castanopsis indica)', plotNo: '711', gbhFeet: '5.1 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 6, species: 'Katus (Castanopsis indica)', plotNo: '711', gbhFeet: '4.8 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 7, species: 'Tooni (Toona ciliata)', plotNo: '712', gbhFeet: '5.4 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 8, species: 'Pipli (Bucklandia populnea)', plotNo: '712', gbhFeet: '5.3 ft', boMatchStatus: 'Matched on Site' }
      ],
      additionalRemarks: '8 Timber trees for ancestral house reconstruction (Forwarded to DFO).',
      submissionDate: '22 Oct 2026',
      lastUpdatedDate: '05 Nov 2026',
      workflowStageIndex: 5,
      currentStatus: 'Forwarded to DFO',
      roQueue: 'forwarded',
      acfQueue: 'forwarded_dfo',
      dfoQueue: 'pending',
      assignedBoId: 'BO-RANIPOOL-2',
      assignedBoName: 'BO Demo User 2 (Assam Lingzey Block)',
      boAssignedDate: '24 Oct 2026',
      verificationDate: '29 Oct 2026',
      boScheduleTag: 'Report Submitted',
      boReportDate: '30 Oct 2026',
      boForwardedWithRemarks: false,
      boRemarks: 'All 8 Timber trees verified on Plots 710�712.',
      forwardedByRo: 'RO Demo User (Ranipool)',
      forwardedToAcfDate: '01 Nov 2026',
      forwardedByAcf: 'ACF Demo User (Gangtok Division)',
      forwardedToDfoDate: '05 Nov 2026',
      approvalStatus: 'Pending DFO Final Review',
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Not Applicable Yet',
      markingOrderStatus: 'Not Issued',
      markingOrderNo: null,
      markingOrderIssueDate: null,
      markingOrderValidity: null,
      transitPermitStatus: 'Not Applicable Yet',
      transitPermitNo: null,
      rejectionDate: null,
      rejectionReason: null,
      departmentRemarks: 'Forwarded by ACF (Gangtok Division) to DFO (Gangtok Division) as 8 Timber trees exceed ACF statutory limit (Timber \u2264 5) and fall within DFO final authority (Timber \u2264 10).',
      nextExpectedAction: 'DFO final authority review and decision.',
      requiresCitizenAction: false,
      requiredCitizenActionText: null,
      pendingWithRole: 'DFO Demo User (Gangtok Division)',
      pendingSinceDate: '05 Nov 2026',
      daysDelayed: 14,
      history: [
        { stage: 'Application Submitted', date: '22 Oct 2026', actor: 'Applicant Demo Record � Martam', remarks: 'Submitted for 8 Timber trees.' },
        { stage: 'BO Verified', date: '30 Oct 2026', actor: 'BO Demo User 2 (Assam Lingzey Block)', remarks: '8 trees verified.' },
        { stage: 'Forwarded to ACF', date: '01 Nov 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Forwarded to ACF (Timber 8 > RO limit 2).' },
        { stage: 'Forwarded to DFO', date: '05 Nov 2026', actor: 'ACF Demo User (Gangtok Division)', remarks: 'Forwarded to DFO (Timber 8 > ACF limit 5; within DFO limit 10).' }
      ]
    },

    // 20. Forwarded by ACF to DFO (Timber 6 trees > ACF limit 5, Within DFO limit <= 10; Delayed 8 days)
    {
      appNo: 'SK-MO-2026-00120',
      submittedByCitizenId: 'CIT-OTHER-10',
      submittedByCitizenName: 'Applicant Demo Record � Tashi View',
      applicationFor: 'Self',
      applicantName: 'Applicant Demo Record � Tashi View',
      firstName: 'Applicant',
      middleName: 'Demo',
      lastName: 'TashiView',
      relationType: 'Father',
      relationName: 'Parent Demo Record 20',
      mobile: '98000-00420',
      permanentAddress: {
        address1: 'Tashi View Point Road',
        address2: 'Gangtok Range',
        district: 'Gangtok',
        blockGpu: 'Samdong Kambal GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'Tashi View Point Road',
        address2: 'Gangtok Range',
        district: 'Gangtok',
        blockGpu: 'Samdong Kambal GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Gangtok Range',
      purpose: 'Timber',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_615_tashiview.pdf', mandatory: true, status: 'Verified' },
        { name: 'BO Field Verification Report', fileName: 'bo_verification_report_00120.pdf', mandatory: false, status: 'Verified' }
      ],
      trees: [
        { treeNo: 1, species: 'Dhupi (Cryptomeria japonica)', plotNo: '615', gbhFeet: '5.1 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 2, species: 'Dhupi (Cryptomeria japonica)', plotNo: '615', gbhFeet: '5.0 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 3, species: 'Chilaune (Schima wallichii)', plotNo: '615', gbhFeet: '4.8 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 4, species: 'Katus (Castanopsis indica)', plotNo: '616', gbhFeet: '5.2 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 5, species: 'Katus (Castanopsis indica)', plotNo: '616', gbhFeet: '4.9 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 6, species: 'Tooni (Toona ciliata)', plotNo: '616', gbhFeet: '5.3 ft', boMatchStatus: 'Matched on Site' }
      ],
      additionalRemarks: '6 Timber trees forwarded by ACF to DFO.',
      submissionDate: '29 Oct 2026',
      lastUpdatedDate: '11 Nov 2026',
      workflowStageIndex: 5,
      currentStatus: 'Forwarded to DFO',
      roQueue: 'forwarded',
      acfQueue: 'forwarded_dfo',
      dfoQueue: 'pending',
      assignedBoId: 'BO-GANGTOK-1',
      assignedBoName: 'BO Demo User 3 (Gangtok Block)',
      boAssignedDate: '31 Oct 2026',
      verificationDate: '05 Nov 2026',
      boScheduleTag: 'Report Submitted',
      boReportDate: '06 Nov 2026',
      boForwardedWithRemarks: false,
      boRemarks: 'All 6 Timber trees verified on Plots 615 & 616.',
      forwardedByRo: 'RO Demo User (Gangtok Range)',
      forwardedToAcfDate: '08 Nov 2026',
      forwardedByAcf: 'ACF Demo User (Gangtok Division)',
      forwardedToDfoDate: '11 Nov 2026',
      approvalStatus: 'Pending DFO Final Review',
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Not Applicable Yet',
      markingOrderStatus: 'Not Issued',
      markingOrderNo: null,
      markingOrderIssueDate: null,
      markingOrderValidity: null,
      transitPermitStatus: 'Not Applicable Yet',
      transitPermitNo: null,
      rejectionDate: null,
      rejectionReason: null,
      departmentRemarks: 'Forwarded by ACF to DFO (Timber 6 > ACF limit 5; within DFO limit 10).',
      nextExpectedAction: 'DFO review and decision.',
      requiresCitizenAction: false,
      requiredCitizenActionText: null,
      pendingWithRole: 'DFO Demo User (Gangtok Division)',
      pendingSinceDate: '11 Nov 2026',
      daysDelayed: 8,
      history: [
        { stage: 'Application Submitted', date: '29 Oct 2026', actor: 'Applicant Demo Record � Tashi View', remarks: 'Submitted for 6 Timber trees.' },
        { stage: 'BO Verified', date: '06 Nov 2026', actor: 'BO Demo User 3 (Gangtok Block)', remarks: '6 trees verified.' },
        { stage: 'Forwarded to ACF', date: '08 Nov 2026', actor: 'RO Demo User (Gangtok Range)', remarks: 'Forwarded to ACF.' },
        { stage: 'Forwarded to DFO', date: '11 Nov 2026', actor: 'ACF Demo User (Gangtok Division)', remarks: 'Forwarded to DFO for final authority decision.' }
      ]
    },

    // 21. Approved by DFO, Marking Order Issued & Transit Permit Issued
    {
      appNo: 'SK-MO-2026-00121',
      submittedByCitizenId: 'CIT-OTHER-11',
      submittedByCitizenName: 'Applicant Demo Record � Luing',
      applicationFor: 'Self',
      applicantName: 'Applicant Demo Record � Luing',
      firstName: 'Applicant',
      middleName: 'Demo',
      lastName: 'Luing',
      relationType: 'Father',
      relationName: 'Parent Demo Record 21',
      mobile: '98000-00421',
      permanentAddress: {
        address1: 'Luing Perbing Road',
        address2: 'Gangtok Range',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'Luing Perbing Road',
        address2: 'Gangtok Range',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Gangtok Range',
      purpose: 'Timber',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_805_luing.pdf', mandatory: true, status: 'Verified' },
        { name: 'BO Field Verification Report', fileName: 'bo_verification_report_00121.pdf', mandatory: false, status: 'Verified' }
      ],
      trees: [
        { treeNo: 1, species: 'Dhupi (Cryptomeria japonica)', plotNo: '805', gbhFeet: '5.6 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 2, species: 'Dhupi (Cryptomeria japonica)', plotNo: '805', gbhFeet: '5.4 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 3, species: 'Dhupi (Cryptomeria japonica)', plotNo: '805', gbhFeet: '5.1 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 4, species: 'Chilaune (Schima wallichii)', plotNo: '806', gbhFeet: '4.9 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 5, species: 'Chilaune (Schima wallichii)', plotNo: '806', gbhFeet: '5.0 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 6, species: 'Katus (Castanopsis indica)', plotNo: '806', gbhFeet: '5.2 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 7, species: 'Tooni (Toona ciliata)', plotNo: '807', gbhFeet: '5.3 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 8, species: 'Pipli (Bucklandia populnea)', plotNo: '807', gbhFeet: '5.5 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 9, species: 'Panisaj (Terminalia myriocarpa)', plotNo: '807', gbhFeet: '5.1 ft', boMatchStatus: 'Matched on Site' }
      ],
      additionalRemarks: '9 Timber trees approved by DFO (Final in-scope authority: Timber <= 10).',
      submissionDate: '01 Oct 2026',
      lastUpdatedDate: '01 Nov 2026',
      workflowStageIndex: 6,
      currentStatus: 'Transit Permit Issued',
      roQueue: 'forwarded',
      acfQueue: 'forwarded_dfo',
      dfoQueue: 'approved',
      assignedBoId: 'BO-GANGTOK-1',
      assignedBoName: 'BO Demo User 3 (Gangtok Block)',
      boAssignedDate: '03 Oct 2026',
      verificationDate: '08 Oct 2026',
      boScheduleTag: 'Report Submitted',
      boReportDate: '09 Oct 2026',
      boForwardedWithRemarks: false,
      boRemarks: 'All 9 Timber trees verified on Plots 805�807.',
      forwardedByRo: 'RO Demo User (Gangtok Range)',
      forwardedToAcfDate: '11 Oct 2026',
      forwardedByAcf: 'ACF Demo User (Gangtok Division)',
      forwardedToDfoDate: '15 Oct 2026',
      approvalStatus: 'Application Approved',
      approvedByRole: 'DFO (Gangtok Division)',
      approvalDate: '21 Oct 2026',
      paymentStatus: 'Payment Completed',
      markingOrderStatus: 'Marking Order Issued',
      markingOrderNo: 'MO/FED/GTK/2026/0027',
      markingOrderIssueDate: '25 Oct 2026',
      markingOrderValidity: 'As per Marking Order conditions',
      transitPermitStatus: 'Transit Permit Issued',
      transitPermitNo: 'TP/FED/GTK/2026/0014',
      rejectionDate: null,
      rejectionReason: null,
      departmentRemarks: 'Approved by DFO (Gangtok Division). Marking Order MO/FED/GTK/2026/0027 and Transit Permit TP/FED/GTK/2026/0014 issued.',
      nextExpectedAction: 'Completed.',
      requiresCitizenAction: false,
      requiredCitizenActionText: null,
      pendingWithRole: 'Completed (Transit Permit Issued)',
      pendingSinceDate: '01 Nov 2026',
      daysDelayed: 0,
      history: [
        { stage: 'Application Submitted', date: '01 Oct 2026', actor: 'Applicant Demo Record � Luing', remarks: 'Submitted for 9 Timber trees.' },
        { stage: 'BO Verified', date: '09 Oct 2026', actor: 'BO Demo User 3 (Gangtok Block)', remarks: 'Verified 9 trees.' },
        { stage: 'Forwarded to ACF', date: '11 Oct 2026', actor: 'RO Demo User (Gangtok Range)', remarks: 'Forwarded to ACF.' },
        { stage: 'Forwarded to DFO', date: '15 Oct 2026', actor: 'ACF Demo User (Gangtok Division)', remarks: 'Forwarded to DFO (9 Timber trees > ACF limit 5).' },
        { stage: 'Marking Order Issue', date: '25 Oct 2026', actor: 'DFO Demo User (Gangtok Division)', remarks: 'Approved by DFO; payment confirmed; Marking Order MO/FED/GTK/2026/0027 issued.' },
        { stage: 'Transit Permit Issue', date: '01 Nov 2026', actor: 'ACF Demo User (Gangtok Division)', remarks: 'Transit Permit TP/FED/GTK/2026/0014 issued.' }
      ]
    },

    // 22. Cancelled Marking Order (Sole authority of DFO - Section 10.8)
    {
      appNo: 'SK-MO-2026-00122',
      submittedByCitizenId: 'CIT-OTHER-12',
      submittedByCitizenName: 'Applicant Demo Record � Penlong',
      applicationFor: 'Self',
      applicantName: 'Applicant Demo Record � Penlong',
      firstName: 'Applicant',
      middleName: 'Demo',
      lastName: 'Penlong',
      relationType: 'Father',
      relationName: 'Parent Demo Record 22',
      mobile: '98000-00422',
      permanentAddress: {
        address1: 'Penlong Ridge',
        address2: 'Gangtok Range',
        district: 'Gangtok',
        blockGpu: 'Samdong Kambal GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'Penlong Ridge',
        address2: 'Gangtok Range',
        district: 'Gangtok',
        blockGpu: 'Samdong Kambal GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Gangtok Range',
      purpose: 'Timber',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_912_penlong.pdf', mandatory: true, status: 'Reviewed' }
      ],
      trees: [
        { treeNo: 1, species: 'Chilaune (Schima wallichii)', plotNo: '912', gbhFeet: '5.0 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 2, species: 'Katus (Castanopsis indica)', plotNo: '912', gbhFeet: '4.8 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 3, species: 'Utis (Alnus nepalensis)', plotNo: '912', gbhFeet: '4.5 ft', boMatchStatus: 'Matched on Site' }
      ],
      additionalRemarks: 'Marking Order subsequently cancelled by DFO.',
      submissionDate: '05 Oct 2026',
      lastUpdatedDate: '12 Nov 2026',
      workflowStageIndex: 5,
      currentStatus: 'Cancelled',
      roQueue: 'forwarded',
      acfQueue: 'approved',
      dfoQueue: 'cancelled',
      assignedBoId: 'BO-GANGTOK-1',
      assignedBoName: 'BO Demo User 3 (Gangtok Block)',
      boAssignedDate: '07 Oct 2026',
      verificationDate: '12 Oct 2026',
      boScheduleTag: 'Report Submitted',
      boReportDate: '13 Oct 2026',
      boForwardedWithRemarks: false,
      boRemarks: '3 trees inspected.',
      forwardedByRo: 'RO Demo User (Gangtok Range)',
      forwardedToAcfDate: '15 Oct 2026',
      forwardedByAcf: null,
      forwardedToDfoDate: null,
      approvalStatus: 'Cancelled by DFO',
      approvedByRole: 'DFO (Gangtok Division)',
      approvalDate: '20 Oct 2026',
      paymentStatus: 'Payment Completed',
      markingOrderStatus: 'Cancelled by DFO',
      markingOrderNo: 'MO/FED/GTK/2026/0019',
      markingOrderIssueDate: '24 Oct 2026',
      markingOrderValidity: 'Cancelled on 12 Nov 2026',
      cancellationReason: 'Cancelled by DFO following Revenue authority civil Partition stay notice on Plot 912; associated Transit Permit invalidated.',
      transitPermitStatus: 'Invalidated upon Marking Order Cancellation',
      transitPermitNo: 'TP/FED/GTK/2026/0009 (Invalidated)',
      rejectionDate: null,
      rejectionReason: null,
      departmentRemarks: 'Marking Order MO/FED/GTK/2026/0019 cancelled under DFO sole cancellation authority; associated Transit Permit invalidated.',
      nextExpectedAction: 'Order cancelled.',
      requiresCitizenAction: false,
      requiredCitizenActionText: null,
      pendingWithRole: 'Closed (Cancelled by DFO)',
      pendingSinceDate: '12 Nov 2026',
      daysDelayed: 0,
      history: [
        { stage: 'Application Submitted', date: '05 Oct 2026', actor: 'Applicant Demo Record � Penlong', remarks: 'Submitted for 3 Timber trees.' },
        { stage: 'Marking Order Issue', date: '24 Oct 2026', actor: 'ACF Demo User (Gangtok Division)', remarks: 'Marking Order MO/FED/GTK/2026/0019 issued.' },
        { stage: 'Marking Order Cancelled', date: '12 Nov 2026', actor: 'DFO Demo User (Gangtok Division)', remarks: 'Marking Order cancelled by DFO with mandatory reason; Transit Permit invalidated.' }
      ]
    },

    // 23. Rejected by ACF / DFO level
    {
      appNo: 'SK-MO-2026-00123',
      submittedByCitizenId: 'CIT-OTHER-13',
      submittedByCitizenName: 'Applicant Demo Record � Marchak',
      applicationFor: 'Self',
      applicantName: 'Applicant Demo Record � Marchak',
      firstName: 'Applicant',
      middleName: 'Demo',
      lastName: 'Marchak',
      relationType: 'Father',
      relationName: 'Parent Demo Record 23',
      mobile: '98000-00423',
      permanentAddress: {
        address1: 'Marchak Ward',
        address2: 'Ranipool Range',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'Marchak Ward',
        address2: 'Ranipool Range',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Ranipool Range',
      purpose: 'Timber',
      khatiyanInApplicantName: false,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_299_marchak.pdf', mandatory: true, status: 'Disputed' },
        { name: 'NOC / Verification Report from Panchayat', fileName: 'panchayat_dispute_report_299.pdf', mandatory: false, status: 'Objection Noted' }
      ],
      trees: [
        { treeNo: 1, species: 'Pipli (Bucklandia populnea)', plotNo: '299', gbhFeet: '5.1 ft', boMatchStatus: 'Disputed Plot' },
        { treeNo: 2, species: 'Pipli (Bucklandia populnea)', plotNo: '299', gbhFeet: '5.0 ft', boMatchStatus: 'Disputed Plot' },
        { treeNo: 3, species: 'Tooni (Toona ciliata)', plotNo: '299', gbhFeet: '4.9 ft', boMatchStatus: 'Disputed Plot' },
        { treeNo: 4, species: 'Chilaune (Schima wallichii)', plotNo: '299', gbhFeet: '4.8 ft', boMatchStatus: 'Disputed Plot' },
        { treeNo: 5, species: 'Katus (Castanopsis indica)', plotNo: '300', gbhFeet: '5.2 ft', boMatchStatus: 'Disputed Plot' },
        { treeNo: 6, species: 'Katus (Castanopsis indica)', plotNo: '300', gbhFeet: '5.0 ft', boMatchStatus: 'Disputed Plot' }
      ],
      additionalRemarks: '6 Timber trees on co-owned plot.',
      submissionDate: '18 Oct 2026',
      lastUpdatedDate: '07 Nov 2026',
      workflowStageIndex: 5,
      currentStatus: 'Rejected',
      roQueue: 'forwarded',
      acfQueue: 'rejected',
      dfoQueue: 'rejected',
      assignedBoId: 'BO-RANIPOOL-2',
      assignedBoName: 'BO Demo User 2 (Assam Lingzey Block)',
      boAssignedDate: '20 Oct 2026',
      verificationDate: '25 Oct 2026',
      boScheduleTag: 'Forwarded with Remarks',
      boReportDate: '26 Oct 2026',
      boForwardedWithRemarks: true,
      boRemarks: 'Co-sharers raised written ownership objection during site inspection; Panchayat report notes unresolved boundary dispute.',
      forwardedByRo: 'RO Demo User (Ranipool)',
      forwardedToAcfDate: '29 Oct 2026',
      forwardedByAcf: 'ACF Demo User (Gangtok Division)',
      forwardedToDfoDate: '02 Nov 2026',
      approvalStatus: 'Rejected',
      approvedByRole: 'DFO (Gangtok Division)',
      approvalDate: null,
      paymentStatus: 'Not Applicable',
      markingOrderStatus: 'Not Issued',
      markingOrderNo: null,
      markingOrderIssueDate: null,
      markingOrderValidity: null,
      transitPermitStatus: 'Not Applicable',
      transitPermitNo: null,
      rejectionDate: '07 Nov 2026',
      rejectionReason: 'Unresolved land ownership dispute reported in Panchayat & BO verification',
      departmentRemarks: 'Rejected due to unresolved plot ownership dispute recorded during field verification and lack of valid Land Owner NOC.',
      nextExpectedAction: 'Closed.',
      requiresCitizenAction: false,
      requiredCitizenActionText: null,
      pendingWithRole: 'Closed (Rejected)',
      pendingSinceDate: '07 Nov 2026',
      daysDelayed: 0,
      history: [
        { stage: 'Application Submitted', date: '18 Oct 2026', actor: 'Applicant Demo Record � Marchak', remarks: 'Submitted for 6 Timber trees.' },
        { stage: 'BO Verified (Forwarded with Remarks)', date: '26 Oct 2026', actor: 'BO Demo User 2 (Assam Lingzey Block)', remarks: 'Forwarded to RO with ownership dispute remarks.' },
        { stage: 'Forwarded to ACF', date: '29 Oct 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Forwarded to ACF.' },
        { stage: 'Rejected', date: '07 Nov 2026', actor: 'DFO Demo User (Gangtok Division)', remarks: 'Rejected due to unresolved ownership dispute.' }
      ]
    },

    // 24. Namchi Division / Namchi Range Application (For multi-division filter & officer switch demonstration)
    {
      appNo: 'SK-MO-2026-00124',
      submittedByCitizenId: 'CIT-OTHER-14',
      submittedByCitizenName: 'Applicant Demo Record � Namthang',
      applicationFor: 'Self',
      applicantName: 'Applicant Demo Record � Namthang',
      firstName: 'Applicant',
      middleName: 'Demo',
      lastName: 'Namthang',
      relationType: 'Father',
      relationName: 'Parent Demo Record 24',
      mobile: '98000-00424',
      permanentAddress: {
        address1: 'Namthang Block Ward 3',
        address2: 'Namchi District',
        district: 'Namchi',
        blockGpu: 'Namthang GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'Namthang Block Ward 3',
        address2: 'Namchi District',
        district: 'Namchi',
        blockGpu: 'Namthang GPU'
      },
      district: 'Namchi',
      division: 'Namchi',
      range: 'Namchi Range',
      purpose: 'Firewood',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_plot_112_namthang.pdf', mandatory: true, status: 'Verified' },
        { name: 'BO Field Verification Report', fileName: 'bo_verification_report_00124.pdf', mandatory: false, status: 'Verified' }
      ],
      trees: [
        { treeNo: 1, species: 'Utis (Alnus nepalensis)', plotNo: '112', gbhFeet: '4.3 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 2, species: 'Utis (Alnus nepalensis)', plotNo: '112', gbhFeet: '4.1 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 3, species: 'Chilaune (Schima wallichii)', plotNo: '112', gbhFeet: '4.4 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 4, species: 'Chilaune (Schima wallichii)', plotNo: '113', gbhFeet: '4.2 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 5, species: 'Katus (Castanopsis indica)', plotNo: '113', gbhFeet: '4.6 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 6, species: 'Katus (Castanopsis indica)', plotNo: '113', gbhFeet: '4.5 ft', boMatchStatus: 'Matched on Site' }
      ],
      additionalRemarks: '6 Firewood trees in Namchi Range (Forwarded to ACF Namchi).',
      submissionDate: '05 Nov 2026',
      lastUpdatedDate: '14 Nov 2026',
      workflowStageIndex: 5,
      currentStatus: 'Forwarded to ACF',
      roQueue: 'forwarded',
      acfQueue: 'pending',
      assignedBoId: 'BO-NAMCHI-1',
      assignedBoName: 'BO Demo User 4 (Namchi Block)',
      boAssignedDate: '07 Nov 2026',
      verificationDate: '11 Nov 2026',
      boScheduleTag: 'Report Submitted',
      boReportDate: '12 Nov 2026',
      boForwardedWithRemarks: false,
      boRemarks: 'All 6 Firewood trees verified on Plots 112 & 113.',
      forwardedByRo: 'RO Demo User (Namchi Range)',
      forwardedToAcfDate: '14 Nov 2026',
      forwardedByAcf: null,
      forwardedToDfoDate: null,
      approvalStatus: 'Pending ACF Review',
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Not Applicable Yet',
      markingOrderStatus: 'Not Issued',
      markingOrderNo: null,
      markingOrderIssueDate: null,
      markingOrderValidity: null,
      transitPermitStatus: 'Not Applicable Yet',
      transitPermitNo: null,
      rejectionDate: null,
      rejectionReason: null,
      departmentRemarks: 'Forwarded by RO (Namchi Range) to ACF (Namchi Division) as 6 Firewood trees exceed RO limit of 5.',
      nextExpectedAction: 'ACF (Namchi Division) review.',
      requiresCitizenAction: false,
      requiredCitizenActionText: null,
      pendingWithRole: 'ACF Demo User (Namchi Division)',
      pendingSinceDate: '14 Nov 2026',
      daysDelayed: 5,
      history: [
        { stage: 'Application Submitted', date: '05 Nov 2026', actor: 'Applicant Demo Record � Namthang', remarks: 'Submitted for 6 Firewood trees.' },
        { stage: 'BO Verified', date: '12 Nov 2026', actor: 'BO Demo User 4 (Namchi Block)', remarks: '6 trees verified.' },
        { stage: 'Forwarded to ACF', date: '14 Nov 2026', actor: 'RO Demo User (Namchi Range)', remarks: 'Forwarded to ACF Namchi.' }
      ]
    },

    // 25. Scenario B Demonstration: Applied by Range Officer (RO-RANIPOOL) on behalf of Citizen (Approved - Payment Pending)
    {
      appNo: 'SK-MO-2026-00125',
      submittedByCitizenId: 'RO-RANIPOOL',
      submittedByCitizenName: 'RO Demo User (Ranipool)',
      appliedByUserId: 'RO-RANIPOOL',
      appliedByRole: 'ro',
      appliedByUserName: 'RO Demo User (Ranipool)',
      applicationFor: 'Apply on Behalf of Citizen',
      applicantName: 'Tseten Tshering Bhutia (Beneficiary)',
      firstName: 'Tseten',
      middleName: 'Tshering',
      lastName: 'Bhutia',
      relationType: 'Father',
      relationName: 'Pema Bhutia',
      mobile: '98000-00331',
      permanentAddress: {
        address1: 'House No. 12, Middle Martam',
        address2: 'Near Martam Secondary School',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'House No. 12, Middle Martam',
        address2: 'Near Martam Secondary School',
        district: 'Gangtok',
        blockGpu: 'Ranka GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Ranipool Range',
      purpose: 'Firewood',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_parcha_martam_12.pdf', mandatory: true, status: 'Verified' },
        { name: 'BO Field Verification Report', fileName: 'bo_report_00125.pdf', mandatory: false, status: 'Verified' }
      ],
      trees: [
        { treeNo: 1, species: 'Utis (Alnus nepalensis)', plotNo: '58/A', gbhFeet: '4.1 ft', boMatchStatus: 'Matched on Site' },
        { treeNo: 2, species: 'Chilaune (Schima wallichii)', plotNo: '58/A', gbhFeet: '3.9 ft', boMatchStatus: 'Matched on Site' }
      ],
      additionalRemarks: 'Applied by Range Officer (Ranipool Range) on behalf of elderly citizen for domestic firewood marking.',
      submissionDate: '10 Nov 2026',
      lastUpdatedDate: '18 Nov 2026',
      workflowStageIndex: 4,
      currentStatus: 'Approved � Payment Pending',
      roQueue: 'approved',
      assignedBoId: 'BO-RANIPOOL-1',
      assignedBoName: 'BO Demo User 1 (Ranipool Block)',
      verificationDate: '14 Nov 2026',
      boReportDate: '15 Nov 2026',
      approvalStatus: 'Approved by Range Officer',
      approvedByRole: 'Range Officer (RO)',
      approvalDate: '18 Nov 2026',
      paymentStatus: 'Payment Pending (&#8377;50.00)',
      markingOrderStatus: 'Not Issued',
      markingOrderNo: null,
      transitPermitStatus: 'Not Applicable Yet',
      transitPermitNo: null,
      departmentRemarks: 'Application created by RO on behalf of citizen. Approved within RO statutory limit (2 trees <= 3). Payment of &#8377;50 pending by RO creator.',
      nextExpectedAction: 'Range Officer (RO-RANIPOOL) who created this application must complete the &#8377;50 fee payment.',
      requiresCitizenAction: false,
      history: [
        { stage: 'Application Submitted', date: '10 Nov 2026', actor: 'RO Demo User (Ranipool) [On behalf of Citizen]', remarks: 'Application submitted by RO on behalf of citizen.' },
        { stage: 'BO Verified', date: '15 Nov 2026', actor: 'BO Demo User 1 (Ranipool Block)', remarks: '2 trees verified on Plot 58/A.' },
        { stage: 'Application Approved (RO)', date: '18 Nov 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Approved within RO authority. Payment of &#8377;50 pending by RO creator.' }
      ]
    },

    // 26. Scenario C Demonstration: Applied by Block Officer (BO-RANIPOOL-1) on behalf of Citizen (Approved - Payment Pending)
    {
      appNo: 'SK-MO-2026-00126',
      submittedByCitizenId: 'BO-RANIPOOL-1',
      submittedByCitizenName: 'BO Demo User 1 (Ranipool Block)',
      appliedByUserId: 'BO-RANIPOOL-1',
      appliedByRole: 'bo',
      appliedByUserName: 'BO Demo User 1 (Ranipool Block)',
      applicationFor: 'Apply on Behalf of Citizen',
      applicantName: 'Nima Wangdi Lepcha (Beneficiary)',
      firstName: 'Nima',
      middleName: 'Wangdi',
      lastName: 'Lepcha',
      relationType: 'Father',
      relationName: 'Karma Lepcha',
      mobile: '98000-00332',
      permanentAddress: {
        address1: 'House No. 7, Upper Assam Lingzey',
        address2: 'Near Forest Beat Post',
        district: 'Gangtok',
        blockGpu: 'Assam Lingzey GPU',
        sameAsPermanent: true
      },
      residentialAddress: {
        address1: 'House No. 7, Upper Assam Lingzey',
        address2: 'Near Forest Beat Post',
        district: 'Gangtok',
        blockGpu: 'Assam Lingzey GPU'
      },
      district: 'Gangtok',
      division: 'Gangtok',
      range: 'Ranipool Range',
      purpose: 'Timber',
      khatiyanInApplicantName: true,
      documents: [
        { name: 'Land Parcha / Khatiyan', fileName: 'khatiyan_parcha_lingzey_7.pdf', mandatory: true, status: 'Verified' },
        { name: 'BO Field Verification Report', fileName: 'bo_report_00126.pdf', mandatory: false, status: 'Verified' }
      ],
      trees: [
        { treeNo: 1, species: 'Chilaune (Schima wallichii)', plotNo: '77/B', gbhFeet: '4.8 ft', boMatchStatus: 'Matched on Site' }
      ],
      additionalRemarks: 'Applied by Block Officer on behalf of local farmer requiring 1 dry timber tree for cowshed repair.',
      submissionDate: '11 Nov 2026',
      lastUpdatedDate: '18 Nov 2026',
      workflowStageIndex: 4,
      currentStatus: 'Approved � Payment Pending',
      roQueue: 'approved',
      assignedBoId: 'BO-RANIPOOL-1',
      assignedBoName: 'BO Demo User 1 (Ranipool Block)',
      verificationDate: '14 Nov 2026',
      boReportDate: '15 Nov 2026',
      approvalStatus: 'Approved by Range Officer',
      approvedByRole: 'Range Officer (RO)',
      approvalDate: '18 Nov 2026',
      paymentStatus: 'Payment Pending (&#8377;50.00)',
      markingOrderStatus: 'Not Issued',
      markingOrderNo: null,
      transitPermitStatus: 'Not Applicable Yet',
      transitPermitNo: null,
      departmentRemarks: 'Application created by Block Officer on behalf of citizen. Approved within RO statutory limit (1 tree <= 3). Payment of &#8377;50 pending by BO creator.',
      nextExpectedAction: 'Block Officer (BO-RANIPOOL-1) who created this application must complete the &#8377;50 fee payment.',
      requiresCitizenAction: false,
      history: [
        { stage: 'Application Submitted', date: '11 Nov 2026', actor: 'BO Demo User 1 (Ranipool Block) [On behalf of Citizen]', remarks: 'Application submitted by Block Officer on behalf of citizen.' },
        { stage: 'BO Verified', date: '15 Nov 2026', actor: 'BO Demo User 1 (Ranipool Block)', remarks: '1 timber tree verified on Plot 77/B.' },
        { stage: 'Application Approved (RO)', date: '18 Nov 2026', actor: 'RO Demo User (Ranipool)', remarks: 'Approved within RO authority. Payment of &#8377;50 pending by BO creator.' }
      ]
    }
    ,
    // =========================================================================
    // ADDITIONAL STANDARDIZED REPRESENTATIVE APPLICATIONS (00127 - 00144)
    // =========================================================================
    {
      appNo: 'SK-MO-2026-00127',
      ackNo: 'ACK-FED-2026-00327',
      submittedDate: '16 Nov 2026',
      lastUpdatedDate: '16 Nov 2026',
      currentStatus: 'Application Submitted',
      statusClass: 'status-submitted',
      applicantName: 'Karma Tshering Lepcha',
      relationType: 'Son of',
      relationName: 'Tenzing Lepcha',
      applicantCategory: 'Individual Citizen',
      phone: '9832044551',
      email: 'karma.tshering@sikkimdemo.in',
      address: 'Penlong Busty, Gangtok Range',
      district: 'Gangtok',
      division: 'Gangtok Territorial Division',
      range: 'Gangtok Range',
      revenueBlock: 'Penlong Block',
      gpu: 'Penlong GPU',
      khasraNo: '312',
      khatiyanParchaNo: 'KP-2024-GTK-0312',
      totalAreaAcres: '1.80 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation (Sukha Khet)',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-01',
      appliedByRole: 'citizen',
      appliedByUserName: 'Karma Tshering Lepcha',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Firewood',
      fellingReason: 'Bonafide domestic firewood for winter season heating and cooking.',
      trees: [
        { id: 'T-127-1', treeNo: 1, species: 'Alnus (Utis)', girthInches: 32, gbhFeet: '2.67 ft', plotNo: '312', estimatedVolumeCuM: 0.85, condition: 'Green / Mature', photoId: 'P-127-1' },
        { id: 'T-127-2', treeNo: 2, species: 'Castanopsis (Katus)', girthInches: 38, gbhFeet: '3.17 ft', plotNo: '312', estimatedVolumeCuM: 1.20, condition: 'Mature', photoId: 'P-127-2' }
      ],
      assignedBoId: null,
      assignedBoName: null,
      verificationScheduledDate: null,
      verificationCompletedDate: null,
      approvalAuthority: 'RO',
      approvalStatus: 'Pending Preliminary Review',
      approvedByOfficer: null,
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Pending Approval',
      paymentAmount: 50,
      paymentReceiptNo: null,
      paymentDate: null,
      isTransitPermitRequired: false,
      transitPermitStatus: 'Not Required',
      transitPermitNo: null,
      markingOrderNo: null,
      markingOrderIssueDate: null,
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '16 Nov 2026', actor: 'Karma Tshering Lepcha (Citizen)', remarks: 'Application submitted online for 2 Firewood trees in Gangtok Range.' }
      ]
    },
    {
      appNo: 'SK-MO-2026-00128',
      ackNo: 'ACK-FED-2026-00328',
      submittedDate: '15 Nov 2026',
      lastUpdatedDate: '15 Nov 2026',
      currentStatus: 'Application Submitted',
      statusClass: 'status-submitted',
      applicantName: 'Passang Lepcha',
      relationType: 'Son of',
      relationName: 'N. T. Lepcha',
      applicantCategory: 'Individual Citizen',
      phone: '9832055662',
      email: 'passang.lepcha@sikkimdemo.in',
      address: 'Kabi Lungchok, Mangan District',
      district: 'Mangan',
      division: 'Mangan Territorial Division',
      range: 'Mangan Range',
      revenueBlock: 'Kabi Block',
      gpu: 'Kabi Lungchok GPU',
      khasraNo: '88',
      khatiyanParchaNo: 'KP-2024-MGN-0088',
      totalAreaAcres: '2.50 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation (Sukha Khet)',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-02',
      appliedByRole: 'citizen',
      appliedByUserName: 'Passang Lepcha',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Timber',
      fellingReason: 'Bonafide rural timber requirement for kitchen roof and attic construction.',
      trees: [
        { id: 'T-128-1', treeNo: 1, species: 'Schima (Chilaune)', girthInches: 42, gbhFeet: '3.50 ft', plotNo: '88', estimatedVolumeCuM: 1.40, condition: 'Mature', photoId: 'P-128-1' },
        { id: 'T-128-2', treeNo: 2, species: 'Alnus (Utis)', girthInches: 36, gbhFeet: '3.00 ft', plotNo: '88', estimatedVolumeCuM: 1.10, condition: 'Mature', photoId: 'P-128-2' }
      ],
      assignedBoId: null,
      assignedBoName: null,
      verificationScheduledDate: null,
      verificationCompletedDate: null,
      approvalAuthority: 'RO',
      approvalStatus: 'Pending Preliminary Review',
      approvedByOfficer: null,
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Pending Approval',
      paymentAmount: 50,
      paymentReceiptNo: null,
      paymentDate: null,
      isTransitPermitRequired: false,
      transitPermitStatus: 'Not Required',
      transitPermitNo: null,
      markingOrderNo: null,
      markingOrderIssueDate: null,
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '15 Nov 2026', actor: 'Passang Lepcha (Citizen)', remarks: 'Application submitted online for 2 Timber trees in Mangan Range.' }
      ]
    },
    {
      appNo: 'SK-MO-2026-00129',
      ackNo: 'ACK-FED-2026-00329',
      submittedDate: '10 Nov 2026',
      lastUpdatedDate: '15 Nov 2026',
      currentStatus: 'BO Verified',
      statusClass: 'status-verified',
      applicantName: 'Kinzang Wangchuk Bhutia',
      relationType: 'Son of',
      relationName: 'P. W. Bhutia',
      applicantCategory: 'Individual Citizen',
      phone: '9832066773',
      email: 'kinzang.wangchuk@sikkimdemo.in',
      address: 'Namthang Busty, Namchi District',
      district: 'Namchi',
      division: 'Namchi Territorial Division',
      range: 'Namchi Range',
      revenueBlock: 'Namthang Block',
      gpu: 'Namthang GPU',
      khasraNo: '144',
      khatiyanParchaNo: 'KP-2024-NMC-0144',
      totalAreaAcres: '1.40 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation (Sukha Khet)',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-01',
      appliedByRole: 'citizen',
      appliedByUserName: 'Kinzang Wangchuk Bhutia',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Firewood',
      fellingReason: 'Bonafide domestic firewood and hearth fuel.',
      trees: [
        { id: 'T-129-1', treeNo: 1, species: 'Alnus (Utis)', girthInches: 30, gbhFeet: '2.50 ft', plotNo: '144', estimatedVolumeCuM: 0.80, condition: 'Mature', photoId: 'P-129-1', boMatchStatus: 'Matched on Site', verifiedSpecies: 'Utis', verifiedGbhFeet: '2.50 ft', boVerified: true }
      ],
      assignedBoId: 'BO-NAMCHI-1',
      assignedBoName: 'BO Namchi Demo User (Namchi Range)',
      verificationScheduledDate: '14 Nov 2026',
      verificationCompletedDate: '15 Nov 2026',
      approvalAuthority: 'RO',
      approvalStatus: 'Field Verification Completed',
      approvedByOfficer: null,
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Pending Approval',
      paymentAmount: 50,
      paymentReceiptNo: null,
      paymentDate: null,
      isTransitPermitRequired: false,
      transitPermitStatus: 'Not Required',
      transitPermitNo: null,
      markingOrderNo: null,
      markingOrderIssueDate: null,
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '10 Nov 2026', actor: 'Kinzang Wangchuk (Citizen)', remarks: 'Application submitted for 1 Firewood tree.' },
        { stage: 'Verification Scheduled', date: '12 Nov 2026', actor: 'RO Namchi Demo User', remarks: 'Field verification assigned to BO Namchi.' },
        { stage: 'BO Verified', date: '15 Nov 2026', actor: 'BO Namchi Demo User', remarks: 'Site inspection completed. Tree verified on plot 144.' }
      ]
    },
    {
      appNo: 'SK-MO-2026-00130',
      ackNo: 'ACK-FED-2026-00330',
      submittedDate: '09 Nov 2026',
      lastUpdatedDate: '14 Nov 2026',
      currentStatus: 'BO Verified',
      statusClass: 'status-verified',
      applicantName: 'Dechen Palden Bhutia',
      relationType: 'Daughter of',
      relationName: 'Karma Palden',
      applicantCategory: 'Individual Citizen',
      phone: '9832077884',
      email: 'dechen.palden@sikkimdemo.in',
      address: 'Yuksom Ward, Gyalshing District',
      district: 'Gyalshing',
      division: 'Gyalshing Territorial Division',
      range: 'Gyalshing Range',
      revenueBlock: 'Yuksom Block',
      gpu: 'Yuksom GPU',
      khasraNo: '95',
      khatiyanParchaNo: 'KP-2024-GYL-0095',
      totalAreaAcres: '2.00 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation (Sukha Khet)',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-01',
      appliedByRole: 'citizen',
      appliedByUserName: 'Dechen Palden Bhutia',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Timber',
      fellingReason: 'Bonafide domestic timber for traditional farmhouse maintenance.',
      trees: [
        { id: 'T-130-1', treeNo: 1, species: 'Cryptomeria (Dhupi)', girthInches: 44, gbhFeet: '3.67 ft', plotNo: '95', estimatedVolumeCuM: 1.55, condition: 'Mature', photoId: 'P-130-1', boMatchStatus: 'Matched on Site', verifiedSpecies: 'Dhupi (Cryptomeria)', verifiedGbhFeet: '3.67 ft', boVerified: true },
        { id: 'T-130-2', treeNo: 2, species: 'Schima (Chilaune)', girthInches: 38, gbhFeet: '3.17 ft', plotNo: '95', estimatedVolumeCuM: 1.25, condition: 'Mature', photoId: 'P-130-2', boMatchStatus: 'Matched on Site', verifiedSpecies: 'Chilaune', verifiedGbhFeet: '3.17 ft', boVerified: true }
      ],
      assignedBoId: 'BO-GYALSHING-1',
      assignedBoName: 'BO Gyalshing Demo User',
      verificationScheduledDate: '12 Nov 2026',
      verificationCompletedDate: '14 Nov 2026',
      approvalAuthority: 'RO',
      approvalStatus: 'Field Verification Completed',
      approvedByOfficer: null,
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Pending Approval',
      paymentAmount: 50,
      paymentReceiptNo: null,
      paymentDate: null,
      isTransitPermitRequired: false,
      transitPermitStatus: 'Not Required',
      transitPermitNo: null,
      markingOrderNo: null,
      markingOrderIssueDate: null,
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '09 Nov 2026', actor: 'Dechen Palden (Citizen)', remarks: 'Application submitted for 2 Timber trees.' },
        { stage: 'Verification Scheduled', date: '11 Nov 2026', actor: 'RO Gyalshing Demo User', remarks: 'Verification assigned to BO Gyalshing.' },
        { stage: 'BO Verified', date: '14 Nov 2026', actor: 'BO Gyalshing Demo User', remarks: 'Field verification submitted with site coordinates.' }
      ]
    },
    {
      appNo: 'SK-MO-2026-00131',
      ackNo: 'ACK-FED-2026-00331',
      submittedDate: '05 Nov 2026',
      lastUpdatedDate: '16 Nov 2026',
      currentStatus: 'Forwarded to DFO',
      statusClass: 'status-forwarded',
      applicantName: 'Tshering Ongmu Bhutia',
      relationType: 'Wife of',
      relationName: 'Late S. T. Bhutia',
      applicantCategory: 'Individual Citizen',
      phone: '9832088995',
      email: 'tshering.ongmu@sikkimdemo.in',
      address: 'Ravangla Sub-Division, Namchi',
      district: 'Namchi',
      division: 'Namchi Territorial Division',
      range: 'Ravangla Range',
      revenueBlock: 'Ravangla Block',
      gpu: 'Ravangla GPU',
      khasraNo: '230',
      khatiyanParchaNo: 'KP-2024-NMC-0230',
      totalAreaAcres: '3.80 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation (Sukha Khet)',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-01',
      appliedByRole: 'citizen',
      appliedByUserName: 'Tshering Ongmu Bhutia',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Timber',
      fellingReason: 'Bonafide family house reconstruction following severe storm damage (8 Timber trees).',
      trees: [
        { id: 'T-131-1', treeNo: 1, species: 'Cryptomeria (Dhupi)', girthInches: 46, gbhFeet: '3.83 ft', plotNo: '230', estimatedVolumeCuM: 1.70, condition: 'Mature', photoId: 'P-131-1', boMatchStatus: 'Matched on Site', boVerified: true },
        { id: 'T-131-2', treeNo: 2, species: 'Cryptomeria (Dhupi)', girthInches: 42, gbhFeet: '3.50 ft', plotNo: '230', estimatedVolumeCuM: 1.45, condition: 'Mature', photoId: 'P-131-2', boMatchStatus: 'Matched on Site', boVerified: true },
        { id: 'T-131-3', treeNo: 3, species: 'Schima (Chilaune)', girthInches: 40, gbhFeet: '3.33 ft', plotNo: '230', estimatedVolumeCuM: 1.30, condition: 'Mature', photoId: 'P-131-3', boMatchStatus: 'Matched on Site', boVerified: true },
        { id: 'T-131-4', treeNo: 4, species: 'Castanopsis (Katus)', girthInches: 44, gbhFeet: '3.67 ft', plotNo: '230', estimatedVolumeCuM: 1.55, condition: 'Mature', photoId: 'P-131-4', boMatchStatus: 'Matched on Site', boVerified: true }
      ],
      assignedBoId: 'BO-NAMCHI-1',
      assignedBoName: 'BO Namchi Demo User',
      verificationScheduledDate: '09 Nov 2026',
      verificationCompletedDate: '12 Nov 2026',
      approvalAuthority: 'DFO',
      approvalStatus: 'Forwarded to DFO (Timber > 6 Trees)',
      approvedByOfficer: null,
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Pending DFO Approval',
      paymentAmount: 50,
      paymentReceiptNo: null,
      paymentDate: null,
      isTransitPermitRequired: false,
      transitPermitStatus: 'Not Required',
      transitPermitNo: null,
      markingOrderNo: null,
      markingOrderIssueDate: null,
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '05 Nov 2026', actor: 'Tshering Ongmu (Citizen)', remarks: 'Application submitted for 8 Timber trees.' },
        { stage: 'BO Verified', date: '12 Nov 2026', actor: 'BO Namchi Demo User', remarks: 'Field verification completed.' },
        { stage: 'Forwarded to ACF', date: '14 Nov 2026', actor: 'RO Namchi Demo User', remarks: 'Tree count exceeds RO authority.' },
        { stage: 'Forwarded to DFO', date: '16 Nov 2026', actor: 'ACF Namchi Demo User', remarks: 'Tree count exceeds ACF authority (Timber > 6). Escalated to DFO.' }
      ]
    },
    {
      appNo: 'SK-MO-2026-00132',
      ackNo: 'ACK-FED-2026-00332',
      submittedDate: '11 Nov 2026',
      lastUpdatedDate: '16 Nov 2026',
      currentStatus: 'Returned for Correction',
      statusClass: 'status-returned',
      applicantName: 'Birkha Bahadur Subba',
      relationType: 'Son of',
      relationName: 'M. B. Subba',
      applicantCategory: 'Individual Citizen',
      phone: '9832099006',
      email: 'birkha.subba@sikkimdemo.in',
      address: 'Pakyong Bazar Ward, Pakyong',
      district: 'Pakyong',
      division: 'Pakyong Territorial Division',
      range: 'Pakyong Range',
      revenueBlock: 'Pakyong Block',
      gpu: 'Pakyong GPU',
      khasraNo: '175',
      khatiyanParchaNo: 'KP-2024-PKY-0175',
      totalAreaAcres: '1.20 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation (Sukha Khet)',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-01',
      appliedByRole: 'citizen',
      appliedByUserName: 'Birkha Bahadur Subba',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Firewood',
      fellingReason: 'Bonafide firewood requirement.',
      trees: [
        { id: 'T-132-1', treeNo: 1, species: 'Alnus (Utis)', girthInches: 28, gbhFeet: '2.33 ft', plotNo: '175', estimatedVolumeCuM: 0.70, condition: 'Mature', photoId: 'P-132-1' }
      ],
      assignedBoId: null,
      assignedBoName: null,
      verificationScheduledDate: null,
      verificationCompletedDate: null,
      approvalAuthority: 'RO',
      approvalStatus: 'Returned for Correction',
      approvedByOfficer: null,
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Pending Scrutiny',
      paymentAmount: 50,
      paymentReceiptNo: null,
      paymentDate: null,
      isTransitPermitRequired: false,
      transitPermitStatus: 'Not Required',
      transitPermitNo: null,
      markingOrderNo: null,
      markingOrderIssueDate: null,
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '11 Nov 2026', actor: 'Birkha Bahadur Subba (Citizen)', remarks: 'Application submitted online.' },
        { stage: 'Returned for Correction', date: '16 Nov 2026', actor: 'RO Pakyong Demo User', remarks: 'The uploaded Land Parcha (KP-2024-PKY-0175) is illegible and missing the official revenue revenue seal. Please re-upload a clear scanned copy of the valid Parcha.' }
      ]
    },
    {
      appNo: 'SK-MO-2026-00133',
      ackNo: 'ACK-FED-2026-00333',
      submittedDate: '12 Nov 2026',
      lastUpdatedDate: '17 Nov 2026',
      currentStatus: 'Returned for Correction',
      statusClass: 'status-returned',
      applicantName: 'Norbu Tamang',
      relationType: 'Son of',
      relationName: 'D. Tamang',
      applicantCategory: 'Individual Citizen',
      phone: '9832100117',
      email: 'norbu.tamang@sikkimdemo.in',
      address: 'Sombaria Ward, Soreng District',
      district: 'Soreng',
      division: 'Soreng Territorial Division',
      range: 'Soreng Range',
      revenueBlock: 'Sombaria Block',
      gpu: 'Sombaria GPU',
      khasraNo: '62',
      khatiyanParchaNo: 'KP-2024-SRG-0062',
      totalAreaAcres: '2.10 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation (Sukha Khet)',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-01',
      appliedByRole: 'citizen',
      appliedByUserName: 'Norbu Tamang',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Timber',
      fellingReason: 'Timber for cowshed and storehouse repair.',
      trees: [
        { id: 'T-133-1', treeNo: 1, species: 'Schima (Chilaune)', girthInches: 36, gbhFeet: '3.00 ft', plotNo: '62', estimatedVolumeCuM: 1.10, condition: 'Mature', photoId: 'P-133-1' }
      ],
      assignedBoId: null,
      assignedBoName: null,
      verificationScheduledDate: null,
      verificationCompletedDate: null,
      approvalAuthority: 'RO',
      approvalStatus: 'Returned for Correction',
      approvedByOfficer: null,
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Pending Scrutiny',
      paymentAmount: 50,
      paymentReceiptNo: null,
      paymentDate: null,
      isTransitPermitRequired: false,
      transitPermitStatus: 'Not Required',
      transitPermitNo: null,
      markingOrderNo: null,
      markingOrderIssueDate: null,
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '12 Nov 2026', actor: 'Norbu Tamang (Citizen)', remarks: 'Application submitted online.' },
        { stage: 'Returned for Correction', date: '17 Nov 2026', actor: 'RO Soreng Demo User', remarks: 'Khasra plot number 62 indicated in form does not correspond with the khasra plot listed in the uploaded land document. Please correct the plot number.' }
      ]
    },
    {
      appNo: 'SK-MO-2026-00134',
      ackNo: 'ACK-FED-2026-00334',
      submittedDate: '13 Nov 2026',
      lastUpdatedDate: '17 Nov 2026',
      currentStatus: 'Returned for Correction',
      statusClass: 'status-returned',
      applicantName: 'Ongyal Bhutia',
      relationType: 'Son of',
      relationName: 'K. Bhutia',
      applicantCategory: 'Individual Citizen',
      phone: '9832111228',
      email: 'ongyal.bhutia@sikkimdemo.in',
      address: 'Mangan Bazar, Mangan District',
      district: 'Mangan',
      division: 'Mangan Territorial Division',
      range: 'Mangan Range',
      revenueBlock: 'Mangan Block',
      gpu: 'Mangan Nagar Panchayat',
      khasraNo: '119',
      khatiyanParchaNo: 'KP-2024-MGN-0119',
      totalAreaAcres: '1.60 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation (Sukha Khet)',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-02',
      appliedByRole: 'citizen',
      appliedByUserName: 'Ongyal Bhutia',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Firewood',
      fellingReason: 'Bonafide domestic firewood.',
      trees: [
        { id: 'T-134-1', treeNo: 1, species: 'Alnus (Utis)', girthInches: 30, gbhFeet: '2.50 ft', plotNo: '119', estimatedVolumeCuM: 0.80, condition: 'Mature', photoId: 'P-134-1' }
      ],
      assignedBoId: null,
      assignedBoName: null,
      verificationScheduledDate: null,
      verificationCompletedDate: null,
      approvalAuthority: 'RO',
      approvalStatus: 'Returned for Correction',
      approvedByOfficer: null,
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Pending Scrutiny',
      paymentAmount: 50,
      paymentReceiptNo: null,
      paymentDate: null,
      isTransitPermitRequired: false,
      transitPermitStatus: 'Not Required',
      transitPermitNo: null,
      markingOrderNo: null,
      markingOrderIssueDate: null,
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '13 Nov 2026', actor: 'Ongyal Bhutia (Citizen)', remarks: 'Application submitted online.' },
        { stage: 'Returned for Correction', date: '17 Nov 2026', actor: 'RO Mangan Demo User', remarks: 'Applicant identity proof file was corrupted during upload. Please re-upload a readable Aadhaar / Sikkim Certificate of Identification copy.' }
      ]
    },
    {
      appNo: 'SK-MO-2026-00135',
      ackNo: 'ACK-FED-2026-00335',
      submittedDate: '08 Nov 2026',
      lastUpdatedDate: '17 Nov 2026',
      currentStatus: 'Approved � Payment Pending',
      statusClass: 'status-approved',
      applicantName: 'Tenzing Norbu Sherpa',
      relationType: 'Son of',
      relationName: 'D. Sherpa',
      applicantCategory: 'Individual Citizen',
      phone: '9832122339',
      email: 'tenzing.norbu@sikkimdemo.in',
      address: 'Chandmari Ward, Gangtok',
      district: 'Gangtok',
      division: 'Gangtok Territorial Division',
      range: 'Gangtok Range',
      revenueBlock: 'Gangtok Block',
      gpu: 'Gangtok Municipal Corporation',
      khasraNo: '412',
      khatiyanParchaNo: 'KP-2024-GTK-0412',
      totalAreaAcres: '0.90 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation (Sukha Khet)',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-01',
      appliedByRole: 'citizen',
      appliedByUserName: 'Tenzing Norbu Sherpa',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Timber',
      fellingReason: 'Bonafide domestic timber for dwelling repair.',
      trees: [
        { id: 'T-135-1', treeNo: 1, species: 'Schima (Chilaune)', girthInches: 40, gbhFeet: '3.33 ft', plotNo: '412', estimatedVolumeCuM: 1.30, condition: 'Mature', photoId: 'P-135-1', boMatchStatus: 'Matched on Site', boVerified: true }
      ],
      assignedBoId: 'BO-GANGTOK-1',
      assignedBoName: 'BO Gangtok Demo User',
      verificationScheduledDate: '12 Nov 2026',
      verificationCompletedDate: '15 Nov 2026',
      approvalAuthority: 'RO',
      approvalStatus: 'Approved by Range Officer',
      approvedByOfficer: 'RO Gangtok Demo User',
      approvedByRole: 'ro',
      approvalDate: '17 Nov 2026',
      paymentStatus: 'Pending Fee Payment (&#8377;50)',
      paymentAmount: 50,
      paymentReceiptNo: null,
      paymentDate: null,
      isTransitPermitRequired: false,
      transitPermitStatus: 'Not Required',
      transitPermitNo: null,
      markingOrderNo: null,
      markingOrderIssueDate: null,
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '08 Nov 2026', actor: 'Tenzing Norbu (Citizen)', remarks: 'Application submitted online.' },
        { stage: 'BO Verified', date: '15 Nov 2026', actor: 'BO Gangtok Demo User', remarks: 'Field verification completed and matched on site.' },
        { stage: 'Application Approved (RO)', date: '17 Nov 2026', actor: 'RO Gangtok Demo User', remarks: 'Approved within RO authority. Statutory application fee payment of &#8377;50 pending by applicant.' }
      ]
    },
    {
      appNo: 'SK-MO-2026-00136',
      ackNo: 'ACK-FED-2026-00336',
      submittedDate: '06 Nov 2026',
      lastUpdatedDate: '17 Nov 2026',
      currentStatus: 'Payment Completed � Transit Permit Pending',
      statusClass: 'status-paid',
      applicantName: 'Karma Wangdi Bhutia',
      relationType: 'Son of',
      relationName: 'T. W. Bhutia',
      applicantCategory: 'Individual Citizen',
      phone: '9832133440',
      email: 'karma.wangdi@sikkimdemo.in',
      address: 'Singhik Ward, Mangan District',
      district: 'Mangan',
      division: 'Mangan Territorial Division',
      range: 'Mangan Range',
      revenueBlock: 'Singhik Block',
      gpu: 'Singhik GPU',
      khasraNo: '77',
      khatiyanParchaNo: 'KP-2024-MGN-0077',
      totalAreaAcres: '2.80 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation (Sukha Khet)',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-02',
      appliedByRole: 'citizen',
      appliedByUserName: 'Karma Wangdi Bhutia',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Timber',
      fellingReason: 'Bonafide construction timber with transit to sawmill in Mangan.',
      trees: [
        { id: 'T-136-1', treeNo: 1, species: 'Schima (Chilaune)', girthInches: 42, gbhFeet: '3.50 ft', plotNo: '77', estimatedVolumeCuM: 1.45, condition: 'Mature', photoId: 'P-136-1', boMatchStatus: 'Matched on Site', boVerified: true }
      ],
      assignedBoId: 'BO-MANGAN-1',
      assignedBoName: 'BO Mangan Demo User',
      verificationScheduledDate: '10 Nov 2026',
      verificationCompletedDate: '13 Nov 2026',
      approvalAuthority: 'RO',
      approvalStatus: 'Approved by Range Officer',
      approvedByOfficer: 'RO Mangan Demo User',
      approvedByRole: 'ro',
      approvalDate: '15 Nov 2026',
      paymentStatus: 'Fee Paid (&#8377;50)',
      paymentAmount: 50,
      paymentReceiptNo: 'REC-FED-2026-MGN-00336',
      paymentDate: '17 Nov 2026',
      isTransitPermitRequired: true,
      transitPermitStatus: 'Transit Permit Approval Pending',
      transitPermitNo: null,
      markingOrderNo: 'MO/FED/MGN/2026/0014',
      markingOrderIssueDate: '17 Nov 2026',
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '06 Nov 2026', actor: 'Karma Wangdi (Citizen)', remarks: 'Application submitted for 1 Timber tree.' },
        { stage: 'BO Verified', date: '13 Nov 2026', actor: 'BO Mangan Demo User', remarks: 'Field verification completed.' },
        { stage: 'Approved (RO)', date: '15 Nov 2026', actor: 'RO Mangan Demo User', remarks: 'Approved by Range Officer.' },
        { stage: 'Payment Completed', date: '17 Nov 2026', actor: 'Karma Wangdi (Citizen)', remarks: 'Statutory fee of &#8377;50 paid. Transit Permit requested for transport to Mangan sawmill.' }
      ]
    },
    {
      appNo: 'SK-MO-2026-00137',
      ackNo: 'ACK-FED-2026-00337',
      submittedDate: '07 Nov 2026',
      lastUpdatedDate: '17 Nov 2026',
      currentStatus: 'Payment Completed � Transit Permit Pending',
      statusClass: 'status-paid',
      applicantName: 'Passang Doma Lepcha',
      relationType: 'Daughter of',
      relationName: 'K. T. Lepcha',
      applicantCategory: 'Individual Citizen',
      phone: '9832144551',
      email: 'passang.doma@sikkimdemo.in',
      address: 'Rhenock Ward, Pakyong District',
      district: 'Pakyong',
      division: 'Pakyong Territorial Division',
      range: 'Pakyong Range',
      revenueBlock: 'Rhenock Block',
      gpu: 'Rhenock GPU',
      khasraNo: '189',
      khatiyanParchaNo: 'KP-2024-PKY-0189',
      totalAreaAcres: '1.90 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation (Sukha Khet)',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-01',
      appliedByRole: 'citizen',
      appliedByUserName: 'Passang Doma Lepcha',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Firewood',
      fellingReason: 'Firewood material requiring transit to neighboring village hearth depot.',
      trees: [
        { id: 'T-137-1', treeNo: 1, species: 'Alnus (Utis)', girthInches: 34, gbhFeet: '2.83 ft', plotNo: '189', estimatedVolumeCuM: 0.95, condition: 'Mature', photoId: 'P-137-1', boMatchStatus: 'Matched on Site', boVerified: true }
      ],
      assignedBoId: 'BO-PAKYONG-1',
      assignedBoName: 'BO Pakyong Demo User',
      verificationScheduledDate: '11 Nov 2026',
      verificationCompletedDate: '14 Nov 2026',
      approvalAuthority: 'RO',
      approvalStatus: 'Approved by Range Officer',
      approvedByOfficer: 'RO Pakyong Demo User',
      approvedByRole: 'ro',
      approvalDate: '16 Nov 2026',
      paymentStatus: 'Fee Paid (&#8377;50)',
      paymentAmount: 50,
      paymentReceiptNo: 'REC-FED-2026-PKY-00337',
      paymentDate: '17 Nov 2026',
      isTransitPermitRequired: true,
      transitPermitStatus: 'Transit Permit Approval Pending',
      transitPermitNo: null,
      markingOrderNo: 'MO/FED/PKY/2026/0021',
      markingOrderIssueDate: '17 Nov 2026',
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '07 Nov 2026', actor: 'Passang Doma (Citizen)', remarks: 'Application submitted for 1 Firewood tree.' },
        { stage: 'BO Verified', date: '14 Nov 2026', actor: 'BO Pakyong Demo User', remarks: 'Field verification completed.' },
        { stage: 'Approved (RO)', date: '16 Nov 2026', actor: 'RO Pakyong Demo User', remarks: 'Approved by Range Officer.' },
        { stage: 'Payment Completed', date: '17 Nov 2026', actor: 'Passang Doma (Citizen)', remarks: 'Statutory fee of &#8377;50 paid. Transit Permit requested.' }
      ]
    },
    {
      appNo: 'SK-MO-2026-00138',
      ackNo: 'ACK-FED-2026-00338',
      submittedDate: '01 Nov 2026',
      lastUpdatedDate: '12 Nov 2026',
      currentStatus: 'Marking Order Issued',
      statusClass: 'status-issued',
      applicantName: 'Sonam Tobgay Bhutia',
      relationType: 'Son of',
      relationName: 'T. Tobgay',
      applicantCategory: 'Individual Citizen',
      phone: '9832155662',
      email: 'sonam.tobgay@sikkimdemo.in',
      address: 'Pelling Ward, Gyalshing District',
      district: 'Gyalshing',
      division: 'Gyalshing Territorial Division',
      range: 'Gyalshing Range',
      revenueBlock: 'Pelling Block',
      gpu: 'Pelling GPU',
      khasraNo: '305',
      khatiyanParchaNo: 'KP-2024-GYL-0305',
      totalAreaAcres: '2.40 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation (Sukha Khet)',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-01',
      appliedByRole: 'citizen',
      appliedByUserName: 'Sonam Tobgay Bhutia',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Timber',
      fellingReason: 'Bonafide rural construction timber for residential premises.',
      trees: [
        { id: 'T-138-1', treeNo: 1, species: 'Cryptomeria (Dhupi)', girthInches: 44, gbhFeet: '3.67 ft', plotNo: '305', estimatedVolumeCuM: 1.55, condition: 'Mature', photoId: 'P-138-1', boMatchStatus: 'Matched on Site', boVerified: true }
      ],
      assignedBoId: 'BO-GYALSHING-1',
      assignedBoName: 'BO Gyalshing Demo User',
      verificationScheduledDate: '04 Nov 2026',
      verificationCompletedDate: '07 Nov 2026',
      approvalAuthority: 'RO',
      approvalStatus: 'Approved by Range Officer',
      approvedByOfficer: 'RO Gyalshing Demo User',
      approvedByRole: 'ro',
      approvalDate: '09 Nov 2026',
      paymentStatus: 'Fee Paid (&#8377;50)',
      paymentAmount: 50,
      paymentReceiptNo: 'REC-FED-2026-GYL-00338',
      paymentDate: '11 Nov 2026',
      isTransitPermitRequired: false,
      transitPermitStatus: 'Not Required',
      transitPermitNo: null,
      markingOrderNo: 'MO/FED/GYL/2026/0012',
      markingOrderIssueDate: '12 Nov 2026',
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '01 Nov 2026', actor: 'Sonam Tobgay (Citizen)', remarks: 'Application submitted for 1 Timber tree.' },
        { stage: 'BO Verified', date: '07 Nov 2026', actor: 'BO Gyalshing Demo User', remarks: 'Field verification completed.' },
        { stage: 'Approved (RO)', date: '09 Nov 2026', actor: 'RO Gyalshing Demo User', remarks: 'Approved by Range Officer.' },
        { stage: 'Payment Completed', date: '11 Nov 2026', actor: 'Sonam Tobgay (Citizen)', remarks: 'Statutory fee paid.' },
        { stage: 'Marking Order Issued', date: '12 Nov 2026', actor: 'RO Gyalshing Demo User', remarks: 'Marking Order MO/FED/GYL/2026/0012 issued.' }
      ]
    },
    {
      appNo: 'SK-MO-2026-00139',
      ackNo: 'ACK-FED-2026-00339',
      submittedDate: '28 Oct 2026',
      lastUpdatedDate: '10 Nov 2026',
      currentStatus: 'Transit Permit Issued',
      statusClass: 'status-issued',
      applicantName: 'Kinzang Dorjee Lepcha',
      relationType: 'Son of',
      relationName: 'N. D. Lepcha',
      applicantCategory: 'Individual Citizen',
      phone: '9832166773',
      email: 'kinzang.dorjee@sikkimdemo.in',
      address: 'Ranka Lower Ward, Ranipool',
      district: 'Gangtok',
      division: 'Gangtok Territorial Division',
      range: 'Ranipool Range',
      revenueBlock: 'Ranipool Block',
      gpu: 'Ranka GPU',
      khasraNo: '165',
      khatiyanParchaNo: 'KP-2024-RNK-0165',
      totalAreaAcres: '2.10 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation (Sukha Khet)',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-01',
      appliedByRole: 'citizen',
      appliedByUserName: 'Kinzang Dorjee Lepcha',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Timber',
      fellingReason: 'Bonafide house construction with transit to Singtam wood depot.',
      trees: [
        { id: 'T-139-1', treeNo: 1, species: 'Schima (Chilaune)', girthInches: 42, gbhFeet: '3.50 ft', plotNo: '165', estimatedVolumeCuM: 1.45, condition: 'Mature', photoId: 'P-139-1', boMatchStatus: 'Matched on Site', boVerified: true }
      ],
      assignedBoId: 'BO-RANIPOOL-1',
      assignedBoName: 'BO Demo User 1 (Ranipool Block)',
      verificationScheduledDate: '01 Nov 2026',
      verificationCompletedDate: '04 Nov 2026',
      approvalAuthority: 'RO',
      approvalStatus: 'Approved by Range Officer',
      approvedByOfficer: 'RO Demo User (Ranipool)',
      approvedByRole: 'ro',
      approvalDate: '06 Nov 2026',
      paymentStatus: 'Fee Paid (&#8377;50)',
      paymentAmount: 50,
      paymentReceiptNo: 'REC-FED-2026-RNK-00339',
      paymentDate: '07 Nov 2026',
      isTransitPermitRequired: true,
      transitPermitStatus: 'Approved/Issued',
      transitPermitNo: 'TP/FED/GTK/2026/0022',
      markingOrderNo: 'MO/FED/GTK/2026/0045',
      markingOrderIssueDate: '08 Nov 2026',
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '28 Oct 2026', actor: 'Kinzang Dorjee (Citizen)', remarks: 'Application submitted for 1 Timber tree.' },
        { stage: 'BO Verified', date: '04 Nov 2026', actor: 'BO Demo User 1', remarks: 'Field verification completed.' },
        { stage: 'Approved (RO)', date: '06 Nov 2026', actor: 'RO Demo User', remarks: 'Approved by Range Officer.' },
        { stage: 'Payment Completed', date: '07 Nov 2026', actor: 'Kinzang Dorjee (Citizen)', remarks: 'Statutory fee paid. Transit Permit requested.' },
        { stage: 'Marking Order Issued', date: '08 Nov 2026', actor: 'RO Demo User', remarks: 'Marking Order MO/FED/GTK/2026/0045 issued.' },
        { stage: 'Transit Permit Issued', date: '10 Nov 2026', actor: 'ACF Gangtok Demo User', remarks: 'Transit Permit TP/FED/GTK/2026/0022 approved and issued.' }
      ]
    },
    {
      appNo: 'SK-MO-2026-00140',
      ackNo: 'ACK-FED-2026-00340',
      submittedDate: '25 Oct 2026',
      lastUpdatedDate: '08 Nov 2026',
      currentStatus: 'Transit Permit Issued',
      statusClass: 'status-issued',
      applicantName: 'Pem Dorjee Lepcha',
      relationType: 'Son of',
      relationName: 'S. Lepcha',
      applicantCategory: 'Individual Citizen',
      phone: '9832177884',
      email: 'pem.dorjee@sikkimdemo.in',
      address: 'Soreng Bazar, Soreng District',
      district: 'Soreng',
      division: 'Soreng Territorial Division',
      range: 'Soreng Range',
      revenueBlock: 'Soreng Block',
      gpu: 'Soreng GPU',
      khasraNo: '114',
      khatiyanParchaNo: 'KP-2024-SRG-0114',
      totalAreaAcres: '1.75 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation (Sukha Khet)',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-01',
      appliedByRole: 'citizen',
      appliedByUserName: 'Pem Dorjee Lepcha',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Timber',
      fellingReason: 'Bonafide rural construction with transit to Sombaria.',
      trees: [
        { id: 'T-140-1', treeNo: 1, species: 'Schima (Chilaune)', girthInches: 40, gbhFeet: '3.33 ft', plotNo: '114', estimatedVolumeCuM: 1.30, condition: 'Mature', photoId: 'P-140-1', boMatchStatus: 'Matched on Site', boVerified: true }
      ],
      assignedBoId: 'BO-SORENG-1',
      assignedBoName: 'BO Soreng Demo User',
      verificationScheduledDate: '28 Oct 2026',
      verificationCompletedDate: '31 Oct 2026',
      approvalAuthority: 'RO',
      approvalStatus: 'Approved by Range Officer',
      approvedByOfficer: 'RO Soreng Demo User',
      approvedByRole: 'ro',
      approvalDate: '03 Nov 2026',
      paymentStatus: 'Fee Paid (&#8377;50)',
      paymentAmount: 50,
      paymentReceiptNo: 'REC-FED-2026-SRG-00340',
      paymentDate: '05 Nov 2026',
      isTransitPermitRequired: true,
      transitPermitStatus: 'Approved/Issued',
      transitPermitNo: 'TP/FED/SRG/2026/0005',
      markingOrderNo: 'MO/FED/SRG/2026/0008',
      markingOrderIssueDate: '06 Nov 2026',
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '25 Oct 2026', actor: 'Pem Dorjee (Citizen)', remarks: 'Application submitted for 1 Timber tree.' },
        { stage: 'BO Verified', date: '31 Oct 2026', actor: 'BO Soreng Demo User', remarks: 'Field verification completed.' },
        { stage: 'Approved (RO)', date: '03 Nov 2026', actor: 'RO Soreng Demo User', remarks: 'Approved by Range Officer.' },
        { stage: 'Payment Completed', date: '05 Nov 2026', actor: 'Pem Dorjee (Citizen)', remarks: 'Statutory fee paid.' },
        { stage: 'Marking Order Issued', date: '06 Nov 2026', actor: 'RO Soreng Demo User', remarks: 'Marking Order MO/FED/SRG/2026/0008 issued.' },
        { stage: 'Transit Permit Issued', date: '08 Nov 2026', actor: 'ACF Soreng Demo User', remarks: 'Transit Permit TP/FED/SRG/2026/0005 issued.' }
      ]
    },
    {
      appNo: 'SK-MO-2026-00141',
      ackNo: 'ACK-FED-2026-00341',
      submittedDate: '26 Oct 2026',
      lastUpdatedDate: '07 Nov 2026',
      currentStatus: 'Transit Permit Issued',
      statusClass: 'status-issued',
      applicantName: 'Mingma Sherpa',
      relationType: 'Son of',
      relationName: 'P. Sherpa',
      applicantCategory: 'Individual Citizen',
      phone: '9832188995',
      email: 'mingma.sherpa@sikkimdemo.in',
      address: 'Namchi Municipal Area, Namchi',
      district: 'Namchi',
      division: 'Namchi Territorial Division',
      range: 'Namchi Range',
      revenueBlock: 'Namchi Block',
      gpu: 'Namchi Municipal Council',
      khasraNo: '82',
      khatiyanParchaNo: 'KP-2024-NMC-0082',
      totalAreaAcres: '1.30 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation (Sukha Khet)',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-01',
      appliedByRole: 'citizen',
      appliedByUserName: 'Mingma Sherpa',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Timber',
      fellingReason: 'Bonafide house renovation with timber transit to Jorethang workshop.',
      trees: [
        { id: 'T-141-1', treeNo: 1, species: 'Schima (Chilaune)', girthInches: 38, gbhFeet: '3.17 ft', plotNo: '82', estimatedVolumeCuM: 1.25, condition: 'Mature', photoId: 'P-141-1', boMatchStatus: 'Matched on Site', boVerified: true }
      ],
      assignedBoId: 'BO-NAMCHI-1',
      assignedBoName: 'BO Namchi Demo User',
      verificationScheduledDate: '29 Oct 2026',
      verificationCompletedDate: '02 Nov 2026',
      approvalAuthority: 'RO',
      approvalStatus: 'Approved by Range Officer',
      approvedByOfficer: 'RO Namchi Demo User',
      approvedByRole: 'ro',
      approvalDate: '04 Nov 2026',
      paymentStatus: 'Fee Paid (&#8377;50)',
      paymentAmount: 50,
      paymentReceiptNo: 'REC-FED-2026-NMC-00341',
      paymentDate: '05 Nov 2026',
      isTransitPermitRequired: true,
      transitPermitStatus: 'Approved/Issued',
      transitPermitNo: 'TP/FED/NMC/2026/0011',
      markingOrderNo: 'MO/FED/NMC/2026/0016',
      markingOrderIssueDate: '06 Nov 2026',
      validityPeriodMonths: 3,
      history: [
        { stage: 'Application Submitted', date: '26 Oct 2026', actor: 'Mingma Sherpa (Citizen)', remarks: 'Application submitted for 1 Timber tree.' },
        { stage: 'BO Verified', date: '02 Nov 2026', actor: 'BO Namchi Demo User', remarks: 'Field verification completed.' },
        { stage: 'Approved (RO)', date: '04 Nov 2026', actor: 'RO Namchi Demo User', remarks: 'Approved by Range Officer.' },
        { stage: 'Payment Completed', date: '05 Nov 2026', actor: 'Mingma Sherpa (Citizen)', remarks: 'Statutory fee paid.' },
        { stage: 'Marking Order Issued', date: '06 Nov 2026', actor: 'RO Namchi Demo User', remarks: 'Marking Order MO/FED/NMC/2026/0016 issued.' },
        { stage: 'Transit Permit Issued', date: '07 Nov 2026', actor: 'ACF Namchi Demo User', remarks: 'Transit Permit TP/FED/NMC/2026/0011 issued.' }
      ]
    },
    {
      appNo: 'SK-MO-2026-00142',
      ackNo: 'ACK-FED-2026-00342',
      submittedDate: '18 Oct 2026',
      lastUpdatedDate: '02 Nov 2026',
      currentStatus: 'Rejected',
      statusClass: 'status-rejected',
      applicantName: 'Dawa Tshering Lepcha',
      relationType: 'Son of',
      relationName: 'G. T. Lepcha',
      applicantCategory: 'Individual Citizen',
      phone: '9832199006',
      email: 'dawa.tshering@sikkimdemo.in',
      address: 'Phodong Ward, Mangan District',
      district: 'Mangan',
      division: 'Mangan Territorial Division',
      range: 'Mangan Range',
      revenueBlock: 'Phodong Block',
      gpu: 'Phodong GPU',
      khasraNo: '54',
      khatiyanParchaNo: 'KP-2024-MGN-0054',
      totalAreaAcres: '3.10 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation (Sukha Khet)',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-02',
      appliedByRole: 'citizen',
      appliedByUserName: 'Dawa Tshering Lepcha',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Firewood',
      fellingReason: 'Commercial timber felling under guise of domestic firewood.',
      trees: [
        { id: 'T-142-1', treeNo: 1, species: 'Alnus (Utis)', girthInches: 48, gbhFeet: '4.00 ft', plotNo: '54', estimatedVolumeCuM: 1.80, condition: 'Green / Vigorous', photoId: 'P-142-1' }
      ],
      assignedBoId: 'BO-MANGAN-1',
      assignedBoName: 'BO Mangan Demo User',
      verificationScheduledDate: '22 Oct 2026',
      verificationCompletedDate: '26 Oct 2026',
      approvalAuthority: 'RO',
      approvalStatus: 'Rejected by Range Officer',
      approvedByOfficer: null,
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Not Applicable',
      paymentAmount: 50,
      paymentReceiptNo: null,
      paymentDate: null,
      isTransitPermitRequired: false,
      transitPermitStatus: 'Not Required',
      transitPermitNo: null,
      markingOrderNo: null,
      markingOrderIssueDate: null,
      validityPeriodMonths: 0,
      history: [
        { stage: 'Application Submitted', date: '18 Oct 2026', actor: 'Dawa Tshering (Citizen)', remarks: 'Application submitted.' },
        { stage: 'BO Verified', date: '26 Oct 2026', actor: 'BO Mangan Demo User', remarks: 'Field verification notes tree is on disputed boundary adjacent to monastery forest reserve.' },
        { stage: 'Rejected', date: '02 Nov 2026', actor: 'RO Mangan Demo User', remarks: 'Application rejected under Sikkim Forest Tree Felling Rules: Plot directly abuts notified monastery reserve forest boundary.' }
      ]
    },
    {
      appNo: 'SK-MO-2026-00143',
      ackNo: 'ACK-FED-2026-00343',
      submittedDate: '15 Oct 2026',
      lastUpdatedDate: '28 Oct 2026',
      currentStatus: 'Cancelled',
      statusClass: 'status-cancelled',
      applicantName: 'Dhan Maya Rai',
      relationType: 'Wife of',
      relationName: 'K. B. Rai',
      applicantCategory: 'Individual Citizen',
      phone: '9832200117',
      email: 'dhanmaya.rai@sikkimdemo.in',
      address: 'Ravangla Bazar, Namchi District',
      district: 'Namchi',
      division: 'Namchi Territorial Division',
      range: 'Ravangla Range',
      revenueBlock: 'Ravangla Block',
      gpu: 'Ravangla GPU',
      khasraNo: '99',
      khatiyanParchaNo: 'KP-2024-NMC-0099',
      totalAreaAcres: '1.50 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation (Sukha Khet)',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-01',
      appliedByRole: 'citizen',
      appliedByUserName: 'Dhan Maya Rai',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Firewood',
      fellingReason: 'Applicant decided not to fell the shade trees after family consultation.',
      trees: [
        { id: 'T-143-1', treeNo: 1, species: 'Alnus (Utis)', girthInches: 28, gbhFeet: '2.33 ft', plotNo: '99', estimatedVolumeCuM: 0.70, condition: 'Mature', photoId: 'P-143-1' }
      ],
      assignedBoId: 'BO-NAMCHI-1',
      assignedBoName: 'BO Namchi Demo User',
      verificationScheduledDate: '19 Oct 2026',
      verificationCompletedDate: null,
      approvalAuthority: 'RO',
      approvalStatus: 'Application Cancelled by Applicant',
      approvedByOfficer: null,
      approvedByRole: null,
      approvalDate: null,
      paymentStatus: 'Not Applicable',
      paymentAmount: 50,
      paymentReceiptNo: null,
      paymentDate: null,
      isTransitPermitRequired: false,
      transitPermitStatus: 'Not Required',
      transitPermitNo: null,
      markingOrderNo: null,
      markingOrderIssueDate: null,
      validityPeriodMonths: 0,
      history: [
        { stage: 'Application Submitted', date: '15 Oct 2026', actor: 'Dhan Maya Rai (Citizen)', remarks: 'Application submitted online.' },
        { stage: 'Cancelled', date: '28 Oct 2026', actor: 'Dhan Maya Rai (Citizen)', remarks: 'Application voluntarily cancelled by applicant prior to field inspection.' }
      ]
    },
    {
      appNo: 'SK-MO-2026-00144',
      ackNo: 'ACK-FED-2026-00344',
      submittedDate: '10 Oct 2026',
      lastUpdatedDate: '01 Nov 2026',
      currentStatus: 'Cancelled',
      statusClass: 'status-cancelled',
      applicantName: 'Jigme Namgyal Bhutia',
      relationType: 'Son of',
      relationName: 'P. N. Bhutia',
      applicantCategory: 'Individual Citizen',
      phone: '9832211228',
      email: 'jigme.namgyal@sikkimdemo.in',
      address: 'Gyalshing Bazar, Gyalshing District',
      district: 'Gyalshing',
      division: 'Gyalshing Territorial Division',
      range: 'Gyalshing Range',
      revenueBlock: 'Gyalshing Block',
      gpu: 'Gyalshing Nagar Panchayat',
      khasraNo: '160',
      khatiyanParchaNo: 'KP-2024-GYL-0160',
      totalAreaAcres: '2.20 Acres',
      holdingType: 'Private Holding',
      landClassification: 'Dry Cultivation (Sukha Khet)',
      encumbranceStatus: 'Nil / Clean Title',
      appliedFor: 'Self',
      beneficiaryName: null,
      beneficiaryPhone: null,
      beneficiaryAddress: null,
      beneficiaryRelation: null,
      appliedByUserId: 'CIT-DEMO-01',
      appliedByRole: 'citizen',
      appliedByUserName: 'Jigme Namgyal Bhutia',
      submissionMode: 'Online Citizen Portal',
      purpose: 'Timber',
      fellingReason: 'Marking Order revoked by Divisional Forest Officer due to subsequent boundary survey realignment.',
      trees: [
        { id: 'T-144-1', treeNo: 1, species: 'Cryptomeria (Dhupi)', girthInches: 42, gbhFeet: '3.50 ft', plotNo: '160', estimatedVolumeCuM: 1.45, condition: 'Mature', photoId: 'P-144-1', boMatchStatus: 'Discrepancy Noted', boVerified: true }
      ],
      assignedBoId: 'BO-GYALSHING-1',
      assignedBoName: 'BO Gyalshing Demo User',
      verificationScheduledDate: '14 Oct 2026',
      verificationCompletedDate: '18 Oct 2026',
      approvalAuthority: 'DFO',
      approvalStatus: 'Marking Order Cancelled by DFO',
      approvedByOfficer: 'DFO Gyalshing Demo User',
      approvedByRole: 'dfo',
      approvalDate: '22 Oct 2026',
      paymentStatus: 'Fee Paid (&#8377;50)',
      paymentAmount: 50,
      paymentReceiptNo: 'REC-FED-2026-GYL-00344',
      paymentDate: '24 Oct 2026',
      isTransitPermitRequired: false,
      transitPermitStatus: 'Not Required',
      transitPermitNo: null,
      markingOrderNo: 'MO/FED/GYL/2026/0006',
      markingOrderIssueDate: '26 Oct 2026',
      validityPeriodMonths: 0,
      history: [
        { stage: 'Application Submitted', date: '10 Oct 2026', actor: 'Jigme Namgyal (Citizen)', remarks: 'Application submitted for 1 Timber tree.' },
        { stage: 'BO Verified', date: '18 Oct 2026', actor: 'BO Gyalshing Demo User', remarks: 'Field verification completed.' },
        { stage: 'Approved (DFO)', date: '22 Oct 2026', actor: 'DFO Gyalshing Demo User', remarks: 'Approved by Divisional Forest Officer.' },
        { stage: 'Payment Completed', date: '24 Oct 2026', actor: 'Jigme Namgyal (Citizen)', remarks: 'Statutory fee paid.' },
        { stage: 'Marking Order Issued', date: '26 Oct 2026', actor: 'DFO Gyalshing Demo User', remarks: 'Marking Order MO/FED/GYL/2026/0006 issued.' },
        { stage: 'Cancelled', date: '01 Nov 2026', actor: 'DFO Gyalshing Demo User', remarks: 'Marking Order formally cancelled under Section 14: Adjacent parcel re-survey determined tree location lies within public drainage corridor.' }
      ]
    }
  ];
  // =========================================================================
  // 5. CITIZEN SCENARIOS CONFIGURATION (Section 13.1 & 13.2)
  // =========================================================================
  const citizenScenarios = [
    {
      id: 'scenario1',
      label: '1. First-Time Citizen � No Applications',
      citizenName: 'First-Time Citizen Demo User',
      citizenId: 'CIT-DEMO-02',
      district: 'Mangan',
      description: 'First-time citizen with no submitted Marking Order applications (Empty state demonstration).',
      primaryAppNo: null,
      visibleAppNos: []
    },
    {
      id: 'scenario2',
      label: '2. Citizen with Submitted Application',
      citizenName: 'Citizen Demo User (Primary)',
      citizenId: 'CIT-DEMO-01',
      district: 'Gangtok',
      description: 'Citizen has submitted an application (SK-MO-2026-00101) currently awaiting preliminary RO verification.',
      primaryAppNo: 'SK-MO-2026-00101',
      visibleAppNos: ['SK-MO-2026-00101']
    },
    {
      id: 'scenario3',
      label: '3. Citizen with Verification Scheduled Application',
      citizenName: 'Citizen Demo User (Primary)',
      citizenId: 'CIT-DEMO-01',
      district: 'Gangtok',
      description: 'Range Officer has scheduled field verification and assigned Block Officer (SK-MO-2026-00102).',
      primaryAppNo: 'SK-MO-2026-00102',
      visibleAppNos: ['SK-MO-2026-00102']
    },
    {
      id: 'scenario4',
      label: '4. Citizen with BO Verification Completed',
      citizenName: 'Citizen Demo User (Primary)',
      citizenId: 'CIT-DEMO-01',
      district: 'Gangtok',
      description: 'Block Officer has completed site inspection and submitted the verification report (SK-MO-2026-00103).',
      primaryAppNo: 'SK-MO-2026-00103',
      visibleAppNos: ['SK-MO-2026-00103']
    },
    {
      id: 'scenario5',
      label: '5. Citizen with Application under RO Review (Apply for Others Demo)',
      citizenName: 'Citizen Demo User (Primary)',
      citizenId: 'CIT-DEMO-01',
      district: 'Gangtok',
      description: 'Application under RO Review (SK-MO-2026-00104) submitted under "Apply for Others" on behalf of Beneficiary Applicant Demo.',
      primaryAppNo: 'SK-MO-2026-00104',
      visibleAppNos: ['SK-MO-2026-00104']
    },
    {
      id: 'scenario6',
      label: '6. Citizen with Application Forwarded to ACF',
      citizenName: 'Citizen Demo User (Primary)',
      citizenId: 'CIT-DEMO-01',
      district: 'Gangtok',
      description: 'Application for 8 Firewood trees (SK-MO-2026-00105) forwarded by RO to ACF because it exceeds RO statutory limit (Firewood \u2264 5).',
      primaryAppNo: 'SK-MO-2026-00105',
      visibleAppNos: ['SK-MO-2026-00105']
    },
    {
      id: 'scenario7',
      label: '7. Citizen with Approved � Payment Pending Application (Action Required)',
      citizenName: 'Citizen Demo User (Primary)',
      citizenId: 'CIT-DEMO-01',
      district: 'Gangtok',
      description: 'Application approved by RO (SK-MO-2026-00106); fee payment is pending before Marking Order can be issued.',
      primaryAppNo: 'SK-MO-2026-00106',
      visibleAppNos: ['SK-MO-2026-00106']
    },
    {
      id: 'scenario8',
      label: '8. Citizen with Payment Completed � Marking Order Pending',
      citizenName: 'Citizen Demo User (Primary)',
      citizenId: 'CIT-DEMO-01',
      district: 'Gangtok',
      description: 'Application approved and fee payment completed (SK-MO-2026-00107); awaiting departmental Marking Order issuance.',
      primaryAppNo: 'SK-MO-2026-00107',
      visibleAppNos: ['SK-MO-2026-00107']
    },
    {
      id: 'scenario9',
      label: '9. Citizen with Marking Order Issued Application',
      citizenName: 'Citizen Demo User (Primary)',
      citizenId: 'CIT-DEMO-01',
      district: 'Gangtok',
      description: 'Application approved, payment confirmed, and official Marking Order (MO/FED/GTK/2026/0042) issued (SK-MO-2026-00108).',
      primaryAppNo: 'SK-MO-2026-00108',
      visibleAppNos: ['SK-MO-2026-00108']
    },
    {
      id: 'scenario10',
      label: '10. Citizen with Rejected Application',
      citizenName: 'Citizen Demo User (Primary)',
      citizenId: 'CIT-DEMO-01',
      district: 'Gangtok',
      description: 'Application rejected by RO following BO field verification boundary discrepancy report (SK-MO-2026-00109).',
      primaryAppNo: 'SK-MO-2026-00109',
      visibleAppNos: ['SK-MO-2026-00109']
    },
    {
      id: 'scenario11',
      label: '11. All Citizen Applications (Complete Portfolio & Returned Action Demo)',
      citizenName: 'Citizen Demo User (Primary)',
      citizenId: 'CIT-DEMO-01',
      district: 'Gangtok',
      description: 'Consolidated view of all citizen applications across statuses, including Returned for Correction (SK-MO-2026-00110) and Apply for Others.',
      primaryAppNo: 'SK-MO-2026-00106',
      visibleAppNos: [
        'GTK/RAN/2026-27/006',
        'GTK/RAN/2026-27/007',
        'GTK/RAN/2026-27/008',
        'GTK/RAN/2026-27/001',
        'GTK/RAN/2026-27/002',
        'GTK/RAN/2026-27/003',
        'GTK/RAN/2026-27/004',
        'GTK/RAN/2026-27/005',
        'SK-MO-2026-00101',
        'SK-MO-2026-00102',
        'SK-MO-2026-00103',
        'SK-MO-2026-00104',
        'SK-MO-2026-00105',
        'SK-MO-2026-00106',
        'SK-MO-2026-00107',
        'SK-MO-2026-00108',
        'SK-MO-2026-00109',
        'SK-MO-2026-00110'
      ]
    }
  ];

  // =========================================================================
  // 6. NOTIFICATIONS DATASET (Section 15 - Role-Specific & Citizen)
  // =========================================================================
  const notifications = {
    citizen: [
      { id: 'N-CIT-1', title: 'Marking Order Issued', description: 'Marking Order MO/FED/GTK/2026/0042 has been officially issued following payment confirmation.', appNo: 'SK-MO-2026-00108', date: '05 Nov 2026', unread: true, badgeClass: 'bg-success' },
      { id: 'N-CIT-2', title: 'Application Fee Payment Pending', description: 'Your Marking Order application has been approved by RO (Ranipool Range). Please complete fee payment to enable order issuance.', appNo: 'SK-MO-2026-00106', date: '16 Nov 2026', unread: true, badgeClass: 'bg-warning text-dark' },
      { id: 'N-CIT-3', title: 'Payment Confirmation Received', description: 'Application fee payment has been confirmed. Your application is queued for Marking Order issuance.', appNo: 'SK-MO-2026-00107', date: '17 Nov 2026', unread: false, badgeClass: 'bg-info' },
      { id: 'N-CIT-4', title: 'Application Forwarded to ACF', description: 'Range Officer has forwarded your application (8 Firewood trees) to ACF (Gangtok Division) as per statutory authority limits.', appNo: 'SK-MO-2026-00105', date: '15 Nov 2026', unread: false, badgeClass: 'bg-primary' },
      { id: 'N-CIT-5', title: 'BO Verification Report Submitted', description: 'Block Officer has completed site inspection and submitted the verification report to the Range Officer.', appNo: 'SK-MO-2026-00103', date: '16 Nov 2026', unread: false, badgeClass: 'bg-primary' },
      { id: 'N-CIT-6', title: 'Verification Scheduled', description: 'Field verification has been scheduled for 19 Nov 2026 and assigned to BO Demo User 1 (Ranipool Block).', appNo: 'SK-MO-2026-00102', date: '15 Nov 2026', unread: false, badgeClass: 'bg-info' },
      { id: 'N-CIT-7', title: 'Application Submitted', description: 'Your Marking Order application for 3 Firewood trees has been submitted and routed to Ranipool Range.', appNo: 'SK-MO-2026-00101', date: '16 Nov 2026', unread: false, badgeClass: 'bg-secondary' },
      { id: 'N-CIT-8', title: 'Application Rejected', description: 'Your application was rejected by Range Officer following field verification boundary findings.', appNo: 'SK-MO-2026-00109', date: '29 Oct 2026', unread: false, badgeClass: 'bg-danger' }
    ],
    ro: [
      { id: 'N-RO-1', title: 'New Application Received in Range Queue', description: 'New Marking Order request for 3 Firewood trees routed to Ranipool Range.', appNo: 'SK-MO-2026-00101', date: '16 Nov 2026', unread: true },
      { id: 'N-RO-2', title: 'BO Verification Report Submitted (With Remarks)', description: 'BO Demo User 1 submitted verification report with discrepancy remarks on Tree #7.', appNo: 'SK-MO-2026-00114', date: '16 Nov 2026', unread: true },
      { id: 'N-RO-3', title: 'BO Verification Report Submitted', description: 'BO Demo User 1 completed site inspection for 4 Firewood trees.', appNo: 'SK-MO-2026-00103', date: '16 Nov 2026', unread: false },
      { id: 'N-RO-4', title: 'Applicant Fee Payment Confirmed', description: 'Fee payment confirmed for approved Timber application; ready for Marking Order issuance.', appNo: 'SK-MO-2026-00107', date: '17 Nov 2026', unread: false }
    ],
    bo: [
      { id: 'N-BO-1', title: 'Field Verification Due Today', description: 'Scheduled site inspection for 2 Timber trees in Ranka GPU is due today (19 Nov 2026).', appNo: 'SK-MO-2026-00102', date: '19 Nov 2026', unread: true },
      { id: 'N-BO-2', title: 'New Verification Assigned by RO', description: 'RO (Ranipool Range) assigned field verification for 5 Firewood trees scheduled on 22 Nov 2026.', appNo: 'SK-MO-2026-00112', date: '17 Nov 2026', unread: true },
      { id: 'N-BO-3', title: 'Past Scheduled Verification Pending Report', description: 'Verification scheduled on 08 Nov 2026 requires verification report submission.', appNo: 'SK-MO-2026-00113', date: '18 Nov 2026', unread: false }
    ],
    acf: [
      { id: 'N-ACF-1', title: 'Application Forwarded by RO (Ranipool)', description: '8 Firewood trees application forwarded to ACF Desk (Within ACF authority \u2264 10).', appNo: 'SK-MO-2026-00105', date: '15 Nov 2026', unread: true },
      { id: 'N-ACF-2', title: 'Application Exceeding ACF Limit Received', description: '7 Timber trees application received from Gangtok Range; requires forwarding to DFO (Timber > 5).', appNo: 'SK-MO-2026-00116', date: '15 Nov 2026', unread: true },
      { id: 'N-ACF-3', title: 'Marking Order Issued � Eligible for Transit Permit', description: 'Marking Order MO/FED/GTK/2026/0039 issued in Ranipool Range.', appNo: 'SK-MO-2026-00117', date: '08 Nov 2026', unread: false }
    ],
    dfo: [
      { id: 'N-DFO-1', title: 'Delayed Application Alert (> 7 Days)', description: 'Application forwarded by ACF has been pending review for 14 days.', appNo: 'SK-MO-2026-00119', date: '19 Nov 2026', unread: true },
      { id: 'N-DFO-2', title: 'Escalated Application Forwarded by ACF', description: '6 Timber trees application forwarded by ACF Gangtok for DFO final authority review.', appNo: 'SK-MO-2026-00120', date: '11 Nov 2026', unread: true },
      { id: 'N-DFO-3', title: 'Marking Order Cancelled & Transit Permit Invalidated', description: 'Marking Order MO/FED/GTK/2026/0019 cancelled under DFO authority.', appNo: 'SK-MO-2026-00122', date: '12 Nov 2026', unread: false }
    ]
  };

  // =========================================================================
  // 7. HELPER METHODS FOR LOOKUPS, BADGES, STORAGE AND SHARED MODALS
  // =========================================================================
  function getCustomApplications() {
    try {
      const stored = localStorage.getItem('mo_custom_applications');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  function getPatchedApplicationsMap() {
    try {
      const stored = localStorage.getItem('mo_app_patches');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  }

  function normalizeAppRecord(a) {
    if (!a) return a;
    var merged = Object.assign({}, a);

    // Normalize user identity
    if (!merged.appliedByUserId) {
      merged.appliedByUserId = merged.submittedByCitizenId || 'CIT-DEMO-01';
    }
    if (!merged.appliedByRole) {
      if (merged.appliedByUserId && merged.appliedByUserId.startsWith('RO-')) merged.appliedByRole = 'ro';
      else if (merged.appliedByUserId && merged.appliedByUserId.startsWith('BO-')) merged.appliedByRole = 'bo';
      else if (merged.appliedByUserId && merged.appliedByUserId.startsWith('ACF-')) merged.appliedByRole = 'acf';
      else if (merged.appliedByUserId && merged.appliedByUserId.startsWith('DFO-')) merged.appliedByRole = 'dfo';
      else merged.appliedByRole = 'citizen';
    }
    if (!merged.appliedByUserName) {
      merged.appliedByUserName = merged.submittedByCitizenName || merged.applicantName || 'Citizen Demo User';
    }
    if (!merged.submittedByCitizenName) {
      merged.submittedByCitizenName = merged.appliedByUserName;
    }
    if (!merged.applicationFor) {
      merged.applicationFor = merged.appliedFor || 'Self';
    }
    if (!merged.relationType) {
      merged.relationType = 'Son of';
    }
    if (!merged.relationName) {
      merged.relationName = 'Mohan Kumar';
    }
    if (!merged.mobile) {
      merged.mobile = merged.phone || '9876543210';
    }
    if (!merged.phone) {
      merged.phone = merged.mobile;
    }

    // Normalize dates
    if (!merged.submittedDate && merged.submissionDate) merged.submittedDate = merged.submissionDate;
    if (!merged.submissionDate && merged.submittedDate) merged.submissionDate = merged.submittedDate;
    if (!merged.verificationDate && merged.verificationScheduledDate) merged.verificationDate = merged.verificationScheduledDate;
    if (!merged.verificationScheduledDate && merged.verificationDate) merged.verificationScheduledDate = merged.verificationDate;
    if (!merged.boReportDate && merged.verificationCompletedDate) merged.boReportDate = merged.verificationCompletedDate;
    if (!merged.verificationCompletedDate && merged.boReportDate) merged.verificationCompletedDate = merged.boReportDate;
    if (!merged.lastUpdatedDate) merged.lastUpdatedDate = merged.boReportDate || merged.verificationDate || merged.submittedDate || 'Recent';

    // Normalize addresses
    if (!merged.permanentAddress) {
      var addrParts = (merged.address || 'Ranipool, Gangtok').split(',');
      merged.permanentAddress = {
        address1: addrParts[0] ? addrParts[0].trim() : (merged.address || 'Ranipool'),
        blockGpu: merged.gpu || merged.revenueBlock || (addrParts[1] ? addrParts[1].trim() : 'Ranipool GPU'),
        district: merged.district || 'Gangtok',
        sameAsPermanent: true
      };
    }
    if (!merged.residentialAddress) {
      merged.residentialAddress = Object.assign({}, merged.permanentAddress);
    }

    // Normalize trees
    if (!Array.isArray(merged.trees)) {
      merged.trees = [];
    } else {
      merged.trees = merged.trees.map(function (t, tIdx) {
        var tree = Object.assign({}, t);
        if (!tree.treeNo) tree.treeNo = (tIdx + 1);
        if (!tree.species) tree.species = tree.verifiedSpecies || 'Timber Species';
        if (!tree.plotNo) tree.plotNo = merged.khasraNo || '101';
        if (!tree.gbhFeet) {
          tree.gbhFeet = tree.girthInches ? (tree.girthInches / 12).toFixed(2) + ' ft' : '3.00 ft';
        }
        if (!tree.boMatchStatus) {
          tree.boMatchStatus = tree.verified ? 'Verified & Matched' : 'Pending Verification';
        }
        return tree;
      });
    }

    // Normalize documents
    if (!Array.isArray(merged.documents) || merged.documents.length === 0) {
      merged.documents = [
        { name: 'Khatiyan / Land Parcha (ROR)', fileName: 'Land_Parcha_' + (merged.khasraNo || '101') + '.pdf', status: 'Verified' },
        { name: 'Identity Proof (COI / Voter ID)', fileName: 'Identity_Certificate_' + (merged.applicantName ? merged.applicantName.replace(/\s+/g, '_') : 'Applicant') + '.pdf', status: 'Verified' },
        { name: 'Boundary NOC / Site Inspection Photos', fileName: 'Site_Inspection_Report.pdf', status: 'Verified' }
      ];
    }

    // Normalize approval, payment and marking order statuses
    if (!merged.approvalStatus) {
      merged.approvalStatus = (merged.currentStatus && merged.currentStatus.includes('Approved'))
        ? merged.currentStatus
        : (merged.currentStatus === 'Forwarded to ACF' ? 'Forwarded to ACF' : (merged.currentStatus === 'Forwarded to DFO' ? 'Forwarded to DFO' : 'Pending Preliminary Review'));
    }
    if (!merged.approvalAuthority) {
      merged.approvalAuthority = (merged.trees.length > 6) ? 'DFO' : ((merged.trees.length > 3) ? 'ACF' : 'RO');
    }
    if (!merged.paymentStatus) {
      merged.paymentStatus = (merged.currentStatus && (merged.currentStatus.includes('Paid') || merged.currentStatus.includes('Marking Order Issued') || merged.currentStatus.includes('Payment Completed')))
        ?'Completed (?50 Paid via Sikkim GO)'
        : (merged.currentStatus && merged.currentStatus.includes('Payment Pending') ? 'Pending (?50 Payable)' : 'Pending Approval');
    }
    if (!merged.markingOrderStatus) {
      merged.markingOrderStatus = merged.markingOrderNo
        ? 'Marking Order Issued'
        : (merged.currentStatus && merged.currentStatus.includes('Payment Pending') ? 'Payment Pending' : 'Pending Issuance');
    }
    if (!merged.nextExpectedAction) {
      if (merged.currentStatus === 'Marking Order Issued') {
        merged.nextExpectedAction = merged.isTransitPermitRequired ? 'Transit Permit active / Material transport authorized' : 'Felling operations authorized under Rule 21';
      } else if (merged.currentStatus.includes('Payment Pending')) {
        merged.nextExpectedAction = 'Applicant must complete ?50 statutory fee payment';
      } else if (merged.currentStatus === 'Verification Scheduled') {
        merged.nextExpectedAction = 'Block Officer on-site field inspection scheduled for ' + (merged.verificationDate || 'assigned date');
      } else if (merged.currentStatus.includes('BO Verification') || merged.currentStatus.includes('BO Verified')) {
        merged.nextExpectedAction = 'Range Officer scrutiny of submitted verification report';
      } else if (merged.currentStatus === 'Forwarded to ACF') {
        merged.nextExpectedAction = 'Assistant Conservator of Forests sub-divisional review';
      } else if (merged.currentStatus === 'Forwarded to DFO') {
        merged.nextExpectedAction = 'Divisional Forest Officer final authority decision';
      } else {
        merged.nextExpectedAction = 'Departmental scrutiny in progress';
      }
    }

    // Calculate workflowStageIndex (1 to 6)
    if (!merged.workflowStageIndex) {
      if (merged.currentStatus === 'Rejected') {
        merged.workflowStageIndex = 4;
      } else if (merged.currentStatus === 'Returned for Correction') {
        merged.workflowStageIndex = 1;
      } else if (merged.transitPermitNo || (merged.transitPermitStatus && merged.transitPermitStatus.includes('Issued'))) {
        merged.workflowStageIndex = 6;
      } else if (merged.markingOrderNo || merged.currentStatus === 'Marking Order Issued' || merged.markingOrderStatus === 'Marking Order Issued') {
        merged.workflowStageIndex = 5;
      } else if (merged.currentStatus.includes('Approved') || merged.currentStatus.includes('Payment')) {
        merged.workflowStageIndex = 5;
      } else if (merged.currentStatus === 'Forwarded to ACF' || merged.currentStatus === 'Forwarded to DFO') {
        merged.workflowStageIndex = 5;
      } else if (merged.currentStatus.includes('BO Verification') || merged.currentStatus.includes('BO Verified') || merged.boReportDate) {
        merged.workflowStageIndex = 4;
      } else if (merged.currentStatus.includes('Verification Scheduled') || merged.verificationDate) {
        merged.workflowStageIndex = 2;
      } else {
        merged.workflowStageIndex = 1;
      }
    }

    // Ensure history array exists and has entries
    if (!Array.isArray(merged.history) || merged.history.length === 0) {
      merged.history = [
        { stage: 'Application Submitted', date: merged.submittedDate || '16 Nov 2026', actor: merged.applicantName + ' (Citizen)', remarks: 'Application submitted online for ' + merged.trees.length + ' ' + merged.purpose + ' trees.' }
      ];
      if (merged.verificationDate) {
        merged.history.push({ stage: 'Verification Scheduled', date: merged.verificationDate, actor: 'Range Officer (' + (merged.range || 'Ranipool') + ')', remarks: 'Field verification scheduled and assigned to ' + (merged.assignedBoName || 'Block Officer') + '.' });
      }
      if (merged.boReportDate) {
        merged.history.push({ stage: 'BO Verified', date: merged.boReportDate, actor: merged.assignedBoName || 'Block Officer', remarks: 'Site inspection completed and report submitted.' });
      }
      if (merged.approvalDate) {
        merged.history.push({ stage: 'Application Approved', date: merged.approvalDate, actor: merged.approvedByRole || 'Range Officer', remarks: 'Application approved under statutory rules.' });
      }
      if (merged.paymentDate) {
        merged.history.push({ stage: 'Fee Payment Completed', date: merged.paymentDate, actor: merged.applicantName, remarks: 'Statutory fee of ?50 paid. Receipt: ' + (merged.paymentReceiptNo || 'RCP-SK-2026-0042') + '.' });
      }
      if (merged.markingOrderNo) {
        merged.history.push({ stage: 'Marking Order Issued', date: merged.markingOrderIssueDate || merged.approvalDate || '26 Sep 2026', actor: 'Range Officer / Issuing Authority', remarks: 'Official Marking Order (FORM - D) ' + merged.markingOrderNo + ' issued.' });
      }
      if (merged.transitPermitNo) {
        merged.history.push({ stage: 'Transit Permit Issued', date: merged.transitPermitIssueDate || '29 Sep 2026', actor: merged.transitPermitOfficer || 'DFO Gangtok', remarks: 'Transit Permit ' + merged.transitPermitNo + ' issued for movement.' });
      }
    }

    return merged;
  }

  function getAllApplications() {
    const custom = getCustomApplications();
    const patches = getPatchedApplicationsMap();

    // Clone base applications and apply any runtime patches
    const base = applications.map(function (a) {
      var merged = patches[a.appNo] ? Object.assign({}, a, patches[a.appNo]) : Object.assign({}, a);
      return normalizeAppRecord(merged);
    });

    const customProcessed = custom.map(function (a) {
      return normalizeAppRecord(a);
    });

    // Custom user submitted applications come first
    return customProcessed.concat(base);
  }

  function getApplicationByNo(appNo) {
    if (!appNo) return null;
    const all = getAllApplications();
    const cleanNo = String(appNo).trim().toLowerCase();
    return all.find(function (a) {
      if (!a || !a.appNo) return false;
      return a.appNo === appNo || a.appNo.trim().toLowerCase() === cleanNo;
    }) || null;
  }

  function saveCustomApplication(newApp) {
    const list = getCustomApplications();
    // Check if updating existing
    const existingIdx = list.findIndex(function (a) { return a.appNo === newApp.appNo; });
    if (existingIdx !== -1) {
      list[existingIdx] = newApp;
    } else {
      list.unshift(newApp);
    }
    localStorage.setItem('mo_custom_applications', JSON.stringify(list));
    return newApp;
  }

  function updateApplication(appNo, patch) {
    const customList = getCustomApplications();
    const cIdx = customList.findIndex(function (a) { return a.appNo === appNo; });
    if (cIdx !== -1) {
      customList[cIdx] = Object.assign({}, customList[cIdx], patch);
      localStorage.setItem('mo_custom_applications', JSON.stringify(customList));
      return customList[cIdx];
    } else {
      const patches = getPatchedApplicationsMap();
      patches[appNo] = Object.assign({}, patches[appNo] || {}, patch);
      localStorage.setItem('mo_app_patches', JSON.stringify(patches));
      return getApplicationByNo(appNo);
    }
  }

  function getDraft() {
    try {
      const stored = localStorage.getItem('mo_application_draft');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }

  function saveDraft(draftData) {
    localStorage.setItem('mo_application_draft', JSON.stringify(draftData));
  }

  function clearDraft() {
    localStorage.removeItem('mo_application_draft');
  }

  function getStatusBadgeHtml(status) {
    const s = (status || '').toLowerCase();
    if (s.includes('marking order issue') || s.includes('transit permit issue')) {
      return '<span class="gov-status-pill gov-status-pill-approved"><i class="bi bi-check-circle-fill"></i> ' + status + '</span>';
    }
    if (s.includes('approved') && s.includes('payment pending')) {
      return '<span class="gov-status-pill gov-status-pill-review"><i class="bi bi-exclamation-circle-fill"></i> ' + status + '</span>';
    }
    if (s.includes('payment completed')) {
      return '<span class="gov-status-pill gov-status-pill-submitted"><i class="bi bi-credit-card-2-front-fill"></i> ' + status + '</span>';
    }
    if (s.includes('rejected') || s.includes('cancelled')) {
      return '<span class="gov-status-pill gov-status-pill-returned"><i class="bi bi-x-circle-fill"></i> ' + status + '</span>';
    }
    if (s.includes('returned')) {
      return '<span class="gov-status-pill gov-status-pill-returned"><i class="bi bi-exclamation-triangle-fill"></i> ' + status + '</span>';
    }
    if (s.includes('scheduled') || s.includes('bo verified') || s.includes('ro review') || s.includes('forwarded')) {
      return '<span class="gov-status-pill gov-status-pill-review"><i class="bi bi-hourglass-split"></i> ' + status + '</span>';
    }
    return '<span class="gov-status-pill gov-status-pill-submitted"><i class="bi bi-clock-fill"></i> ' + status + '</span>';
  }

  /**
   * Build the 6-Stage Approved Workflow Progress Tracker HTML for an application
   * Sequence:
   * 1. Application Submitted
   * 2. Verification Scheduled
   * 3. BO Verified
   * 4. RO Review
   * 5. Forwarded to ACF / Marking Order Issue
   * 6. Transit Permit Issue
   */
  function buildWorkflowTrackerHtml(app) {
    if (!app) return '';
    const isRejected = app.currentStatus === 'Rejected';
    const isReturned = app.currentStatus === 'Returned for Correction';

    const stages = [
      {
        index: 1,
        title: '1. Application Submitted',
        desc: 'Citizen submits online application with land and tree details (' + (app.submissionDate || app.submittedDate || 'Recent') + ').'
      },
      {
        index: 2,
        title: '2. Verification Scheduled',
        desc: (app.verificationDate || app.verificationScheduledDate)
            ? 'Scheduled for ' + (app.verificationDate || app.verificationScheduledDate) + ' � Assigned to ' + (app.assignedBoName || 'Block Officer')
            : 'Range Officer performs preliminary check and assigns Block Officer.'
      },
      {
        index: 3,
        title: '3. BO Verified',
        desc: (app.boReportDate || app.verificationCompletedDate)
          ? 'Field report submitted on ' + (app.boReportDate || app.verificationCompletedDate) + (app.boForwardedWithRemarks ? ' (Forwarded with Discrepancy Remarks)' : ' (Verified on Site)')
          : 'On-site inspection of land and tree details by Block Officer.'
      },
      {
        index: 4,
        title: '4. RO Review',
        desc: (app.currentStatus && app.currentStatus.includes('Payment Pending'))
            ? 'Application Approved on ' + (app.approvalDate || 'Approved') + ' � Application Fee Payment Pending (?50)'
            : (app.currentStatus && app.currentStatus.includes('Payment Completed'))
                ? 'Application Approved (' + (app.approvalDate || 'Recent') + ') & Payment Completed � Marking Order Pending Issuance'
                : (app.currentStatus === 'Forwarded to ACF'
                  ? 'Forwarded to ACF on ' + (app.forwardedToAcfDate || 'Recent') + ' (Exceeds RO statutory authority)'
                  : (app.currentStatus === 'Forwarded to DFO'
                    ? 'Escalated to DFO on ' + (app.forwardedToDfoDate || 'Recent') + ' (Exceeds ACF statutory authority)'
                    : 'Range Officer reviews verification report and checks statutory authority limits.'))
      },
      {
        index: 5,
        title: '5. Forwarded to ACF / Marking Order Issue',
        desc: app.markingOrderNo
            ? 'Marking Order Issued: ' + app.markingOrderNo + ' (' + (app.markingOrderIssueDate || app.approvalDate || 'Recent') + ') � Status: ' + app.markingOrderStatus
            : (app.currentStatus === 'Forwarded to ACF'
                ? 'Forwarded to ACF Desk � Awaiting Sub-Divisional Approval'
                : (app.currentStatus === 'Forwarded to DFO'
                    ? 'Forwarded to DFO Desk � Awaiting Final Division Approval'
                    : 'Forwarded to higher authority if beyond limit, or Marking Order issued after fee payment confirmation.'))
      },
      {
        index: 6,
        title: '6. Transit Permit Issue',
        desc: app.transitPermitNo
            ? 'Transit Permit: ' + app.transitPermitNo + ' (' + app.transitPermitStatus + ') � Route: ' + (app.transitPermitRoute || 'Authorized Highway Corridor')
            : (app.isTransitPermitRequired
              ? 'Transit Permit Required: Yes � ' + (app.transitPermitStatus || 'Pending Issuance with ACF/DFO')
              : 'Transit Permit Required: No � Material felling for on-site / domestic use.')
      }
    ];

    let stepsHtml = '<div class="gov-timeline mb-3">';
    stages.forEach(function (st) {
      let itemClass = '';
      let iconHtml = '<i class="bi bi-circle"></i>';
      let badgeHtml = '<span class="badge bg-light text-secondary border small">Pending</span>';

      if (isRejected) {
        if (st.index < app.workflowStageIndex) {
          itemClass = 'completed';
          iconHtml = '<i class="bi bi-check-lg"></i>';
          badgeHtml = '<span class="badge bg-success-subtle text-success border border-success-subtle small">Completed</span>';
        } else if (st.index === app.workflowStageIndex) {
          itemClass = 'active';
          iconHtml = '<i class="bi bi-x-lg"></i>';
          badgeHtml = '<span class="badge bg-danger text-white small">Rejected at this Stage (' + (app.rejectionDate || app.lastUpdatedDate) + ')</span>';
        } else {
          itemClass = '';
          badgeHtml = '<span class="badge bg-light text-muted border small">Not Applicable (Application Rejected)</span>';
        }
      } else if (isReturned) {
        if (st.index === 1) {
          itemClass = 'active';
          iconHtml = '<i class="bi bi-exclamation-lg"></i>';
          badgeHtml = '<span class="badge bg-danger text-white small">Returned for Correction (' + app.lastUpdatedDate + ')</span>';
        }
      } else {
        if (st.index < app.workflowStageIndex) {
          itemClass = 'completed';
          iconHtml = '<i class="bi bi-check-lg"></i>';
          badgeHtml = '<span class="badge bg-success-subtle text-success border border-success-subtle small">Completed</span>';
        } else if (st.index === app.workflowStageIndex) {
          if (
            (st.index === 5 && (app.markingOrderNo || app.currentStatus === 'Marking Order Issued')) ||
            (st.index === 6 && app.transitPermitNo)
          ) {
            itemClass = 'completed';
            iconHtml = '<i class="bi bi-check-lg"></i>';
            badgeHtml = '<span class="badge bg-success text-white small">Completed (' + (app.markingOrderIssueDate || app.lastUpdatedDate) + ')</span>';
          } else {
            itemClass = 'active';
            iconHtml = '<i class="bi bi-arrow-right"></i>';
            badgeHtml = '<span class="badge bg-warning text-dark small">Current Stage � ' + app.currentStatus + '</span>';
          }
        }
      }

      stepsHtml +=
        '<div class="gov-timeline-item ' + itemClass + '">' +
        '<div class="gov-timeline-point">' + iconHtml + '</div>' +
        '<div class="gov-timeline-content">' +
        '<div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-1">' +
        '<strong class="text-dark small">' + st.title + '</strong>' +
        badgeHtml +
        '</div>' +
        '<div class="small text-secondary">' + st.desc + '</div>' +
        '</div>' +
        '</div>';
    });
    stepsHtml += '</div>';

    // Distinct Approval, Fee Payment, Transit Permit, and Marking Order Issuance Status Strip
    const distinctionStrip =
      '<div class="card border bg-light p-3 rounded-3 mb-3">' +
      '<div class="small fw-bold text-dark mb-2"><i class="bi bi-shield-check text-success me-1"></i> Approval, Payment &amp; Order Status Details</div>' +
      '<div class="row g-2 small">' +
      '<div class="col-sm-6 col-md-3"><div class="p-2 bg-white border rounded-2 h-100"><span class="text-muted d-block" style="font-size:0.72rem;">1. Approval Status</span><strong class="text-dark">' + app.approvalStatus + '</strong></div></div>' +
      '<div class="col-sm-6 col-md-3"><div class="p-2 bg-white border rounded-2 h-100"><span class="text-muted d-block" style="font-size:0.72rem;">2. Fee Payment Status</span><strong class="' + (app.paymentStatus && app.paymentStatus.includes('Completed') ? 'text-success' : 'text-warning-emphasis') + '">' + app.paymentStatus + '</strong></div></div>' +
      '<div class="col-sm-6 col-md-3"><div class="p-2 bg-white border rounded-2 h-100"><span class="text-muted d-block" style="font-size:0.72rem;">3. Transit Permit</span><strong class="' + (app.isTransitPermitRequired ? (app.transitPermitNo ? 'text-success' : 'text-warning-emphasis') : 'text-muted') + '">' + (app.isTransitPermitRequired ? (app.transitPermitNo ? 'Issued (' + app.transitPermitNo + ')' : 'Required (Pending)') : 'Not Required') + '</strong></div></div>' +
      '<div class="col-sm-6 col-md-3"><div class="p-2 bg-white border rounded-2 h-100"><span class="text-muted d-block" style="font-size:0.72rem;">4. Marking Order No.</span><strong class="font-monospace text-success">' + (app.markingOrderNo || 'Not Issued Yet') + '</strong></div></div>' +
      '</div>' +
      '</div>';

    // Actual Application Processing History Log Table
    var historyRows = (app.history || []).map(function (h) {
      return '<tr>' +
        '<td class="text-nowrap small fw-semibold">' + h.date + '</td>' +
        '<td class="small"><span class="badge bg-light text-dark border">' + h.stage + '</span></td>' +
        '<td class="small">' + h.actor + '</td>' +
        '<td class="small text-secondary">' + h.remarks + '</td>' +
        '</tr>';
    }).join('');

    var historySection =
      '<div class="card border-0 shadow-xs p-3 bg-light rounded-3 mt-3">' +
      '<h6 class="fw-bold text-dark border-bottom pb-2 mb-2"><i class="bi bi-clock-history text-success me-1"></i> Actual Application Processing History Log</h6>' +
      '<div class="table-responsive bg-white rounded border">' +
      '<table class="table table-sm table-bordered align-middle mb-0">' +
      '<thead class="table-light"><tr><th>Date</th><th>Workflow Stage</th><th>Actor / Authority</th><th>Remarks</th></tr></thead>' +
      '<tbody>' + (historyRows || '<tr><td colspan="4" class="text-center text-muted">No historical processing log entries.</td></tr>') + '</tbody>' +
      '</table>' +
      '</div>' +
      '</div>';

    return distinctionStrip + stepsHtml + historySection;
  }

  /**
   * Inject and open the shared Application Details Preview Modal (Section 12.3)
   */
  function openApplicationDetailModal(appNo) {
    const app = getApplicationByNo(appNo);
    if (!app) {
      alert('Application record not found: ' + appNo);
      return;
    }

    // Safely hide tracking modal if currently open so backdrops don't conflict
    const existingTracking = document.getElementById('sharedAppTrackingModal');
    if (existingTracking) {
      const bsExistingTracking = bootstrap.Modal.getInstance(existingTracking);
      if (bsExistingTracking) bsExistingTracking.hide();
    }

    const auth = evaluateAuthority(app.purpose, (app.trees || []).length);

    let modalEl = document.getElementById('sharedAppDetailModal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.className = 'modal fade';
      modalEl.id = 'sharedAppDetailModal';
      modalEl.tabIndex = -1;
      modalEl.setAttribute('aria-hidden', 'true');
      document.body.appendChild(modalEl);
    }

    const treesRows = (app.trees || []).map(function (t, idx) {
      return '<tr>' +
        '<td class="fw-semibold">Tree #' + (t.treeNo || (idx + 1)) + '</td>' +
        '<td>' + (t.species || t.verifiedSpecies || 'Timber') + '</td>' +
        '<td class="font-monospace">' + (t.plotNo || app.khasraNo || 'N/A') + '</td>' +
        '<td>' + (t.gbhFeet || (t.girthInches ? (t.girthInches / 12).toFixed(2) + ' ft' : '3.00 ft')) + '</td>' +
        '<td><span class="badge bg-light text-dark border">' + (t.boMatchStatus || (t.verified ? 'Verified & Matched' : 'Pending')) + '</span></td>' +
        '</tr>';
    }).join('');

    const docsRows = (app.documents || []).map(function (d) {
      return '<li class="list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2 small">' +
        '<div><i class="bi bi-file-earmark-pdf text-danger me-2"></i><strong>' + d.name + '</strong> <span class="text-muted">(' + d.fileName + ')</span></div>' +
        '<span class="badge bg-success-subtle text-success border border-success-subtle">' + d.status + '</span>' +
        '</li>';
    }).join('');

    const historyRows = (app.history || []).map(function (h) {
      return '<tr>' +
        '<td class="text-nowrap small fw-semibold">' + h.date + '</td>' +
        '<td class="small"><span class="badge bg-light text-dark border">' + h.stage + '</span></td>' +
        '<td class="small">' + h.actor + '</td>' +
        '<td class="small text-secondary">' + h.remarks + '</td>' +
        '</tr>';
    }).join('');

    const permAddr = app.permanentAddress || {
      address1: app.address || 'Ranipool',
      blockGpu: app.gpu || app.revenueBlock || 'Ranipool Block',
      district: app.district || 'Gangtok'
    };
    const resAddr = app.residentialAddress || permAddr;

    const applyForOthersBanner = app.applicationFor === 'Apply for Others'
      ? '<div class="alert alert-info py-2 px-3 small mb-3 d-flex align-items-center gap-2">' +
      '<i class="bi bi-people-fill fs-5 text-primary"></i>' +
      '<div><strong>Application For: Apply for Others</strong> � Submitting User: <strong>' + (app.submittedByCitizenName || app.appliedByUserName || 'Citizen') + ' (' + (app.appliedByUserId || '') + ')</strong> � Beneficiary Applicant: <strong>' + app.applicantName + '</strong></div>' +
      '</div>'
      : '<div class="alert alert-light border py-2 px-3 small mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2">' +
      '<div><i class="bi bi-person-check-fill text-success me-1"></i> <strong>Application For:</strong> Self (' + app.applicantName + ')</div>' +
      '<span class="badge bg-secondary-subtle text-secondary border">Application Dossier Preview</span>' +
      '</div>';

    modalEl.innerHTML =
      '<div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">' +
      '<div class="modal-content border-0 shadow-lg">' +
      '<div class="modal-header text-white py-3" style="background: linear-gradient(135deg, #114b3f 0%, #0d382f 100%);">' +
      '<div>' +
      '<div class="d-flex align-items-center gap-2 flex-wrap">' +
      '<h5 class="modal-title fw-bold mb-0 font-monospace">' + app.appNo + '</h5>' +
      '<span class="badge bg-warning text-dark">' + app.currentStatus + '</span>' +
      '</div>' +
      '<div class="small text-white-50">Marking Order Application Dossier Preview � Forest and Environment Department</div>' +
      '</div>' +
      '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>' +
      '</div>' +
      '<div class="modal-body p-4 bg-light">' +
      applyForOthersBanner +
      '<div class="row g-3 mb-3">' +
      '<div class="col-md-6">' +
      '<div class="card border-0 shadow-xs h-100 p-3 bg-white">' +
      '<h6 class="fw-bold text-dark border-bottom pb-2 mb-2"><i class="bi bi-person-vcard text-success me-1"></i> Applicant Details</h6>' +
      '<div class="small"><div class="mb-1"><span class="text-muted">Application For:</span> <strong>' + app.applicationFor + '</strong></div>' +
      '<div class="mb-1"><span class="text-muted">Applicant Full Name:</span> <strong>' + app.applicantName + '</strong></div>' +
      '<div class="mb-1"><span class="text-muted">' + (app.relationType || 'Relation') + ' Name:</span> <strong>' + (app.relationName || 'N/A') + '</strong></div>' +
      '<div class="mb-1"><span class="text-muted">Mobile Number:</span> <strong>' + (app.mobile || app.phone || '9876543210') + '</strong></div>' +
      '<div><span class="text-muted">Submitted By User:</span> <strong>' + (app.submittedByCitizenName || app.appliedByUserName || 'Citizen') + '</strong></div></div>' +
      '</div>' +
      '</div>' +
      '<div class="col-md-6">' +
      '<div class="card border-0 shadow-xs h-100 p-3 bg-white">' +
      '<h6 class="fw-bold text-dark border-bottom pb-2 mb-2"><i class="bi bi-geo-alt text-success me-1"></i> Permanent &amp; Residential Address</h6>' +
      '<div class="small">' +
      '<div class="mb-1"><span class="text-muted">Permanent Address:</span> <strong>' + permAddr.address1 + ', ' + (permAddr.blockGpu || '') + ', ' + (permAddr.district || '') + '</strong></div>' +
      '<div class="mb-1"><span class="text-muted">Same as Permanent Address?</span> <strong>' + (permAddr.sameAsPermanent ? 'Yes' : 'No') + '</strong></div>' +
      '<div><span class="text-muted">Residential / Present Address:</span> <strong>' + resAddr.address1 + ', ' + (resAddr.blockGpu || '') + ', ' + (resAddr.district || '') + '</strong></div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +

      '<div class="card border-0 shadow-xs p-3 bg-white mb-3">' +
      '<h6 class="fw-bold text-dark border-bottom pb-2 mb-2"><i class="bi bi-tree text-success me-1"></i> Forest, Land &amp; Statutory Authority Details</h6>' +
      '<div class="row g-2 small">' +
      '<div class="col-sm-3"><span class="text-muted d-block">District / Division</span><strong>' + (app.district || 'Gangtok') + ' / ' + (app.division || 'Gangtok Territorial Division') + '</strong></div>' +
      '<div class="col-sm-3"><span class="text-muted d-block">Forest Range</span><strong>' + (app.range || 'Ranipool Range (T)') + '</strong></div>' +
      '<div class="col-sm-3"><span class="text-muted d-block">Purpose of Felling</span><strong>' + app.purpose + ' (' + (app.trees ? app.trees.length : 0) + ' Trees)</strong></div>' +
      '<div class="col-sm-3"><span class="text-muted d-block">Khatiyan in Applicant Name?</span><strong>' + (app.khatiyanInApplicantName ? 'Yes' : 'No (NOC Attached)') + '</strong></div>' +
      '<div class="col-sm-6 mt-2"><span class="text-muted d-block">RO Statutory Limit Classification</span><span class="badge ' + (auth.withinRO ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-warning-subtle text-warning-emphasis border border-warning-subtle') + '">' + auth.roClassificationText + '</span></div>' +
      '<div class="col-sm-6 mt-2"><span class="text-muted d-block">ACF / DFO Authority Classification</span><span class="badge ' + (auth.withinACF ? 'bg-primary-subtle text-primary border border-primary-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle') + '">' + auth.acfClassificationText + '</span></div>' +
      '</div>' +
      '</div>' +

      '<div class="card border-0 shadow-xs p-3 bg-white mb-3">' +
      '<div class="d-flex justify-content-between align-items-center mb-2">' +
      '<h6 class="fw-bold text-dark mb-0"><i class="bi bi-list-ol text-success me-1"></i> Tree Information (' + (app.trees ? app.trees.length : 0) + ' of Max 10 Trees)</h6>' +
      '<span class="badge bg-light text-secondary border small">Max Permitted: 10 Trees</span>' +
      '</div>' +
      '<div class="table-responsive">' +
      '<table class="table table-sm table-bordered align-middle small mb-0">' +
      '<thead class="table-light"><tr><th>Tree #</th><th>Species of Tree</th><th>Plot / Khasra No.</th><th>GBH (Feet)</th><th>Verification Status</th></tr></thead>' +
      '<tbody>' + (treesRows || '<tr><td colspan="5" class="text-center text-muted">No trees listed.</td></tr>') + '</tbody>' +
      '</table>' +
      '</div>' +
      '</div>' +

      '<div class="row g-3 mb-3">' +
      '<div class="col-md-6">' +
      '<div class="card border-0 shadow-xs p-3 bg-white h-100">' +
      '<h6 class="fw-bold text-dark border-bottom pb-2 mb-2"><i class="bi bi-paperclip text-success me-1"></i> Supporting Document List</h6>' +
      '<ul class="list-group list-group-flush">' + (docsRows || '<li class="list-group-item text-muted small">No documents attached.</li>') + '</ul>' +
      '</div>' +
      '</div>' +
      '<div class="col-md-6">' +
      '<div class="card border-0 shadow-xs p-3 bg-white h-100">' +
      '<h6 class="fw-bold text-dark border-bottom pb-2 mb-2"><i class="bi bi-chat-left-text text-success me-1"></i> Remarks &amp; Current Status</h6>' +
      '<div class="small mb-2"><span class="text-muted">Applicant Additional Remarks:</span><div class="p-2 bg-light rounded border mt-1">' + (app.additionalRemarks || app.fellingReason || 'None') + '</div></div>' +
      '<div class="small"><span class="text-muted">Department / Verification Remarks:</span><div class="p-2 bg-light rounded border mt-1">' + (app.boRemarks || app.departmentRemarks || (app.verificationReport ? app.verificationReport.overallRecommendation : 'None')) + '</div></div>' +
      '</div>' +
      '</div>' +
      '</div>' +

      '<div class="card border-0 shadow-xs p-3 bg-white mb-3">' +
      '<h6 class="fw-bold text-dark border-bottom pb-2 mb-2"><i class="bi bi-shield-check text-success me-1"></i> Land Parcha &amp; Verification Checklists</h6>' +
      '<div class="mb-3">' + renderLandParchaHtml(app) + '</div>' +
      '<div><h6 class="fw-bold text-dark small mb-2">Department Verification Checklists:</h6>' + renderChecklistsHtml(app) + '</div>' +
      '</div>' +

      '<div class="card border-0 shadow-xs p-3 bg-white">' +
      '<h6 class="fw-bold text-dark border-bottom pb-2 mb-2"><i class="bi bi-clock-history text-success me-1"></i> Application Processing History</h6>' +
      '<div class="table-responsive">' +
      '<table class="table table-sm table-bordered align-middle mb-0">' +
      '<thead class="table-light"><tr><th>Date</th><th>Workflow Stage</th><th>Actor / Authority</th><th>Remarks</th></tr></thead>' +
      '<tbody>' + (historyRows || '<tr><td colspan="4" class="text-center text-muted">No history recorded yet.</td></tr>') + '</tbody>' +
      '</table>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="modal-footer bg-white d-flex justify-content-between">' +
      '<button type="button" class="btn btn-sm btn-outline-primary" onclick="MarkingOrderData.openApplicationTrackingModal(\'' + app.appNo + '\')"><i class="bi bi-diagram-3 me-1"></i> Open Workflow Progress Tracker</button>' +
      '<button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Close Preview</button>' +
      '</div>' +
      '</div>' +
      '</div>';

    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();
  }

  /**
   * Inject and open the shared 6-Stage Application Tracking Modal (Section 12.4)
   */
  function openApplicationTrackingModal(appNo) {
    const app = getApplicationByNo(appNo);
    if (!app) {
      alert('Application record not found: ' + appNo);
      return;
    }

    // Safely hide detail modal if currently open so backdrops don't conflict
    const existingDetail = document.getElementById('sharedAppDetailModal');
    if (existingDetail) {
      const bsExistingDetail = bootstrap.Modal.getInstance(existingDetail);
      if (bsExistingDetail) bsExistingDetail.hide();
    }

    let modalEl = document.getElementById('sharedAppTrackingModal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.className = 'modal fade';
      modalEl.id = 'sharedAppTrackingModal';
      modalEl.tabIndex = -1;
      modalEl.setAttribute('aria-hidden', 'true');
      document.body.appendChild(modalEl);
    }

    modalEl.innerHTML =
      '<div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">' +
      '<div class="modal-content border-0 shadow-lg">' +
      '<div class="modal-header text-white py-3" style="background: linear-gradient(135deg, #114b3f 0%, #0d382f 100%);">' +
      '<div>' +
      '<h5 class="modal-title fw-bold mb-0"><i class="bi bi-geo-alt-fill text-warning me-2"></i>Track Application: <span class="font-monospace">' + app.appNo + '</span></h5>' +
      '<div class="small text-white-50">Applicant: ' + app.applicantName + ' � ' + (app.range || 'Ranipool Range (T)') + ' (' + (app.division || 'Gangtok') + ')</div>' +
      '</div>' +
      '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>' +
      '</div>' +
      '<div class="modal-body p-4 bg-white">' +
      '<div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3 pb-2 border-bottom">' +
      '<div><span class="small text-muted d-block">Current Workflow Status</span>' + getStatusBadgeHtml(app.currentStatus) + '</div>' +
      '<div class="text-sm-end"><span class="small text-muted d-block">Next Expected Action</span><strong class="small text-dark">' + app.nextExpectedAction + '</strong></div>' +
      '</div>' +
      buildWorkflowTrackerHtml(app) +
      '</div>' +
      '<div class="modal-footer bg-light d-flex justify-content-between">' +
      '<button type="button" class="btn btn-sm btn-gov-primary px-3 fw-semibold" onclick="MarkingOrderData.openApplicationDetailModal(\'' + app.appNo + '\')"><i class="bi bi-eye me-1"></i> View Full Application Details</button>' +
      '<button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Close Tracker</button>' +
      '</div>' +
      '</div>' +
      '</div>';

    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();
  }

  function openStagePlaceholderModal(title, stageBadge, description, bulletItems) {
    let modalEl = document.getElementById('sharedStagePlaceholderModal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.className = 'modal fade';
      modalEl.id = 'sharedStagePlaceholderModal';
      modalEl.tabIndex = -1;
      modalEl.setAttribute('aria-hidden', 'true');
      document.body.appendChild(modalEl);
    }

    const bulletsHtml = (bulletItems || []).map(function (b) {
      return '<li class="mb-1.5 d-flex align-items-start gap-2"><i class="bi bi-check2-circle text-success mt-0.5"></i><span>' + b + '</span></li>';
    }).join('');

    modalEl.innerHTML =
      '<div class="modal-dialog modal-dialog-centered modal-lg">' +
      '<div class="modal-content border-0 shadow-lg">' +
      '<div class="modal-header text-white py-3" style="background: linear-gradient(135deg, #114b3f 0%, #0d382f 100%);">' +
      '<div>' +
      '<span class="badge bg-warning text-dark fw-bold mb-1">' + stageBadge + '</span>' +
      '<h5 class="modal-title fw-bold mb-0">' + title + '</h5>' +
      '</div>' +
      '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>' +
      '</div>' +
      '<div class="modal-body p-4 bg-white">' +
      '<div class="alert alert-info border-0 small d-flex align-items-start gap-2 mb-3">' +
      '<i class="bi bi-info-circle-fill fs-5 text-primary mt-0.5"></i>' +
      '<div><strong>Stage 02 Implementation Boundary:</strong> ' + description + '</div>' +
      '</div>' +
      (bulletsHtml ? '<h6 class="fw-bold small text-uppercase text-muted mb-2">Preserved Context for Subsequent Stage:</h6><ul class="list-unstyled small text-secondary mb-0">' + bulletsHtml + '</ul>' : '') +
      '</div>' +
      '<div class="modal-footer bg-light">' +
      '<button type="button" class="btn btn-sm btn-gov-primary" data-bs-dismiss="modal">Understood</button>' +
      '</div>' +
      '</div>' +
      '</div>';

    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();
  }

  /**
   * Interactive ?50 Application Fee Payment Modal (Section 19 / Tasks 1 & 2)
   */
  function openPaymentModal(appNo, onComplete) {
    const app = getApplicationByNo(appNo);
    if (!app) return;

    const activeUser = getActiveUser();
    if (!canUserPayForApplication(app, activeUser)) {
      alert('Access Restricted:\nPayment can only be completed by the user who originally submitted this application (' + (app.appliedByUserName || app.appliedByRole || 'Applicant') + ').');
      return;
    }

    let modalEl = document.getElementById('sharedPaymentModal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.className = 'modal fade';
      modalEl.id = 'sharedPaymentModal';
      modalEl.tabIndex = -1;
      modalEl.setAttribute('aria-hidden', 'true');
      document.body.appendChild(modalEl);
    }

    const defaultTpReq = Boolean(app.isTransitPermitRequired);

    modalEl.innerHTML =
      '<div class="modal-dialog modal-dialog-centered">' +
      '<div class="modal-content border-0 shadow-lg">' +
      '<div class="modal-header text-white py-3" style="background: linear-gradient(135deg, #114b3f 0%, #0d382f 100%);">' +
      '<div class="d-flex align-items-center gap-2">' +
      '<i class="bi bi-credit-card-2-front-fill fs-4 text-warning"></i>' +
      '<div>' +
      '<h5 class="modal-title fw-bold mb-0">Pay Application Fee &bull; &#8377;50</h5>' +
      '<div class="small text-white-50">Sikkim GO Digital Payment Gateway &bull; FED Sikkim</div>' +
      '</div>' +
      '</div>' +
      '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>' +
      '</div>' +
      '<div class="modal-body p-4 bg-light">' +
      '<div class="card border-0 shadow-xs p-3 bg-white mb-3">' +
      '<div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">' +
      '<span class="text-muted small">Application Number:</span>' +
      '<strong class="font-monospace text-primary">' + app.appNo + '</strong>' +
      '</div>' +
      '<div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">' +
      '<span class="text-muted small">Applicant Name:</span>' +
      '<strong class="text-dark">' + app.applicantName + '</strong>' +
      '</div>' +
      '<div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">' +
      '<span class="text-muted small">Service:</span>' +
      '<span class="text-dark">Tree Felling Marking Order</span>' +
      '</div>' +
      '<div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">' +
      '<span class="text-muted small">Purpose &amp; Tree Count:</span>' +
      '<strong class="text-dark">' + app.purpose + ' (' + (app.trees ? app.trees.length : 0) + ' Trees)</strong>' +
      '</div>' +
      '<div class="d-flex justify-content-between align-items-center pt-1">' +
      '<span class="fw-bold text-dark">Total Fee Payable:</span>' +
      '<span class="fs-4 fw-bold text-success font-monospace">&#8377;50.00</span>' +
      '</div>' +
      '</div>' +

      '<!-- Transit Permit Requirement Selection (Task 2) -->' +
      '<div class="card border-0 shadow-xs p-3 bg-white mb-3">' +
      '<label class="form-label small fw-bold text-dark mb-1 d-flex align-items-center gap-1">' +
      '<i class="bi bi-truck text-success"></i>' +
      '<span>Do you require a Transit Permit for transportation of timber?</span> <span class="text-danger">*</span>' +
      '</label>' +
      '<div class="d-flex gap-4 my-2">' +
      '<div class="form-check">' +
      '<input class="form-check-input" type="radio" name="payTransitPermitReq" id="payTransitReqNo" value="no"' + (!defaultTpReq ? ' checked' : '') + '>' +
      '<label class="form-check-label small fw-semibold text-dark cursor-pointer" for="payTransitReqNo">No</label>' +
      '</div>' +
      '<div class="form-check">' +
      '<input class="form-check-input" type="radio" name="payTransitPermitReq" id="payTransitReqYes" value="yes"' + (defaultTpReq ? ' checked' : '') + '>' +
      '<label class="form-check-label small fw-semibold text-dark cursor-pointer" for="payTransitReqYes">Yes</label>' +
      '</div>' +
      '</div>' +
      '<div class="text-muted small" style="font-size: 0.75rem;">' +
      'If you select Yes, the application will require Transit Permit approval from the competent authority before the Transit Permit can be issued.' +
      '</div>' +
      '</div>' +

      '<div class="card border-0 shadow-xs p-3 bg-white mb-3">' +
      '<label class="form-label small fw-bold text-dark mb-2"><i class="bi bi-wallet2 text-success me-1"></i> Select Payment Method (Prototype Demo):</label>' +
      '<div class="d-flex flex-column gap-2 small">' +
      '<label class="p-2 border rounded-2 d-flex align-items-center gap-2 cursor-pointer bg-light">' +
      '<input type="radio" name="payMethod" value="upi" checked class="form-check-input">' +
      '<span><i class="bi bi-qr-code text-primary me-1"></i> UPI / QR Code (Google Pay, PhonePe, Paytm)</span>' +
      '</label>' +
      '<label class="p-2 border rounded-2 d-flex align-items-center gap-2 cursor-pointer">' +
      '<input type="radio" name="payMethod" value="netbanking" class="form-check-input">' +
      '<span><i class="bi bi-bank text-primary me-1"></i> Net Banking (SBI, HDFC, ICICI, Axis)</span>' +
      '</label>' +
      '<label class="p-2 border rounded-2 d-flex align-items-center gap-2 cursor-pointer">' +
      '<input type="radio" name="payMethod" value="card" class="form-check-input">' +
      '<span><i class="bi bi-credit-card text-primary me-1"></i> Debit / Credit Card (RuPay, Visa, Mastercard)</span>' +
      '</label>' +
      '</div>' +
      '</div>' +

      '<div class="alert alert-info border-0 py-2 px-3 small mb-0 d-flex align-items-center gap-2">' +
      '<i class="bi bi-shield-check text-primary fs-5"></i>' +
      '<div><strong>Demonstration Gateway:</strong> Clicking &ldquo;Pay &#8377;50 &amp; Issue Marking Order&rdquo; will simulate instant payment success and generate official Marking Order <strong>MO/2026/XXXX</strong>.</div>' +
      '</div>' +
      '</div>' +
      '<div class="modal-footer bg-white d-flex justify-content-between">' +
      '<button type="button" class="btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>' +
      '<button type="button" class="btn btn-sm btn-gov-primary px-3 py-1.5 fw-semibold" id="btnConfirmPayMO">' +
      '<i class="bi bi-check-circle me-1"></i> Pay &#8377;50 &amp; Issue Marking Order' +
      '</button>' +
      '</div>' +
      '</div>' +
      '</div>';

    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();

    const payBtn = document.getElementById('btnConfirmPayMO');
    if (payBtn) {
      payBtn.onclick = function () {
        const tpRadio = modalEl.querySelector('input[name="payTransitPermitReq"]:checked');
        const isTp = tpRadio ? tpRadio.value === 'yes' : Boolean(app.isTransitPermitRequired);

        payBtn.disabled = true;
        payBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Processing &#8377;50...';

        setTimeout(function () {
          const randomMoNum = app.markingOrderNo || ('MO/2026/' + Math.floor(1000 + Math.random() * 9000));
          const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

          const newHistoryItem = {
            date: todayStr,
            stage: 'Payment Completed & Marking Order Issued',
            actor: 'Citizen / Payment Gateway',
            remarks: isTp
              ? 'Statutory fee of \u20B950.00 successfully paid. Marking Order ' + randomMoNum + ' generated. Transit Permit requested by applicant (pending ACF/DFO action).'
              : 'Statutory fee of \u20B950.00 successfully paid. Marking Order ' + randomMoNum + ' generated. Transit Permit not required.'
          };

          const patch = {
            isPaid: true,
            feeAmount: 50,
            paymentStatus: 'Payment Completed',
            markingOrderStatus: 'Marking Order Issued',
            markingOrderNo: randomMoNum,
            markingOrderIssueDate: todayStr,
            isTransitPermitRequired: isTp,
            transitPermitStatus: isTp ? 'Transit Permit Approval Pending' : 'Not Required',
            currentStatus: isTp ? 'Payment Completed � Transit Permit Pending' : 'Marking Order Issued',
            workflowStageIndex: 5,
            nextExpectedAction: isTp
              ? 'Marking Order issued. Transit Permit approval pending with ACF / DFO.'
              : 'Marking Order issued. Citizen may download order and proceed with tree marking.',
            requiresCitizenAction: false,
            requiredCitizenActionType: null,
            requiredCitizenActionText: null
          };

          const curApp = getApplicationByNo(appNo);
          if (curApp && curApp.history) {
            patch.history = curApp.history.concat([newHistoryItem]);
          }

          updateApplication(appNo, patch);
          bsModal.hide();

          // Show confirmation alert
          if (isTp) {
            alert('Payment Successful!\n\n\u20B950.00 received successfully.\nMarking Order Number: ' + randomMoNum + '\nStatus: Payment Completed � Transit Permit Approval Pending.\n\nNote: The application has been routed to ACF / DFO for Transit Permit issuance. Certificate download will be unlocked once Transit Permit is issued.');
          } else {
            alert('Payment Successful!\n\n\u20B950.00 received successfully.\nMarking Order Number: ' + randomMoNum + '\nStatus: Marking Order Issued.\n\nNote: You may now download your Marking Order Certificate.');
          }

          if (typeof onComplete === 'function') {
            onComplete(patch);
          } else {
            window.location.reload();
          }
        }, 800);
      };
    }
  }

  /**
   * Initialize common accessibility (A-, A, A+, High Contrast) & mobile sidebar drawer
   */
  function initDashboardCommon() {
    const html = document.documentElement;
    const body = document.body;

    // Task 4: Ensure long status pill text wraps cleanly without causing horizontal scrolling
    if (!document.getElementById('gov-status-wrap-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'gov-status-wrap-styles';
      styleEl.textContent = `
        .gov-status-pill, .badge-status, td .gov-status-pill, td .badge {
          white-space: normal !important;
          word-break: normal !important;
          overflow-wrap: anywhere !important;
          line-height: 1.25 !important;
          text-align: left !important;
          max-width: 220px !important;
          display: inline-flex !important;
          align-items: center !important;
        }
        table th, table td { vertical-align: middle !important; }
      `;
      document.head.appendChild(styleEl);
    }

    // Font Size Controls
    const fontBtns = document.querySelectorAll('[data-font-action]');
    const savedSize = localStorage.getItem('gov_font_size') || 'normal';
    html.setAttribute('data-font-size', savedSize);

    fontBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const action = this.getAttribute('data-font-action');
        let newSize = 'normal';
        if (action === 'increase') newSize = 'large';
        else if (action === 'decrease') newSize = 'small';
        html.setAttribute('data-font-size', newSize);
        localStorage.setItem('gov_font_size', newSize);
        fontBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
      });
    });

    // High Contrast Toggle
    const hcBtn = document.getElementById('btn-contrast-toggle');
    if (localStorage.getItem('gov_contrast') === 'high') {
      html.classList.add('high-contrast');
      body.classList.add('high-contrast');
      body.setAttribute('data-contrast', 'high');
    }
    if (hcBtn) {
      hcBtn.addEventListener('click', function () {
        const isHc = html.classList.toggle('high-contrast');
        body.classList.toggle('high-contrast', isHc);
        if (isHc) body.setAttribute('data-contrast', 'high');
        else body.removeAttribute('data-contrast');
        localStorage.setItem('gov_contrast', isHc ? 'high' : 'normal');
      });
    }

    // Mobile Sidebar Toggle
    const toggleBtn = document.getElementById('gov-sidebar-toggle');
    const sidebar = document.getElementById('sidebar-nav');
    const closeBtn = document.getElementById('sidebar-close-btn');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', function () {
        sidebar.classList.toggle('d-none');
      });
    }
    if (closeBtn && sidebar) {
      closeBtn.addEventListener('click', function () {
        sidebar.classList.add('d-none');
      });
    }
  }

  // =========================================================================
  // 8. STAGE 04 WORKFLOW ACTIONS & PLOT VERIFICATION ENGINE
  // =========================================================================

  function getPlotVerifications(appNo) {
    try {
      var stored = localStorage.getItem('mo_plot_data_' + appNo);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  }

  function savePlotVerification(appNo, plotNo, plotData) {
    var allPlots = getPlotVerifications(appNo);
    allPlots[plotNo] = Object.assign({
      savedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }, plotData);
    localStorage.setItem('mo_plot_data_' + appNo, JSON.stringify(allPlots));

    // Also update tree status in the application
    var app = getApplicationByNo(appNo);
    if (app && app.trees) {
      var updatedTrees = app.trees.map(function (t) {
        if (t.plotNo === plotNo) {
          return Object.assign({}, t, {
            boMatchStatus: plotData.verifiedStatus === 'Yes' ? 'Matched on Site' : 'Discrepancy Noted',
            verifiedSpecies: plotData.verifiedSpecies || t.species,
            verifiedGbhFeet: plotData.verifiedGbhFeet || t.gbhFeet,
            gpsLat: plotData.gpsLat,
            gpsLng: plotData.gpsLng,
            photoFileName: plotData.photoFileName || ('tree_photo_plot_' + plotNo.replace(/\W/g, '_') + '.jpg'),
            boVerified: plotData.verifiedStatus === 'Yes'
          });
        }
        return t;
      });
      updateApplication(appNo, { trees: updatedTrees });
    }
    return allPlots;
  }

  function areAllPlotsVerified(appNo) {
    var app = getApplicationByNo(appNo);
    if (!app || !app.trees || app.trees.length === 0) return true;
    var plots = {};
    app.trees.forEach(function (t) { plots[t.plotNo] = true; });
    var distinctPlots = Object.keys(plots);
    var saved = getPlotVerifications(appNo);
    return distinctPlots.every(function (p) { return !!saved[p]; });
  }

  function roScheduleVerification(appNo, date, boId, boName, instructions, officerName) {
    var todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    var curApp = getApplicationByNo(appNo);
    if (!curApp) return null;

    var newHistoryItem = {
      stage: 'Verification Scheduled',
      date: todayStr,
      actor: officerName || 'Range Officer (RO)',
      remarks: 'Field verification scheduled for ' + date + ' and assigned to ' + boName + '.' + (instructions ? ' Instructions: ' + instructions : '')
    };

    var patch = {
      currentStatus: 'Verification Scheduled',
      workflowStageIndex: 2,
      verificationDate: date,
      assignedBoId: boId,
      assignedBoName: boName,
      boAssignedDate: todayStr,
      pendingWithRole: boName,
      roQueue: 'scheduled',
      departmentRemarks: 'Field verification scheduled on ' + date + ' and assigned to ' + boName + '.',
      nextExpectedAction: 'Block Officer (' + boName + ') will conduct on-site physical inspection.',
      requiresCitizenAction: false,
      history: (curApp.history || []).concat([newHistoryItem])
    };

    return updateApplication(appNo, patch);
  }

  function roCorrectJurisdiction(appNo, newDivision, newRange, officerName) {
    var todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    var curApp = getApplicationByNo(appNo);
    if (!curApp) return null;

    var oldDiv = curApp.division;
    var oldRange = curApp.range;

    var newHistoryItem = {
      stage: 'Jurisdiction Corrected',
      date: todayStr,
      actor: officerName || 'Range Officer (RO)',
      remarks: 'Jurisdiction corrected after confirmation with applicant. Division: ' + oldDiv + ' \u2192 ' + newDivision + ', Range: ' + oldRange + ' \u2192 ' + newRange + '.'
    };

    var patch = {
      division: newDivision,
      range: newRange,
      lastUpdatedDate: todayStr,
      departmentRemarks: 'Jurisdiction corrected after confirmation with applicant.',
      history: (curApp.history || []).concat([newHistoryItem])
    };

    return updateApplication(appNo, patch);
  }

  function roReturnApplication(appNo, remarks, officerName) {
    var todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    var curApp = getApplicationByNo(appNo);
    if (!curApp) return null;

    var newHistoryItem = {
      stage: 'Returned for Correction',
      date: todayStr,
      actor: officerName || 'Range Officer (RO)',
      remarks: remarks || 'Returned for correction of submitted information/documents.'
    };

    var patch = {
      currentStatus: 'Returned for Correction',
      workflowStageIndex: 1,
      roQueue: 'returned',
      requiresCitizenAction: true,
      requiredCitizenActionType: 'correct_application',
      requiredCitizenActionText: remarks,
      departmentRemarks: remarks,
      nextExpectedAction: 'Applicant must review remarks, update deficient details in the application form, and resubmit.',
      history: (curApp.history || []).concat([newHistoryItem])
    };

    return updateApplication(appNo, patch);
  }

  function boSubmitVerificationReport(appNo, reportData, officerName) {
    var todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    var curApp = getApplicationByNo(appNo);
    if (!curApp) return null;

    var hasDiscrepancy = !!reportData.hasDiscrepancies;
    var obs = reportData.observations || (hasDiscrepancy ? 'Discrepancy observed during site inspection.' : 'All tree species, GBH and boundary coordinates verified.');
    var signedFile = reportData.signedReportFileName || ('signed_bo_report_' + appNo.replace(/\W/g, '_') + '.pdf');

    var newHistoryItem = {
      stage: 'BO Verified',
      date: todayStr,
      actor: officerName || curApp.assignedBoName || 'Block Officer (BO)',
      remarks: (hasDiscrepancy ? 'Report submitted with discrepancy remarks: ' : 'On-site verification completed and report submitted to RO: ') + obs
    };

    var newDocs = (curApp.documents || []).concat([{
      name: 'BO Field Verification Report (Signed)',
      fileName: signedFile,
      mandatory: false,
      status: 'Uploaded by BO (' + todayStr + ')'
    }]);

    var patch = {
      currentStatus: 'BO Verified',
      workflowStageIndex: 3,
      boReportDate: todayStr,
      boForwardedWithRemarks: hasDiscrepancy,
      boRemarks: obs,
      signedReportFileName: signedFile,
      documents: newDocs,
      roQueue: 'reports_submitted',
      pendingWithRole: 'Range Officer (' + curApp.range + ')',
      departmentRemarks: 'Block Officer completed site inspection. Verification report submitted for RO final review.',
      nextExpectedAction: 'Range Officer will review BO verification report and determine statutory authority action.',
      history: (curApp.history || []).concat([newHistoryItem])
    };

    return updateApplication(appNo, patch);
  }

  function roApproveOrForward(appNo, decision, remarks, officerName) {
    var todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    var curApp = getApplicationByNo(appNo);
    if (!curApp) return null;

    var auth = evaluateAuthority(curApp.purpose, curApp.trees.length);

    if (decision === 'approve') {
      if (!auth.withinRO) {
        throw new Error('Cannot approve: Application exceeds RO statutory authority (' + curApp.trees.length + ' trees > ' + auth.roLimit + '). Must forward to ACF.');
      }
      var patch = {
        currentStatus: 'Approved � Payment Pending',
        workflowStageIndex: 4,
        approvalStatus: 'Approved by Range Officer',
        approvedByRole: 'Range Officer (RO)',
        approvalDate: todayStr,
        paymentStatus: 'Payment Pending (\u20B950.00)',
        roQueue: 'approved',
        departmentRemarks: remarks || 'Approved by RO within statutory limit (' + curApp.trees.length + ' trees \u2264 3).',
        requiresCitizenAction: true,
        requiredCitizenActionType: 'pay_fee',
        requiredCitizenActionText: 'Application approved. Please pay the statutory fee of \u20B950.00 to enable Marking Order issuance.',
        nextExpectedAction: 'Applicant must pay demonstration statutory fee of \u20B950.00 to generate Marking Order.',
        history: (curApp.history || []).concat([{
          stage: 'Application Approved (RO)',
          date: todayStr,
          actor: officerName || 'Range Officer (RO)',
          remarks: 'Approved within statutory limit of ' + auth.roLimit + ' trees. ' + (remarks || '')
        }])
      };
      return updateApplication(appNo, patch);
    } else if (decision === 'forward') {
      var patch = {
        currentStatus: 'Forwarded to ACF',
        workflowStageIndex: 5,
        forwardedByRo: officerName || 'Range Officer (RO)',
        forwardedToAcfDate: todayStr,
        roQueue: 'forwarded',
        departmentRemarks: remarks || ('Forwarded to ACF Desk: Exceeds RO authority (' + curApp.trees.length + ' trees > ' + auth.roLimit + ').'),
        pendingWithRole: 'Assistant Conservator of Forests (ACF)',
        nextExpectedAction: 'Assistant Conservator of Forests (ACF) will review BO report and forward remarks.',
        history: (curApp.history || []).concat([{
          stage: 'Forwarded to ACF',
          date: todayStr,
          actor: officerName || 'Range Officer (RO)',
          remarks: 'Forwarded to ACF: ' + (remarks || 'Application quantity (' + curApp.trees.length + ' trees) exceeds RO authority.')
        }])
      };
      return updateApplication(appNo, patch);
    } else if (decision === 'reject') {
      var patch = {
        currentStatus: 'Rejected',
        rejectionDate: todayStr,
        rejectionReason: remarks || 'Rejected by Range Officer.',
        roQueue: 'rejected',
        departmentRemarks: remarks || 'Application rejected by Range Officer.',
        requiresCitizenAction: false,
        nextExpectedAction: 'Application rejected. No further processing permitted.',
        history: (curApp.history || []).concat([{
          stage: 'Application Rejected',
          date: todayStr,
          actor: officerName || 'Range Officer (RO)',
          remarks: remarks || 'Rejected by Range Officer.'
        }])
      };
      return updateApplication(appNo, patch);
    }
    return null;
  }

  function acfApproveOrForward(appNo, decision, remarks, officerName) {
    var todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    var curApp = getApplicationByNo(appNo);
    if (!curApp) return null;

    var auth = evaluateAuthority(curApp.purpose, curApp.trees.length);

    if (decision === 'approve') {
      if (!auth.withinACF) {
        throw new Error('Cannot approve: Application exceeds ACF statutory authority (' + curApp.trees.length + ' trees > ' + auth.acfLimit + '). Must forward to DFO.');
      }
      var patch = {
        currentStatus: 'Approved � Payment Pending',
        workflowStageIndex: 4,
        approvalStatus: 'Approved by Assistant Conservator of Forests',
        approvedByRole: 'Assistant Conservator of Forests (ACF)',
        approvalDate: todayStr,
        paymentStatus: 'Payment Pending (\u20B950.00)',
        departmentRemarks: remarks || 'Approved by ACF within statutory limit (' + curApp.trees.length + ' trees \u2264 6).',
        requiresCitizenAction: true,
        requiredCitizenActionType: 'pay_fee',
        requiredCitizenActionText: 'Application approved by ACF. Please pay the statutory fee of \u20B950.00 to enable Marking Order issuance.',
        nextExpectedAction: 'Applicant must pay demonstration statutory fee of \u20B950.00 to generate Marking Order.',
        history: (curApp.history || []).concat([{
          stage: 'Application Approved (ACF)',
          date: todayStr,
          actor: officerName || 'Assistant Conservator of Forests (ACF)',
          remarks: 'Approved within statutory limit of ' + auth.acfLimit + ' trees. ' + (remarks || '')
        }])
      };
      return updateApplication(appNo, patch);
    } else if (decision === 'forward') {
      var patch = {
        currentStatus: 'Forwarded to DFO',
        workflowStageIndex: 5,
        forwardedByAcf: officerName || 'Assistant Conservator of Forests (ACF)',
        forwardedToDfoDate: todayStr,
        departmentRemarks: remarks || ('Forwarded to DFO Desk: Exceeds ACF authority (' + curApp.trees.length + ' trees > ' + auth.acfLimit + ').'),
        pendingWithRole: 'Divisional Forest Officer (DFO)',
        nextExpectedAction: 'Divisional Forest Officer (DFO) will perform final in-scope statutory review.',
        history: (curApp.history || []).concat([{
          stage: 'Forwarded to DFO',
          date: todayStr,
          actor: officerName || 'Assistant Conservator of Forests (ACF)',
          remarks: 'Escalated to DFO: ' + (remarks || 'Application quantity (' + curApp.trees.length + ' trees) exceeds ACF authority.')
        }])
      };
      return updateApplication(appNo, patch);
    } else if (decision === 'return') {
      return roReturnApplication(appNo, remarks, officerName || 'Assistant Conservator of Forests (ACF)');
    } else if (decision === 'reject') {
      var patch = {
        currentStatus: 'Rejected',
        rejectionDate: todayStr,
        rejectionReason: remarks || 'Rejected by Assistant Conservator of Forests.',
        departmentRemarks: remarks || 'Application rejected by ACF.',
        requiresCitizenAction: false,
        nextExpectedAction: 'Application rejected. No further processing permitted.',
        history: (curApp.history || []).concat([{
          stage: 'Application Rejected',
          date: todayStr,
          actor: officerName || 'Assistant Conservator of Forests (ACF)',
          remarks: remarks || 'Rejected by ACF.'
        }])
      };
      return updateApplication(appNo, patch);
    }
    return null;
  }

  function dfoApproveOrReject(appNo, decision, remarks, officerName) {
    var todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    var curApp = getApplicationByNo(appNo);
    if (!curApp) return null;

    if (decision === 'approve') {
      var patch = {
        currentStatus: 'Approved � Payment Pending',
        workflowStageIndex: 4,
        approvalStatus: 'Approved by Divisional Forest Officer',
        approvedByRole: 'Divisional Forest Officer (DFO)',
        approvalDate: todayStr,
        paymentStatus: 'Payment Pending (\u20B950.00)',
        departmentRemarks: remarks || 'Approved under DFO final in-scope authority (' + curApp.trees.length + ' trees \u2264 10).',
        requiresCitizenAction: true,
        requiredCitizenActionType: 'pay_fee',
        requiredCitizenActionText: 'Application approved by DFO. Please pay the statutory fee of \u20B950.00 to enable Marking Order issuance.',
        nextExpectedAction: 'Applicant must pay demonstration statutory fee of \u20B950.00 to generate Marking Order.',
        history: (curApp.history || []).concat([{
          stage: 'Application Approved (DFO)',
          date: todayStr,
          actor: officerName || 'Divisional Forest Officer (DFO)',
          remarks: 'Approved under DFO final statutory authority (' + curApp.trees.length + ' trees). ' + (remarks || '')
        }])
      };
      return updateApplication(appNo, patch);
    } else if (decision === 'return') {
      return roReturnApplication(appNo, remarks, officerName || 'Divisional Forest Officer (DFO)');
    } else if (decision === 'reject') {
      var patch = {
        currentStatus: 'Rejected',
        rejectionDate: todayStr,
        rejectionReason: remarks || 'Rejected by Divisional Forest Officer.',
        departmentRemarks: remarks || 'Application rejected by DFO.',
        requiresCitizenAction: false,
        nextExpectedAction: 'Application rejected. No further processing permitted.',
        history: (curApp.history || []).concat([{
          stage: 'Application Rejected',
          date: todayStr,
          actor: officerName || 'Divisional Forest Officer (DFO)',
          remarks: remarks || 'Rejected by DFO.'
        }])
      };
      return updateApplication(appNo, patch);
    }
    return null;
  }

  function dfoCancelMarkingOrder(appNo, cancellationReason, officerName) {
    var todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    var curApp = getApplicationByNo(appNo);
    if (!curApp) return null;

    var patch = {
      markingOrderStatus: 'Cancelled',
      currentStatus: 'Cancelled',
      cancellationDate: todayStr,
      cancellationReason: cancellationReason,
      transitPermitStatus: curApp.transitPermitNo ? 'Invalidated (Marking Order Cancelled)' : 'Not Applicable',
      departmentRemarks: 'Marking Order cancelled by DFO: ' + cancellationReason,
      requiresCitizenAction: false,
      nextExpectedAction: 'Marking Order cancelled. Associated felling and transit activities prohibited.',
      history: (curApp.history || []).concat([{
        stage: 'Marking Order Cancelled',
        date: todayStr,
        actor: officerName || 'Divisional Forest Officer (DFO)',
        remarks: 'Cancelled under DFO statutory authority. Reason: ' + cancellationReason + '. Any associated Transit Permit invalidated.'
      }])
    };

    return updateApplication(appNo, patch);
  }

  function dfoSendDelayAlert(appNo, officerName) {
    var todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    var alertItem = {
      id: 'N-ALERT-' + Date.now(),
      title: 'Urgent: Processing Delay Escalation (' + appNo + ')',
      description: 'DFO (' + (officerName || 'Gangtok Division') + ') initiated delay alert for application pending over 7 days. Expedited processing requested.',
      appNo: appNo,
      date: todayStr,
      unread: true
    };
    try {
      var customAlerts = JSON.parse(localStorage.getItem('mo_delay_alerts') || '[]');
      customAlerts.unshift(alertItem);
      localStorage.setItem('mo_delay_alerts', JSON.stringify(customAlerts));
    } catch (e) { }
    return alertItem;
  }

  function getDelayedApplications(division) {
    var all = getAllApplications();
    return all.filter(function (a) {
      if (division && a.division !== division && division !== 'All Divisions') return false;
      if (a.currentStatus === 'Marking Order Issued' || a.currentStatus === 'Cancelled' || a.currentStatus === 'Rejected') return false;
      return (a.daysDelayed || 0) > 7;
    }).sort(function (a, b) {
      return (b.daysDelayed || 0) - (a.daysDelayed || 0);
    });
  }

  function issueMarkingOrder(appNo, officerName, roleName) {
    var curApp = getApplicationByNo(appNo);
    if (!curApp) return null;
    var randomMoNum = curApp.markingOrderNo || ('MO/2026/' + Math.floor(1000 + Math.random() * 9000));
    var todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    var patch = {
      markingOrderStatus: 'Marking Order Issued',
      currentStatus: 'Marking Order Issued',
      markingOrderNo: randomMoNum,
      markingOrderIssueDate: todayStr,
      workflowStageIndex: 5,
      departmentRemarks: 'Marking Order ' + randomMoNum + ' issued under competent authority.',
      nextExpectedAction: 'Marking Order issued. Citizen may download order and proceed with tree marking.',
      history: (curApp.history || []).concat([{
        stage: 'Marking Order Issued',
        date: todayStr,
        actor: (roleName ? roleName + ' (' + officerName + ')' : officerName || 'Competent Authority'),
        remarks: 'Official Marking Order ' + randomMoNum + ' issued following payment confirmation.'
      }])
    };
    return updateApplication(appNo, patch);
  }

  // =========================================================================
  // 9. STAGE 04 ADDITIONAL WORKFLOW UPDATES
  // =========================================================================

  // -------------------------------------------------------------------------
  // USER CONTEXT & ACCESS CONTROL (Requirement 1)
  // -------------------------------------------------------------------------
  function getActiveUser() {
    var activeRole = (localStorage.getItem('mo_active_role') || 'citizen').toLowerCase();
    var userId = localStorage.getItem('mo_active_user_id');

    if (activeRole === 'ro') {
      userId = userId || localStorage.getItem('mo_ro_user') || 'RO-RANIPOOL';
      var ro = demoUsers.rangeOfficers.find(function (u) { return u.id === userId; }) || demoUsers.rangeOfficers[0];
      return { role: 'ro', id: ro.id, name: ro.name, range: ro.range, division: ro.division };
    } else if (activeRole === 'bo') {
      userId = userId || localStorage.getItem('mo_bo_user') || 'BO-RANIPOOL-1';
      var bo = demoUsers.blockOfficers.find(function (u) { return u.id === userId; }) || demoUsers.blockOfficers[0];
      return { role: 'bo', id: bo.id, name: bo.name, range: bo.range, division: bo.division, blockName: bo.blockName };
    } else if (activeRole === 'acf') {
      userId = userId || localStorage.getItem('mo_acf_user') || 'ACF-GANGTOK';
      var acf = demoUsers.acfUsers.find(function (u) { return u.id === userId; }) || demoUsers.acfUsers[0];
      return { role: 'acf', id: acf.id, name: acf.name, division: acf.division };
    } else if (activeRole === 'dfo') {
      userId = userId || localStorage.getItem('mo_dfo_user') || 'DFO-GANGTOK';
      var dfo = demoUsers.dfoUsers.find(function (u) { return u.id === userId; }) || demoUsers.dfoUsers[0];
      return { role: 'dfo', id: dfo.id, name: dfo.name, division: dfo.division };
    } else if (activeRole === 'admin' || activeRole === 'superadmin' || activeRole === 'headquarters') {
      userId = userId || localStorage.getItem('mo_admin_user') || 'ADMIN-STATE';
      var adm = (demoUsers.superAdmins && demoUsers.superAdmins.find(function (u) { return u.id === userId; })) || (demoUsers.superAdmins && demoUsers.superAdmins[0]) || { id: 'ADMIN-STATE', name: 'Super Admin Demo User', division: 'All Divisions', range: 'All Ranges' };
      return { role: 'admin', id: adm.id, name: adm.name, division: 'All Divisions', range: 'All Ranges' };
    } else {
      userId = userId || 'CIT-DEMO-01';
      var cit = demoUsers.citizens.find(function (u) { return u.id === userId; }) || demoUsers.citizens[0];
      return { role: 'citizen', id: cit.id, name: cit.name, district: cit.district };
    }
  }

  function setActiveUser(role, userId) {
    if (role) localStorage.setItem('mo_active_role', role);
    if (userId) localStorage.setItem('mo_active_user_id', userId);
  }

  function canUserPayForApplication(app, user) {
    if (!app) return false;
    user = user || getActiveUser();
    if (!user || !user.id) return false;

    // 1. Is application approved?
    var isApproved = (app.currentStatus && app.currentStatus.includes('Approved')) ||
      (app.approvalStatus && app.approvalStatus.includes('Approved'));
    if (!isApproved) return false;

    // 2. Is payment pending?
    var isPaymentPending = (app.paymentStatus && app.paymentStatus.includes('Pending')) ||
      (app.currentStatus && app.currentStatus.includes('Payment Pending'));
    var isAlreadyPaid = (app.paymentStatus && app.paymentStatus.includes('Paid')) ||
      (app.paymentStatus && app.paymentStatus.includes('Completed')) ||
      (app.currentStatus && app.currentStatus.includes('Payment Successful')) ||
      (app.currentStatus && app.currentStatus.includes('Marking Order Issued'));
    if (!isPaymentPending || isAlreadyPaid) return false;

    // 3. Does currently logged in user match the original application creator?
    var creatorId = app.appliedByUserId || app.submittedByCitizenId;
    return user.id === creatorId;
  }

  // -------------------------------------------------------------------------
  // ROLE-SPECIFIC VERIFICATION CHECKLISTS (Requirement 2)
  // -------------------------------------------------------------------------
  const checklistDefinitions = {
    bo: [
      { id: 'bo_chk_1', text: 'Land Parcha physically verified.' },
      { id: 'bo_chk_2', text: 'Land ownership/details verified against the submitted records.' },
      { id: 'bo_chk_3', text: 'Applicant and land details are correct as per the available records.' },
      { id: 'bo_chk_4', text: 'Plot number verified.' },
      { id: 'bo_chk_5', text: 'Tree species/name verified at the site.' },
      { id: 'bo_chk_6', text: 'Tree details match the application records.' },
      { id: 'bo_chk_7', text: 'Tree location/site physically verified.' },
      { id: 'bo_chk_8', text: 'GPS location and photographs captured, wherever applicable.' },
      { id: 'bo_chk_9', text: 'No discrepancy found during field verification.' }
    ],
    ro: [
      { id: 'ro_chk_1', text: 'Applicant details verified.' },
      { id: 'ro_chk_2', text: 'Land Parcha and land details checked.' },
      { id: 'ro_chk_3', text: 'District, Division, Range and other applicable jurisdiction details verified.' },
      { id: 'ro_chk_4', text: 'BO field verification report reviewed.' },
      { id: 'ro_chk_5', text: 'Tree details checked against the BO verification report.' },
      { id: 'ro_chk_6', text: 'Required documents reviewed.' },
      { id: 'ro_chk_7', text: 'BO discrepancy remarks reviewed.' },
      { id: 'ro_chk_8', text: 'Application details found correct for further processing.' }
    ],
    acf: [
      { id: 'acf_chk_1', text: 'Application details reviewed.' },
      { id: 'acf_chk_2', text: 'Land Parcha verification reviewed.' },
      { id: 'acf_chk_3', text: 'Land and jurisdiction details checked.' },
      { id: 'acf_chk_4', text: 'BO verification report reviewed.' },
      { id: 'acf_chk_5', text: 'RO verification and remarks reviewed.' },
      { id: 'acf_chk_6', text: 'Tree details and applicable quantity checked.' },
      { id: 'acf_chk_7', text: 'Required supporting documents verified.' },
      { id: 'acf_chk_8', text: 'Discrepancies reviewed and resolved, wherever applicable.' }
    ]
  };

  function saveRoleChecklist(appNo, role, checklistData) {
    var curApp = getApplicationByNo(appNo);
    if (!curApp) return null;

    var todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    var checklists = Object.assign({}, curApp.checklists || {});

    checklists[role] = {
      role: role.toUpperCase(),
      roleTitle: role === 'bo' ? 'Block Officer (BO)' : (role === 'ro' ? 'Range Officer (RO)' : 'Assistant Conservator of Forests (ACF)'),
      officerName: checklistData.officerName || 'Officer',
      officerId: checklistData.officerId || '',
      submissionDate: todayStr,
      selectedItems: checklistData.selectedItems || [],
      additionalRemarks: checklistData.additionalRemarks || '',
      discrepancyRemarks: checklistData.discrepancyRemarks || '',
      hasDiscrepancy: !!checklistData.hasDiscrepancy
    };

    var patch = {
      checklists: checklists,
      lastUpdatedDate: todayStr
    };

    if (checklistData.discrepancyRemarks) {
      patch.discrepancyRemarks = checklistData.discrepancyRemarks;
    }

    return updateApplication(appNo, patch);
  }

  // -------------------------------------------------------------------------
  // BO ASSIGNMENT CONFLICT DETECTION (Requirement 3)
  // -------------------------------------------------------------------------
  function parseDateToIso(dateStr) {
    if (!dateStr) return '';
    if (typeof dateStr !== 'string') return '';
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
    try {
      var d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        var y = d.getFullYear();
        var m = String(d.getMonth() + 1).padStart(2, '0');
        var day = String(d.getDate()).padStart(2, '0');
        return y + '-' + m + '-' + day;
      }
    } catch (e) { }
    return dateStr;
  }

  function checkBoAssignmentConflict(boId, selectedDate, excludeAppNo) {
    if (!boId || !selectedDate) return null;
    var targetIso = parseDateToIso(selectedDate);
    var all = getAllApplications();

    return all.find(function (a) {
      if (a.appNo === excludeAppNo) return false;
      if (a.assignedBoId !== boId) return false;
      if (a.currentStatus === 'Rejected' || a.currentStatus === 'Cancelled') return false;
      if (!a.verificationDate) return false;
      var aIso = parseDateToIso(a.verificationDate);
      return aIso === targetIso || a.verificationDate === selectedDate;
    }) || null;
  }

  // -------------------------------------------------------------------------
  // THIRD-PARTY LAND PARCHA API MOCK ADAPTER (Requirement 4)
  // -------------------------------------------------------------------------
  function fetchLandParchaRecordMock(district, range, block, plotNo) {
    var pUpper = (plotNo || '').toUpperCase();
    var isSimulatedMismatch = pUpper.includes('MISMATCH') || pUpper.includes('999');
    var isSimulatedNotFound = pUpper.includes('NOTFOUND') || pUpper.includes('000');

    if (isSimulatedNotFound) {
      return {
        status: 'NOT_FOUND',
        message: 'No revenue land record found for Plot No. ' + plotNo + ' in ' + block + ', ' + district + '.',
        source: 'Sikkim Land Revenue & Disaster Management Department (Land Records Gateway - Simulated Demonstration Adapter)'
      };
    }

    return {
      status: 'SUCCESS',
      khasraPlotNo: plotNo || '104/A',
      district: district || 'Gangtok',
      revenueBlock: block || 'Ranka GPU',
      forestRange: range || 'Ranipool Range',
      khatiyanParchaNo: 'KP-2024-' + (block ? block.substring(0, 3).toUpperCase() : 'RNK') + '-0' + Math.floor(100 + Math.random() * 900),
      recordedOwner: isSimulatedMismatch ? 'Dorjee Tshering Lepcha (Mismatch Record)' : 'Citizen Demo User (Primary)',
      fatherSpouseName: isSimulatedMismatch ? 'Late Sonam Lepcha' : 'Guardian Demo Record A',
      totalAreaAcres: '1.45 Acres (Dry Cultivation)',
      landClassification: 'Private Holding / Dry Field',
      encumbranceStatus: isSimulatedMismatch ? 'Boundary Dispute / Revenue Caveat Noted' : 'Nil / Freehold Clean Title',
      subDivision: 'Gangtok Sub-Division',
      sourceGateway: 'Sikkim Land Revenue Gateway (Mock Third-Party API Demonstration)'
    };
  }

  function saveLandParchaVerification(appNo, outcomeData) {
    var curApp = getApplicationByNo(appNo);
    if (!curApp) return null;

    var todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    var historyItem = {
      stage: 'Land Parcha Verified',
      date: todayStr,
      actor: outcomeData.officerName + ' (' + outcomeData.officerRole + ')',
      remarks: 'Land Parcha API verification outcome: ' + outcomeData.outcome + (outcomeData.discrepancyCategory ? ' [' + outcomeData.discrepancyCategory + ']' : '') + (outcomeData.remarks ? ' - ' + outcomeData.remarks : '')
    };

    var patch = {
      landParchaVerification: Object.assign({
        verifiedDate: todayStr
      }, outcomeData),
      lastUpdatedDate: todayStr,
      history: (curApp.history || []).concat([historyItem])
    };

    return updateApplication(appNo, patch);
  }


  // =========================================================================
  // STAGE 04 & STAGE 05 VERIFICATION & DOCUMENT HELPERS
  // =========================================================================

  function renderChecklistsHtml(app) {
    if (!app || !app.checklists || Object.keys(app.checklists).length === 0) {
      return '<div class="text-muted small p-2 bg-light rounded border">No officer verification checklists recorded yet.</div>';
    }
    var html = '<div class="d-flex flex-column gap-2.5">';
    var roleOrder = ['bo', 'ro', 'acf'];
    roleOrder.forEach(function (rKey) {
      var c = app.checklists[rKey];
      if (!c) return;
      var roleColor = rKey === 'bo' ? 'warning' : (rKey === 'ro' ? 'success' : 'primary');
      var itemsHtml = (c.selectedItems || []).map(function (itemText) {
        return '<li class="mb-1 d-flex align-items-start gap-1.5"><i class="bi bi-check-circle-fill text-success mt-0.5 small"></i><span>' + itemText + '</span></li>';
      }).join('');
      if (!itemsHtml) itemsHtml = '<li class="text-muted">No items checked.</li>';

      html +=
        '<div class="card border border-' + roleColor + '-subtle shadow-xs bg-white rounded-2 overflow-hidden">' +
        '<div class="card-header bg-' + roleColor + '-subtle py-1.5 px-3 d-flex justify-content-between align-items-center flex-wrap gap-2">' +
        '<div class="small fw-bold text-dark"><i class="bi bi-person-check-fill text-' + roleColor + ' me-1"></i>' + c.roleTitle + ' Checklist Verification</div>' +
        '<span class="badge bg-white text-dark border small">' + c.submissionDate + '</span>' +
        '</div>' +
        '<div class="card-body p-2.5 small">' +
        '<div class="d-flex justify-content-between align-items-center mb-2 pb-1 border-bottom text-muted" style="font-size:0.75rem;">' +
        '<span>Verifying Officer: <strong class="text-dark">' + c.officerName + '</strong> (' + c.role + ')</span>' +
        (c.hasDiscrepancy ? '<span class="badge bg-danger text-white">Discrepancy Reported</span>' : '<span class="badge bg-success text-white">Fully Verified</span>') +
        '</div>' +
        '<div class="mb-2"><strong class="text-secondary d-block mb-1" style="font-size:0.75rem;">Completed Verification Points (' + (c.selectedItems || []).length + '):</strong><ul class="list-unstyled mb-0 ps-1" style="font-size:0.78rem;">' + itemsHtml + '</ul></div>' +
        (c.additionalRemarks ? '<div class="p-1.5 bg-light rounded border mb-1.5"><span class="text-muted fw-semibold d-block" style="font-size:0.72rem;">Additional Remarks:</span><div class="text-dark">' + c.additionalRemarks + '</div></div>' : '') +
        (c.discrepancyRemarks ? '<div class="p-1.5 bg-danger-subtle rounded border border-danger-subtle"><span class="text-danger fw-semibold d-block" style="font-size:0.72rem;"><i class="bi bi-exclamation-triangle-fill me-1"></i>Discrepancy Remarks:</span><div class="text-danger-emphasis">' + c.discrepancyRemarks + '</div></div>' : '') +
        '</div>' +
        '</div>';
    });
    html += '</div>';
    return html;
  }

  function renderLandParchaHtml(app) {
    if (!app || !app.landParchaVerification) {
      return '<div class="p-2 bg-light rounded border small d-flex justify-content-between align-items-center flex-wrap gap-2"><span class="text-muted">Land Parcha / Khatiyan Verification:</span><span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle"><i class="bi bi-clock-history me-1"></i> Pending Revenue API Verification</span></div>';
    }
    var v = app.landParchaVerification;
    var badgeClass = 'bg-success-subtle text-success border border-success-subtle';
    var icon = 'bi-check-circle-fill';
    if (v.outcome === 'Mismatch Found') {
      badgeClass = 'bg-danger-subtle text-danger border border-danger-subtle';
      icon = 'bi-exclamation-octagon-fill';
    } else if (v.outcome === 'Unable to Verify / No Record Found') {
      badgeClass = 'bg-secondary-subtle text-secondary border border-secondary-subtle';
      icon = 'bi-question-circle-fill';
    }

    return '<div class="p-2.5 rounded border small ' + (v.outcome === 'Mismatch Found' ? 'bg-danger-subtle border-danger-subtle' : (v.outcome === 'Verified / Matched' ? 'bg-success-subtle border-success-subtle' : 'bg-light border-secondary-subtle')) + '">' +
      '<div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-1">' +
      '<span class="fw-bold text-dark"><i class="bi bi-bank2 text-success me-1"></i> Land Parcha Third-Party Revenue API Outcome:</span>' +
      '<span class="badge ' + badgeClass + '"><i class="bi ' + icon + ' me-1"></i>' + v.outcome + '</span>' +
      '</div>' +
      '<div class="text-secondary small mb-1">Verified on <strong>' + v.verifiedDate + '</strong> by <strong>' + v.officerName + '</strong> (' + v.officerRole + ') via Sikkim Land Revenue Gateway.</div>' +
      (v.discrepancyCategory ? '<div class="text-danger small mb-1"><strong>Discrepancy Category:</strong> ' + v.discrepancyCategory + '</div>' : '') +
      (v.remarks ? '<div class="p-1.5 bg-white rounded border small mt-1 text-dark"><strong>Officer Remarks:</strong> ' + v.remarks + '</div>' : '') +
      '</div>';
  }

  /**
   * Evaluates if official Certificate can be downloaded by an authorized user
   */
  function canDownloadCertificate(app) {
    if (!app) return false;
    var isPaid = (app.paymentStatus && (app.paymentStatus.includes('Paid') || app.paymentStatus.includes('Completed'))) ||
      (app.currentStatus && (app.currentStatus.includes('Marking Order Issued') || app.currentStatus.includes('Payment Completed')));
    if (!isPaid) return false;
    if (!app.isTransitPermitRequired) return true;
    return app.transitPermitStatus === 'Approved/Issued' || app.transitPermitStatus === 'Transit Permit Issued';
  }

  /**
   * ACF / DFO Action: Issue Transit Permit for approved and paid application
   */
  function issueTransitPermit(appNo, officerName, officerRole, remarks, route) {
    var curApp = getApplicationByNo(appNo);
    if (!curApp) return null;

    var tpNo = 'TP/FED/' + (curApp.range ? curApp.range.substring(0, 3).toUpperCase() : 'GTK') + '/' + new Date().getFullYear() + '/' + Math.floor(100 + Math.random() * 900);
    var todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    var historyItem = {
      stage: 'Transit Permit Issued',
      date: todayStr,
      actor: (officerName || 'ACF / DFO Desk') + ' (' + (officerRole || 'Department Officer') + ')',
      remarks: 'Transit Permit ' + tpNo + ' issued for felling material movement. Route: ' + (route || 'Approved Corridor') + '. Remarks: ' + (remarks || 'Cleared for movement.')
    };

    var patch = {
      transitPermitNo: tpNo,
      transitPermitStatus: 'Approved/Issued',
      transitPermitIssueDate: todayStr,
      transitPermitOfficer: (officerName || 'ACF / DFO Desk') + ' (' + (officerRole || 'Competent Authority') + ')',
      transitPermitRoute: route || 'Approved transit corridor within Sikkim',
      transitPermitRemarks: remarks || 'Material movement authorized as per statutory felling rules.',
      lastUpdatedDate: todayStr,
      currentStatus: 'Marking Order Issued',
      history: (curApp.history || []).concat([historyItem])
    };

    return updateApplication(appNo, patch);
  }

  function openIssueTransitPermitModal(appNo, onComplete) {
    var app = getApplicationByNo(appNo);
    if (!app) return;

    var modalEl = document.getElementById('sharedIssueTransitPermitModal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.className = 'modal fade';
      modalEl.id = 'sharedIssueTransitPermitModal';
      modalEl.tabIndex = -1;
      modalEl.setAttribute('aria-hidden', 'true');
      document.body.appendChild(modalEl);
    }

    modalEl.innerHTML =
      '<div class="modal-dialog modal-dialog-centered">' +
      '<div class="modal-content border-0 shadow-lg">' +
      '<div class="modal-header text-white py-3" style="background: linear-gradient(135deg, #114b3f 0%, #0d382f 100%);">' +
      '<div class="d-flex align-items-center gap-2">' +
      '<i class="bi bi-truck fs-4 text-warning"></i>' +
      '<div>' +
      '<h5 class="modal-title fw-bold mb-0">Issue Official Transit Permit</h5>' +
      '<div class="small text-white-50">Forest &amp; Environment Department &bull; Movement Clearance</div>' +
      '</div>' +
      '</div>' +
      '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>' +
      '</div>' +
      '<div class="modal-body p-3 bg-light">' +
      '<div class="card border-0 shadow-xs p-3 bg-white mb-3">' +
      '<div class="d-flex justify-content-between align-items-center mb-1">' +
      '<span class="text-muted small">Application Number:</span>' +
      '<strong class="font-monospace text-primary">' + app.appNo + '</strong>' +
      '</div>' +
      '<div class="d-flex justify-content-between align-items-center mb-1">' +
      '<span class="text-muted small">Applicant Name:</span>' +
      '<strong class="text-dark">' + app.applicantName + '</strong>' +
      '</div>' +
      '<div class="d-flex justify-content-between align-items-center mb-1">' +
      '<span class="text-muted small">Approved Trees:</span>' +
      '<strong class="text-dark">' + (app.trees ? app.trees.length : 0) + ' Trees (' + app.purpose + ')</strong>' +
      '</div>' +
      '<div class="d-flex justify-content-between align-items-center">' +
      '<span class="text-muted small">Fee Payment:</span>' +
      '<span class="badge bg-success-subtle text-success border border-success-subtle"><i class="bi bi-check-circle-fill me-1"></i>\u20B950 Paid (Confirmed)</span>' +
      '</div>' +
      '</div>' +

      '<div class="mb-3">' +
      '<label class="form-label small fw-bold text-dark mb-1">Authorized Movement Route / Destination <span class="text-danger">*</span></label>' +
      '<input type="text" class="form-control form-control-sm" id="tpRouteInput" value="' + (app.revenueBlock || app.range) + ' to Nearest Registered Sawmill via NH-10" placeholder="e.g. Ranka GPU to Ranipool Sawmill via NH-10">' +
      '<div class="text-muted" style="font-size:0.75rem;">Specify the highway transit corridor and designated timber destination.</div>' +
      '</div>' +

      '<div class="mb-3">' +
      '<label class="form-label small fw-bold text-dark mb-1">Authorizing Officer Remarks <span class="text-danger">*</span></label>' +
      '<textarea class="form-control form-control-sm" id="tpOfficerRemarks" rows="2" placeholder="Remarks regarding vehicle inspection, hammer marking verification, and transit validity.">Transit Permit granted for timber transport. All logs must carry statutory hammer mark prior to transit.</textarea>' +
      '</div>' +

      '<div class="alert alert-success border-0 py-2 px-3 small mb-0 d-flex align-items-center gap-2">' +
      '<i class="bi bi-shield-check text-success fs-4"></i>' +
      '<div><strong>Issuance Effect:</strong> Issuing this Transit Permit will assign an official TP number and immediately unlock the <strong>Download Certificate</strong> action for both citizen and departmental officers.</div>' +
      '</div>' +
      '</div>' +
      '<div class="modal-footer bg-white d-flex justify-content-between">' +
      '<button type="button" class="btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>' +
      '<button type="button" class="btn btn-sm btn-gov-primary px-3 py-1.5 fw-bold" id="btnConfirmIssueTP">' +
      '<i class="bi bi-truck me-1"></i> Confirm &amp; Issue Transit Permit' +
      '</button>' +
      '</div>' +
      '</div>' +
      '</div>';

    var bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();

    var btnConfirm = document.getElementById('btnConfirmIssueTP');
    if (btnConfirm) {
      btnConfirm.onclick = function () {
        btnConfirm.disabled = true;
        btnConfirm.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Issuing...';

        var route = document.getElementById('tpRouteInput').value.trim();
        var remarks = document.getElementById('tpOfficerRemarks').value.trim();
        var activeUser = getActiveUser();

        setTimeout(function () {
          var patch = issueTransitPermit(appNo, activeUser.name, activeUser.role, remarks, route);
          bsModal.hide();
          alert('Transit Permit Issued Successfully!\n\nTransit Permit Number: ' + patch.transitPermitNo + '\nValidity: 15 Days\n\nOfficial Certificate Download is now unlocked for all authorized users.');
          if (typeof onComplete === 'function') {
            onComplete(patch);
          } else {
            window.location.reload();
          }
        }, 600);
      };
    }
  }

  function downloadMarkingOrderCertificate(appNo, role) {
    if (window.MarkingOrderDocumentService) {
      MarkingOrderDocumentService.openDocumentModal(appNo, role);
    } else {
      window.open('certificate.html?appNo=' + encodeURIComponent(appNo) + '&role=' + encodeURIComponent(role || 'citizen'), '_blank');
    }
  }

  /**
   * Task 6: Mount Tree Details with 4 Filters (Division, Range, Date Range, Species)
   * while respecting role boundaries.
   * @param {string} containerId - Target DOM element ID
   * @param {Object} options - { role: 'ro'|'bo'|'acf'|'dfo'|'admin', officer: Object }
   */
  function mountTreeDetailsWithFilters(containerId, options) {
    options = options || {};
    var container = document.getElementById(containerId);
    if (!container) return;

    var role = (options.role || 'ro').toLowerCase();
    var officer = options.officer || getActiveUser() || {};

    // Determine role-based division & range constraints
    var lockedDivision = (role === 'ro' || role === 'bo') ? (officer.division || 'Gangtok') : '';
    var lockedRange = (role === 'ro' || role === 'bo') ? (officer.range || 'Ranipool Range') : '';

    // Get all applications
    var allApps = getAllApplications();

    // Helper: Parse date string to Date object
    function parseAppDate(dateStr) {
      if (!dateStr) return null;
      var d = new Date(dateStr);
      if (!isNaN(d.getTime())) return d;
      var parts = dateStr.split(/[\s-]+/);
      if (parts.length === 3) {
        var months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
        var m = months[parts[1].toLowerCase().substring(0, 3)];
        if (m !== undefined) {
          return new Date(parseInt(parts[2], 10), m, parseInt(parts[0], 10));
        }
      }
      return null;
    }

    // Flatten applications to tree items based on base role scope
    function getScopedTrees() {
      var scopedApps = allApps;
      if (role === 'ro') {
        scopedApps = allApps.filter(function (a) {
          var rMatch = !lockedRange || (a.range && a.range.indexOf(lockedRange) !== -1);
          var dMatch = !lockedDivision || (a.division && a.division.indexOf(lockedDivision) !== -1);
          return rMatch || dMatch;
        });
      } else if (role === 'bo') {
        scopedApps = allApps.filter(function (a) {
          return (a.assignedBoId && a.assignedBoId === officer.id) ||
            (!a.assignedBoId && a.range && a.range.indexOf(lockedRange) !== -1);
        });
      } else if (role === 'acf' || role === 'dfo') {
        var divTarget = officer.division || 'Gangtok';
        scopedApps = allApps.filter(function (a) {
          return a.division && a.division.indexOf(divTarget) !== -1;
        });
      }

      var items = [];
      scopedApps.forEach(function (app) {
        if (app.trees && app.trees.length > 0) {
          app.trees.forEach(function (t, idx) {
            items.push({
              appNo: app.appNo,
              markingOrderNo: app.markingOrderNo,
              applicantName: app.applicantName,
              division: app.division || 'Gangtok',
              range: app.range || 'Ranipool Range',
              purpose: app.purpose || 'Timber',
              submittedDate: app.submittedDate,
              approvalDate: app.approvalDate,
              markingOrderIssueDate: app.markingOrderIssueDate,
              treeIndex: idx + 1,
              treeNo: t.treeNo || (idx + 1),
              species: t.species || t.verifiedSpecies || 'Tree',
              gbhFeet: t.gbhFeet || (t.girthInches ? (t.girthInches / 12).toFixed(2) + ' ft' : '3.00 ft'),
              plotNo: t.plotNo || app.khasraNo || '101',
              boMatchStatus: t.boMatchStatus || (t.boVerified ? 'Matched on Site' : 'Pending Verification'),
              boVerified: t.boVerified || false
            });
          });
        }
      });
      return items;
    }

    // Render filter interface HTML
    container.innerHTML =
      '<div class="card border border-light-subtle shadow-xs mb-3 bg-light-subtle">' +
      '<div class="card-body p-3">' +
      '<div class="d-flex align-items-center justify-content-between mb-2">' +
      '<span class="small fw-bold text-dark"><i class="bi bi-funnel text-success me-1"></i> Filter Tree Records</span>' +
      ((role === 'ro' || role === 'bo') ? ('<span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle small"><i class="bi bi-lock-fill me-1"></i> Scope: ' + (officer.range || 'Ranipool Range') + '</span>') : '') +
      '</div>' +
      '<div class="row g-2 align-items-end">' +
      '<div class="col-12 col-sm-6 col-md-3">' +
      '<label class="form-label small fw-semibold text-secondary mb-1">Division</label>' +
      '<select class="form-select form-select-sm" id="' + containerId + '_div"' + (lockedDivision ? ' disabled' : '') + '>' +
      (lockedDivision ? ('<option value="' + lockedDivision + '">' + lockedDivision + '</option>') :
        ('<option value="">All Divisions</option>' +
          '<option value="Gangtok"' + ((officer.division === 'Gangtok' || !officer.division) ? ' selected' : '') + '>Gangtok</option>' +
          '<option value="Mangan"' + (officer.division === 'Mangan' ? ' selected' : '') + '>Mangan</option>' +
          '<option value="Namchi"' + (officer.division === 'Namchi' ? ' selected' : '') + '>Namchi</option>' +
          '<option value="Gyalshing"' + (officer.division === 'Gyalshing' ? ' selected' : '') + '>Gyalshing</option>' +
          '<option value="Pakyong"' + (officer.division === 'Pakyong' ? ' selected' : '') + '>Pakyong</option>' +
          '<option value="Soreng"' + (officer.division === 'Soreng' ? ' selected' : '') + '>Soreng</option>')
      ) +
      '</select>' +
      '</div>' +
      '<div class="col-12 col-sm-6 col-md-3">' +
      '<label class="form-label small fw-semibold text-secondary mb-1">Forest Range</label>' +
      '<select class="form-select form-select-sm" id="' + containerId + '_range"' + (lockedRange ? ' disabled' : '') + '>' +
      '<!-- Dynamic -->' +
      '</select>' +
      '</div>' +
      '<div class="col-6 col-md-2">' +
      '<label class="form-label small fw-semibold text-secondary mb-1">From Date</label>' +
      '<input type="date" class="form-control form-control-sm" id="' + containerId + '_from">' +
      '</div>' +
      '<div class="col-6 col-md-2">' +
      '<label class="form-label small fw-semibold text-secondary mb-1">To Date</label>' +
      '<input type="date" class="form-control form-control-sm" id="' + containerId + '_to">' +
      '</div>' +
      '<div class="col-12 col-md-2">' +
      '<label class="form-label small fw-semibold text-secondary mb-1">Tree Species</label>' +
      '<select class="form-select form-select-sm" id="' + containerId + '_species">' +
      '<option value="">All Species</option>' +
      '<option value="Utis">Utis (Alnus)</option>' +
      '<option value="Chilaune">Chilaune (Schima)</option>' +
      '<option value="Katus">Katus (Castanopsis)</option>' +
      '<option value="Pipli">Pipli</option>' +
      '<option value="Dhupi">Dhupi (Cryptomeria)</option>' +
      '<option value="Tooni">Tooni</option>' +
      '<option value="Panisaj">Panisaj</option>' +
      '<option value="Sauer">Sauer</option>' +
      '</select>' +
      '</div>' +
      '<div class="col-12 d-flex justify-content-end gap-2 mt-2 pt-1 border-top border-light-subtle">' +
      '<button type="button" class="btn btn-sm btn-outline-secondary" id="' + containerId + '_clearBtn">' +
      '<i class="bi bi-arrow-counterclockwise me-1"></i> Clear Filters' +
      '</button>' +
      '<button type="button" class="btn btn-sm btn-gov-primary fw-semibold" id="' + containerId + '_applyBtn">' +
      '<i class="bi bi-funnel-fill me-1"></i> Apply Filters' +
      '</button>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="d-flex justify-content-between align-items-center mb-2 px-1">' +
      '<span class="small text-muted" id="' + containerId + '_summary"></span>' +
      '</div>' +
      '<div class="table-responsive" id="' + containerId + '_table"></div>';

    var divSelect = document.getElementById(containerId + '_div');
    var rangeSelect = document.getElementById(containerId + '_range');
    var fromInput = document.getElementById(containerId + '_from');
    var toInput = document.getElementById(containerId + '_to');
    var speciesSelect = document.getElementById(containerId + '_species');
    var clearBtn = document.getElementById(containerId + '_clearBtn');
    var applyBtn = document.getElementById(containerId + '_applyBtn');
    var summaryEl = document.getElementById(containerId + '_summary');
    var tableEl = document.getElementById(containerId + '_table');

    function updateRangeOptions() {
      if (lockedRange) {
        rangeSelect.innerHTML = '<option value="' + lockedRange + '">' + lockedRange + '</option>';
        return;
      }
      var selectedDiv = divSelect ? divSelect.value : '';
      var ranges = [];
      if (!selectedDiv) {
        ranges = rangesMaster;
      } else {
        ranges = rangesMaster.filter(function (r) {
          return r.division.toLowerCase() === selectedDiv.toLowerCase() ||
            selectedDiv.toLowerCase().indexOf(r.division.toLowerCase()) !== -1;
        });
      }
      var opts = '<option value="">All Ranges</option>';
      ranges.forEach(function (r) {
        opts += '<option value="' + r.name + '">' + r.name + '</option>';
      });
      rangeSelect.innerHTML = opts;
    }

    if (divSelect && !lockedDivision) {
      divSelect.addEventListener('change', updateRangeOptions);
    }
    updateRangeOptions();

    function applyFilter() {
      var allScoped = getScopedTrees();
      var fDiv = divSelect ? divSelect.value.toLowerCase() : '';
      var fRange = rangeSelect ? rangeSelect.value.toLowerCase() : '';
      var fFrom = fromInput ? fromInput.value : '';
      var fTo = toInput ? toInput.value : '';
      var fSpecies = speciesSelect ? speciesSelect.value.toLowerCase() : '';

      var fromDate = fFrom ? new Date(fFrom + 'T00:00:00') : null;
      var toDate = fTo ? new Date(fTo + 'T23:59:59') : null;

      var filtered = allScoped.filter(function (item) {
        if (fDiv && item.division.toLowerCase().indexOf(fDiv) === -1) return false;
        if (fRange && item.range.toLowerCase().indexOf(fRange) === -1) return false;
        if (fSpecies && item.species.toLowerCase().indexOf(fSpecies) === -1) return false;
        if (fromDate || toDate) {
          var itemDate = parseAppDate(item.markingOrderIssueDate || item.submittedDate);
          if (itemDate) {
            if (fromDate && itemDate < fromDate) return false;
            if (toDate && itemDate > toDate) return false;
          }
        }
        return true;
      });

      var filterActive = Boolean(fSpecies || fFrom || fTo || (!lockedRange && fRange) || (!lockedDivision && fDiv));
      var uniqueAppCount = (new Set(filtered.map(function (x) { return x.appNo; }))).size;
      summaryEl.innerHTML = 'Showing <strong>' + filtered.length + '</strong> tree record' + (filtered.length === 1 ? '' : 's') +
        ' across <strong>' + uniqueAppCount + '</strong> application' + (uniqueAppCount === 1 ? '' : 's') +
        (filterActive ? ' <span class="badge bg-success-subtle text-success border border-success-subtle ms-1"><i class="bi bi-check-circle me-1"></i>Filtered</span>' : '');

      if (filtered.length === 0) {
        tableEl.innerHTML = '<div class="p-4 text-center text-muted small bg-white rounded border"><i class="bi bi-info-circle me-1"></i> No tree records match the selected filter criteria. Try clearing or broadening the filter options.</div>';
        return;
      }

      var rows = '';
      filtered.forEach(function (t) {
        var moCol = t.markingOrderNo ?
          ('<strong class="font-monospace text-success">' + t.markingOrderNo + '</strong>') :
          ('<span class="text-muted small">&ndash;</span>');

        var matchBadge = '';
        if (t.boMatchStatus === 'Matched on Site') {
          matchBadge = '<span class="badge bg-success-subtle text-success border border-success-subtle"><i class="bi bi-check2 me-1"></i>Matched on Site</span>';
        } else if (t.boMatchStatus === 'Discrepancy Noted') {
          matchBadge = '<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle"><i class="bi bi-exclamation-triangle me-1"></i>Discrepancy Noted</span>';
        } else {
          matchBadge = '<span class="badge bg-light text-secondary border">' + t.boMatchStatus + '</span>';
        }

        var purposeBadge = t.purpose === 'Firewood' ?
          '<span class="badge bg-danger-subtle text-danger border border-danger-subtle">Firewood</span>' :
          '<span class="badge bg-primary-subtle text-primary border border-primary-subtle">Timber</span>';

        rows += '<tr>' +
          '<td class="font-monospace fw-bold">' +
          '<a href="javascript:void(0)" onclick="MarkingOrderData.openApplicationDetailModal(\'' + t.appNo + '\')" class="text-decoration-none" title="View application details">' + t.appNo + '</a>' +
          '</td>' +
          '<td class="text-nowrap">' + moCol + '</td>' +
          '<td>' + t.applicantName + '</td>' +
          '<td>' + t.range + '<br><small class="text-muted">' + t.division + '</small></td>' +
          '<td>' + purposeBadge + '</td>' +
          '<td><span class="fw-semibold">Tree #' + t.treeNo + '</span> &bull; ' + t.species + '</td>' +
          '<td class="font-monospace">' + t.plotNo + '</td>' +
          '<td>' + t.gbhFeet + '</td>' +
          '<td>' + matchBadge + '</td>' +
          '</tr>';
      });

      tableEl.innerHTML = '<table class="table table-sm table-bordered align-middle small mb-0 bg-white">' +
        '<thead class="table-light"><tr>' +
        '<th>Application No.</th>' +
        '<th>Marking Order No.</th>' +
        '<th>Applicant Name</th>' +
        '<th>Range / Division</th>' +
        '<th>Purpose</th>' +
        '<th>Tree Species &amp; No.</th>' +
        '<th>Plot / Khasra</th>' +
        '<th>GBH (Feet)</th>' +
        '<th>Field Verification Status</th>' +
        '</tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
        '</table>';
    }

    if (applyBtn) {
      applyBtn.addEventListener('click', applyFilter);
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (!lockedDivision && divSelect) divSelect.value = (officer.division || '');
        updateRangeOptions();
        if (fromInput) fromInput.value = '';
        if (toInput) toInput.value = '';
        if (speciesSelect) speciesSelect.value = '';
        applyFilter();
      });
    }

    applyFilter();
  }

  return {
    statutoryLimits: statutoryLimits,
    evaluateAuthority: evaluateAuthority,
    districtsMaster: districtsMaster,
    divisionsMaster: divisionsMaster,
    rangesMaster: rangesMaster,
    treeSpeciesMaster: treeSpeciesMaster,
    purposeMaster: purposeMaster,
    demoUsers: demoUsers,
    getAllDemoUsers: getAllDemoUsers,
    applications: applications,
    citizenScenarios: citizenScenarios,
    notifications: notifications,
    getAllApplications: getAllApplications,
    getApplicationByNo: getApplicationByNo,
    saveCustomApplication: saveCustomApplication,
    updateApplication: updateApplication,
    getDraft: getDraft,
    saveDraft: saveDraft,
    clearDraft: clearDraft,
    openPaymentModal: openPaymentModal,
    getStatusBadgeHtml: getStatusBadgeHtml,
    buildWorkflowTrackerHtml: buildWorkflowTrackerHtml,
    openApplicationDetailModal: openApplicationDetailModal,
    openApplicationTrackingModal: openApplicationTrackingModal,
    openStagePlaceholderModal: openStagePlaceholderModal,
    initDashboardCommon: initDashboardCommon,
    // Stage 04 Workflow Engine
    getPlotVerifications: getPlotVerifications,
    savePlotVerification: savePlotVerification,
    areAllPlotsVerified: areAllPlotsVerified,
    roScheduleVerification: roScheduleVerification,
    roCorrectJurisdiction: roCorrectJurisdiction,
    roReturnApplication: roReturnApplication,
    boSubmitVerificationReport: boSubmitVerificationReport,
    roApproveOrForward: roApproveOrForward,
    acfApproveOrForward: acfApproveOrForward,
    dfoApproveOrReject: dfoApproveOrReject,
    dfoCancelMarkingOrder: dfoCancelMarkingOrder,
    dfoSendDelayAlert: dfoSendDelayAlert,
    getDelayedApplications: getDelayedApplications,
    issueMarkingOrder: issueMarkingOrder,
    // Stage 04 Additional Requirements
    getActiveUser: getActiveUser,
    setActiveUser: setActiveUser,
    canUserPayForApplication: canUserPayForApplication,
    checklistDefinitions: checklistDefinitions,
    saveRoleChecklist: saveRoleChecklist,
    checkBoAssignmentConflict: checkBoAssignmentConflict,
    fetchLandParchaRecordMock: fetchLandParchaRecordMock,
    saveLandParchaVerification: saveLandParchaVerification,
    // Stage 04 & Stage 05 Deliverable Methods
    renderChecklistsHtml: renderChecklistsHtml,
    renderLandParchaHtml: renderLandParchaHtml,
    canDownloadCertificate: canDownloadCertificate,
    issueTransitPermit: issueTransitPermit,
    openIssueTransitPermitModal: openIssueTransitPermitModal,
    downloadMarkingOrderCertificate: downloadMarkingOrderCertificate,
    mountTreeDetailsWithFilters: mountTreeDetailsWithFilters
  };

  // Global window aliases for seamless inline onclick access
  window.openApplicationDetailModal = openApplicationDetailModal;
  window.openApplicationTrackingModal = openApplicationTrackingModal;
  window.downloadMarkingOrderCertificate = downloadMarkingOrderCertificate;
  window.openPaymentModal = openPaymentModal;
  window.mountTreeDetailsWithFilters = mountTreeDetailsWithFilters;
})();
