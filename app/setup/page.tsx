"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Shield, AlertTriangle } from "lucide-react"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true)
  const [adminExists, setAdminExists] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if admin already exists
    const checkAdminExists = async () => {
      try {
        const res = await fetch("/api/admin/exists")
        if (res.ok) {
          const data = await res.json()
          setAdminExists(data.adminExists)
          
          if (data.adminExists) {
            // Admin exists, redirect to home page
            setTimeout(() => router.push("/"), 3000)
          }
        }
      } catch (error) {
        console.error("Error checking admin status:", error)
        setError("Erreur lors de la vérification du statut administrateur")
      } finally {
        setIsCheckingAdmin(false)
      }
    }

    checkAdminExists()
  }, [router])

  const handleSetup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const form = e.currentTarget
    const formData = new FormData(form)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setSetupComplete(true)
        // Store admin user data
        if (data.id) {
          localStorage.setItem("userId", data.id.toString())
          localStorage.setItem("userData", JSON.stringify({
            id: data.id,
            name: data.name,
            email: data.email,
            isAdmin: data.isAdmin
          }))
        }
        // Redirect to dashboard after 3 seconds since they're now logged in as admin
        setTimeout(() => router.push("/dashboard"), 3000)
      } else {
        setError(data.error || "Erreur lors de la création de l'administrateur")
      }
    } catch (error) {
      console.error("Setup error:", error)
      setError("Erreur de connexion")
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p>Vérification du statut de l'application...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (adminExists) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm w-full max-w-md">
          <CardContent className="pt-6">
            <Alert className="border-orange-500 bg-orange-500/10">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <AlertDescription className="text-orange-200">
                Un administrateur existe déjà. La configuration initiale a déjà été effectuée.
                Redirection vers la page d'accueil...
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (setupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm w-full max-w-md">
          <CardContent className="pt-6">
            <Alert className="border-green-500 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-200">
                Administrateur créé avec succès ! Vous êtes maintenant connecté en tant qu'administrateur.
                Redirection vers le tableau de bord...
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Configuration Initiale</h1>
          <p className="text-slate-300">Créez le premier administrateur de l'application</p>
        </div>
        
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Administrateur Principal</CardTitle>
            <CardDescription className="text-slate-300">
              Cette étape ne peut être effectuée qu'une seule fois. L'administrateur aura accès à toutes les fonctionnalités de l'application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-500 bg-red-500/10">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSetup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Nom complet
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Nom de l'administrateur"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@exemple.com"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mot de passe sécurisé"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  required
                  minLength={6}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                disabled={isLoading}
              >
                {isLoading ? "Création en cours..." : "Créer l'Administrateur"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}