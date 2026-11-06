# AGENTS.md
# GOVERNMENT OF SIKKIM – COMMON SERVICE PROTOTYPE RULES

## 1. PROJECT OBJECTIVE

Develop standardized, interactive Government-to-Citizen (G2C) service prototypes for approximately 30 government web applications under the Government of Sikkim.

Every service must follow the common platform architecture, approved design system, GIGW 3.0 standards and seven-stage implementation workflow.

The objective is to demonstrate the complete citizen journey, application submission, department processing, approval workflow and final service outcome before actual backend development.

## 2. AUTHORITATIVE REFERENCE DOCUMENTS

Before implementing any service, inspect and follow:

- `PROTOTYPE_IMPLEMENTATION_WORKFLOW.md`
- `UI_UX_DESIGN_GUARDRAILS.md`
- `COMMON_PLATFORM_GUIDELINES.md`
- Relevant service-specific initialization instructions.
- Approved Tourism Permission prototype.

These documents are authoritative.

Do not override their requirements with individual design preferences.

## 3. TOURISM PERMISSION – PRIMARY DESIGN REFERENCE

The completed Tourism Permission service is the primary reference for the common government portal design.

Reuse its:

- Government identity and department header.
- Accessibility and utility navigation.
- Main navigation.
- Hero section and public information layout.
- Common footer.
- Citizen dashboard structure.
- Department dashboard structure.
- Sidebar navigation.
- Application lists and details.
- Forms and document upload controls.
- Tables, filters and pagination.
- Status badges and workflow timelines.
- Modals, confirmation dialogs and notifications.
- Responsive layouts.

The Travel Agent / Tour Operator prototype is an additional reference for tourism-registration-specific application patterns and department-side processing.

IMPORTANT:

Reuse the approved design and interaction patterns, not the business rules of another service.

## 4. COMMON TECHNOLOGY STACK

All prototypes must use:

- HTML5.
- Bootstrap 5.3.
- CSS3.
- Vanilla JavaScript.
- JSON configuration and mock data.
- Bootstrap Icons or Font Awesome.
- Browser localStorage for appropriate prototype persistence.

Do not introduce React, Angular, Vue, TypeScript, Node.js, npm, Vite, Webpack, backend APIs or database integrations.

All prototypes must run using VS Code Live Server.

## 5. COMMON DESIGN SYSTEM

Maintain one consistent government design system.

Use existing centralized CSS, components, theme configuration and reusable templates.

Never introduce arbitrary colours, conflicting typography, new spacing systems or independently designed layouts.

A service may use a different existing departmental theme, provided that the theme is already configured in the GIGW CSS.

The selected theme must apply consistently across:

- Public landing page.
- Citizen dashboard.
- Application forms.
- Application tracking.
- Department dashboards.
- Application review.
- Document management.
- Reports.
- Modals and notifications.

Do not modify the global theme architecture for an individual service.

## 6. COMMON APPLICATION ARCHITECTURE

Maintain separation between:

### Common platform components
- Government layout.
- Navigation.
- Accessibility controls.
- Sidebar.
- Footer.
- Reusable form components.
- Tables and filters.
- Status indicators.
- Workflow timeline.
- Document upload and preview.
- Modal and notification components.
- Theme and responsive styles.

### Service-specific components
- Service information.
- Application types.
- Eligibility.
- Application fields.
- Supporting documents.
- Fees and payment rules.
- Department roles.
- Workflow and routing.
- Certificate requirements.
- Notifications.
- Reports and FAQs.

Keep service-specific information in JSON configuration wherever practical.

Do not duplicate common components for every service.

## 7. IMPLEMENTATION WORKFLOW

Follow the mandatory seven-stage implementation workflow defined in `PROTOTYPE_IMPLEMENTATION_WORKFLOW.md`.

Implement one stage at a time.

For every stage:

1. Inspect the existing project.
2. Read the applicable reference files.
3. Perform the mandatory pre-implementation design checks.
4. Identify reusable components.
5. Implement only the requested stage.
6. Preserve previously approved work.
7. Perform the required functional and responsive tests.
8. Provide a completion report.
9. Stop and wait for explicit approval.

Never automatically proceed to the next stage.

## 8. BUSINESS RULES AND DATA INTEGRITY

Never invent:

- Eligibility requirements.
- Application fields.
- Mandatory documents.
- Document formats or file-size limits.
- Fees.
- Payment timing.
- Processing timelines.
- Officer designations.
- Department approval authorities.
- Workflow transitions.
- Certificate validity.
- Renewal requirements.

Classify information as:

- Confirmed.
- Pending departmental confirmation.
- Optional suggestion requiring approval.

When information is missing, use a clearly labelled placeholder or ask for clarification.

Do not present placeholder information as an official government rule.

## 9. UI/UX AND ACCESSIBILITY

Follow `UI_UX_DESIGN_GUARDRAILS.md` without exception.

Maintain:

- Plain English terminology.
- Consistent spacing and typography.
- Compact buttons.
- Proper form labels and validation.
- Accessible colour contrast.
- Keyboard navigation.
- Responsive tables and mobile cards.
- No horizontal page overflow.
- Clear action hierarchy.
- Consistent desktop, tablet and mobile behaviour.

Test at the five mandatory viewports:

- 1440 × 900.
- 1366 × 768.
- 768 × 1024.
- 390 × 844.
- 360 × 800.

Do not claim a test passed without actually performing it.

## 10. SCOPE PROTECTION

Do not modify:

- Original reference files.
- Approved Tourism Permission implementation.
- Unrelated service prototypes.
- Global common components unless explicitly required and approved.
- Existing theme definitions.

Keep all service-specific changes inside the appropriate service directory.

## 11. COMPLETION REPORT

For each stage, report:

- Stage and objective.
- Implemented sections and functionality.
- Common components reused.
- Files created and modified.
- Mock data and placeholders.
- Pending information.
- Responsive testing results.
- Functional testing results.
- Known issues and deviations.

Wait for explicit approval before proceeding.

## FINAL PRINCIPLE

ONE COMMON GOVERNMENT DESIGN SYSTEM.

MULTIPLE INDEPENDENT SERVICE BUSINESS RULES.

Preserve common design consistency while allowing every department service to maintain its own application forms, eligibility, documents and workflows.