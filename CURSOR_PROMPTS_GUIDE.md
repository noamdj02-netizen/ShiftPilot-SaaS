# 🎯 GUIDE COMPLET: PROMPTS CURSOR POUR SHIFTPILOT (Next.js)

## 📋 TABLE DES MATIÈRES

1. Architecture Next.js App Router
2. Prompts par domaine (adaptés Next.js)
3. Commandes Cursor optimisées
4. Checklist d'implémentation ShiftPilot

---

## 🏗️ PARTIE 1: ARCHITECTURE NEXT.JS

### Prompt de démarrage principal (Next.js)

```
Tu es un expert en développement SaaS full-stack avec Next.js 14+, TypeScript, et React Server Components.

Je veux améliorer mon SaaS ShiftPilot (gestion de plannings pour restaurants) pour qu'il soit complètement fonctionnel.

Architecture actuelle:
- Next.js App Router (app/ directory)
- TypeScript strict
- Shadcn/ui components
- Framer Motion pour animations
- JSON file-based database (lib/db.ts)
- API Routes dans app/api/

Objectifs:
- Créer toutes les pages manquantes
- Connecter tous les boutons à des routes réelles
- Implémenter les fonctionnalités CRUD complètes
- Utiliser App Router de Next.js (Server & Client Components)
- Maintenir la cohérence avec le design existant

Guideline:
- Code TypeScript strict (zero any)
- Server Components par défaut, Client Components quand nécessaire
- Validation Zod pour tous les formulaires
- Toast notifications (sonner) pour feedback
- Animations Framer Motion
- Protection des routes avec middleware
```

---

## 🎨 PARTIE 2: PROMPTS PAR DOMAINE (NEXT.JS)

### A) PROMPT: ROUTES & NAVIGATION NEXT.JS

**Utilisation:** Copiez ceci dans Cursor avec Cmd+K

```
Crée la structure complète des routes Next.js App Router pour ShiftPilot avec:

Pages nécessaires:
- app/dashboard/page.tsx (page d'accueil dashboard)
- app/dashboard/employees/page.tsx (liste équipe)
- app/dashboard/employees/new/page.tsx (ajout employé)
- app/dashboard/employees/[id]/page.tsx (détail employé)
- app/dashboard/employees/[id]/edit/page.tsx (modifier employé)
- app/dashboard/schedules/page.tsx (liste plannings) ✓ EXISTE
- app/dashboard/schedules/[id]/page.tsx (détail planning) ✓ EXISTE
- app/dashboard/schedules/new/page.tsx (nouveau planning manuel)
- app/dashboard/schedules/generate/page.tsx (générer avec IA) ✓ EXISTE
- app/dashboard/settings/page.tsx (paramètres)
- app/dashboard/settings/profile/page.tsx (profil)
- app/dashboard/settings/company/page.tsx (entreprise)
- app/dashboard/analytics/page.tsx (statistiques)
- app/dashboard/reports/page.tsx (rapports)

Inclus:
1. Layout.tsx pour chaque section avec navigation
2. Middleware pour protéger routes /dashboard/*
3. Navigation sidebar réutilisable
4. Breadcrumbs automatiques
5. Transitions Framer Motion entre pages
6. Menu responsive mobile

Utilise Next.js App Router, Server Components par défaut, Client Components pour interactions.
Fais du code production-ready.
```

---

### B) PROMPT: MODULE ÉQUIPE COMPLET (NEXT.JS)

**Utilisation:** Copiez ceci pour améliorer le module Équipe

