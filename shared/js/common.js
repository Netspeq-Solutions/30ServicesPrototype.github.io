/**
 * COMMON UTILITY & ACCESSIBILITY JAVASCRIPT
 * Framework: Sikkim Government Services Prototype Framework
 * 
 * Includes:
 * - Font Resizer (A-, A, A+)
 * - Theme Switcher & High Contrast Mode
 * - Lightweight Component Loader (for Live Server)
 * - Notification / Toast Helper
 */

const GovApp = (() => {
  // Current accessibility font scale
  let currentFontScale = 1.0;

  /**
   * Initialize accessibility and utility features
   */
  function init() {
    initAccessibilityToolbar();
    initThemeFromStorage();
    initToasts();
  }

  /**
   * Accessibility Toolbar: Font size adjustment and Contrast toggle
   */
  function initAccessibilityToolbar() {
    // Font resize controls
    const btnDecrease = document.getElementById('btn-font-decrease');
    const btnReset = document.getElementById('btn-font-reset');
    const btnIncrease = document.getElementById('btn-font-increase');

    if (btnDecrease) {
      btnDecrease.addEventListener('click', () => setFontScale(currentFontScale - 0.1));
    }
    if (btnReset) {
      btnReset.addEventListener('click', () => setFontScale(1.0));
    }
    if (btnIncrease) {
      btnIncrease.addEventListener('click', () => setFontScale(currentFontScale + 0.1));
    }

    // High Contrast toggle
    const btnContrast = document.getElementById('btn-contrast-toggle');
    if (btnContrast) {
      btnContrast.addEventListener('click', toggleHighContrast);
    }

    // Theme selector if present
    const themeSelector = document.getElementById('gov-theme-select');
    if (themeSelector) {
      themeSelector.addEventListener('change', (e) => setTheme(e.target.value));
    }
  }

  /**
   * Set root font scale within accessible bounds (0.85 to 1.25)
   */
  function setFontScale(scale) {
    if (scale < 0.85) scale = 0.85;
    if (scale > 1.25) scale = 1.25;
    currentFontScale = Math.round(scale * 100) / 100;
    document.documentElement.style.setProperty('--gov-font-scale', currentFontScale);
    try {
      localStorage.setItem('gov_font_scale', currentFontScale);
    } catch (e) {
      // Ignore if localStorage unavailable
    }
  }

  /**
   * Toggle GIGW High Contrast Mode
   */
  function toggleHighContrast() {
    const isHighContrast = document.body.getAttribute('data-contrast') === 'high';
    if (isHighContrast) {
      document.body.removeAttribute('data-contrast');
      try { localStorage.removeItem('gov_contrast'); } catch (e) {}
    } else {
      document.body.setAttribute('data-contrast', 'high');
      try { localStorage.setItem('gov_contrast', 'high'); } catch (e) {}
    }
  }

  /**
   * Set Departmental Theme
   * @param {string} themeName - e.g. 'default', 'forest-green', 'saffron-maroon', 'royal-navy', 'teal'
   */
  function setTheme(themeName) {
    if (!themeName || themeName === 'default') {
      document.body.removeAttribute('data-theme');
      try { localStorage.removeItem('gov_theme'); } catch (e) {}
    } else {
      document.body.setAttribute('data-theme', themeName);
      try { localStorage.setItem('gov_theme', themeName); } catch (e) {}
    }
  }

  /**
   * Load saved theme and contrast preferences from localStorage
   */
  function initThemeFromStorage() {
    try {
      const savedTheme = localStorage.getItem('gov_theme');
      if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        const themeSelector = document.getElementById('gov-theme-select');
        if (themeSelector) themeSelector.value = savedTheme;
      }

      const savedContrast = localStorage.getItem('gov_contrast');
      if (savedContrast === 'high') {
        document.body.setAttribute('data-contrast', 'high');
      }

      const savedScale = localStorage.getItem('gov_font_scale');
      if (savedScale) {
        setFontScale(parseFloat(savedScale));
      }
    } catch (e) {
      // Storage unavailable in restricted sandboxes
    }
  }

  /**
   * Lightweight Component Loader for VS Code Live Server
   * Fetches an HTML fragment and inserts it into the target selector.
   * Note: Works seamlessly under HTTP/HTTPS (Live Server). Browsers block fetch under file://.
   * 
   * @param {string} selector - CSS selector (e.g., '#app-header')
   * @param {string} componentUrl - Path to HTML component (e.g., '/shared/components/header.html')
   */
  async function loadComponent(selector, componentUrl) {
    const target = document.querySelector(selector);
    if (!target) return;

    try {
      const response = await fetch(componentUrl);
      if (!response.ok) {
        throw new Error(`Failed to load component: ${componentUrl} (${response.status})`);
      }
      const html = await response.text();
      target.innerHTML = html;
      // Re-trigger accessibility listeners and navigation state if loaded dynamically
      initAccessibilityToolbar();
      if (typeof GovNav !== 'undefined' && GovNav.highlightActiveNavLink) {
        GovNav.highlightActiveNavLink();
      }
    } catch (err) {
      console.warn(`[GovApp] Could not load ${componentUrl}. Note: If opening via file://, use VS Code Live Server instead.`, err);
    }
  }

  /**
   * Lightweight Toast / Notification Trigger
   */
  function showNotification(message, type = 'info', duration = 4000) {
    let container = document.getElementById('gov-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'gov-toast-container';
      container.style.position = 'fixed';
      container.style.top = '20px';
      container.style.right = '20px';
      container.style.zIndex = '99999';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '10px';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `alert alert-${type} shadow-sm d-flex align-items-center mb-0 fade show`;
    toast.setAttribute('role', 'alert');
    toast.style.minWidth = '280px';
    toast.innerHTML = `
      <div class="flex-grow-1">${message}</div>
      <button type="button" class="btn-close ms-2" aria-label="Close"></button>
    `;

    toast.querySelector('.btn-close').addEventListener('click', () => toast.remove());
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, duration);
  }

  function initToasts() {
    // Placeholder for global toast listeners
  }

  return {
    init,
    setFontScale,
    toggleHighContrast,
    setTheme,
    loadComponent,
    showNotification
  };
})();

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  GovApp.init();
});

