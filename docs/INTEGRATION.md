Firebase and EmailJS Integration
===============================

This document explains how to configure Firebase, EmailJS and environment variables for the portfolio project.

1) Install packages

Run in your project root:

```
npm install @emailjs/browser firebase
```

2) Environment variables (Next.js)

Create a `.env.local` in the project root with these entries (replace placeholders):

```
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=portfolio-d5b59.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=portfolio-d5b59
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=portfolio-d5b59.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1039315786286
NEXT_PUBLIC_FIREBASE_APP_ID=1:1039315786286:web:b48cf218365cfe9e4cddb
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-G4YF3ZVNDJ

NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_r4l1kgt
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=YOUR_TEMPLATE_ID
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=YOUR_EMAILJS_PUBLIC_KEY

MAIL_TO=you@yourdomain.com
MAIL_FROM=no-reply@yourdomain.com

// Optional SMTP envs (existing server-side contact API)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

3) EmailJS setup

- Sign up at https://www.emailjs.com/
- Add an email service (Gmail, etc.) and copy your `SERVICE_ID` (or use `service_r4l1kgt` if already provided).
- Create an email template and include variables: `{{name}}`, `{{email}}`, `{{message}}` — copy the `TEMPLATE_ID`.
- Get your `PUBLIC_KEY` from EmailJS (User dashboard → Integration) and add it to `.env.local`.

4) Firebase setup

- Go to https://console.firebase.google.com/, create a project (or use existing `portfolio-d5b59`).
- In Project Settings → General → Add Web App and copy the config values into your `.env.local` variables above.
- If you want to use Firestore, enable Firestore in Firebase Console (Database → Create database).

5) Deployment (Firebase Hosting)

- Install Firebase CLI: `npm install -g firebase-tools`
- Login: `firebase login`
- Initialize hosting in your project root: `firebase init hosting` and follow prompts.
- Build your Next.js app for production and deploy according to Firebase Hosting + Next.js adapter recommendations (or use Vercel for easiest deploy).

Notes
- The client-side EmailJS integration (in `src/services/emailService.ts`) sends email immediately from the browser using EmailJS.
- The existing server API (`/api/contact`) still persists messages via your server-side Firebase Admin implementation; the contact form will call both services: EmailJS (deliver to Gmail) and the server backend (persist in Firestore).
- Keep your `.env.local` out of source control and never expose the private keys.
