"use client"

import { useState, useEffect } from "react"

/**
 * Hook to track if a feature is being used for the first time
 * @param key - localStorage key to track first-time usage
 * @returns [isFirstTime, markAsSeen] - boolean indicating if first time, and function to mark as seen
 */
export function useFirstTime(key: string): [boolean, () => void] {
  const [isFirstTime, setIsFirstTime] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return
    
    const hasSeen = localStorage.getItem(key) === "true"
    setIsFirstTime(!hasSeen)
  }, [key])

  const markAsSeen = () => {
    if (typeof window === "undefined") return
    
    localStorage.setItem(key, "true")
    setIsFirstTime(false)
  }

  return [isFirstTime, markAsSeen]
}

