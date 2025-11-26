"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle2, Circle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

interface Task {
  id: string
  taskId?: string
  name: string
  title?: string
  status: string
  priority: string
  assignee?: string
  dueDate?: string
  checklistItems?: ChecklistItem[]
}

interface TaskDetailModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onChecklistItemToggle?: (taskId: string, checklistItemId: string, completed: boolean) => void
}

export function TaskDetailModal({ task, isOpen, onClose, onChecklistItemToggle }: TaskDetailModalProps) {
  const [localChecklist, setLocalChecklist] = useState<ChecklistItem[]>([])

  useEffect(() => {
    if (task?.checklistItems) {
      setLocalChecklist(task.checklistItems)
    }
  }, [task])

  if (!isOpen || !task) return null

  const handleChecklistToggle = (itemId: string, completed: boolean) => {
    const updated = localChecklist.map((item) =>
      item.id === itemId ? { ...item, completed } : item
    )
    setLocalChecklist(updated)

    if (onChecklistItemToggle) {
      onChecklistItemToggle(task.id, itemId, completed)
    }

    // Update localStorage
    const tasks = JSON.parse(localStorage.getItem("way2b1_tasks") || "[]")
    const updatedTasks = tasks.map((t: any) => {
      if (t.id === task.id) {
        return {
          ...t,
          checklistItems: updated,
        }
      }
      return t
    })
    localStorage.setItem("way2b1_tasks", JSON.stringify(updatedTasks))
    
    // Dispatch event to notify components
    window.dispatchEvent(new CustomEvent("taskUpdated"))
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center animate-in fade-in duration-300 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {task.title || task.name}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>ID: {task.taskId || task.id}</span>
            <span>Status: {task.status}</span>
            <span>Priority: {task.priority}</span>
          </div>
        </div>

        {/* Checklist */}
        {localChecklist && localChecklist.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Checklist</h3>
            <div className="space-y-3">
              {localChecklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <button
                    onClick={() => handleChecklistToggle(item.id, !item.completed)}
                    className="flex-shrink-0"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <span
                    className={`flex-1 text-sm ${
                      item.completed
                        ? "line-through text-gray-500"
                        : "text-gray-900"
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Task Details */}
        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {task.assignee && (
              <div>
                <span className="text-gray-600">Assignee:</span>
                <span className="ml-2 text-gray-900">{task.assignee}</span>
              </div>
            )}
            {task.dueDate && task.dueDate !== "—" && (
              <div>
                <span className="text-gray-600">Due Date:</span>
                <span className="ml-2 text-gray-900">{task.dueDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

