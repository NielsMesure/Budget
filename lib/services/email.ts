import { pool } from '@/lib/db'

interface EmailConfig {
  brevo_api_key: string
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
      'SELECT config_key, config_value FROM email_config WHERE config_key IN (?, ?, ?, ?)',
      ['brevo_api_key', 'brevo_sender_name', 'brevo_sender_email', 'smtp_enabled']
    ) as any

    const config: Record<string, string> = {}
    rows.forEach((row: any) => {
      config[row.config_key] = row.config_value || ''
    })

    return config as EmailConfig
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

  public static async sendEmail(
    templateKey: string,
    recipientEmail: string,
    data: EmailData = {}
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const config = await this.getEmailConfig()

      if (!config.brevo_api_key) {
        return { success: false, error: 'Brevo API key not configured' }
      }

      if (config.smtp_enabled !== 'true') {
        return { success: false, error: 'Email sending is disabled' }
      }

      const template = await this.getEmailTemplate(templateKey)
      if (!template) {
        return { success: false, error: `Email template '${templateKey}' not found` }
      }

      // Replace variables in template
      const subject = this.replaceVariables(template.subject, data)
      const htmlContent = this.replaceVariables(template.html_content, data)
      const textContent = this.replaceVariables(template.text_content, data)

      // Send email via Brevo
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': config.brevo_api_key
        },
        body: JSON.stringify({
          sender: {
            name: config.brevo_sender_name,
            email: config.brevo_sender_email
          },
          to: [{ email: recipientEmail }],
          subject: subject,
          htmlContent: htmlContent,
          textContent: textContent
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Brevo API error:', errorText)
        return { success: false, error: `Failed to send email: ${errorText}` }
      }

      return { success: true }
    } catch (error) {
      console.error('Email service error:', error)
      return { success: false, error: 'Internal error occurred while sending email' }
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