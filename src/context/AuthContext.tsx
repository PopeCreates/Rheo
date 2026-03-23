import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { COLLECTIONS, type FirestoreUser } from "@/lib/firebase";

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  userData: FirestoreUser | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<FirestoreUser>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Subscribe to user document
        const unsubscribeUser = firestore()
          .collection(COLLECTIONS.USERS)
          .doc(firebaseUser.uid)
          .onSnapshot(
            (doc) => {
              if (doc.exists) {
                setUserData({ uid: doc.id, ...doc.data() } as FirestoreUser);
              }
              setLoading(false);
            },
            (err) => {
              console.error("Error fetching user data:", err);
              setLoading(false);
            }
          );
        
        return () => unsubscribeUser();
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create auth user
      const { user: newUser } = await auth().createUserWithEmailAndPassword(email, password);
      
      // Update display name
      await newUser.updateProfile({ displayName });
      
      // Create user document in Firestore
      const now = firestore.Timestamp.now();
      const userDoc: Omit<FirestoreUser, "uid"> = {
        email,
        displayName,
        createdAt: now,
        updatedAt: now,
        onboardingComplete: false,
        onboardingData: {},
      };
      
      await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(newUser.uid)
        .set(userDoc);
        
    } catch (err: any) {
      setError(getAuthErrorMessage(err.code));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await auth().signInWithEmailAndPassword(email, password);
    } catch (err: any) {
      setError(getAuthErrorMessage(err.code));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check for Play Services
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Get user info
      const signInResult = await GoogleSignin.signIn();

      // Get the ID token
      const idToken = signInResult?.data?.idToken;
      if (!idToken) {
        throw new Error("No ID token found");
      }

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign in to Firebase with the credential
      const { user: firebaseUser } = await auth().signInWithCredential(googleCredential);

      // Check if user document exists, if not create one
      const userDoc = await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(firebaseUser.uid)
        .get();

      if (!userDoc.exists) {
        const now = firestore.Timestamp.now();
        await firestore()
          .collection(COLLECTIONS.USERS)
          .doc(firebaseUser.uid)
          .set({
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || "User",
            photoURL: firebaseUser.photoURL,
            createdAt: now,
            updatedAt: now,
            onboardingComplete: false,
            onboardingData: {},
          });
      }
    } catch (err: any) {
      if (err.code !== "SIGN_IN_CANCELLED") {
        setError(getAuthErrorMessage(err.code) || err.message);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithApple = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if Apple Auth is available (iOS only)
      if (Platform.OS !== "ios" || !appleAuth.isSupported) {
        throw new Error("Apple Sign-In is only available on iOS devices");
      }

      // Start Apple Sign-In flow
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Ensure we have the identity token
      const { identityToken, nonce } = appleAuthRequestResponse;
      if (!identityToken) {
        throw new Error("Apple Sign-In failed - no identity token returned");
      }

      // Create a Firebase credential from the Apple token
      const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

      // Sign in to Firebase
      const { user: firebaseUser } = await auth().signInWithCredential(appleCredential);

      // Get full name from Apple response (only available on first sign-in)
      const fullName = appleAuthRequestResponse.fullName;
      const displayName = fullName
        ? `${fullName.givenName || ""} ${fullName.familyName || ""}`.trim()
        : firebaseUser.displayName || "User";

      // Check if user document exists, if not create one
      const userDoc = await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(firebaseUser.uid)
        .get();

      if (!userDoc.exists) {
        const now = firestore.Timestamp.now();
        await firestore()
          .collection(COLLECTIONS.USERS)
          .doc(firebaseUser.uid)
          .set({
            email: firebaseUser.email || appleAuthRequestResponse.email,
            displayName,
            createdAt: now,
            updatedAt: now,
            onboardingComplete: false,
            onboardingData: {},
          });

        // Update Firebase Auth profile if we have a name
        if (displayName && displayName !== "User") {
          await firebaseUser.updateProfile({ displayName });
        }
      }
    } catch (err: any) {
      if (err.code !== appleAuth.Error.CANCELED) {
        setError(err.message || "Apple Sign-In failed");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await auth().signOut();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await auth().sendPasswordResetEmail(email);
    } catch (err: any) {
      setError(getAuthErrorMessage(err.code));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<FirestoreUser>) => {
    if (!user) throw new Error("Not authenticated");
    
    try {
      await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(user.uid)
        .update({
          ...data,
          updatedAt: firestore.Timestamp.now(),
        });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        error,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithApple,
        signOut,
        resetPassword,
        updateProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper function to get user-friendly error messages
function getAuthErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Try signing in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    default:
      return "An error occurred. Please try again.";
  }
}
