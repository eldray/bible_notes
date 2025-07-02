import React, { createContext, useState, useEffect, useContext } from "react";
import { View, Text } from "react-native";
import { supabase } from "../config/supabase";
import { UserData } from "./utils/types";

interface AuthContextType {
  user: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    churchName: string;
    churchBranch?: string;
    denomination?: string;
    role?: string;
    bio?: string | undefined;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<UserData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        setLoading(true);
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error("Error restoring session:", error.message);
          return;
        }
        if (session?.user) {
          setUser({
            id: session.user.id,
            firstName: session.user.user_metadata?.firstName || "",
            lastName: session.user.user_metadata?.lastName || "",
            email: session.user.email || "",
            phoneNumber: session.user.user_metadata?.phoneNumber || "",
            churchName: session.user.user_metadata?.churchName || "",
            churchBranch: session.user.user_metadata?.churchBranch || "",
            denomination: session.user.user_metadata?.denomination || "",
            role: session.user.user_metadata?.role || "",
            bio: session.user.user_metadata?.bio || "",
            profileImageUrl: session.user.user_metadata?.profileImageUrl || "",
          });
        }
      } catch (error: any) {
        console.error("Unexpected error restoring session:", error.message);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser({
            id: session.user.id,
            firstName: session.user.user_metadata?.firstName || "",
            lastName: session.user.user_metadata?.lastName || "",
            email: session.user.email || "",
            phoneNumber: session.user.user_metadata?.phoneNumber || "",
            churchName: session.user.user_metadata?.churchName || "",
            churchBranch: session.user.user_metadata?.churchBranch || "",
            denomination: session.user.user_metadata?.denomination || "",
            role: session.user.user_metadata?.role || "",
            bio: session.user.user_metadata?.bio || "",
            profileImageUrl: session.user.user_metadata?.profileImageUrl || "",
          });
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("Login error:", {
          message: error.message,
          status: error.status,
          code: error.code,
        });
        if (error.code === "email_not_confirmed") {
          throw new Error(
            "Please verify your email address to log in. Check your inbox or spam folder, or resend the confirmation email.",
          );
        }
        throw new Error(
          error.message || "Failed to log in. Please check your credentials.",
        );
      }
      if (data.user) {
        setUser({
          id: data.user.id,
          firstName: data.user.user_metadata?.firstName || "",
          lastName: data.user.user_metadata?.lastName || "",
          email: data.user.email || "",
          phoneNumber: data.user.user_metadata?.phoneNumber || "",
          churchName: data.user.user_metadata?.churchName || "",
          churchBranch: data.user.user_metadata?.churchBranch || "",
          denomination: data.user.user_metadata?.denomination || "",
          role: data.user.user_metadata?.role || "",
          bio: data.user.user_metadata?.bio || "",
          profileImageUrl: data.user.user_metadata?.profileImageUrl || "",
        });
      }
    } catch (error: any) {
      throw new Error(
        error.message || "An unexpected error occurred during login.",
      );
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    churchName: string;
    churchBranch?: string;
    denomination?: string;
    role?: string;
    bio?: string | undefined;
  }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            phoneNumber: userData.phoneNumber || "",
            churchName: userData.churchName,
            churchBranch: userData.churchBranch || "",
            denomination: userData.denomination || "",
            role: userData.role || "",
            bio: userData.bio || "",
          },
        },
      });
      if (error) {
        console.error("Registration error:", {
          message: error.message,
          status: error.status,
          code: error.code,
        });
        throw new Error(
          error.message || "Failed to register. Please try again.",
        );
      }
      if (data.user) {
        setUser({
          id: data.user.id,
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email,
          phoneNumber: userData.phoneNumber || "",
          churchName: userData.churchName,
          churchBranch: userData.churchBranch || "",
          denomination: userData.denomination || "",
          role: userData.role || "",
          bio: userData.bio || "",
          profileImageUrl: "",
        });
      }
    } catch (error: any) {
      throw new Error(
        error.message || "An unexpected error occurred during registration.",
      );
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", {
          message: error.message,
          status: error.status,
          code: error.code,
        });
        throw new Error(error.message || "Failed to log out.");
      }
      setUser(null);
    } catch (error: any) {
      throw new Error(
        error.message || "An unexpected error occurred during logout.",
      );
    }
  };

  const updateUserProfile = async (userData: Partial<UserData>) => {
    try {
      if (!user) {
        console.error("Profile update failed: No user logged in");
        throw new Error("No user is logged in");
      }
      const { data, error } = await supabase.auth.updateUser({
        data: {
          firstName: userData.firstName || user.firstName,
          lastName: userData.lastName || user.lastName,
          phoneNumber: userData.phoneNumber || user.phoneNumber,
          churchName: userData.churchName || user.churchName,
          churchBranch: userData.churchBranch || user.churchBranch,
          denomination: userData.denomination || user.denomination,
          role: userData.role || user.role,
          bio: userData.bio || user.bio,
          profileImageUrl: userData.profileImageUrl || user.profileImageUrl,
        },
      });
      if (error) {
        console.error("Profile update error:", error.message);
        throw new Error(error.message);
      }
      if (!data.user) {
        console.error("Profile update failed: No user returned");
        throw new Error("Profile update failed");
      }
      setUser({
        id: user.id,
        firstName: data.user.user_metadata.firstName || "",
        lastName: data.user.user_metadata.lastName || "",
        email: user.email,
        phoneNumber: data.user.user_metadata.phoneNumber || "",
        churchName: data.user.user_metadata.churchName || "",
        churchBranch: data.user.user_metadata.churchBranch || "",
        denomination: data.user.user_metadata.denomination || "",
        role: data.user.user_metadata.role || "",
        bio: data.user.user_metadata.bio || "",
        profileImageUrl: data.user.user_metadata.profileImageUrl || "",
      });
      console.log("Profile updated:", { userId: user.id });
    } catch (error: any) {
      console.error("Profile update error:", error.message);
      throw new Error(
        error.message || "An unexpected error occurred during profile update.",
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateUserProfile }}
    >
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading authentication...</Text>
        </View>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
