# 📧 Système de Notifications Email/SMS

## Configuration

### 1. Variables d'environnement

Ajoutez dans votre fichier `.env.local` :

#### Email (Resend - Recommandé)
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=ShiftPilot <noreply@votre-domaine.com>
```

#### Email Alternative (SMTP)
```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
EMAIL_FROM=ShiftPilot <noreply@votre-domaine.com>
```

#### SMS (Twilio - Recommandé)
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### 2. Installation des dépendances

```bash
# Pour Resend (email)
npm install resend

# Pour Twilio (SMS)
npm install twilio

# Pour SMTP (email alternatif)
npm install nodemailer
```

## Utilisation

### Envoyer une notification lors de la publication d'un planning

Les notifications sont automatiquement envoyées quand un planning est publié via `/api/schedules/[id]/publish`.

### Tester les notifications

```bash
curl -X POST http://localhost:3000/api/notifications/test \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email",
    "to": "test@example.com",
    "template": "schedulePublished"
  }'
```

### Gérer les préférences de notification d'un employé

```bash
# GET - Récupérer les préférences
GET /api/employees/[id]/notifications

# PUT - Mettre à jour les préférences
PUT /api/employees/[id]/notifications
{
  "emailEnabled": true,
  "smsEnabled": false
}
```

## Templates disponibles

### Email Templates
- `schedulePublished` - Planning publié
- `scheduleUpdated` - Planning modifié
- `welcome` - Message de bienvenue

### SMS Templates
- `schedulePublished` - Planning publié
- `scheduleUpdated` - Planning modifié
- `welcome` - Message de bienvenue

## Mode développement

En mode développement (sans configuration), les notifications sont loggées dans la console :
- 📧 Email (DEV MODE): { to, subject }
- 📱 SMS (DEV MODE): { to, message }

