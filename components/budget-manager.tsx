"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useFinancialData } from "@/hooks/use-financial-data"

// Budgets définis avec leurs montants alloués. Le montant dépensé est calculé
// dynamiquement à partir des transactions.
const budgets = [
  {
    id: 1,
    category: "food",
    label: "Alimentation",
    allocated: 400,
    color: "bg-green-500",
    emoji: "🍽️",
  },
  {
    id: 2,
    category: "transport",
    label: "Transport",
    allocated: 150,
    color: "bg-blue-500",
    emoji: "🚗",
  },
  {
    id: 3,
    category: "entertainment",
    label: "Divertissement",
    allocated: 200,
    color: "bg-purple-500",
    emoji: "🎬",
  },
  {
    id: 4,
    category: "shopping",
    label: "Shopping",
    allocated: 300,
    color: "bg-yellow-500",
    emoji: "🛍️",
  },
  {
    id: 5,
    category: "health",
    label: "Santé",
    allocated: 100,
    color: "bg-red-500",
    emoji: "⚕️",
  },
]

export function BudgetManager() {
  const { data } = useFinancialData()

  // Calcule le montant dépensé pour chaque budget à partir des transactions
  const budgetsWithSpent = budgets.map((budget) => {
    const spent = data.transactions
      .filter((t) => t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0)
    return { ...budget, spent }
  })

  const totalAllocated = budgetsWithSpent.reduce((sum, budget) => sum + budget.allocated, 0)
  const totalSpent = budgetsWithSpent.reduce((sum, budget) => sum + budget.spent, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Mes Budgets</h1>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau budget
        </Button>
      </div>

      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Vue d'ensemble</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {totalAllocated.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
              </div>
              <p className="text-slate-400">Budget total</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {totalSpent.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
              </div>
              <p className="text-slate-400">Dépensé</p>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${totalSpent <= totalAllocated ? "text-green-400" : "text-red-400"}`}>
                {(totalAllocated - totalSpent).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
              </div>
              <p className="text-slate-400">Restant</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Progression globale</span>
              <span className="text-white">{Math.round((totalSpent / totalAllocated) * 100)}%</span>
            </div>
            <Progress value={(totalSpent / totalAllocated) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgetsWithSpent.map((budget) => {
          const percentage = (budget.spent / budget.allocated) * 100
          const isOverBudget = budget.spent > budget.allocated

          return (
            <Card key={budget.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{budget.emoji}</div>
                    <div>
                      <h3 className="text-white font-semibold">{budget.label}</h3>
                      <p className="text-slate-400 text-sm">
                        {budget.spent.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })} /{" "}
                        {budget.allocated.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                      </p>
                    </div>
                  </div>
                  <div className={`text-right ${isOverBudget ? "text-red-400" : "text-green-400"}`}>
                    <div className="font-bold">
                      {(budget.allocated - budget.spent).toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </div>
                    <div className="text-xs">{isOverBudget ? "Dépassé" : "Restant"}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progression</span>
                    <span className={`${isOverBudget ? "text-red-400" : "text-white"}`}>{Math.round(percentage)}%</span>
                  </div>
                  <Progress value={Math.min(percentage, 100)} className="h-2" />
                  {isOverBudget && (
                    <p className="text-red-400 text-xs">Dépassement de {(percentage - 100).toFixed(1)}%</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
