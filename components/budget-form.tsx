"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useFinancialData } from "@/hooks/use-financial-data"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"

interface BudgetFormProps {
  onBudgetCreated?: () => void
}

const colorOptions = [
  { name: "Vert", value: "bg-green-500" },
  { name: "Bleu", value: "bg-blue-500" },
  { name: "Violet", value: "bg-purple-500" },
  { name: "Jaune", value: "bg-yellow-500" },
  { name: "Rouge", value: "bg-red-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Rose", value: "bg-pink-500" },
  { name: "Cyan", value: "bg-cyan-500" },
]

const emojiOptions = ["🍽️", "🚗", "🎬", "🛍️", "⚕️", "🏠", "🎓", "💼", "🎾", "✈️", "📱", "👕"]

export function BudgetForm({ onBudgetCreated }: BudgetFormProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [usePercentage, setUsePercentage] = useState(false)
  const [formData, setFormData] = useState({
    category: "",
    allocated: "",
    percentage: "",
    color: "bg-green-500",
    emoji: "🍽️"
  })

  const { data } = useFinancialData()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const userId = localStorage.getItem("userId")
      if (!userId) {
        toast({
          title: "Erreur",
          description: "Utilisateur non connecté",
          variant: "destructive",
        })
        return
      }

      if (!formData.category) {
        toast({
          title: "Erreur", 
          description: "Le nom de la catégorie est requis",
          variant: "destructive",
        })
        return
      }

      if (usePercentage && !formData.percentage) {
        toast({
          title: "Erreur",
          description: "Le pourcentage est requis",
          variant: "destructive",
        })
        return
      }

      if (!usePercentage && !formData.allocated) {
        toast({
          title: "Erreur",
          description: "Le montant alloué est requis",
          variant: "destructive",
        })
        return
      }

      const payload = {
        userId,
        category: formData.category,
        allocated: usePercentage ? null : parseFloat(formData.allocated),
        percentage: usePercentage ? parseFloat(formData.percentage) : null,
        color: formData.color,
        emoji: formData.emoji
      }

      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erreur lors de la création du budget")
      }

      const result = await response.json()

      // Calculer le montant équivalent pour l'affichage
      const calculatedAmount = usePercentage 
        ? (data.salary * parseFloat(formData.percentage)) / 100 
        : parseFloat(formData.allocated)

      toast({
        title: "Budget créé",
        description: usePercentage 
          ? `${formData.category}: ${formData.percentage}% = ${calculatedAmount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}`
          : `${formData.category}: ${calculatedAmount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}`,
      })

      // Reset form
      setFormData({
        category: "",
        allocated: "",
        percentage: "",
        color: "bg-green-500",
        emoji: "🍽️"
      })
      setUsePercentage(false)
      setOpen(false)
      onBudgetCreated?.()
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur inconnue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculatePreview = () => {
    if (usePercentage && formData.percentage && data.salary) {
      return (data.salary * parseFloat(formData.percentage)) / 100
    }
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau budget
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un nouveau budget</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category">Nom de la catégorie</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="ex: Loisirs, Alimentation..."
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="use-percentage"
              checked={usePercentage}
              onCheckedChange={setUsePercentage}
            />
            <Label htmlFor="use-percentage">Utiliser un pourcentage du salaire</Label>
          </div>

          {usePercentage ? (
            <div>
              <Label htmlFor="percentage">Pourcentage (%)</Label>
              <Input
                id="percentage"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.percentage}
                onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                placeholder="ex: 30"
                className="bg-slate-700 border-slate-600 text-white"
              />
              {calculatePreview() && (
                <p className="text-sm text-slate-400 mt-1">
                  = {calculatePreview()?.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                </p>
              )}
            </div>
          ) : (
            <div>
              <Label htmlFor="allocated">Montant alloué (€)</Label>
              <Input
                id="allocated"
                type="number"
                min="0"
                step="0.01"
                value={formData.allocated}
                onChange={(e) => setFormData({ ...formData, allocated: e.target.value })}
                placeholder="ex: 300"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          )}

          <div>
            <Label>Emoji</Label>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData({ ...formData, emoji })}
                  className={`p-2 text-xl hover:bg-slate-700 rounded ${
                    formData.emoji === emoji ? "bg-slate-600" : ""
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Couleur</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`p-3 rounded ${color.value} ${
                    formData.color === color.value ? "ring-2 ring-white" : ""
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 bg-transparent border-slate-600 text-white hover:bg-slate-700"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? "Création..." : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}