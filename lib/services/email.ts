import { pool } from '@/lib/db'
import * as nodemailer from 'nodemailer'

interface EmailConfig {
  brevo_smtp_server: string
  brevo_smtp_port: string
  brevo_smtp_username: string
  brevo_smtp_password: string
  brevo_sender_name: string
  brevo_sender_email: string
  smtp_enabled: string
}

interface EmailTemplate {
  subject: string
  html_content: string
  text_content: string
  available_variables: string[]
}

interface EmailData {
  [key: string]: string
}

export class EmailService {
  private static async getEmailConfig(): Promise<EmailConfig> {
    const [rows] = await pool.query(
      'SELECT config_key, config_value FROM email_config WHERE config_key IN (?, ?, ?, ?, ?, ?, ?)',
      ['brevo_smtp_server', 'brevo_smtp_port', 'brevo_smtp_username', 'brevo_smtp_password', 'brevo_sender_name', 'brevo_sender_email', 'smtp_enabled']
    ) as any

    const config: EmailConfig = {
      brevo_smtp_server: 'smtp-relay.brevo.com',
      brevo_smtp_port: '587',
      brevo_smtp_username: '',
      brevo_smtp_password: '',
      brevo_sender_name: '',
      brevo_sender_email: '',
      smtp_enabled: 'true'
    }
    
    rows.forEach((row: any) => {
      if (row.config_key in config) {
        (config as any)[row.config_key] = row.config_value || (config as any)[row.config_key]
      }
    })

    return config
  }

  private static async getEmailTemplate(templateKey: string): Promise<EmailTemplate | null> {
    const [rows] = await pool.query(
      'SELECT subject, html_content, text_content, available_variables FROM email_templates WHERE template_key = ? AND is_active = 1',
      [templateKey]
    ) as any

    if (rows.length === 0) {
      return null
    }

    const template = rows[0]
    return {
      ...template,
      available_variables: JSON.parse(template.available_variables || '[]')
    }
  }

  private static replaceVariables(content: string, data: EmailData): string {
    let result = content
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      result = result.replace(regex, value)
    })
    return result
  }

  private static async createTransporter(config: EmailConfig) {
    return nodemailer.createTransport({
      host: config.brevo_smtp_server,
      port: parseInt(config.brevo_smtp_port) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.brevo_smtp_username,
        pass: config.brevo_smtp_password,
      },
    })
  }

  public static async sendEmail(
    templateKey: string,
    recipientEmail: string,
    data: EmailData = {}
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const config = await this.getEmailConfig()

      if (!config.brevo_smtp_username || !config.brevo_smtp_password) {
        return { success: false, error: 'Configuration SMTP Brevo incomplète (nom d\'utilisateur ou mot de passe manquant)' }
      }

      if (config.smtp_enabled !== 'true') {
        return { success: false, error: 'Envoi d\'emails désactivé' }
      }

      const template = await this.getEmailTemplate(templateKey)
      if (!template) {
        return { success: false, error: `Modèle email '${templateKey}' non trouvé` }
      }

      // Replace variables in template
      const subject = this.replaceVariables(template.subject, data)
      const htmlContent = this.replaceVariables(template.html_content, data)
      const textContent = this.replaceVariables(template.text_content, data)

      // Create transporter and send email
      const transporter = await this.createTransporter(config)
      
      const mailOptions = {
        from: `"${config.brevo_sender_name}" <${config.brevo_sender_email}>`,
        to: recipientEmail,
        subject: subject,
        text: textContent,
        html: htmlContent,
      }

      const result = await transporter.sendMail(mailOptions)
      console.log('Email sent successfully:', result.messageId)

      return { success: true }
    } catch (error) {
      console.error('Email service error:', error)
      return { success: false, error: `Erreur lors de l'envoi: ${error instanceof Error ? error.message : 'Erreur inconnue'}` }
    }
  }

  public static async sendAccountCreationEmail(userEmail: string, userName: string): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail('account_creation', userEmail, {
      userName,
      userEmail
    })
  }

  public static async sendPasswordResetEmail(
    userEmail: string, 
    userName: string, 
    resetCode: string, 
    expirationTime: string = '15 minutes'
  ): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail('password_reset', userEmail, {
      userName,
      userEmail,
      resetCode,
      expirationTime
    })
  }
}