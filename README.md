# Budget App - Gestionnaire de Finances Personnel

Une application web moderne pour gérer vos finances personnelles avec fonctionnalités d'administration avancées.

## Fonctionnalités

- 💰 **Gestion de budget** : Créez et suivez vos budgets par catégorie
- 📊 **Suivi des transactions** : Enregistrez vos revenus et dépenses
- 👥 **Gestion multi-utilisateurs** : Support pour plusieurs utilisateurs
- 🔧 **Panneau d'administration** : Interface admin complète
- 📧 **Configuration Email** : Intégration Brevo pour emails automatiques
- 🔐 **Authentification sécurisée** : Système de connexion et inscription
- 🎨 **Interface moderne** : UI responsive avec Tailwind CSS

## Configuration Email (Nouveauté)

Cette application intègre maintenant un système de configuration email complet avec Brevo :

### Fonctionnalités Email
- Configuration Brevo via interface admin
- Gestion des modèles d'emails avec variables
- Emails automatiques pour création de compte et réinitialisation de mot de passe
- Test d'envoi depuis l'interface admin
- Templates personnalisables avec aperçu en temps réel

### Guide de Configuration
Consultez le [Guide de Configuration Email](./docs/EMAIL_SETUP.md) pour plus de détails.

## Installation

### 1. Prérequis
- Node.js 18+ 
- MySQL/MariaDB
- Compte Brevo (pour les emails)

### 2. Installation des dépendances
```bash
npm install
```

### 3. Configuration de la base de données
```bash
# Copiez et configurez le fichier d'environnement
cp .env.example .env.local

# Exécutez les schemas de base de données
mysql -u username -p database_name < db/schema.sql
mysql -u username -p database_name < db/schema_admin.sql
mysql -u username -p database_name < db/schema_email.sql
```

### 4. Configuration initiale
```bash
# Démarrez l'application
npm run dev

# Allez sur http://localhost:3000/setup
# Créez le premier administrateur
```

### 5. Configuration Email
1. Connectez-vous en tant qu'administrateur
2. Allez sur `/admin/email`
3. Configurez votre clé API Brevo et paramètres d'expéditeur
4. Testez l'envoi d'emails

## Structure du Projet

```
app/
├── admin/           # Pages d'administration
├── api/             # Routes API
├── dashboard/       # Interface utilisateur principal
└── setup/          # Configuration initiale

components/
├── admin-*         # Composants administration
├── email-*         # Composants gestion email
└── ui/             # Composants UI réutilisables

db/
├── schema.sql      # Schema principal
├── schema_admin.sql # Schema administration
└── schema_email.sql # Schema email (nouveau)

lib/
└── services/
    └── email.ts    # Service d'envoi d'emails (nouveau)
```

## Scripts Disponibles

```bash
npm run dev         # Démarrage en mode développement
npm run build       # Construction pour production
npm run start       # Démarrage en mode production
npm run lint        # Vérification du code
```

## Technologies Utilisées

- **Frontend** : Next.js 15, React 19, TypeScript
- **UI** : Tailwind CSS, Radix UI, Lucide Icons
- **Backend** : Next.js API Routes
- **Base de données** : MySQL avec mysql2
- **Email** : Intégration Brevo
- **Authentification** : bcryptjs
- **Validation** : Zod

## Configuration Avancée

### Variables d'Environnement

```env
# Base de données
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=budget_app

# Environnement
NODE_ENV=development
```

### Sécurité

- Authentification par session
- Hachage des mots de passe avec bcrypt
- Validation des données côté serveur
- Protection CSRF intégrée

## Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Commitez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## Support

- Documentation : [docs/](./docs/)
- Configuration Email : [EMAIL_SETUP.md](./docs/EMAIL_SETUP.md)
- Configuration Admin : [ADMIN_SETUP.md](./docs/ADMIN_SETUP.md)

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.