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

The profile form (`components/login-with-role.tsx`) displays a split-screen layout:

### Left Panel (Form Area)
- **Header**: Blue square logo with white 'W' and "WAY2B1" text in top-left corner
- **Title**: "Profile details" in large, bold, dark gray font
- **Description**: Welcome message: "Welcome! Let's personalize your profile for a better experience on our platform. You can make changes anytime in your settings."
- **Input Fields**:
  - **First name** (required) - Empty white input field with light gray border
  - **Last name** (required) - Empty white input field with light gray border, positioned to the right of First name
  - **Phone** (optional) - Two connected input elements:
    - Dropdown showing US flag, "+1", and down arrow
    - Input field with placeholder "+1 (123) 456-7890"
  - **Role** (required) - Dropdown field displaying "Select your role" in light gray text with down arrow
- **Button**: Wide rectangular button with light purple/blue background (#4F7CFF) and white text "Continue" (disabled until all required fields are filled)

### Right Panel
- Large empty area with very light blue/gray gradient background (`from-blue-50 to-indigo-50`)
- Currently displays profile illustration SVG centered in the panel

### Visual Details
- Form is centered vertically on the left side
- Max width of form container: `max-w-2xl`
- Padding: `p-12` for form area
- Logo positioned absolutely at `top-8 left-8`
- Form fields use Tailwind classes for styling with focus states on primary blue color

