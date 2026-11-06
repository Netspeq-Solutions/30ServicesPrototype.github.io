---
name: modify-existing-service
description: Instructions for safely making incremental updates to an existing service without breaking approved screens or shared components.
---

# Workflow: Modify an Existing Service Prototype

Use this skill when making requested adjustments, adding new fields, or tweaking an existing service prototype.

## Guiding Principles
- **Do No Harm**: Preserve previously demonstrated and approved screens.
- **Service Isolation**: Confine modifications strictly to the targeted service directory (`services/srv-XX-.../`).
- **Never Alter Shared Foundations** unless a global bug has been confirmed and explicitly authorized.

## Step-by-Step Instructions

### Step 1: Inspect Current Service Files
1. Read the target service HTML files (`index.html`, `apply.html`, `track.html`, `review.html`).
2. Identify existing IDs, form input names, and navigation anchors before touching the code.

### Step 2: Formulate Targeted Change Plan
- Define exact sections being added or modified (e.g. "Add marital status field in Step 1", "Add GSTIN verification in Step 2").
- Check if changes require modifications to `data-validate` rules or conditional display logic.

### Step 3: Implement Surgical Edits
- Use semantic Bootstrap 5 markup and existing `.gov-*` classes.
- Ensure all new inputs have associated `<label for="...">` with `.required` indicator if mandatory.
- Maintain existing indentation and code styling.

### Step 4: Validate Navigation & State
- Test that form submission still proceeds smoothly.
- Test that back/next wizard buttons navigate to expected steps.
- Check browser console for any missing selector references.

