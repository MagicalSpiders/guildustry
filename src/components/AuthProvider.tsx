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
      const userProfile = await getUserProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error("Error loading profile:", error);
      setProfile(null);
    }
  };

  // Load company (for employers)
  const loadCompany = async () => {
    try {
      console.log("🏢 AuthProvider: Loading company for employer...");
      const userCompany = await getCompanyByOwner();
      console.log("🏢 AuthProvider: Company loaded", {
        hasCompany: !!userCompany,
        companyId: userCompany?.id,
        companyName: userCompany?.name,
        ownerId: userCompany?.owner_id,
      });
      setCompany(userCompany);
    } catch (error) {
      console.error("❌ AuthProvider: Error loading company:", error);
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
    console.log("👤 AuthProvider: Loading user data for role:", userRole);
    if (userRole === "candidate") {
      await loadProfile();
    } else if (userRole === "employer") {
      await loadCompany();
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Get initial session with timeout to prevent hanging
    const initAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("❌ Failed to get session:", error);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          const suppress =
            typeof window !== "undefined"
              ? localStorage.getItem("suppress_initial_profile_fetch") === "1"
              : false;
          console.log("🔐 AuthProvider: Initial session check", {
            hasUser: !!session.user,
            userEmail: session.user.email,
            suppress,
          });
          if (!suppress) {
            const userRole = getUserType(session.user);
            console.log("🔐 AuthProvider: User role detected", { userRole });
            if (userRole) {
              console.log(
                "🔐 AuthProvider: Calling loadUserData for role:",
                userRole
              );
              await loadUserData(userRole);
            } else {
              console.log("⚠️ AuthProvider: No user role found in metadata");
            }
          } else {
            console.log("⏭️ AuthProvider: Suppressing initial data fetch");
          }
        }
      } catch (error) {
        console.error("❌ Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("🔄 Auth state changed:", _event);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const userRole = getUserType(session.user);
        console.log("👤 User detected:", {
          email: session.user.email,
          role: userRole,
        });

        const suppress =
          typeof window !== "undefined"
            ? localStorage.getItem("suppress_initial_profile_fetch") === "1"
            : false;
        if (!suppress) {
          if (userRole) {
            console.log("📊 Loading data for role:", userRole);
            await loadUserData(userRole);
          }
        } else {
          console.log("⏭️ Suppressing initial profile/company fetch");
        }
      } else {
        console.log("👋 User signed out");
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

    if (error) throw error;

    // Session will be automatically set by onAuthStateChange listener
    return;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Session will be automatically set by onAuthStateChange listener
    return;
  };

  const signOut = async () => {
    console.log("🚪 Signing out...");

    // Clear state FIRST before calling Supabase signOut
    setProfile(null);
    setCompany(null);
    setUser(null);
    setSession(null);

    // Clear localStorage immediately
    if (typeof window !== "undefined") {
      localStorage.removeItem("suppress_initial_profile_fetch");
      localStorage.removeItem("has_seen_candidate_post_login");
      localStorage.removeItem("has_seen_employer_post_login");
    }

    // Now sign out from Supabase with local scope
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) {
      console.error("❌ Sign out error:", error);
      // Don't throw - we already cleared local state
    }

    console.log("✅ Sign out successful - state cleared");
  };

  const refreshProfile = async () => {
    await loadProfile();
  };

  const refreshCompany = async () => {
    await loadCompany();
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
