import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/auth'

export function useOnboarding() {
  const { user } = useAuthStore()
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkOnboardingStatus = () => {
      if (!user) {
        setIsChecking(false)
        return
      }

      // Check if user has completed onboarding
      const onboardingCompleted = localStorage.getItem(`onboarding_completed_${user.id}`)
      
      if (!onboardingCompleted) {
        setShouldShowOnboarding(true)
      }
      
      setIsChecking(false)
    }

    checkOnboardingStatus()
  }, [user])

  const completeOnboarding = () => {
    if (user) {
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true')
      setShouldShowOnboarding(false)
    }
  }

  const resetOnboarding = () => {
    if (user) {
      localStorage.removeItem(`onboarding_completed_${user.id}`)
      setShouldShowOnboarding(true)
    }
  }

  return {
    shouldShowOnboarding,
    isChecking,
    completeOnboarding,
    resetOnboarding,
  }
}