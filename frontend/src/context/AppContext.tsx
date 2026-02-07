'use client';
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

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
  user: User | null
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loadConfig, setLoading] = useState(true);

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

  useEffect(() => {
    fetchUser();
  }, []);
  
  return <AppContext.Provider value={{ user }}>{children}</AppContext.Provider>
}

export const useAppData = (): AppContextType => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("Context is not provided");
  }

  return context;
}