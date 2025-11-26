"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { useFirstTime } from "@/hooks/useFirstTime"

interface ContextualTooltipProps {
  tooltipKey: string
  targetElementId: string
  message: string
  position?: "top" | "bottom" | "left" | "right"
  delay?: number
}

export function ContextualTooltip({ 
  tooltipKey,
  targetElementId, 
  message, 
  position = "bottom",
  delay = 1000 
}: ContextualTooltipProps) {
  const [isFirstTime, markAsSeen] = useFirstTime(`tooltip_${tooltipKey}_${targetElementId}`)
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isFirstTime || typeof window === "undefined") return

    const showTooltip = () => {
      const element = document.getElementById(targetElementId)
      if (!element) {
        setTimeout(showTooltip, 100)
        return
      }

      const rect = element.getBoundingClientRect()
      const scrollY = window.scrollY
      const scrollX = window.scrollX
      
      if (!tooltipRef.current) {
        setTimeout(showTooltip, 50)
        return
      }

      const tooltipWidth = tooltipRef.current.offsetWidth || 280
      const tooltipHeight = tooltipRef.current.offsetHeight || 80
      const margin = 12

      let top = 0
      let left = 0

      switch (position) {
        case "top":
          top = rect.top + scrollY - tooltipHeight - margin
          left = rect.left + scrollX + rect.width / 2 - tooltipWidth / 2
          break
        case "bottom":
          top = rect.bottom + scrollY + margin
          left = rect.left + scrollX + rect.width / 2 - tooltipWidth / 2
          break
        case "left":
          top = rect.top + scrollY + rect.height / 2 - tooltipHeight / 2
          left = rect.left + scrollX - tooltipWidth - margin
          break
        case "right":
          top = rect.top + scrollY + rect.height / 2 - tooltipHeight / 2
          left = rect.right + scrollX + margin
          break
      }

      // Ensure tooltip stays within viewport
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      if (left < margin) left = margin
      if (left + tooltipWidth > viewportWidth - margin) left = viewportWidth - tooltipWidth - margin
      if (top < margin) top = margin
      if (top + tooltipHeight > viewportHeight - margin) top = viewportHeight - tooltipHeight - margin

      setTooltipPosition({ top, left })
      setTimeout(() => setIsVisible(true), delay)
    }

    const timeout = setTimeout(showTooltip, 300)
    window.addEventListener("resize", showTooltip)
    window.addEventListener("scroll", showTooltip)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener("resize", showTooltip)
      window.removeEventListener("scroll", showTooltip)
    }
  }, [isFirstTime, targetElementId, position, delay])

  const handleDismiss = () => {
    markAsSeen()
    setIsVisible(false)
  }

  if (!isFirstTime || !tooltipPosition || !isVisible) return null

  return (
    <div
      ref={tooltipRef}
      className="fixed z-[9999] pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-300"
      style={{
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
      }}
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-w-xs min-w-[240px]">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs text-gray-700 flex-1 leading-relaxed">{message}</p>
          <button
            onClick={handleDismiss}
            className="p-0.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3 h-3 text-gray-500" />
          </button>
        </div>
        {/* Arrow */}
        <div
          className={`absolute w-2 h-2 bg-white border border-gray-200 transform rotate-45 ${
            position === "top" ? "bottom-[-4px] left-1/2 -translate-x-1/2 border-t-0 border-r-0" :
            position === "bottom" ? "top-[-4px] left-1/2 -translate-x-1/2 border-b-0 border-l-0" :
            position === "left" ? "right-[-4px] top-1/2 -translate-y-1/2 border-l-0 border-b-0" :
            "left-[-4px] top-1/2 -translate-y-1/2 border-r-0 border-t-0"
          }`}
        />
      </div>
    </div>
  )
}

