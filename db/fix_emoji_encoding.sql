-- SQL pour corriger l'encodage des emojis et améliorer le support UTF-8
-- À exécuter sur votre base de données existante

-- Modifier la colonne emoji pour supporter UTF8MB4 (requis pour les emojis)
ALTER TABLE budgets 
MODIFY COLUMN emoji VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- S'assurer que la table entière utilise UTF8MB4
ALTER TABLE budgets 
CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Optionnel: Vérifier et corriger les autres colonnes texte si nécessaire
ALTER TABLE budgets 
MODIFY COLUMN category VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Mettre à jour la colonne color pour supporter plus de variations
ALTER TABLE budgets 
MODIFY COLUMN color VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;