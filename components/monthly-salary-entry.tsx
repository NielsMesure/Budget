"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Euro, Calendar, Check } from "lucide-react"
import { useFinancialData } from "@/hooks/use-financial-data"

interface MonthlySalaryEntry {
  month: string // Format: "2025-01" (YYYY-MM)
  amount: number
  date: string // When the salary was added
}

export function MonthlySalaryEntry() {
  const { data, updateSalary } = useFinancialData()
  const [amount, setAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get current month in YYYY-MM format
  const currentMonth = new Date().toISOString().slice(0, 7)
  const currentMonthName = new Date().toLocaleDateString("fr-FR", { 
    month: "long", 
    year: "numeric" 
  })

  // Get existing monthly salary entries from localStorage
  const getMonthlySalaries = (): MonthlySalaryEntry[] => {
    try {
      const stored = localStorage.getItem("monthly-salaries")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  // Save monthly salary entries to localStorage
  const saveMonthlySalaries = (salaries: MonthlySalaryEntry[]) => {
    localStorage.setItem("monthly-salaries", JSON.stringify(salaries))
  }

  const monthlySalaries = getMonthlySalaries()
  const currentMonthSalary = monthlySalaries.find(s => s.month === currentMonth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const salaryAmount = parseFloat(amount)
    if (!salaryAmount || salaryAmount <= 0) {
      return
    }

    setIsSubmitting(true)

    try {
      // Update monthly salary entries
      const existingSalaries = getMonthlySalaries()
      const existingIndex = existingSalaries.findIndex(s => s.month === currentMonth)
      
      const newEntry: MonthlySalaryEntry = {
        month: currentMonth,
        amount: salaryAmount,
        date: new Date().toISOString()
      }

      let updatedSalaries: MonthlySalaryEntry[]
      if (existingIndex >= 0) {
        // Add to existing month salary
        updatedSalaries = [...existingSalaries]
        updatedSalaries[existingIndex] = {
          ...updatedSalaries[existingIndex],
          amount: updatedSalaries[existingIndex].amount + salaryAmount,
          date: new Date().toISOString()
        }
      } else {
        // Create new month entry
        updatedSalaries = [...existingSalaries, newEntry]
      }

      saveMonthlySalaries(updatedSalaries)

      // Update the main salary amount (for backward compatibility)
      const newTotalSalary = (data.salary || 0) + salaryAmount
      updateSalary(newTotalSalary)

      // Reset form
      setAmount("")
    } catch (error) {
      console.error("Erreur lors de l'ajout du salaire:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate total salary for current month
  const currentMonthTotal = currentMonthSalary?.amount || 0

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Euro className="h-5 w-5 text-green-400" />
          Salaire mensuel
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Calendar className="h-4 w-4" />
          <span>{currentMonthName}</span>
          {currentMonthTotal > 0 && (
            <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-600/30">
              {currentMonthTotal.toLocaleString("fr-FR", { 
                style: "currency", 
                currency: "EUR" 
              })} ajoutés ce mois
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="salary-amount" className="text-white">
              Montant du salaire (€) *
            </Label>
            <Input
              id="salary-amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="2500.00"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              required
            />
            <p className="text-xs text-slate-400">
              Ce montant sera ajouté à votre solde du mois en cours
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || !amount}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Ajout en cours...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Ajouter le salaire
                </>
              )}
            </Button>
          </div>
        </form>
        
        {/* Summary */}
        {currentMonthTotal > 0 && (
          <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
            <div className="text-sm text-slate-300">
              <p className="font-medium text-white mb-1">Résumé mensuel</p>
              <p>Total des salaires de {currentMonthName} : {" "}
                <span className="text-green-400 font-medium">
                  {currentMonthTotal.toLocaleString("fr-FR", { 
                    style: "currency", 
                    currency: "EUR" 
                  })}
                </span>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}