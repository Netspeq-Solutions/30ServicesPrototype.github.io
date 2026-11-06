# GIGW 3.0 Compliance & Accessibility Guidelines

## Overview
The **Guidelines for Indian Government Websites (GIGW 3.0)**, formulated by the Ministry of Electronics and Information Technology (MeitY) and the National Informatics Centre (NIC), define mandatory standards for state and central government portals.

In this prototype framework for the **Government of Sikkim**, GIGW 3.0 and WCAG 2.1 Level AA principles are baked directly into the shared foundation.

---

## 1. Mandatory Identity & Layout Elements

### 1.1 Skip to Main Content
- Every page includes `<a href="#main-content" class="skip-link">Skip to main content</a>` as the first interactive DOM element.
- It remains off-screen until focused via keyboard `Tab`, at which point it displays prominently at the top of the viewport.

### 1.2 Government Header & Insignia
- Header prominently renders the State Government identity: **Government of Sikkim**.
- Displays department name, official helpline, and national/state emblem graphic.
- Decorative tricolor stripe (`.gov-top-stripe`) denotes official government stature.

### 1.3 Accessibility & Utility Toolbar
- Located above the main department header on every screen.
- Features:
  - **Font Resizing (`A-`, `A`, `A+`)**: Adjusts `--gov-font-scale` dynamically from `0.85x` to `1.25x`.
  - **High Contrast Toggle**: Applies `data-contrast="high"` for users with low vision or photophobia.
  - **Theme Selector**: Previews departmental visual identities without reloading.

---

## 2. Mandatory Footer Requirements (Clause 5.2.1)

Every government page must provide explicit links to:
1. **Terms & Conditions**: Legal usage conditions of the online service.
2. **Privacy Policy**: Statement on handling citizen demographic data, phone numbers, and identity records.
3. **Hyperlinking Policy**: Conditions regarding inbound and outbound linking.
4. **Copyright Policy**: Ownership declaration of Government of Sikkim content.
5. **Disclaimer**: Statement on statutory validity of prototype information.
6. **Accessibility Statement**: Conformance declaration with contact details for accessibility grievances.
7. **Last Updated Timestamp**: Clear date indicating the currency of information.
8. **Contact & Helpline**: Toll-free citizen contact numbers and departmental email addresses.

---

## 3. WCAG 2.1 Level AA Accessibility Standards

### 3.1 Color Contrast (Criterion 1.4.3)
- Normal text (< 18pt regular or < 14pt bold): Minimum contrast ratio of **4.5:1** against background.
- Large text (>= 18pt regular or >= 14pt bold): Minimum contrast ratio of **3:1**.
- High contrast mode exceeds **7:1** across all screens.

### 3.2 Keyboard Operability (Criterion 2.1.1)
- Every interactive element (nav links, buttons, form inputs, modals) is operable via keyboard alone.
- Visible focus indicator: High-contrast focus ring (`outline: 3px solid #ffcc00 !important`).

### 3.3 Form Accessibility (Criterion 3.3.1 & 3.3.2)
- All `<input>`, `<select>`, and `<textarea>` elements are paired with explicit `<label for="...">`.
- Mandatory inputs are flagged with `required` and visual asterisks.
- Error messages dynamically update `aria-invalid="true"` and render accessible textual explanations.

### 3.4 Touch Targets (Criterion 2.5.5 / 2.5.8)
- On coarse pointer / touch devices, buttons, links, and form controls have a minimum touch target area of **44x44 pixels**.

