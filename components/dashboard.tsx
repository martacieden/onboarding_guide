"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Workflow, ClipboardList } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { OnboardingBanner } from "@/components/onboarding/OnboardingBanner"
import { ContextualTooltip } from "@/components/contextual-tooltips/ContextualTooltip"

export function Dashboard() {
  const [userName, setUserName] = useState("")
  const [userInitials, setUserInitials] = useState("")
  const [onboardingTask, setOnboardingTask] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const firstName = localStorage.getItem("way2b1_user_first_name") || ""
      const lastName = localStorage.getItem("way2b1_user_last_name") || ""
      setUserName(firstName)
      setUserInitials(
        (firstName?.[0] || "") + (lastName?.[0] || "") || "MK"
      )
      
      // Load onboarding task
      const loadOnboardingTask = () => {
        const tasks = JSON.parse(localStorage.getItem("way2b1_tasks") || "[]")
        const task = tasks.find(
          (t: any) => t.name === "Welcome to NextGen — Your Quick Start Guide"
        )
        setOnboardingTask(task || null)
      }
      
      loadOnboardingTask()
      
      // Listen for task updates
      const handleTaskUpdate = () => {
        loadOnboardingTask()
      }
      window.addEventListener("taskUpdated", handleTaskUpdate)
      window.addEventListener("storage", handleTaskUpdate)
      
      return () => {
        window.removeEventListener("taskUpdated", handleTaskUpdate)
        window.removeEventListener("storage", handleTaskUpdate)
      }
    }
  }, [])

  const handleCreateTask = () => {
    router.push("/tasks")
    setTimeout(() => {
      const event = new CustomEvent("createTask")
      window.dispatchEvent(event)
    }, 100)
  }

  const handleCreateDecision = () => {
    router.push("/decisions")
    setTimeout(() => {
      const event = new CustomEvent("createDecision")
      window.dispatchEvent(event)
    }, 100)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Welcome section */}
      {userName && (
        <div className="pt-6 pb-4">
          <div className="flex items-center justify-between px-6">
            <div id="home-welcome-section" className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gray-200 text-gray-600 text-sm font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-lg font-semibold text-gray-900">
                Welcome back, {userName}!
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                id="home-new-task-button"
                onClick={handleCreateTask}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New task
              </button>
              <button
                id="home-new-decision-button"
                onClick={handleCreateDecision}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New decision
              </button>
            </div>
          </div>
          <div className="border-b border-gray-200 mt-4"></div>
        </div>
      )}

      {/* Onboarding Banner - placed right after welcome section */}
      <OnboardingBanner />

      {/* Contextual Tooltips */}
      <ContextualTooltip
        tooltipKey="new-task"
        targetElementId="home-new-task-button"
        message="Click here to create a new task and start organizing your work"
        position="bottom"
        delay={2000}
      />
      <ContextualTooltip
        tooltipKey="new-decision"
        targetElementId="home-new-decision-button"
        message="Create a decision to track important choices and approvals"
        position="bottom"
        delay={2500}
      />

      {/* Decisions and Tasks Sections */}
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Decisions Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Decisions</h2>
            <button
              onClick={handleCreateDecision}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Decision
            </button>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Workflow className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add your first decision</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Create requests needing approval and record keeping
              </p>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
            <button
              id="home-new-task-button"
              onClick={handleCreateTask}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
          {onboardingTask ? (
            <div className="bg-white rounded-lg border border-gray-200">
              <div
                onClick={() => router.push(`/tasks/${onboardingTask.id}`)}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {onboardingTask.title || onboardingTask.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {onboardingTask.taskId || onboardingTask.id}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    {onboardingTask.status || "Created"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12">
              <div className="text-center max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <ClipboardList className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No records to show</h3>
                <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                  Add new records or import data to get started. Try adjusting your filters or search settings if
                  you're expecting to see something specific.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
