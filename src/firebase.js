import { initializeApp } from 'firebase/app'
import { getFirestore }  from 'firebase/firestore'

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO SET UP FIREBASE:
//
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (or select an existing one)
// 3. Click "Project Settings" (gear icon) → "Your apps" → Add a Web App
// 4. Copy the config object Firebase gives you and paste the values below
// 5. In Firestore → Rules, set:
//      rules_version = '2';
//      service cloud.firestore {
//        match /databases/{database}/documents {
//          match /deals/{id} {
//            allow read: if true;
//            allow write: if true;   // tighten later with Auth
//          }
//        }
//      }
// ─────────────────────────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey:            "REPLACE_WITH_YOUR_API_KEY",
  authDomain:        "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId:         "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket:     "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId:             "REPLACE_WITH_YOUR_APP_ID",
}

// True only when all placeholder values have been replaced
export const isFirebaseReady =
  !firebaseConfig.apiKey.startsWith('REPLACE_WITH') &&
  firebaseConfig.projectId.length > 0

let db = null

if (isFirebaseReady) {
  try {
    const app = initializeApp(firebaseConfig)
    db = getFirestore(app)
  } catch (e) {
    console.warn('[DropPrice] Firebase init failed:', e.message)
  }
}

export { db }
