# Component Usage & Implementation Guidelines

This guide demonstrates how to instantiate and reuse common HTML components across service prototypes.

---

## 1. Multi-Step Form Stepper (`.gov-stepper`)

Use the stepper to guide citizens through multi-phase application forms without causing cognitive overload:

```html
<ul class="gov-stepper" id="application-stepper">
  <li class="gov-step-item completed" id="step-tab-1">
    <div class="gov-step-circle"><i class="bi bi-check"></i></div>
    <span class="gov-step-label">Applicant Details</span>
  </li>
  <li class="gov-step-item active" id="step-tab-2">
    <div class="gov-step-circle">2</div>
    <span class="gov-step-label">Service Specifics</span>
  </li>
  <li class="gov-step-item" id="step-tab-3">
    <div class="gov-step-circle">3</div>
    <span class="gov-step-label">Enclosures</span>
  </li>
  <li class="gov-step-item" id="step-tab-4">
    <div class="gov-step-circle">4</div>
    <span class="gov-step-label">Review & Submit</span>
  </li>
</ul>
```

---

## 2. Form Input with Validation & Helpers

```html
<div class="mb-3">
  <label for="applicantMobile" class="form-label required">Mobile Number</label>
  <input type="tel" class="form-control" id="applicantMobile" name="applicantMobile" 
         data-validate="mobile" required placeholder="10-digit Indian Mobile">
  <div class="form-text">SMS alerts will be dispatched to this number.</div>
  <div class="invalid-feedback">Please enter a valid 10-digit mobile number.</div>
</div>
```

Supported validation tags (`data-validate`):
- `mobile`: Checks for `/^[6-9]\d{9}$/`
- `email`: Checks RFC standard email structure
- `pincode`: Checks 6-digit Indian PIN code
- `aadhaar`: Checks 12-digit format
- `pan`: Checks 10-character alphanumeric PAN format

---

## 3. Interactive File Upload Dropzone

```html
<div class="file-dropzone" data-max-size="2048">
  <i class="bi bi-cloud-arrow-up"></i>
  <div class="fw-semibold">Click or drag & drop file here</div>
  <div class="small text-muted">Allowed: PDF, JPG, PNG (Max: 2MB)</div>
  <input type="file" class="d-none dropzone-input" accept=".pdf,.jpg,.jpeg,.png">
</div>
<!-- Preview items dynamically mount inside .file-preview-list -->
```

---

## 4. Application Tracking Timeline (`.gov-timeline`)

```html
<div class="gov-timeline">
  <div class="gov-timeline-item completed">
    <div class="gov-timeline-point"><i class="bi bi-check"></i></div>
    <div class="gov-timeline-content">
      <div class="fw-bold text-success">Application Submitted Online</div>
      <div class="small text-muted">28 Oct 2026, 10:30 AM</div>
    </div>
  </div>
  <div class="gov-timeline-item active">
    <div class="gov-timeline-point">2</div>
    <div class="gov-timeline-content border-primary">
      <div class="fw-bold text-primary">Under Field Scrutiny</div>
      <div class="small text-muted">Dealing Assistant reviewing revenue records.</div>
    </div>
  </div>
  <div class="gov-timeline-item">
    <div class="gov-timeline-point">3</div>
    <div class="gov-timeline-content opacity-75">
      <div class="fw-bold text-muted">Order & Sanction</div>
      <div class="small text-muted">Pending officer review.</div>
    </div>
  </div>
</div>
```

---

## 5. Status Badges

```html
<span class="gov-badge gov-badge-draft"><i class="bi bi-pencil"></i> Draft</span>
<span class="gov-badge gov-badge-submitted"><i class="bi bi-clock"></i> Submitted</span>
<span class="gov-badge gov-badge-review"><i class="bi bi-hourglass-split"></i> Under Review</span>
<span class="gov-badge gov-badge-approved"><i class="bi bi-check-circle"></i> Approved</span>
<span class="gov-badge gov-badge-rejected"><i class="bi bi-x-circle"></i> Rejected</span>
```

