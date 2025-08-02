"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinancialData } from "@/hooks/use-financial-data"
import { PieChart } from "lucide-react"

const categoryColors = {
    food: "#10b981",
    transport: "#3b82f6",
    entertainment: "#8b5cf6",
    utilities: "#f59e0b",
    shopping: "#ef4444",
    health: "#06b6d4",
    education: "#84cc16",
    other: "#6b7280",
}

const categoryLabels = {
    food: "Alimentation",
    transport: "Transport",
    entertainment: "Divertissement",
    utilities: "Factures",
    shopping: "Shopping",
    health: "Santé",
    education: "Éducation",
    other: "Autre",
}

export function ExpenseChart() {
    const { data } = useFinancialData()

    // Calculer les dépenses par catégorie
    const expensesByCategory = data.transactions.reduce(
        (acc, transaction) => {
            const category = transaction.category as keyof typeof categoryColors
            acc[category] = (acc[category] || 0) + transaction.amount
            return acc
        },
        {} as Record<string, number>,
    )

    // Ajouter les transactions récurrentes
    data.recurringTransactions.forEach((transaction) => {
        const category = transaction.category as keyof typeof categoryColors
        expensesByCategory[category] = (expensesByCategory[category] || 0) + transaction.amount
    })

    const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0)

    if (totalExpenses === 0) {
        return (
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Répartition des dépenses
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center text-slate-400">
                        <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Aucune dépense enregistrée</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Créer les segments du diagramme
    let currentAngle = 0
    const segments = Object.entries(expensesByCategory).map(([category, amount]) => {
        const percentage = (amount / totalExpenses) * 100
        const angle = (amount / totalExpenses) * 360
        const startAngle = currentAngle
        const endAngle = currentAngle + angle
        currentAngle += angle

        // Calculer les coordonnées du segment
        const radius = 80
        const centerX = 100
        const centerY = 100

        const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180)
        const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180)
        const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180)
        const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180)

        const largeArcFlag = angle > 180 ? 1 : 0

        const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            "Z",
        ].join(" ")

        return {
            category,
            amount,
            percentage,
            pathData,
            color: categoryColors[category as keyof typeof categoryColors] || categoryColors.other,
        }
    })

    return (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Répartition des dépenses
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col lg:flex-row items-center gap-6">
                    {/* Diagramme en cercle */}
                    <div className="relative">
                        <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
                            {segments.map((segment, index) => (
                                <path
                                    key={segment.category}
                                    d={segment.pathData}
                                    fill={segment.color}
                                    className="hover:opacity-80 transition-opacity cursor-pointer"
                                />
                            ))}
                        </svg>
                        {/* Total au centre */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">
                                    {totalExpenses.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                                </div>
                                <div className="text-sm text-slate-400">Total</div>
                            </div>
                        </div>
                    </div>

                    {/* Légende */}
                    <div className="flex-1 space-y-3">
                        {segments.map((segment) => (
                            <div key={segment.category} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }} />
                                    <span className="text-white text-sm">
                    {categoryLabels[segment.category as keyof typeof categoryLabels]}
                  </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-white font-medium">
                                        {segment.amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                                    </div>
                                    <div className="text-slate-400 text-xs">{segment.percentage.toFixed(1)}%</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
