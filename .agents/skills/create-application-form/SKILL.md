---
name: create-application-form
description: Instructions for constructing complex multi-step government application forms with validation, conditional fields, and document uploads.
---

# Workflow: Create Application Form with Validation & Uploads

Use this skill when constructing or expanding citizen application forms.

## Form Architecture Standards

### 1. Multi-Step Stepper Structure
Every long application form must utilize the standard 4-step wizard structure:
```html
<ul class="gov-stepper" id="application-stepper">
  <li class="gov-step-item active" id="step-tab-1"><div class="gov-step-circle">1</div><span class="gov-step-label">Applicant Info</span></li>
  <li class="gov-step-item" id="step-tab-2"><div class="gov-step-circle">2</div><span class="gov-step-label">Service Details</span></li>
  <li class="gov-step-item" id="step-tab-3"><div class="gov-step-circle">3</div><span class="gov-step-label">Enclosures</span></li>
  <li class="gov-step-item" id="step-tab-4"><div class="gov-step-circle">4</div><span class="gov-step-label">Declaration</span></li>
</ul>
```

### 2. Form Input Standards & Validation Tags
Add validation attributes supported by `form-validation.js`:
- Mandatory field: `required` and label class `.required`
- Indian 10-digit Mobile: `data-validate="mobile"`
- Email: `data-validate="email"`
- 6-digit PIN code: `data-validate="pincode"`
- 12-digit Aadhaar: `data-validate="aadhaar"`
- PAN Number: `data-validate="pan"`

### 3. Implementing Conditional Fields
Use data attributes on triggers to automatically toggle visibility without custom JS:
```html
<input type="radio" name="hasLand" value="yes" 
       data-toggle-target="land-details-block" 
       data-toggle-value="yes">
...
<div id="land-details-block" style="display: none;">
  <!-- Sub-fields enabled only when "yes" is checked -->
</div>
```

### 4. Mandatory Document Enclosures
Use `.file-dropzone` for clean drag-and-drop file upload simulation:
```html
<div class="file-dropzone">
  <i class="bi bi-cloud-arrow-up"></i>
  <div class="fw-semibold">Click or drag & drop file</div>
  <div class="small text-muted">PDF or JPG (Max 2MB)</div>
  <input type="file" class="d-none dropzone-input" accept=".pdf,.jpg,.jpeg,.png">
</div>
```

### 5. Review & Self-Declaration
Step 4 must always contain:
1. Summary card displaying entered applicant name, mobile, and service type.
2. Statutory legal declaration checkbox with severe warning for fraudulent submissions.
3. "Save Draft" and "Submit Application" buttons.

