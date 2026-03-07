'use client';
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const user_service = "http://localhost:5000";
export const blog_service = "http://localhost:5001";
export const author_service = "http://localhost:5002";


export interface User {
  _id: string;
  name: string;
  email: string;
  instagram: string;
  linkedIn: string;
  bio: string;
  facebook: string;
  x: string;
  image: string
}

export interface Blog {
  id: string;
  title: string;
  descriptioh: string;
  blogContent: string;
  image: string;
  category: string;
  author: string;
  created_at: string;
}

interface AppContextType {
  user: User | null;
  loading: boolean;
  isAuth: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  logoutUser: () => Promise<void>; 
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = Cookies.get("token");

      const { data } = await axios.get<User>(`${user_service}/api/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser(data);
      setIsAuth(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function logoutUser () {
    Cookies.remove("token");
    setUser(null);
    setIsAuth(false);
    toast.success("User logged out");
  }

  useEffect(() => {
    fetchUser();
  }, []);
  
  return <AppContext.Provider value={{ user, setIsAuth, setLoading, loading, isAuth, setUser, logoutUser }}>
      <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID!}>
        {children} 
        <Toaster />
      </GoogleOAuthProvider>
    </AppContext.Provider>
}

export const useAppData = (): AppContextType => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("Context is not provided");
  }

  return context;
}