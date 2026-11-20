# CareerForge AI

CareerForge AI is an advanced career preparation platform featuring resume creation and ATS scoring, AI-powered interview practice, aptitude test preparation, and a centralized administrative management module.

## Technology Stack

- **Backend**: Node.js, Express 5, MongoDB Atlas (Mongoose 9), JWT Authentication, Bcrypt.js, Google Gemini API
- **Frontend**: React 19, Vite, React Router v7, TailwindCSS v4, Lucide React, Framer Motion
- **Testing**: Native Node.js test runner (`node --test`)

## Key Modules

- **User Accounts & Profiles**: JWT-based authentication, Google OAuth integration, role-based authorization (`user` and `admin`), account status management (`active` and `suspended`).
- **Resume Builder & Management**: Multiple template formats, real-time preview, ATS heuristic score calculation, and PDF export.
- **AI Interview Practice**: Role-specific, technical, and behavioral interview session generation with rubric-backed feedback and daily credit allowances.
- **Aptitude Practice**: Quantitative, logical reasoning, and verbal aptitude tests with mathematical verification, scoring, and performance analytics.
- **Admin Module**: Production-grade administrative portal with real-time aggregate metrics, user search and status/role management, curated question bank management, aggregate reporting, immutable security audit logs, and app-level settings.

## Quick Start

### 1. Backend Server Setup

```bash
cd server
npm install
npm run dev
```

Run test suite:
```bash
npm test
```

### 2. Frontend Client Setup

```bash
cd client
npm install
npm run dev
```

Build for production:
```bash
npm run build
```

## Email Delivery, Password Reset & Login OTP Setup

CareerForge-AI delivers transactional emails for:
1. **Email OTP Login (Two-Factor Authentication)**: Cryptographically secure, 6-digit single-use codes (10-minute expiry) required before any session token or dashboard access is granted.
2. **Password Reset Requests**: Time-limited (15 minutes), single-use secure reset links.
3. **Google Sign-In Welcome**: New user registration with assigned unique Account ID (`CF-XXXX-XXXX`).

### SMTP Configuration

Configure your email transport in `server/.env`:

#### Option 1: Gmail (Recommended for Personal Accounts)
1. Turn on **2-Step Verification** in your Google Account: [myaccount.google.com/security](https://myaccount.google.com/security).
2. Generate a 16-character **App Password**: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
   - Enter App name: `CareerForge-AI`.
   - Click **Create** and copy the 16-character code (e.g., `abcd efgh ijkl mnop`).
   - *Note: Your regular Google password will be rejected by Google SMTP with `EAUTH` error!*
3. Add the following to `server/.env`:
   ```env
   SMTP_SERVICE=gmail
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_16_character_app_password
   CLIENT_URL=http://localhost:5173
   ```

#### Option 2: Custom / Enterprise SMTP (Mailtrap, SendGrid, Amazon SES, Brevo)
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_SECURE=false
FROM_EMAIL="CareerForge-AI" <no-reply@careerforge.ai>
CLIENT_URL=http://localhost:5173
```

### Rate Limiting & Cooldown Protection
- **Cooldown**: 60 seconds between successful requests per recipient email / client IP to prevent spamming.
- **Sliding Window**: Maximum 5 reset requests per 15-minute window.
- **Anti-Enumeration**: Consistent success message returned whether an account exists or not.
- **Fail-Safe Rollback**: If email delivery fails, the pending reset token is immediately rolled back in the database, allowing instant retry once credentials are corrected.

### Troubleshooting Email Issues
- **Form says "Unable to send password reset email"**: Check the server terminal. If `SMTP_USER` and `SMTP_PASS` are empty, Nodemailer logs a warning indicating missing credentials.
- **Error code `EAUTH`**: Google rejected the password. Ensure you are using a 16-character Google App Password, NOT your personal account password.
- **Link directs to wrong host**: Ensure `CLIENT_URL` or `FRONTEND_URL` in `server/.env` matches your deployed client domain.

## Admin Bootstrap

To safely provision your initial administrator account:

```bash
cd server
npm run bootstrap-admin -- your_email@careerforge.ai
```

See [ADMIN_DOCUMENTATION.md](file:///d:/workspace0/CareerForge-AI/ADMIN_DOCUMENTATION.md) for detailed administrative API specifications, security policies, and architectural documentation.
