"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedTokenCookie = Cookies.get("token");
    if (storedTokenCookie) {
      setToken(storedTokenCookie);
      fetchUser(storedTokenCookie);
      fetchUserApplication(storedTokenCookie);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (authToken) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/person/me`,
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

  const fetchUserApplication = async (authToken) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/application/my-application`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log("Fetched application:", response.data.data);
      setApplication(response.data.data);
    } catch (err) {
      console.error("Failed to fetch application:", err);
      setApplication(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/person/login`,
        { email, password }
      );
      if (response.data.success) {
        setUser(response.data.data.person);
        setToken(response.data.data.token);
        Cookies.set("token", response.data.data.token, {
          secure: true,
          sameSite: "strict",
        });
        fetchUserApplication(response.data.data.token);
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

  const logout = () => {
    setUser(null);
    setToken(null);
    setApplication(null);
    Cookies.remove("token");
    router.push("/");
  };

  // Method to update application state from Apply Job page
  const updateApplication = (newApplication) => {
    setApplication(newApplication);
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
        updateApplication,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
