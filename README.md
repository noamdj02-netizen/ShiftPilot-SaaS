# 🚀 ShiftPilot - Gestion Intelligente de Plannings pour Restaurants

> Application SaaS moderne de gestion de plannings pour restaurants avec IA, notifications push, et PWA.

## ✨ Fonctionnalités Principales

### 🎯 Core Features
- ✅ **Gestion de plannings intelligente** avec génération IA
- ✅ **Gestion d'équipe** complète (employés, rôles, disponibilités)
- ✅ **Dashboard temps réel** avec statistiques live
- ✅ **Notifications push** (email, SMS, push web)
- ✅ **PWA** (Progressive Web App) - Installation mobile
- ✅ **Recherche globale** (Cmd+K) avec command palette
- ✅ **Authentification** (Email/Password, OAuth Google & Apple)
- ✅ **Dashboard employé** avec planning personnel et demandes de congés
- ✅ **Analytics** avancés avec graphiques interactifs
- ✅ **Multi-locations** pour chaînes de restaurants
- ✅ **Export** (PDF, iCal, Excel)

### 🔥 Features Avancées
- 🤖 **Optimisation IA** des plannings
- 📊 **Analytics prédictifs** et statistiques temps réel
- 🔔 **Notifications push** en temps réel
- 📱 **Application mobile** (PWA)
- 🎨 **Mode sombre/clair** avec animations
- 🔍 **Recherche globale** intelligente
- 📅 **Templates de plannings** réutilisables
- 🔄 **Échange de shifts** entre employés
- 📈 **Gestion de paie** et exports
- 🔐 **Sécurité renforcée** (sessions, authentification)

## 🛠️ Technologies

- **Framework**: Next.js 16 (App Router)
- **Langage**: TypeScript
- **UI**: Tailwind CSS, Shadcn/ui, Framer Motion
- **Charts**: Recharts
- **Notifications**: Service Workers, Web Push API
- **Base de données**: JSON files (prêt pour migration vers PostgreSQL/MongoDB)
- **Authentification**: Sessions sécurisées, OAuth
- **Animations**: Framer Motion

## 🚀 Installation

```bash
# Installer les dépendances
pnpm install

# Copier les variables d'environnement
cp .env.example .env.local

# Lancer le serveur de développement
pnpm dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📦 Variables d'Environnement

Créer un fichier `.env.local` :

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre_secret_32_bytes_base64

# OAuth Google
GOOGLE_CLIENT_ID=votre_google_client_id
GOOGLE_CLIENT_SECRET=votre_google_client_secret

# OAuth Apple
APPLE_CLIENT_ID=votre_apple_client_id
APPLE_CLIENT_SECRET=votre_apple_client_secret

# Email (Resend ou SMTP)
RESEND_API_KEY=votre_resend_api_key
EMAIL_FROM=noreply@shiftpilot.com

# SMS (Twilio)
TWILIO_ACCOUNT_SID=votre_twilio_sid
TWILIO_AUTH_TOKEN=votre_twilio_token
TWILIO_PHONE_NUMBER=votre_numero_twilio

# Push Notifications
VAPID_PUBLIC_KEY=votre_vapid_public_key
VAPID_PRIVATE_KEY=votre_vapid_private_key
```

## 📱 PWA Installation

1. Visiter l'application sur mobile ou desktop
2. Un prompt d'installation apparaîtra automatiquement
3. Sur iOS : Utiliser le menu "Partager" → "Sur l'écran d'accueil"
4. L'application sera installée et accessible comme une app native

## 🔑 Comptes de Test

### Manager/Entreprise
- Email: `demo@shiftpilot.com`
- Mot de passe: `Demo1234!`

### Employé
- Email: `employe@test.com`
- Mot de passe: `test1234`

## 📂 Structure du Projet

```
shift-pilot-saa-s-documentation/
├── app/
│   ├── api/              # API Routes
│   ├── dashboard/        # Pages dashboard manager
│   ├── employee/         # Pages dashboard employé
│   ├── auth/             # Pages authentification
│   └── page.tsx          # Landing page
├── components/
│   ├── dashboard/        # Composants dashboard
│   ├── employees/        # Composants employés
│   ├── schedules/        # Composants plannings
│   ├── pwa/              # Composants PWA
│   └── ui/               # Composants UI Shadcn
├── lib/
│   ├── db.ts             # Gestion base de données
│   ├── auth.ts           # Authentification
│   └── notifications/    # Services notifications
├── public/
│   ├── manifest.json     # Manifest PWA
│   ├── sw.js             # Service Worker
│   └── offline.html      # Page hors ligne
└── data/                 # Données JSON (base de données)
```

## 🎯 Roadmap

Voir [IMPROVEMENTS_ROADMAP.md](./IMPROVEMENTS_ROADMAP.md) pour la liste complète des améliorations prévues.

## 📄 Licence

Ce projet est privé et propriétaire.

## 👥 Auteur

**Noam Dj02**
- GitHub: [@noamdj02-netizen](https://github.com/noamdj02-netizen)
- Dépôt: [ShiftPilot-PRO-21](https://github.com/noamdj02-netizen/ShiftPilot-PRO-21.git)

## 🆘 Support

Pour toute question ou problème, ouvrir une issue sur GitHub.

