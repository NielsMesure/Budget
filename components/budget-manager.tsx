"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trash2, Edit } from "lucide-react"
import { useFinancialData } from "@/hooks/use-financial-data"
import { useToast } from "@/hooks/use-toast"
import { BudgetForm } from "@/components/budget-form"

interface Budget {
  id: number
  category: string
  allocated: number
  percentage?: number
  spent: number
  color: string
  emoji: string
}

export function BudgetManager() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data } = useFinancialData()
  const { toast } = useToast()

  const fetchBudgets = async () => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      const response = await fetch(`/api/budgets?userId=${userId}`)
      if (response.ok) {
        const budgetsData = await response.json()
        setBudgets(budgetsData)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des budgets:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les budgets",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBudgets()
  }, [])

  const handleDeleteBudget = async (budgetId: number) => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      const response = await fetch(`/api/budgets?id=${budgetId}&userId=${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setBudgets(budgets.filter(b => b.id !== budgetId))
        toast({
          title: "Budget supprimé",
          description: "Le budget a été supprimé avec succès",
        })
      } else {
        throw new Error("Erreur lors de la suppression")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le budget",
        variant: "destructive",
      })
    }
  }

  const totalAllocated = budgets.reduce((sum, budget) => sum + budget.allocated, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Mes Budgets</h1>
        </div>
        <div className="text-white text-center">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Mes Budgets</h1>
        <BudgetForm onBudgetCreated={fetchBudgets} />
      </div>

      {budgets.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="text-white text-lg mb-2">Aucun budget configuré</div>
            <p className="text-slate-400 mb-4">
              Créez votre premier budget pour commencer à suivre vos dépenses
            </p>
            <BudgetForm onBudgetCreated={fetchBudgets} />
          </CardContent>
        </Card>
      ) : (
        <>
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
                  <span className="text-white">{totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0}%</span>
                </div>
                <Progress value={totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.map((budget) => {
              const percentage = budget.allocated > 0 ? (budget.spent / budget.allocated) * 100 : 0
              const isOverBudget = budget.spent > budget.allocated

              return (
                <Card key={budget.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{budget.emoji}</div>
                        <div>
                          <h3 className="text-white font-semibold">{budget.category}</h3>
                          <p className="text-slate-400 text-sm">
                            {budget.spent.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })} /{" "}
                            {budget.allocated.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                            {budget.percentage && (
                              <span className="ml-1">({budget.percentage}%)</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`text-right ${isOverBudget ? "text-red-400" : "text-green-400"}`}>
                          <div className="font-bold">
                            {(budget.allocated - budget.spent).toLocaleString("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </div>
                          <div className="text-xs">{isOverBudget ? "Dépassé" : "Restant"}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBudget(budget.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
        </>
      )}
    </div>
  )
}
