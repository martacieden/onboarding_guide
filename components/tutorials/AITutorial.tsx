"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { useFirstTime } from "@/hooks/useFirstTime"

interface AITutorialProps {
  targetElementId?: string
}

export function AITutorial({ targetElementId }: AITutorialProps) {
  const [isFirstTime, markAsSeen] = useFirstTime("tutorial_ai_seen")
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isFirstTime || typeof window === "undefined") return

    const updatePosition = () => {
      // Wait for tooltip to render to get its actual dimensions
      if (!tooltipRef.current) {
        setTimeout(updatePosition, 50)
        return
      }

      if (targetElementId) {
        const element = document.getElementById(targetElementId)
        if (element && tooltipRef.current) {
          const rect = element.getBoundingClientRect()
          const tooltipWidth = tooltipRef.current.offsetWidth || 320
          const tooltipHeight = tooltipRef.current.offsetHeight || 80
          const viewportWidth = window.innerWidth
          const viewportHeight = window.innerHeight
          const rightMargin = 24 // Same margin as Fojo Assistant button (bottom-6 right-6 = 24px)
          const topMargin = 24 // Minimum margin from top
          
          // Calculate position - align right edge with button's right edge
          let left = rect.right - tooltipWidth
          
          // Ensure it doesn't go off screen on the left
          if (left < rightMargin) {
            left = rightMargin
          }
          
          // Ensure it doesn't go off screen on the right
          if (left + tooltipWidth > viewportWidth - rightMargin) {
            left = viewportWidth - tooltipWidth - rightMargin
          }
          
          // Calculate top position - above the button
          let top = rect.top - tooltipHeight - 10
          
          // Ensure it doesn't go off screen at the top
          if (top < topMargin) {
            // If not enough space above, position below the button
            top = rect.bottom + 10
            // But ensure it doesn't go off screen at the bottom either
            if (top + tooltipHeight > viewportHeight - rightMargin) {
              top = viewportHeight - tooltipHeight - rightMargin
            }
          }
          
          setPosition({
            top: top,
            left: left,
          })
        }
      } else {
        // Default position - near AI assistant button
        const aiButton = document.getElementById("ai-assistant-button")
        if (aiButton && tooltipRef.current) {
          const rect = aiButton.getBoundingClientRect()
          const tooltipWidth = tooltipRef.current.offsetWidth || 320
          const tooltipHeight = tooltipRef.current.offsetHeight || 80
          const viewportWidth = window.innerWidth
          const viewportHeight = window.innerHeight
          const rightMargin = 24
          const topMargin = 24
          
          let left = rect.right - tooltipWidth
          
          if (left < rightMargin) {
            left = rightMargin
          }
          
          if (left + tooltipWidth > viewportWidth - rightMargin) {
            left = viewportWidth - tooltipWidth - rightMargin
          }
          
          // Position above button
          let top = rect.top - tooltipHeight - 10
          
          // Ensure it doesn't go off screen at the top
          if (top < topMargin) {
            // Position below if not enough space above
            top = rect.bottom + 10
            if (top + tooltipHeight > viewportHeight - rightMargin) {
              top = viewportHeight - tooltipHeight - rightMargin
            }
          }
          
          setPosition({
            top: top,
            left: left,
          })
        }
      }
    }

    // Wait a bit for elements to render
    const timeout = setTimeout(updatePosition, 100)
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition)
    }
  }, [isFirstTime, targetElementId])

  if (!isFirstTime || !position) return null

  return (
    <div
      ref={tooltipRef}
      className="fixed z-[9999] pointer-events-auto"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm min-w-[320px]">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm text-gray-700 flex-1 leading-relaxed">
            AI can help you summarize, generate content, and automate workflows.
          </p>
          <button
            onClick={markAsSeen}
            className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
            aria-label="Dismiss tutorial"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  )
}

