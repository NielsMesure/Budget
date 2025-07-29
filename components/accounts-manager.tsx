"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, CreditCard, Wallet, PiggyBank } from "lucide-react"

const accounts = [
  {
    id: 1,
    name: "Compte Courant",
    type: "checking",
    balance: 2450.75,
    bank: "BNP Paribas",
    icon: CreditCard,
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Livret A",
    type: "savings",
    balance: 8750.0,
    bank: "Crédit Agricole",
    icon: PiggyBank,
    color: "bg-green-500",
  },
  {
    id: 3,
    name: "Carte de crédit",
    type: "credit",
    balance: -450.25,
    bank: "Société Générale",
    icon: CreditCard,
    color: "bg-red-500",
  },
  {
    id: 4,
    name: "Espèces",
    type: "cash",
    balance: 125.5,
    bank: "Portefeuille",
    icon: Wallet,
    color: "bg-yellow-500",
  },
]

export function AccountsManager() {
  const [showAddForm, setShowAddForm] = useState(false)

  const getAccountTypeLabel = (type: string) => {
    const types = {
      checking: "Compte courant",
      savings: "Épargne",
      credit: "Crédit",
      cash: "Espèces",
    }
    return types[type as keyof typeof types] || type
  }

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Mes Comptes</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un compte
        </Button>
      </div>

      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Solde total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">
            {totalBalance.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
          </div>
          <p className="text-slate-400 mt-2">Réparti sur {accounts.length} comptes</p>
        </CardContent>
      </Card>

      {showAddForm && (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Ajouter un nouveau compte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="account-name" className="text-white">
                  Nom du compte
                </Label>
                <Input
                  id="account-name"
                  placeholder="Ex: Compte Courant"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-type" className="text-white">
                  Type de compte
                </Label>
                <Select>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="checking">Compte courant</SelectItem>
                    <SelectItem value="savings">Épargne</SelectItem>
                    <SelectItem value="credit">Crédit</SelectItem>
                    <SelectItem value="cash">Espèces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bank-name" className="text-white">
                  Banque
                </Label>
                <Input
                  id="bank-name"
                  placeholder="Ex: BNP Paribas"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initial-balance" className="text-white">
                  Solde initial (€)
                </Label>
                <Input
                  id="initial-balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="bg-purple-600 hover:bg-purple-700">Ajouter le compte</Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account) => {
          const IconComponent = account.icon
          return (
            <Card
              key={account.id}
              className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-colors cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${account.color} flex items-center justify-center`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{account.name}</h3>
                      <p className="text-slate-400 text-sm">{account.bank}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                    {getAccountTypeLabel(account.type)}
                  </Badge>
                </div>

                <div className="text-right">
                  <div className={`text-2xl font-bold ${account.balance >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {account.balance.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
