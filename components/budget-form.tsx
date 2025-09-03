"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, ChevronDown, ChevronUp } from "lucide-react"
import { useFinancialData } from "@/hooks/use-financial-data"
import { useIsMobile } from "@/hooks/use-mobile"

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

// Palette de couleurs étendue avec énormément de variations
const COLOR_PALETTE = {
  "Rouges": [
    "bg-red-300", "bg-red-400", "bg-red-500", "bg-red-600", "bg-red-700", "bg-red-800", "bg-red-900",
    "bg-rose-300", "bg-rose-400", "bg-rose-500", "bg-rose-600", "bg-rose-700", "bg-rose-800", "bg-rose-900",
    "bg-pink-300", "bg-pink-400", "bg-pink-500", "bg-pink-600", "bg-pink-700", "bg-pink-800", "bg-pink-900"
  ],
  "Oranges": [
    "bg-orange-300", "bg-orange-400", "bg-orange-500", "bg-orange-600", "bg-orange-700", "bg-orange-800", "bg-orange-900",
    "bg-amber-300", "bg-amber-400", "bg-amber-500", "bg-amber-600", "bg-amber-700", "bg-amber-800", "bg-amber-900",
    "bg-yellow-300", "bg-yellow-400", "bg-yellow-500", "bg-yellow-600", "bg-yellow-700", "bg-yellow-800", "bg-yellow-900"
  ],
  "Verts": [
    "bg-green-300", "bg-green-400", "bg-green-500", "bg-green-600", "bg-green-700", "bg-green-800", "bg-green-900",
    "bg-emerald-300", "bg-emerald-400", "bg-emerald-500", "bg-emerald-600", "bg-emerald-700", "bg-emerald-800", "bg-emerald-900",
    "bg-lime-300", "bg-lime-400", "bg-lime-500", "bg-lime-600", "bg-lime-700", "bg-lime-800", "bg-lime-900",
    "bg-teal-300", "bg-teal-400", "bg-teal-500", "bg-teal-600", "bg-teal-700", "bg-teal-800", "bg-teal-900"
  ],
  "Bleus": [
    "bg-blue-300", "bg-blue-400", "bg-blue-500", "bg-blue-600", "bg-blue-700", "bg-blue-800", "bg-blue-900",
    "bg-sky-300", "bg-sky-400", "bg-sky-500", "bg-sky-600", "bg-sky-700", "bg-sky-800", "bg-sky-900",
    "bg-cyan-300", "bg-cyan-400", "bg-cyan-500", "bg-cyan-600", "bg-cyan-700", "bg-cyan-800", "bg-cyan-900",
    "bg-indigo-300", "bg-indigo-400", "bg-indigo-500", "bg-indigo-600", "bg-indigo-700", "bg-indigo-800", "bg-indigo-900"
  ],
  "Violets": [
    "bg-purple-300", "bg-purple-400", "bg-purple-500", "bg-purple-600", "bg-purple-700", "bg-purple-800", "bg-purple-900",
    "bg-violet-300", "bg-violet-400", "bg-violet-500", "bg-violet-600", "bg-violet-700", "bg-violet-800", "bg-violet-900",
    "bg-fuchsia-300", "bg-fuchsia-400", "bg-fuchsia-500", "bg-fuchsia-600", "bg-fuchsia-700", "bg-fuchsia-800", "bg-fuchsia-900"
  ],
  "Pastels": [
    "bg-red-200", "bg-orange-200", "bg-amber-200", "bg-yellow-200", "bg-lime-200", "bg-green-200", "bg-emerald-200",
    "bg-teal-200", "bg-cyan-200", "bg-sky-200", "bg-blue-200", "bg-indigo-200", "bg-violet-200", "bg-purple-200",
    "bg-fuchsia-200", "bg-pink-200", "bg-rose-200", "bg-stone-200", "bg-neutral-200", "bg-zinc-200", "bg-gray-200"
  ],
  "Foncés": [
    "bg-red-950", "bg-orange-950", "bg-amber-950", "bg-yellow-950", "bg-lime-950", "bg-green-950", "bg-emerald-950",
    "bg-teal-950", "bg-cyan-950", "bg-sky-950", "bg-blue-950", "bg-indigo-950", "bg-violet-950", "bg-purple-950",
    "bg-fuchsia-950", "bg-pink-950", "bg-rose-950", "bg-stone-950", "bg-neutral-950", "bg-zinc-950", "bg-gray-950"
  ],
  "Neutres": [
    "bg-gray-300", "bg-gray-400", "bg-gray-500", "bg-gray-600", "bg-gray-700", "bg-gray-800", "bg-gray-900",
    "bg-slate-300", "bg-slate-400", "bg-slate-500", "bg-slate-600", "bg-slate-700", "bg-slate-800", "bg-slate-900",
    "bg-zinc-300", "bg-zinc-400", "bg-zinc-500", "bg-zinc-600", "bg-zinc-700", "bg-zinc-800", "bg-zinc-900",
    "bg-neutral-300", "bg-neutral-400", "bg-neutral-500", "bg-neutral-600", "bg-neutral-700", "bg-neutral-800", "bg-neutral-900",
    "bg-stone-300", "bg-stone-400", "bg-stone-500", "bg-stone-600", "bg-stone-700", "bg-stone-800", "bg-stone-900"
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
  const [expandedEmojiCategories, setExpandedEmojiCategories] = useState<Set<string>>(new Set())
  const [expandedColorCategories, setExpandedColorCategories] = useState<Set<string>>(new Set())
  const { addBudget, data } = useFinancialData()
  const isMobile = useIsMobile()

  const calculatedAmount = isPercentage && percentage ? 
    (data.salary * parseFloat(percentage)) / 100 : 0

  const toggleEmojiCategory = (categoryName: string) => {
    const newSet = new Set(expandedEmojiCategories)
    if (newSet.has(categoryName)) {
      newSet.delete(categoryName)
    } else {
      newSet.add(categoryName)
    }
    setExpandedEmojiCategories(newSet)
  }

  const toggleColorCategory = (categoryName: string) => {
    const newSet = new Set(expandedColorCategories)
    if (newSet.has(categoryName)) {
      newSet.delete(categoryName)
    } else {
      newSet.add(categoryName)
    }
    setExpandedColorCategories(newSet)
  }

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
    setExpandedEmojiCategories(new Set())
    setExpandedColorCategories(new Set())
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
              {Object.entries(EMOJI_CATEGORIES).map(([categoryName, emojis]) => {
                const isExpanded = expandedEmojiCategories.has(categoryName)
                const displayedEmojis = isExpanded ? emojis : emojis.slice(0, 10)
                
                return (
                  <div key={categoryName} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-slate-300">{categoryName}</h4>
                      {emojis.length > 10 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleEmojiCategory(categoryName)}
                          className="h-6 px-2 text-slate-400 hover:text-white"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-3 w-3 mr-1" />
                              Réduire
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3 mr-1" />
                              Voir plus ({emojis.length - 10})
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    <div className={`grid gap-1 ${isMobile ? 'grid-cols-4' : 'grid-cols-6 md:grid-cols-8 lg:grid-cols-10'}`}>
                      {displayedEmojis.map((emoji) => (
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
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Couleur</Label>
            <div className="space-y-3">
              {Object.entries(COLOR_PALETTE).map(([categoryName, colors]) => {
                const isExpanded = expandedColorCategories.has(categoryName)
                const displayedColors = isExpanded ? colors : colors.slice(0, isMobile ? 6 : 11)
                
                return (
                  <div key={categoryName} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-slate-300">{categoryName}</h4>
                      {colors.length > (isMobile ? 6 : 11) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleColorCategory(categoryName)}
                          className="h-6 px-2 text-slate-400 hover:text-white"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-3 w-3 mr-1" />
                              Réduire
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3 mr-1" />
                              Voir plus ({colors.length - (isMobile ? 6 : 11)})
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    <div className={`grid gap-1 ${isMobile ? 'grid-cols-5' : 'grid-cols-7 md:grid-cols-9 lg:grid-cols-11'}`}>
                      {displayedColors.map((color) => (
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
                )
              })}
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