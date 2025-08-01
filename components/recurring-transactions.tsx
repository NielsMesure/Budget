"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFinancialData } from "@/hooks/use-financial-data";

type RecurringTransaction = {
  id: number;
  name: string;
  amount: number;
  nextDate: string;
  category: string;
  logo: string;
  color: string;
  frequency: "weekly" | "monthly" | "quarterly" | "yearly";
  dayOfMonth: number;
};

export function RecurringTransactions() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    name: "",
    amount: 0,
    nextDate: "",
    category: "",
    logo: "",
    color: "bg-blue-500",
    frequency: "monthly" as const,
  });
  const [editingTransaction, setEditingTransaction] = useState<
    RecurringTransaction | null
  >(null);
  const [editValues, setEditValues] = useState({
    name: "",
    amount: 0,
    nextDate: "",
    category: "",
    logo: "",
    color: "bg-blue-500",
    frequency: "monthly" as const,
  });
  const {
    data,
    addRecurringTransaction,
    addTransaction,
    updateRecurringTransaction,
    removeRecurringTransaction,
    totalRecurringExpenses,
    isLoaded,
  } = useFinancialData();

  // Afficher un skeleton pendant le chargement
  if (!isLoaded) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="h-6 w-48 bg-slate-600 rounded animate-pulse" />
            <div className="h-8 w-20 bg-slate-600 rounded animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50"
            >
              <div className="w-10 h-10 bg-slate-600 rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-slate-600 rounded animate-pulse mb-2" />
                <div className="h-3 w-24 bg-slate-600 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const handleAddTransaction = () => {
    if (
      newTransaction.name &&
      newTransaction.amount &&
      newTransaction.nextDate &&
      newTransaction.category
    ) {
      const dateStr = new Date(newTransaction.nextDate).toISOString().slice(0, 10);
      addRecurringTransaction({ ...newTransaction, nextDate: dateStr });
      addTransaction({
        amount: newTransaction.amount,
        description: newTransaction.name,
        category: newTransaction.category,
        date: dateStr,
        isRecurring: true,
        notes: "",
      });
      setNewTransaction({
        name: "",
        amount: 0,
        nextDate: "",
        category: "",
        logo: "",
        color: "bg-blue-500",
        frequency: "monthly",
      });
      setShowAddForm(false);
    }
  };

  const handleSaveEdit = () => {
    if (!editingTransaction) return;
    const dateStr = new Date(editValues.nextDate).toISOString().slice(0, 10);
    updateRecurringTransaction(editingTransaction.id, {
      ...editValues,
      nextDate: dateStr,
    });
    setEditingTransaction(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("Supprimer cette transaction ?")) {
      removeRecurringTransaction(id);
      setEditingTransaction(null);
    }
  };

  const formatNextDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Transactions récurrentes</CardTitle>
          <Button
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <div className="p-4 bg-slate-700/50 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-medium">
                Nouvelle transaction récurrente
              </h4>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Nom</Label>
                <Input
                  value={newTransaction.name}
                  onChange={(e) =>
                    setNewTransaction((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Ex: Netflix"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Montant (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction((prev) => ({
                      ...prev,
                      amount: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="15.99"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Catégorie</Label>
                <Select
                  value={newTransaction.category}
                  onValueChange={(value) =>
                    setNewTransaction((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="Divertissement">
                      Divertissement
                    </SelectItem>
                    <SelectItem value="Musique">Musique</SelectItem>
                    <SelectItem value="Stockage">Stockage</SelectItem>
                    <SelectItem value="Outils">Outils</SelectItem>
                    <SelectItem value="Sport">Sport</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Alimentation">Alimentation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Prochaine date</Label>
                <Input
                  type="date"
                  pattern="\d{4}-\d{2}-\d{2}"
                  value={newTransaction.nextDate}
                  onChange={(e) =>
                    setNewTransaction((prev) => ({
                      ...prev,
                      nextDate: e.target.value,
                    }))
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Logo/Emoji</Label>
              <Input
                value={newTransaction.logo}
                onChange={(e) =>
                  setNewTransaction((prev) => ({
                    ...prev,
                    logo: e.target.value,
                  }))
                }
                placeholder="🎬 ou emoji"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <Button
              onClick={handleAddTransaction}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Ajouter la transaction
            </Button>
          </div>
        )}

        {data.recurringTransactions.map((transaction) => (
          <div
            key={transaction.id}
            onClick={() => {
              setEditingTransaction(transaction);
              setEditValues({
                name: transaction.name,
                amount: transaction.amount,
                nextDate: new Date(transaction.nextDate)
                  .toISOString()
                  .slice(0, 10),
                category: transaction.category,
                logo: transaction.logo,
                color: transaction.color,
                frequency: transaction.frequency,
              });
            }}
            className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <div
              className={`w-10 h-10 rounded-full ${transaction.color} flex items-center justify-center text-lg`}
            >
              {transaction.logo || "💳"}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium truncate">
                  {transaction.name}
                </h4>
                <span className="text-white font-semibold">
                  {transaction.amount}€
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className="bg-slate-600 text-slate-300 text-xs"
                >
                  {transaction.category}
                </Badge>
                <span className="text-slate-400 text-sm">
                  {formatNextDate(transaction.nextDate)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {data.recurringTransactions.length === 0 && !showAddForm && (
          <div className="text-center py-8 text-slate-400">
            <p>Aucune transaction récurrente</p>
            <p className="text-sm mt-1">
              Ajoutez vos abonnements et dépenses fixes
            </p>
          </div>
        )}

        {data.recurringTransactions.length > 0 && (
          <div className="pt-4 border-t border-slate-700">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Total mensuel</span>
              <span className="text-white font-semibold">
                {totalRecurringExpenses.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </span>
            </div>
          </div>
        )}

        {editingTransaction && (
          <Dialog
            open={!!editingTransaction}
            onOpenChange={() => setEditingTransaction(null)}
          >
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>Modifier la transaction</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-white">Nom</Label>
                  <Input
                    value={editValues.name}
                    onChange={(e) =>
                      setEditValues((p) => ({ ...p, name: e.target.value }))
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Montant (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editValues.amount}
                    onChange={(e) =>
                      setEditValues((p) => ({
                        ...p,
                        amount: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Catégorie</Label>
                  <Select
                    value={editValues.category}
                    onValueChange={(val) =>
                      setEditValues((p) => ({ ...p, category: val }))
                    }
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="Divertissement">Divertissement</SelectItem>
                      <SelectItem value="Musique">Musique</SelectItem>
                      <SelectItem value="Stockage">Stockage</SelectItem>
                      <SelectItem value="Outils">Outils</SelectItem>
                      <SelectItem value="Sport">Sport</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Alimentation">Alimentation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Prochaine date</Label>
                  <Input
                    type="date"
                    pattern="\d{4}-\d{2}-\d{2}"
                    value={editValues.nextDate}
                    onChange={(e) =>
                      setEditValues((p) => ({ ...p, nextDate: e.target.value }))
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Logo/Emoji</Label>
                  <Input
                    value={editValues.logo}
                    onChange={(e) =>
                      setEditValues((p) => ({ ...p, logo: e.target.value }))
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={handleSaveEdit}
                  >
                    Enregistrer
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(editingTransaction.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

      </CardContent>
    </Card>
  );
}
