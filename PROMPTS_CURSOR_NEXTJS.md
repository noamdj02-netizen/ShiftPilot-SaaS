# 🎯 PROMPTS À COPIER-COLLER DANS CURSOR (NEXT.JS VERSION)

**Utilisez Cmd+L (ou Cmd+K) pour paster chaque prompt**
**Version adaptée pour Next.js App Router (ShiftPilot)**

---

## PROMPT #1: STRUCTURE ROUTES COMPLÈTE (NEXT.JS)

**Copier tout et paster dans Cursor avec Cmd+L**

```
Je suis en train de construire un SaaS ShiftPilot avec Next.js 14 App Router et TypeScript.

J'ai besoin d'une structure Next.js App Router complète avec TOUTES ces routes:

Routes requises:
- app/dashboard/page.tsx (page d'accueil principale)
- app/dashboard/employees/page.tsx (liste des employés) ✓ EXISTE
- app/dashboard/employees/new/page.tsx (ajouter nouvel employé) ✓ EXISTE
- app/dashboard/employees/[id]/page.tsx (détail employé)
- app/dashboard/employees/[id]/edit/page.tsx (modifier employé)
- app/dashboard/schedules/page.tsx (liste plannings) ✓ EXISTE
- app/dashboard/schedules/[id]/page.tsx (détail planning) ✓ EXISTE
- app/dashboard/schedules/new/page.tsx (nouveau planning manuel)
- app/dashboard/schedules/generate/page.tsx (générer avec IA) ✓ EXISTE
- app/dashboard/settings/page.tsx (page d'accueil paramètres)
- app/dashboard/settings/profile/page.tsx (profil personnel)
- app/dashboard/settings/company/page.tsx (infos entreprise)
- app/dashboard/settings/notifications/page.tsx (notifications prefs)
- app/dashboard/settings/security/page.tsx (sécurité)
- app/dashboard/analytics/page.tsx (statistiques)
- app/dashboard/reports/page.tsx (rapports)

Crée:
1. app/dashboard/layout.tsx - Layout principal avec Sidebar navigation
2. components/dashboard/sidebar.tsx - Navigation latérale avec menus (réutilise existant si possible)
3. components/dashboard/header.tsx - Header avec user menu (réutilise existant si possible)
4. middleware.ts - Protection des routes /dashboard/* (✓ EXISTE, vérifier si complet)

Design:
- Utilise Next.js App Router (pas React Router)
- Server Components par défaut, Client Components pour interactions
- Navigation responsive (sidebar collapse sur mobile)
- Active link highlighting
- Transitions fluides avec Framer Motion
- Icons Lucide pour chaque menu item
- Tailwind CSS exclusivement

Architecture:
- Server Components pour pages statiques
- Client Components pour formulaires et interactions
- API Routes dans app/api/ (✓ EXISTE)
- Utilise lib/db.ts pour données (✓ EXISTE)

Code:
- TypeScript strict
- Pas d'any
- Composants réutilisables
- Commentaires clairs

Référence le code existant (@codebase) pour maintenir la cohérence avec ShiftPilot.

Génère du code production-ready que je peux utiliser immédiatement.
```

---

## PROMPT #2: MODULE ÉQUIPE COMPLET (NEXT.JS VERSION)

**C'est votre principal module - copiez tout exactement**

