"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useFinancialData } from "@/hooks/use-financial-data"
import { BudgetForm } from "@/components/budget-form"

export function BudgetManager() {
  const { data } = useFinancialData()

  // Calcule le montant dépensé pour chaque budget à partir des transactions
  const budgetsWithCalculations = data.budgets.map((budget) => {
    const spent = data.transactions
      .filter((t) => t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0)
    
    // Calcule le montant alloué : soit directement, soit basé sur le pourcentage du salaire
    const allocated = budget.allocated || (budget.percentage ? (data.salary * budget.percentage) / 100 : 0)
    
    return { 
      ...budget, 
      spent,
      allocated,
      displayPercentage: budget.percentage 
    }
  })

  const totalAllocated = budgetsWithCalculations.reduce((sum, budget) => sum + budget.allocated, 0)
  const totalSpent = budgetsWithCalculations.reduce((sum, budget) => sum + budget.spent, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Mes Budgets</h1>
        <BudgetForm />
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

          {totalAllocated > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Progression globale</span>
                <span className="text-white">{Math.round((totalSpent / totalAllocated) * 100)}%</span>
              </div>
              <Progress value={(totalSpent / totalAllocated) * 100} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {budgetsWithCalculations.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <p className="text-slate-400 mb-4">Aucun budget créé pour le moment</p>
            <p className="text-slate-300 text-sm">
              Créez votre premier budget en cliquant sur "Nouveau budget" ci-dessus
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgetsWithCalculations.map((budget) => {
            const percentage = budget.allocated > 0 ? (budget.spent / budget.allocated) * 100 : 0
            const isOverBudget = budget.spent > budget.allocated

            return (
              <Card key={budget.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{budget.emoji}</div>
                      <div>
                        <h3 className="text-white font-semibold capitalize">
                          {budget.category}
                          {budget.displayPercentage && (
                            <span className="text-xs text-slate-400 ml-2">
                              ({budget.displayPercentage}%)
                            </span>
                          )}
                        </h3>
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

                  {budget.allocated > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Progression</span>
                        <span className={`${isOverBudget ? "text-red-400" : "text-white"}`}>
                          {Math.round(percentage)}%
                        </span>
                      </div>
                      <Progress value={Math.min(percentage, 100)} className="h-2" />
                      {isOverBudget && (
                        <p className="text-red-400 text-xs">Dépassement de {(percentage - 100).toFixed(1)}%</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
