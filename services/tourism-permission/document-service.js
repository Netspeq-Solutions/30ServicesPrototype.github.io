/**
 * STAGE 06: DOCUMENT & CERTIFICATE GENERATION SERVICE
 * Service: Tourism Permission
 * Department: Tourism & Civil Aviation Department, Government of Sikkim
 * Framework: Sikkim G2C Web Services Framework
 */

(function (window) {
  'use strict';

  const DocumentService = {
    /**
     * Get document availability status and metadata for an application
     * @param {string} refNo Application Reference Number (ARN)
     * @returns {object} Document package containing HQ sheet and Permission Letter states
     */
    getDocumentStatus: function (refNo) {
      if (typeof WorkflowEngine !== 'undefined' && WorkflowEngine.getDocumentPackage) {
        return WorkflowEngine.getDocumentPackage(refNo);
      }

      // Fallback
      return {
        refNo: refNo,
        approvalSheet: {
          applicable: true,
          uploaded: true,
          title: 'HQ Departmental Approval Sheet',
          statusText: 'Available for View / Download',
          badgeClass: 'bg-success',
          canDownload: true,
          url: `approval-sheet.html?arn=${encodeURIComponent(refNo)}`
        },
        permissionLetter: {
          available: true,
          permissionNumber: `SK-TOUR-2026-TRE-${refNo.split('-').pop()}`,
          title: 'Official Tourism Permission Letter',
          statusText: 'Issued by District Tourism Officer',
          badgeClass: 'bg-success',
          canDownload: true,
          url: `permission-letter.html?arn=${encodeURIComponent(refNo)}`
        }
      };
    },

    /**
     * Open standalone permission letter in new tab/window
     */
    openPermissionLetter: function (refNo, role) {
      const r = role || 'citizen';
      window.open(`permission-letter.html?arn=${encodeURIComponent(refNo)}&role=${encodeURIComponent(r)}`, '_blank');
    },

    /**
     * Open standalone HQ approval sheet in new tab/window
     */
    openApprovalSheet: function (refNo, role) {
      const r = role || 'citizen';
      window.open(`approval-sheet.html?arn=${encodeURIComponent(refNo)}&role=${encodeURIComponent(r)}`, '_blank');
    },

    /**
     * Open embedded modal document viewer
     * @param {string} docType 'permission' or 'approval_sheet'
     * @param {string} refNo Application ARN
     * @param {string} role User role ('citizen', 'dto', 'hq')
     */
    openDocumentModal: function (docType, refNo, role) {
      const r = role || 'citizen';
      const modalEl = document.getElementById('modalDocViewer');
      const iframeEl = document.getElementById('docViewerIframe');
      const titleEl = document.getElementById('docViewerTitle');
      const extBtn = document.getElementById('docViewerExternalBtn');
      const printBtn = document.getElementById('docViewerPrintBtn');

      if (!modalEl || !iframeEl) {
        // Fallback to opening in new window if modal not present on page
        if (docType === 'approval_sheet') {
          this.openApprovalSheet(refNo, r);
        } else {
          this.openPermissionLetter(refNo, r);
        }
        return;
      }

      let src = '';
      let title = '';

      if (docType === 'approval_sheet') {
        src = `approval-sheet.html?arn=${encodeURIComponent(refNo)}&role=${encodeURIComponent(r)}`;
        title = `Headquarters Approval Sheet &bull; ${refNo}`;
      } else {
        src = `permission-letter.html?arn=${encodeURIComponent(refNo)}&role=${encodeURIComponent(r)}`;
        title = `Official Tourism Permission Letter &bull; ${refNo}`;
      }

      iframeEl.src = src;
      if (titleEl) titleEl.innerHTML = `<i class="bi bi-file-earmark-check text-primary me-2"></i> ${title}`;
      if (extBtn) extBtn.onclick = () => window.open(src, '_blank');
      if (printBtn) {
        printBtn.onclick = () => {
          try {
            iframeEl.contentWindow.print();
          } catch (e) {
            window.open(src, '_blank');
          }
        };
      }

      const bsModal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      bsModal.show();
    },

    /**
     * Render the Department Documents status card or section inside any container
     */
    renderDepartmentDocumentsCard: function (containerEl, refNo, role) {
      if (!containerEl) return;
      const pkg = this.getDocumentStatus(refNo);
      if (!pkg) {
        containerEl.innerHTML = `<div class="text-muted small p-3">Application record not found for documents.</div>`;
        return;
      }

      const r = role || 'citizen';

      containerEl.innerHTML = `
        <div class="card border-0 shadow-xs mb-3">
          <div class="card-header bg-white py-2 d-flex justify-content-between align-items-center border-bottom">
            <span class="fw-bold small text-dark">
              <i class="bi bi-folder-check text-primary me-1"></i> Department Documents &amp; Deliverables
            </span>
            <span class="badge bg-light text-secondary border font-monospace" style="font-size: 0.75rem;">${pkg.refNo}</span>
          </div>
          <div class="card-body p-3">
            <div class="row g-3">
              
              <!-- 1. Final Permission Letter -->
              <div class="col-md-6">
                <div class="p-3 rounded border h-100 ${pkg.permissionLetter.available ? 'bg-success-subtle border-success-subtle' : 'bg-light'}">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h4 class="h6 fw-bold mb-1 text-dark">
                        <i class="bi bi-file-earmark-check-fill text-success me-1"></i> Final Permission Letter
                      </h4>
                      <span class="badge ${pkg.permissionLetter.badgeClass} mb-2">${pkg.permissionLetter.statusText}</span>
                    </div>
                  </div>
                  
                  ${pkg.permissionLetter.available ? `
                    <div class="small mb-2">
                      <div>Permission Ref: <strong class="font-monospace text-success">${pkg.permissionLetter.permissionNumber}</strong></div>
                      <div class="text-muted">Issue Date: ${pkg.permissionLetter.issueDate} &bull; ${pkg.permissionLetter.approvingOffice}</div>
                    </div>
                    <div class="d-flex gap-2 flex-wrap mt-2">
                      <button type="button" class="btn btn-sm btn-success px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1 shadow-xs" onclick="DocumentService.openDocumentModal('permission', '${pkg.refNo}', '${r}')">
                        <i class="bi bi-eye"></i> View Letter
                      </button>
                      <button type="button" class="btn btn-sm btn-outline-success px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1" onclick="DocumentService.openPermissionLetter('${pkg.refNo}', '${r}')">
                        <i class="bi bi-printer"></i> Print / PDF
                      </button>
                    </div>
                  ` : `
                    <div class="small text-muted mb-2">
                      The official statutory permission letter will be generated following final sanction by the respective District Tourism Officer.
                    </div>
                    <button type="button" class="btn btn-sm btn-outline-secondary px-3 py-1.5 disabled" disabled>
                      <i class="bi bi-lock me-1"></i> Pending Final Approval
                    </button>
                  `}
                </div>
              </div>

              <!-- 2. HQ Approval Sheet -->
              <div class="col-md-6">
                <div class="p-3 rounded border h-100 ${pkg.approvalSheet.uploaded ? 'bg-primary-subtle border-primary-subtle' : 'bg-light'}">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h4 class="h6 fw-bold mb-1 text-dark">
                        <i class="bi bi-file-earmark-text-fill text-primary me-1"></i> Headquarters Approval Sheet
                      </h4>
                      <span class="badge ${pkg.approvalSheet.badgeClass} mb-2">${pkg.approvalSheet.statusText}</span>
                    </div>
                  </div>

                  ${pkg.approvalSheet.canDownload ? `
                    <div class="small mb-2">
                      <div>Sheet Ref: <strong class="font-monospace text-primary">${pkg.approvalSheet.sheetNo || 'HQ-APP-SHEET'}</strong></div>
                      <div class="text-muted">Prepared: ${pkg.approvalSheet.uploadDate || 'Recent'} &bull; Paryatan Bhawan</div>
                    </div>
                    <div class="d-flex gap-2 flex-wrap mt-2">
                      <button type="button" class="btn btn-sm btn-primary px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1 shadow-xs" onclick="DocumentService.openDocumentModal('approval_sheet', '${pkg.refNo}', '${r}')">
                        <i class="bi bi-eye"></i> View Approval Sheet
                      </button>
                      <button type="button" class="btn btn-sm btn-outline-primary px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1" onclick="DocumentService.openApprovalSheet('${pkg.refNo}', '${r}')">
                        <i class="bi bi-printer"></i> Print / PDF
                      </button>
                    </div>
                  ` : `
                    <div class="small text-muted mb-2">
                      ${!pkg.approvalSheet.applicable ? 
                        'This category is sanctioned directly at District circle level. Directorate Approval Sheet is not applicable.' : 
                        'State-level inter-departmental security concurrence is currently underway. Approval Sheet will appear here once uploaded.'}
                    </div>
                    <button type="button" class="btn btn-sm btn-outline-secondary px-3 py-1.5 disabled" disabled>
                      <i class="bi bi-dash-circle me-1"></i> ${!pkg.approvalSheet.applicable ? 'Not Applicable' : 'Not Yet Uploaded'}
                    </button>
                  `}
                </div>
              </div>

            </div>
          </div>
        </div>
      `;
    }
  };

  // Expose globally
  window.DocumentService = DocumentService;

})(window);

