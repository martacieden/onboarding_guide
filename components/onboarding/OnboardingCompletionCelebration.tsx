"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OnboardingCompletionCelebrationProps {
  show: boolean
  onClose: () => void
}

export function OnboardingCompletionCelebration({ show, onClose }: OnboardingCompletionCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [show])

  if (!show || !isVisible) return null

  return (
    <>
      {/* Confetti animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[10001]">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ["#4F7CFF", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"][
                    Math.floor(Math.random() * 6)
                  ],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center animate-in fade-in duration-300 p-4">
        <div className="bg-card rounded-2xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in duration-300 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            {/* Animated icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <h2 className="text-3xl font-bold mb-3 text-foreground">🎉 Onboarding Complete!</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Congratulations! You've completed all the onboarding steps. You're now ready to explore Way2B1 NextGen and make the most of its features.
            </p>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl mb-6">
              <div className="flex items-center justify-center gap-2 text-blue-700 mb-2">
                <Sparkles className="w-5 h-5" />
                <div className="text-sm font-semibold">You're all set!</div>
              </div>
              <div className="text-sm text-gray-700">
                Start exploring the platform and discover how Way2B1 can help you manage your work more efficiently.
              </div>
            </div>

            <Button
              onClick={onClose}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

