import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, type User, type UserRole } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('agriflow_user');
    const storedToken = localStorage.getItem('agriflow_token');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const signup = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const response = await api.signup({ name, email, password, role });
      localStorage.setItem('agriflow_user', JSON.stringify(response.user));
      localStorage.setItem('agriflow_token', response.token);
      setUser(response.user);
      setToken(response.token);
      return true;
    } catch {
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.login({ email, password });
      localStorage.setItem('agriflow_user', JSON.stringify(response.user));
      localStorage.setItem('agriflow_token', response.token);
      setUser(response.user);
      setToken(response.token);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('agriflow_user');
    localStorage.removeItem('agriflow_token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};