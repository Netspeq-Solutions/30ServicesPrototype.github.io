# Prototype Functionality & Mock Data Rules

## 1. Zero Backend Philosophy
Every service prototype must function completely in the client browser without expecting an active backend server, database connection, or external API endpoint.

## 2. Interactive Mock Behaviors
To make client demonstrations compelling and realistic:
1. **Form Validation**: Submitting invalid forms must trigger visible red borders, accessible error messages, and scroll focus to the first invalid field.
2. **Conditional Fields**: Toggling conditional radio buttons (e.g., "Do you possess land in Sikkim? Yes/No") must show or hide corresponding field blocks dynamically.
3. **Document Upload Simulation**: Dropping a file into `.file-dropzone` must display file details, size validation, and allow file removal.
4. **Draft Saving**: Clicking "Save Draft" should trigger a reassuring notification toast and maintain filled fields.
5. **Workflow Simulation**: Clicking "Submit Application" must simulate real submission by showing a success alert and redirecting to the tracking screen with an active Application Reference Number (ARN).
6. **Officer Actions**: Approving, rejecting, or querying an application in the officer review screen must update the visual status badge and display realistic confirmation alerts.

## 3. Preservation of Approved Work
- Once a service screen is demonstrated and approved by the client, do NOT redesign layout grids or alter visual themes unless explicitly instructed.
- Always isolate experiments inside draft services or branch directories.

