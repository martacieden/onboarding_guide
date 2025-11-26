"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, ArrowLeft, Share2, MoreVertical, Sparkles, X, Send, Search, MessageSquare, Equal, ChevronDown, RefreshCw, List } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { OnboardingCompletionCelebration } from "@/components/onboarding/OnboardingCompletionCelebration"
import { InteractiveChecklistHint } from "@/components/onboarding/InteractiveChecklistHint"
import { Toast } from "@/components/ui/toast"

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
  description?: string
  status: string
  priority: string
  assignee?: string
  dueDate?: string
  reporter?: string
  category?: string
  project?: string
  amount?: string
  checklistItems?: ChecklistItem[]
  createdAt?: string
  lastModified?: string
}

export default function TaskDetailPage() {
  const router = useRouter()
  const params = useParams()
  const taskId = params?.id as string

  const [task, setTask] = useState<Task | null>(null)
  const [localChecklist, setLocalChecklist] = useState<ChecklistItem[]>([])
  const [activeSection, setActiveSection] = useState<string>("summary")
  const [showSummary, setShowSummary] = useState(true)
  const [showCelebration, setShowCelebration] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState<Array<{ id: string; text: string; author: string; timestamp: string }>>([])
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" })
  
  // Calculate progress
  const checklistProgress = localChecklist.length > 0
    ? Math.round((localChecklist.filter(item => item.completed).length / localChecklist.length) * 100)
    : 0
  const completedCount = localChecklist.filter(item => item.completed).length
  const totalCount = localChecklist.length
  

  useEffect(() => {
    if (typeof window === "undefined" || !taskId) return

    // Завантажуємо завдання з localStorage
    const tasks = JSON.parse(localStorage.getItem("way2b1_tasks") || "[]")
    const foundTask = tasks.find((t: any) => t.id === taskId || t.taskId === taskId)

    if (foundTask) {
      setTask(foundTask)
      if (foundTask.checklistItems && foundTask.checklistItems.length > 0) {
        setLocalChecklist(foundTask.checklistItems)
      } else {
        // Якщо checklistItems відсутні, встановлюємо порожній масив
        setLocalChecklist([])
      }
    } else {
      // Якщо завдання не знайдено, повертаємось на сторінку Tasks
      router.push("/tasks")
    }
  }, [taskId, router])

  // Плавний скрол до чекліста для onboarding task
  useEffect(() => {
    if (!task || typeof window === "undefined") return

    const isOnboardingTask = task.name === "Welcome to NextGen — Your Quick Start Guide"
    
    if (isOnboardingTask) {
      // Чекаємо трохи, щоб сторінка встигла відрендеритися
      const scrollTimer = setTimeout(() => {
        const descriptionSection = document.getElementById("description")
        if (descriptionSection) {
          setActiveSection("description")
          descriptionSection.scrollIntoView({ 
            behavior: "smooth", 
            block: "start" 
          })
        }
      }, 300)

      return () => clearTimeout(scrollTimer)
    }
  }, [task])

  const handleChecklistToggle = (itemId: string, completed: boolean) => {
    if (!task) return

    const updated = localChecklist.map((item) =>
      item.id === itemId ? { ...item, completed } : item
    )
    setLocalChecklist(updated)

    // Оновлюємо localStorage
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
    
    // Оновлюємо локальний стан
    setTask({ ...task, checklistItems: updated })
    
    // Dispatch event to notify components
    window.dispatchEvent(new CustomEvent("taskUpdated"))
    
    // Check if onboarding is completed
    const newCompletedCount = updated.filter(item => item.completed).length
    const isOnboardingTask = task.name === "Welcome to NextGen — Your Quick Start Guide"
    if (isOnboardingTask && newCompletedCount === updated.length && updated.length > 0) {
      // Show celebration after a short delay
      setTimeout(() => {
        setShowCelebration(true)
      }, 500)
    }
  }

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  if (!task) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar onStartTutorial={() => {}} onOpenTutorialCenter={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Завантаження...</p>
        </div>
      </div>
    )
  }

  const taskName = task.title || task.name
  const displayId = task.taskId || task.id
  const createdDate = task.createdAt || "Nov 18, 2025"
  const lastModified = task.lastModified || "Today at 4:25 PM"

  return (
    <div className="flex h-screen bg-background overflow-hidden page-transition-enter page-transition-enter-active">
      <Sidebar onStartTutorial={() => {}} onOpenTutorialCenter={() => {}} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Central Panel - Task Details */}
          <div className="flex-1 flex flex-col overflow-hidden bg-card">
            {/* Top Header */}
            <div className="border-b border-border bg-card px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => router.push("/tasks")}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Go to Tasks
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <List className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{displayId}</span>
                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                      {task.status}
                    </span>
                    <span className="text-sm text-muted-foreground">Created on {createdDate}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-1">{taskName}</h1>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right mr-4">
                    <div className="flex items-center gap-2 justify-end">
                      <p className="text-sm text-muted-foreground">Last modified by • {lastModified}</p>
                      {/* Аватари співробітників - можна додати пізніше */}
                      {task.assignee && (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                          {task.assignee.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    Actions
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                  <button
                    onClick={() => router.push("/tasks")}
                    className="p-1.5 hover:bg-secondary rounded transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area with Anchor Navigation */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Sidebar - Anchor Navigation */}
              <div className="w-48 border-r border-border bg-secondary/30 p-4 flex-shrink-0 overflow-y-auto">
                <nav className="space-y-1">
                  <button
                    onClick={() => scrollToSection("summary")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === "summary"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    Summary
                  </button>
                  <button
                    onClick={() => scrollToSection("details")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === "details"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => scrollToSection("description")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === "description"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    Description
                  </button>
                </nav>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-8">
                  {/* Summary Section */}
                  {showSummary && (
                    <section id="summary" className="scroll-mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold text-foreground">Summary</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                            aria-label="Update summary"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowSummary(false)}
                            className="h-6 px-3 text-xs font-semibold border border-border hover:bg-secondary"
                          >
                            Hide
                          </Button>
                        </div>
                      </div>
                      <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/50">
                        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                          {task.description || "A new IT onboarding task that guides users through NextGen with a short checklist (review homepage, explore navigation/modules, leave a comment, change status, and mark complete); the task was just created and remains open."}
                        </p>
                      </div>
                    </section>
                  )}

                  {/* Details Section */}
                  <section id="details" className="scroll-mt-6">
                    <div className="mb-4 flex items-center gap-2 w-full">
                      <h2 className="text-lg font-semibold text-foreground">Details</h2>
                    </div>
                    <div className="grid gap-1 grid-flow-col auto-cols-max gap-x-4" style={{ gridTemplateColumns: "repeat(1, minmax(112px, max-content) auto 1fr)", gridTemplateRows: "repeat(5, auto)" }}>
                      {/* Status */}
                      <div className="grid grid-cols-subgrid col-span-3">
                        <div className="flex items-start font-medium py-1.5 text-sm">Status</div>
                        <div className="flex items-center min-h-7">
                          <select
                            id="task-status"
                            value={task.status}
                            onChange={(e) => {
                              const newStatus = e.target.value
                              // Оновлюємо статус в localStorage
                              const tasks = JSON.parse(localStorage.getItem("way2b1_tasks") || "[]")
                              const updatedTasks = tasks.map((t: any) => {
                                if (t.id === task.id) {
                                  return { ...t, status: newStatus }
                                }
                                return t
                              })
                              localStorage.setItem("way2b1_tasks", JSON.stringify(updatedTasks))
                              setTask({ ...task, status: newStatus })
                              
                              // Якщо це onboarding task і статус змінився
                              if (task.name === "Welcome to NextGen — Your Quick Start Guide" && newStatus !== task.status) {
                                // Відмічаємо checklist-4 (Change status) якщо ще не відмічений
                                const statusChecklistItem = localChecklist.find(item => item.id === "checklist-4")
                                if (statusChecklistItem && !statusChecklistItem.completed) {
                                  handleChecklistToggle("checklist-4", true)
                                  // Показуємо toast
                                  setToast({ show: true, message: "Great! You've completed: Change task status" })
                                }
                                
                                // Якщо статус змінено на "Done", автоматично відмічаємо checklist-6
                                if (newStatus === "Done") {
                                  const completeChecklistItem = localChecklist.find(item => item.id === "checklist-6")
                                  if (completeChecklistItem && !completeChecklistItem.completed) {
                                    handleChecklistToggle("checklist-6", true)
                                    // Показуємо toast
                                    setTimeout(() => {
                                      setToast({ show: true, message: "Great! You've completed: Mark task as complete" })
                                    }, 500)
                                  }
                                }
                              }
                            }}
                            className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="Created">Created</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Review">Review</option>
                            <option value="Done">Done</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Assignee */}
                      <div className="grid grid-cols-subgrid col-span-3">
                        <div className="flex items-start font-medium py-1.5 text-sm">Assignee</div>
                        <div className="flex items-center min-h-7 w-full">
                          {task.assignee ? (
                            <div className="flex items-center gap-2">
                              <div className="shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                                {task.assignee.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                              </div>
                              <span className="text-sm text-foreground">{task.assignee}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">Unassigned</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Due date */}
                      <div className="grid grid-cols-subgrid col-span-3">
                        <div className="flex items-start font-medium py-1.5 text-sm">Due date</div>
                        <div className="flex items-center min-h-7">
                          <span className="text-sm text-muted-foreground">
                            {task.dueDate && task.dueDate !== "—" ? task.dueDate : "Select a date"}
                          </span>
                        </div>
                      </div>
                      
                      {/* Priority */}
                      <div className="grid grid-cols-subgrid col-span-3">
                        <div className="flex items-start font-medium py-1.5 text-sm">Priority</div>
                        <div className="flex items-center min-h-7">
                          <div className="flex items-center gap-2">
                            <Equal className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground">{task.priority}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Project */}
                      <div className="grid grid-cols-subgrid col-span-3">
                        <div className="flex items-start font-medium py-1.5 text-sm">Project</div>
                        <div className="flex items-center min-h-7">
                          <span className="text-sm text-muted-foreground">
                            {task.project && task.project !== "—" ? task.project : "Select Project"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 h-8 px-3 text-xs font-semibold border border-border hover:bg-secondary">
                      Show more
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </section>

                  {/* Description Section */}
                  <section id="description" className="scroll-mt-6">
                    <div className="mb-4 flex items-center justify-between w-full">
                      <h2 className="text-lg font-semibold text-foreground">Description</h2>
                      {localChecklist.length > 0 && (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all duration-500 ease-out"
                                style={{ width: `${checklistProgress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">
                              {completedCount}/{totalCount} completed
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="rounded-md hover:bg-secondary/30 max-w-[696px] border border-border p-4 min-h-[112px]">
                      <div className="prose prose-sm max-w-full">
                        <h2 className="text-2xl font-bold text-foreground my-3">👋 Welcome!</h2>
                        <h3 className="text-base font-semibold text-foreground my-3">
                          This task will help you get oriented.
                        </h3>
                        <p className="my-3">
                          <strong className="text-foreground">Complete these checkboxes as you explore:</strong>
                        </p>
                        <ul className="pl-0 list-none my-3" data-type="taskList">
                          {localChecklist && localChecklist.length > 0 ? (
                            localChecklist.map((item) => (
                              <li 
                                key={item.id} 
                                className={`flex items-center m-0 mb-2 transition-smooth relative ${
                                  item.completed ? "checklist-item-complete" : ""
                                }`}
                              >
                                <label className="flex items-center mr-2 cursor-pointer flex-shrink-0">
                                  <input
                                    type="checkbox"
                                    checked={item.completed || false}
                                    onChange={() => handleChecklistToggle(item.id, !item.completed)}
                                    className="cursor-pointer w-4 h-4 transition-smooth"
                                  />
                                </label>
                                <div className="flex-1 flex items-center">
                                  <p className={`m-0 text-sm transition-smooth ${
                                    item.completed
                                      ? "line-through text-muted-foreground"
                                      : "text-foreground"
                                  }`}>
                                    {item.text}
                                  </p>
                                  {!item.completed && (
                                    <InteractiveChecklistHint
                                      checklistId={item.id}
                                      isCompleted={item.completed}
                                      onShow={() => {
                                        // Додаткова логіка при показі підказки
                                      }}
                                      onChecklistToggle={handleChecklistToggle}
                                    />
                                  )}
                                </div>
                              </li>
                            ))
                          ) : (
                            // Fallback checklist якщо checklistItems відсутні
                            <>
                              <li className="flex items-center m-0 mb-2">
                                <label className="flex items-center mr-2 cursor-pointer flex-shrink-0">
                                  <input type="checkbox" className="cursor-pointer w-4 h-4" />
                                </label>
                                <div className="flex-1">
                                  <p className="m-0 text-sm text-foreground">Review your homepage—this is where your assigned items appear</p>
                                </div>
                              </li>
                              <li className="flex items-center m-0 mb-2">
                                <label className="flex items-center mr-2 cursor-pointer flex-shrink-0">
                                  <input type="checkbox" className="cursor-pointer w-4 h-4" />
                                </label>
                                <div className="flex-1">
                                  <p className="m-0 text-sm text-foreground">Check the left navigation to see Decisions, Projects, and other modules</p>
                                </div>
                              </li>
                              <li className="flex items-center m-0 mb-2">
                                <label className="flex items-center mr-2 cursor-pointer flex-shrink-0">
                                  <input type="checkbox" className="cursor-pointer w-4 h-4" />
                                </label>
                                <div className="flex-1">
                                  <p className="m-0 text-sm text-foreground">Leave a comment on this task (By the way, you can @mentioning someone)</p>
                                </div>
                              </li>
                              <li className="flex items-center m-0 mb-2">
                                <label className="flex items-center mr-2 cursor-pointer flex-shrink-0">
                                  <input type="checkbox" className="cursor-pointer w-4 h-4" />
                                </label>
                                <div className="flex-1">
                                  <p className="m-0 text-sm text-foreground">Try changing this task's status using the dropdown</p>
                                </div>
                              </li>
                              <li className="flex items-center m-0 mb-2">
                                <label className="flex items-center mr-2 cursor-pointer flex-shrink-0">
                                  <input type="checkbox" className="cursor-pointer w-4 h-4" />
                                </label>
                                <div className="flex-1">
                                  <p className="m-0 text-sm text-foreground">Explore one module that interests you (Decisions, Projects, etc.)</p>
                                </div>
                              </li>
                              <li className="flex items-center m-0 mb-2">
                                <label className="flex items-center mr-2 cursor-pointer flex-shrink-0">
                                  <input type="checkbox" className="cursor-pointer w-4 h-4" />
                                </label>
                                <div className="flex-1">
                                  <p className="m-0 text-sm text-foreground">Mark this task complete when you're ready</p>
                                </div>
                              </li>
                            </>
                          )}
                        </ul>
                        <p className="my-3 text-sm text-foreground">
                          Need help? Click the [?] icon or visit our{" "}
                          <a href="#" className="text-primary hover:underline">
                            Help Center
                          </a>
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Comments */}
          <div className="w-80 border-l border-border bg-card flex flex-col">
            {/* Tabs */}
            <div className="border-b border-border flex">
              <button className="flex-1 px-4 py-3 text-sm font-medium text-foreground border-b-2 border-primary">
                Comments
              </button>
              <button className="flex-1 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
                History
              </button>
            </div>

            {/* Comments Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Search */}
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search in comments..."
                    className="w-full px-3 py-2 pl-9 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-auto p-4">
                {comments.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-secondary flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">Start the conversation</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-primary">
                            {comment.author.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-foreground">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm text-foreground whitespace-pre-wrap">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Comment Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-end gap-2">
                  <textarea
                    id="comment-input"
                    placeholder="Add a comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={2}
                  />
                  <Button 
                    size="sm" 
                    className="gap-2"
                    onClick={() => {
                      if (commentText.trim()) {
                        // Створюємо новий коментар
                        const newComment = {
                          id: `comment-${Date.now()}`,
                          text: commentText,
                          author: task?.assignee || "You",
                          timestamp: new Date().toLocaleString("en-US", { 
                            month: "short", 
                            day: "numeric", 
                            hour: "numeric", 
                            minute: "2-digit" 
                          }),
                        }
                        
                        // Додаємо коментар до списку
                        setComments([...comments, newComment])
                        
                        // Перевіряємо, чи є @ в коментарі
                        const hasMention = commentText.includes("@")
                        
                        // Якщо це onboarding task і є @, автоматично відмічаємо чекбокс
                        if (task && task.name === "Welcome to NextGen — Your Quick Start Guide" && hasMention) {
                          const commentChecklistItem = localChecklist.find(item => item.id === "checklist-3")
                          if (commentChecklistItem && !commentChecklistItem.completed) {
                            handleChecklistToggle("checklist-3", true)
                            // Показуємо toast
                            setToast({ show: true, message: "Great! You've completed: Leave a comment with @mention" })
                          }
                        }
                        
                        // Очищаємо поле вводу
                        setCommentText("")
                      }
                    }}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Completion Celebration */}
      <OnboardingCompletionCelebration
        show={showCelebration}
        onClose={() => {
          setShowCelebration(false)
          // Navigate to homepage after closing the celebration
          router.push("/")
        }}
      />

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  )
}

