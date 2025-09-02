-- SQL pour ajouter le support des pourcentages dans les budgets
-- À exécuter sur votre base de données existante

-- Ajouter la colonne percentage pour supporter les budgets basés sur un pourcentage du salaire
ALTER TABLE budgets 
ADD COLUMN percentage DECIMAL(5,2) NULL COMMENT 'Pourcentage du salaire alloué à cette catégorie (ex: 30.50 pour 30.5%)';

-- Ajouter une contrainte pour s'assurer que soit allocated soit percentage est défini
-- ALTER TABLE budgets 
-- ADD CONSTRAINT chk_budget_allocation CHECK (
--     (allocated IS NOT NULL AND percentage IS NULL) OR 
--     (allocated IS NULL AND percentage IS NOT NULL)
-- );

-- Index pour améliorer les performances
CREATE INDEX idx_budgets_user_category ON budgets (user_id, category);