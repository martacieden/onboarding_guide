"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { X, Sparkles, Search, BarChart3, Settings, Plus, Home } from "lucide-react"

interface Feature {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

const features: Record<string, Feature> = {
  navigation: {
    id: "navigation",
    title: "Smart Navigation",
    description:
      "Quickly switch between different sections of your workspace. Everything is organized for maximum efficiency.",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  search: {
    id: "search",
    title: "Powerful Search",
    description: "Find anything instantly with our smart search. Use ⌘K to open search from anywhere in the app.",
    icon: <Search className="w-5 h-5" />,
  },
  aiAssistant: {
    id: "aiAssistant",
    title: "Fojo Assistant",
    description: "Get instant help from Fojo, your AI assistant. Ask questions, get guidance, and discover features powered by artificial intelligence.",
    icon: <Sparkles className="w-5 h-5" />,
  },
  settings: {
    id: "settings",
    title: "Profile & Support",
    description: "If you have questions or need help, you can find Support and Feedback buttons here to reach out to us or share your thoughts.",
    icon: <Settings className="w-5 h-5" />,
  },
  way2b1Switch: {
    id: "way2b1Switch",
    title: "Go to Way2B1",
    description: "Switch to the current generation of Way2B1.",
    icon: <Settings className="w-5 h-5" />,
  },
  tasksNavigation: {
    id: "tasksNavigation",
    title: "Navigate to Tasks",
    description: "Click here to explore your tasks. This is where you'll manage all your assigned work and track progress.",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  welcomeSection: {
    id: "welcomeSection",
    title: "Welcome Section",
    description: "This is your personalized welcome area. Here you can see your profile and quick access to creating new tasks and decisions.",
    icon: <Home className="w-5 h-5" />,
  },
  createActions: {
    id: "createActions",
    title: "Quick Actions",
    description: "Create new tasks and decisions directly from your homepage. These buttons give you instant access to the most common actions.",
    icon: <Plus className="w-5 h-5" />,
  },
  emptyState: {
    id: "emptyState",
    title: "Empty State",
    description: "This is your homepage. Once you create tasks or decisions, they'll appear here. It's a clean slate ready for your work.",
    icon: <Home className="w-5 h-5" />,
  },
}

export function Hotspots() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const [hiddenHotspots, setHiddenHotspots] = useState<Set<string>>(new Set())
  const [userRole, setUserRole] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Отримуємо роль користувача
  useEffect(() => {
    const savedRole = localStorage.getItem("way2b1_user_role")
    setUserRole(savedRole)
  }, [])

  // Перевіряємо тип флоу для демо
  const flowType = localStorage.getItem("way2b1_flow_type")
  const isHomePage = pathname === "/"

  // Role-aware hotspots: різні hotspots для різних ролей та флоу
  const getHotspots = () => {
    // Home page hotspots - тільки Tasks navigation hotspot
    // Stepper tour показується окремо після NextGenWelcome
    if (isHomePage) {
      const hasSeenStepper = localStorage.getItem("way2b1_homepage_stepper_seen")
      // Якщо stepper tour пройдено, показуємо тільки Tasks hotspot
      if (hasSeenStepper) {
        return [
          { id: "tasks-nav", feature: "tasksNavigation", elementId: "sidebar-tasks-link", position: "right" },
        ]
      }
      // Якщо stepper tour не пройдено, не показуємо hotspots
      return []
    }

    // Advisor флоу - обмежені hotspots
    if (flowType === "advisor") {
      return [
        { id: "nav", feature: "navigation", left: "40px", top: "200px" },
        { id: "search", feature: "search", left: "180px", top: "32px" },
      ]
    }

    // Admin флоу - повний набір hotspots (без navigation)
    if (userRole === "family-principal" || userRole === "operations-manager") {
      return [
        // Search hotspot - вказує на поле пошуку в topbar (80px sidebar + gap + search)
        { id: "search", feature: "search", left: "180px", top: "32px" },
        // Settings hotspot - вказує на аватар справа
        { id: "settings", feature: "settings", right: "24px", top: "32px" },
        // AI Assistant hotspot - вказує на кнопку AI Assistant внизу справа
        { id: "aiAssistant", feature: "aiAssistant", right: "24px", bottom: "80px" },
      ]
    }
    
    // Vendor/Guest: тільки основні hotspots
    if (userRole === "team-collaborator" || userRole === "other") {
      return [
        { id: "nav", feature: "navigation", left: "40px", top: "200px" },
        { id: "search", feature: "search", left: "180px", top: "32px" },
      ]
    }

    // За замовчуванням показуємо для Admin флоу (без navigation)
    return [
      { id: "search", feature: "search", left: "180px", top: "32px" },
      { id: "settings", feature: "settings", right: "24px", top: "32px" },
      { id: "aiAssistant", feature: "aiAssistant", right: "24px", bottom: "80px" },
    ]
  }

  const hotspots = useMemo(() => getHotspots(), [isHomePage, userRole, flowType])
  const [hotspotPositions, setHotspotPositions] = useState<Record<string, { left?: string; right?: string; top?: string; bottom?: string }>>({})

  // Розраховуємо позиції для hotspots на основі елементів
  useEffect(() => {
    if (isHomePage && typeof window !== "undefined") {
      const updatePositions = () => {
        const positions: Record<string, { left?: string; right?: string; top?: string; bottom?: string }> = {}
        
        hotspots.forEach((hotspot) => {
          if (hotspot.elementId) {
            const element = document.getElementById(hotspot.elementId)
            if (element) {
              const rect = element.getBoundingClientRect()
              const scrollY = window.scrollY
              const scrollX = window.scrollX
              
              if (hotspot.position === "bottom") {
                positions[hotspot.id] = {
                  left: `${rect.left + scrollX + rect.width / 2}px`,
                  top: `${rect.bottom + scrollY + 10}px`,
                }
              } else if (hotspot.position === "top") {
                positions[hotspot.id] = {
                  left: `${rect.left + scrollX + rect.width / 2}px`,
                  bottom: `${window.innerHeight - rect.top - scrollY + 10}px`,
                }
              } else if (hotspot.position === "left") {
                positions[hotspot.id] = {
                  right: `${window.innerWidth - rect.left - scrollX + 10}px`,
                  top: `${rect.top + scrollY + rect.height / 2}px`,
                }
              } else if (hotspot.position === "right") {
                // Для Tasks в sidebar - зменшуємо відстань для кращого позиціонування
                const gap = hotspot.elementId === "sidebar-tasks-link" ? 5 : 10
                positions[hotspot.id] = {
                  left: `${rect.right + scrollX + gap}px`,
                  top: `${rect.top + scrollY + rect.height / 2}px`,
                }
              }
            }
          }
        })
        
        setHotspotPositions(positions)
      }
      
      // Оновлюємо позиції при завантаженні та зміні розміру вікна
      // Використовуємо setTimeout для того, щоб DOM встиг завантажитись
      const timeoutId = setTimeout(updatePositions, 100)
      window.addEventListener("resize", updatePositions)
      window.addEventListener("scroll", updatePositions)
      
      return () => {
        clearTimeout(timeoutId)
        window.removeEventListener("resize", updatePositions)
        window.removeEventListener("scroll", updatePositions)
      }
    }
  }, [isHomePage, hotspots])

  const handleHotspotClick = (featureId: string, hotspotId: string) => {
    // Якщо це Tasks navigation hotspot, переходимо на Tasks і запускаємо tour
    if (hotspotId === "tasks-nav" && pathname === "/") {
      setHiddenHotspots((prev) => new Set([...prev, hotspotId]))
      // Встановлюємо прапорець для запуску tour на Tasks
      localStorage.setItem("way2b1_start_tasks_tour", "true")
      router.push("/tasks")
      return
    }
    
    setActiveFeature(featureId)
    setHiddenHotspots((prev) => new Set([...prev, hotspotId]))
  }

  const handleCloseFeature = () => {
    setActiveFeature(null)
  }

  const getHotspotStyle = (hotspot: any) => {
    // Якщо є elementId, використовуємо розраховану позицію
    if (hotspot.elementId && hotspotPositions[hotspot.id]) {
      return hotspotPositions[hotspot.id]
    }
    
    // Інакше використовуємо статичні позиції
    return {
      left: hotspot.left,
      right: hotspot.right,
      top: hotspot.top,
      bottom: hotspot.bottom,
    }
  }

  return (
    <>
      {/* Hotspots */}
      {hotspots.map(
        (hotspot) =>
          !hiddenHotspots.has(hotspot.id) && (
            <button
              key={hotspot.id}
              className="hotspot"
              style={getHotspotStyle(hotspot)}
              onClick={() => handleHotspotClick(hotspot.feature, hotspot.id)}
            >
              ?
            </button>
          ),
      )}

      {/* Feature Cards */}
      {activeFeature && (
        <div
          className="feature-card show"
          style={{
            ...(activeFeature === "navigation" 
              ? { left: "100px", top: "200px" }
              : activeFeature === "search"
              ? { left: "180px", top: "64px" }
              : activeFeature === "aiAssistant"
              ? { right: "24px", bottom: "80px" }
              : activeFeature === "welcomeSection" || activeFeature === "createActions" || activeFeature === "emptyState" || activeFeature === "settings" || activeFeature === "way2b1Switch" || activeFeature === "tasksNavigation" || activeFeature === "aiAssistant"
              ? (() => {
                  const hotspot = hotspots.find(h => h.feature === activeFeature)
                  if (hotspot?.elementId) {
                    const element = document.getElementById(hotspot.elementId)
                    if (element) {
                      const rect = element.getBoundingClientRect()
                      const scrollY = window.scrollY
                      const scrollX = window.scrollX
                      if (hotspot.position === "bottom") {
                        return { left: `${rect.left + scrollX + rect.width / 2}px`, top: `${rect.bottom + scrollY + 10}px` }
                      } else if (hotspot.position === "top") {
                        return { left: `${rect.left + scrollX + rect.width / 2}px`, bottom: `${window.innerHeight - rect.top - scrollY + 10}px` }
                      } else if (hotspot.position === "right") {
                        return { left: `${rect.right + scrollX + 10}px`, top: `${rect.top + scrollY + rect.height / 2}px` }
                      } else if (hotspot.position === "left") {
                        return { right: `${window.innerWidth - rect.left - scrollX + 10}px`, top: `${rect.top + scrollY + rect.height / 2}px` }
                      }
                    }
                  }
                  return {}
                })()
              : { right: "24px", top: "64px" }
            ),
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              {features[activeFeature].icon}
            </div>
            <button onClick={handleCloseFeature} className="p-1 hover:bg-secondary rounded transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <h4 className="font-semibold text-foreground mb-2">{features[activeFeature].title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{features[activeFeature].description}</p>
        </div>
      )}
    </>
  )
}
