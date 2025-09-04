"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const id = localStorage.getItem('userId')
    if (!id) {
      router.push('/')
      return
    }
    setUserId(id)
    setIsLoading(false)
  }, [router])

  const logout = () => {
    localStorage.removeItem('userId')
    router.push('/')
  }

  return { userId, isLoading, logout }
}