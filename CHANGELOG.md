# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

## [1.0.0] - 2025-01-22

### ✨ Ajouté

#### PWA (Progressive Web App)
- Manifest.json pour installation mobile
- Service Worker avec cache stratégique
- Mode hors ligne pour consultation des plannings
- Composant PWAInstaller pour promouvoir l'installation
- Support iOS et Android

#### Notifications Push
- Service Worker pour notifications push
- API `/api/push/subscribe` pour s'abonner
- API `/api/push/send` pour envoyer des notifications
- API `/api/push/vapid-public-key` pour les clés VAPID
- Composant PushNotificationManager pour activer/désactiver
- Notifications pour : nouveaux plannings, modifications, échanges de shifts, congés

#### Recherche Globale
- Command Palette avec raccourci Cmd+K / Ctrl+K
- Recherche dans : employés, plannings, actions rapides
- Navigation rapide vers toutes les pages
- Filtres et suggestions intelligentes

#### Dashboard Temps Réel
- API `/api/realtime/stats` pour statistiques live
- Composant RealtimeStats avec rafraîchissement automatique (30s)
- Métriques en temps réel : employés actifs, shifts du jour, heures travaillées
- Badge de dernière mise à jour

#### Dashboard Employé Complet
- Vue d'ensemble avec statistiques personnelles
- Planning de la semaine avec vue calendrier
- Liste des prochains shifts
- Gestion des demandes de congés
- Onglets : Semaine, À venir, Congés, Statistiques
- Calcul automatique des heures travaillées

#### Système de Génération d'Identifiants
- Composant GenerateCredentials pour créer des comptes employés
- API `/api/employees/[id]/credentials` pour générer email/mot de passe
- Envoi automatique par email avec template personnalisé
- Badge "Identifiants activés" dans la liste des employés

#### Authentification Employé
- Pages dédiées : `/employee/login` et `/employee`
- API `/api/auth/employee/login` avec sessions sécurisées
- API `/api/auth/employee/me` pour récupérer les données
- API `/api/auth/employee/logout` pour déconnexion
- Middleware protégeant les routes `/employee/*`
- Compte de test : `employe@test.com` / `test1234`

#### Documentation GitHub
- README.md complet avec installation et utilisation
- LICENSE MIT
- CONTRIBUTING.md pour les contributeurs
- DEPLOYMENT.md avec guide Vercel/Netlify/Railway
- IMPROVEMENTS_ROADMAP.md avec 25 fonctionnalités proposées
- GITHUB_SETUP.md pour configurer le repository
- .gitignore optimisé
- GitHub Actions workflow pour déploiement automatique

### 🔧 Amélioré

- **Page Signup** : Correction des couleurs de texte pour meilleure lisibilité
- **Service Worker** : Amélioration du cache et gestion des notifications
- **Layout** : Intégration PWA et Command Palette globalement
- **Dashboard** : Intégration des statistiques temps réel

### 🐛 Corrigé

- Erreur `Button is not defined` dans les pages login/signup
- Erreur `Loader2` manquant dans la page employé
- Couleurs de texte invisibles sur la page signup

### 📝 Documentation

- README.md avec toutes les fonctionnalités
- Guide d'installation complet
- Guide de déploiement
- Roadmap d'améliorations

---

## Format

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

