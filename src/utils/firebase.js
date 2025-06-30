import { initializeApp } from "firebase/app";
import { getAnalytics, setUserId, logEvent } from "firebase/analytics";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
} from "firebase/remote-config";
import request from "./api";
import { useSession } from "next-auth/react";

// Load Firebase configuration from environment variables
const firebaseConfig = {
  disabled: process.env.NEXT_PUBLIC_FIREBASE_DISABLED === "true",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let messaging;
let analytics;
let remoteConfig;

const initializeFirebase = async () => {
  if (typeof window !== "undefined") {
    const app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);

    const supported = await isSupported();
    if (supported) {
      messaging = getMessaging(app);
    }

    remoteConfig = getRemoteConfig(app);
    remoteConfig.settings = {
      minimumFetchIntervalMillis: 360000,
    };

    await fetchAndActivate(remoteConfig);
  }
};

// Check if all Firebase config variables are set
const allConfigSet = Object.values(firebaseConfig).every(Boolean);

// Call the initialization function only if all config variables are set
if (allConfigSet) {
  initializeFirebase();
} else {
  // Optional: Log a warning if Firebase is not initialized due to missing config
  if (typeof window !== "undefined") { // Ensure console is available (client-side)
      console.warn("Firebase initialization skipped: Not all configuration variables are set.");
  }
}

/**
 * Custom hook to use Firebase Analytics.
 * @returns {Object} - An object with the handleLogEvent function.
 */
export const useFirebaseAnalytics = () => {
  const { data: session } = useSession();

  /**
   * Logs an event to Firebase Analytics.
   * @param {string} eventName - The name of the event to log.
   */
  const handleLogEvent = (eventName) => {
    if (!analytics) return;
    if (session?.user?.email) setUserId(analytics, session.user.email);
    logEvent(analytics, eventName);
  };

  return {
    handleLogEvent,
  };
};

export const handleLogEventWithoutSession = (eventName) => {
  if (!analytics) return;
  logEvent(analytics, eventName);
};

/**
 * check firebase access
 * @returns {boolean}
 */
const cannotUseFirebase = () => {
  return !messaging || Notification === undefined;
};

/**
 * Requests permission for notifications and retrieves the token.
 */
export const requestForToken = async () => {
  if (cannotUseFirebase()) return;

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      if (currentToken) {
        console.log("current token for client: ", currentToken);
        await request("/users/tokens", "PATCH", {
          tokenDevice: currentToken,
          enableNotifications: true,
        });
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
  }
};

/**
 * Listens for incoming messages from Firebase Cloud Messaging.
 * @returns {Promise<Object>} - A promise that resolves with the message payload.
 */
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (cannotUseFirebase()) return;

    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

/**
 * Fetches the remote config value.
 * @returns {Promise<string|null>} - A promise that resolves with the remote config value.
 */
export const getRemoteConfigValue = async (key) => {
  try {
    await fetchAndActivate(remoteConfig);
    return getValue(remoteConfig, key).asString();
  } catch (error) {
    console.error("Error fetching remote config value: ", error);
    return null;
  }
};
