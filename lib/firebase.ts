import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ------------------------------------------------------------------
// CONFIGURATION: SMILEFREE ORTHODONTICS
// ------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyBcTng7zb9dvg-gKLF4ABDT8jE6MVGnyM4",
  authDomain: "smilefree-orthodontics.firebaseapp.com",
  projectId: "smilefree-orthodontics",
  storageBucket: "smilefree-orthodontics.firebasestorage.app",
  messagingSenderId: "536436661756",
  appId: "1:536436661756:web:09cad921e4875e3c292679",
  measurementId: "G-H4STNKM29M"
};

// Logic to determine if we are in Live Mode
export const isFirebaseConfigured = firebaseConfig.projectId && firebaseConfig.projectId !== "YOUR_PROJECT_ID";

let app;
let auth: any = null;
let db: any = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("🔥 Firebase initialized successfully for:", firebaseConfig.projectId);
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
  }
} else {
  console.warn("⚠️ Firebase Project ID missing. App running in DEMO MODE (LocalStorage).");
}

export { auth, db };