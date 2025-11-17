"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import { getUserProfile } from "@/src/lib/profileFunctions";
import { getCompanyByOwner } from "@/src/lib/companyFunctions";
import type { UserProfile, Company } from "@/src/lib/database.types";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  profile: UserProfile | null;
  company: Company | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    role: "candidate" | "employer"
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshCompany: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile (for candidates)
  const loadProfile = async () => {
    try {
      console.log("[Profile] Loading candidate profile...");
      const userProfile = await getUserProfile();
      console.log(`[Profile] ${userProfile ? "Loaded" : "Not found"}`);
      setProfile(userProfile);
    } catch (error: any) {
      console.error("[Profile] Error:", error.message);
      setProfile(null);
    }
  };

  // Load company (for employers)
  const loadCompany = async () => {
    try {
      console.log("[Company] Loading employer company...");
      const userCompany = await getCompanyByOwner();
      console.log(`[Company] ${userCompany ? "Loaded" : "Not found"}`);
      setCompany(userCompany);
    } catch (error: any) {
      console.error("[Company] Error:", error.message);
      setCompany(null);
    }
  };

  // Helper function to get user type/role from metadata
  // Checks user_type first (new), then falls back to role (for backward compatibility)
  const getUserType = (user: User | null): string | null => {
    if (!user?.user_metadata) return null;
    return user.user_metadata.user_type || user.user_metadata.role || null;
  };

  // Load data based on user role
  const loadUserData = async (userRole: string) => {
    if (userRole === "candidate") {
      await loadProfile();
    } else if (userRole === "employer") {
      await loadCompany();
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Get initial session - Supabase automatically handles persistence
    const initAuth = async () => {
      try {
        console.log("[Auth] Initializing session...");
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("[Auth] Session error:", error.message);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const userRole = getUserType(session.user);
          console.log(`[Auth] Session found - Role: ${userRole}`);
          if (userRole) {
            await loadUserData(userRole);
          }
        } else {
          console.log("[Auth] No session found");
        }
      } catch (error) {
        console.error("[Auth] Initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log(`[Auth] State changed: ${_event}`);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const userRole = getUserType(session.user);
        console.log(`[Auth] User authenticated - Role: ${userRole}`);
        if (userRole) {
          await loadUserData(userRole);
        }
      } else {
        console.log("[Auth] User signed out");
        setProfile(null);
        setCompany(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    role: "candidate" | "employer"
  ) => {
    console.log(`[Auth] Signing up as ${role}`);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          user_type: role, // Store user_type based on user's choice
        },
      },
    });

    if (error) {
      console.error("[Auth] Signup error:", error.message);
      throw error;
    }
    console.log("[Auth] Signup successful - Email verification required");
    // Session will be automatically set by onAuthStateChange listener
  };

  const signIn = async (email: string, password: string) => {
    console.log("[Auth] Signing in...");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("[Auth] Sign in error:", error.message);
      throw error;
    }
    console.log("[Auth] Sign in successful");
    // Session will be automatically set by onAuthStateChange listener
  };

  const signOut = async () => {
    console.log("[Auth] Signing out...");
    // Clear state FIRST before calling Supabase signOut
    setProfile(null);
    setCompany(null);
    setUser(null);
    setSession(null);

    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("has_seen_candidate_post_login");
      localStorage.removeItem("has_seen_employer_post_login");
    }

    // Now sign out from Supabase
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) {
      console.error("[Auth] Sign out error:", error.message);
      // Don't throw - we already cleared local state
    }
    console.log("[Auth] Signed out successfully");
  };

  const refreshProfile = async () => {
    await loadProfile();
  };

  const refreshCompany = async () => {
    await loadCompany();
  };

  const resetPasswordForEmail = async (email: string) => {
    console.log("[Auth] Requesting password reset for:", email);
    const redirectTo = `${window.location.origin}/auth/update-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      console.error("[Auth] Password reset error:", error.message);
      throw error;
    }
    console.log("[Auth] Password reset email sent successfully");
  };

  const updatePassword = async (newPassword: string) => {
    console.log("[Auth] Updating password...");
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("[Auth] Password update error:", error.message);
      throw error;
    }
    console.log("[Auth] Password updated successfully");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        profile,
        company,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        resetPasswordForEmail,
        updatePassword,
        refreshProfile,
        refreshCompany,
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
