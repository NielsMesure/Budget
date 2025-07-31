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

    // Charger les données depuis localStorage au démarrage
    useEffect(() => {
        const savedData = localStorage.getItem("financial-data")
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData)
                setData({
                    accounts: parsedData.accounts || [],
                    salary: parsedData.salary || 0,
                    recurringTransactions: parsedData.recurringTransactions || [],
                    transactions: parsedData.transactions || [],
                })
            } catch (error) {
                console.error("Error parsing saved data:", error)
            }
        }
        setIsLoaded(true)
    }, [])

    // Sauvegarder les données dans localStorage à chaque changement
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("financial-data", JSON.stringify(data))
        }
    }, [data, isLoaded])

    const updateSalary = (salary: number) => {
        setData((prev) => ({ ...prev, salary }))
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
            id: Date.now(),
        }
        setData((prev) => ({
            ...prev,
            transactions: [...(prev.transactions || []), newTransaction],
        }))
    }

    // Calculs dérivés avec vérifications de sécurité
    const totalAccountBalance = (data.accounts || []).reduce((sum, account) => sum + (account.balance || 0), 0)
    const totalRecurringExpenses = (data.recurringTransactions || []).reduce(
        (sum, transaction) => sum + (transaction.amount || 0),
        0,
    )
    const totalTransactionExpenses = (data.transactions || []).reduce(
        (sum, transaction) => sum + (transaction.amount || 0),
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
