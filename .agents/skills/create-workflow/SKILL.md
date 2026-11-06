---
name: create-workflow
description: Instructions for modeling and demonstrating end-to-end applicant and departmental officer workflows using frontend mock data.
---

# Workflow: Create Applicant & Officer Workflow Demonstration

Use this skill to model complete lifecycle workflows: from citizen submission through officer scrutiny, inquiry, and final certificate issuance.

## Workflow Phases to Demonstrate

```
[Citizen Submits Form] 
       ↓ (Generates ARN e.g. SK-2026-LRD-XXXXX)
[Officer Work Queue]
       ↓ (Officer opens Scrutiny Desk)
[Officer Decision: Approve / Query / Reject]
       ↓
[Tracking Screen & Certificate Generation]
```

## Step-by-Step Instructions

### Step 1: Assign Realistic Mock References
- Generate a context-appropriate Sikkim ARN (e.g., `SK-2026-<DEPT>-<NUMBER>`).
- Reference realistic Sikkim administrative circles: Gangtok, Namchi, Gyalshing, Mangan, Pakyong, Soreng.

### Step 2: Establish the Status Tracking Stepper
In `track.html`, configure the 5-point timeline:
1. Online Submission (Completed)
2. Scrutiny by Dealing Assistant (Completed)
3. Field Verification / Revenue Inspector (Active or Completed)
4. Authority Sanction (Sub-Divisional Magistrate / Director)
5. Digital Certificate Issuance

### Step 3: Configure the Officer Scrutiny Desk
In `review.html`:
- Render the 2-column split view (Applicant data & docs on left, verification checklist & disposal orders on right).
- Include verification checklist checkboxes.
- Provide disposal order radios:
  - **Approve**: Dispatches certificate, updates status badge to green "Approved".
  - **Query**: Prompts officer remarks, sends simulated clarification alert to applicant.
  - **Reject**: Mandates formal statutory rejection reason.

### Step 4: Add Simulated Transition Feedback
Utilize `GovApp.showNotification(message, type)` to provide realistic UI alerts when actions are triggered during client demonstrations.

