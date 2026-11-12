/**
 * STAGE 06: DOCUMENT & CERTIFICATE GENERATION SERVICE
 * Service: Tourism Business & Outdoor Photography Registration
 * Department: Tourism & Civil Aviation Department, Government of Sikkim
 * Framework: Sikkim G2C Web Services Framework
 */

(function (window) {
  'use strict';

  const DocumentService = {
    /**
     * Get document availability status and metadata for an application
     * @param {string} refNo Application Reference Number (ARN)
     * @returns {object} Document package containing DTO sanction sheet and Registration Certificate states
     */
    getDocumentStatus: function (refNo) {
      const app = (typeof TourismBusinessData !== 'undefined' && TourismBusinessData.getApplication)
        ? TourismBusinessData.getApplication(refNo)
        : null;

      const isApproved = app ? (app.status === 'APPROVED') : true;

      return {
        refNo: refNo,
        approvalSheet: {
          applicable: true,
          uploaded: true,
          title: 'Department Verification & Sanction Sheet',
          statusText: 'Available for View / Download',
          badgeClass: 'bg-success',
          fileName: `Sanction_Sheet_${refNo}.pdf`,
          date: (app && app.submittedDate) ? app.submittedDate.split(',')[0] : '15 Oct 2026',
          issuer: 'District Tourism Officer (DTO), Gangtok Circle'
        },
        permissionLetter: {
          applicable: true,
          issued: isApproved,
          title: 'Form 3: Certificate of Registration (3-Year Validity)',
          statusText: isApproved ? 'Official Statutory Certificate Available' : 'Under Review',
          badgeClass: isApproved ? 'bg-success' : 'bg-secondary',
          certNo: (app && app.certificateNo) || `SK-TCD-REG-2026-${refNo.substring(refNo.length - 8)}`,
          issueDate: (app && app.submittedDate) ? app.submittedDate.split(',')[0] : '15 Oct 2026',
          validUntil: (app && app.validUntil) || '14 Oct 2029',
          issuer: 'District Tourism Officer, Government of Sikkim'
        }
      };
    },

    /**
     * Generate HTML for the official statutory registration certificate
     */
    getCertificateHtml: function (refNo) {
      const app = (typeof TourismBusinessData !== 'undefined' && TourismBusinessData.getApplication)
        ? TourismBusinessData.getApplication(refNo)
        : null;

      const firmName = (app && app.businessName) || 'Singalila Eco-Tours Sikkim';
      const applicantName = (app && app.applicantName) || 'Tenzing Norbu Lepcha';
      const categoryName = (app && app.categoryName) || 'Tour Operator Registration';
      const address = (app && app.shopAddress ? app.shopAddress + ', ' : '') + ((app && app.district) || 'Gangtok') + ' Circle, Sikkim';
      const certNo = (app && app.certificateNo) || `SK-TCD-REG-2026-${refNo.substring(refNo.length - 8)}`;
      const issueDate = (app && app.submittedDate) ? app.submittedDate.split(',')[0] : '15 Oct 2026';
      const validUntil = (app && app.validUntil) || '14 Oct 2029';

      return `
        <div class="bg-white p-4 p-md-5 rounded border shadow-sm mx-auto" style="border: 3px double #24476B !important; background-color: #FFFDF9 !important; max-width: 760px; font-family: 'Noto Serif', serif;">
          <div class="text-center pb-3 border-bottom mb-4">
            <img src="../../common/assets/images/sikkim-government-logo-dark.png" alt="Emblem of Sikkim" style="height: 60px; width: auto;" class="mb-2">
            <div class="h6 text-uppercase fw-bold text-dark mb-0" style="letter-spacing: 1px; font-family: 'Noto Sans', sans-serif;">Government of Sikkim</div>
            <div class="h5 fw-bold mb-1" style="color: #24476B; font-family: 'Noto Sans', sans-serif;">Tourism &amp; Civil Aviation Department</div>
            <div class="text-muted small" style="font-family: 'Noto Sans', sans-serif;">Paryatan Bhawan, Tadong, Gangtok &ndash; 737102</div>
            <div class="mt-2 py-1 px-3 d-inline-block rounded bg-primary-subtle border border-primary-subtle text-primary fw-bold text-uppercase small" style="letter-spacing: 0.5px; font-family: 'Noto Sans', sans-serif;">
              Form 3 &bull; Statutory Certificate of Registration
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3 text-muted small" style="font-family: 'Noto Sans', sans-serif;">
            <div>Registration Certificate No: <strong class="text-dark font-monospace">${certNo}</strong></div>
            <div>Date of Issuance: <strong class="text-dark">${issueDate}</strong></div>
          </div>

          <div class="py-2 text-secondary lh-lg" style="font-size: 0.95rem;">
            <p class="mb-3">
              This is to certify that the business enterprise / professional named hereunder has been duly registered under 
              <strong>The Sikkim Registration of Tourist Trade Rules</strong>:
            </p>
            
            <div class="p-3 my-3 rounded bg-light border" style="font-family: 'Noto Sans', sans-serif;">
              <div class="row g-2">
                <div class="col-sm-4 text-muted small">Registered Firm / Entity:</div>
                <div class="col-sm-8 fw-bold text-dark fs-6">${firmName}</div>

                <div class="col-sm-4 text-muted small">Proprietor / Signatory:</div>
                <div class="col-sm-8 text-dark fw-semibold">${applicantName}</div>

                <div class="col-sm-4 text-muted small">Registration Track:</div>
                <div class="col-sm-8">
                  <span class="badge bg-primary px-2.5 py-1 text-white fw-bold">${categoryName}</span>
                </div>

                <div class="col-sm-4 text-muted small">Principal Premises:</div>
                <div class="col-sm-8 text-dark">${address}</div>

                <div class="col-sm-4 text-muted small">Statutory Validity:</div>
                <div class="col-sm-8 text-success fw-bold">${issueDate} to ${validUntil} (3 Calendar Years)</div>
              </div>
            </div>

            <div class="small text-muted mt-3 mb-4" style="font-family: 'Noto Sans', sans-serif;">
              <strong>Statutory Conditions:</strong> (1) Valid for three (3) calendar years from date of issue. (2) Non-transferable without prior departmental approval. (3) Must be displayed prominently at the principal business premises. (4) Subject to annual local trade license validity and compliance with Sikkim tourism standards.
            </div>
          </div>

          <div class="pt-3 border-top d-flex justify-content-between align-items-end flex-wrap gap-3" style="font-family: 'Noto Sans', sans-serif;">
            <div class="d-flex align-items-center gap-2">
              <div class="p-1 bg-white border rounded">
                <i class="bi bi-qr-code text-dark" style="font-size: 46px;"></i>
              </div>
              <div class="small text-muted" style="font-size: 0.72rem; line-height: 1.25;">
                <span class="fw-bold d-block text-dark">Scan to Verify</span>
                Digitally Issued via Sikkim GO<br>
                Statutory Seal Verified
              </div>
            </div>

            <div class="text-end">
              <div class="font-monospace text-primary fw-bold small" style="letter-spacing: 0.5px;">[DIGITALLY SIGNED]</div>
              <div class="fw-bold text-dark small mt-0.5">District Tourism Officer (DTO)</div>
              <div class="text-muted" style="font-size: 0.72rem;">Tourism &amp; Civil Aviation Dept &bull; Govt. of Sikkim</div>
            </div>
          </div>
        </div>
      `;
    },

    /**
     * Open Document Modal Viewer
     */
    openDocumentModal: function (docType, refNo, roleContext) {
      const modalEl = document.getElementById('modalDocViewer');
      if (!modalEl) return;

      const titleEl = document.getElementById('docViewerTitle');
      const bodyEl = document.getElementById('docViewerBody');

      if (titleEl) {
        titleEl.innerHTML = `<i class="bi bi-file-earmark-check text-success me-2"></i> Form 3: Statutory Registration Certificate &bull; ${refNo}`;
      }

      if (bodyEl) {
        bodyEl.innerHTML = this.getCertificateHtml(refNo);
      }

      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    },

    /**
     * Open Certificate directly
     */
    openPermissionLetter: function (refNo, roleContext) {
      this.openDocumentModal('certificate', refNo, roleContext);
    },

    openApprovalSheet: function (refNo, roleContext) {
      this.openDocumentModal('approvalSheet', refNo, roleContext);
    },

    /**
     * Render department documents card
     */
    renderDepartmentDocumentsCard: function (containerEl, refNo, roleContext) {
      if (!containerEl) return;
      const status = this.getDocumentStatus(refNo);

      containerEl.innerHTML = `
        <div class="p-3 bg-light rounded-3 border mb-3">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
            <span class="font-monospace fw-bold text-primary">${refNo}</span>
            <span class="badge ${status.permissionLetter.badgeClass}">${status.permissionLetter.statusText}</span>
          </div>
          <div class="small text-muted mb-3">Issued by: ${status.permissionLetter.issuer} &bull; Valid: ${status.permissionLetter.validUntil}</div>
          
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-sm btn-success d-inline-flex align-items-center gap-1.5" onclick="DocumentService.openDocumentModal('certificate', '${refNo}', '${roleContext}')">
              <i class="bi bi-file-earmark-arrow-down-fill"></i>
              <span>View &amp; Print Official Certificate</span>
            </button>
          </div>
        </div>
      `;
    }
  };

  window.DocumentService = DocumentService;

})(typeof window !== 'undefined' ? window : this);

