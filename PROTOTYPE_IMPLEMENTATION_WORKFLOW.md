# GOVERNMENT SERVICES PROTOTYPE
# MASTER IMPLEMENTATION WORKFLOW & INSTRUCTIONS

## 1. PROJECT OBJECTIVE

We are developing approximately 30 Government-to-Citizen (G2C) web service application prototypes for the Government of Sikkim.

The purpose of these prototypes is to demonstrate the complete user journey, application forms, department-side processing, workflows and final service outcomes to stakeholders before actual application development begins.

Every service must follow a standardized design system, common layout, reusable components and a controlled implementation process.

**The mandatory development approach is to complete one service through seven stages, obtain approval, and then move to the next service.**

Do not attempt to generate the entire application in one step.

---

## 2. TECHNOLOGY STACK AND DEVELOPMENT RESTRICTIONS

All prototypes must use the following technologies:

- HTML5
- Bootstrap 5.3
- CSS3
- Vanilla JavaScript
- JSON for configuration and mock data
- Bootstrap Icons or Font Awesome

### Strict restrictions

Do not introduce:

- React
- Angular
- Vue.js
- TypeScript
- Node.js
- npm or package managers
- Vite, Webpack or other build tools
- ASP.NET Core or other backend frameworks
- Database integrations
- Unnecessary external dependencies

The prototype must run directly through Visual Studio Code Live Server.

Keep the implementation lightweight, maintainable and easy to understand. The objective is to develop a functional frontend prototype, not a production backend application.

---

## 2.1 MANDATORY UI/UX DESIGN GUARDRAILS & QUALITY GATE

All prototype development across all ~30 services must strictly comply with:

**`UI_UX_DESIGN_GUARDRAILS.md`** (located in the project root)

This authoritative document establishes the permanent, non-negotiable design standard for:
- **Common Layout Hierarchy**: Header, 260px sidebar navigation, consistent content positioning.
- **Button Sizing & Anti-Slab Standard**: Natural-width compact buttons (`btn-sm`, `width: auto`), no full-width button slabs in cards or desks.
- **Table Action Protection**: 5–6 essential columns, `<td class="text-end text-nowrap">` single-line actions.
- **Dual Responsive View**: Standard desktop tables (`.gov-table-desktop`) automatically switch to touch-friendly mobile cards (`.gov-mobile-app-card`) on viewports < 768px.
- **Plain English Terminology**: 100% adoption of simple language (*Verify*, *Verification Desk*, *Applicant Details*, *Return for Correction*, *Application ID*).
- **Mandatory 5 Test Viewports**: Desktop (1440x900), Laptop (1366x768), Tablet (768x1024), Mobile (390x844), Small Mobile (360x800).
- **Mandatory Pre-Implementation Check**: Checks 1–5 must be executed and reported before writing any code.
- **Mandatory Post-Implementation Quality Gate**: Checks A–G must pass before marking any task complete.

**Permanent Requirement**: Before implementing any new user request, read `UI_UX_DESIGN_GUARDRAILS.md`, perform the mandatory pre-implementation design consistency check, preserve approved common templates and run the post-implementation quality gate.

---

## 3. CENTRAL REFERENCE LIBRARY

The project contains a central `templates` directory.

This directory is the authoritative reference library and reusable template repository for every service.

### Expected directory structure

```text
project-root/
│
├── PROTOTYPE_IMPLEMENTATION_WORKFLOW.md
├── UI_UX_DESIGN_GUARDRAILS.md
│
├── templates/
│   │
│   ├── references/
│   │   ├── Index.cshtml
│   │   ├── GovernmentLayout.cshtml
│   │   ├── government-portal-reference.png
│   │   └── REFERENCE_GUIDELINES.md
│   │
│   ├── public-portal-template.html
│   ├── citizen-dashboard-template.html
│   ├── application-form-template.html
│   ├── application-list-template.html
│   ├── application-tracking-template.html
│   ├── officer-dashboard-template.html
│   └── officer-review-template.html
│
├── common/
│   ├── css/
│   ├── js/
│   ├── components/
│   └── themes/
│
└── services/
    ├── tourism-permission/
    ├── service-02/
    ├── service-03/
    └── ...
```

This is the intended structure. Inspect the existing repository before making changes. Do not unnecessarily restructure or replace existing files.

### 3.1 Original reference files

The following files are the original design references:

