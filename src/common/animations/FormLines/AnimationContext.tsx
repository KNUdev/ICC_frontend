'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface AnimationContextType {
  isMainActive: boolean
  isSecondaryActive: boolean
  resetTrigger: number
}

const AnimationContext = createContext<AnimationContextType>({
  isMainActive: false,
  isSecondaryActive: false,
  resetTrigger: 0,
})

export const useAnimationContext = () => useContext(AnimationContext)

interface AnimationProviderProps {
  children: React.ReactNode
}

export function AnimationProvider({ children }: AnimationProviderProps) {
  const [isMainActive, setIsMainActive] = useState(false)
  const [isSecondaryActive, setIsSecondaryActive] = useState(false)
  const [resetTrigger, setResetTrigger] = useState(0)

  useEffect(() => {
    const cycleDuration = 4000
    const mainLineDuration = 1500

    const startCycle = () => {
      setIsMainActive(false)
      setIsSecondaryActive(false)

      setTimeout(() => {
        setIsMainActive(true)
      }, 100)

      setTimeout(() => {
        setIsSecondaryActive(true)
      }, 100 + mainLineDuration / 2.55)

      setTimeout(() => {
        setIsMainActive(false)
        setIsSecondaryActive(false)
      }, cycleDuration - 500)

      setTimeout(() => {
        setResetTrigger((prev) => prev + 1)
      }, cycleDuration)
    }

    const timeout = setTimeout(startCycle, 100)

    const interval = setInterval(() => {
      startCycle()
    }, cycleDuration)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [resetTrigger])

  return (
    <AnimationContext.Provider
      value={{ isMainActive, isSecondaryActive, resetTrigger }}
    >
      {children}
    </AnimationContext.Provider>
  )
}
