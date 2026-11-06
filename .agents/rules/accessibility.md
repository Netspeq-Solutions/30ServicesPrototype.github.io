# Accessibility Rules (WCAG 2.1 Level AA)

## 1. Keyboard Navigability
- All interactive controls (buttons, links, form inputs, dropdowns, modal triggers) must be reachable and operable via the keyboard (`Tab`, `Shift+Tab`, `Enter`, `Space`).
- Never suppress focus rings with `outline: none` unless replaced with a high-contrast focus indicator (`*:focus-visible { outline: 3px solid #ffcc00 !important; }`).

## 2. Visual Contrast Standards
- Text to background contrast ratio must be at least **4.5:1** for normal text and **3:1** for large text (>= 18pt or bold 14pt).
- UI component borders and icons indicating state must maintain at least **3:1** against adjacent backgrounds.

## 3. ARIA & Screen Reader Attributes
- All decorative graphics or SVG icons must include `role="presentation"` or `aria-hidden="true"`.
- Meaningful status changes (such as form validation error notifications or toast messages) must utilize `role="alert"` or `aria-live="polite"`.
- Form inputs in error state must receive `aria-invalid="true"` and associate with their error description via `aria-describedby`.

## 4. Text Resizing
- The layout must not break, clip text, or produce horizontal page scrolls when the browser text size is scaled up to 200%.

