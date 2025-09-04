"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shield, CreditCard, Target, TrendingUp, Calendar } from "lucide-react"

interface AdminStats {
  totalUsers: number
  totalAdmins: number
  totalTransactions: number
  totalBudgets: number
  recentUsers: number
  monthlyUsers: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des statistiques')
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-white text-2xl font-bold">Chargement du tableau de bord...</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-slate-800 border-slate-700">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-slate-600 rounded animate-pulse" />
                <div className="h-3 bg-slate-700 rounded animate-pulse mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-slate-600 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-white text-2xl font-bold">Tableau de bord administrateur</div>
        <Card className="bg-red-900 border-red-700">
          <CardContent className="pt-6">
            <div className="text-red-100">Erreur: {error}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const statCards = [
    {
      title: "Utilisateurs totaux",
      value: stats.totalUsers,
      description: "Nombre total d'utilisateurs inscrits",
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
    },
    {
      title: "Administrateurs",
      value: stats.totalAdmins,
      description: "Nombre d'administrateurs actifs",
      icon: Shield,
      color: "text-red-400",
      bgColor: "bg-red-900/20",
    },
    {
      title: "Transactions",
      value: stats.totalTransactions,
      description: "Nombre total de transactions",
      icon: CreditCard,
      color: "text-green-400",
      bgColor: "bg-green-900/20",
    },
    {
      title: "Budgets",
      value: stats.totalBudgets,
      description: "Nombre total de budgets créés",
      icon: Target,
      color: "text-purple-400",
      bgColor: "bg-purple-900/20",
    },
    {
      title: "Nouveaux utilisateurs (30j)",
      value: stats.recentUsers,
      description: "Utilisateurs inscrits les 30 derniers jours",
      icon: TrendingUp,
      color: "text-orange-400",
      bgColor: "bg-orange-900/20",
    },
    {
      title: "Inscriptions ce mois",
      value: stats.monthlyUsers,
      description: "Nouveaux utilisateurs ce mois",
      icon: Calendar,
      color: "text-cyan-400",
      bgColor: "bg-cyan-900/20",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Tableau de bord administrateur</h2>
          <p className="text-slate-400 mt-2">Vue d'ensemble des statistiques de l'application</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <Card key={card.title} className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{card.value.toLocaleString()}</div>
              <p className="text-xs text-slate-400 mt-1">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Activité récente</CardTitle>
            <CardDescription className="text-slate-400">
              Vue d'ensemble de l'activité des utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Croissance utilisateurs (30j)</span>
                <span className="text-green-400 font-semibold">+{stats.recentUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Transactions moyennes par utilisateur</span>
                <span className="text-blue-400 font-semibold">
                  {stats.totalUsers > 0 ? Math.round(stats.totalTransactions / stats.totalUsers) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Budgets moyens par utilisateur</span>
                <span className="text-purple-400 font-semibold">
                  {stats.totalUsers > 0 ? Math.round(stats.totalBudgets / stats.totalUsers) : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Actions rapides</CardTitle>
            <CardDescription className="text-slate-400">
              Raccourcis vers les fonctions d'administration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg text-blue-400 hover:bg-blue-900/30 transition-colors">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm">Gérer les utilisateurs</div>
              </button>
              <button className="p-4 bg-green-900/20 border border-green-700 rounded-lg text-green-400 hover:bg-green-900/30 transition-colors">
                <Shield className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm">Paramètres de sécurité</div>
              </button>
              <button className="p-4 bg-purple-900/20 border border-purple-700 rounded-lg text-purple-400 hover:bg-purple-900/30 transition-colors">
                <Target className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm">Configuration</div>
              </button>
              <button className="p-4 bg-orange-900/20 border border-orange-700 rounded-lg text-orange-400 hover:bg-orange-900/30 transition-colors">
                <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm">Rapports</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}