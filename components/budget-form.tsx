"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useFinancialData } from "@/hooks/use-financial-data"

// Emojis organisés par catégories pour faciliter la sélection
const EMOJI_CATEGORIES = {
  "Nourriture & Boissons": [
    "🍽️", "🍔", "🍕", "🍜", "🍱", "🥗", "🍪", "🍰", "☕", "🍷", 
    "🥤", "🍯", "🧀", "🥖", "🥘", "🍳", "🥓", "🍌", "🍎", "🥑"
  ],
  "Transport": [
    "🚗", "🚌", "🚊", "🚲", "🏍️", "✈️", "🚁", "⛽", "🅿️", "🚧",
    "🛤️", "🚇", "🚤", "⛵", "🚀", "🛺", "🛴", "🛵", "🚑", "🚒"
  ],
  "Loisirs & Sport": [
    "🎬", "🎮", "🎯", "🎪", "🎨", "🎵", "🎸", "🏃", "⚽", "🏀",
    "🎾", "🏊", "🚴", "🧗", "🎿", "🏄", "🎳", "🎲", "🎭", "📺"
  ],
  "Shopping & Mode": [
    "🛍️", "👕", "👗", "👠", "👜", "💄", "💍", "⌚", "👓", "🧢",
    "🥾", "👞", "👟", "🧥", "👖", "🧦", "🧳", "💳", "🛒", "🏪"
  ],
  "Santé & Bien-être": [
    "⚕️", "💊", "🏥", "🩺", "💉", "🦷", "👁️", "🧘", "💆", "💇",
    "🏋️", "🤸", "🧴", "🧼", "🧻", "🩹", "🌡️", "😷", "💤", "🛁"
  ],
  "Maison & Famille": [
    "🏠", "🏡", "🏢", "🔑", "🛏️", "🛋️", "🪑", "🚿", "🧽", "🧹",
    "👶", "👨‍👩‍👧‍👦", "🐕", "🐱", "🌱", "🌸", "🕯️", "💡", "🔌", "🧸"
  ],
  "Éducation & Travail": [
    "📚", "💼", "📝", "💻", "🖥️", "📱", "⌨️", "🖱️", "📊", "📈",
    "📉", "📋", "📌", "📎", "✏️", "🖊️", "📐", "🎓", "👨‍🏫", "👩‍💼"
  ],
  "Finance & Investissement": [
    "💰", "💵", "💳", "💎", "🏦", "📊", "📈", "📉", "💹", "🪙",
    "💸", "🧾", "📃", "📄", "🔢", "🧮", "💲", "€", "$", "₹"
  ],
  "Services & Utilités": [
    "⚡", "💡", "🔧", "🔨", "🪚", "🛠️", "📞", "📧", "📮", "📬",
    "🌐", "📡", "📺", "📻", "🔒", "🗝️", "🛡️", "⚙️", "🔩", "⛽"
  ],
  "Divers": [
    "🌟", "⭐", "🎁", "🎈", "🎉", "🎊", "🔮", "🌍", "🌎", "🌏",
    "🗺️", "🧭", "⏰", "⏱️", "⏲️", "📅", "📆", "🗓️", "🎪", "🎢"
  ]
}

