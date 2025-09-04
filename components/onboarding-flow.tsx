"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, ArrowLeft, SkipForward, Wallet, Target, CheckCircle, Sparkles } from "lucide-react"

interface OnboardingStep {
  id: number
  title: string
  description: string
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: "Bienvenue sur MoneyTracker !",
    description: "Gérez vos finances personnelles en toute simplicité"
  },
  {
    id: 2, 
    title: "Configurez votre salaire",
    description: "Commençons par définir vos revenus mensuels"
  },
  {
    id: 3,
    title: "Créez votre premier budget",
    description: "Organisez vos dépenses par catégorie"
  },
  {
    id: 4,
    title: "Vous êtes prêt !",
    description: "Votre compte est configuré, commencez à tracker vos finances"
  }
]

const BUDGET_EMOJIS = [
  "🍽️", "🚗", "🏠", "🎬", "🛍️", "⚕️", "📚", "💰", "⚡", "🎯"
]

export function OnboardingFlow() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  // Form data
  const [salary, setSalary] = useState("")
  const [budgetCategory, setBudgetCategory] = useState("")
  const [budgetAmount, setBudgetAmount] = useState("")
  const [budgetEmoji, setBudgetEmoji] = useState("🎯")

  const progress = (currentStep / ONBOARDING_STEPS.length) * 100

  const handleSkip = () => {
    router.push("/dashboard")
  }

  const handleNext = async () => {
    if (currentStep === 2 && salary) {
      // Save salary
      await saveSalary()
    }
    
    if (currentStep === 3 && budgetCategory && budgetAmount) {
      // Save budget
      await saveBudget()
    }

    if (currentStep === ONBOARDING_STEPS.length) {
      router.push("/dashboard")
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const saveSalary = async () => {
    setIsLoading(true)
    try {
      const userId = localStorage.getItem("userId")
      if (userId) {
        await fetch("/api/salary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            userId: parseInt(userId), 
            salary: parseFloat(salary) 
          }),
        })
      }
    } catch (error) {
      console.error("Error saving salary:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveBudget = async () => {
    setIsLoading(true)
    try {
      const userId = localStorage.getItem("userId")
      if (userId) {
        await fetch("/api/budgets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: parseInt(userId),
            category: budgetCategory,
            allocated: parseFloat(budgetAmount),
            emoji: budgetEmoji,
            color: "#8b5cf6"
          }),
        })
      }
    } catch (error) {
      console.error("Error saving budget:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true
      case 2:
        return salary && parseFloat(salary) > 0
      case 3:
        return budgetCategory && budgetAmount && parseFloat(budgetAmount) > 0
      case 4:
        return true
      default:
        return false
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">
              <Sparkles className="w-16 h-16 mx-auto text-purple-400" />
            </div>
            <div className="space-y-4">
              <p className="text-slate-300 text-lg">
                MoneyTracker vous aide à prendre le contrôle de vos finances personnelles.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <Wallet className="w-8 h-8 text-purple-400 mb-2" />
                  <h3 className="text-white font-semibold">Suivez vos revenus</h3>
                  <p className="text-slate-400 text-sm">Gérez vos salaires et revenus</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <Target className="w-8 h-8 text-purple-400 mb-2" />
                  <h3 className="text-white font-semibold">Créez des budgets</h3>
                  <p className="text-slate-400 text-sm">Organisez vos dépenses par catégorie</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-purple-400 mb-2" />
                  <h3 className="text-white font-semibold">Atteignez vos objectifs</h3>
                  <p className="text-slate-400 text-sm">Restez dans vos limites de budget</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Wallet className="w-12 h-12 mx-auto text-purple-400 mb-4" />
            </div>
            <div className="space-y-4">
              <Label htmlFor="salary" className="text-white text-lg">
                Quel est votre salaire mensuel ?
              </Label>
              <div className="relative">
                <Input
                  id="salary"
                  type="number"
                  placeholder="3000"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white text-lg p-4 pr-12"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">€</span>
              </div>
              <p className="text-slate-400 text-sm">
                Cette information nous aide à calculer vos capacités de budget
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="w-12 h-12 mx-auto text-purple-400 mb-4" />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-white text-lg">
                  Créez votre premier budget
                </Label>
                <Input
                  id="category"
                  placeholder="Ex: Alimentation, Transport, Loisirs..."
                  value={budgetCategory}
                  onChange={(e) => setBudgetCategory(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">
                  Budget mensuel alloué
                </Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="500"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white pr-12"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">€</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Choisissez un emoji</Label>
                <div className="grid grid-cols-5 gap-2">
                  {BUDGET_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setBudgetEmoji(emoji)}
                      className={`p-3 text-2xl rounded-lg border ${
                        budgetEmoji === emoji
                          ? "border-purple-500 bg-purple-600/20"
                          : "border-slate-600 bg-slate-700 hover:border-slate-500"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">
              <CheckCircle className="w-16 h-16 mx-auto text-green-400" />
            </div>
            <div className="space-y-4">
              <p className="text-slate-300 text-lg">
                Parfait ! Votre compte est maintenant configuré.
              </p>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Récapitulatif</h3>
                <div className="space-y-2 text-sm">
                  {salary && (
                    <p className="text-slate-300">
                      💰 Salaire mensuel : <span className="text-white">{salary}€</span>
                    </p>
                  )}
                  {budgetCategory && budgetAmount && (
                    <p className="text-slate-300">
                      {budgetEmoji} {budgetCategory} : <span className="text-white">{budgetAmount}€</span>
                    </p>
                  )}
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                Vous pouvez maintenant commencer à tracker vos transactions et gérer vos budgets !
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-2xl">
                {ONBOARDING_STEPS[currentStep - 1].title}
              </CardTitle>
              <CardDescription className="text-slate-300 mt-2">
                {ONBOARDING_STEPS[currentStep - 1].description}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-slate-400 hover:text-white"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Passer
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Étape {currentStep} sur {ONBOARDING_STEPS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {renderStepContent()}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="bg-transparent border-slate-600 text-white hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                "Enregistrement..."
              ) : currentStep === ONBOARDING_STEPS.length ? (
                "Commencer"
              ) : (
                <>
                  Suivant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}