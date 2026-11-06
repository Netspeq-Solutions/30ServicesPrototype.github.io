---
name: create-new-service
description: Step-by-step workflow for scaffolding a new Sikkim G2C government service prototype using shared templates.
---

# Workflow: Create a New Government Service Prototype

Use this skill when tasked with establishing a new service prototype under `services/`.

## Prerequisites
- Review service statutory specifications, department name, processing timeline (SLA), fees, and document checklist.

## Step-by-Step Instructions

### Step 1: Establish Service Directory
Create a dedicated folder in `services/` using a standardized slug:
`services/srv-<XX>-<service-name>/` (e.g. `services/srv-01-certificate-of-identification/`).

### Step 2: Copy and Customize Base Templates
Copy the necessary templates from `shared/templates/` into the service folder:
1. `index.html` (copied from `public-portal-template.html` or tailored service landing page).
2. `apply.html` (copied from `application-form-template.html`).
3. `track.html` (copied from `application-tracking-template.html`).
4. `review.html` (copied from `officer-review-template.html`).

### Step 3: Configure Departmental Theming
In the `<body>` tag of every HTML page in the new service:
Set the appropriate theme attribute:
- Land Revenue / Forest: `<body data-theme="forest-green">`
- Tourism / Heritage: `<body data-theme="saffron-maroon">`
- IT / Science: `<body data-theme="royal-navy">`
- Urban Development: `<body data-theme="teal">`
- General Administration: `<body data-theme="default">`

### Step 4: Adjust Relative Asset Paths
Ensure all CSS and JS references resolve correctly from the service folder:
```html
<link rel="stylesheet" href="../../shared/css/gigw-template.css">
<link rel="stylesheet" href="../../shared/css/themes.css">
<link rel="stylesheet" href="../../shared/css/components.css">
<link rel="stylesheet" href="../../shared/css/responsive.css">
...
<script src="../../shared/js/common.js"></script>
<script src="../../shared/js/navigation.js"></script>
<script src="../../shared/js/form-validation.js"></script>
<script src="../../shared/js/file-upload.js"></script>
<script src="../../shared/js/mock-data.js"></script>
```

### Step 5: Customize Service Particulars
- Replace `[Department Name Placeholder]` with the actual Sikkim government department.
- Replace `[Service Title Placeholder]` with the official service title.
- Configure specific form fields in Step 2 of `apply.html`.
- Configure mandatory document checklist in Step 3 of `apply.html`.

### Step 6: Verify in Live Server
Open the new service landing page in the browser via Live Server and confirm no 404 console errors.

### Step 7: Link Service in Central Public Portal Template (Mandatory)
Whenever a service is added or updated:
1. Update `shared/templates/public-portal-template.html` and `templates/public-portal-template.html` under the `<section id="services-section">` grid.
2. Replace a placeholder card or add a new `.service-item` card with:
   - Official Service Title & Department.
   - Appropriate icon and active category badge (`data-category="permits"`, `data-category="certificates"`, etc.).
   - Direct link (`href`) pointing to `../../services/<service-slug>/index.html` (in `shared/templates/`) and `../services/<service-slug>/index.html` (in `templates/`).
3. Update `services/README.md` active service table with the new service link.


