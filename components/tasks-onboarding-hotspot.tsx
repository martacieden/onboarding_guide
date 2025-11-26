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
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const hotspotRef = useRef<HTMLButtonElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

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
            // Знаходимо колонку NAME (друга колонка, бо перша - це checkbox)
            const nameCell = taskRow.querySelector('td:nth-child(2)') as HTMLElement
            if (nameCell) {
              // Знаходимо span з назвою задачі всередині комірки
              const textElement = nameCell.querySelector('span') as HTMLElement
              if (textElement) {
                const textRect = textElement.getBoundingClientRect()
                
                // Якщо текстовий елемент має текст, використовуємо Range API для знаходження кінця тексту
                let textEndX = textRect.right
                
                if (textElement.textContent && textElement.textContent.trim()) {
                  try {
                    const range = document.createRange()
                    range.selectNodeContents(textElement)
                    range.collapse(false) // В кінець тексту
                    const rangeRect = range.getBoundingClientRect()
                    textEndX = rangeRect.right
                  } catch (e) {
                    // Fallback до getBoundingClientRect
                    textEndX = textRect.right
                  }
                }
                
                // Позиціонуємо hotspot в кінці тексту з відступом 16px
                setPosition({
                  top: textRect.top + textRect.height / 2,
                  left: textEndX + 16, // 16px відступ від кінця тексту
                })
              } else {
                // Fallback - якщо не знайдено span, використовуємо комірку
                const cellRect = nameCell.getBoundingClientRect()
                setPosition({
                  top: cellRect.top + cellRect.height / 2,
                  left: cellRect.right + 16,
                })
              }
            } else {
              // Fallback - якщо не знайдено колонку NAME
              setPosition({
                top: rect.top + rect.height / 2,
                left: rect.left + 200, // Приблизна позиція для назви задачі
              })
            }

          // Підсвітка рядка видалена за запитом користувача
          // Тултіп показується тільки на ховер (onMouseEnter)
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
      // Cleanup
    }
  }, [isFirstTime, taskId])

  const handleClick = () => {
    markAsSeen()
    onTaskClick()
  }

  if (!isFirstTime || !isVisible || !position) return null

  return (
    <>
      {/* Hotspot кнопка - пульсуюча крапочка */}
      <button
        ref={hotspotRef}
        onClick={handleClick}
        onMouseEnter={() => {
          setShowTooltip(true)
          // Оновлюємо позицію тултіпа при ховері
          setTimeout(() => {
            if (hotspotRef.current && tooltipRef.current) {
              const hotspotRect = hotspotRef.current.getBoundingClientRect()
              const tooltipRect = tooltipRef.current.getBoundingClientRect()
              const tooltipWidth = tooltipRect.width || 200
              const tooltipHeight = tooltipRect.height || 60
              const viewportWidth = window.innerWidth
              const margin = 12
              
              let tooltipLeft = hotspotRect.right + 12
              let tooltipTop = hotspotRect.top + hotspotRect.height / 2 - tooltipHeight / 2
              
              if (tooltipLeft + tooltipWidth > viewportWidth - margin) {
                tooltipLeft = hotspotRect.left - tooltipWidth - 12
              }
              
              if (tooltipTop < margin) {
                tooltipTop = margin
              } else if (tooltipTop + tooltipHeight > window.innerHeight - margin) {
                tooltipTop = window.innerHeight - tooltipHeight - margin
              }
              
              setTooltipPosition({
                top: tooltipTop,
                left: tooltipLeft,
              })
            }
          }, 50)
        }}
        onMouseLeave={() => setShowTooltip(false)}
        className="fixed z-[9999] pointer-events-auto w-3 h-3 bg-blue-500 rounded-full shadow-lg hover:bg-blue-600 hover:scale-125 transition-all animate-pulse"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: "translateY(-50%)",
        }}
        aria-label="Click to start onboarding"
      />
      
      {/* Tooltip - показується тільки на ховер */}
      {showTooltip && tooltipPosition && (
        <div
          ref={tooltipRef}
          className="fixed z-[10000] pointer-events-none bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg animate-in fade-in slide-in-from-left-2 duration-200"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: "translateY(-50%)",
            maxWidth: "200px",
          }}
        >
          <p className="text-white leading-relaxed">
            Click here to start your onboarding
          </p>
          {/* Arrow pointing to hotspot */}
          <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-r-4 border-r-gray-900 border-b-4 border-b-transparent" />
        </div>
      )}
    </>
  )
}

