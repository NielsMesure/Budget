"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const recurringTransactions = [
  {
    id: 1,
    name: "Netflix",
    amount: 15.99,
    nextDate: "5 Nov",
    category: "Divertissement",
    logo: "🎬",
    color: "bg-red-500",
  },
  {
    id: 2,
    name: "Spotify Premium",
    amount: 9.99,
    nextDate: "12 Nov",
    category: "Musique",
    logo: "🎵",
    color: "bg-green-500",
  },
  {
    id: 3,
    name: "Google Drive",
    amount: 1.99,
    nextDate: "18 Nov",
    category: "Stockage",
    logo: "☁️",
    color: "bg-blue-500",
  },
  {
    id: 4,
    name: "Adobe Creative Cloud",
    amount: 59.99,
    nextDate: "25 Nov",
    category: "Outils",
    logo: "🎨",
    color: "bg-purple-500",
  },
  {
    id: 5,
    name: "Salle de sport",
    amount: 29.99,
    nextDate: "1 Déc",
    category: "Sport",
    logo: "💪",
    color: "bg-orange-500",
  },
]

export function RecurringTransactions() {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Transactions récurrentes</CardTitle>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recurringTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <div className={`w-10 h-10 rounded-full ${transaction.color} flex items-center justify-center text-lg`}>
              {transaction.logo}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium truncate">{transaction.name}</h4>
                <span className="text-white font-semibold">{transaction.amount}€</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-slate-600 text-slate-300 text-xs">
                  {transaction.category}
                </Badge>
                <span className="text-slate-400 text-sm">{transaction.nextDate}</span>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-slate-700">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Total mensuel</span>
            <span className="text-white font-semibold">117,95€</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
