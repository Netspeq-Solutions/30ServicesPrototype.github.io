# Central Reference Library Guidelines

This document outlines the architectural specifications, section sequence, and visual conventions derived from the approved original reference assets in this directory.

---

## 1. Reference Files Index

| File Name | Role & Scope |
| :--- | :--- |
| **`Index.cshtml`** | Original Razor template defining section ordering, content blocks, cards, tables, FAQs, and helpdesk layout for public landing pages. |
| **`GovernmentLayout.cshtml`** | Standard portal master layout containing the top accessibility toolbar, flag stripe, department brand header, primary navigation, modals, and official footer. |
| **`government-portal-reference.png`** | High-fidelity visual reference establishing the layout proportions, spacing scale, typography, and visual hierarchy. |

---

## 2. Layout & Theme Reference Specifications

### 2.1 Color Palette & Theme Tokens
The reference prototype utilizes the **Forest Green & Gold / Amber** identity appropriate for the Department of Tourism & Civil Aviation, Government of Sikkim:
- **Primary Portal Header & Navbar:** `#114b3f` / `#165b4c` (Deep Forest Green)
- **Top Bar Utility Strip:** `#0d382f` / `#102a24`
- **Accent Action Buttons (Sikkim GO SSO):** `#d97706` / `#c25912` (Amber Gold)
- **Background Canvas:** `#f4f7f6` / `#ffffff`
- **Tricolor Flag Ribbon:** 4px linear gradient (Saffron `#ff9933`, White `#ffffff`, Green `#138808`, Navy Blue `#000080`)

### 2.2 Typography Scale
- **Font Family:** `'Noto Sans', sans-serif`
- **Hero Title:** 2.25rem - 2.5rem (`font-weight: 700`)
- **Section Headings:** 1.5rem - 1.75rem (`font-weight: 700`)
- **Card Titles:** 1.05rem - 1.15rem (`font-weight: 600`)
- **Body & Labels:** 0.925rem - 1.0rem (`line-height: 1.6`)
- **Eyebrows & Subtitles:** 0.8125rem (`text-transform: uppercase`, `letter-spacing: 0.5px`)

---

## 3. Mandatory Landing Page Section Ordering (Stage 01)

When implementing **Stage 01 – Landing Page Design**, preserve the exact 12-section sequence established in `Index.cshtml` and `government-portal-reference.png`:

```
1. Top Flag Stripe & Accessibility Toolbar (A-, A, A+, Contrast, Screen Reader, Skip Link)
       ↓
2. Official Brand Header (Emblem, Eyebrow, Service Title, Subtitle, Helpline, SSO Button)
       ↓
3. Primary Navigation Bar (Sticky or top-aligned)
       ↓
4. Citizen Hero Section (Value proposition, Login CTA, Portal Illustration)
       ↓
5. Key Service Metrics Floating Strip (4 feature cards: Mobile, Digital Certificate, Paperless, Online Submission)
       ↓
6. Quick Action Tiles ("What would you like to do today?" - Apply, Renew, Track, Download, Helpdesk)
       ↓
7. Official Guidelines & Requirements (3 cards: Who Can Apply, Required Documents, Fees & Timelines)
       ↓
8. How to Apply Workflow (5 Easy Steps horizontal stepper + "Start Application Now" button)
       ↓
9. Notifications & Resources Table (Circulars, User Manuals, Forms with download links)
       ↓
10. Frequently Asked Questions (Accessible Bootstrap Accordion)
       ↓
11. District Helpdesks & Support Centers (6 Sikkim Districts: Gangtok, Namchi, Gyalshing, Mangan, Soreng, Pakyong)
       ↓
12. Official Government Footer (Policies, quick links, NIC attribution, GIGW 3.0 / WCAG 2.1 AA badges)
```

---

## 4. Conversion Protocol: Razor to Static HTML & Vanilla JS

1. **Remove Razor Directives:** Convert `@using`, `@inject`, and `@{ var ... }` into static HTML5 elements or JSON configuration.
2. **Icons:** Convert `<i class="fas fa-...">` or `<i class="bi bi-...">` to CDN-loaded vector icon fonts.
3. **Paths:** Ensure image references (`sikkim-government-logo-dark.png`, `sikkim-government-logo-light.png`) resolve relatively to `../../common/assets/` or `../../shared/assets/`.
4. **Theme Configuration:** Express dynamic Razor themes via static CSS variables in `themes.css` or `data-theme="..."` attributes.

