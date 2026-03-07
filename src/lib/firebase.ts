import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const hasFirebaseConfiguration = Object.values(firebaseConfig).every(
  (configValue) => Boolean(configValue),
);

const firebaseApp = hasFirebaseConfiguration
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const firestoreDatabase = firebaseApp ? getFirestore(firebaseApp) : null;
export const firebaseAuthentication = firebaseApp ? getAuth(firebaseApp) : null;

export async function ensureFirebaseAnonymousSessionIsActive(): Promise<void> {
  if (!firebaseAuthentication) {
    throw new Error("Firebase is not configured. Please add Firebase env values.");
  }

  if (firebaseAuthentication.currentUser) {
    return;
  }

  try {
    await signInAnonymously(firebaseAuthentication);
  } catch {
    throw new Error(
      "Unable to authenticate with Firebase. Enable Anonymous Authentication in Firebase Console or update Firestore rules.",
    );
  }
}

