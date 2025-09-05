# Configuration Email - Guide Complet

## Vue d'ensemble

Ce système ajoute une configuration email complète avec intégration Brevo SMTP pour votre application Budget. Les administrateurs peuvent configurer les paramètres SMTP Brevo, gérer les modèles d'emails et envoyer des emails automatiques pour la création de compte et la réinitialisation de mot de passe.

## Configuration de la Base de Données

### 1. Exécuter le Schema Email

Avant d'utiliser la fonctionnalité email, exécutez le script SQL fourni :

```bash
mysql -u your_username -p your_database < db/schema_email.sql
```

Ce script crée les tables suivantes :
- `email_config` : Stocke la configuration SMTP Brevo (serveur, port, identifiants, etc.)
- `email_templates` : Stocke les modèles d'emails avec variables
- `password_resets` : Gère les codes de réinitialisation de mot de passe

### 2. Configuration Environnement

Assurez-vous que votre fichier `.env.local` contient :

```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

## Accès au Panneau d'Administration

### 1. Configuration Initiale

Si c'est la première utilisation de l'application :
1. Allez sur `/setup`
2. Créez le premier administrateur
3. Connectez-vous avec ces identifiants

### 2. Accès à la Configuration Email

1. Connectez-vous en tant qu'administrateur
2. Allez sur `/admin`
3. Cliquez sur "Configuration Email" dans la sidebar

## Fonctionnalités du Système Email

### 1. Configuration Brevo SMTP

![Admin Setup](https://github.com/user-attachments/assets/3b84a7cd-a9ba-4d04-b997-0c4b5b1d2576)

Dans l'onglet **Configuration** :
- **Serveur SMTP** : Serveur SMTP Brevo (par défaut: smtp-relay.brevo.com)
- **Port SMTP** : Port SMTP (par défaut: 587)
- **Nom d'utilisateur SMTP** : Votre email de compte Brevo
- **Mot de passe SMTP** : Votre clé SMTP Brevo (trouvée dans "SMTP & API")
- **Email expéditeur** : L'email qui apparaîtra comme expéditeur (doit être vérifié dans Brevo)
- **Nom expéditeur** : Le nom qui apparaîtra comme expéditeur
- **Emails activés** : Basculer pour activer/désactiver l'envoi d'emails

### 2. Gestion des Modèles

Dans l'onglet **Modèles** :

#### Modèles par défaut inclus :

**1. Création de compte** (`account_creation`)
- Variables disponibles : `{{userName}}`, `{{userEmail}}`
- Envoyé automatiquement lors de l'inscription d'un nouvel utilisateur

**2. Réinitialisation mot de passe** (`password_reset`)
- Variables disponibles : `{{userName}}`, `{{userEmail}}`, `{{resetCode}}`, `{{expirationTime}}`
- Envoyé lors d'une demande de réinitialisation de mot de passe

#### Édition des modèles :
1. Cliquez sur le bouton "Éditer" d'un modèle
2. Modifiez le sujet, contenu HTML et texte
3. Utilisez les variables en cliquant dessus pour les insérer
4. Prévisualisez avec l'onglet "Aperçu"
5. Sauvegardez vos modifications

### 3. Test d'Envoi

Dans l'onglet **Test** :
1. Saisissez un email de destination
2. Cliquez sur "Envoyer un email de test"
3. Vérifiez la réception de l'email

## Intégration Automatique

### 1. Création de Compte

Quand un utilisateur s'inscrit via `/api/register`, un email de bienvenue est automatiquement envoyé en utilisant le modèle `account_creation`.

### 2. Réinitialisation de Mot de Passe

L'API `/api/password-reset` permet :
- **POST** : Demander un code de réinitialisation (envoie un email)
- **PUT** : Confirmer la réinitialisation avec le code reçu

Exemple d'utilisation :

```javascript
// Demander une réinitialisation
const response = await fetch('/api/password-reset', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' })
})

