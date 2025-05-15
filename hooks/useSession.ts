"use client";

import { clearSession, getSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useSession({ required = false, redirectTo = "/login" } = {}) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // First check sessionStorage immediately
    const storedSession = getSession();
    if (storedSession) {
      setSession(storedSession);
      setLoading(false);
      return;
    }

    const fetchUserSession = async () => {
      try {
        // If not in storage, try to fetch from API
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const userData = await res.json();

          // Create a session object with just email
          const userSession = {
            user: {
              id: userData.id,
              email: userData.email,
              role: userData.role,
              // No need for other fields
            },
          };

          // Store in session storage
          sessionStorage.setItem("userSession", JSON.stringify(userSession));
          setSession(userSession);
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setLoading(false);

        // If required and no session, redirect
        if (required && !getSession()) {
          router.push(redirectTo);
        }
      }
    };

    // Only fetch from API if we didn't find a session in storage
    if (!storedSession) {
      fetchUserSession();
    }

    // Setup storage event listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userSession") {
        setSession(getSession());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [required, redirectTo, router]);

  const logout = async () => {
    try {
      // Call logout API
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear local session
      clearSession();
      setSession(null);
      router.push(redirectTo);
    }
  };

  return {
    session,
    loading,
    logout,
    user: session?.user || null,
    isAuthenticated: session !== null,
  };
}
