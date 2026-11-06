# Service Prototype Quality Checklist

Before presenting or submitting any of the 30 Sikkim G2C service prototypes for client demonstration, ensure every item on this checklist is satisfied.

---

## 1. Compliance & Visual Identity
- [ ] Government of Sikkim logo / emblem displayed clearly in the header.
- [ ] Appropriate departmental theme applied via `data-theme` on `<body>`.
- [ ] High Contrast toggle functions properly without breaking typography.
- [ ] Font size controls (`A-`, `A`, `A+`) scale layout without horizontal scrollbars.
- [ ] Mandatory footer links (Terms, Privacy, Hyperlinking, Copyright, Disclaimer, Accessibility) are present.
- [ ] Official helpline and department email displayed.

---

## 2. Navigation & User Flow
- [ ] "Skip to main content" link is first in tab order and focuses main container.
- [ ] Breadcrumbs accurately reflect current location.
- [ ] Active navigation item is highlighted.
- [ ] No dead links (every button or link either performs an action, opens a modal, or routes to an existing page).

---

## 3. Application Form Behavior
- [ ] Form is broken into logical steps using `.gov-stepper`.
- [ ] All mandatory fields have visual red asterisk (`.required`) and HTML5 `required` attribute.
- [ ] Validation prevents proceeding to the next step when invalid or empty.
- [ ] Field error messages are visible, concise, and accessible (`.invalid-feedback`).
- [ ] Conditional fields show/hide properly based on user choices.
- [ ] File dropzone accepts test files, validates size (< 2MB) and extensions, and renders a removable preview badge.
- [ ] Step 4 has a statutory self-declaration checkbox.
- [ ] Submitting the form shows a confirmation notification and routes to the status tracking screen.

---

## 4. Status Tracking & Officer Review
- [ ] Application Reference Number (ARN) follows standard Sikkim format (e.g. `SK-2026-LRD-00412`).
- [ ] Status tracking timeline clearly illustrates all stages from submission to issuance.
- [ ] Officer review desk presents split layout with applicant data on the left and scrutiny checklist on the right.
- [ ] Officer can simulate Approval, Query, and Rejection actions with feedback toasts.

---

## 5. Technical & Responsive Integrity
- [ ] Zero browser console errors (no 404s, no unhandled exceptions).
- [ ] Runs seamlessly under VS Code Live Server.
- [ ] No Node.js, npm, React, Vue, or build-tool dependencies.
- [ ] Desktop layout tested (>= 1200px).
- [ ] Tablet layout tested (768px - 991px).
- [ ] Mobile smartphone layout tested (375px - 575px).
- [ ] Minimum 44x44px touch targets on mobile viewports.

