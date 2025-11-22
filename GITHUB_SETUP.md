# 📦 Guide de Configuration GitHub

## Étapes pour pousser votre code sur GitHub

### 1. Vérifier que Git est initialisé

```bash
git status
```

Si vous voyez "not a git repository", exécutez :
```bash
git init
```

### 2. Ajouter le remote GitHub

```bash
git remote add origin https://github.com/noamdj02-netizen/ShiftPilot-PRO-21.git
```

Vérifier :
```bash
git remote -v
```

### 3. Ajouter tous les fichiers

```bash
git add .
```

### 4. Faire le premier commit

```bash
git commit -m "feat: Initial commit - ShiftPilot SaaS complet avec PWA, notifications push, recherche globale et dashboard temps réel"
```

### 5. Créer la branche main (si nécessaire)

```bash
git branch -M main
```

### 6. Pousser vers GitHub

```bash
git push -u origin main
```

Si vous avez des erreurs de permission, vous devrez peut-être :
- Configurer votre authentification GitHub (token ou SSH)
- Vérifier que vous avez les droits d'écriture sur le repository

## Structure du repository

Le repository contient maintenant :

```
ShiftPilot-PRO-21/
├── app/                    # Pages Next.js
├── components/             # Composants React
├── lib/                    # Utilitaires
├── public/                 # Assets statiques
│   ├── manifest.json      # PWA manifest
│   └── sw.js             # Service Worker
├── data/                   # Base de données JSON
├── README.md              # Documentation principale
├── LICENSE                # Licence MIT
├── CONTRIBUTING.md        # Guide de contribution
├── DEPLOYMENT.md          # Guide de déploiement
├── IMPROVEMENTS_ROADMAP.md # Roadmap d'améliorations
└── .gitignore            # Fichiers ignorés
```

## Fichiers créés pour GitHub

✅ **README.md** - Documentation complète du projet
✅ **LICENSE** - Licence MIT
✅ **CONTRIBUTING.md** - Guide pour les contributeurs
✅ **DEPLOYMENT.md** - Instructions de déploiement
✅ **.gitignore** - Fichiers à ignorer (node_modules, .env, etc.)
✅ **.github/workflows/deploy.yml** - CI/CD pour Vercel

## Variables d'environnement

⚠️ **Important** : Ne commitez JAMAIS le fichier `.env.local` !

Le fichier `.gitignore` est configuré pour ignorer :
- `.env` et `.env.local`
- `node_modules/`
- `data/*.json` (sauf `.gitkeep`)
- `.next/`

## Prochaines étapes après le push

1. **Configurer GitHub Secrets** (pour CI/CD) :
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

2. **Activer GitHub Pages** (optionnel) :
   - Settings → Pages
   - Source : GitHub Actions

3. **Configurer les Issues et Projects** :
   - Créer des templates d'issues
   - Configurer les labels

4. **Ajouter une description** sur GitHub :
   - "🚀 SaaS de gestion de plannings pour restaurants avec IA, PWA et notifications push"

## Commandes Git utiles

```bash
# Voir l'état
git status

# Voir les changements
git diff

# Ajouter des fichiers spécifiques
git add fichier.ts

# Commit avec message
git commit -m "feat: description"

# Push vers GitHub
git push origin main

# Créer une branche
git checkout -b feature/nouvelle-fonctionnalite

# Voir l'historique
git log --oneline
```

## Support

Si vous rencontrez des problèmes avec Git/GitHub :
1. Vérifiez votre authentification GitHub
2. Vérifiez que le repository existe et que vous avez les droits
3. Consultez la [documentation GitHub](https://docs.github.com)

