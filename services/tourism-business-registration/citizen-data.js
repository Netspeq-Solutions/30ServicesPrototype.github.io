/**
 * UNIFIED DATA ADAPTER (SINGLE SOURCE OF TRUTH OVER WorkflowEngine)
 * Service: Travel Agent / Tour Operator, Dealer, Outdoor Photographer Services
 * Department: Tourism & Civil Aviation Department, Government of Sikkim
 *
 * All citizen & departmental views read directly from persisted WorkflowEngine storage.
 * Zero independent/hardcoded duplicate application copies are maintained here.
 */

(function (window) {
  'use strict';

  const TourismBusinessData = {
    serviceName: 'Travel Agent / Tour Operator, Dealer, Outdoor Photographer Services',

    citizen: {
      fullName: 'Tenzing Norbu Lepcha',
      citizenId: 'CIT-SK-2026-4412',
      district: 'Gangtok',
      mobile: '9832011223',
      email: 'citizen.applicant@sikkim.in',
      applicantType: 'Registered Business / Individual Applicant',
      address: 'Development Area, Gangtok, Sikkim – 737101'
    },

    // Kept lightweight for backwards compatibility; reads purely from WorkflowEngine
    scenarios: {
      live: {
        id: 'live',
        name: 'Live Persisted Citizen Queue',
        badge: 'Single Source of Truth',
        description: 'Live citizen view synchronized in real time with TO, IA, and DTO desks.'
      }
    },

    getAllApplications: function () {
      if (window.WorkflowEngine && typeof window.WorkflowEngine.getAllApplications === 'function') {
        return window.WorkflowEngine.getAllApplications();
      }
      return [];
    },

    getApplicationsByRole: function (role, districtFilter) {
      const list = this.getAllApplications();
      return list.filter(app => {
        const roleMatch = (!role || role === 'ALL' || (app.assignedRole || '').toUpperCase() === role.toUpperCase());
        const distMatch = (!districtFilter || districtFilter.toUpperCase() === 'ALL' || (app.district || '').toLowerCase() === districtFilter.toLowerCase());
        return roleMatch && distMatch;
      });
    },

    getApplication: function (refNo) {
      if (window.WorkflowEngine && typeof window.WorkflowEngine.getApplication === 'function') {
        return window.WorkflowEngine.getApplication(refNo);
      }
      return null;
    }
  };

  window.TourismBusinessData = TourismBusinessData;
  window.TourismCitizenData = TourismBusinessData;

})(typeof window !== 'undefined' ? window : this);
