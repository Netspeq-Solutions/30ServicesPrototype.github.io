/**
 * MOCK DATA & REUSABLE PROTOTYPE DATA STORE
 * Framework: Sikkim Government Services Prototype Framework
 * 
 * Provides mock data for demonstrating citizen and officer workflows
 * without any backend API or database dependencies.
 */

const GovMockData = (() => {
  // Sample Sikkim Government Departments
  const departments = [
    { id: 'lrd', name: 'Land Revenue & Disaster Management Department', theme: 'forest-green' },
    { id: 'fed', name: 'Forest & Environment Department', theme: 'forest-green' },
    { id: 'tcd', name: 'Tourism & Civil Aviation Department', theme: 'saffron-maroon' },
    { id: 'wdd', name: 'Women & Child Development Department', theme: 'default' },
    { id: 'itd', name: 'Information Technology Department', theme: 'royal-navy' },
    { id: 'udd', name: 'Urban Development Department', theme: 'teal' }
  ];

  // Sample Citizen Profile (Sikkim Context)
  const citizenProfile = {
    fullName: 'Tenzing Norbu Lepcha',
    citizenId: 'CIT-SK-882109',
    aadhaarMasked: 'XXXX-XXXX-4921',
    mobile: '9800123456',
    email: 'tenzing.lepcha@example.in',
    district: 'Gangtok',
    subDivision: 'Gangtok Sub-Division',
    address: 'Near Ridge Park, Below Raj Bhawan, Gangtok, Sikkim - 737101'
  };

  // Sample Services across departments
  const sampleServices = [
    {
      id: 'srv-001',
      code: 'SK-LRD-01',
      name: 'Issuance of Sikkim Subject / Certificate of Identification (COI)',
      department: 'Land Revenue & Disaster Management',
      deliveryDays: 15,
      fee: '₹ 50',
      badge: 'G2C High Volume'
    },
    {
      id: 'srv-002',
      code: 'SK-FED-02',
      name: 'Non-Forest Land Verification Certificate',
      department: 'Forest & Environment Department',
      deliveryDays: 21,
      fee: '₹ 200',
      badge: 'Statutory'
    },
    {
      id: 'srv-003',
      code: 'SK-TCD-03',
      name: 'Registration of Homestay / Bed & Breakfast Unit',
      department: 'Tourism & Civil Aviation Department',
      deliveryDays: 14,
      fee: '₹ 500',
      badge: 'Tourism G2B/G2C'
    },
    {
      id: 'srv-004',
      code: 'SK-UDD-04',
      name: 'Trade License Renewal & Fresh Grant',
      department: 'Urban Development Department',
      deliveryDays: 7,
      fee: '₹ 150',
      badge: 'Municipal'
    }
  ];

  // Sample Submitted Applications for Citizen & Officer Views
  const applications = [
    {
      refNo: 'SK-2026-LRD-00412',
      serviceName: 'Certificate of Identification (COI)',
      department: 'Land Revenue & Disaster Management',
      applicantName: 'Tenzing Norbu Lepcha',
      appliedDate: '28 Oct 2026',
      slaDueDate: '12 Nov 2026',
      status: 'UNDER_REVIEW',
      statusText: 'Under Scrutiny',
      currentOfficer: 'Karma Bhutia (Dealing Assistant)',
      district: 'Gangtok',
      timeline: [
        { date: '28 Oct 2026 10:30 AM', title: 'Application Submitted Online', officer: 'Citizen (Portal)', remarks: 'Application and required fees submitted.' },
        { date: '29 Oct 2026 02:15 PM', title: 'Scrutiny Completed', officer: 'Dealing Assistant - Gangtok', remarks: 'Aadhaar, Land Record Extract and Panchayat report verified.' },
        { date: '01 Nov 2026 11:00 AM', title: 'Forwarded for Field Verification', officer: 'Sub-Divisional Magistrate (SDM)', remarks: 'Field verification assigned to Revenue Inspector.' }
      ]
    },
    {
      refNo: 'SK-2026-TCD-00892',
      serviceName: 'Homestay Registration Certificate',
      department: 'Tourism & Civil Aviation Department',
      applicantName: 'Pemba Tshering',
      appliedDate: '15 Oct 2026',
      slaDueDate: '29 Oct 2026',
      status: 'APPROVED',
      statusText: 'Approved & Issued',
      currentOfficer: 'Deputy Director (Tourism)',
      district: 'Namchi',
      timeline: [
        { date: '15 Oct 2026 11:00 AM', title: 'Application Submitted', officer: 'Citizen', remarks: 'Documents attached.' },
        { date: '18 Oct 2026 03:30 PM', title: 'Premises Inspection Completed', officer: 'Tourism Inspector', remarks: 'Facility satisfies minimum tourist standards.' },
        { date: '24 Oct 2026 04:45 PM', title: 'Certificate Generated & Digitally Signed', officer: 'Joint Secretary (Tourism)', remarks: 'Certificate issued with QR code validity.' }
      ]
    },
    {
      refNo: 'SK-2026-FED-00109',
      serviceName: 'Tree Felling Permission on Private Land',
      department: 'Forest & Environment Department',
      applicantName: 'Sunita Sharma',
      appliedDate: '02 Nov 2026',
      slaDueDate: '23 Nov 2026',
      status: 'SUBMITTED',
      statusText: 'Submitted / Pending Scrutiny',
      currentOfficer: 'Range Officer (Forest)',
      district: 'Pakyong',
      timeline: [
        { date: '02 Nov 2026 09:15 AM', title: 'Application Submitted', officer: 'Citizen', remarks: 'Site photographs and parcha patta uploaded.' }
      ]
    },
    {
      refNo: 'SK-2026-UDD-00055',
      serviceName: 'Commercial Water Connection Grant',
      department: 'Urban Development Department',
      applicantName: 'Tenzing Norbu Lepcha',
      appliedDate: '10 Oct 2026',
      slaDueDate: '17 Oct 2026',
      status: 'REJECTED',
      statusText: 'Rejected / Disallowed',
      currentOfficer: 'Assistant Engineer (Water)',
      district: 'Gangtok',
      timeline: [
        { date: '10 Oct 2026 04:00 PM', title: 'Application Submitted', officer: 'Citizen', remarks: 'Submission.' },
        { date: '14 Oct 2026 11:20 AM', title: 'Application Disallowed', officer: 'Executive Officer', remarks: 'Main pipeline feeder capacity reached; fresh line extension required under capital scheme.' }
      ]
    }
  ];

  /**
   * Helper to return CSS class for status badge
   */
  function getStatusBadgeHtml(status) {
    switch (status) {
      case 'DRAFT':
        return '<span class="gov-badge gov-badge-draft"><i class="bi bi-pencil"></i> Draft</span>';
      case 'SUBMITTED':
        return '<span class="gov-badge gov-badge-submitted"><i class="bi bi-clock"></i> Submitted</span>';
      case 'UNDER_REVIEW':
        return '<span class="gov-badge gov-badge-review"><i class="bi bi-hourglass-split"></i> Under Review</span>';
      case 'APPROVED':
        return '<span class="gov-badge gov-badge-approved"><i class="bi bi-check-circle"></i> Approved</span>';
      case 'REJECTED':
        return '<span class="gov-badge gov-badge-rejected"><i class="bi bi-x-circle"></i> Rejected</span>';
      default:
        return `<span class="gov-badge gov-badge-draft">${status}</span>`;
    }
  }

  return {
    departments,
    citizenProfile,
    sampleServices,
    applications,
    getStatusBadgeHtml
  };
})();