```
Améliore le module Équipe ShiftPilot avec:

Pages à créer/améliorer:

1. app/dashboard/employees/page.tsx - Liste des employés
   - Utilise le composant EmployeeList existant
   - Ajoute: Tri par colonne, Filtres avancés (disponibilité, statut)
   - Pagination complète (50 par page)
   - Export CSV/Excel
   - Bulk actions (sélection multiple, suppression multiple)
   - Recherche améliorée (nom, email, téléphone, rôle)

2. app/dashboard/employees/[id]/page.tsx - Détail employé
   - Affiche toutes les infos (disponibilité, historique shifts)
   - Graphique heures travaillées (derniers mois)
   - Liste des plannings où l'employé est assigné
   - Historique des modifications
   - Actions: Éditer, Archiver, Supprimer

3. app/dashboard/employees/[id]/edit/page.tsx - Édition employé
   - Formulaire pré-rempli avec données actuelles
   - Validation Zod complète
   - Upload photo de profil (si besoin)
   - Gestion disponibilité par jour/semaine
   - Préférences de shifts

4. Composants à créer:
   - components/employees/employee-stats.tsx (statistiques employé)
   - components/employees/availability-calendar.tsx (calendrier disponibilité)
   - components/employees/shift-history.tsx (historique shifts)

Backend:
- Utilise l'API existante: /api/employees (GET, POST)
- Crée: /api/employees/[id] (GET, PUT, DELETE)
- Crée: /api/employees/[id]/stats (GET statistiques)

Design:
- Tailwind CSS cohérent avec le reste
- Shadcn/ui components
- Animations Framer Motion
- Loading states avec SkeletonCard
- Error boundaries
```

---

### C) PROMPT: PARAMÈTRES UTILISATEUR (NEXT.JS)

```
Crée une section Paramètres complète pour ShiftPilot avec:

Pages:

1. app/dashboard/settings/page.tsx - Page principale settings
   - Layout avec navigation latérale
   - Vue d'ensemble des paramètres
   - Lien vers: Profile, Entreprise, Notifications, Sécurité, Intégrations

2. app/dashboard/settings/profile/page.tsx
   - Éditer infos personnelles (nom, email, photo)
   - Changer mot de passe (avec confirmation)
   - 2FA activation (préparation pour futur)
   - Sessions actives (liste devices connectés)

3. app/dashboard/settings/company/page.tsx
   - Infos entreprise (nom, logo, adresse, téléphone)
   - Fuseau horaire
   - Langue par défaut (FR/EN)
   - Configuration horaires (ouverture/fermeture)
   - Jours ouverts

4. app/dashboard/settings/notifications/page.tsx
   - Préférences email (rapports, alertes shifts, changements planning)
   - Notifications push (si implémenté)
   - Webhooks configuration

5. app/dashboard/settings/security/page.tsx
   - Historique connexions
   - Gestion API keys
   - Permissions utilisateur

Backend:
- /api/settings/profile (GET, PUT)
- /api/settings/company (GET, PUT)
- /api/settings/notifications (GET, PUT)
- /api/settings/security (GET)

Design:
- Settings layout avec sidebar navigation
- Sauvegarde automatique avec indication "Sauvegardé"
- Confirmations pour actions critiques
- Formulaires avec validation Zod
```

---

### D) PROMPT: ANALYTICS & RAPPORTS (NEXT.JS)

```
Crée des pages Analytics et Rapports pour ShiftPilot:

Pages:

1. app/dashboard/analytics/page.tsx - Dashboard Analytics
   - Graphiques avec Recharts:
     * Heures travaillées par employé (bar chart)
     * Coûts de main-d'œuvre par semaine (line chart)
     * Répartition des shifts par rôle (pie chart)
     * Taux d'occupation par jour (area chart)
   - Cartes statistiques:
     * Total heures/semaine
     * Coût total/semaine
     * Nombre d'employés actifs
     * Nombre de shifts planifiés
   - Filtres par période (7j, 30j, 90j, custom)

2. app/dashboard/reports/page.tsx - Rapports
   - Génération rapports:
     * Rapport heures par employé (PDF)
     * Rapport coûts par période (PDF)
     * Rapport disponibilité (PDF)
   - Historique rapports générés
   - Export CSV/Excel
   - Envoi automatique par email

Composants:
- components/analytics/stats-cards.tsx (cartes stats)
- components/analytics/hours-chart.tsx (graphique heures)
- components/analytics/costs-chart.tsx (graphique coûts)
- components/reports/report-generator.tsx (générateur rapports)

Backend:
- /api/analytics/stats (GET statistiques)
- /api/analytics/charts (GET données graphiques)
- /api/reports/generate (POST générer rapport)
- /api/reports/history (GET historique)

Utilise Recharts pour graphiques, react-pdf pour PDF generation.
```

