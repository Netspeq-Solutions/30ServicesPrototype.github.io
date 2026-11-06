# AGENTS.md - Sikkim Government Services Prototype Framework

This repository is a centralized frontend prototype development framework for approximately 30 Government-to-Citizen (G2C) web services for the **Government of Sikkim**.

Its purpose is to develop functional, browser-based HTML/CSS/JS prototypes for client demonstrations and administrative approval prior to production software development.

---

## 1. MANDATORY TECHNOLOGY RESTRICTIONS (STRICT)

All development in this repository MUST comply with the following technical envelope:

- **HTML5** (Semantic markup, valid W3C standard)
- **Bootstrap 5.3** (Loaded via CDN)
- **Custom CSS3** (Centralized theme variables and component styles in `shared/css/`)
- **Vanilla JavaScript ES6+** (Modular, clean, no transpilation required)
- **Bootstrap Icons** (Loaded via CDN)
- **JSON** (For mock state and local configuration)
- **Google Fonts** (Noto Sans, Noto Serif)

### Explicit Prohibitions:
- **NO React, Angular, Vue, Svelte or other frontend frameworks.**
- **NO TypeScript.**
- **NO Tailwind CSS.**
- **NO Node.js, npm, yarn, or pnpm.**
- **NO Vite, Webpack, Parcel, Rollup or build tools.**
- **NO backend servers, APIs or real databases.**
- **NO heavy 3rd-party plugin libraries.**

All prototypes must run immediately in any modern browser by launching **VS Code Live Server** on this workspace.

---

> [!IMPORTANT]
> **PERMANENT DESIGN CONSISTENCY & QUALITY GATE**: Before implementing any new user request, read `UI_UX_DESIGN_GUARDRAILS.md`, perform the mandatory pre-implementation design consistency check, preserve approved common templates and run the post-implementation quality gate.

## 2. STANDARD AGENT DEVELOPMENT WORKFLOW

When tasked with implementing a new service or modifying an existing service prototype, the agent MUST execute the following sequence:

0. **Mandatory Design Guardrail Check**: Read `UI_UX_DESIGN_GUARDRAILS.md`, inspect `/templates/`, verify common layout consistency, and emit the Pre-Implementation Check Report.

1. **Understand Requirement**: Review service specifications, departmental context, form fields, and workflow steps.
2. **Inspect Existing Framework**: Examine `shared/css/`, `shared/templates/`, `shared/components/`, and any relevant existing service folders in `services/`.
3. **Prepare Implementation Plan**: Outline affected files, required screens, and mock data extensions before writing code.
4. **Reuse Existing Components**: Use `shared/templates/` as starting points. Do NOT reinvent headers, footers, buttons, or form controls.
5. **Implement Only Required Changes**: Confine edits to the designated service directory `services/<service-slug>/`. Never modify unrelated services or break shared foundational CSS/JS without explicit instruction.
6. **Test Affected Screens**: Verify navigation links, step transitions, interactive validation, file uploads, and status changes in the browser.
7. **Check Responsive Behavior**: Ensure full readability and usability across desktop (>= 992px), tablet (< 992px), and mobile (< 576px). Verify minimum 44px touch targets.
8. **Report Completed Work**: Clearly present completed screens, test steps, mock data IDs, and placeholders awaiting client inputs.

---

## 3. RULES & STANDARDS INDEX

Agents must consult the modular rules located in `.agents/rules/`:

| Rule File | Scope & Directives |
| :--- | :--- |
| [UI_UX_DESIGN_GUARDRAILS.md](UI_UX_DESIGN_GUARDRAILS.md) | **Permanent project design standard, layout guardrails, anti-slab rule, quality gate** |
| [architecture.md](.agents/rules/architecture.md) | Repo layout, service isolation, shared assets, Live Server compatibility |
| [gigw-compliance.md](.agents/rules/gigw-compliance.md) | Guidelines for Indian Government Websites (GIGW 3.0), national emblem, mandatory footer |
| [design-system.md](.agents/rules/design-system.md) | Centralized CSS variables, color semantics, typography, card and button patterns |
| [ui-ux-guidelines.md](.agents/rules/ui-ux-guidelines.md) | Multi-step form UX, citizen dashboards, status tracker timelines, officer scrutiny split-views |
| [coding-standards.md](.agents/rules/coding-standards.md) | Semantic HTML, clean CSS classes, vanilla JS modules, maintainable indentation |
| [accessibility.md](.agents/rules/accessibility.md) | WCAG 2.1 Level AA, skip-to-content, contrast toggler, font scaling, aria labels |
| [prototype-functionality.md](.agents/rules/prototype-functionality.md) | Mock data lifecycle, form validation rules, upload simulation, no dead ends |

---

## 4. SKILLS DIRECTORY

Specialized agent playbooks are maintained in `.agents/skills/`:
- `create-new-service/`: End-to-end scaffolding of a new Sikkim G2C service prototype.
- `modify-existing-service/`: Incremental updates preserving approved screen designs.
- `create-application-form/`: Complex multi-step forms with conditional logic and file uploads.
- `create-workflow/`: Citizen submission to departmental officer review & approval simulation.
- `test-prototype/`: Systematic UX, validation, and browser verification checklist.