```
Je veux améliorer le MODULE ÉQUIPE ShiftPilot existant pour Next.js App Router.

Code existant à améliorer:
- app/dashboard/employees/page.tsx ✓
- components/employees/employee-list.tsx ✓
- components/employees/add-employee-form.tsx ✓
- app/api/employees/route.ts ✓

Crée/Améliore avec:

1️⃣ Page DÉTAIL app/dashboard/employees/[id]/page.tsx
   - Affiche toutes les infos employé (nom, email, rôle, téléphone, etc)
   - Statistiques employé: heures travaillées (derniers mois), shifts planifiés
   - Graphique heures travaillées (Recharts)
   - Liste des plannings où l'employé est assigné
   - Historique des modifications
   - Actions: Éditer, Archiver, Supprimer (avec confirmations)
   - Loading: Skeleton pendant chargement

2️⃣ Page ÉDITION app/dashboard/employees/[id]/edit/page.tsx
   - Formulaire pré-rempli avec données actuelles
   - Utilise components/employees/add-employee-form.tsx comme base
   - Champs: Nom, Email, Rôle (dropdown), Téléphone, Date Embauche, Taux horaire, etc
   - Validation Zod (utilise lib/validations.ts ✓)
   - Upload Avatar (avec preview) - optionnel
   - Boutons: Sauvegarder, Annuler, Supprimer (avec confirmation)
   - Messages toast succès/erreur (utilise sonner ✓)
   - Loading state pendant save

3️⃣ API Routes améliorées
   - app/api/employees/[id]/route.ts (GET, PUT, DELETE)
     * GET: Récupère détails employé
     * PUT: Met à jour employé (validation Zod)
     * DELETE: Supprime employé (avec vérifications)
   - app/api/employees/[id]/stats/route.ts (GET)
     * Retourne statistiques employé (heures, shifts, coûts)

4️⃣ Composants à créer
   - components/employees/employee-stats.tsx (statistiques avec graphiques)
   - components/employees/employee-schedule-list.tsx (liste plannings)
   - components/employees/availability-calendar.tsx (calendrier disponibilité)
   - components/employees/employee-form.tsx (formulaire réutilisable)

5️⃣ Améliorer components/employees/employee-list.tsx
   - Ajouter tri par colonne
   - Ajouter pagination (50 par page)
   - Ajouter export CSV/Excel
   - Bulk actions (sélection multiple)
   - Recherche améliorée (téléphone, rôle)

Backend:
- Utilise app/api/employees/route.ts existant (GET, POST) ✓
- Crée app/api/employees/[id]/route.ts (GET, PUT, DELETE)
- Utilise lib/db.ts pour données persistantes ✓
- Utilise lib/validations.ts pour validation ✓
- Utilise lib/api-utils.ts pour responses ✓

Design:
- Tailwind CSS cohérent avec le reste
- Shadcn/ui components (utilise les composants existants)
- Animations Framer Motion (comme le reste de l'app)
- Icons: Lucide (Search, Edit, Trash2, Plus, etc)
- Responsive: Fonctionne sur mobile
- Skeleton loading (utilise components/animations/skeleton-loader.tsx ✓)
- Empty states
- Toast notifications (utilise sonner ✓)

Code Quality:
- TypeScript strict, zéro `any`
- Server Components par défaut, Client Components pour formulaires
- Validation Zod complète
- Error handling avec lib/api-utils.ts
- Commentaires sur logique complexe
- Export de chaque composant

Référence le code existant (@codebase) pour maintenir la cohérence.

Donne-moi le code complet, fonctionnel, que je peux copier-coller et qui marche immédiatement.
```

---

## PROMPT #3: FORMULAIRES & VALIDATION (NEXT.JS)

**Pour tous vos formulaires d'ajout/édition**

```
Améliore le système de formulaires existant pour ShiftPilot avec validation TypeScript/Zod.

Code existant:
- components/employees/add-employee-form.tsx ✓
- components/schedules/manual-schedule-form.tsx ✓
- lib/validations.ts ✓ (utilise Zod)
- components/auth/login-form.tsx ✓
- components/auth/signup-form.tsx ✓

Crée composants réutilisables:

1. components/forms/form-field.tsx (composant réutilisable)
   - Wrapper pour Input de Shadcn/ui
   - Supporte: text, email, password, tel, number
   - Validation messages affichées
   - Required indicator (asterisk)
   - Disabled state
   - Loading state

2. components/forms/form-select.tsx
   - Wrapper pour Select de Shadcn/ui
   - Options dynamiques
   - Validation messages

3. components/forms/form-textarea.tsx
   - Wrapper pour Textarea de Shadcn/ui
   - Validation messages

4. Hook useForm.ts (amélioration)
   - Gestion état formulaire
   - Validation Zod en temps réel
   - onSubmit handling
   - Reset formulaire
   - Error display
   - Loading state

Usage exemple avec Zod:
```
import { employeeSchema } from '@/lib/validations';

const { register, handleSubmit, errors, isSubmitting } = useForm({
  schema: employeeSchema,
  onSubmit: async (data) => {
    await fetch('/api/employees', { method: 'POST', body: JSON.stringify(data) });
  }
});
```

Validation:
- Utilise lib/validations.ts (Zod schemas) ✓
- Required, Email format, Min/max length
- Pattern (regex)
- Custom validators

Design:
- Tailwind CSS (cohérent avec Shadcn/ui)
- Clear error messages (rouge, en dessous du champ)
- Success indicators
- Loading states (bouton disabled pendant submit)
- Responsive

Code:
- TypeScript strict
- Intègre avec Zod schemas existants
- Réutilisable partout
- Production-ready
```

