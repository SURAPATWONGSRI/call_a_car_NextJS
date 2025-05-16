/**
 * Client-side session management utilities
 */

type UserSession = {
  user: {
    id: string;
    email: string;
    role?: string;
    [key: string]: any;
  };
  id: string;
  expiresAt?: string;
};

/**
 * Gets the current user session from sessionStorage
 */
export function getSession(): UserSession | null {
  if (typeof window === "undefined") return null;

  try {
    const storedSession = sessionStorage.getItem("userSession");
    if (!storedSession) return null;

    const session = JSON.parse(storedSession);

    if (!session || !session.user) {
      console.warn("Invalid session format in storage");
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error retrieving session:", error);
    return null;
  }
}

/**
 * Clears the session from storage and server
 * Returns a Promise that resolves when the logout API call completes
 */
export function clearSession(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  try {
    // Clear client-side storage
    sessionStorage.removeItem("userSession");

    // Call logout API to clear server-side session and return the promise
    return fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include", // Ensure cookies are sent with the request
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Logout failed");
        }
        return;
      })
      .catch((error) => {
        console.error("Error during logout API call:", error);
      });
  } catch (error) {
    console.error("Error clearing session:", error);
    return Promise.reject(error);
  }
}

/**
 * Checks if the user is authenticated
 */
export function isAuthenticated(): boolean {
  return getSession() !== null;
}

/**
 * Gets the current user from the session
 */
export function getCurrentUser() {
  const session = getSession();
  return session?.user || null;
}

/**
 * Gets the user role from the session
 */
export function getUserRole(): string | null {
  const user = getCurrentUser();
  return user?.role || null;
}

/**
 * Checks if the current user has a specific role
 */
export function hasRole(role: string | string[]): boolean {
  const userRole = getUserRole();
  if (!userRole) return false;

  if (Array.isArray(role)) {
    return role.includes(userRole);
  }

  return userRole === role;
}
