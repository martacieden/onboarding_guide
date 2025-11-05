"use client"

import { useState } from "react"
import { X, ArrowRight, Sparkles, Filter, CheckCircle2 } from "lucide-react"

interface NextGenWelcomeProps {
  onComplete: () => void
  onSkip: () => void
}

interface Slide {
  title: string
  subtitle?: string
  description: string
  icon: React.ReactNode
  image?: string
  features?: string[]
}

const slides: Slide[] = [
  {
    title: "Welcome to Way2B1 Next Gen",
    subtitle: "Your upgraded Digital Chief of Staff",
    description: "We've rebuilt the platform with powerful new features to make your work faster and smarter.",
    icon: <Sparkles className="w-12 h-12 text-[#94A3B8] stroke-[1.5]" />,
  },
  {
    title: "Meet Fojo: Your AI Assistant",
    subtitle: "Intelligence that amplifies your expertise",
    description: "Fojo analyzes patterns, surfaces insights, and automates routine tasks—all while you maintain full control.",
    icon: <Sparkles className="w-12 h-12 text-[#94A3B8] stroke-[1.5]" />,
  },
  {
    title: "Smart Filtering System",
    subtitle: "Find exactly what you need, instantly",
    description: "Quick and advanced filters work together to give you precise control over your view.",
    icon: <Filter className="w-12 h-12 text-[#94A3B8] stroke-[1.5]" />,
  },
]

export function NextGenWelcome({ onComplete, onSkip }: NextGenWelcomeProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const currentSlideData = slides[currentSlide]
  const isLastSlide = currentSlide === slides.length - 1

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center animate-in fade-in duration-300">
      <div className="bg-card rounded-2xl p-8 max-w-2xl mx-4 shadow-2xl animate-in zoom-in duration-300 relative">
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full p-1 transition-all z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8">
          <div className="flex justify-center mb-4">
            {currentSlide === 0 ? (
              <img 
                src="/logo-next.svg" 
                alt="Way2B1 Next Gen Logo" 
                className="w-20 h-20"
              />
            ) : (
              currentSlideData.icon
            )}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-foreground text-balance">
              {currentSlideData.title}
            </h2>
            {currentSlideData.subtitle && (
              <p className="text-primary font-bold text-sm mb-3">
                {currentSlideData.subtitle}
              </p>
            )}
            {currentSlideData.description && (
              <p className="text-gray-700 leading-relaxed text-pretty">
                {currentSlideData.description}
              </p>
            )}
          </div>
        </div>


        {/* Navigation buttons */}
        <div className="flex gap-3">
          {currentSlide > 0 && (
            <button
              onClick={handlePrevious}
              className="flex-1 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Back
            </button>
          )}
          {currentSlide === 0 && !isLastSlide && (
            <button
              onClick={onSkip}
              className="flex-1 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Skip tour
            </button>
          )}
          <button
            onClick={handleNext}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] ${
              isLastSlide 
                ? "bg-[#4F7CFF] text-white hover:bg-[#4F7CFF]/90 hover:shadow-lg" 
                : "bg-[#4F7CFF] text-white hover:bg-[#4F7CFF]/90 hover:shadow-lg"
            }`}
          >
            {isLastSlide ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Get Started
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}