**Index.cshtml**
- Reference for public landing page structure.
- Section ordering and content organization.
- Citizen-facing information presentation.
- Service overview, eligibility, documents, fees, process, FAQs and helpdesk sections.

**GovernmentLayout.cshtml**
- Reference for the common government portal layout.
- Header, navigation, utility bar and footer.
- Accessibility controls.
- Theme selection and general layout behavior.
- Government identity and department information.

**government-portal-reference.png**
- Visual reference for the intended appearance.
- Layout proportions, colors, spacing, typography and visual hierarchy.

These files must be inspected before implementing the relevant stages.

### 3.2 Reference library rules

1. Do not ask the user to upload the reference files repeatedly when they already exist in the project.
2. Always inspect `/templates/references/` before beginning a new service.
3. Read the original HTML/Razor structure and review the reference image.
4. Convert Razor-specific elements into equivalent static HTML and Vanilla JavaScript.
5. Do not modify, overwrite or delete original reference files.
6. If a reference asset or dependency is missing, report it rather than claiming exact reproduction.
7. Do not introduce a new design that conflicts with the approved reference.

### 3.3 Reusable HTML templates

The HTML files directly inside `/templates/` are reusable implementation starting points.

Use the appropriate template for each screen:

| Template | Intended use |
|---|---|
| public-portal-template.html | Public landing page |
| citizen-dashboard-template.html | Citizen dashboard |
| application-form-template.html | Application submission |
| application-list-template.html | Application list |
| application-tracking-template.html | Application tracking |
| officer-dashboard-template.html | Department dashboard |
| officer-review-template.html | Application review |

Do not blindly copy sample content. Preserve the approved common layout and reusable components while replacing service-specific information.

If an existing template is incomplete, improve it only within the scope of the currently approved stage.

---

## 4. SEVEN-STAGE IMPLEMENTATION WORKFLOW

Every service must be developed through the following seven stages in the specified order.

### STAGE 01 – LANDING PAGE DESIGN

**Objective:** Develop the public-facing service landing page.

Reference:
- `Index.cshtml`
- `GovernmentLayout.cshtml`
- `government-portal-reference.png`
- `public-portal-template.html`

Implementation scope:

- Government portal header and department identity.
- Accessibility and utility navigation.
- Main navigation.
- Service-specific hero section.
- Service overview.
- Eligibility criteria.
- Required documents.
- Applicable fees and timelines.
- How to apply.
- Official downloads and resources.
- Frequently asked questions.
- District helpdesk/contact information.
- Common government footer.

Preserve the reference section sequence and established common layout.

Replace only the service-specific content.

**Expected output:** A complete responsive public landing page.

**Mandatory Central Portal Linking:**
- Upon completing Stage 01 for a service, add or update its card in the "Available Public Services" grid in both `templates/public-portal-template.html` and `shared/templates/public-portal-template.html`.
- Connect the card title and "Apply Online" / "Open Service" button directly to `services/<service-slug>/index.html`.
- Assign the proper category tag (`data-category="permits"`, `data-category="certificates"`, or `data-category="revenue"`) to enable instant search and category filtering on the portal.

### STAGE 02 – CITIZEN LOGIN, MENU AND DASHBOARD

**Objective:** Design the citizen-side experience after accessing the service.

Reference:
- `citizen-dashboard-template.html`
- `application-list-template.html`
- `application-tracking-template.html`

Implementation scope:

- Login and access demonstration.
- First-time citizen experience.
- Existing citizen experience.
- Citizen dashboard.
- Navigation menu.
- New application access.
- Application list.
- Application status and tracking.
- Pending actions.
- Returned applications, if applicable.
- Completed applications.
- Downloadable documents and certificates, if applicable.
- Citizen profile and account information.

Design relevant screens based on different citizen situations.

Do not assume every service requires the same menu or dashboard options.

**Expected output:** A functional citizen-side navigation and dashboard demonstration using mock data.

### STAGE 03 – APPLICATION SUBMISSION PROCESS

**Objective:** Implement the complete service-specific application submission journey.

Reference:
- `application-form-template.html`

Implementation scope:

- Application form structure.
- Applicant information.
- Service-specific application details.
- Conditional fields.
- Dynamic field visibility.
- Document upload interface.
- Required-field validation.
- Review and confirmation.
- Declaration and consent, if applicable.
- Final submission.
- Application reference number.
- Submission confirmation screen.

Form fields, document requirements and validation rules must come from the service requirements.

