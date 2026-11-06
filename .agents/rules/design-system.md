# Design System Rules

> [!IMPORTANT]
> **PERMANENT DESIGN CONSISTENCY & QUALITY GATE**: Before implementing any new user request, read `UI_UX_DESIGN_GUARDRAILS.md`, perform the mandatory pre-implementation design consistency check, preserve approved common templates and run the post-implementation quality gate.

## 1. Centralized CSS Variables
Never hardcode hexadecimal color values inside service HTML or component markup. Always utilize design tokens defined in `shared/css/themes.css`:
- `--gov-primary`: Core brand action and header accents
- `--gov-secondary`: Supporting actions and secondary banners
- `--gov-accent`: Highlighting critical notices and badges
- `--gov-bg`: Body background canvas
- `--gov-surface`: Card and dialog background
- `--gov-border`: Standard line and table borders
- `--gov-text`: Primary readable typography
- `--gov-text-muted`: Secondary metadata and helper labels

## 2. Departmental Theme Architecture
Themes are controlled centrally through `data-theme` on `<body>`:
- `default`: Sikkim Alpine Slate Blue (`#0b4d75`)
- `forest-green`: Environment, Forests, Land Revenue (`#1b5e20`)
- `saffron-maroon`: Tourism, Culture, Heritage (`#8a1428`)
- `royal-navy`: IT, Science & Technology (`#1e3a8a`)
- `teal`: Urban Development, Municipalities (`#0f766e`)

> **Rule**: Do not invent new arbitrary color schemes per page. If a department requires a unique palette, add a theme rule in `themes.css` with approval rather than inline overrides.

## 3. High Contrast Support
Ensure all components maintain legibility when `data-contrast="high"` is active:
- Background turns solid `#000000`
- Text and critical borders turn `#ffffff` or high-visibility yellow `#ffff00`
- Shadows are removed
- Contrast ratios must exceed 7:1 for normal text

## 4. Typography Rules
- Base font: **Noto Sans** (Google Fonts).
- Headings: Clear size scale (`display-6`, `h3`, `h4`, `h5`, `h6`).
- Line height: minimum `1.5` for body text to maintain reading comfort.



## 5. Mandatory Button Sizing & Layout Rules (Strict)
- **Compact Button Standard**: All action buttons in tables, cards, review sidebars, and workflow desks must be compact small buttons (`btn-sm` / `.btn-compact`).
- **No Stretched / Full-Width Buttons**: Never use `w-100` or `d-grid` for action buttons inside cards, review desks, or workflow panels. Buttons must maintain their natural content-driven width (`width: auto`, `display: inline-flex`).
- **Standard Button Dimensions**:
  - Small / Standard Action: `font-size: 0.8125rem`, `padding: 0.35rem 0.85rem`, `border-radius: 6px`, `line-height: 1.4`.
  - Icon-to-Text spacing: `gap: 0.35rem` to `gap: 0.4rem` using Bootstrap Icons (`bi-*`).
- **Button Grouping & Alignment**:
  - In Workflow Desks: Stack primary and secondary actions in a flex-column with `align-items: flex-start` (`#workflowActionsContainer`). Group secondary actions horizontally using `.gov-action-subgroup` (`d-flex flex-wrap gap-2`).
  - In Table Rows & Cards: Align actions to the end (`text-end` or `justify-content-end`).
  - In Modal Footers: Standard small buttons (`btn-sm px-3`).
