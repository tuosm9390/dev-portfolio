// geul 기능에서 사용하는 Firebase 앱과 Firestore/Auth 인스턴스를 준비한다
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
};

function getFirebaseConfig(): FirebaseConfig | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  if (!apiKey || !authDomain || !projectId || !appId) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId,
  };
}

export function getGeulFirebaseApp(): FirebaseApp | null {
  const config = getFirebaseConfig();

  if (!config) {
    return null;
  }

  return getApps().length > 0 ? getApp() : initializeApp(config);
}

export function getGeulFirestore(): Firestore | null {
  const app = getGeulFirebaseApp();
  return app ? getFirestore(app) : null;
}

export function getGeulAuth(): Auth | null {
  const app = getGeulFirebaseApp();
  return app ? getAuth(app) : null;
}

export function getAllowedGeulAuthorEmail() {
  return process.env.NEXT_PUBLIC_GEUL_AUTHOR_EMAIL ?? "tuosm123@gmail.com";
}
