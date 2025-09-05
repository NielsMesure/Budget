"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin-layout'
import { EmailConfig } from '@/components/email-config'

export default function AdminEmailPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const userId = localStorage.getItem('userId')
      const userDataString = localStorage.getItem('userData')
      
      if (!userId || !userDataString) {
        router.push('/')
        return
      }

      try {
        const userData = JSON.parse(userDataString)
        if (!userData.isAdmin) {
          router.push('/dashboard')
          return
        }
        
        setIsAdmin(true)
      } catch (error) {
        console.error('Error parsing user data:', error)
        router.push('/')
        return
      }
      
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <AdminLayout>
      <EmailConfig />
    </AdminLayout>
  )
}