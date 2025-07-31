"use client"

import { useState, useEffect } from "react"

interface Account {
    id: number
    name: string
    type: string
    balance: number
    bank: string
    color: string
}

interface FinancialData {
    accounts: Account[]
    salary: number
    expenses: number
    savings: number
}

export function useFinancialData() {
    const [data, setData] = useState<FinancialData>({
        accounts: [],
        salary: 0,
        expenses: 0,
        savings: 0,
    })

    // Charger les données depuis localStorage au démarrage
    useEffect(() => {
        const savedData = localStorage.getItem("financial-data")
        if (savedData) {
            setData(JSON.parse(savedData))
        }
    }, [])

    // Sauvegarder les données dans localStorage à chaque changement
    useEffect(() => {
        localStorage.setItem("financial-data", JSON.stringify(data))
    }, [data])

    const updateSalary = (salary: number) => {
        setData((prev) => ({ ...prev, salary }))
    }

    const addAccount = (account: Omit<Account, "id">) => {
        const newAccount = {
            ...account,
            id: Date.now(), // Simple ID generation
        }
        setData((prev) => ({
            ...prev,
            accounts: [...prev.accounts, newAccount],
        }))
    }

    const updateExpenses = (expenses: number) => {
        setData((prev) => ({ ...prev, expenses }))
    }

    const updateSavings = (savings: number) => {
        setData((prev) => ({ ...prev, savings }))
    }

    // Calculs dérivés
    const totalAccountBalance = data.accounts.reduce((sum, account) => sum + account.balance, 0)
    const totalBalance = data.salary + totalAccountBalance
    const remainingAfterExpenses = totalBalance - data.expenses

    return {
        data,
        updateSalary,
        addAccount,
        updateExpenses,
        updateSavings,
        totalAccountBalance,
        totalBalance,
        remainingAfterExpenses,
    }
}
