# Sikkim Government Services Prototype Framework

A centralized, standardized frontend prototyping environment for approximately 30 Government-to-Citizen (G2C) web services for the **Government of Sikkim**.

This repository is built to develop functional, browser-based HTML/CSS/JS prototypes for client demonstrations, stakeholder walkthroughs, and administrative approvals before production backend application development begins.

---

## 1. Technology Stack & Architecture

This framework deliberately avoids heavy frameworks, build tooling, and backend complexity. It is 100% frontend and requires only a browser.

- **HTML5**: Standardized, semantic, accessible markup.
- **Bootstrap 5.3 (CDN)**: Grid layout, responsiveness, and modal foundations.
- **Custom CSS3**: Centralized GIGW 3.0 styling, theme custom properties, and government UI components (`shared/css/`).
- **Vanilla JavaScript (ES6+)**: Modular client-side scripts (`shared/js/`) for validation, accessibility, and mock workflows.
- **Bootstrap Icons (CDN)**: Vector iconography.
- **Google Fonts**: Noto Sans & Noto Serif for high legibility and multilingual government text.
- **JSON**: Centralized mock state and configuration.

### Strict Architectural Boundaries:
- **No React, Angular, Vue, or Svelte.**
- **No TypeScript.**
- **No Tailwind CSS.**
- **No Node.js or npm dependencies.**
- **No Vite, Webpack, Parcel, or build pipelines.**
- **No backend APIs or database connections.**

---

## 2. Repository Structure

```
sikkim-government-prototypes/
│
├── AGENTS.md                                # AI Agent rules, guidelines and constraints
├── README.md                                # Main developer and setup documentation
├── framework-demo.html                      # Interactive design system & component showcase
│
├── .agents/                                 # Autonomous agent configuration
│   ├── rules/                               # Modular standards (GIGW, accessibility, design)
│   │   ├── architecture.md
│   │   ├── gigw-compliance.md
│   │   ├── design-system.md
│   │   ├── ui-ux-guidelines.md
│   │   ├── coding-standards.md
│   │   ├── accessibility.md
│   │   └── prototype-functionality.md
│   │
│   └── skills/                              # Operational playbooks for creating & modifying services
│       ├── create-new-service/SKILL.md
│       ├── modify-existing-service/SKILL.md
│       ├── create-application-form/SKILL.md
│       ├── create-workflow/SKILL.md
│       └── test-prototype/SKILL.md
│
├── shared/                                  # Common framework foundation
│   ├── css/
│   │   ├── gigw-template.css                # Base GIGW 3.0 styling, skip link, utility bar
│   │   ├── themes.css                       # Centralized CSS variables & departmental themes
│   │   ├── components.css                   # Steppers, dropzones, badges, stat cards
│   │   └── responsive.css                   # Mobile viewports, touch targets, print styles
│   │
│   ├── js/
│   │   ├── common.js                        # Theme switcher, font scaler, component loader, toasts
│   │   ├── navigation.js                    # Active link tracking and mobile menu behavior
│   │   ├── form-validation.js               # Client validation for Indian mobiles, Aadhaar, PIN
│   │   ├── file-upload.js                   # Interactive file dropzone & size/format check
│   │   └── mock-data.js                     # Centralized Sikkim mock data and helper methods
│   │
│   ├── components/                          # Reusable HTML snippets
│   │   ├── header.html                      # Standard department header & utility toolbar
│   │   ├── footer.html                      # GIGW 3.0 compliant footer with mandatory links
│   │   ├── sidebar.html                     # Citizen & officer workspace navigation
│   │   └── notification.html                # Alert banner and toast templates
│   │
│   ├── templates/                           # 7 Base Page Templates
│   │   ├── public-portal-template.html      # 1. Public Service Portal landing
│   │   ├── citizen-dashboard-template.html  # 2. Citizen Workspace & stats
│   │   ├── application-list-template.html   # 3. Application Search & Filter list
│   │   ├── application-form-template.html   # 4. 4-Step Application Wizard
│   │   ├── application-tracking-template.html # 5. ARN Tracking & Timeline
│   │   ├── officer-dashboard-template.html  # 6. Officer Scrutiny Work Queue
│   │   └── officer-review-template.html     # 7. Officer 2-Column Scrutiny & Order Desk
│   │
│   └── assets/
│       ├── images/                          # Banners and illustrations
│       ├── icons/                           # Custom SVG icons
│       └── logos/                           # State emblem and department crests
│
├── services/                                # Individual service prototype folders
│   └── README.md
│
└── documentation/                           # In-depth architectural & compliance guides
    ├── GIGW-3.0-GUIDELINES.md
    ├── DESIGN-SYSTEM.md
    ├── COMPONENT-GUIDELINES.md
    └── PROTOTYPE-CHECKLIST.md
```

