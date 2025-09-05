-- Migration script to update email configuration from API key to SMTP
-- This script migrates existing configurations to the new SMTP-based system

-- Remove old API key configuration if it exists
DELETE FROM email_config WHERE config_key = 'brevo_api_key';

-- Add new SMTP configuration keys if they don't exist
INSERT IGNORE INTO email_config (config_key, config_value, description) VALUES
('brevo_smtp_server', 'smtp-relay.brevo.com', 'Serveur SMTP Brevo'),
('brevo_smtp_port', '587', 'Port SMTP Brevo'),
('brevo_smtp_username', '', 'Nom d\'utilisateur SMTP Brevo (votre email de connexion)'),
('brevo_smtp_password', '', 'Mot de passe SMTP Brevo (clé SMTP)');

-- Update existing configuration descriptions for clarity
UPDATE email_config SET description = 'Nom de l\'expéditeur par défaut' WHERE config_key = 'brevo_sender_name';
UPDATE email_config SET description = 'Email de l\'expéditeur par défaut (doit être vérifié dans Brevo)' WHERE config_key = 'brevo_sender_email';
UPDATE email_config SET description = 'Activer l\'envoi d\'emails via SMTP' WHERE config_key = 'smtp_enabled';