---

### E) PROMPT: AMÉLIORATION PLANNINGS (NEXT.JS)

```
Améliore le système de plannings ShiftPilot avec:

Fonctionnalités à ajouter:

1. Duplication de planning
   - Bouton "Dupliquer" dans schedule-list
   - Crée copie du planning avec shifts
   - API: POST /api/schedules/[id]/duplicate

2. Archivage de plannings
   - Bouton "Archiver" pour anciens plannings
   - Status "archived" dans DB
   - Filtre pour cacher/montrer archivés

3. Export plannings
   - Export PDF (format imprimable)
   - Export iCal (calendrier)
   - Export Excel/CSV
   - API: GET /api/schedules/[id]/export?format=pdf|ical|csv

4. Partage plannings
   - Générer lien public (avec token)
   - Partage par email aux employés
   - QR code pour accès mobile

5. Templates de planning
   - Sauvegarder planning comme template
   - Réutiliser template pour nouveaux plannings
   - CRUD pour templates

6. Optimisation IA améliorée
   - Prendre en compte préférences employés
   - Équilibrer charges de travail
   - Minimiser coûts
   - Respecter contraintes légales (max heures/jour)

Composants:
- components/schedules/schedule-duplicate-dialog.tsx
- components/schedules/schedule-export-options.tsx
- components/schedules/schedule-share-dialog.tsx
- components/schedules/template-manager.tsx

Backend:
- POST /api/schedules/[id]/duplicate
- POST /api/schedules/[id]/archive
- GET /api/schedules/[id]/export
- POST /api/schedules/[id]/share
- GET /api/templates
- POST /api/templates
```

---

## 🎯 PARTIE 3: COMMANDES CURSOR OPTIMISÉES

### Commande 1: Générer structure complète Next.js

```
Crée la structure de dossiers complète pour ShiftPilot avec Next.js App Router:

app/
├── (auth)/
│   ├── login/
│   └── signup/
├── dashboard/
│   ├── layout.tsx (layout avec sidebar)
│   ├── page.tsx (dashboard principal)
│   ├── employees/
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── edit/
│   │           └── page.tsx
│   ├── schedules/
│   │   ├── page.tsx ✓
│   │   ├── new/
│   │   │   └── page.tsx
│   │   ├── generate/
│   │   │   └── page.tsx ✓
│   │   └── [id]/
│   │       ├── page.tsx ✓
│   │       └── edit/
│   │           └── page.tsx ✓
│   ├── settings/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── company/
│   │   │   └── page.tsx
│   │   └── notifications/
│   │       └── page.tsx
│   ├── analytics/
│   │   └── page.tsx
│   └── reports/
│       └── page.tsx
├── api/
│   ├── auth/ ✓
│   ├── employees/ ✓
│   ├── schedules/ ✓
│   ├── settings/
│   ├── analytics/
│   └── reports/
└── page.tsx (landing page) ✓

components/
├── dashboard/
│   ├── sidebar.tsx
│   └── header.tsx
├── employees/ ✓
├── schedules/ ✓
└── settings/

lib/
├── db.ts ✓
├── auth.ts ✓
├── validations.ts ✓
└── api-utils.ts ✓

Crée chaque fichier avec du code de base.
Utilise Next.js 14 App Router, TypeScript, Shadcn/ui.
```

---

### Commande 2: Implémenter un module complet

```
Module [EMPLOYEES/SETTINGS/ANALYTICS]: 

Implémenter COMPLÈTEMENT pour ShiftPilot avec:
- Pages Next.js App Router (Server + Client Components)
- API Routes avec validation Zod
- Composants Shadcn/ui
- Animations Framer Motion
- Toast notifications
- Error handling
- Loading states

Prêt pour production.
```

---

### Commande 3: Connecter tous les boutons

```
Audit: Trouvez tous les <Button>, <Link>, et éléments cliquables dans le code ShiftPilot

Créez un tableau:
- Composant/Fichier -> Bouton/Action -> Destination/Route -> Status (✓ ou ✗)

Assurez-vous que CHAQUE bouton a une action fonctionnelle:
- Navigation (router.push ou Link)
- API call avec loading/error handling
- Modal/Dialog ouvert
- Action locale (toggle, etc)

Si manquant: implémentez la fonctionnalité.
```

