/**
 * STAGE 05: MARKING ORDER CERTIFICATE & DOCUMENT GENERATION SERVICE
 * Service: Marking Order Service
 * Department: Forest and Environment Department, Government of Sikkim
 * Framework: Sikkim G2C Web Services Framework
 * Reference: MO_GTK_RAN_2026-27_006(2).pdf (FORM - D) & Tourism Stage 05 Document Pattern
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'gov_mo_documents';

  const MarkingOrderDocumentService = {
    /**
     * Get document availability status and metadata for an application
     * @param {string} appNo Application Number
     * @returns {object} Document status package
     */
    getDocumentStatus: function (appNo) {
      if (typeof MarkingOrderData === 'undefined') return null;
      const app = MarkingOrderData.getApplicationByNo(appNo);
      if (!app) return null;

      const isPaid = (app.paymentStatus && (app.paymentStatus.includes('Paid') || app.paymentStatus.includes('Completed'))) ||
                     (app.currentStatus && (app.currentStatus.includes('Marking Order Issued') || app.currentStatus.includes('Payment Completed')));
      const isIssued = Boolean(app.markingOrderNo) || app.currentStatus === 'Marking Order Issued';

      // Stage 04 availability condition
      let canDownload = false;
      let statusText = 'Not Available';
      let badgeClass = 'bg-secondary';
      let noticeMessage = '';

      if (app.currentStatus === 'Rejected') {
        statusText = 'Application Rejected';
        badgeClass = 'bg-danger';
        noticeMessage = 'Document generation not permitted for rejected applications.';
      } else if (app.currentStatus === 'Returned for Correction') {
        statusText = 'Returned for Correction';
        badgeClass = 'bg-warning text-dark';
        noticeMessage = 'Document not available while application is under correction.';
      } else if (!isPaid) {
        statusText = 'Awaiting Fee Payment (₹50)';
        badgeClass = 'bg-warning text-dark';
        noticeMessage = 'Payment required to unlock official Marking Order document.';
      } else if (!isIssued) {
        statusText = 'Awaiting Marking Order Issuance';
        badgeClass = 'bg-info text-dark';
        noticeMessage = 'Under departmental issuance processing.';
      } else if (app.isTransitPermitRequired && (app.transitPermitStatus === 'Pending with ACF/DFO' || !app.transitPermitNo)) {
        statusText = 'Transit Permit Action Pending';
        badgeClass = 'bg-warning text-dark';
        noticeMessage = 'Payment completed. Transit Permit action is pending with the concerned department. The certificate will be available for download after the Transit Permit is issued.';
      } else {
        // Unlocked!
        canDownload = true;
        statusText = 'Marking Order FORM - D Available';
        badgeClass = 'bg-success';
      }

      const moNo = app.markingOrderNo || 'Pending';
      const docId = 'DOC-MO-' + (app.appNo.replace(/[^a-zA-Z0-9]/g, '-'));

      const pkg = {
        documentId: docId,
        appNo: app.appNo,
        markingOrderNo: moNo,
        title: 'Official Tree Marking Order (FORM - D)',
        documentType: 'Marking Order (FORM - D)',
        ruleReference: 'See Rule 21',
        applicantName: app.applicantName,
        guardianName: app.relationName || 'N/A',
        district: app.district || 'Gangtok',
        division: app.division || 'Gangtok Territorial Division',
        range: app.range || 'Ranipool Range (T)',
        issueDate: app.markingOrderIssueDate || app.lastUpdatedDate || 'Recent',
        issuingOfficer: app.approvedByRole || 'Range Officer / Competent Issuing Officer',
        isTransitPermitRequired: Boolean(app.isTransitPermitRequired),
        transitPermitNo: app.transitPermitNo || null,
        transitPermitStatus: app.transitPermitStatus || 'Not Required',
        canDownload: canDownload,
        statusText: statusText,
        badgeClass: badgeClass,
        noticeMessage: noticeMessage,
        url: 'certificate.html?appNo=' + encodeURIComponent(app.appNo),
        fileName: 'Marking_Order_' + moNo.replace(/[^a-zA-Z0-9_-]/g, '_') + '.pdf'
      };

      if (canDownload) {
        this.saveDocumentMetadata(app.appNo, pkg);
      }

      return pkg;
    },

    /**
     * Persist document metadata in localStorage
     */
    saveDocumentMetadata: function (appNo, meta) {
      try {
        const store = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        store[appNo] = Object.assign({}, meta, {
          generatedAt: new Date().toISOString(),
          lastAccessed: new Date().toISOString()
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      } catch (e) {
        console.warn('Could not persist document metadata:', e);
      }
    },

    /**
     * Retrieve persisted document metadata from localStorage
     */
    getDocumentMetadata: function (appNo) {
      try {
        const store = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        return store[appNo] || null;
      } catch (e) {
        return null;
      }
    },

    /**
     * Open standalone certificate page in new tab/window
     */
    openMarkingOrder: function (appNo, role) {
      const r = role || 'citizen';
      const status = this.getDocumentStatus(appNo);
      if (!status || !status.canDownload) {
        const msg = status ? status.noticeMessage : 'Application record not eligible for document download.';
        alert('Document Access Restricted:\n\n' + msg);
        return;
      }
      window.open('certificate.html?appNo=' + encodeURIComponent(appNo) + '&role=' + encodeURIComponent(r), '_blank');
    },

    /**
     * Open embedded modal document viewer with iframe
     */
    openDocumentModal: function (appNo, role) {
      const r = role || 'citizen';
      const status = this.getDocumentStatus(appNo);
      if (!status || !status.canDownload) {
        const msg = status ? status.noticeMessage : 'Application record not eligible for document download.';
        alert('Document Access Restricted:\n\n' + msg);
        return;
      }

      let modalEl = document.getElementById('modalMarkingOrderViewer');
      let iframeEl = document.getElementById('markingOrderViewerIframe');
      let titleEl = document.getElementById('markingOrderViewerTitle');
      let printBtn = document.getElementById('moViewerPrintBtn');
      let extBtn = document.getElementById('moViewerExternalBtn');

      const src = 'certificate.html?appNo=' + encodeURIComponent(appNo) + '&role=' + encodeURIComponent(r);

      if (!modalEl) {
        modalEl = document.createElement('div');
        modalEl.className = 'modal fade';
        modalEl.id = 'modalMarkingOrderViewer';
        modalEl.tabIndex = -1;
        modalEl.setAttribute('aria-hidden', 'true');
        modalEl.innerHTML =
          '<div class="modal-dialog modal-dialog-centered modal-xl" style="max-width: 900px;">' +
            '<div class="modal-content border-0 shadow-lg">' +
              '<div class="modal-header py-2.5 bg-dark text-white d-flex justify-content-between align-items-center">' +
                '<div class="d-flex align-items-center gap-2">' +
                  '<i class="bi bi-file-earmark-check-fill text-success fs-5"></i>' +
                  '<span class="fw-bold small" id="markingOrderViewerTitle">Official Marking Order (FORM - D)</span>' +
                '</div>' +
                '<div class="d-flex align-items-center gap-2">' +
                  '<button type="button" class="btn btn-xs btn-outline-light" id="moViewerExternalBtn"><i class="bi bi-box-arrow-up-right me-1"></i> Open in New Tab</button>' +
                  '<button type="button" class="btn btn-xs btn-success fw-bold" id="moViewerPrintBtn"><i class="bi bi-printer-fill me-1"></i> Print / Save PDF</button>' +
                  '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>' +
                '</div>' +
              '</div>' +
              '<div class="modal-body p-0" style="background:#475569;">' +
                '<iframe id="markingOrderViewerIframe" style="width:100%; height:750px; border:none; display:block;" title="Official Marking Order Document"></iframe>' +
              '</div>' +
            '</div>' +
          '</div>';
        document.body.appendChild(modalEl);

        iframeEl = document.getElementById('markingOrderViewerIframe');
        titleEl = document.getElementById('markingOrderViewerTitle');
        printBtn = document.getElementById('moViewerPrintBtn');
        extBtn = document.getElementById('moViewerExternalBtn');
      }

      iframeEl.src = src;
      if (titleEl) {
        titleEl.innerHTML = 'Official Marking Order (FORM - D) &bull; <span class="font-monospace text-warning">' + (status.markingOrderNo || appNo) + '</span>';
      }
      if (extBtn) {
        extBtn.onclick = function () { window.open(src, '_blank'); };
      }
      if (printBtn) {
        printBtn.onclick = function () {
          try {
            iframeEl.contentWindow.print();
          } catch (e) {
            window.open(src, '_blank');
          }
        };
      }

      const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
      bsModal.show();
    },

    /**
     * Download Marking Order PDF
     */
    downloadMarkingOrder: function (appNo, role) {
      this.openMarkingOrder(appNo, role);
    },

    /**
     * Print Marking Order directly
     */
    printMarkingOrder: function (appNo, role) {
      this.openDocumentModal(appNo, role);
    }
  };

  window.MarkingOrderDocumentService = MarkingOrderDocumentService;

})(window);
