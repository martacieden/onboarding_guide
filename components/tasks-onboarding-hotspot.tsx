"use client"

import { useState, useEffect, useRef } from "react"
import { useFirstTime } from "@/hooks/useFirstTime"

interface TasksOnboardingHotspotProps {
  taskId: string
  onTaskClick: () => void
}

export function TasksOnboardingHotspot({ taskId, onTaskClick }: TasksOnboardingHotspotProps) {
  const [isFirstTime, markAsSeen] = useFirstTime("tasks_onboarding_hotspot_seen")
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({})
  const [isVisible, setIsVisible] = useState(false)
  const hotspotRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isFirstTime || typeof window === "undefined") {
      setIsVisible(false)
      return
    }
    
    setIsVisible(true)

    let retryCount = 0
    const maxRetries = 30

    const updatePosition = () => {
      // Перевіряємо чи таблиця взагалі існує
      const tableContainer = document.getElementById("tasks-table-container")
      if (!tableContainer) {
        retryCount++
        if (retryCount < maxRetries) {
          setTimeout(updatePosition, 150)
        }
        return
      }

      // Знаходимо рядок таблиці з onboarding task
      const taskRow = document.querySelector(`[data-task-id="${taskId}"]`) as HTMLElement
      
      if (taskRow) {
        const rect = taskRow.getBoundingClientRect()
        
        // Перевіряємо чи рядок видимий
        if (rect.width > 0 && rect.height > 0) {
          const scrollY = window.scrollY
          const scrollX = window.scrollX
          
          // Позиціонуємо hotspot біля назви задачі (колонка NAME)
          setPosition({
            top: rect.top + rect.height / 2,
            left: rect.left - 25, // Зліва від рядка
          })

          // Підсвітка рядка
          setHighlightStyle({
            left: `${rect.left + scrollX}px`,
            top: `${rect.top + scrollY}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
          })

          // Додаємо клас для підсвітки рядка
          taskRow.classList.add("onboarding-task-highlight")
        } else {
          // Рядок знайдено, але ще не видимий
          retryCount++
          if (retryCount < maxRetries) {
            setTimeout(updatePosition, 100)
          }
        }
      } else {
        // Якщо рядок ще не завантажився, спробуємо через невелику затримку
        retryCount++
        if (retryCount < maxRetries) {
          setTimeout(updatePosition, 150)
        }
      }
    }

    // Починаємо з невеликої затримки, щоб таблиця встигла відрендеритися
    const timeout = setTimeout(updatePosition, 500)
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition)
      // Видаляємо клас при розмонтуванні
      const taskRow = document.querySelector(`[data-task-id="${taskId}"]`)
      if (taskRow) {
        taskRow.classList.remove("onboarding-task-highlight")
      }
    }
  }, [isFirstTime, taskId])

  const handleClick = () => {
    markAsSeen()
    // Видаляємо клас підсвітки
    const taskRow = document.querySelector(`[data-task-id="${taskId}"]`)
    if (taskRow) {
      taskRow.classList.remove("onboarding-task-highlight")
    }
    onTaskClick()
  }

  if (!isFirstTime || !isVisible || !position) return null

  return (
    <>
      {/* Spotlight для підсвітки рядка */}
      <div
        className="fixed z-[9998] pointer-events-none rounded-lg border-2 border-blue-500 bg-blue-500/10 transition-all duration-300"
        style={highlightStyle}
      />
      
      {/* Hotspot кнопка */}
      <button
        ref={hotspotRef}
        onClick={handleClick}
        className="fixed z-[9999] pointer-events-auto w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg hover:bg-blue-600 hover:scale-110 transition-all animate-pulse"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: "translateY(-50%)",
        }}
        aria-label="Click to open onboarding task"
      >
        ?
      </button>
    </>
  )
}

