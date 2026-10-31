import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration from user request
const firebaseConfig = {
  apiKey: "AIzaSyC01nMQmb65RQYzDfHXVL8dQJOQscRs1m0",
  authDomain: "makana-fece5.firebaseapp.com",
  databaseURL: "https://makana-fece5-default-rtdb.firebaseio.com",
  projectId: "makana-fece5",
  messagingSenderId: "669445166343",
  appId: "1:669445166343:web:9b3ad6a9f6012e9c7ca1a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
  experimentalForceLongPolling: true
});
const auth = getAuth(app);
const rtdb = getDatabase(app);

if (typeof window !== "undefined") {
  (window as any).firebaseApp = app;
  (window as any).db = db;
  (window as any).rtdb = rtdb;
}

export const RTDB_ROOT = "royal_builders";

export { app, analytics, db, auth, rtdb };
