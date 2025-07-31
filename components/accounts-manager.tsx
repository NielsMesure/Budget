"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, CreditCard, Wallet } from "lucide-react"
import { useFinancialData } from "@/hooks/use-financial-data"

export function AccountsManager() {
  const { data, updateSalary, addAccount, totalAccountBalance, totalBalance } = useFinancialData()
  const [tempSalary, setTempSalary] = useState(data.salary.toString())
  const [showSalaryForm, setShowSalaryForm] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "",
    balance: 0,
    bank: "",
    color: "bg-blue-500",
  })

  const getAccountTypeLabel = (type: string) => {
    const types = {
      checking: "Compte courant",
      savings: "Épargne",
      credit: "Crédit",
      cash: "Espèces",
    }
    return types[type as keyof typeof types] || type
  }

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
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-white">
                  {totalBalance.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                </div>
                <p className="text-slate-400 mt-2">Salaire + Comptes ({data.accounts.length} comptes)</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                <div>
                  <div className="text-lg font-semibold text-green-400">
                    {data.salary.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </div>
                  <p className="text-slate-400 text-sm">Salaire</p>
                </div>
                <div>
                  <div className="text-lg font-semibold text-blue-400">
                    {totalAccountBalance.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </div>
                  <p className="text-slate-400 text-sm">Comptes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Mon Salaire</CardTitle>
              <Button
                  onClick={() => setShowSalaryForm(!showSalaryForm)}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                {data.salary > 0 ? "Modifier" : "Définir"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {data.salary > 0 ? (
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {data.salary.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </div>
                  <p className="text-slate-400 mt-1">Salaire mensuel net</p>
                </div>
            ) : (
                <div className="text-slate-400">
                  <p>Aucun salaire défini</p>
                  <p className="text-sm mt-1">Définissez votre salaire pour un meilleur suivi</p>
                </div>
            )}

            {showSalaryForm && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary-amount" className="text-white">
                      Salaire mensuel net (€)
                    </Label>
                    <Input
                        id="salary-amount"
                        type="number"
                        step="0.01"
                        value={tempSalary}
                        onChange={(e) => setTempSalary(e.target.value)}
                        placeholder="Ex: 2500.00"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                        onClick={() => {
                          updateSalary(Number.parseFloat(tempSalary) || 0)
                          setShowSalaryForm(false)
                        }}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                      Enregistrer
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                          setShowSalaryForm(false)
                          setTempSalary(data.salary.toString())
                        }}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
            )}
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
                        value={newAccount.name}
                        onChange={(e) => setNewAccount((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Compte Courant"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-type" className="text-white">
                      Type de compte
                    </Label>
                    <Select
                        value={newAccount.type}
                        onValueChange={(value) => setNewAccount((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="checking">Compte courant</SelectItem>
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
                        value={newAccount.bank}
                        onChange={(e) => setNewAccount((prev) => ({ ...prev, bank: e.target.value }))}
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
                        value={newAccount.balance}
                        onChange={(e) =>
                            setNewAccount((prev) => ({ ...prev, balance: Number.parseFloat(e.target.value) || 0 }))
                        }
                        placeholder="0.00"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                      onClick={() => {
                        if (newAccount.name && newAccount.type && newAccount.bank) {
                          const iconMap = {
                            checking: CreditCard,
                            credit: CreditCard,
                            cash: Wallet,
                          }

                          addAccount({
                            ...newAccount,
                            icon: iconMap[newAccount.type as keyof typeof iconMap] || CreditCard,
                          })

                          setNewAccount({
                            name: "",
                            type: "",
                            balance: 0,
                            bank: "",
                            color: "bg-blue-500",
                          })
                          setShowAddForm(false)
                        }
                      }}
                      className="bg-purple-600 hover:bg-purple-700"
                  >
                    Ajouter le compte
                  </Button>
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
          {data.accounts.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm col-span-full">
                <CardContent className="p-8 text-center">
                  <div className="text-slate-400">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Aucun compte ajouté</h3>
                    <p>Commencez par ajouter votre premier compte pour suivre vos finances</p>
                  </div>
                </CardContent>
              </Card>
          ) : (
              data.accounts.map((account) => {
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
              })
          )}
        </div>
      </div>
  )
}
