"use client";

import Loader from "@/components/Loader";
import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface AppProviderType {
  isLoading: boolean;

  authToken: string | null;

  login: (email: string, password: string) => Promise<void>;

  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => Promise<void>;

  logout: () => void;
}

const AppContext = createContext<AppProviderType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authToken, setAuthToken] = useState<string | null>(
    Cookies.get("authToken") || null
  );
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("authToken") || null;

    if (!authToken) setAuthToken(token);
    else router.push("/auth");

    setIsLoading(false);
  }, [router]);

  const login: AppProviderType["login"] = async (email, password) => {
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (response.data.status) {
        Cookies.set("authToken", response.data.token, { expires: 7 });
        toast.success("Login successful!");
        setAuthToken(response.data.token);

        router.push("/dashboard");
      } else {
        toast.error("Login failed!");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const register: AppProviderType["register"] = async (
    name,
    email,
    password,
    password_confirmation
  ) => {
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        password_confirmation,
      });

      if (response.data.status) toast.success("Registration successful!");

      login(email, password);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const logout: AppProviderType["logout"] = () => {
    Cookies.remove("authToken");
    setAuthToken(null);
    setIsLoading(false);
    toast.success("User logged out successfully!");
    router.push("/auth");
  };

  return (
    <AppContext.Provider
      value={{ login, register, isLoading, authToken, logout }}
    >
      {isLoading ? <Loader /> : children}
    </AppContext.Provider>
  );
}

export const appHook = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("Context will be wrapped inside AppProvider");
  }

  return context;
};
