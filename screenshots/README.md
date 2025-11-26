# Screenshots Directory

This directory contains screenshots of the onboarding flow.

## Required Screenshots

Please add the following screenshots:

1. **profile-form.png** - Profile details form showing:
   - Logo in top-left corner
   - "Profile details" title
   - Welcome message
   - First name and Last name input fields
   - Phone input with country code selector
   - Role dropdown
   - Continue button
   - Right side with light blue/gray background

2. **welcome-popup.png** - NextGen welcome popup

3. **onboarding-task.png** - Onboarding task detail page with checklist

4. **completion-modal.png** - Completion celebration modal with confetti

5. **hotspot.png** - Pulsing dot hotspot next to task name in tasks table

## Profile Form Description

The profile form (`components/login-with-role.tsx`) displays:

- **Left Panel**: Form with logo, title, description, and input fields
- **Right Panel**: Light blue/gray gradient background (currently shows profile illustration SVG)

The form includes:
- First name field (required)
- Last name field (required)
- Phone field with US flag and +1 country code
- Role dropdown with 7 options
- Continue button (disabled until all required fields are filled)

