# 🚀 Guide de Déploiement - ShiftPilot

## Déploiement sur Vercel (Recommandé)

### 1. Préparation

1. **Créer un compte Vercel** : [vercel.com](https://vercel.com)

2. **Installer Vercel CLI** (optionnel) :
```bash
npm i -g vercel
```

### 2. Déploiement via GitHub

1. **Push votre code sur GitHub** :
```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/noamdj02-netizen/ShiftPilot-PRO-21.git
git push -u origin main
```

2. **Connecter le repo à Vercel** :
   - Aller sur [vercel.com/new](https://vercel.com/new)
   - Importer le repository GitHub
   - Vercel détectera automatiquement Next.js

3. **Configurer les variables d'environnement** dans Vercel :
   - Aller dans Settings → Environment Variables
   - Ajouter toutes les variables de `.env.local`

### 3. Variables d'environnement requises

```env
NODE_ENV=production
NEXTAUTH_URL=https://votre-domaine.vercel.app
NEXTAUTH_SECRET=votre-secret-aleatoire

# Email
RESEND_API_KEY=votre-cle-resend

# SMS (optionnel)
TWILIO_ACCOUNT_SID=votre-sid
TWILIO_AUTH_TOKEN=votre-token

# OAuth (optionnel)

# Push Notifications
VAPID_PUBLIC_KEY=votre-cle-publique
VAPID_PRIVATE_KEY=votre-cle-privee
```

### 4. Déploiement

Vercel déploiera automatiquement à chaque push sur `main`.

## Déploiement sur Netlify

1. **Connecter le repo** sur [netlify.com](https://netlify.com)
2. **Build settings** :
   - Build command : `npm run build`
   - Publish directory : `.next`
3. **Ajouter les variables d'environnement**
4. **Déployer**

## Déploiement sur Railway

1. **Créer un compte** sur [railway.app](https://railway.app)
2. **Nouveau projet** → GitHub
3. **Sélectionner le repo**
4. **Configurer les variables d'environnement**
5. **Déployer**

## Migration vers une vraie base de données

Actuellement, ShiftPilot utilise des fichiers JSON. Pour la production :

### Option 1 : PostgreSQL (Recommandé)

1. **Installer Prisma** :
```bash
npm install prisma @prisma/client
npx prisma init
```

2. **Créer le schéma** dans `prisma/schema.prisma`

3. **Migrer les données** depuis JSON vers PostgreSQL

### Option 2 : MongoDB

1. **Installer Mongoose** :
```bash
npm install mongoose
```

2. **Créer les modèles**

3. **Migrer les données**

## Génération des clés VAPID

Pour les notifications push :

```bash
npm install -g web-push
web-push generate-vapid-keys
```

Copiez les clés dans les variables d'environnement.

## Checklist de déploiement

- [ ] Variables d'environnement configurées
- [ ] Clés VAPID générées
- [ ] Base de données configurée (si migration)
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] SSL/HTTPS activé
- [ ] Tests de déploiement effectués
- [ ] Monitoring configuré (optionnel)

## Support

Pour toute question sur le déploiement, ouvrez une issue sur GitHub.
