/**
 * STAGE 05: DOCUMENT & GUIDE ID CARD GENERATION SERVICE
 * Service: Adventure Tour Operator & Guide Registration
 * Department: Tourism & Civil Aviation Department, Government of Sikkim
 * Framework: Sikkim G2C Web Services Framework
 */

(function (window) {
  'use strict';

  const AdventureDocumentService = {
    /**
     * Retrieve document availability status and metadata for an application
     * @param {string} arn Application Reference Number
     * @returns {object} Document package containing Certificate and ID Card state
     */
    getDocumentStatus: function (arn) {
      let app = null;
      if (typeof AdventureWorkflowEngine !== 'undefined' && AdventureWorkflowEngine.getApplicationByArn) {
        AdventureWorkflowEngine.init();
        app = AdventureWorkflowEngine.getApplicationByArn(arn);
      }

      if (!app) {
        // Fallback demo mapping if record not loaded
        const isGuide = (arn && arn.includes('GR'));
        return {
          arn: arn,
          isApproved: true,
          category: isGuide ? 'guide-registration' : 'adventure-tour-operator',
          certificate: {
            applicable: true,
            available: true,
            annexure: isGuide ? 'Annexure XVIII' : 'Annexure XVII',
            title: isGuide ? 'Certificate of Registration of a Guide' : 'Certificate of Registration of Adventure Tour Operator',
            refNo: isGuide ? 'RC-SK-GR-2026-0044' : 'RC-SK-ATO-2026-0009',
            url: `certificate.html?arn=${encodeURIComponent(arn)}`
          },
          guideIdCard: {
            applicable: isGuide,
            available: isGuide,
            title: 'Tour Guide ID Card (Front & Back)',
            refNo: isGuide ? '133/DoT&CAv/GTK/23/TG' : null,
            url: isGuide ? `guide-id-card.html?arn=${encodeURIComponent(arn)}` : null
          }
        };
      }

      const isApproved = (app.status === 'Approved' || (app.stage && app.stage.toLowerCase().includes('approved')));
      const isGuide = (app.type === 'guide-registration' || app.category === 'guide-registration');

      return {
        arn: app.arn,
        applicantName: app.applicantName,
        enterpriseName: app.enterpriseName,
        district: app.district,
        isApproved: isApproved,
        category: app.type || app.category,
        certificate: {
          applicable: true,
          available: isApproved,
          annexure: isGuide ? 'Annexure XVIII' : 'Annexure XVII',
          title: isGuide ? 'Certificate of Registration of a Guide' : 'Certificate of Registration of Adventure Tour Operator',
          refNo: app.certificateRegNo || app.certificateNo || (isGuide ? `RC-SK-GR-2026-${app.arn.split('-').pop()}` : `RC-SK-ATO-2026-${app.arn.split('-').pop()}`),
          serialNo: app.certificateSerialNo || (isGuide ? `SR-2026-GR-${app.arn.split('-').pop()}` : `SR-2026-ATO-${app.arn.split('-').pop()}`),
          validTill: app.validTill || '31 Dec 2028',
          url: `certificate.html?arn=${encodeURIComponent(app.arn)}`
        },
        guideIdCard: {
          applicable: isGuide, // Strictly FALSE for Adventure Tour Operator
          available: (isGuide && isApproved),
          title: 'Tour Guide ID Card (Front & Back)',
          refNo: app.cardReference || app.idCardNo || `133/DoT&CAv/${(app.district || 'GTK').substring(0,3).toUpperCase()}/23/TG`,
          issueDate: app.issueDate || '04.09.2023',
          validTill: app.validTill || '03.09.2024',
          url: `guide-id-card.html?arn=${encodeURIComponent(app.arn)}`
        }
      };
    },

    /**
     * Open Certificate in new window or modal
     */
    openCertificate: function (arn, role) {
      const r = role || 'citizen';
      window.open(`certificate.html?arn=${encodeURIComponent(arn)}&role=${encodeURIComponent(r)}`, '_blank');
    },

    /**
     * Open Guide ID Card in new window or modal
     */
    openGuideIdCard: function (arn, role) {
      const r = role || 'citizen';
      window.open(`guide-id-card.html?arn=${encodeURIComponent(arn)}&role=${encodeURIComponent(r)}`, '_blank');
    },

    /**
     * Tourism Officer (TO) dedicated Print Action for Guide ID Card
     */
    printGuideIdCard: function (arn) {
      window.open(`guide-id-card.html?arn=${encodeURIComponent(arn)}&role=dto&print=true`, '_blank');
    },

    /**
     * Render Citizen Deliverables Component on Citizen Dashboard
     */
    renderCitizenDeliverables: function (containerEl, arn) {
      if (!containerEl) return;
      const status = this.getDocumentStatus(arn);

      if (!status.isApproved) {
        containerEl.innerHTML = `
          <div class="alert alert-light border py-3 px-3 rounded-3 text-muted small d-flex align-items-center gap-2">
            <i class="bi bi-clock-history text-secondary fs-5"></i>
            <div>
              <strong>Documents Pending:</strong> Official registration certificate and credentials will be automatically generated upon final departmental approval and sanction.
            </div>
          </div>
        `;
        return;
      }

      let html = '<div class="row g-3">';

      // 1. Certificate Card (Both ATO and Guide)
      html += `
        <div class="${status.guideIdCard.applicable ? 'col-md-6' : 'col-12'}">
          <div class="card h-100 border rounded-3 p-3 bg-white shadow-xs" style="border-top: 4px solid #1e3a8a !important;">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge bg-primary-subtle text-primary border border-primary-subtle small fw-bold">${status.certificate.annexure}</span>
              <span class="badge bg-success text-white small"><i class="bi bi-check-circle-fill me-1"></i>Issued</span>
            </div>
            <h5 class="h6 fw-bold text-dark mb-1">${status.certificate.title}</h5>
            <div class="small text-muted mb-2 font-monospace">Reg. No: <strong>${status.certificate.refNo}</strong></div>
            <div class="small text-muted mb-3">Statutory certificate issued under Sikkim Registration of Tourist Trade Rules, 2025.</div>
            <div class="mt-auto d-flex gap-2 flex-wrap pt-2 border-top">
              <a href="${status.certificate.url}" target="_blank" class="btn btn-sm btn-primary py-1 px-2.5 text-nowrap fw-semibold">
                <i class="bi bi-eye me-1"></i>View Certificate
              </a>
              <a href="${status.certificate.url}" target="_blank" class="btn btn-sm btn-outline-secondary py-1 px-2.5 text-nowrap">
                <i class="bi bi-download me-1"></i>Download PDF
              </a>
              <a href="${status.certificate.url}" target="_blank" class="btn btn-sm btn-outline-primary py-1 px-2.5 text-nowrap">
                <i class="bi bi-printer me-1"></i>Print
              </a>
            </div>
          </div>
        </div>
      `;

      // 2. Guide ID Card (Strictly ONLY for Guide Registration)
      if (status.guideIdCard.applicable) {
        html += `
          <div class="col-md-6">
            <div class="card h-100 border rounded-3 p-3 bg-white shadow-xs" style="border-top: 4px solid #0e3768 !important;">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <span class="badge bg-info-subtle text-info-emphasis border border-info-subtle small fw-bold">Official Credential</span>
                <span class="badge bg-success text-white small"><i class="bi bi-check-circle-fill me-1"></i>Active</span>
              </div>
              <h5 class="h6 fw-bold text-dark mb-1">${status.guideIdCard.title}</h5>
              <div class="small text-muted mb-2 font-monospace">Card Ref: <strong>${status.guideIdCard.refNo}</strong></div>
              <div class="small text-muted mb-3">Two-sided landscape ID card with verified specialization categories and security watermark.</div>
              <div class="mt-auto d-flex gap-2 flex-wrap pt-2 border-top">
                <a href="${status.guideIdCard.url}" target="_blank" class="btn btn-sm btn-primary py-1 px-2.5 text-nowrap fw-semibold">
                  <i class="bi bi-person-badge me-1"></i>View ID Card
                </a>
                <a href="${status.guideIdCard.url}" target="_blank" class="btn btn-sm btn-outline-secondary py-1 px-2.5 text-nowrap">
                  <i class="bi bi-download me-1"></i>Download
                </a>
                <a href="${status.guideIdCard.url}" target="_blank" class="btn btn-sm btn-outline-primary py-1 px-2.5 text-nowrap">
                  <i class="bi bi-printer me-1"></i>Print ID Card
                </a>
              </div>
            </div>
          </div>
        `;
      }

      html += '</div>';
      containerEl.innerHTML = html;
    },

    /**
     * Render Department / Officer Deliverables Card inside review.html or dashboard-dto.html
     */
    renderOfficerDeliverables: function (containerEl, arn, role) {
      if (!containerEl) return;
      const status = this.getDocumentStatus(arn);

      if (!status.isApproved) {
        containerEl.innerHTML = `
          <div class="p-3 bg-light rounded text-center small text-muted">
            <i class="bi bi-info-circle me-1"></i>Final documents will be available for printing after sanction approval is completed.
          </div>
        `;
        return;
      }

      let html = `
        <div class="bg-light p-3 rounded-2 border">
          <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
            <strong class="text-dark small"><i class="bi bi-file-earmark-check-fill text-success me-1"></i>Issued Registration Deliverables</strong>
            <span class="badge bg-success text-white small">Approved &amp; Available</span>
          </div>

          <div class="mb-2.5">
            <div class="fw-semibold small text-dark">${status.certificate.title}</div>
            <div class="text-muted small font-monospace" style="font-size: 0.75rem;">Reg. Ref: ${status.certificate.refNo}</div>
            <div class="mt-1 d-flex gap-2">
              <a href="${status.certificate.url}&role=dto" target="_blank" class="btn btn-sm btn-outline-primary py-1 px-2 text-nowrap" style="font-size: 0.75rem;">
                <i class="bi bi-printer me-1"></i>View / Print Certificate
              </a>
            </div>
          </div>
      `;

      // Guide ID Card Section with dedicated Tourism Officer Print Option
      if (status.guideIdCard.applicable) {
        html += `
          <div class="pt-2 border-top mt-2">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="fw-semibold small text-dark">${status.guideIdCard.title}</span>
              <span class="badge bg-primary-subtle text-primary border small" style="font-size: 0.7rem;">Card Reference: ${status.guideIdCard.refNo}</span>
            </div>
            <div class="text-muted small mb-2" style="font-size: 0.75rem;">Front and back two-sided printable format.</div>
            <div class="d-flex gap-2 flex-wrap">
              <a href="${status.guideIdCard.url}&role=dto" target="_blank" class="btn btn-sm btn-outline-secondary py-1 px-2 text-nowrap" style="font-size: 0.75rem;">
                <i class="bi bi-eye me-1"></i>Preview ID Card
              </a>
              <button type="button" class="btn btn-sm btn-primary py-1 px-3 text-nowrap fw-semibold shadow-xs" onclick="AdventureDocumentService.printGuideIdCard('${arn}')" style="font-size: 0.75rem;">
                <i class="bi bi-printer me-1"></i>Print Guide ID Card for Applicant
              </button>
            </div>
          </div>
        `;
      }

      html += '</div>';
      containerEl.innerHTML = html;
    }
  };

  window.AdventureDocumentService = AdventureDocumentService;

})(window);

