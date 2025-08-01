"use client"

import { useState, useEffect } from "react"

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
}

export function useFinancialData() {
    const [data, setData] = useState<FinancialData>({
        accounts: [],
        salary: 0,
        recurringTransactions: [],
        transactions: [],
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
                        .filter((t) => t.isRecurring)
                        .map((t) => ({
                            id: t.id,
                            name: t.description,
                            amount: t.amount,
                            nextDate: t.date,
                            category: t.category,
                            logo: "",
                            color: "bg-blue-500",
                            frequency: "monthly" as const,
                            dayOfMonth: new Date(t.date).getDate(),
                        }))
                    setData((prev) => ({
                        ...prev,
                        transactions: parsed,
                        recurringTransactions: recurring,
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
        const dayOfMonth = new Date(transaction.nextDate).getDate()
        const newTransaction = {
            ...transaction,
            id: Date.now(),
            dayOfMonth,
        }
        setData((prev) => ({
            ...prev,
            recurringTransactions: [...(prev.recurringTransactions || []), newTransaction],
        }))
    }

    const addTransaction = (transaction: Omit<Transaction, "id">) => {
        const newTransaction = {
            ...transaction,
            amount: Number(transaction.amount) || 0,
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
                body: JSON.stringify({ userId, ...newTransaction })
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
        addAccount,
        addRecurringTransaction,
        addTransaction,
        totalAccountBalance,
        totalExpenses,
        totalRecurringExpenses,
        totalTransactionExpenses,
        totalBalance,
    }
}
