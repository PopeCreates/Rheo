import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/database";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithTwitter: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function getAuthErrorMessage(error: AuthError): string {
  const message = error.message.toLowerCase();
  
  if (message.includes("invalid login credentials")) {
    return "Invalid email or password. Please try again.";
  }
  if (message.includes("email not confirmed")) {
    return "Please check your email and confirm your account.";
  }
  if (message.includes("user already registered")) {
    return "An account with this email already exists.";
  }
  if (message.includes("invalid email")) {
    return "Please enter a valid email address.";
  }
  if (message.includes("weak password") || message.includes("at least")) {
    return "Password should be at least 6 characters.";
  }
  
  return error.message || "An unexpected error occurred.";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile from Supabase
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching profile:", profileError);
      }
      
      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        fetchProfile(initialSession.user.id);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          await fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
        }

        if (event === "SIGNED_OUT") {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (signUpError) {
        setError(getAuthErrorMessage(signUpError));
        throw signUpError;
      }

      // Profile will be auto-created by database trigger
    } catch (err: any) {
      if (!error) {
        setError(err.message || "Failed to sign up");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(getAuthErrorMessage(signInError));
        throw signInError;
      }
    } catch (err: any) {
      if (!error) {
        setError(err.message || "Failed to sign in");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "rheo://",
          skipBrowserRedirect: true,
        },
      });

      if (googleError) {
        setError(getAuthErrorMessage(googleError));
        throw googleError;
      }
    } catch (err: any) {
      if (!error) {
        setError(err.message || "Failed to sign in with Google");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithTwitter = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error: twitterError } = await supabase.auth.signInWithOAuth({
        provider: "twitter",
        options: {
          redirectTo: "rheo://",
          skipBrowserRedirect: true,
        },
      });

      if (twitterError) {
        setError(getAuthErrorMessage(twitterError));
        throw twitterError;
      }
    } catch (err: any) {
      if (!error) {
        setError(err.message || "Failed to sign in with X");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        setError(getAuthErrorMessage(signOutError));
        throw signOutError;
      }

      setProfile(null);
    } catch (err: any) {
      if (!error) {
        setError(err.message || "Failed to sign out");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "rheo://reset-password",
      });

      if (resetError) {
        setError(getAuthErrorMessage(resetError));
        throw resetError;
      }
    } catch (err: any) {
      if (!error) {
        setError(err.message || "Failed to send reset password email");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) {
      setError("You must be logged in to update your profile");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        setError(updateError.message);
        throw updateError;
      }

      // Refresh profile
      await fetchProfile(user.id);
    } catch (err: any) {
      if (!error) {
        setError(err.message || "Failed to update profile");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
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
