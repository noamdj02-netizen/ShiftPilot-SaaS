# 🚀 Guide de Déploiement - ShiftPilot Pro

## ✅ Prérequis

Le build de production a été vérifié avec succès. Toutes les routes sont fonctionnelles.

## 📋 Déploiement sur Vercel

### Option 1 : Déploiement via CLI Vercel (Recommandé)

```bash
# Installer Vercel CLI globalement
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer depuis le répertoire du projet
vercel

# Pour la production
vercel --prod
```

### Option 2 : Déploiement via GitHub

1. **Pousser le code sur GitHub** :
```bash
git add .
git commit -m "refactor: système de design centralisé et améliorations UI"
git push origin main
```

2. **Connecter le repository à Vercel** :
   - Aller sur [vercel.com](https://vercel.com)
   - Cliquer sur "Add New Project"
   - Importer votre repository GitHub
   - Vercel détectera automatiquement Next.js

## 🔐 Variables d'Environnement Requises

Après avoir créé votre projet sur Vercel, ajoutez ces variables d'environnement dans les **Settings → Environment Variables** :

### 🔐 Authentification
```
NEXTAUTH_URL=https://votre-domaine.vercel.app
NEXTAUTH_SECRET=DiHune+HVn0QfE0d3ImSG+GOkv1TfzNZG3Jz89NHJz8=
```

### 🌐 Base de Données (Optionnel - Si vous utilisez PostgreSQL)
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/shiftpilot
```

### 🟦 Google OAuth
```
GOOGLE_CLIENT_ID=398816469998-gofsctocpdt9t6i49p9oluirrmrmgrg9.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=https://votre-domaine.vercel.app/api/auth/google/callback
```

### 📧 Email (Resend)
```
RESEND_API_KEY=re_CUBV2KAW_NNP9gbLy6ixZduRX1i7PrZRi
EMAIL_FROM=ShiftPilot <noreply@noam.dev>
```

### 📱 SMS (Twilio) - Optionnel
```
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

### 🔧 Autres
```
NEXT_PUBLIC_APP_NAME=ShiftPilot
NEXT_PUBLIC_APP_URL=https://votre-domaine.vercel.app
```

### 🐛 Debug (Optionnel - En développement seulement)
```
NODE_ENV=production
DEBUG_API=false
```

## ⚠️ Configuration Google OAuth pour Production

**IMPORTANT** : Après avoir déployé, vous devez mettre à jour les URIs de redirection autorisées dans la Google Cloud Console :

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionnez votre projet OAuth
3. Allez dans **APIs & Services → Credentials**
4. Cliquez sur votre **OAuth 2.0 Client ID**
5. Ajoutez dans **Authorized redirect URIs** :
   - `https://votre-domaine.vercel.app/api/auth/google/callback`

## 📦 Build Configuration

Le projet est configuré avec :
- **Framework** : Next.js 16.0.3
- **Node Version** : 18.x ou supérieur (recommandé)
- **Build Command** : `pnpm build` (automatiquement détecté par Vercel)
- **Output Directory** : `.next` (par défaut Next.js)

## ✅ Vérification Post-Déploiement

Après le déploiement, vérifiez :

1. ✅ La page d'accueil charge correctement
2. ✅ Les pages `/login` et `/signup` fonctionnent
3. ✅ L'authentification OAuth Google fonctionne
4. ✅ Le dashboard est accessible après connexion
5. ✅ Les API routes répondent correctement

## 🔍 Debugging

Si vous rencontrez des erreurs :

1. **Vérifier les logs Vercel** :
   - Aller dans votre projet Vercel
   - Onglet **Deployments** → Cliquer sur le dernier déploiement
   - Voir les logs de build et runtime

2. **Vérifier les variables d'environnement** :
   - Settings → Environment Variables
   - S'assurer que toutes les variables sont présentes

3. **Tester localement en production** :
```bash
pnpm build
pnpm start
```

## 📊 Performance

Vercel optimise automatiquement :
- ✅ Images automatiquement optimisées
- ✅ Static assets mis en cache
- ✅ Edge Functions pour les API routes
- ✅ Automatic HTTPS

## 🔄 Mise à Jour Continue

Chaque push sur la branche `main` déclenchera automatiquement un nouveau déploiement sur Vercel.

## 🆘 Support

En cas de problème :
1. Vérifier les logs Vercel
2. Vérifier que toutes les variables d'environnement sont configurées
3. Tester le build localement avec `pnpm build`

---

**Date de création** : 2025-01-22
**Version** : 1.0.0

