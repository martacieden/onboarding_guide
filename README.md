# Way2B1 NextGen Onboarding Guide

This is an interactive onboarding guide for Way2B1 NextGen platform, designed to help new users get familiar with the platform's features and workflows.

## 🚀 Features

- **Interactive Onboarding Flow**: Step-by-step guide through the platform
- **Profile Setup**: User profile creation with name, surname, phone, and role selection
- **Task-Based Learning**: Onboarding tasks with interactive checklist
- **Contextual Hints**: Tooltips and hints for first-time users
- **Progress Tracking**: Visual progress indicators for onboarding completion
- **Celebration Modal**: Visual celebration upon completing onboarding

## 📋 Onboarding Flow

### 1. Profile Details Form

The onboarding starts with a profile details form where users enter:

- **First name** (required)
- **Last name** (required)
- **Phone** (optional, with country code selector)
- **Role** (required, dropdown with options):
  - Family Principal / CEO
  - Operations Manager
  - Investment Advisor
  - CFO / Accountant
  - Executive Assistant
  - Team Collaborator
  - Other

**Location**: `components/login-with-role.tsx`

**Screenshot**: See `screenshots/profile-form.png` (to be added)

### 2. Welcome Popup

After profile submission, users see a welcome popup introducing them to Way2B1 NextGen.

**Location**: `components/next-gen-welcome.tsx`

### 3. Onboarding Task

An onboarding task is automatically created with a checklist of 6 items:

1. Review your homepage—this is where your assigned items appear
2. Check the left navigation to see Decisions, Projects, and other modules
3. Leave a comment on this task (By the way, you can @mentioning someone)
4. Try changing this task's status using the dropdown
5. Explore one module that interests you (Decisions, Projects, etc.)
6. Mark this task complete when you're ready

**Location**: `app/tasks/[id]/page.tsx`

### 4. Interactive Checklist

Each checklist item can have an interactive hint (Info icon) that provides guidance:
- Click the Info icon to see a tooltip with instructions
- Click "Show" button to navigate to the relevant section
- Some items auto-complete when actions are performed

**Location**: `components/onboarding/InteractiveChecklistHint.tsx`

### 5. Completion Celebration

Upon completing all checklist items, a celebration modal appears with:
- Confetti animation
- Success message
- "Close" button to return to homepage

**Location**: `components/onboarding/OnboardingCompletionCelebration.tsx`

## 🎯 Key Components

- **Profile Form**: `components/login-with-role.tsx`
- **Welcome Popup**: `components/next-gen-welcome.tsx`
- **Onboarding Banner**: `components/onboarding/OnboardingBanner.tsx`
- **Task Detail Page**: `app/tasks/[id]/page.tsx`
- **Hotspot**: `components/tasks-onboarding-hotspot.tsx` - Pulsing dot next to onboarding task name
- **Interactive Hints**: `components/onboarding/InteractiveChecklistHint.tsx`
- **Completion Modal**: `components/onboarding/OnboardingCompletionCelebration.tsx`
- **Toast Notifications**: `components/ui/toast.tsx`

## 🛠️ Technical Details

- **Framework**: Next.js 16.0.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks + localStorage
- **Deployment**: Vercel

## 📸 Screenshots

Screenshots of key onboarding steps should be added to the `screenshots/` directory:

- `screenshots/profile-form.png` - Profile details form
- `screenshots/welcome-popup.png` - Welcome popup
- `screenshots/onboarding-task.png` - Onboarding task detail page
- `screenshots/completion-modal.png` - Completion celebration modal

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Run development server: `pnpm dev`
4. Open `http://localhost:3000`

## 📝 Notes

- Onboarding progress is stored in `localStorage`
- To reset onboarding, clear `localStorage` or use the reset script
- The onboarding task is automatically created on first login

## 🔗 Links

- **Live Demo**: [onboarding-guide-tau.vercel.app](https://onboarding-guide-tau.vercel.app)
- **Repository**: [GitHub](https://github.com/martacieden/onboarding_guide)

