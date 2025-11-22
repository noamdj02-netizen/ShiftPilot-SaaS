# 🚀 Instructions de Déploiement - ShiftPilot Pro

## ✅ Statut Actuel

- ✅ **Build de production vérifié** : SUCCÈS
- ✅ **Toutes les routes fonctionnelles** : 48 routes détectées
- ✅ **Système de design centralisé** : Implémenté
- ✅ **Refactorisation UI** : Complétée

## 📦 Option 1 : Déploiement Direct sur Vercel (Recommandé)

### Étape 1 : Initialiser Git (si nécessaire)

```bash
# Initialiser le repository Git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit: ShiftPilot Pro avec système de design centralisé"
```

### Étape 2 : Pousser sur GitHub

```bash
# Créer un nouveau repository sur GitHub
# Puis connecter votre projet local :

git remote add origin https://github.com/votre-username/shiftpilot-pro.git
git branch -M main
git push -u origin main
```

### Étape 3 : Déployer sur Vercel

**Option A : Via l'interface Vercel** (Le plus simple)
1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur "Add New Project"
3. Importer votre repository GitHub
4. Vercel détectera automatiquement Next.js
5. Cliquer sur "Deploy"

**Option B : Via Vercel CLI**
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Pour la production
vercel --prod
```

## 🔐 Variables d'Environnement à Configurer sur Vercel

Après avoir créé votre projet sur Vercel, allez dans **Settings → Environment Variables** et ajoutez :

### 🔐 Authentification
```
NEXTAUTH_URL=https://votre-domaine.vercel.app
NEXTAUTH_SECRET=DiHune+HVn0QfE0d3ImSG+GOkv1TfzNZG3Jz89NHJz8=
```

### 🟦 Google OAuth
```
GOOGLE_CLIENT_ID=398816469998-gofsctocpdt9t6i49p9oluirrmrmgrg9.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=https://votre-domaine.vercel.app/api/auth/google/callback
```

**⚠️ IMPORTANT** : Vous devrez aussi mettre à jour l'URI de redirection dans la Google Cloud Console :
- `https://votre-domaine.vercel.app/api/auth/google/callback`

### 📧 Email (Resend)
```
RESEND_API_KEY=re_CUBV2KAW_NNP9gbLy6ixZduRX1i7PrZRi
EMAIL_FROM=ShiftPilot <noreply@noam.dev>
```

### 🔧 Application
```
NEXT_PUBLIC_APP_NAME=ShiftPilot
NEXT_PUBLIC_APP_URL=https://votre-domaine.vercel.app
```

### 📱 SMS (Twilio) - Optionnel
```
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

## ✅ Vérification Post-Déploiement

Une fois déployé, testez :

1. ✅ Page d'accueil : `https://votre-domaine.vercel.app/`
2. ✅ Login : `https://votre-domaine.vercel.app/login`
3. ✅ Signup : `https://votre-domaine.vercel.app/signup`
4. ✅ Dashboard : `https://votre-domaine.vercel.app/dashboard` (après connexion)
5. ✅ OAuth Google : Tester le bouton "Continuer avec Google"

## 🔄 Mises à Jour Futures

Chaque push sur `main` déclenchera automatiquement un nouveau déploiement sur Vercel.

## 📊 Build Information

- **Framework** : Next.js 16.0.3
- **Node Version** : 18.x ou supérieur
- **Build Command** : `pnpm build` (auto-détecté)
- **Output** : `.next` (standard Next.js)

## 🆘 En Cas de Problème

1. **Vérifier les logs Vercel** :
   - Projet Vercel → Deployments → Dernier déploiement → Logs

2. **Vérifier les variables d'environnement** :
   - Settings → Environment Variables

3. **Tester localement en production** :
```bash
pnpm build
pnpm start
```

## 📄 Fichiers Créés pour le Déploiement

- ✅ `DEPLOYMENT.md` - Guide complet de déploiement
- ✅ `REFACTORING_REPORT.md` - Rapport de refactorisation
- ✅ `lib/theme.ts` - Système de design centralisé

---

**Prêt pour le déploiement !** 🚀

