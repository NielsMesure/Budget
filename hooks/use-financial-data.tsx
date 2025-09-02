"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"

interface Account {
    id: number
    name: string
    type: string
    balance: number
    bank: string
    color: string
    icon: any
}

interface RecurringTransaction {
    id: number
    name: string
    amount: number
    nextDate: string
    category: string
    logo: string
    color: string
    frequency: "weekly" | "monthly" | "quarterly" | "yearly"
    dayOfMonth: number
}

interface Transaction {
    id: number
    amount: number
    description: string
    category: string
    date: string
    isRecurring: boolean
    notes?: string
}

interface FinancialData {
    accounts: Account[]
    salary: number
    recurringTransactions: RecurringTransaction[]
    transactions: Transaction[]
    budgets: Budget[]
}

interface Budget {
    id: number
    category: string
    allocated?: number
    percentage?: number
    spent: number
    color: string
    emoji: string
}

function useFinancialDataState() {
    const [data, setData] = useState<FinancialData>({
        accounts: [],
        salary: 0,
        recurringTransactions: [],
        transactions: [],
        budgets: [],
    })
    const [isLoaded, setIsLoaded] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)

    // Charger les données depuis localStorage et l'API au démarrage
    useEffect(() => {
        const uid = localStorage.getItem("userId")
        setUserId(uid)
        const storageKey = uid ? `financial-data-${uid}` : "financial-data"

        const savedData = localStorage.getItem(storageKey)
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData)
                setData({
                    accounts: (parsedData.accounts || []).map((acc: any) => ({
                        ...acc,
                        balance: Number(acc.balance) || 0,
                    })),
                    salary: Number(parsedData.salary) || 0,
                    recurringTransactions: (parsedData.recurringTransactions || []).map((t: any) => ({
                        ...t,
                        amount: Number(t.amount) || 0,
                    })),
                    transactions: (parsedData.transactions || []).map((t: any) => ({
                        ...t,
                        amount: Number(t.amount) || 0,
                    })),
                    budgets: parsedData.budgets || [],
                })
            } catch (error) {
                console.error("Error parsing saved data:", error)
            }
        }

        async function fetchRemote() {
            if (!uid) {
                setIsLoaded(true)
                return
            }
            try {
                const resSalary = await fetch(`/api/salary?userId=${uid}`)
                if (resSalary.ok) {
                    const js = await resSalary.json()
                    setData((prev) => ({ ...prev, salary: Number(js.salary) || 0 }))
                }
                const resTx = await fetch(`/api/transactions?userId=${uid}`)
                if (resTx.ok) {
                    const txs = await resTx.json()
                    const parsed = txs.map((t: any) => ({
                        ...t,
                        amount: Number(t.amount) || 0,
                        isRecurring: !!t.is_recurring,
                    }))
                    const recurring = parsed
                        .filter((t: any) => t.isRecurring)
                        .map((t: any) => {
                            const dateStr = new Date(t.date)
                                .toISOString()
                                .slice(0, 10)
                            return {
                                id: t.id,
                                name: t.description,
                                amount: t.amount,
                                nextDate: dateStr,
                                category: t.category,
                                logo: t.logo || "",
                                color: "bg-blue-500",
                                frequency: (t.frequency || "monthly") as "weekly" | "monthly" | "quarterly" | "yearly",
                                dayOfMonth: new Date(dateStr).getDate(),
                            }
                        })
                    setData((prev) => ({
                        ...prev,
                        transactions: parsed,
                        recurringTransactions: recurring,
                    }))
                }
                
                const resBudgets = await fetch(`/api/budgets?userId=${uid}`)
                if (resBudgets.ok) {
                    const budgets = await resBudgets.json()
                    setData((prev) => ({
                        ...prev,
                        budgets: budgets.map((b: any) => ({
                            ...b,
                            allocated: b.allocated ? Number(b.allocated) : undefined,
                            percentage: b.percentage ? Number(b.percentage) : undefined,
                            spent: Number(b.spent) || 0,
                        })),
                    }))
                }
            } catch (e) {
                console.error(e)
            }
            setIsLoaded(true)
        }
        fetchRemote()
    }, [])

    // Sauvegarder les données dans localStorage à chaque changement
    useEffect(() => {
        if (isLoaded) {
            const key = userId ? `financial-data-${userId}` : "financial-data"
            localStorage.setItem(key, JSON.stringify(data))
        }
    }, [data, isLoaded, userId])

    const updateSalary = (salary: number) => {
        setData((prev) => ({ ...prev, salary }))
        if (userId) {
            fetch('/api/salary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, salary })
            }).catch(console.error)
        }
    }

    const addIncome = (amount: number) => {
        setData((prev) => {
            const newSalary = (prev.salary || 0) + amount
            if (userId) {
                fetch('/api/salary', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, salary: newSalary }),
                }).catch(console.error)
            }
            return { ...prev, salary: newSalary }
        })
    }

    const addAccount = (account: Omit<Account, "id">) => {
        const newAccount = {
            ...account,
            id: Date.now(),
        }
        setData((prev) => ({
            ...prev,
            accounts: [...(prev.accounts || []), newAccount],
        }))
    }

    const addRecurringTransaction = (transaction: Omit<RecurringTransaction, "id" | "dayOfMonth">) => {
        const normalizedDate = new Date(transaction.nextDate).toISOString().slice(0, 10)
        const dayOfMonth = new Date(normalizedDate).getDate()
        const newTransaction = {
            ...transaction,
            nextDate: normalizedDate,
            id: Date.now(),
            dayOfMonth,
        }
        setData((prev) => ({
            ...prev,
            recurringTransactions: [...(prev.recurringTransactions || []), newTransaction],
        }))
        
        // Also add as regular transaction to database with recurring flag
        const dbTransaction = {
            amount: newTransaction.amount,
            description: newTransaction.name,
            category: newTransaction.category,
            date: normalizedDate,
            notes: '',
            isRecurring: true,
            frequency: newTransaction.frequency,
            logo: newTransaction.logo
        }
        
        if (userId) {
            fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userId, 
                    ...dbTransaction
                })
            }).catch(console.error)
        }
    }

    const addTransaction = (transaction: Omit<Transaction, "id">) => {
        const normalizedDate = new Date(transaction.date).toISOString().slice(0, 10)
        const newTransaction = {
            ...transaction,
            amount: Number(transaction.amount) || 0,
            date: normalizedDate,
            id: Date.now(),
        }
        setData((prev) => ({
            ...prev,
            transactions: [...(prev.transactions || []), newTransaction],
        }))
        if (userId) {
            fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userId, 
                    ...newTransaction,
                    frequency: null,
                    logo: null
                })
            }).catch(console.error)
        }
    }

    const updateRecurringTransaction = (
        id: number,
        updates: Partial<Omit<RecurringTransaction, "id" | "dayOfMonth">>
    ) => {
        const normalizedDate = updates.nextDate
            ? new Date(updates.nextDate).toISOString().slice(0, 10)
            : undefined
        setData((prev) => ({
            ...prev,
            recurringTransactions: prev.recurringTransactions.map((t) => {
                if (t.id !== id) return t
                const nextDate = normalizedDate ?? t.nextDate
                return {
                    ...t,
                    ...updates,
                    nextDate,
                    dayOfMonth: new Date(nextDate).getDate(),
                }
            }),
            transactions: prev.transactions.map((tx) => {
                if (tx.id !== id) return tx
                return {
                    ...tx,
                    amount: updates.amount ?? tx.amount,
                    description: updates.name ?? tx.description,
                    category: updates.category ?? tx.category,
                    date: normalizedDate ?? tx.date,
                }
            }),
        }))
        if (userId) {
            const tx = data.recurringTransactions.find((t) => t.id === id)
            if (tx) {
                const updated = {
                    ...tx,
                    ...updates,
                    nextDate: normalizedDate ?? tx.nextDate,
                }
                fetch('/api/transactions', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id,
                        userId,
                        amount: updated.amount,
                        description: updated.name,
                        category: updated.category,
                        date: updated.nextDate,
                        notes: '',
                        frequency: updated.frequency,
                        logo: updated.logo,
                    }),
                }).catch(console.error)
            }
        }
    }

    const removeRecurringTransaction = (id: number) => {
        setData((prev) => ({
            ...prev,
            recurringTransactions: prev.recurringTransactions.filter(
                (t) => t.id !== id,
            ),
            transactions: prev.transactions.filter((tx) => tx.id !== id),
        }))
        if (userId) {
            fetch(`/api/transactions?id=${id}&userId=${userId}`, {
                method: 'DELETE',
            }).catch(console.error)
        }
    }

    const addBudget = (budget: Omit<Budget, "id" | "spent">) => {
        if (userId) {
            fetch('/api/budgets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userId, 
                    ...budget
                })
            }).then(async (response) => {
                if (response.ok) {
                    const result = await response.json()
                    const newBudget = {
                        ...budget,
                        id: result.id,
                        spent: 0,
                    }
                    setData((prev) => ({
                        ...prev,
                        budgets: [...(prev.budgets || []), newBudget],
                    }))
                }
            }).catch(console.error)
        }
    }

    const updateBudget = (id: number, updates: Partial<Omit<Budget, "id" | "spent">>) => {
        if (userId) {
            const currentBudget = data.budgets.find(b => b.id === id)
            if (currentBudget) {
                const updatedBudget = { ...currentBudget, ...updates }
                fetch('/api/budgets', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        id,
                        userId, 
                        category: updatedBudget.category,
                        allocated: updatedBudget.allocated,
                        percentage: updatedBudget.percentage,
                        color: updatedBudget.color,
                        emoji: updatedBudget.emoji
                    })
                }).then(async (response) => {
                    if (response.ok) {
                        setData((prev) => ({
                            ...prev,
                            budgets: prev.budgets.map(b => 
                                b.id === id ? { ...b, ...updates } : b
                            ),
                        }))
                    }
                }).catch(console.error)
            }
        }
    }

    const removeBudget = (id: number) => {
        if (userId) {
            fetch(`/api/budgets?id=${id}&userId=${userId}`, {
                method: 'DELETE',
            }).then(async (response) => {
                if (response.ok) {
                    setData((prev) => ({
                        ...prev,
                        budgets: prev.budgets.filter(b => b.id !== id),
                    }))
                }
            }).catch(console.error)
        }
    }

    // Calculs dérivés avec vérifications de sécurité
    const totalAccountBalance = (data.accounts || []).reduce(
        (sum, account) => sum + (Number(account.balance) || 0),
        0,
    )
    const totalRecurringExpenses = (data.recurringTransactions || []).reduce(
        (sum, transaction) => sum + (Number(transaction.amount) || 0),
        0,
    )
    const totalTransactionExpenses = (data.transactions || []).reduce(
        (sum, transaction) =>
            sum + (!transaction.isRecurring ? Number(transaction.amount) || 0 : 0),
        0,
    )
    const totalExpenses = totalRecurringExpenses + totalTransactionExpenses
    const totalBalance = (data.salary || 0) + totalAccountBalance - totalExpenses

    return {
        data,
        isLoaded,
        updateSalary,
        addIncome,
        addAccount,
        addRecurringTransaction,
        updateRecurringTransaction,
        removeRecurringTransaction,
        addTransaction,
        addBudget,
        updateBudget,
        removeBudget,
        totalAccountBalance,
        totalExpenses,
        totalRecurringExpenses,
        totalTransactionExpenses,
        totalBalance,
    }
}

type FinancialDataContextValue = ReturnType<typeof useFinancialDataState>
const FinancialDataContext = createContext<FinancialDataContextValue | undefined>(undefined)

export function FinancialDataProvider({ children }: { children: ReactNode }) {
    const value = useFinancialDataState()
    return (
        <FinancialDataContext.Provider value={value}>{children}</FinancialDataContext.Provider>
    )
}

export function useFinancialData() {
    const ctx = useContext(FinancialDataContext)
    if (!ctx) {
        throw new Error("useFinancialData must be used within FinancialDataProvider")
    }
    return ctx
}
