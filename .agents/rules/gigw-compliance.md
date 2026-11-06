# GIGW 3.0 Compliance Rules

## 1. Compliance Mandate
All screens must align with the **Guidelines for Indian Government Websites (GIGW 3.0)** and **WCAG 2.1 Level AA**.

## 2. Mandatory Structural Elements on Every Page
1. **Skip to Main Content Link**: First focusable element on every page (`.skip-link` targeting `#main-content`). Must become visible on tab focus.
2. **Indian National / State Identity**:
   - Official Government of Sikkim branding and emblem placeholder at top header.
   - Distinctive tricolor / government accent strip (`.gov-top-stripe`).
3. **Accessibility Toolbar**:
   - Font resize controls: `A-`, `A`, `A+` modifying root scale.
   - High-contrast toggle (`data-contrast="high"`).
   - Language indicator / toggle.
4. **Semantic Breadcrumb**:
   - Every secondary and tertiary page must provide breadcrumb navigation inside `<nav class="gov-breadcrumb-wrapper">`.
5. **Standard Government Footer**:
   - Mandatory links: Terms & Conditions, Privacy Policy, Hyperlinking Policy, Copyright Policy, Disclaimer, Accessibility Statement, Site Map, Help/FAQ.
   - Department contact details, official helpline, and email.
   - Last Updated date timestamp.
   - Compliance certification badges (GIGW 3.0 / WCAG 2.1 Level AA).

## 3. Bilingual Readiness
- All text labels must be cleanly separated from structure to permit future bilingual (English / Nepali / Bhutia / Lepcha) localization without redesigning HTML grids.