Do not invent mandatory fields, document requirements or validation rules.

**Expected output:** A complete interactive application submission demonstration.

### STAGE 04 – DEPARTMENT DASHBOARD AND APPLICATION WORKFLOW

**Objective:** Implement the department-side application processing experience.

Reference:
- `officer-dashboard-template.html`
- `officer-review-template.html`

Implementation scope:

- Department dashboard.
- Role-specific access and navigation.
- Application statistics.
- Application listing.
- Search and filters.
- Application details.
- Applicant and document information.
- Verification and scrutiny.
- Forwarding to the next authority.
- Approval or rejection where applicable.
- Return for correction where applicable.
- Remarks and comments.
- Application status updates.
- Application processing history.
- Workflow tracking.

The actual workflow must be based on the service-specific approval process provided by the user.

Do not invent additional authorities, approval stages or departmental responsibilities.

If an external system such as e-Office is involved, demonstrate the relevant steps through mock interfaces. Do not claim a real integration.

**Expected output:** A complete department-side workflow demonstration with role-based screens and mock application status transitions.

### STAGE 05 – APPLICATION PAYMENT (IF APPLICABLE)

**Objective:** Demonstrate the service payment process, where required.

Implementation scope:

- Applicable fee display.
- Fee calculation.
- Payment initiation.
- Payment method selection, if relevant.
- Payment processing demonstration.
- Payment success/failure states.
- Transaction reference.
- Receipt generation.
- Payment history.

Important:

- Do not assume that every service requires online payment.
- Do not invent fees or payment rules.
- Do not integrate a real payment gateway.
- Clearly identify simulated transactions.

If payment is not applicable, explicitly mark this stage as **Not Applicable** and document the reason.

**Expected output:** A simulated payment journey or an approved Not Applicable decision.

### STAGE 06 – FINAL CERTIFICATE GENERATION

**Objective:** Demonstrate the final output issued after successful application processing.

Implementation scope:

- Final approval status.
- Certificate or permission letter generation.
- Document preview.
- Certificate details.
- Unique reference or certificate number using clearly identified mock data.
- Issue date and validity, where applicable.
- Download/print functionality.
- Citizen dashboard access.
- Certificate verification interface, if applicable.

The final document must reflect the actual output of the service.

Do not invent certificate validity periods, signatories, legal declarations or approval conditions.

**Expected output:** A functional demonstration of the final service deliverable.

### STAGE 07 – REPORTS

**Objective:** Implement reporting screens relevant to citizens and department users.

Implementation scope may include:

- Total applications.
- Applications by status.
- Applications by district.
- Applications by category.
- Pending applications.
- Approved and rejected applications.
- Processing statistics.
- Payment and collection reports, if applicable.
- Date-range filters.
- Search and filtering.
- Tabular reports.
- Summary cards and charts.
- Export to CSV/print, where appropriate.

Only implement reports relevant to the actual service.

Use realistic mock data and clearly distinguish it from live government data.

**Expected output:** A functional reporting dashboard and relevant report views.

---

## 5. STRICT STAGE-BY-STAGE EXECUTION RULES

These rules are mandatory.

1. Implement only the stage explicitly requested by the user.
2. Never automatically proceed to the next stage.
3. Complete the current stage before requesting approval.
4. Wait for explicit user approval before starting the next stage.
5. Do not modify previously approved stages unless explicitly instructed.
6. Do not generate all seven stages in a single implementation operation.
7. Do not make assumptions about missing service requirements.
8. Ask for clarification when a missing detail materially affects implementation.
9. Use clearly labelled placeholders when appropriate.
10. Reuse existing approved components and templates.
11. Avoid unnecessary refactoring and overengineering.
12. Inspect the existing repository before creating or modifying files.
13. Preserve working functionality from previously approved stages.
14. Ensure all navigation and interactive elements work within the prototype.
15. Do not claim that mock functionality is a real integration.

### Completion and approval process

At the end of every stage:

- Test the implemented screens.
- Review desktop, tablet and mobile layouts.
- Check navigation and interactions.
- Identify any incomplete functionality.
- Provide a concise implementation report.
- List files created and modified.
- Document assumptions and unresolved requirements.
- Wait for user approval.

Do not proceed until the user explicitly approves the stage.

---

## 6. COMMON DESIGN AND UI/UX STANDARDS

All services must maintain a consistent government portal experience.

### Common elements

