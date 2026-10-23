import admin from "firebase-admin"

const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

function getFirebaseApp() {
  if (!projectId || !clientEmail || !privateKey) {
    return null
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })
  }

  return admin.app()
}

export function getDb() {
  const app = getFirebaseApp()
  if (!app) {
    return null
  }

  return admin.firestore(app)
}

export function getServerTimestamp() {
  return admin.firestore.FieldValue.serverTimestamp()
}
