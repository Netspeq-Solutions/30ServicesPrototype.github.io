# Architectural Rules & Repository Structure

## 1. Architectural Scope
This repository houses approximately 30 Government-to-Citizen (G2C) frontend prototypes for the Government of Sikkim. It is an approval-oriented prototyping environment designed to run directly in VS Code Live Server without any backend or build system.

## 2. Directory Separation & Isolation
- **`shared/`**: Common assets, CSS, JS utilities, components, and 7 base templates.
  - Changes to files in `shared/` must be backward-compatible with all existing service prototypes.
  - Do not introduce service-specific business rules into `shared/`.
- **`services/`**: Individual service workspaces.
  - Each service prototype lives inside its own dedicated subfolder: `services/srv-XX-<service-name>/`.
  - Services must link to `shared/css/` and `shared/js/` using relative paths (`../../shared/...`).
  - No service folder may directly alter or overwrite files in another service folder.
- **`documentation/`**: Architectural and compliance documentation for human developers and government stakeholders.
- **`.agents/`**: Agent rules and skills driving autonomous consistency.

## 3. Serverless & Buildless Integrity
- Every HTML file must be executable directly by opening it through **VS Code Live Server** (served at `http://127.0.0.1:5500/`).
- External assets must rely strictly on high-reliability CDNs:
  - Bootstrap 5.3: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/...`
  - Bootstrap Icons: `https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/...`
  - Google Fonts: `https://fonts.googleapis.com/...`
- No local node_modules, build packages, or server runtimes are permitted.

## 4. Component Loading Protocol
- If a prototype uses `GovApp.loadComponent()` to inject shared HTML fragments (such as headers or footers), it requires an HTTP/HTTPS context (VS Code Live Server).
- For environments where static standalone portability is required (e.g. opening via `file://`), the template header and footer markup may be inlined directly in the service HTML file.

## 5. Mandatory Central Service Linking
Whenever a new service prototype is initiated or completed under `services/`:
- **Card Registration**: A service card MUST be added or updated in the "Available Public Services" section of both `templates/public-portal-template.html` and `shared/templates/public-portal-template.html`.
- **Active Navigation Link**: The card's "Apply Online" / "Open Service" button and title link MUST navigate directly to `services/<service-slug>/index.html`.
- **Categorization**: Tag the service card with the appropriate category attribute (`data-category="permits"`, `data-category="certificates"`, or `data-category="revenue"`) so that the portal's live filtering and keyword search function seamlessly.
- **Directory Index**: Ensure `services/README.md` is updated with the service name, department, current workflow stage, and relative link.


