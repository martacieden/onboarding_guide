"use client"

/**
 * Creates an onboarding task for first-time users
 * Task includes a checklist with 5 items to guide users through the platform
 */
export function createOnboardingTask() {
  if (typeof window === "undefined") return

  // Check if onboarding task already exists
  const existingTasks = JSON.parse(localStorage.getItem("way2b1_tasks") || "[]")
  const onboardingTaskExists = existingTasks.some(
    (task: any) => task.name === "Welcome to NextGen — Your Quick Start Guide"
  )

  if (onboardingTaskExists) {
    return // Don't create duplicate
  }

  // Get current user info
  const firstName = localStorage.getItem("way2b1_user_first_name") || ""
  const lastName = localStorage.getItem("way2b1_user_last_name") || ""
  const userEmail = localStorage.getItem("way2b1_user_email") || ""
  const assignee = firstName && lastName ? `${firstName} ${lastName}` : userEmail || "Current User"

  // Create onboarding task with checklist
  const onboardingTask = {
    id: `onboarding-${Date.now()}`,
    taskId: `ONBOARD-${Date.now().toString().slice(-4)}`,
    name: "Welcome to NextGen — Your Quick Start Guide",
    priority: "Normal",
    status: "Created",
    assignee: assignee,
    dueDate: "—",
    reporter: assignee,
    category: "Onboarding",
    project: "Onboarding",
    amount: "—",
    checklistItems: [
      {
        id: "checklist-1",
        text: "Review your homepage—this is where your assigned items appear",
        completed: false,
      },
      {
        id: "checklist-2",
        text: "Check the left navigation to see Decisions, Projects, and other modules",
        completed: false,
      },
      {
        id: "checklist-3",
        text: "Leave a comment on this task (By the way, you can @mentioning someone)",
        completed: false,
      },
      {
        id: "checklist-4",
        text: "Try changing this task's status using the dropdown",
        completed: false,
      },
      {
        id: "checklist-5",
        text: "Explore one module that interests you (Decisions, Projects, etc.)",
        completed: false,
      },
      {
        id: "checklist-6",
        text: "Mark this task complete when you're ready",
        completed: false,
      },
    ],
  }

  // Add to existing tasks
  const updatedTasks = [...existingTasks, onboardingTask]
  localStorage.setItem("way2b1_tasks", JSON.stringify(updatedTasks))

  // Dispatch event to notify components
  window.dispatchEvent(new CustomEvent("taskUpdated"))
  
  return onboardingTask
}

