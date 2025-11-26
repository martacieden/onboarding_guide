"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, X } from "lucide-react"

interface ToastProps {
  message: string
  show: boolean
  onClose: () => void
}

export function Toast({ message, show, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for fade out animation
      }, 3000) // Show for 3 seconds
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show || !isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-[10000] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-card border border-border rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 min-w-[280px] max-w-md">
        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
        </div>
        <p className="text-sm text-foreground flex-1">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="p-0.5 hover:bg-secondary rounded transition-colors flex-shrink-0"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}
