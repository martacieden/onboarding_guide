"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { useFirstTime } from "@/hooks/useFirstTime"

interface DecisionsTutorialProps {
  targetElementId?: string
}

export function DecisionsTutorial({ targetElementId }: DecisionsTutorialProps) {
  const [isFirstTime, markAsSeen] = useFirstTime("tutorial_decisions_seen")
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isFirstTime || typeof window === "undefined") return

    const updatePosition = () => {
      if (targetElementId) {
        const element = document.getElementById(targetElementId)
        if (element) {
          const rect = element.getBoundingClientRect()
          setPosition({
            top: rect.bottom + 10,
            left: rect.left + rect.width / 2,
          })
        }
      } else {
        // Default position - top center of decisions page
        setPosition({
          top: 100,
          left: window.innerWidth / 2,
        })
      }
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition)

    return () => {
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
        transform: "translateX(-50%)",
      }}
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm min-w-[320px]">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm text-gray-700 flex-1 leading-relaxed">
            This module helps you manage approvals and decision-making across your organization.
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

