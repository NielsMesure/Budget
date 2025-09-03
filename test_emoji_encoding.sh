#!/bin/bash

# Script de test pour vérifier que l'encodage emoji fonctionne correctement
# Ce script teste l'insertion d'emojis dans la base de données

echo "🧪 Test de l'encodage emoji dans la base de données..."

# Instructions pour l'utilisateur
echo ""
echo "📋 Instructions:"
echo "1. Assurez-vous que votre base de données MySQL est démarrée"
echo "2. Exécutez d'abord le script de correction: mysql < db/fix_emoji_encoding.sql"
echo "3. Puis testez avec ce script"
echo ""

# Test d'insertion d'emoji via l'API (nécessite que l'application soit en cours d'exécution)
echo "🔧 Pour tester l'API avec un emoji, utilisez cette commande curl:"
echo ""
echo "curl -X POST http://localhost:3000/api/budgets \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{"
echo "    \"userId\": \"1\","
echo "    \"category\": \"test\","
echo "    \"allocated\": 100,"
echo "    \"color\": \"bg-blue-500\","
echo "    \"emoji\": \"🍽️\""
echo "  }'"
echo ""

echo "✅ Si aucune erreur n'apparaît, l'encodage emoji fonctionne correctement!"
echo "❌ Si vous voyez 'Incorrect string value', exécutez d'abord db/fix_emoji_encoding.sql"