# Government of Sikkim Services Directory

This directory hosts individual service prototype workspaces.

## Active Service Prototypes

| Service Slug | Service Name | Department | Current Stage | URL |
| :--- | :--- | :--- | :--- | :--- |
| `tourism-permission` | **Tourism Permission** | Tourism & Civil Aviation Department | **Stage 07 (Reports & Analytics Complete)** | [`Landing Page`](tourism-permission/index.html) &bull; [`Citizen Dashboard`](tourism-permission/dashboard.html) &bull; [`DTO Desk`](tourism-permission/dashboard-dto.html) &bull; [`HQ Desk`](tourism-permission/dashboard-hq.html) &bull; [`Review Desk`](tourism-permission/review.html) &bull; [`Reports`](tourism-permission/reports.html) |
| `tourism-business-registration` | **Tourism Business & Outdoor Photography Registration** | Tourism & Civil Aviation Department | **Stage 03 Complete** (Multi-Form Registration Active) | [`Landing Page`](tourism-business-registration/index.html) &bull; [`Role Select`](tourism-business-registration/role-select.html) &bull; [`Instructions`](tourism-business-registration/instructions.html) &bull; [`Application Form (Stage 03)`](tourism-business-registration/apply.html) &bull; [`Citizen Desk`](tourism-business-registration/dashboard.html) &bull; [`TO Desk (L0)`](tourism-business-registration/dashboard-to.html) &bull; [`IA Desk (L1)`](tourism-business-registration/dashboard-ia.html) &bull; [`DTO Desk (L2)`](tourism-business-registration/dashboard-dto.html) |
| `adventure-tour-operator-guide-registration` | **Adventure Tour Operator & Guide Registration** | Tourism & Civil Aviation Department | **Stage 06 Complete** (Reports &amp; Application Summary Active) | [`Landing Page`](adventure-tour-operator-guide-registration/index.html) &bull; [`Role Select`](adventure-tour-operator-guide-registration/role-select.html) &bull; [`Citizen Dashboard`](adventure-tour-operator-guide-registration/dashboard.html) &bull; [`Reports &amp; Analytics (Stage 06)`](adventure-tour-operator-guide-registration/reports.html) &bull; [`Registration Certificate`](adventure-tour-operator-guide-registration/certificate.html) &bull; [`Tour Guide ID Card`](adventure-tour-operator-guide-registration/guide-id-card.html) &bull; [`Unified Review Desk`](adventure-tour-operator-guide-registration/review.html) &bull; [`TA Desk (HQ & Districts)`](adventure-tour-operator-guide-registration/dashboard-ta.html) &bull; [`IO Desk (Inspections)`](adventure-tour-operator-guide-registration/dashboard-io.html) &bull; [`Asst. Dir. Desk`](adventure-tour-operator-guide-registration/dashboard-asst-dir.html) &bull; [`DTO Desk (HQ & 6 Circles)`](adventure-tour-operator-guide-registration/dashboard-dto.html) &bull; [`Application Form`](adventure-tour-operator-guide-registration/apply.html) |

---

## Service Directory Standard
Each service gets its own self-contained directory named with a clean slug:

```
services/
└── tourism-permission/
    ├── index.html                  (Stage 01: Service landing page)
    ├── role-select.html            (Stage 02: 3-Role selection gateway)
    ├── dashboard.html              (Stage 02: Action-oriented citizen dashboard)
    ├── instructions.html           (Stage 02: Mandatory pre-application instructions)
    ├── apply.html                  (Stage 03: Multi-step application submission form)
    ├── dashboard-dto.html          (Stage 04: District Tourism Officer work desk & 6-district switcher)
    ├── dashboard-hq.html           (Stage 04: State Headquarters Administrator work desk)
    ├── review.html                 (Stage 04: Officer scrutiny desk, e-Office & Approval Sheet upload)
    ├── workflow-engine.js          (Stage 04: 4 statuses, 13 stages, 5-branch persistent engine)
    ├── citizen-data.js             (Mock repository - Citizen / DTO / HQ data)
    ├── service-config.json         (Service configuration & mock metadata)
    ├── track.html                  (Stage 05: Public status tracking timeline)
    └── ...
```
