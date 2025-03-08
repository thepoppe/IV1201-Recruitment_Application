"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import GlobalLoader from "@/components/GlobalLoader";

/**
 * Context for managing user authentication and user data across the application.
 * 
 * This context provides access to the current user, authentication token, 
 * application data, and authentication-related methods.
 * 
 * @type {React.Context}
 */
const UserContext = createContext(null);

/**
 * Provider component for the UserContext.
 * 
 * This component handles user authentication state management including:
 * - Reading authentication tokens from cookies on initial load
 * - Fetching user data and application data when authenticated
 * - Providing login and logout functionality
 * - Managing loading states during async operations
 * - Error handling for authentication failures
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @returns {JSX.Element} The user provider with its children
 */
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const hasFetchedData = useRef(false); // Prevents duplicate API calls

  /**
   * Effect hook to check for stored authentication token and fetch user data on initial load.
   * Uses a ref to prevent duplicate API calls during development hot reloads.
   *
   * @effect
   */
  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;

    const storedTokenCookie = Cookies.get("token");
    if (storedTokenCookie) {
      setToken(storedTokenCookie);
      fetchUser(storedTokenCookie);
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * Effect hook to fetch user application data when user is authenticated.
   * Only fetches application data for users with the "applicant" role.
   *
   * @effect
   * @dependency {Object} user - Current user object
   * @dependency {string} token - Authentication token
   */
  useEffect(() => {
    if (user && token && user.role === "applicant" && !application) {
      fetchUserApplication(token);
    } else {
      setLoading(false);
    }
  }, [user, token]);

  /**
   * Fetches user data from the API using the provided authentication token.
   * Updates the user state if successful, or logs out if the request fails.
   *
   * @async
   * @function fetchUser
   * @param {string} authToken - Authentication token for API request
   * @returns {Promise<void>}
   */
  const fetchUser = async (authToken) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/person/me`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setUser(response.data.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      logout();
    }
  };

  /**
   * Fetches user application data from the API using the provided authentication token.
   * Updates the application state if successful, or sets it to null if the request fails.
   *
   * @async
   * @function fetchUserApplication
   * @param {string} authToken - Authentication token for API request
   * @returns {Promise<void>}
   */
  const fetchUserApplication = async (authToken) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/application/my-application`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setApplication(response.data.data);
    } catch (err) {
      console.error("Failed to fetch application:", err);
      setApplication(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Authenticates a user with email and password.
   * If successful, stores the token in a cookie, updates user state,
   * fetches application data if applicable, and redirects to home page.
   *
   * @async
   * @function login
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<void>}
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/person/login`,
        { email, password }
      );
      if (response.data.success) {
        setUser(response.data.data.person);
        setToken(response.data.data.token);
        Cookies.set("token", response.data.data.token, {
          secure: true,
          sameSite: "strict",
        });

        // Fetch user application data if user.role is applicant
        if (response.data.data.person.role === "applicant") {
          fetchUserApplication(response.data.data.token);
        }

        router.push("/");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logs out the current user.
   * Clears user state, token, application data, removes the cookie,
   * and redirects to the home page.
   *
   * @function logout
   * @returns {void}
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    setApplication(null);
    Cookies.remove("token");
    router.push("/");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        application,
        loading,
        error,
        login,
        logout,
        fetchUserApplication,
      }}
    >
      {loading && <GlobalLoader />}
      {children}
    </UserContext.Provider>
  );
}

/**
 * Custom hook for accessing the user context.
 * 
 * This hook provides components with access to the current user state,
 * authentication token, application data, and authentication methods.
 * It must be used within a component that is a descendant of UserProvider.
 * 
 * @function
 * @returns {Object} User context object
 * @returns {Object|null} returns.user - Current user data or null if not authenticated
 * @returns {string|null} returns.token - Authentication token or null if not authenticated
 * @returns {Object|null} returns.application - User application data or null if not available
 * @returns {boolean} returns.loading - Loading state for authentication operations
 * @returns {string|null} returns.error - Error message or null if no error
 * @returns {Function} returns.login - Method to authenticate a user
 * @returns {Function} returns.logout - Method to log out the current user
 * @returns {Function} returns.fetchUserApplication - Method to fetch user application data
 * @throws {Error} If used outside of a UserProvider
 */
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
