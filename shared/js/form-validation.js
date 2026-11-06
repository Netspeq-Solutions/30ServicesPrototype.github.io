/**
 * FORM VALIDATION & INTERACTIVE HELPERS
 * Framework: Sikkim Government Services Prototype Framework
 * 
 * Complies with GIGW 3.0 form validation and accessible error feedback standards.
 */

const GovForm = (() => {
  const PATTERNS = {
    mobile: /^[6-9]\d{9}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    pincode: /^\d{6}$/,
    aadhaar: /^\d{12}$/,
    pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  };

  /**
   * Validate a single input field
   * @param {HTMLElement} input 
   * @returns {boolean} isValid
   */
  function validateField(input) {
    if (input.disabled || input.type === 'hidden') return true;

    let isValid = true;
    let errorMessage = '';

    const val = input.value ? input.value.trim() : '';
    const isRequired = input.hasAttribute('required') || input.classList.contains('required');

    // 1. Required check
    if (isRequired) {
      if (input.type === 'checkbox' || input.type === 'radio') {
        const name = input.name;
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        if (!checked) {
          isValid = false;
          errorMessage = 'Please make a selection.';
        }
      } else if (!val) {
        isValid = false;
        errorMessage = 'This field is mandatory.';
      }
    }

    // 2. Pattern checks if value is present
    if (isValid && val) {
      const type = input.getAttribute('data-validate') || input.type;

      if (type === 'mobile' && !PATTERNS.mobile.test(val.replace(/\s+/g, ''))) {
        isValid = false;
        errorMessage = 'Enter a valid 10-digit Indian mobile number.';
      } else if (type === 'email' && !PATTERNS.email.test(val)) {
        isValid = false;
        errorMessage = 'Enter a valid email address.';
      } else if (type === 'pincode' && !PATTERNS.pincode.test(val)) {
        isValid = false;
        errorMessage = 'Enter a valid 6-digit postal PIN code.';
      } else if (type === 'aadhaar' && !PATTERNS.aadhaar.test(val.replace(/\s+/g, ''))) {
        isValid = false;
        errorMessage = 'Enter a valid 12-digit Aadhaar number.';
      } else if (type === 'pan' && !PATTERNS.pan.test(val.toUpperCase())) {
        isValid = false;
        errorMessage = 'Enter a valid 10-character PAN number (e.g. ABCDE1234F).';
      }
    }

    // Update UI states
    setFieldValidationState(input, isValid, errorMessage);
    return isValid;
  }

  /**
   * Set UI visual feedback and accessibility attributes on an input
   */
  function setFieldValidationState(input, isValid, message) {
    let feedbackEl = input.parentElement.querySelector('.invalid-feedback');
    if (!feedbackEl) {
      feedbackEl = document.createElement('div');
      feedbackEl.className = 'invalid-feedback';
      input.parentElement.appendChild(feedbackEl);
    }

    if (!isValid) {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      input.setAttribute('aria-invalid', 'true');
      feedbackEl.textContent = message;
      feedbackEl.style.display = 'block';
    } else {
      input.classList.remove('is-invalid');
      if (input.value.trim()) {
        input.classList.add('is-valid');
      }
      input.removeAttribute('aria-invalid');
      feedbackEl.textContent = '';
      feedbackEl.style.display = 'none';
    }
  }

  /**
   * Validate entire form or fieldset container
   * @param {HTMLElement} formOrContainer
   * @returns {boolean} isValid
   */
  function validateContainer(container) {
    const inputs = container.querySelectorAll('input, select, textarea');
    let allValid = true;
    let firstInvalid = null;

    inputs.forEach(input => {
      const valid = validateField(input);
      if (!valid) {
        allValid = false;
        if (!firstInvalid) firstInvalid = input;
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
    }

    return allValid;
  }

  /**
   * Attach live validation listeners to forms with .needs-gov-validation
   */
  function init() {
    const forms = document.querySelectorAll('form.needs-gov-validation');
    forms.forEach(form => {
      form.setAttribute('novalidate', 'true');

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const isValid = validateContainer(form);
        if (isValid) {
          GovApp.showNotification('Application validated successfully!', 'success');
        } else {
          GovApp.showNotification('Please correct the highlighted errors before proceeding.', 'danger');
        }
      });

      // Real-time blur validation
      form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
          if (field.classList.contains('is-invalid')) {
            validateField(field);
          }
        });
      });
    });

    initConditionalFields();
  }

  /**
   * Interactive conditional fields (e.g., if "Are you a Sikkim Resident?" is Yes -> show Certificate No)
   */
  function initConditionalFields() {
    const triggers = document.querySelectorAll('[data-toggle-target]');
    triggers.forEach(trigger => {
      const handler = () => {
        const targetId = trigger.getAttribute('data-toggle-target');
        const expectedValue = trigger.getAttribute('data-toggle-value');
        const targetEl = document.getElementById(targetId);

        if (!targetEl) return;

        let shouldShow = false;
        if (trigger.type === 'checkbox') {
          shouldShow = trigger.checked;
        } else if (trigger.type === 'radio') {
          shouldShow = trigger.checked && trigger.value === expectedValue;
        } else {
          shouldShow = trigger.value === expectedValue;
        }

        targetEl.style.display = shouldShow ? 'block' : 'none';
        // Toggle required on child inputs
        targetEl.querySelectorAll('input, select, textarea').forEach(child => {
          if (shouldShow) {
            if (child.dataset.wasRequired) child.required = true;
          } else {
            if (child.required) child.dataset.wasRequired = 'true';
            child.required = false;
            child.classList.remove('is-invalid', 'is-valid');
          }
        });
      };

      trigger.addEventListener('change', handler);
      // Run once initially
      handler();
    });
  }

  return {
    init,
    validateField,
    validateContainer
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  GovForm.init();
});

