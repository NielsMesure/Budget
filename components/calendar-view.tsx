"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const subscriptions = [
  { date: 5, name: "Netflix", amount: 15.99, color: "bg-red-500", logo: "🎬" },
  { date: 12, name: "Spotify", amount: 9.99, color: "bg-green-500", logo: "🎵" },
  { date: 18, name: "Google Drive", amount: 1.99, color: "bg-blue-500", logo: "☁️" },
  { date: 25, name: "Adobe CC", amount: 59.99, color: "bg-purple-500", logo: "🎨" },
]

export function CalendarView() {
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

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getSubscriptionForDate = (date: number) => {
    return subscriptions.find((sub) => sub.date === date)
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
            const subscription = getSubscriptionForDate(date)
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
                {subscription && (
                  <div className="absolute -bottom-1 -right-1">
                    <div
                      className={`w-6 h-6 rounded-full ${subscription.color} flex items-center justify-center text-xs`}
                    >
                      {subscription.logo}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
