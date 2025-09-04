# Setup de l'Administrateur - Guide de Configuration

## Aperçu

Cette fonctionnalité ajoute un flux de configuration initial sécurisé qui redirige automatiquement vers la page `/setup` lors du premier lancement de l'application. Cette page permet de créer un seul administrateur d'application et se désactive automatiquement après création.

## Configuration de la Base de Données

Avant d'utiliser la fonctionnalité d'administration, exécutez cette requête SQL pour ajouter le support des administrateurs :

```sql
ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
```

Ou utilisez le fichier de schéma fourni :
```bash
mysql -u your_username -p your_database < db/schema_admin.sql
```

## Flux de Configuration

### Premier Lancement
1. L'application vérifie s'il existe des administrateurs
2. Si aucun administrateur n'existe, redirection automatique vers `/setup`
3. La page `/setup` affiche un formulaire pour créer l'administrateur principal
4. Après création, l'utilisateur est redirigé vers la page d'accueil

### Après Configuration
1. La page `/setup` devient inaccessible (affiche un message d'avertissement)
2. L'inscription d'utilisateurs réguliers est maintenant autorisée
3. La connexion inclut le statut d'administrateur dans la réponse

## Sécurité

- ✅ Un seul administrateur peut être créé via `/setup`
- ✅ Les tentatives d'accès à `/setup` après création sont bloquées
- ✅ L'inscription d'utilisateurs réguliers est bloquée jusqu'à la création de l'admin
- ✅ Vérification côté serveur pour empêcher la création de multiples admins

## API Endpoints

### `GET /api/admin/exists`
Vérifie si un administrateur existe dans le système.

**Réponse :**
```json
{
  "adminExists": boolean
}
```

### `POST /api/setup`
Crée le premier administrateur. Ne fonctionne que si aucun admin n'existe.

**Corps de la requête :**
```json
{
  "name": "string",
  "email": "string", 
  "password": "string"
}
```

**Réponse de succès :**
```json
{
  "success": true,
  "adminId": number,
  "message": "Administrator created successfully"
}
```

**Réponse d'erreur (admin existe déjà) :**
```json
{
  "error": "Admin already exists"
}
```

## Mise à Jour des APIs Existantes

### `/api/register`
- Maintenant vérifie qu'un administrateur existe avant d'autoriser l'inscription
- Retourne une erreur 403 si aucun admin n'existe

### `/api/login`  
- Inclut maintenant le statut `isAdmin` dans la réponse
- Permet de différencier les administrateurs des utilisateurs réguliers

## Interface Utilisateur

La page `/setup` présente :
- Une interface claire et sécurisée pour la création d'administrateur
- Messages d'état appropriés pendant le processus
- Redirection automatique après création
- Protection contre les accès multiples

## Compatibilité

Cette fonctionnalité est rétrocompatible et ne casse aucune fonctionnalité existante. Les utilisateurs existants dans la base de données auront `is_admin = FALSE` par défaut.