---

## PROMPT #4: SETTINGS COMPLETS (NEXT.JS)

**Section paramètres de votre SaaS**

```
Crée une section /settings complète pour ShiftPilot avec Next.js App Router:

Pages à créer:

1. app/dashboard/settings/layout.tsx
   - Layout avec sidebar navigation
   - Navigation latérale: Profile, Entreprise, Notifications, Sécurité

2. app/dashboard/settings/page.tsx (Overview)
   - Affiche infos personnelles et entreprise en résumé
   - Liens rapides vers chaque section

3. app/dashboard/settings/profile/page.tsx
   - Photo profil (upload)
   - Nom, Email, Téléphone
   - Bio/Description
   - Préférences langue (FR/EN)
   - Changer mot de passe (avec confirmation)
   - 2FA activation (toggle - préparation futur)
   - Sessions actives (liste - préparation futur)
   - Bouton "Sign out everywhere"

4. app/dashboard/settings/company/page.tsx
   - Logo entreprise (upload)
   - Nom restaurant (utilise companyName de user)
   - Secteur, Adresse, Ville, Pays
   - Fuseau horaire (timezone)
   - Téléphone, Email
   - Site web
   - Horaires ouverture (lun-dim)

5. app/dashboard/settings/notifications/page.tsx
   - Email prefs: Rapports, Alertes shifts, Changements planning, Marketing
   - Notifications in-app: toggles par type
   - Webhooks: Ajouter/supprimer (préparation futur)
   - Digest: Quotidien, Hebdo, Mensuel

6. app/dashboard/settings/security/page.tsx
   - Changer mot de passe
   - Active sessions (logout - préparation futur)
   - Deux facteurs activation (préparation futur)
   - API keys (create/revoke - préparation futur)
   - Activity log (dernier 30 jours - préparation futur)

API Routes à créer:
- app/api/settings/profile/route.ts (GET, PUT)
- app/api/settings/company/route.ts (GET, PUT)
- app/api/settings/notifications/route.ts (GET, PUT)
- app/api/settings/security/route.ts (GET, PUT)

Backend:
- Utilise lib/db.ts pour données persistantes ✓
- Utilise lib/validations.ts pour validation ✓
- Utilise lib/auth.ts pour auth ✓
- Utilise requireAuth() pour protection ✓

Design:
- Sidebar navigation (fixed left)
- Main content (right)
- Cards pour sections (Shadcn/ui Card)
- Toggle switches (Shadcn/ui Switch)
- Confirmation modals (Shadcn/ui AlertDialog)
- Auto-save avec indicator "Saving..." puis "Saved ✓"

Comportement:
- Les changements se sauvegardent automatiquement (ou bouton Save)
- Indication visuelle "Saving..." puis "Saved ✓"
- Toast for errors (sonner ✓)
- Confirmation pour actions critiques
- Loading states

Code:
- Server Components par défaut
- Client Components pour formulaires
- TypeScript strict
- Tailwind design cohérent avec le reste
- Utilise Shadcn/ui components
- Production-ready
```

---

## PROMPT #5: ANALYTICS & RAPPORTS (NEXT.JS)

**Page statistiques et graphiques**

