"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFinancialData } from "@/hooks/use-financial-data"
import { PieChart } from "lucide-react"
import { useState } from "react"

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
    const [selectedPeriod, setSelectedPeriod] = useState("all")

    // Générer les options de période
    const getPeriodOptions = () => {
        const options = [
            { value: "all", label: "Total depuis le début" },
            { value: "current", label: "Ce mois" },
        ]

        // Ajouter les mois précédents disponibles basés sur les transactions
        const availableMonths = new Set<string>()
        data.transactions.forEach(transaction => {
            const date = new Date(transaction.date)
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            availableMonths.add(monthKey)
        })

        const currentDate = new Date()
        const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
        
        // Trier les mois et ajouter ceux qui ne sont pas le mois actuel
        Array.from(availableMonths)
            .filter(month => month !== currentMonth)
            .sort((a, b) => b.localeCompare(a)) // Plus récent en premier
            .slice(0, 6) // Limiter à 6 mois précédents
            .forEach(month => {
                const [year, monthNum] = month.split('-')
                const date = new Date(parseInt(year), parseInt(monthNum) - 1)
                const monthName = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
                options.push({ 
                    value: month, 
                    label: monthName.charAt(0).toUpperCase() + monthName.slice(1)
                })
            })

        return options
    }

    // Filtrer les transactions selon la période sélectionnée
    const getFilteredTransactions = () => {
        if (selectedPeriod === "all") {
            return data.transactions
        }
        
        if (selectedPeriod === "current") {
            const currentDate = new Date()
            const currentMonth = currentDate.getMonth()
            const currentYear = currentDate.getFullYear()
            
            return data.transactions.filter(transaction => {
                const transactionDate = new Date(transaction.date)
                return transactionDate.getMonth() === currentMonth && 
                       transactionDate.getFullYear() === currentYear
            })
        }
        
        // Pour un mois spécifique (format: YYYY-MM)
        const [year, month] = selectedPeriod.split('-').map(Number)
        return data.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date)
            return transactionDate.getMonth() === month - 1 && 
                   transactionDate.getFullYear() === year
        })
    }

    const filteredTransactions = getFilteredTransactions()

    // Calculer les dépenses par catégorie pour les transactions filtrées
    const expensesByCategory = filteredTransactions.reduce(
        (acc, transaction) => {
            const category = transaction.category as keyof typeof categoryColors
            acc[category] = (acc[category] || 0) + transaction.amount
            return acc
        },
        {} as Record<string, number>,
    )

    // Ajouter les transactions récurrentes seulement si "all" est sélectionné
    if (selectedPeriod === "all") {
        data.recurringTransactions.forEach((transaction) => {
            const category = transaction.category.toLowerCase() as keyof typeof categoryColors
            expensesByCategory[category] = (expensesByCategory[category] || 0) + transaction.amount
        })
    }

    const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0)

    const totalPositive = data.salary
    const remainingMoney = totalPositive - totalExpenses

    if (totalExpenses === 0) {
    return (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Répartition des dépenses
                    </CardTitle>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="w-[200px] bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Choisir une période" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                            {getPeriodOptions().map(option => (
                                <SelectItem 
                                    key={option.value} 
                                    value={option.value}
                                    className="text-white hover:bg-slate-600"
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-slate-400">
                    <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune dépense enregistrée pour cette période</p>
                </div>
            </CardContent>
        </Card>
    )
    }

    // Créer les segments du diagramme
    const outerRadius = 80
    const innerRadius = 50
    const centerX = 100
    const centerY = 100
    let currentAngle = -90
    const segments = Object.entries(expensesByCategory).map(([category, amount]) => {
        const angle = (amount / totalExpenses) * 360
        const startAngle = currentAngle
        const endAngle = currentAngle + angle
        currentAngle += angle

        // Calculer les coordonnées du segment
        const x1Outer = centerX + outerRadius * Math.cos((startAngle * Math.PI) / 180)
        const y1Outer = centerY + outerRadius * Math.sin((startAngle * Math.PI) / 180)
        const x2Outer = centerX + outerRadius * Math.cos((endAngle * Math.PI) / 180)
        const y2Outer = centerY + outerRadius * Math.sin((endAngle * Math.PI) / 180)

        const x1Inner = centerX + innerRadius * Math.cos((startAngle * Math.PI) / 180)
        const y1Inner = centerY + innerRadius * Math.sin((startAngle * Math.PI) / 180)
        const x2Inner = centerX + innerRadius * Math.cos((endAngle * Math.PI) / 180)
        const y2Inner = centerY + innerRadius * Math.sin((endAngle * Math.PI) / 180)

        const largeArcFlag = angle > 180 ? 1 : 0

        const pathData = [
            `M ${x1Outer} ${y1Outer}`,
            `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}`,
            `L ${x2Inner} ${y2Inner}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1Inner} ${y1Inner}`,
            "Z",
        ].join(" ")

        return {
            category,
            amount,
            pathData,
            color: categoryColors[category as keyof typeof categoryColors] || categoryColors.other,
        }
    })

    return (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Répartition des dépenses
                    </CardTitle>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="w-[200px] bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Choisir une période" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                            {getPeriodOptions().map(option => (
                                <SelectItem 
                                    key={option.value} 
                                    value={option.value}
                                    className="text-white hover:bg-slate-600"
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col lg:flex-row items-center gap-6">
                    {/* Diagramme en cercle */}
                    <div className="relative">
                        <svg width="200" height="200" viewBox="0 0 200 200">
                            {segments.length === 1 ? (
                                <circle cx="100" cy="100" r={outerRadius} fill={segments[0].color} />
                            ) : (
                                segments.map((segment) => (
                                    <path
                                        key={segment.category}
                                        d={segment.pathData}
                                        fill={segment.color}
                                        className="hover:opacity-80 transition-opacity cursor-pointer"
                                    />
                                ))
                            )}
                            <circle cx="100" cy="100" r={innerRadius} fill="#000000" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className={`text-xl font-bold mb-1 ${remainingMoney >= 0 ? "text-green-400" : "text-red-400"}`}>
                                    {remainingMoney.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                                </div>
                                <div className="text-xs text-slate-400">Argent restant</div>
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
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
