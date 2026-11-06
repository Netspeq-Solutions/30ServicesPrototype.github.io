# Coding Standards & Code Hygiene

## 1. HTML Standards
- **HTML5 doctype**: `<!DOCTYPE html>` on every file.
- **Language tag**: `<html lang="en">` (or appropriate regional language).
- **Meta tags**: UTF-8 charset and standard viewport tag are mandatory.
- **Semantic tags**: Use `<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<footer>`.
- **Labels**: Every form input MUST have an explicitly associated `<label for="...">`.
- **No inline styles**: Do not inject arbitrary `style="..."` attributes for layout, margins, or colors. Use Bootstrap utility classes or shared CSS tokens.

## 2. CSS Standards
- Custom CSS must reside in `shared/css/`.
- Class names must follow the `.gov-*` namespace for custom government components.
- Bootstrap 5 utility classes (`mb-3`, `d-flex`, `text-muted`, `p-4`) should be used for common layout and spacing.

## 3. JavaScript Standards
- Vanilla JavaScript ES6+ only.
- Encapsulate logic in self-executing modules or namespaces (`GovApp`, `GovForm`, `GovNav`, `GovUpload`, `GovMockData`).
- Never pollute the global window object with loose variables.
- Use `addEventListener` rather than inline `onclick="..."` for complex flows. Simple prototype triggers may use lightweight helper callbacks.
- Log meaningful errors and feedback in the browser console.

