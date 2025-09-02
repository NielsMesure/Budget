"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useFinancialData } from "@/hooks/use-financial-data"

const EMOJIS = [
  "🍽️", "🚗", "🎬", "🛍️", "⚕️", "🏠", "📚", "💼", "🎵", "🏃",
  "👕", "⚡", "💻", "🎨", "🌟", "🎯", "💰", "🔧", "🌍", "📱"
]

const COLORS = [
  "bg-green-500", "bg-blue-500", "bg-purple-500", "bg-yellow-500", "bg-red-500",
  "bg-orange-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500", "bg-cyan-500"
]

export function BudgetForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [category, setCategory] = useState("")
  const [isPercentage, setIsPercentage] = useState(false)
  const [amount, setAmount] = useState("")
  const [percentage, setPercentage] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJIS[0])
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const { addBudget, data } = useFinancialData()

  const calculatedAmount = isPercentage && percentage ? 
    (data.salary * parseFloat(percentage)) / 100 : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!category) return

    const budgetData = {
      category: category.toLowerCase(),
      color: selectedColor,
      emoji: selectedEmoji,
      allocated: isPercentage ? undefined : parseFloat(amount),
      percentage: isPercentage ? parseFloat(percentage) : undefined,
    }

    addBudget(budgetData)
    
    // Reset form
    setCategory("")
    setAmount("")
    setPercentage("")
    setSelectedEmoji(EMOJIS[0])
    setSelectedColor(COLORS[0])
    setIsPercentage(false)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau budget
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Créer un nouveau budget</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Nom de la catégorie</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="ex: Loisir, Sport, Courses..."
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="percentage-mode"
              checked={isPercentage}
              onCheckedChange={setIsPercentage}
            />
            <Label htmlFor="percentage-mode">Utiliser un pourcentage du salaire</Label>
          </div>

          {isPercentage ? (
            <div className="space-y-2">
              <Label htmlFor="percentage">Pourcentage (%)</Label>
              <Input
                id="percentage"
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="ex: 30"
                min="0"
                max="100"
                step="0.1"
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
              {percentage && data.salary > 0 && (
                <p className="text-sm text-slate-400">
                  {percentage}% de votre salaire = {calculatedAmount.toLocaleString("fr-FR", { 
                    style: "currency", 
                    currency: "EUR" 
                  })}
                </p>
              )}
              {percentage && data.salary === 0 && (
                <p className="text-sm text-yellow-400">
                  Veuillez définir votre salaire pour voir le montant calculé
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="amount">Montant alloué (€)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="ex: 300"
                min="0"
                step="0.01"
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Emoji</Label>
            <Select value={selectedEmoji} onValueChange={setSelectedEmoji}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {EMOJIS.map((emoji) => (
                  <SelectItem key={emoji} value={emoji} className="text-white">
                    {emoji}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Couleur</Label>
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${selectedColor}`} />
                    <span>Couleur sélectionnée</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {COLORS.map((color) => (
                  <SelectItem key={color} value={color} className="text-white">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${color}`} />
                      <span>Couleur</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-slate-600 text-slate-300"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
            >
              Créer le budget
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}