"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useFinancialData } from "@/hooks/use-financial-data"
import { Clock, Calendar } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const categoryIcons = {
    food: "🍽️",
    transport: "🚗",
    entertainment: "🎬",
    utilities: "⚡",
    shopping: "🛍️",
    health: "⚕️",
    education: "📚",
    other: "💳",
}

const categoryColors = {
    food: "bg-green-500/20 text-green-400 border-green-500/30",
    transport: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    entertainment: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    utilities: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    shopping: "bg-red-500/20 text-red-400 border-red-500/30",
    health: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    education: "bg-lime-500/20 text-lime-400 border-lime-500/30",
    other: "bg-gray-500/20 text-gray-400 border-gray-500/30",
}

export function RecentTransactions() {
    const { data } = useFinancialData()

    // Combiner et trier les transactions
    const allTransactions = [
        ...data.transactions.map((t) => ({ ...t, type: "transaction" as const })),
        ...data.recurringTransactions.map((t) => ({
            ...t,
            type: "recurring" as const,
            date: t.nextDate,
            description: t.name,
            amount: t.amount,
        })),
    ]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10)

    if (allTransactions.length === 0) {
        return (
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Transactions récentes
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center text-slate-400">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Aucune transaction enregistrée</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Transactions récentes
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {allTransactions.map((transaction, index) => (
                        <div
                            key={`${transaction.type}-${transaction.id || index}`}
                            className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">
                                    {transaction.type === "recurring" && "logo" in transaction
                                        ? transaction.logo
                                        : categoryIcons[transaction.category as keyof typeof categoryIcons] || "💳"}
                                </div>
                                <div>
                                    <div className="text-white font-medium">{transaction.description || transaction.name}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge
                                            variant="outline"
                                            className={
                                                categoryColors[transaction.category as keyof typeof categoryColors] || categoryColors.other
                                            }
                                        >
                                            {transaction.category}
                                        </Badge>
                                        {transaction.type === "recurring" && (
                                            <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                                Récurrent
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-white font-bold">
                                    -{transaction.amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                                </div>
                                <div className="text-slate-400 text-sm">
                                    {format(new Date(transaction.date), "dd MMM", { locale: fr })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
