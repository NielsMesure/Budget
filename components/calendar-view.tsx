"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Plus, Check } from "lucide-react"
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

export function CalendarView() {
  const { data, isLoaded, addTransaction, addRecurringTransaction } = useFinancialData()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showTransactionDialog, setShowTransactionDialog] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isRecurring, setIsRecurring] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    frequency: "monthly",
    logo: "",
  })

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ]

  // Afficher un skeleton pendant le chargement
  if (!isLoaded) {
    return (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="h-6 w-32 bg-slate-600 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-slate-600 rounded animate-pulse" />
                <div className="h-8 w-8 bg-slate-600 rounded animate-pulse" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="h-12 bg-slate-700/50 rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
    )
  }

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getTransactionsForDate = (date: number) => {
    return data.recurringTransactions.filter((transaction) => transaction.dayOfMonth === date)
  }

  const handleCellClick = (date: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date)
    setSelectedDate(clickedDate)
    setShowTransactionDialog(true)
    // Reset form data
    setFormData({
      amount: "",
      category: "",
      description: "",
      frequency: "monthly",
      logo: "",
    })
    setIsRecurring(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount || !formData.category || !formData.description || !selectedDate) {
      return
    }

    setIsSubmitting(true)

    try {
      const dateStr = selectedDate.toISOString().split("T")[0]

      if (isRecurring) {
        addRecurringTransaction({
          name: formData.description,
          amount: Number.parseFloat(formData.amount),
          nextDate: dateStr,
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
          date: dateStr,
          isRecurring: false,
          notes: "",
        })
      }

      // Reset and close
      setFormData({
        amount: "",
        category: "",
        description: "",
        frequency: "monthly",
        logo: "",
      })
      setIsRecurring(false)
      setShowTransactionDialog(false)
      setSelectedDate(null)
    } catch (error) {
      console.error("Erreur lors de l'ajout de la transaction:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={previousMonth}
                  className="text-slate-300 hover:text-white hover:bg-slate-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextMonth}
                  className="text-slate-300 hover:text-white hover:bg-slate-700"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-slate-400">
                  {day}
                </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: adjustedFirstDay }, (_, i) => (
                <div key={`empty-${i}`} className="p-2 h-12" />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => {
              const date = i + 1
              const transactions = getTransactionsForDate(date)
              const isToday =
                  new Date().getDate() === date &&
                  new Date().getMonth() === currentDate.getMonth() &&
                  new Date().getFullYear() === currentDate.getFullYear()

              return (
                  <div
                      key={date}
                      onClick={() => handleCellClick(date)}
                      className={`p-2 h-12 flex flex-col items-center justify-center rounded-lg relative cursor-pointer hover:bg-slate-700 transition-colors ${
                          isToday ? "bg-purple-600 text-white" : "text-slate-300"
                      }`}
                  >
                    <span className="text-sm font-medium">{date}</span>
                    {transactions.length > 0 && (
                        <div className="absolute -bottom-1 -right-1 flex gap-1">
                          {transactions.slice(0, 2).map((transaction, index) => (
                              <div
                                  key={transaction.id}
                                  className={`w-4 h-4 rounded-full ${transaction.color} flex items-center justify-center text-xs`}
                                  title={`${transaction.name} - ${transaction.amount}€`}
                              >
                                {transaction.logo || "💳"}
                              </div>
                          ))}
                          {transactions.length > 2 && (
                              <div className="w-4 h-4 rounded-full bg-slate-600 flex items-center justify-center text-xs text-white">
                                +{transactions.length - 2}
                              </div>
                          )}
                        </div>
                    )}
                  </div>
              )
            })}
          </div>

          {data.recurringTransactions.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <p>Aucune transaction récurrente à afficher</p>
                <p className="text-sm mt-1">Ajoutez des abonnements pour les voir sur le calendrier</p>
              </div>
          )}
        </CardContent>

        {/* Transaction Dialog */}
        <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nouvelle transaction
                {selectedDate && (
                  <span className="text-sm text-slate-400 ml-2">
                    {selectedDate.toLocaleDateString("fr-FR")}
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="recurring"
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                />
                <Label htmlFor="recurring" className="text-white">
                  Transaction récurrente
                </Label>
              </div>

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

              {isRecurring && (
                <div className="space-y-4 p-4 bg-slate-700/50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="frequency" className="text-white">
                        Fréquence
                      </Label>
                      <Select
                        value={formData.frequency}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, frequency: value }))}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Fréquence" />
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
                        placeholder="🎬"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Ajout...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Ajouter
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowTransactionDialog(false)}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </Card>
  )
}
