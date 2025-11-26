"use client"

import { useState } from "react"
import { Info, Eye, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChecklistHint {
  checklistId: string
  title: string
  description: string
  targetElementId?: string
  targetUrl?: string
  scrollToSection?: string
}

const checklistHints: Record<string, ChecklistHint> = {
  "checklist-1": {
    checklistId: "checklist-1",
    title: "Homepage",
    description: "This is your homepage. Here you'll see all tasks and decisions assigned to you.",
    targetUrl: "/",
  },
  "checklist-2": {
    checklistId: "checklist-2",
    title: "Navigation",
    description: "The left navigation panel contains all modules: Decisions, Projects, Tasks, Budgets, and more.",
    targetElementId: "navigation",
  },
  "checklist-3": {
    checklistId: "checklist-3",
    title: "Comments with @mention",
    description: "Add a comment below and use @ to mention users. For example: @John Doe",
    targetElementId: "comment-input",
    scrollToSection: "comments",
  },
  "checklist-4": {
    checklistId: "checklist-4",
    title: "Change Status",
    description: "Use the status dropdown in the Details section to change the task status.",
    targetElementId: "task-status",
    scrollToSection: "details",
  },
  "checklist-5": {
    checklistId: "checklist-5",
    title: "Explore Modules",
    description: "Navigate to any module through the left navigation: Decisions, Projects, Tasks, etc.",
    targetElementId: "navigation",
  },
  "checklist-6": {
    checklistId: "checklist-6",
    title: "Complete Task",
    description: "After completing all items, you can mark this task as complete by changing the status to 'Done'.",
  },
}

interface InteractiveChecklistHintProps {
  checklistId: string
  isCompleted: boolean
  onShow?: () => void
  onChecklistToggle?: (itemId: string, completed: boolean) => void
}

export function InteractiveChecklistHint({ checklistId, isCompleted, onShow, onChecklistToggle }: InteractiveChecklistHintProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const hint = checklistHints[checklistId]

  if (!hint || isCompleted) return null

  const handleShow = () => {
    if (onShow) {
      onShow()
    }

    // Якщо є URL для навігації
    if (hint.targetUrl) {
      // Для checklist-1 (Homepage) відмічаємо чекбокс перед переходом
      if (checklistId === "checklist-1" && onChecklistToggle && !isCompleted) {
        onChecklistToggle(checklistId, true)
        // Показуємо toast через event, бо ми переходимо на іншу сторінку
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("showToast", {
            detail: { message: "Great! You've completed: Review your homepage" }
          }))
        }, 100)
      }
      window.location.href = hint.targetUrl
      return
    }

    // Якщо є секція для скролу
    if (hint.scrollToSection) {
      const section = document.getElementById(hint.scrollToSection)
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "center" })
        // Підсвітка елемента
        setTimeout(() => {
          const target = document.getElementById(hint.targetElementId || "")
          if (target) {
            target.classList.add("highlight-pulse")
            setTimeout(() => {
              target.classList.remove("highlight-pulse")
            }, 2000)
          }
        }, 500)
      }
    } else if (hint.targetElementId) {
      // Підсвітка елемента без скролу
      const target = document.getElementById(hint.targetElementId)
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" })
        setTimeout(() => {
          target.classList.add("highlight-pulse")
          setTimeout(() => {
            target.classList.remove("highlight-pulse")
          }, 2000)
        }, 500)
      }
    }

    setShowTooltip(false)
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className="ml-2 p-1 hover:bg-secondary rounded transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Show hint"
        >
          <Info className="w-3.5 h-3.5" />
        </button>

        {showTooltip && (
          <div className="absolute left-0 bottom-full mb-2 w-80 bg-card border border-border rounded-lg shadow-lg p-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-sm text-foreground">{hint.title}</h4>
            <button
              onClick={() => setShowTooltip(false)}
              className="p-0.5 hover:bg-secondary rounded transition-colors text-muted-foreground"
              aria-label="Close"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{hint.description}</p>
          <Button
            onClick={handleShow}
            size="sm"
            className="w-full flex items-center justify-center gap-2 text-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            Show
          </Button>
          </div>
        )}
      </div>
    </>
  )
}

