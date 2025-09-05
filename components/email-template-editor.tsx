"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, X, Eye } from "lucide-react"
import { toast } from "sonner"

interface EmailTemplate {
  id: number
  template_key: string
  template_name: string
  subject: string
  html_content: string
  text_content: string
  available_variables: string[]
  is_active: boolean
}

interface EmailTemplateEditorProps {
  template: EmailTemplate | null
  isOpen: boolean
  onClose: () => void
  onSave: (template: EmailTemplate) => void
}

export function EmailTemplateEditor({ template, isOpen, onClose, onSave }: EmailTemplateEditorProps) {
  const [editedTemplate, setEditedTemplate] = useState<EmailTemplate>(() => 
    template || {
      id: 0,
      template_key: '',
      template_name: '',
      subject: '',
      html_content: '',
      text_content: '',
      available_variables: [],
      is_active: true
    }
  )
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const handleSave = async () => {
    if (!editedTemplate.template_name || !editedTemplate.subject) {
      toast.error('Nom du modèle et sujet sont requis')
      return
    }

    setSaving(true)
    try {
      await onSave(editedTemplate)
    } finally {
      setSaving(false)
    }
  }

  const insertVariable = (variable: string) => {
    const variableText = `{{${variable}}}`
    // Insert at cursor position in the currently focused textarea
    const activeElement = document.activeElement as HTMLTextAreaElement
    if (activeElement && (activeElement.id === 'subject' || activeElement.id === 'html-content' || activeElement.id === 'text-content')) {
      const start = activeElement.selectionStart
      const end = activeElement.selectionEnd
      const value = activeElement.value
      const newValue = value.substring(0, start) + variableText + value.substring(end)
      
      if (activeElement.id === 'subject') {
        setEditedTemplate({...editedTemplate, subject: newValue})
      } else if (activeElement.id === 'html-content') {
        setEditedTemplate({...editedTemplate, html_content: newValue})
      } else if (activeElement.id === 'text-content') {
        setEditedTemplate({...editedTemplate, text_content: newValue})
      }
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        activeElement.setSelectionRange(start + variableText.length, start + variableText.length)
        activeElement.focus()
      }, 0)
    }
  }

  const getPreviewContent = () => {
    const sampleData: Record<string, string> = {
      userName: 'Jean Dupont',
      userEmail: 'jean.dupont@example.com',
      resetCode: '123456',
      expirationTime: '15 minutes'
    }

    let subject = editedTemplate.subject
    let htmlContent = editedTemplate.html_content

    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      subject = subject.replace(regex, value)
      htmlContent = htmlContent.replace(regex, value)
    })

    return { subject, htmlContent }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">
            {template ? 'Modifier le modèle' : 'Nouveau modèle'}: {editedTemplate.template_name}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Configurez le contenu et les variables de votre modèle d'email
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="edit" className="h-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-slate-700">
                <TabsTrigger value="edit" className="text-slate-300 data-[state=active]:bg-slate-600 data-[state=active]:text-white">
                  Édition
                </TabsTrigger>
                <TabsTrigger value="preview" className="text-slate-300 data-[state=active]:bg-slate-600 data-[state=active]:text-white">
                  <Eye className="w-4 h-4 mr-2" />
                  Aperçu
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editedTemplate.is_active}
                    onCheckedChange={(checked) => setEditedTemplate({...editedTemplate, is_active: checked})}
                  />
                  <span className="text-slate-300">Actif</span>
                </div>
              </div>
            </div>

            <TabsContent value="edit" className="space-y-4 overflow-y-auto max-h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name" className="text-slate-300">Nom du modèle</Label>
                  <Input
                    id="template-name"
                    value={editedTemplate.template_name}
                    onChange={(e) => setEditedTemplate({...editedTemplate, template_name: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-key" className="text-slate-300">Clé du modèle</Label>
                  <Input
                    id="template-key"
                    value={editedTemplate.template_key}
                    onChange={(e) => setEditedTemplate({...editedTemplate, template_key: e.target.value})}
                    disabled={!!template}
                    className="bg-slate-700 border-slate-600 text-white disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-slate-300">Sujet</Label>
                <Input
                  id="subject"
                  value={editedTemplate.subject}
                  onChange={(e) => setEditedTemplate({...editedTemplate, subject: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Sujet de l'email..."
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="html-content" className="text-slate-300">Contenu HTML</Label>
                  <Textarea
                    id="html-content"
                    value={editedTemplate.html_content}
                    onChange={(e) => setEditedTemplate({...editedTemplate, html_content: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white min-h-48"
                    placeholder="Contenu HTML de l'email..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text-content" className="text-slate-300">Contenu texte</Label>
                  <Textarea
                    id="text-content"
                    value={editedTemplate.text_content}
                    onChange={(e) => setEditedTemplate({...editedTemplate, text_content: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white min-h-48"
                    placeholder="Version texte de l'email..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Variables disponibles</Label>
                <div className="flex flex-wrap gap-2">
                  {editedTemplate.available_variables.map((variable) => (
                    <Badge
                      key={variable}
                      variant="outline"
                      className="border-blue-600 text-blue-400 cursor-pointer hover:bg-blue-600 hover:text-white"
                      onClick={() => insertVariable(variable)}
                    >
                      {'{{'}{variable}{'}}'}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-slate-400">
                  Cliquez sur une variable pour l'insérer dans le champ actif
                </p>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4 overflow-y-auto max-h-96">
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Aperçu avec données d'exemple</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Sujet:</Label>
                    <div className="bg-slate-600 p-2 rounded text-white text-sm">
                      {getPreviewContent().subject}
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-300">Contenu HTML:</Label>
                    <div 
                      className="bg-white p-4 rounded text-black text-sm max-h-64 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: getPreviewContent().htmlContent }}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300 hover:bg-slate-700">
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}