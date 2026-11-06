/**
 * DOCUMENT & FILE UPLOAD HANDLER
 * Framework: Sikkim Government Services Prototype Framework
 * 
 * Provides interactive prototype file upload behavior:
 * - Drag-and-drop file dropzone
 * - Client-side size & format checks (e.g. PDF, JPG, PNG < 2MB)
 * - Visual file list with remove actions
 */

const GovUpload = (() => {
  const DEFAULT_MAX_SIZE_KB = 2048; // 2MB
  const DEFAULT_ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

  function init() {
    initDropzones();
    initStandardFileInputs();
  }

  function initDropzones() {
    const dropzones = document.querySelectorAll('.file-dropzone');
    dropzones.forEach(zone => {
      const input = zone.querySelector('input[type="file"]');
      if (!input) return;

      zone.addEventListener('click', (e) => {
        if (e.target !== input) input.click();
      });

      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
      });

      zone.addEventListener('dragleave', () => {
        zone.classList.remove('dragover');
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleFiles(e.dataTransfer.files, zone, input);
        }
      });

      input.addEventListener('change', () => {
        if (input.files && input.files.length > 0) {
          handleFiles(input.files, zone, input);
        }
      });
    });
  }

  function initStandardFileInputs() {
    const inputs = document.querySelectorAll('input[type="file"]:not(.dropzone-input)');
    inputs.forEach(input => {
      input.addEventListener('change', () => {
        if (input.files && input.files.length > 0) {
          const previewContainer = document.getElementById(input.getAttribute('data-preview-target'));
          if (previewContainer) {
            renderFileList(input.files, previewContainer, input);
          }
        }
      });
    });
  }

  function handleFiles(files, zone, input) {
    const previewContainer = zone.parentElement.querySelector('.file-preview-list') || createPreviewContainer(zone);
    renderFileList(files, previewContainer, input);
  }

  function createPreviewContainer(zone) {
    const div = document.createElement('div');
    div.className = 'file-preview-list mt-3';
    zone.parentElement.appendChild(div);
    return div;
  }

  function renderFileList(files, container, input) {
    container.innerHTML = '';
    const maxSizeKb = parseInt(input.getAttribute('data-max-size') || DEFAULT_MAX_SIZE_KB, 10);

    Array.from(files).forEach((file, index) => {
      const sizeKb = Math.round(file.size / 1024);
      const isSizeValid = sizeKb <= maxSizeKb;
      const isTypeValid = DEFAULT_ALLOWED_TYPES.includes(file.type) || file.name.match(/\.(pdf|jpe?g|png)$/i);

      const item = document.createElement('div');
      item.className = `file-preview-item ${!isSizeValid || !isTypeValid ? 'border-danger bg-light-danger' : ''}`;

      const iconClass = file.type === 'application/pdf' || file.name.endsWith('.pdf') 
        ? 'bi-file-earmark-pdf text-danger' 
        : 'bi-file-earmark-image text-primary';

      item.innerHTML = `
        <div class="d-flex align-items-center gap-3">
          <i class="bi ${iconClass} fs-3"></i>
          <div>
            <div class="fw-semibold text-truncate" style="max-width: 260px;" title="${file.name}">${file.name}</div>
            <div class="text-muted small">${sizeKb} KB ${!isSizeValid ? '<span class="text-danger fw-bold">(Exceeds ' + maxSizeKb + ' KB limit)</span>' : ''}</div>
          </div>
        </div>
        <div>
          <button type="button" class="btn btn-sm btn-outline-danger remove-file-btn" aria-label="Remove file">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;

      item.querySelector('.remove-file-btn').addEventListener('click', () => {
        item.remove();
        input.value = '';
        GovApp.showNotification('File removed', 'info');
      });

      container.appendChild(item);

      if (!isSizeValid) {
        GovApp.showNotification(`File "${file.name}" exceeds maximum allowed size of ${maxSizeKb} KB`, 'danger');
      } else if (!isTypeValid) {
        GovApp.showNotification(`File "${file.name}" is not a permitted format (PDF, JPG, PNG only).`, 'danger');
      } else {
        GovApp.showNotification(`File "${file.name}" attached successfully.`, 'success');
      }
    });
  }

  return {
    init,
    renderFileList
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  GovUpload.init();
});

