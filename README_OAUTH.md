# 🔐 Configuration OAuth (Google & Apple)

## Configuration Google OAuth

### 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API "Google+ API" ou "Google Identity"
4. Allez dans "Credentials" → "Create Credentials" → "OAuth client ID"
5. Sélectionnez "Web application"
6. Ajoutez les URIs de redirection :
   - `http://localhost:3000/api/auth/google/callback` (développement)
   - `https://votre-domaine.com/api/auth/google/callback` (production)
7. Copiez le `Client ID` et le `Client Secret`

### 2. Variables d'environnement

Ajoutez dans votre fichier `.env.local` :

```env
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

### 3. Production

Pour la production, mettez à jour :
```env
GOOGLE_REDIRECT_URI=https://votre-domaine.com/api/auth/google/callback
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

## Configuration Apple Sign In

### 1. Créer un identifiant Apple

1. Allez sur [Apple Developer](https://developer.apple.com/)
2. Créez un "Services ID" dans "Identifiers"
3. Activez "Sign In with Apple"
4. Configurez les domaines et redirections
5. Créez une "Key" pour Sign in with Apple
6. Téléchargez le fichier `.p8` de la clé

### 2. Variables d'environnement

```env
APPLE_CLIENT_ID=your_apple_service_id
APPLE_TEAM_ID=your_team_id
APPLE_KEY_ID=your_key_id
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
APPLE_REDIRECT_URI=http://localhost:3000/api/auth/apple/callback
```

## Mode développement

En mode développement (sans configuration), l'OAuth est simulé :
- Google : crée/utilise un utilisateur test@google.com
- Apple : crée/utilise un utilisateur test@apple.com

## Utilisation

Les boutons OAuth dans les formulaires de connexion/inscription redirigent automatiquement vers les routes OAuth.

### Routes disponibles

- `GET /api/auth/google` - Initie la connexion Google
- `GET /api/auth/google/callback` - Callback Google
- `GET /api/auth/apple` - Initie la connexion Apple
- `POST /api/auth/apple/callback` - Callback Apple (POST uniquement)

## Sécurité

- State parameter pour prévenir les attaques CSRF
- Cookies sécurisés (httpOnly, secure en production)
- Rate limiting sur toutes les routes OAuth
- Validation des tokens et informations utilisateur