```
Crée des pages Analytics et Rapports pour ShiftPilot:

Pages à créer:

1. app/dashboard/analytics/page.tsx - Dashboard Analytics
   - Top Metrics (Cartes avec composant existant StatsCards ✓):
     * Total employés actifs
     * Heures planifiées cette semaine
     * Coût total de main-d'œuvre
     * Nombre de shifts planifiés
   - Graphiques avec Recharts:
     * Heures travaillées par employé (bar chart)
     * Coûts de main-d'œuvre par semaine (line chart)
     * Répartition des shifts par rôle (pie chart)
     * Taux d'occupation par jour (area chart)
   - Filtres par période (7j, 30j, 90d, custom)
   - Export CSV/Excel

2. app/dashboard/reports/page.tsx - Rapports
   - Génération rapports:
     * Rapport heures par employé (PDF)
     * Rapport coûts par période (PDF)
     * Rapport disponibilité (PDF)
   - Historique rapports générés
   - Export CSV/Excel
   - Envoi automatique par email (préparation futur)

Composants à créer:
- components/analytics/stats-cards.tsx (réutilise existant ou améliore)
- components/analytics/hours-chart.tsx (graphique heures - Recharts)
- components/analytics/costs-chart.tsx (graphique coûts - Recharts)
- components/analytics/role-distribution.tsx (pie chart - Recharts)
- components/reports/report-generator.tsx (générateur rapports)
- components/reports/report-history.tsx (historique rapports)

API Routes à créer:
- app/api/analytics/stats/route.ts (GET statistiques)
- app/api/analytics/charts/route.ts (GET données graphiques)
- app/api/reports/generate/route.ts (POST générer rapport)
- app/api/reports/history/route.ts (GET historique)

Backend:
- Utilise lib/db.ts pour données (schedules, employees) ✓
- Calcule statistiques à partir des données existantes
- Retourne données formatées pour graphiques

Design:
- Dashboard style, grids (Tailwind)
- Colors cohérents avec le reste de l'app
- Responsive
- Mobile: Stack vertically
- Loading skeletons (utilise components/animations/skeleton-loader.tsx ✓)

Libraries:
- Recharts pour graphiques (installer si besoin)
- react-pdf pour PDF generation (installer si besoin)
- Icons Lucide
- Tailwind CSS

Code:
- Server Components pour pages
- Client Components pour graphiques (Recharts)
- TypeScript strict
- Données calculées depuis db existante
- Reusable chart components
- Performance optimized

Installe les dépendances nécessaires: recharts, jspdf (ou react-pdf)
```

---

## PROMPT #6: CONNECT BUTTONS À DES ACTIONS (NEXT.JS)

**Pour relier tous vos boutons existants**

```
Je dois relier tous les boutons de ShiftPilot à des vraies actions.

Audit complète:

1. Trouvez TOUS les <button>, <Link>, <a> elements dans:
   - app/dashboard/page.tsx
   - components/dashboard/*.tsx
   - components/employees/*.tsx
   - components/schedules/*.tsx
   - app/page.tsx (landing page)

2. Pour chaque bouton, dites-moi:
   - Le texte/label du bouton
   - Où il est actuellement (fichier, ligne)
   - Où il devrait aller (route/action)
   - Quel type d'action (navigate, modal, API call, etc)
   - Status: ✓ Fonctionne ou ✗ Manquant

3. Crée un tableau:
| Button Text | Location | Action Type | Target Route/Function | Status |
|---|---|---|---|---|
| "Voir" | employee-list.tsx | Navigate | /dashboard/employees/[id] | ✗ |
| "Ajouter employé" | employees/page.tsx | Navigate | /dashboard/employees/new | ✓ |
| "Modifier" | schedule-list.tsx | Navigate | /dashboard/schedules/[id]/edit | ✗ |
| "Publier" | schedule-detail.tsx | API call | POST /api/schedules/[id]/publish | ✓ |

4. Implémente CHAQUE bouton manquant:
   - Ajoute navigation (useRouter().push ou Link)
   - Crée routes manquantes si besoin
   - Connecte à API avec error handling
   - Ajoute loading states
   - Ajoute toast notifications

5. Test:
   - Chaque bouton fonctionne
   - Transitions fluides (Framer Motion)
   - Pas d'erreurs console
   - Toast notifications appropriées

Utilise Next.js App Router (Link, useRouter) au lieu de React Router.
Référence le code existant (@codebase) pour maintenir les patterns.

Fais du code qui marche immédiatement.
```

---

## PROMPT #7: NOTIFICATION & TOAST SYSTEM (DÉJÀ IMPLÉMENTÉ)

**Messages de feedback utilisateur**

```
Vérifie que le système Toast ShiftPilot est complet:

Code existant à vérifier:
- components/ui/sonner.tsx ✓
- app/layout.tsx (Toaster intégré) ✓
- Utilisation de toast dans components ✓

Vérifie:
1. Toast fonctionne partout dans l'app
2. Types: success, error, info, warning
3. Auto-dismiss après 4 secondes
4. Bouton close manuel
5. Max toasts affichés simultanément
6. Animations fluides

Si manquant, améliore:
- Ajoute toast dans toutes les actions critiques
- Uniformise les messages
- Ajoute loading states avant toast
- Gère erreurs avec toast.error()

Utilise sonner (déjà installé et configuré ✓).
```

---

## PROMPT #8: LOADING STATES & SKELETONS (PARTIELLEMENT IMPLÉMENTÉ)

**Pour les états de chargement**

