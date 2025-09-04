"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { Mail, Lock, Trash2, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function UserSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ id?: string; name?: string; email: string } | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      router.push("/")
      return
    }
    
    // For demo purposes, use mock data if API fails
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/info?userId=${userId}`)
        if (res.ok) {
          const userData = await res.json()
          setCurrentUser(userData)
        } else {
          // Use mock data for demo
          console.log('API failed, using mock data')
          setCurrentUser({ 
            id: userId, 
            name: "Utilisateur Test", 
            email: "test@example.com" 
          })
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        // Use mock data for demo
        setCurrentUser({ 
          id: userId, 
          name: "Utilisateur Test", 
          email: "test@example.com" 
        })
      }
    }
    
    fetchUser()
  }, [router])

  const handleEmailChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const form = e.currentTarget
    const currentEmail = (form.elements.namedItem("currentEmail") as HTMLInputElement).value
    const newEmail = (form.elements.namedItem("newEmail") as HTMLInputElement).value
    const userId = localStorage.getItem("userId")

    try {
      const res = await fetch("/api/user/email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, currentEmail, newEmail }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Email mis à jour",
          description: "Votre adresse email a été modifiée avec succès.",
        })
        setCurrentUser({ email: newEmail })
        form.reset()
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Impossible de modifier l'email",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const form = e.currentTarget
    const currentPassword = (form.elements.namedItem("currentPassword") as HTMLInputElement).value
    const newPassword = (form.elements.namedItem("newPassword") as HTMLInputElement).value
    const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value
    const userId = localStorage.getItem("userId")

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, currentPassword, newPassword }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Mot de passe mis à jour",
          description: "Votre mot de passe a été modifié avec succès.",
        })
        form.reset()
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Impossible de modifier le mot de passe",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccountDeletion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const form = e.currentTarget
    const password = (form.elements.namedItem("deletePassword") as HTMLInputElement).value
    const confirmText = (form.elements.namedItem("confirmText") as HTMLInputElement).value
    const userId = localStorage.getItem("userId")

    try {
      const res = await fetch("/api/user/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password, confirmText }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Compte supprimé",
          description: "Votre compte a été supprimé avec succès.",
        })
        localStorage.removeItem("userId")
        router.push("/")
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Impossible de supprimer le compte",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentUser) {
    return <div className="text-white">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      {/* Email Change Section */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Modifier l'adresse email
          </CardTitle>
          <CardDescription className="text-slate-300">
            Email actuel: {currentUser.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentEmail" className="text-white">
                Email actuel
              </Label>
              <Input
                id="currentEmail"
                type="email"
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newEmail" className="text-white">
                Nouvel email
              </Label>
              <Input
                id="newEmail"
                type="email"
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
              {isLoading ? "Modification..." : "Modifier l'email"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Change Section */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Modifier le mot de passe
          </CardTitle>
          <CardDescription className="text-slate-300">
            Changez votre mot de passe pour sécuriser votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-white">
                Mot de passe actuel
              </Label>
              <Input
                id="currentPassword"
                type="password"
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-white">
                Nouveau mot de passe
              </Label>
              <Input
                id="newPassword"
                type="password"
                minLength={6}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">
                Confirmer le nouveau mot de passe
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                minLength={6}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
              {isLoading ? "Modification..." : "Modifier le mot de passe"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator className="bg-slate-700" />

      {/* Account Deletion Section */}
      <Card className="bg-red-950/20 border-red-700">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Zone dangereuse
          </CardTitle>
          <CardDescription className="text-red-300">
            Supprimez définitivement votre compte et toutes vos données
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer mon compte
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-800 border-slate-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Confirmer la suppression du compte
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-300">
                  Cette action est irréversible. Toutes vos données financières seront supprimées définitivement.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <form onSubmit={handleAccountDeletion}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="deletePassword" className="text-white">
                      Confirmez avec votre mot de passe
                    </Label>
                    <Input
                      id="deletePassword"
                      type="password"
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmText" className="text-white">
                      Tapez "DELETE" pour confirmer
                    </Label>
                    <Input
                      id="confirmText"
                      type="text"
                      placeholder="DELETE"
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-slate-700 text-white hover:bg-slate-600">
                    Annuler
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button 
                      type="submit" 
                      variant="destructive" 
                      disabled={isLoading}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isLoading ? "Suppression..." : "Supprimer définitivement"}
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}