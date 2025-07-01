import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setAuthToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would load the token from AsyncStorage
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setToken(userData.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const setAuthToken = (newToken: string) => {
    setToken(newToken);
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    setAuthToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}