-- Schema for email configuration and templates
-- This allows administrators to configure Brevo settings and manage email templates

CREATE TABLE IF NOT EXISTS email_config (
  id INT AUTO_INCREMENT PRIMARY KEY,
  config_key VARCHAR(100) NOT NULL UNIQUE,
  config_value TEXT,
  is_encrypted BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  template_key VARCHAR(100) NOT NULL UNIQUE,
  template_name VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  html_content TEXT,
  text_content TEXT,
  available_variables TEXT, -- JSON array of available variables
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  reset_code VARCHAR(10) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_reset (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default Brevo configuration keys
INSERT INTO email_config (config_key, config_value, description) VALUES
('brevo_smtp_server', 'smtp-relay.brevo.com', 'Serveur SMTP Brevo'),
('brevo_smtp_port', '587', 'Port SMTP Brevo'),
('brevo_smtp_username', '', 'Nom d\'utilisateur SMTP Brevo (votre email de connexion)'),
('brevo_smtp_password', '', 'Mot de passe SMTP Brevo (clé SMTP)'),
('brevo_sender_name', 'Budget App', 'Nom de l\'expéditeur par défaut'),
('brevo_sender_email', '', 'Email de l\'expéditeur par défaut'),
('smtp_enabled', 'true', 'Activer l\'envoi d\'emails via SMTP')
ON DUPLICATE KEY UPDATE config_key = config_key;

-- Insert default email templates
INSERT INTO email_templates (template_key, template_name, subject, html_content, text_content, available_variables) VALUES
(
  'account_creation',
  'Création de compte',
  'Bienvenue sur Budget App, {{userName}}!',
  '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Bienvenue sur Budget App</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Bienvenue sur Budget App!</h1>
        <p>Bonjour {{userName}},</p>
        <p>Votre compte a été créé avec succès avec l\'email: <strong>{{userEmail}}</strong></p>
        <p>Vous pouvez maintenant vous connecter et commencer à gérer votre budget.</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 5px;">
            <p><strong>Prochaines étapes:</strong></p>
            <ul>
                <li>Configurez votre salaire mensuel</li>
                <li>Créez vos premiers budgets</li>
                <li>Commencez à enregistrer vos transactions</li>
            </ul>
        </div>
        <p>Bonne gestion financière!</p>
        <p>L\'équipe Budget App</p>
    </div>
</body>
</html>',
  'Bienvenue sur Budget App!

Bonjour {{userName}},

Votre compte a été créé avec succès avec l\'email: {{userEmail}}

Vous pouvez maintenant vous connecter et commencer à gérer votre budget.

Prochaines étapes:
- Configurez votre salaire mensuel
- Créez vos premiers budgets
- Commencez à enregistrer vos transactions

Bonne gestion financière!

L\'équipe Budget App',
  '["userName", "userEmail"]'
),
(
  'password_reset',
  'Réinitialisation du mot de passe',
  'Réinitialisez votre mot de passe - Budget App',
  '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Réinitialisation du mot de passe</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #dc2626;">Réinitialisation du mot de passe</h1>
        <p>Bonjour {{userName}},</p>
        <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte <strong>{{userEmail}}</strong>.</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #fef2f2; border-left: 4px solid #dc2626;">
            <p><strong>Code de réinitialisation:</strong> {{resetCode}}</p>
        </div>
        <p>Ce code expire dans <strong>{{expirationTime}}</strong>.</p>
        <p>Si vous n\'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        <p>Pour des raisons de sécurité, ne partagez jamais ce code.</p>
        <p>L\'équipe Budget App</p>
    </div>
</body>
</html>',
  'Réinitialisation du mot de passe - Budget App

Bonjour {{userName}},

Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte {{userEmail}}.

Code de réinitialisation: {{resetCode}}

Ce code expire dans {{expirationTime}}.

Si vous n\'avez pas demandé cette réinitialisation, ignorez cet email.

Pour des raisons de sécurité, ne partagez jamais ce code.

L\'équipe Budget App',
  '["userName", "userEmail", "resetCode", "expirationTime"]'
)
ON DUPLICATE KEY UPDATE template_key = template_key;