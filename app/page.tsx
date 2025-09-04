"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthForm } from "@/components/auth-form"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if admin exists, redirect to setup if not
    const checkSetupStatus = async () => {
      try {
        const res = await fetch("/api/admin/exists")
        if (res.ok) {
          const data = await res.json()
          if (!data.adminExists) {
            router.push("/setup")
            return
          }
        }
      } catch (error) {
        console.error("Error checking setup status:", error)
      }
    }

    checkSetupStatus()
  }, [router])

  // In a real app, check if user is authenticated
  const isAuthenticated = false

  if (isAuthenticated) {
    router.push("/dashboard")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">MoneyTracker</h1>
          <p className="text-slate-300">Gérez vos finances en toute simplicité</p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}
