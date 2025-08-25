"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Check } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useFinancialData } from "@/hooks/use-financial-data"

const categories = [
  { value: "food", label: "Alimentation", icon: "🍽️" },
  { value: "transport", label: "Transport", icon: "🚗" },
  { value: "entertainment", label: "Divertissement", icon: "🎬" },
  { value: "utilities", label: "Factures", icon: "⚡" },
  { value: "shopping", label: "Shopping", icon: "🛍️" },
  { value: "health", label: "Santé", icon: "⚕️" },
  { value: "education", label: "Éducation", icon: "📚" },
  { value: "other", label: "Autre", icon: "💳" },
]

export function TransactionForm() {
  const { addTransaction, addRecurringTransaction, addIncome } = useFinancialData()
  const [date, setDate] = useState<Date>()
  const [isRecurring, setIsRecurring] = useState(false)
  const [isIncome, setIsIncome] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    notes: "",
    frequency: "monthly",
    logo: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount || (!isIncome && (!formData.category || !formData.description || !date))) {
      return
    }

    setIsSubmitting(true)

    try {
      if (isIncome) {
        addIncome(Number.parseFloat(formData.amount))
      } else if (isRecurring) {
        addRecurringTransaction({
          name: formData.description,
          amount: Number.parseFloat(formData.amount),
          nextDate: date.toISOString().split("T")[0],
          category: formData.category,
          logo: formData.logo || categories.find((c) => c.value === formData.category)?.icon || "💳",
          color: "bg-blue-500",
          frequency: formData.frequency as any,
        })
      } else {
        addTransaction({
          amount: Number.parseFloat(formData.amount),
          description: formData.description,
          category: formData.category,
          date: date.toISOString().split("T")[0],
          isRecurring: false,
          notes: formData.notes,
        })
      }

      // Reset form
      setFormData({
        amount: "",
        category: "",
        description: "",
        notes: "",
        frequency: "monthly",
        logo: "",
      })
      setDate(undefined)
      setIsRecurring(false)
      setIsIncome(false)
    } catch (error) {
      console.error("Erreur lors de l'ajout de la transaction:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      amount: "",
      category: "",
      description: "",
      notes: "",
      frequency: "monthly",
      logo: "",
    })
    setDate(undefined)
    setIsRecurring(false)
    setIsIncome(false)
  }

  return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nouvelle transaction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">
                  Montant (€) *
                </Label>
                <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-white">
                  Catégorie *
                </Label>
                <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    required
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </div>
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Description *
              </Label>
              <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de la transaction"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-700 border-slate-600">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className="text-white" />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="income"
                checked={isIncome}
                onCheckedChange={(checked) => {
                  setIsIncome(checked)
                  if (checked) setIsRecurring(false)
                }}
              />
              <Label htmlFor="income" className="text-white">
                Ajouter au salaire
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
                disabled={isIncome}
              />
              <Label htmlFor="recurring" className="text-white">
                Transaction récurrente
              </Label>
            </div>

            {isRecurring && (
                <div className="space-y-4 p-4 bg-slate-700/50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="frequency" className="text-white">
                        Fréquence
                      </Label>
                      <Select
                          value={formData.frequency}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, frequency: value }))}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Sélectionner la fréquence" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="weekly">Hebdomadaire</SelectItem>
                          <SelectItem value="monthly">Mensuelle</SelectItem>
                          <SelectItem value="quarterly">Trimestrielle</SelectItem>
                          <SelectItem value="yearly">Annuelle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logo" className="text-white">
                        Logo/Emoji
                      </Label>
                      <Input
                          id="logo"
                          value={formData.logo}
                          onChange={(e) => setFormData((prev) => ({ ...prev, logo: e.target.value }))}
                          placeholder="🎬 ou URL du logo"
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-white">
                Notes (optionnel)
              </Label>
              <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Notes supplémentaires..."
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Ajout en cours...
                    </>
                ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Ajouter la transaction
                    </>
                )}
              </Button>
              <Button
                  type="button"
                  onClick={resetForm}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
              >
                Réinitialiser
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
  )
}
