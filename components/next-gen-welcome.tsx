"use client"

import { X, Sparkles, Filter } from "lucide-react"

interface NextGenWelcomeProps {
  onComplete: () => void
  onSkip: () => void
}

export function NextGenWelcome({ onComplete, onSkip }: NextGenWelcomeProps) {
  const handleClose = () => {
    onSkip()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center animate-in fade-in duration-300">
      <div className="bg-card rounded-2xl p-8 max-w-2xl mx-4 shadow-2xl animate-in zoom-in duration-300 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full p-1 transition-all z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/logo-next.svg" 
              alt="Way2B1 Next Gen Logo" 
              className="w-20 h-20"
            />
          </div>

          {/* Welcome Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 text-foreground">
              Welcome to Way2B1 Next Gen
            </h2>
            <p className="text-primary font-bold text-sm mb-3">
              Your upgraded Digital Chief of Staff
            </p>
            <p className="text-gray-700 leading-relaxed">
              We've rebuilt the platform with powerful new features to make your work faster and smarter.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            {/* Meet Fojo */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#94A3B8] stroke-[1.5]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  Meet Fojo: Your AI Assistant
                </h3>
                <p className="text-sm text-primary font-medium mb-1">
                  Intelligence that amplifies your expertise
                </p>
                <p className="text-sm text-gray-700">
                  Fojo analyzes patterns, surfaces insights, and automates routine tasks—all while you maintain full control.
                </p>
              </div>
            </div>

            {/* Smart Filtering */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Filter className="w-6 h-6 text-[#94A3B8] stroke-[1.5]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  Smart Filtering System
                </h3>
                <p className="text-sm text-primary font-medium mb-1">
                  Find exactly what you need, instantly
                </p>
                <p className="text-sm text-gray-700">
                  Quick and advanced filters work together to give you precise control over your view.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Single action button */}
        <div className="flex justify-end">
          <button
            onClick={onComplete}
            className="bg-[#4F7CFF] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#4F7CFF]/90 hover:shadow-lg transition-all"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}