- Government identity and department header.
- Navigation and footer.
- Typography.
- Color themes and design tokens.
- Spacing and layout conventions.
- Button styles.
- Form controls.
- Input validation.
- Cards and tables.
- Modals and alerts.
- Accessibility controls.
- Responsive behavior.

### Citizen-side standards

- Simple and understandable language.
- Clear application instructions.
- Easy-to-follow application progress.
- Consistent dashboard patterns.
- Clear status indicators.
- Accessible forms and navigation.

### Department-side standards

- Professional administrative interface.
- Clear dashboard statistics.
- Consistent application listing.
- Structured application details.
- Clear workflow actions.
- Consistent review and remarks interfaces.

### Responsive standards

Every screen must work on:

- Desktop.
- Tablet.
- Mobile.

Do not create desktop-only interfaces.

### Design consistency

The first approved service will establish the common design reference for subsequent services.

Do not introduce unrelated design styles, inconsistent components or arbitrary changes between services.

---

## 7. SERVICE-SPECIFIC CONFIGURATION

Separate service-specific information from common layout and components.

Use JSON configuration wherever practical for:

- Government and department details.
- Service name and description.
- Eligibility.
- Application categories.
- Form fields.
- Conditional field rules.
- Required documents.
- Fees and payment applicability.
- Processing timelines.
- Department roles.
- Application workflow.
- Notifications.
- FAQs.
- Certificate information.
- Report definitions.

Common components must not contain hardcoded information specific to an individual service.

The objective is to reuse the common design and implementation structure while changing only service-specific requirements.

---

## 8. PROTOTYPE FUNCTIONALITY AND MOCK DATA

The prototype must demonstrate a realistic end-to-end user journey using static JSON data and client-side JavaScript.

The following must work wherever applicable:

- Navigation.
- Forms and validations.
- Conditional fields.
- Document upload demonstrations.
- Application submission.
- Application reference generation.
- Application status changes.
- Department workflow actions.
- Payment simulation.
- Certificate preview and download.
- Reports and filters.

Use realistic sample data.

Clearly distinguish simulated features from actual integrations.

No real citizen data, government database, payment transaction or external system integration should be assumed.

---

## 9. IMPLEMENTATION COMPLETION REPORT

At the end of every stage, provide a report using this structure:

### Stage Completion Report

**Service Name:**  
**Stage Number and Name:**  
**Implementation Status:** Completed / Partially Completed / Blocked

**1. Implemented Features**
- List completed functionality.

**2. Files Created**
- List newly created files.

**3. Files Modified**
- List modified files.

**4. Functional Testing**
- Navigation.
- Form behavior.
- Interactions.
- Responsive layout.

**5. Mock Functionality**
- Identify simulated features.

**6. Pending Information**
- List missing requirements or clarifications.

**7. Deviations**
- Mention any differences from the reference or approved design.

**8. Approval**
- Wait for user review and approval before proceeding.

---

## 10. SERVICE IMPLEMENTATION SEQUENCE

The overall development sequence is:

1. Complete all seven applicable stages for Service 01.
2. Review and approve the overall prototype.
3. Identify and consolidate common components and design patterns.
4. Update reusable HTML templates with approved improvements.
5. Treat the completed service as the reference implementation.
6. Start Service 02 using the same seven-stage workflow.
7. Repeat the process for the remaining services.

The first service is the reference implementation. Common design improvements approved during subsequent services must be evaluated and applied consistently without breaking previously approved services.

---

## 11. FINAL NON-NEGOTIABLE INSTRUCTION

**Follow the seven-stage implementation workflow strictly for every service.**

Before starting any implementation:

1. Read this master instruction file (`PROTOTYPE_IMPLEMENTATION_WORKFLOW.md`).
2. Read the permanent design standard: `UI_UX_DESIGN_GUARDRAILS.md`.
3. Perform the mandatory Pre-Implementation Design Consistency Check and emit the report.
4. Inspect the central reference library and existing reusable HTML templates under `/templates/`.
5. Review the service-specific requirements supplied by the user.
6. Identify the exact stage requested.
7. Upon completing implementation, execute the Mandatory Post-Implementation Quality Gate across all 5 test viewports and emit the verification report.

Implement only that stage.

Complete, test, report and wait for approval.

Do not independently decide to generate future stages or redesign approved components.

The goal is to deliver approximately 30 consistent, simple, professional and functional government service prototypes through a controlled and repeatable process.

