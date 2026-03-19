/**
 * Firebase Configuration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project or select existing
 * 3. Enable Authentication (Email/Password + Google Sign-In)
 * 4. Create a Firestore Database
 * 5. Enable Cloud Messaging
 * 6. Go to Project Settings > General > Your apps
 * 7. Add iOS and Android apps with your bundle IDs
 * 8. Copy the config values below
 * 
 * For iOS: Download GoogleService-Info.plist and add to ios/ folder
 * For Android: Download google-services.json and add to android/app/ folder
 */

import firebase from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";

// Firebase config - Replace with your own values from Firebase Console
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID",
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export Firebase services
export { firebase, auth, firestore, messaging };

// Firestore Collections
export const COLLECTIONS = {
  USERS: "users",
  CYCLES: "cycles",
  DAILY_LOGS: "dailyLogs",
  CRAVINGS: "cravings",
  PARTNER_LINKS: "partnerLinks",
  GIFTS: "gifts",
  NOTIFICATIONS: "notifications",
} as const;

// Helper types for Firestore documents
export interface FirestoreUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  onboardingComplete: boolean;
  onboardingData: {
    lastPeriodDate?: string;
    cycleLength?: number;
    goal?: "track_cycle" | "plan_pregnancy" | "health_insights";
    notificationsEnabled?: boolean;
  };
  fcmToken?: string;
  partnerId?: string;
}

export interface FirestoreDailyLog {
  id: string;
  userId: string;
  date: string;
  mood?: string;
  flow?: string;
  symptoms?: string[];
  notes?: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}

export interface FirestoreCraving {
  id: string;
  userId: string;
  item: string;
  category: "food" | "activity" | "gift" | "other";
  notes?: string;
  fulfilled: boolean;
  createdAt: firebase.firestore.Timestamp;
}

export interface FirestorePartnerLink {
  id: string;
  userId: string;
  partnerId: string;
  partnerEmail: string;
  status: "pending" | "active" | "declined";
  createdAt: firebase.firestore.Timestamp;
}

export interface FirestoreGift {
  id: string;
  fromUserId: string;
  toUserId: string;
  giftType: string;
  message?: string;
  status: "pending" | "delivered" | "viewed";
  createdAt: firebase.firestore.Timestamp;
}
