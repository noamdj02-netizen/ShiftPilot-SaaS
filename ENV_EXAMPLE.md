# 📄 Variables d'Environnement - ShiftPilot

Créez un fichier `.env.local` à la racine du projet avec ces variables :

```env
# ============================================
# APPLICATION
# ============================================
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ShiftPilot

# ============================================
# AUTHENTICATION
# ============================================
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# ============================================
# OAUTH - GOOGLE
# ============================================
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# ============================================
# OAUTH - APPLE
# ============================================
APPLE_CLIENT_ID=your-apple-client-id-here
APPLE_TEAM_ID=your-apple-team-id-here
APPLE_KEY_ID=your-apple-key-id-here
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
APPLE_REDIRECT_URI=http://localhost:3000/api/auth/apple/callback

# ============================================
# EMAIL - RESEND (Recommandé)
# ============================================
RESEND_API_KEY=your-resend-api-key-here
EMAIL_FROM=ShiftPilot <noreply@shiftpilot.com>

# ============================================
# EMAIL - SMTP (Alternative)
# ============================================
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-smtp-user
# SMTP_PASSWORD=your-smtp-password

# ============================================
# SMS - TWILIO (Recommandé)
# ============================================
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# ============================================
# PUSH NOTIFICATIONS - VAPID
# ============================================
# Générer avec: npx web-push generate-vapid-keys
VAPID_PUBLIC_KEY=your-vapid-public-key-here
VAPID_PRIVATE_KEY=your-vapid-private-key-here

# ============================================
# DATABASE (Future migration)
# ============================================
# DATABASE_URL=postgresql://user:password@localhost:5432/shiftpilot
```

## 🔑 Génération des clés

### NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

### VAPID Keys
```bash
npx web-push generate-vapid-keys
```

