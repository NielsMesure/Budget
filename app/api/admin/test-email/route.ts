import { NextResponse } from 'next/server'
import { EmailService } from '@/lib/services/email'

export async function POST(req: Request) {
  try {
    const { email, template } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 })
    }

    // Use the EmailService to send the test email
    const result = await EmailService.sendEmail(
      template || 'account_creation',
      email,
      {
        userName: 'Utilisateur Test',
        userEmail: email,
        resetCode: '123456',
        expirationTime: '15 minutes'
      }
    )

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error || 'Erreur lors de l\'envoi de l\'email de test'
      }, { status: 500 })
    }

    return NextResponse.json({ message: 'Email de test envoyé avec succès' })
  } catch (error) {
    console.error('Error sending test email:', error)
    return NextResponse.json({ 
      error: 'Erreur interne du serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}