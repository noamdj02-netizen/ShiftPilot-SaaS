# 🚀 Guide de Déploiement - ShiftPilot

## Déploiement sur Vercel (Recommandé)

### Prérequis

- Compte GitHub
- Compte Vercel ([vercel.com](https://vercel.com))
- Variables d'environnement configurées (voir `ENV_EXAMPLE.md`)

### Étape 1 : Push sur GitHub

```bash
# Vérifier les changements
git status

# Ajouter tous les fichiers
git add .

# Commit
git commit -m "chore: project cleanup and optimization"

# Push (si remote existe déjà)
git push origin main

# OU créer un nouveau repo
git remote add origin https://github.com/votre-username/shiftpilot-saas.git
git branch -M main
git push -u origin main
```

### Étape 2 : Déployer sur Vercel

#### Option A : Via l'interface Vercel (Recommandé)

1. Aller sur [vercel.com/new](https://vercel.com/new)
2. Cliquer sur "Import Git Repository"
3. Sélectionner votre repository GitHub
4. Vercel détectera automatiquement Next.js
5. Cliquer sur "Deploy"

#### Option B : Via Vercel CLI

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

### Étape 3 : Configurer les Variables d'Environnement

Dans Vercel Dashboard → Settings → Environment Variables, ajouter :

#### Variables Essentielles

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://votre-domaine.vercel.app
NEXTAUTH_URL=https://votre-domaine.vercel.app
NEXTAUTH_SECRET=your-secret-here-generate-with-openssl-rand-base64-32
```

#### Variables Optionnelles (selon vos besoins)

- **Email** : `RESEND_API_KEY`, `EMAIL_FROM`
- **SMS** : `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- **OAuth Google** : `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`
- **OAuth Apple** : `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY`
- **Push Notifications** : `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`

Voir `ENV_EXAMPLE.md` pour la liste complète.

### Étape 4 : Redéployer

Après avoir ajouté les variables d'environnement, redéployer :

```bash
# Via CLI
vercel --prod

# OU via Dashboard : Cliquer sur "Redeploy"
```

## Vérification du Déploiement

### Checklist

- [ ] Build réussi sur Vercel
- [ ] Variables d'environnement configurées
- [ ] Application accessible sur `https://votre-domaine.vercel.app`
- [ ] Routes API fonctionnelles
- [ ] Authentification fonctionnelle
- [ ] Dashboard accessible

### Commandes de Test

```bash
# Tester localement avant de déployer
pnpm run build
pnpm run start

# Vérifier que tout fonctionne
curl https://votre-domaine.vercel.app/api/auth/me
```

## Dépannage

### Build échoue

1. Vérifier les logs de build sur Vercel
2. Vérifier que toutes les dépendances sont dans `package.json`
3. Vérifier que `pnpm-lock.yaml` est à jour

### Erreurs d'environnement

1. Vérifier que toutes les variables sont configurées
2. Vérifier que `NEXTAUTH_URL` correspond à votre domaine Vercel
3. Vérifier que les secrets sont correctement générés

### Routes API ne fonctionnent pas

1. Vérifier que `export const dynamic = "force-dynamic"` est présent dans les routes qui utilisent des cookies
2. Vérifier les logs Vercel pour les erreurs spécifiques

## Support

Pour plus d'aide, consultez :
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Next.js](https://nextjs.org/docs)
- `README.md` pour la documentation complète du projet