// Confirmer avec le code
const resetResponse = await fetch('/api/password-reset', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    resetCode: '123456',
    newPassword: 'newPassword123'
  })
})
```

## Configuration Brevo SMTP

### 1. Obtenir les Identifiants SMTP

1. Créez un compte sur [Brevo](https://www.brevo.com)
2. Allez dans votre tableau de bord
3. Accédez à "SMTP & API"
4. Notez vos identifiants SMTP :
   - **Serveur SMTP** : smtp-relay.brevo.com
   - **Port** : 587
   - **Nom d'utilisateur** : Votre email de connexion Brevo
   - **Mot de passe** : Votre clé SMTP (différente de votre mot de passe de connexion)

### 2. Configurer l'Expéditeur

1. Vérifiez votre domaine dans Brevo
2. Configurez l'email expéditeur (doit être un email vérifié)
3. Définissez le nom d'expéditeur souhaité

⚠️ **Important** : Utilisez les identifiants SMTP, pas une clé API. La clé SMTP se trouve dans la section "SMTP & API" de votre compte Brevo.

## Variables Disponibles dans les Modèles

### Variables Globales
- `{{userName}}` : Nom de l'utilisateur
- `{{userEmail}}` : Email de l'utilisateur

### Variables Spécifiques à la Réinitialisation
- `{{resetCode}}` : Code à 6 chiffres pour la réinitialisation
- `{{expirationTime}}` : Durée de validité du code (ex: "15 minutes")

### Utilisation des Variables

Dans vos modèles, utilisez la syntaxe `{{nomVariable}}` :

```html
<p>Bonjour {{userName}},</p>
<p>Votre code de réinitialisation est : <strong>{{resetCode}}</strong></p>
<p>Ce code expire dans {{expirationTime}}.</p>
```

## Service Email Réutilisable

Le service `EmailService` dans `lib/services/email.ts` fournit des méthodes pour envoyer des emails programmatiquement :

```typescript
import { EmailService } from '@/lib/services/email'

// Envoyer un email de création de compte
await EmailService.sendAccountCreationEmail('user@example.com', 'Jean Dupont')

// Envoyer un email de réinitialisation
await EmailService.sendPasswordResetEmail('user@example.com', 'Jean Dupont', '123456', '15 minutes')

// Envoyer un email personnalisé
await EmailService.sendEmail('template_key', 'user@example.com', { variable1: 'value1' })
```

## Sécurité

- Les clés API sont stockées en base de données (considérez le chiffrement pour la production)
- Les codes de réinitialisation expirent automatiquement après 15 minutes
- Un seul code de réinitialisation actif par utilisateur
- Validation côté serveur de tous les paramètres

## Dépannage

### Erreurs courantes :

1. **"Configuration SMTP Brevo incomplète"**
   - Vérifiez que le nom d'utilisateur et mot de passe SMTP sont correctement saisis
   - Assurez-vous d'utiliser votre clé SMTP (pas votre mot de passe de connexion)

2. **"Envoi d'emails désactivé"**
   - Activez l'envoi d'emails dans l'onglet Configuration

3. **"Erreur lors de l'envoi"**
   - Vérifiez la validité de vos identifiants SMTP
   - Assurez-vous que l'email expéditeur est vérifié dans Brevo
   - Consultez les logs pour plus de détails

4. **Erreurs de base de données**
   - Vérifiez que le schema email a été exécuté
   - Contrôlez la configuration de la base de données

### Comment trouver vos identifiants SMTP Brevo :

1. Connectez-vous à votre compte Brevo
2. Allez dans "SMTP & API" 
3. Dans la section "SMTP", vous trouverez :
   - **Nom d'utilisateur** : Votre email de connexion
   - **Mot de passe** : Cliquez sur "Générer un nouveau mot de passe SMTP" si nécessaire

## Structure des Fichiers Ajoutés

```
app/
├── admin/email/
│   └── page.tsx                     # Page admin configuration email
├── api/admin/
│   ├── email-config/route.ts        # API configuration Brevo
│   ├── email-templates/route.ts     # API gestion modèles
│   └── test-email/route.ts          # API test d'envoi
└── api/password-reset/route.ts      # API réinitialisation mot de passe

components/
├── email-config.tsx                 # Interface configuration email
└── email-template-editor.tsx        # Éditeur de modèles

db/
└── schema_email.sql                 # Schema base de données

lib/services/
└── email.ts                         # Service d'envoi d'emails
```

Cette implémentation fournit une solution complète et flexible pour la gestion des emails dans votre application Budget.