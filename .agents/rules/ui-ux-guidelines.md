# UI/UX Design Guidelines

> [!IMPORTANT]
> **PERMANENT DESIGN CONSISTENCY & QUALITY GATE**: Before implementing any new user request, read `UI_UX_DESIGN_GUARDRAILS.md`, perform the mandatory pre-implementation design consistency check, preserve approved common templates and run the post-implementation quality gate.

## 1. General Interaction Philosophy
Every Sikkim government service prototype must convey authority, simplicity, trust, and predictability. Citizens ranging from rural farmers to urban business owners must be able to navigate without confusion.

## 2. Page Patterns
1. **Public Portal Landing**: Clear hero search, distinct service category cards, statutory timeline badges (SLA), and a step-by-step "How It Works" explainer.
2. **Citizen Dashboard**: Metric cards showing counts for Submitted, Under Scrutiny, Approved, and Action Required. Clear status badges on all listed records.
3. **Application Wizard**:
   - Long forms must be divided into a 3 or 4 step wizard using `.gov-stepper`.
   - Step 1: Personal / Demographic.
   - Step 2: Service-Specific details and conditional fields.
   - Step 3: Document uploads.
   - Step 4: Review summary & statutory declaration checkbox.
   - Never lose entered user values when stepping between wizard steps.
4. **Status Tracker**:
   - Clean vertical timeline (`.gov-timeline`) with unambiguous states (Completed: green check, Active: highlighted pulsing point, Pending: muted).
   - Display current dealing officer designation and SLA due date prominently.
5. **Officer Review Desk**:
   - 2-Column Split View: Applicant details and uploaded document viewer on the left (60%); Statutory checklist and decision desk on the right (40%).
   - Action buttons must be explicit: "Approve & Sanction", "Return for Query", "Reject under Rules".

## 3. Responsive Touch UX
- Mobile viewports (< 576px) must stack form actions vertically with primary action at the top.
- Interactive elements must maintain at least 44x44px hit-box areas on mobile screens.



## 4. Button & Action Layout Protocol
1. **Never Span Full Width in Cards**: Action buttons inside workflow action desks, mobile cards, or info cards must never be stretched 100% wide (`w-100` / `d-grid`). They must look like clean, small, intentional action buttons.
2. **Action Desk Alignment**:
   - Primary action (e.g. "Verify & Forward", "Start HQ Review") is styled with `btn btn-sm btn-primary px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5`.
   - Secondary actions (e.g. "Download Summary", "Return to DTO") must be grouped horizontally below the primary button using `gap-2` flex-wrap.
3. **Table & Mobile Card Action Alignment**:
   - In desktop table rows: Compact action buttons (`btn btn-sm py-1 px-2.5`).
   - In mobile card views: Right-aligned small buttons (`d-flex justify-content-end mt-2`).
   - Desktop and Mobile View Isolation: Always use native Bootstrap breakpoint utilities (`d-none d-md-block` on desktop table wrappers, `d-block d-md-none` on mobile card containers) so mobile cards never render on desktop viewports.


## 5. Government Header Standardization Protocol
1. **Header Consistency Across All Screens**:
   - The top `<header class="gov-header">` must strictly contain only statutory government branding:
     - Left: State Emblem (`sikkim-government-logo-dark.png`), "Government of Sikkim", Department/Circle Title, Service Subtitle.
     - Right: Officer / Citizen User Profile and navigation trigger ("Switch Role / Logout" or "Dashboard").
2. **Prohibition of Duplicate / In-Header Application Metadata**:
   - Never inject application-specific parameters, reference numbers (ARN, Draft ID), status badges, applicant names, or review controls into the top branding header.
   - Keep the top header clean, dignified, and uniform across all 30 services.
   - All record-specific metadata (ARN, stage badges, flow badges, applicant info, and back-to-queue buttons) must reside inside the page body workspace within a dedicated Application Metadata Card.
