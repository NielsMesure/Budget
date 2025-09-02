-- SQL pour ajouter les champs manquants pour les transactions récurrentes
-- À exécuter sur votre base de données existante

-- Ajouter les colonnes pour les transactions récurrentes avec support des emojis
ALTER TABLE transactions 
ADD COLUMN frequency ENUM('weekly', 'monthly', 'quarterly', 'yearly') NULL DEFAULT 'monthly' COMMENT 'Fréquence pour les transactions récurrentes',
ADD COLUMN logo VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'Emoji/icône pour identifier visuellement la transaction récurrente';

-- Convertir la table en utf8mb4 pour supporter les emojis
ALTER TABLE transactions CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Index pour améliorer les performances des requêtes sur les transactions récurrentes
CREATE INDEX idx_transactions_recurring ON transactions (is_recurring, frequency);
CREATE INDEX idx_transactions_user_date ON transactions (user_id, date);

-- Mettre à jour les transactions récurrentes existantes avec des valeurs par défaut
UPDATE transactions 
SET frequency = 'monthly' 
WHERE is_recurring = TRUE AND frequency IS NULL;