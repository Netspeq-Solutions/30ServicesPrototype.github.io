# Sikkim G2C Design System Specification

## 1. Design Principles
1. **Official & Trustworthy**: Clean layout, dignified government color palette, clear typography, and official insignia.
2. **Standardized Across 30 Services**: Consistent button hierarchy, form layout, error handling, and status badges so citizens experience a unified interface regardless of the department.
3. **Responsive-First**: Seamless experience across mobile smartphones, tablets, and high-resolution desktop displays.
4. **Lightweight & Build-Free**: Pure HTML5, Bootstrap 5.3, custom CSS3, and vanilla ES6+ JavaScript.

---

## 2. Centralized CSS Custom Properties

Defined in `shared/css/themes.css`:

```css
:root {
  /* Brand Tokens */
  --gov-primary: #0b4d75;
  --gov-primary-hover: #083856;
  --gov-primary-light: #e8f2f8;
  --gov-secondary: #2b7a78;
  --gov-accent: #c25912;

  /* Surfaces & Backgrounds */
  --gov-bg: #f4f6f9;
  --gov-surface: #ffffff;
  --gov-surface-secondary: #f8fafc;
  --gov-border: #d0d7de;

  /* Semantic Typography */
  --gov-text: #1f2937;
  --gov-text-muted: #596574;
  --gov-text-heading: #0f172a;

  /* Functional Status Tokens */
  --gov-success: #1b7a43;
  --gov-warning: #b26a00;
  --gov-danger: #c5221f;
  --gov-info: #0277bd;

  /* Radii */
  --gov-radius-sm: 4px;
  --gov-radius-md: 6px;
  --gov-radius-lg: 10px;
  --gov-radius-pill: 50rem;
}
```

---

## 3. Departmental Theme Architecture

Themes are applied via the `data-theme` attribute on the `<body>` element:

```html
<!-- Example: Setting Tourism Theme -->
<body data-theme="saffron-maroon">
```

| Theme Name | Attribute Value | Intended Departments | Primary Color |
| :--- | :--- | :--- | :--- |
| **Default Slate** | `data-theme="default"` | General Administration, Social Welfare, Personnel | `#0b4d75` |
| **Forest & Revenue** | `data-theme="forest-green"` | Land Revenue, Forest & Environment, Agriculture | `#1b5e20` |
| **Tourism & Culture** | `data-theme="saffron-maroon"` | Tourism & Civil Aviation, Cultural Affairs | `#8a1428` |
| **IT & Science** | `data-theme="royal-navy"` | Information Technology, Science & Technology | `#1e3a8a` |
| **Urban Development** | `data-theme="teal"` | Urban Development, Municipalities, Commerce | `#0f766e` |

---

## 4. Typography Scale

- **Font Family**: `'Noto Sans', sans-serif`
- **Serif Heading Accent**: `'Noto Serif', serif`
- **Hierarchy**:
  - Main Page Banner Heading: `1.75rem` (`display-6` or `.gov-page-banner h1`)
  - Section Title: `1.25rem` (`h3` or `.form-section-header h3`)
  - Sub-Section / Card Title: `1.10rem` (`h5`)
  - Form Label: `0.90rem` (`.form-label`, `font-weight: 600`)
  - Body Text: `1.00rem` (`16px` base scaled by `--gov-font-scale`)
  - Metadata / Help Text: `0.8125rem` (`.form-text`, `.small`)

---

## 5. UI Components

- **Buttons**: `.btn-gov-primary`, `.btn-gov-secondary`, `.btn-gov-outline`
- **Form Sections**: `.form-section-card`, `.form-section-header`, `.form-section-body`
- **Progress Stepper**: `.gov-stepper`, `.gov-step-item`, `.gov-step-circle`, `.gov-step-label`
- **File Upload**: `.file-dropzone`, `.file-preview-item`
- **Badges**: `.gov-badge-draft`, `.gov-badge-submitted`, `.gov-badge-review`, `.gov-badge-approved`, `.gov-badge-rejected`
- **Timeline**: `.gov-timeline`, `.gov-timeline-item`, `.gov-timeline-point`, `.gov-timeline-content`
- **Tables**: `.gov-table`, `.gov-table-responsive`
- **Stat Cards**: `.gov-stat-card`, `.gov-stat-number`, `.gov-stat-label`, `.gov-stat-icon-wrapper`

