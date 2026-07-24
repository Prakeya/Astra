import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, Firestore, doc, setDoc } from "firebase/firestore";
import { getMessaging, Messaging, getToken, onMessage } from "firebase/messaging";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    import.meta.env.VITE_FIREBASE_PROJECT_ID &&
    import.meta.env.VITE_FIREBASE_API_KEY
  );
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let messaging: Messaging | undefined;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      try {
        messaging = getMessaging(app);
      } catch (err) {
        console.warn("FCM messaging initialization skipped or unsupported in iframe:", err);
      }
    }
  } catch (err) {
    console.error("Firebase initialization failed, falling back to local engine:", err);
  }
} else {
  console.info("Firebase environment variables not set. ASTRA operating in local/demo state engine mode.");
}

export { app, auth, db, messaging };

// Helper to handle anonymous sign in seamlessly
export async function ensureAnonymousAuth(): Promise<User | null> {
  if (!auth) return null;
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        try {
          const cred = await signInAnonymously(auth);
          resolve(cred.user);
        } catch (err) {
          console.warn("Anonymous auth failed or offline:", err);
          resolve(null);
        }
      }
    });
  });
}

// Request FCM Push Notification Token and store in Firestore
export async function requestFCMToken(vapidKey?: string): Promise<string | null> {
  if (!messaging) return null;
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: vapidKey || import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      if (token && db && auth?.currentUser) {
        try {
          await setDoc(doc(db, "users", auth.currentUser.uid, "fcmTokens", token), {
            token,
            updatedAt: new Date().toISOString(),
          });
        } catch (e) {
          console.warn("Saving FCM token to Firestore skipped:", e);
        }
      }
      return token;
    }
  } catch (err) {
    console.warn("FCM Notification Token request failed:", err);
  }
  return null;
}

// Listen for foreground FCM messages
export function onForegroundMessage(callback: (payload: any) => void) {
  if (!messaging) return () => {};
  return onMessage(messaging, callback);
}
