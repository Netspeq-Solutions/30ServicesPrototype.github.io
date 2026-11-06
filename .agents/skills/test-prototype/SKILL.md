---
name: test-prototype
description: Verification checklist and testing instructions for reviewing navigation, form validation, responsiveness, and console errors.
---

# Workflow: Test & Validate Prototype

Use this skill before presenting or submitting any new or modified service prototype.

## Systematic Verification Checklist

### 1. Zero Console Errors
- Open Developer Tools Console (`F12` or `Ctrl+Shift+I`).
- Ensure there are **no 404 resource errors** (broken CSS, JS, images, or fonts).
- Ensure there are **no unhandled JavaScript exceptions**.

### 2. Live Server Compatibility
- Verify the prototype loads via `http://127.0.0.1:5500/`.
- Verify links use appropriate relative paths without depending on hardcoded root domain assumptions.

### 3. Navigation & Anchor Integrity
- Check all navigation links in the header, sidebar, and breadcrumbs.
- Confirm there are no dead links pointing to `#` that should navigate to actual templates.

### 4. Interactive Form Testing
- Test submitting an empty form: verify mandatory field highlights and error messages.
- Test entering an invalid 8-digit mobile number: verify mobile regex rejection.
- Test stepping backwards and forwards across the 4-step wizard: ensure previously filled data is preserved.
- Test file upload: drag or select a test file and confirm that the preview item renders with a functional remove button.

### 5. Accessibility & Contrast Verification
- Press `Tab` through the page: confirm the Skip to Content link appears first.
- Toggle the High Contrast button in the utility bar: verify background turns pure black and text remains clearly legible.
- Click `A+` and `A-`: confirm root font scaling functions properly.

### 6. Responsive Viewport Check
- Test desktop viewport (>= 1200px): Confirm full 2-column or sidebar layout.
- Test tablet viewport (768px - 991px): Confirm sidebar and multi-step wizard adjust cleanly.
- Test mobile viewport (375px - 575px): Confirm form buttons stack vertically, tables scroll horizontally without breaking container margins, and touch targets meet minimum 44px height.