---

## ✅ PARTIE 4: CHECKLIST SHIFTPILOT

### Phase 1: Foundation ✓ (Déjà fait)
- [x] Structure Next.js App Router
- [x] Authentification (login/signup)
- [x] Middleware protection routes
- [x] Base de données JSON (lib/db.ts)
- [x] API Routes de base
- [x] Components Shadcn/ui
- [x] Landing page avec animations

### Phase 2: Module Employés (À améliorer)
- [x] Liste employés avec recherche/filtres
- [ ] Page détail employé complète
- [ ] Page édition employé
- [ ] Statistiques employé
- [ ] Historique shifts employé
- [ ] API DELETE employé
- [ ] API PUT employé

### Phase 3: Module Plannings (En cours)
- [x] Liste plannings
- [x] Génération IA
- [x] Création manuelle
- [x] Détail planning
- [x] Publication/Dépublication
- [x] Protection plannings publiés
- [ ] Duplication planning
- [ ] Archivage planning
- [ ] Export PDF/iCal/Excel
- [ ] Partage planning
- [ ] Templates planning

### Phase 4: Paramètres (À créer)
- [ ] Page principale settings
- [ ] Profil utilisateur
- [ ] Paramètres entreprise
- [ ] Notifications
- [ ] Sécurité
- [ ] API settings

### Phase 5: Analytics & Rapports (À créer)
- [ ] Dashboard analytics
- [ ] Graphiques statistiques
- [ ] Génération rapports
- [ ] Export rapports
- [ ] API analytics

### Phase 6: Polish & Optimisation
- [ ] Tests unitaires
- [ ] Tests E2E
- [ ] Optimisation performances
- [ ] SEO
- [ ] Documentation API
- [ ] Guide utilisateur

---

## 🚀 TIPS POUR CURSOR + NEXT.JS

### Meilleure approche:

1. **Utilisez des prompts spécifiques par feature** (ne pas tout demander à la fois)

2. **Spécifiez Server vs Client Components**:
   ```
   "Crée un Server Component pour la page principale, 
   et un Client Component pour le formulaire interactif"
   ```

3. **Référencez le code existant**:
   ```
   "Utilise le même pattern que app/api/employees/route.ts 
   pour créer app/api/settings/route.ts"
   ```

4. **Spécifiez les types existants**:
   ```
   "Utilise les types de lib/validations.ts 
   pour la validation du formulaire"
   ```

5. **Testez avec le serveur**:
   ```
   "Le code doit compiler sans erreurs TypeScript,
   et fonctionner avec pnpm dev"
   ```

### Commandes Cursor essentielles:

- `Cmd+K` - Inline edit/generate
- `Cmd+L` - Chat Claude
- `Cmd+Shift+O` - Symbol search
- `@codebase` - Référencer votre codebase
- `@docs` - Importer documentation

### Exemple prompt pour Next.js:

```
Crée une page app/dashboard/analytics/page.tsx pour ShiftPilot:

1. Server Component par défaut
2. Récupère données depuis /api/analytics/stats
3. Client Component pour graphiques Recharts
4. Utilise composants existants: StatsCards, SkeletonCard
5. Design cohérent avec app/dashboard/page.tsx
6. Filtres par période (7j, 30j, 90j)
7. TypeScript strict, validation des données
8. Error handling avec toast
```

---

## 📞 SUPPORT PROMPTING

Si Cursor ne génère pas ce que vous voulez:

1. Ajoutez plus de contexte (@codebase)
2. Donnez des exemples du code existant
3. Spécifiez format/style exact voulu
4. Mentionnez "comme dans [fichier existant]"
5. Divisez en plus petites requêtes

---

## 🎓 RESSOURCES SHIFTPILOT

- Next.js App Router: https://nextjs.org/docs/app
- Shadcn/ui: https://ui.shadcn.com
- Framer Motion: https://www.framer.com/motion
- Zod: https://zod.dev
- Sonner (Toasts): https://sonner.emilkowal.ski

---

**Version adaptée pour Next.js et ShiftPilot** 🚀

