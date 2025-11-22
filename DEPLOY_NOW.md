# 🚀 Déployer Maintenant - ShiftPilot Pro

## ✅ Prérequis Complétés

- ✅ Repository Git initialisé
- ✅ Tous les fichiers committés
- ✅ Build de production vérifié (succès)

## 📋 Option 1 : Déploiement via Interface Web Vercel (RECOMMANDÉ - Le plus simple)

### Étape 1 : Préparer le repository GitHub

1. **Créer un nouveau repository sur GitHub** :
   - Aller sur [github.com](https://github.com)
   - Cliquer sur "New repository"
   - Nom : `shiftpilot-pro`
   - Visibilité : Public ou Private
   - **NE PAS** initialiser avec README, .gitignore, ou license

2. **Connecter et pousser le code** :
```bash
git remote add origin https://github.com/VOTRE-USERNAME/shiftpilot-pro.git
git branch -M main
git push -u origin main
```

### Étape 2 : Déployer sur Vercel

1. **Aller sur Vercel** :
   - Ouvrir [vercel.com](https://vercel.com)
   - Se connecter avec GitHub

2. **Importer le projet** :
   - Cliquer sur "Add New Project"
   - Sélectionner votre repository `shiftpilot-pro`
   - Vercel détectera automatiquement Next.js

3. **Configurer les variables d'environnement** :
   - Dans "Environment Variables", ajouter :

```
NEXTAUTH_URL=https://votre-projet.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-here
GOOGLE_REDIRECT_URI=https://votre-projet.vercel.app/api/auth/google/callback
RESEND_API_KEY=your-resend-api-key-here
EMAIL_FROM=ShiftPilot <noreply@noam.dev>
NEXT_PUBLIC_APP_NAME=ShiftPilot
NEXT_PUBLIC_APP_URL=https://votre-projet.vercel.app
```

4. **Déployer** :
   - Cliquer sur "Deploy"
   - Attendre le déploiement (2-3 minutes)
   - Votre site sera accessible sur `https://votre-projet.vercel.app`

---

## 📋 Option 2 : Déploiement via Vercel CLI

### Étape 1 : Installer et connecter Vercel CLI

```bash
# Installer Vercel CLI (si pas déjà fait)
npm install -g vercel

# Se connecter à Vercel
vercel login
```

### Étape 2 : Déployer

```bash
# Déployer (première fois - preview)
vercel

# Déployer en production
vercel --prod
```

⚠️ **Note** : Vous devrez configurer les variables d'environnement dans le dashboard Vercel après le premier déploiement.

---

## ⚠️ IMPORTANT : Configuration Post-Déploiement

### 1. Mettre à jour Google OAuth

Après avoir déployé, vous DEVEZ mettre à jour les URIs de redirection dans Google Cloud Console :

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionner votre projet
3. APIs & Services → Credentials
4. Cliquer sur votre OAuth 2.0 Client ID
5. Dans "Authorized redirect URIs", ajouter :
   ```
   https://votre-projet.vercel.app/api/auth/google/callback
   ```

### 2. Vérifier les Variables d'Environnement

Dans le dashboard Vercel → Settings → Environment Variables, vérifier que toutes les variables sont bien configurées.

---

## ✅ Vérification Post-Déploiement

Une fois déployé, tester :

1. ✅ Page d'accueil : `https://votre-projet.vercel.app/`
2. ✅ Login : `https://votre-projet.vercel.app/login`
3. ✅ Dashboard : `https://votre-projet.vercel.app/dashboard` (après connexion)
4. ✅ OAuth Google : Tester le bouton "Continuer avec Google"

---

## 🆘 En Cas de Problème

1. **Vérifier les logs** :
   - Dashboard Vercel → Deployments → Cliquer sur le déploiement → Logs

2. **Vérifier les variables d'environnement** :
   - Settings → Environment Variables

3. **Tester localement** :
```bash
pnpm build
pnpm start
```

---

**Le projet est prêt à être déployé ! 🚀**