```
Vérifie et complète le système de loading pour ShiftPilot:

Code existant à vérifier:
- components/animations/skeleton-loader.tsx ✓
- SkeletonCard utilisé dans certaines pages ✓

Vérifie que TOUTES les pages ont:
1. Loading state pendant data fetch
2. Skeleton loader approprié
3. Error state avec retry button
4. Empty state avec message

Si manquant, crée/améliore:
- components/animations/table-skeleton.tsx (skeleton pour tableau)
- components/animations/form-skeleton.tsx (skeleton pour formulaire)
- LoadingSpinner.tsx (spinner au centre si besoin)

Utilise les composants existants:
- SkeletonCard de components/animations/skeleton-loader.tsx ✓
- Patterns existants

Assure-toi que chaque page affiche un skeleton pendant le chargement initial.
```

---

## PROMPT #9: ERROR HANDLING & BOUNDARIES (NEXT.JS)

**Gestion des erreurs**

```
Crée error handling complet pour ShiftPilot:

1. app/error.tsx (Next.js Error Boundary global)
   - Affiche fallback UI si crash
   - Log errors
   - Bouton "Try again" ou "Go home"

2. app/not-found.tsx (404 page)
   - Page d'erreur 404 personnalisée
   - Design cohérent avec l'app
   - Bouton retour dashboard

3. Hook useApiError.ts (si besoin)
   - Standardise error messages
   - Catch API errors, show toast
   - Error logging

4. Améliorer error handling existant:
   - Vérifie try/catch dans toutes les API routes
   - Vérifie error handling dans tous les composants
   - Utilise lib/api-utils.ts (createErrorResponse) ✓

5. Validation errors
   - Form validation errors (affichées inline)
   - Utilise Zod errors de lib/validations.ts ✓
   - Messages clairs pour utilisateur

6. Logging
   - Console errors + timestamps
   - Stack traces en dev
   - User-friendly messages en production

Code:
- TypeScript strict
- Try/catch partout
- Graceful degradation
- User-friendly messages
- Utilise patterns existants de lib/api-utils.ts
```

---

## PROMPT #10: OPTIMISATION & POLISH (NEXT.JS)

**Dernières améliorations**

```
Optimise et finalise ShiftPilot:

1. Performance
   - Vérifie Server Components partout où possible
   - Lazy loading pour heavy components
   - Image optimization (next/image)
   - Code splitting

2. SEO
   - Metadata pour chaque page (title, description)
   - Open Graph tags
   - Structured data si pertinent

3. Accessibilité
   - ARIA labels
   - Keyboard navigation
   - Focus management
   - Color contrast

4. Responsive
   - Teste sur mobile (tous breakpoints)
   - Navigation mobile optimisée
   - Tables scrollable sur mobile

5. Documentation
   - README mis à jour
   - Commentaires dans code complexe
   - Types TypeScript complets

6. Tests (basiques)
   - Vérifie que tout compile (pnpm build)
   - Teste manuellement les flows principaux
   - Pas d'erreurs console

Utilise les outils Next.js:
- next/image pour images
- next/link pour navigation
- Metadata API pour SEO

Référence le code existant pour maintenir la cohérence.
```

---

## UTILISATION FINALE

**Order recommandé pour ShiftPilot:**

1. ✅ **Déjà fait**: Routes de base, Auth, Employés de base, Plannings
2. **Prompt #2**: Améliorer module Équipe (détail, édition, stats)
3. **Prompt #4**: Créer Settings complets
4. **Prompt #5**: Créer Analytics & Rapports
5. **Prompt #6**: Connecter tous les boutons manquants
6. **Prompt #7**: Vérifier Toasts partout
7. **Prompt #8**: Vérifier Loading states partout
8. **Prompt #9**: Améliorer Error handling
9. **Prompt #10**: Optimisation finale

**Tips:**
- Paster UN prompt à la fois dans Cursor Cmd+L
- Utilisez @codebase après le premier prompt pour contexte
- Attendez réponse complète avant prochain
- Testez chaque fonctionnalité avec `pnpm dev`
- Utilisez les composants existants (Shadcn/ui, Framer Motion, etc)
- Maintenez la cohérence avec le code existant

**Architecture Next.js:**
- Server Components par défaut
- Client Components seulement pour interactions
- API Routes dans app/api/
- Utilise lib/db.ts pour données persistantes
- Validation avec Zod (lib/validations.ts)

Bonne chance! 🚀