// Palette de couleurs étendue avec de nombreuses variations
const COLOR_PALETTE = {
  "Rouges": [
    "bg-red-400", "bg-red-500", "bg-red-600", "bg-red-700", "bg-red-800",
    "bg-rose-400", "bg-rose-500", "bg-rose-600", "bg-pink-400", "bg-pink-500", "bg-pink-600"
  ],
  "Oranges": [
    "bg-orange-400", "bg-orange-500", "bg-orange-600", "bg-orange-700",
    "bg-amber-400", "bg-amber-500", "bg-amber-600", "bg-yellow-400", "bg-yellow-500", "bg-yellow-600"
  ],
  "Verts": [
    "bg-green-400", "bg-green-500", "bg-green-600", "bg-green-700", "bg-green-800",
    "bg-emerald-400", "bg-emerald-500", "bg-emerald-600", "bg-lime-400", "bg-lime-500", "bg-lime-600"
  ],
  "Bleus": [
    "bg-blue-400", "bg-blue-500", "bg-blue-600", "bg-blue-700", "bg-blue-800",
    "bg-sky-400", "bg-sky-500", "bg-sky-600", "bg-cyan-400", "bg-cyan-500", "bg-cyan-600"
  ],
  "Violets": [
    "bg-purple-400", "bg-purple-500", "bg-purple-600", "bg-purple-700", "bg-purple-800",
    "bg-violet-400", "bg-violet-500", "bg-violet-600", "bg-indigo-400", "bg-indigo-500", "bg-indigo-600"
  ],
  "Neutres": [
    "bg-gray-400", "bg-gray-500", "bg-gray-600", "bg-gray-700", "bg-gray-800",
    "bg-slate-400", "bg-slate-500", "bg-slate-600", "bg-zinc-400", "bg-zinc-500", "bg-zinc-600"
  ],
  "Terre": [
    "bg-stone-400", "bg-stone-500", "bg-stone-600", "bg-neutral-400", "bg-neutral-500", "bg-neutral-600",
    "bg-amber-700", "bg-orange-800", "bg-yellow-700", "bg-green-900", "bg-teal-700"
  ]
}

// Listes plates pour faciliter l'utilisation
const ALL_EMOJIS = Object.values(EMOJI_CATEGORIES).flat()
const ALL_COLORS = Object.values(COLOR_PALETTE).flat()

export function BudgetForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [category, setCategory] = useState("")
  const [isPercentage, setIsPercentage] = useState(false)
  const [amount, setAmount] = useState("")
  const [percentage, setPercentage] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState(ALL_EMOJIS[0])
  const [selectedColor, setSelectedColor] = useState(ALL_COLORS[0])
  const { addBudget, data } = useFinancialData()

  const calculatedAmount = isPercentage && percentage ? 
    (data.salary * parseFloat(percentage)) / 100 : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!category) return

    const budgetData = {
      category: category.toLowerCase(),
      color: selectedColor,
      emoji: selectedEmoji,
      allocated: isPercentage ? undefined : parseFloat(amount),
      percentage: isPercentage ? parseFloat(percentage) : undefined,
    }

    addBudget(budgetData)
    
    // Reset form
    setCategory("")
    setAmount("")
    setPercentage("")
    setSelectedEmoji(ALL_EMOJIS[0])
    setSelectedColor(ALL_COLORS[0])
    setIsPercentage(false)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau budget
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un nouveau budget</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Nom de la catégorie</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="ex: Loisir, Sport, Courses..."
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="percentage-mode"
              checked={isPercentage}
              onCheckedChange={setIsPercentage}
            />
            <Label htmlFor="percentage-mode">Utiliser un pourcentage du salaire</Label>
          </div>

          {isPercentage ? (
            <div className="space-y-2">
              <Label htmlFor="percentage">Pourcentage (%)</Label>
              <Input
                id="percentage"
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="ex: 30"
                min="0"
                max="100"
                step="0.1"
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
              {percentage && data.salary > 0 && (
                <p className="text-sm text-slate-400">
                  {percentage}% de votre salaire = {calculatedAmount.toLocaleString("fr-FR", { 
                    style: "currency", 
                    currency: "EUR" 
                  })}
                </p>
              )}
              {percentage && data.salary === 0 && (
                <p className="text-sm text-yellow-400">
                  Veuillez définir votre salaire pour voir le montant calculé
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="amount">Montant alloué (€)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="ex: 300"
                min="0"
                step="0.01"
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Emoji</Label>
            <div className="space-y-3">
              {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-300">{category}</h4>
                  <div className="grid grid-cols-10 gap-1">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`p-2 rounded text-lg hover:bg-slate-600 transition-colors ${
                          selectedEmoji === emoji ? 'bg-purple-600' : 'bg-slate-700'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Couleur</Label>
            <div className="space-y-3">
              {Object.entries(COLOR_PALETTE).map(([category, colors]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-300">{category}</h4>
                  <div className="grid grid-cols-11 gap-1">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full ${color} hover:scale-110 transition-transform ${
                          selectedColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800' : ''
                        }`}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-slate-600 text-slate-300"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
            >
              Créer le budget
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}