/**
 * NAVIGATION & BREADCRUMB SCRIPT
 * Framework: Sikkim Government Services Prototype Framework
 */

const GovNav = (() => {
  function init() {
    highlightActiveNavLink();
    initMobileNav();
  }

  /**
   * Automatically highlights active nav link matching current page URL
   */
  function highlightActiveNavLink() {
    const rawPath = window.location.pathname.split('/').pop();
    const currentPath = rawPath || 'framework-demo.html';
    
    // Header links and sidebar links (excluding dropdown toggles and fragment hashes)
    const navLinks = document.querySelectorAll('.gov-navbar .nav-link:not(.dropdown-toggle), .gov-sidebar-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      // Extract filename from href
      const hrefFile = href.split('/').pop().split('#')[0];
      
      if (hrefFile && hrefFile === currentPath) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else if (!href.startsWith('#')) {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Mobile navigation toggle behavior
   */
  function initMobileNav() {
    const sidebarToggle = document.getElementById('gov-sidebar-toggle');
    const sidebar = document.querySelector('.gov-sidebar');

    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('d-none');
        sidebar.classList.toggle('d-block');
      });
    }
  }

  return {
    init,
    highlightActiveNavLink
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  GovNav.init();
});

