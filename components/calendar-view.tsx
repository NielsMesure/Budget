"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useFinancialData } from "@/hooks/use-financial-data"

export function CalendarView() {
  const { data, isLoaded } = useFinancialData()
  const [currentDate, setCurrentDate] = useState(new Date())

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
      </Card>
  )
}
