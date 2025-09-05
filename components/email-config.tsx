"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Save, Mail, Settings, FileText, Eye, Edit, TestTube } from "lucide-react"
import { toast } from "sonner"
import { EmailTemplateEditor } from '@/components/email-template-editor'

interface EmailConfigData {
  brevo_smtp_server: string
  brevo_smtp_port: string
  brevo_smtp_username: string
  brevo_smtp_password: string
  brevo_sender_name: string
  brevo_sender_email: string
  smtp_enabled: string
}

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

export function EmailConfig() {
  const [config, setConfig] = useState<EmailConfigData>({
    brevo_smtp_server: 'smtp-relay.brevo.com',
    brevo_smtp_port: '587',
    brevo_smtp_username: '',
    brevo_smtp_password: '',
    brevo_sender_name: 'Budget App',
    brevo_sender_email: '',
    smtp_enabled: 'true'
  })
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testingEmail, setTestingEmail] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)

  useEffect(() => {
    loadEmailConfig()
    loadEmailTemplates()
  }, [])

  const loadEmailConfig = async () => {
    try {
      const response = await fetch('/api/admin/email-config')
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (error) {
      console.error('Error loading email config:', error)
      toast.error('Erreur lors du chargement de la configuration')
    }
  }

  const loadEmailTemplates = async () => {
    try {
      const response = await fetch('/api/admin/email-templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      }
    } catch (error) {
      console.error('Error loading email templates:', error)
      toast.error('Erreur lors du chargement des modèles')
    } finally {
      setLoading(false)
    }
  }

  const saveEmailConfig = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/email-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        toast.success('Configuration sauvegardée avec succès')
      } else {
        toast.error('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Error saving email config:', error)
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const saveEmailTemplate = async (template: EmailTemplate) => {
    try {
      const response = await fetch('/api/admin/email-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template),
      })

      if (response.ok) {
        toast.success('Modèle sauvegardé avec succès')
        setEditingTemplate(null)
        loadEmailTemplates()
      } else {
        toast.error('Erreur lors de la sauvegarde du modèle')
      }
    } catch (error) {
      console.error('Error saving email template:', error)
      toast.error('Erreur lors de la sauvegarde du modèle')
    }
  }

  const testEmailSending = async () => {
    if (!testEmail) {
      toast.error('Veuillez saisir un email de test')
      return
    }

    setTestingEmail(true)
    try {
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: testEmail,
          template: 'account_creation'
        }),
      })

      if (response.ok) {
        toast.success('Email de test envoyé avec succès')
      } else {
        const error = await response.json()
        toast.error(`Erreur lors de l'envoi: ${error.message}`)
      }
    } catch (error) {
      console.error('Error testing email:', error)
      toast.error('Erreur lors du test d\'envoi')
    } finally {
      setTestingEmail(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-white text-2xl font-bold">Chargement de la configuration email...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Configuration Email</h2>
          <p className="text-slate-400 mt-2">Gérez la configuration Brevo et les modèles d'emails</p>
        </div>
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="config" className="text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">
            <Settings className="w-4 h-4 mr-2" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2" />
            Modèles
          </TabsTrigger>
          <TabsTrigger value="test" className="text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">
            <TestTube className="w-4 h-4 mr-2" />
            Test
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Configuration Brevo
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configurez votre intégration avec Brevo pour l'envoi d'emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-server" className="text-slate-300">Serveur SMTP</Label>
                  <Input
                    id="smtp-server"
                    placeholder="smtp-relay.brevo.com"
                    value={config.brevo_smtp_server}
                    onChange={(e) => setConfig({...config, brevo_smtp_server: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port" className="text-slate-300">Port SMTP</Label>
                  <Input
                    id="smtp-port"
                    type="number"
                    placeholder="587"
                    value={config.brevo_smtp_port}
                    onChange={(e) => setConfig({...config, brevo_smtp_port: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-username" className="text-slate-300">Nom d'utilisateur SMTP</Label>
                  <Input
                    id="smtp-username"
                    type="email"
                    placeholder="votre-email@exemple.com"
                    value={config.brevo_smtp_username}
                    onChange={(e) => setConfig({...config, brevo_smtp_username: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <p className="text-xs text-slate-400">Utilisez l'email de votre compte Brevo</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password" className="text-slate-300">Mot de passe SMTP</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    placeholder="Votre clé SMTP Brevo"
                    value={config.brevo_smtp_password}
                    onChange={(e) => setConfig({...config, brevo_smtp_password: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <p className="text-xs text-slate-400">Trouvez ceci dans votre compte Brevo sous "SMTP & API"</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sender-name" className="text-slate-300">Nom expéditeur</Label>
                  <Input
                    id="sender-name"
                    placeholder="Budget App"
                    value={config.brevo_sender_name}
                    onChange={(e) => setConfig({...config, brevo_sender_name: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-email" className="text-slate-300">Email expéditeur</Label>
                  <Input
                    id="sender-email"
                    type="email"
                    placeholder="noreply@exemple.com"
                    value={config.brevo_sender_email}
                    onChange={(e) => setConfig({...config, brevo_sender_email: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <p className="text-xs text-slate-400">Doit être un email vérifié dans votre compte Brevo</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={saveEmailConfig} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{template.template_name}</CardTitle>
                      <CardDescription className="text-slate-400">
                        Clé: {template.template_key}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={template.is_active ? "default" : "secondary"}>
                        {template.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingTemplate(template)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-slate-300">Sujet:</Label>
                      <p className="text-slate-400">{template.subject}</p>
                    </div>
                    <div>
                      <Label className="text-slate-300">Variables disponibles:</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.available_variables.map((variable) => (
                          <Badge key={variable} variant="outline" className="border-blue-600 text-blue-400">
                            {'{{'}{variable}{'}}'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                Test d'envoi d'email
              </CardTitle>
              <CardDescription className="text-slate-400">
                Testez votre configuration en envoyant un email de test
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-email" className="text-slate-300">Email de destination</Label>
                <Input
                  id="test-email"
                  type="email"
                  placeholder="test@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button 
                onClick={testEmailSending} 
                disabled={testingEmail || !testEmail}
                className="bg-green-600 hover:bg-green-700"
              >
                <Mail className="w-4 h-4 mr-2" />
                {testingEmail ? 'Envoi en cours...' : 'Envoyer un email de test'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Template Editor Modal would go here */}
      <EmailTemplateEditor
        template={editingTemplate}
        isOpen={!!editingTemplate}
        onClose={() => setEditingTemplate(null)}
        onSave={saveEmailTemplate}
      />
    </div>
  )
}