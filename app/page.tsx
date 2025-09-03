import { redirect } from "next/navigation"
import { AuthForm } from "@/components/auth-form"

export default function HomePage() {
  // In a real app, check if user is authenticated
  const isAuthenticated = true

  if (isAuthenticated) {
    redirect("/dashboard")
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
