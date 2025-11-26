"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, ArrowRight, Sparkles } from "lucide-react"

export function OnboardingBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window === "undefined") return

    // Check if onboarding task exists and is completed
    const checkOnboardingStatus = () => {
      const tasks = JSON.parse(localStorage.getItem("way2b1_tasks") || "[]")
      const onboardingTask = tasks.find(
        (task: any) => task.name === "Welcome to NextGen — Your Quick Start Guide"
      )

      if (!onboardingTask) {
        // No onboarding task - don't show banner
        setIsVisible(false)
        return
      }

      // Check if onboarding is completed
      if (onboardingTask.checklistItems) {
        const allCompleted = onboardingTask.checklistItems.every(
          (item: any) => item.completed === true
        )
        if (allCompleted) {
          setOnboardingCompleted(true)
          setIsVisible(false)
          return
        }
      }

      // Onboarding task exists and is not completed - show banner
      // Check if dismissed in this session
      const dismissedThisSession = sessionStorage.getItem("onboarding_banner_dismissed_session") === "true"
      if (!dismissedThisSession) {
        setIsVisible(true)
      }
    }

    // Check status immediately and periodically
    checkOnboardingStatus()
    const interval = setInterval(checkOnboardingStatus, 1000)

    // Listen for task updates
    const handleTaskUpdate = () => {
      checkOnboardingStatus()
    }
    window.addEventListener("storage", handleTaskUpdate)
    window.addEventListener("taskUpdated", handleTaskUpdate as EventListener)

    return () => {
      clearInterval(interval)
      window.removeEventListener("storage", handleTaskUpdate)
      window.removeEventListener("taskUpdated", handleTaskUpdate as EventListener)
    }
  }, [])

  const handleDismiss = () => {
    // Don't permanently dismiss - just hide temporarily
    // Banner will show again if onboarding is not completed
    setIsVisible(false)
    // Set a temporary flag to hide for this session
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_banner_dismissed_session", "true")
    }
  }

  const handleGoToTasks = () => {
    // Знаходимо onboarding task і переходимо на його сторінку
    if (typeof window !== "undefined") {
      const tasks = JSON.parse(localStorage.getItem("way2b1_tasks") || "[]")
      const onboardingTask = tasks.find(
        (task: any) => task.name === "Welcome to NextGen — Your Quick Start Guide"
      )
      
      if (onboardingTask) {
        // Переходимо безпосередньо на сторінку onboarding task
        router.push(`/tasks/${onboardingTask.id}`)
        return
      }
    }
    router.push("/tasks")
  }

  if (!isVisible) return null

  return (
    <div className="px-6 py-4 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 hover:bg-white/80 rounded-lg transition-colors z-10"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="flex items-start gap-4 relative z-0">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Start your onboarding
            </h3>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              Your onboarding will take place in Tasks. Simply follow the steps in the tasks, and you'll learn the platform in 2–3 minutes.
            </p>
            <button
              onClick={handleGoToTasks}
              className="inline-flex items-center gap-2 bg-[#4F7CFF] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#4F7CFF]/90 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Go to Tasks
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