---

## 3. Quick Start: How to Run the Project

### Step 1: Open in VS Code
Open this repository folder directly in Visual Studio Code:
```
File -> Open Folder... -> Select 'Protoype_Template'
```

### Step 2: Launch Live Server
1. Ensure the **Live Server** extension by *Ritwick Dey* is installed in VS Code.
2. Right-click on **`framework-demo.html`** in the file explorer.
3. Select **"Open with Live Server"** (or click **"Go Live"** on the bottom status bar).
4. Your default browser will launch at:
   ```
   http://127.0.0.1:5500/framework-demo.html
   ```

You can now test all interactive UI components, switch themes live, adjust accessibility font sizing, and navigate through all 7 base templates.

---

## 4. How to Create a New Service Prototype

Follow this workflow (detailed in `.agents/skills/create-new-service/SKILL.md`):

1. **Create Service Directory**:
   In `services/`, create a new folder named after the service:
   ```
   services/srv-01-certificate-of-identification/
   ```

2. **Copy Required Base Templates**:
   Copy the relevant templates from `shared/templates/` into the new folder:
   - `index.html` (Service landing)
   - `apply.html` (Application form wizard)
   - `track.html` (Status tracking)
   - `review.html` (Officer verification desk)

3. **Set the Departmental Theme**:
   Add the theme attribute to the `<body>` tag in each file:
   ```html
   <body data-theme="forest-green">
   ```

4. **Adjust CSS and JS Paths**:
   Update relative script and style links:
   ```html
   <link rel="stylesheet" href="../../shared/css/gigw-template.css">
   <link rel="stylesheet" href="../../shared/css/themes.css">
   <link rel="stylesheet" href="../../shared/css/components.css">
   <link rel="stylesheet" href="../../shared/css/responsive.css">
   ...
   <script src="../../shared/js/common.js"></script>
   <script src="../../shared/js/navigation.js"></script>
   <script src="../../shared/js/form-validation.js"></script>
   <script src="../../shared/js/file-upload.js"></script>
   ```

5. **Customize Particulars**:
   - Update department name and service title.
   - Tailor form inputs in Step 2 of `apply.html`.
   - Update document checklist in Step 3 of `apply.html`.

---

## 5. Applying Departmental Themes

Themes are controlled centrally via CSS custom properties in `shared/css/themes.css`. Apply a theme by adding `data-theme="..."` to the `<body>` element:

| Theme Attribute | Department Suitability |
| :--- | :--- |
| `data-theme="default"` | General Administration, Social Welfare, Personnel |
| `data-theme="forest-green"` | Land Revenue, Forest & Environment, Agriculture |
| `data-theme="saffron-maroon"` | Tourism & Civil Aviation, Cultural Affairs |
| `data-theme="royal-navy"` | Information Technology, Science & Technology |
| `data-theme="teal"` | Urban Development, Municipalities |

To configure colors, simply adjust the tokens in `shared/css/themes.css` without modifying HTML pages.

---

## 6. GIGW 3.0 & Accessibility Features

- **Skip to Main Content**: Keyboard `Tab` immediately reveals the skip link.
- **Font Resizing (`A-`, `A`, `A+`)**: Dynamically scales the root rem values from 0.85x to 1.25x.
- **High Contrast Toggle**: Shifts all backgrounds to solid black with high-contrast yellow/white text and borders.
- **Accessible Form Feedback**: Inputs highlight red with descriptive `.invalid-feedback` and `aria-invalid="true"`.
- **44px Touch Targets**: Mobile touch buttons and inputs meet WCAG touch target criteria.

---

## 7. Maintaining the Repository

- **Preserve Shared Core**: Never add service-specific rules into `shared/css/` or `shared/js/`.
- **Isolate Services**: Edits to one service must never impact other services.
- **No Build Scripts**: Keep all files pure vanilla HTML, CSS, and JS.
- **Pre-Presentation Verification**: Run through `documentation/PROTOTYPE-CHECKLIST.md` before demonstrating to government stakeholders.

