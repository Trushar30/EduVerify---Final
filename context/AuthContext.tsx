import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { User, Role } from '../types';
import { useData } from './DataContext';

interface AuthContextType {
  user: User | null;
  login: (email: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Use Supabase Auth for login
  const login = async (email: string, password: string) => {
    const { supabase } = await import('../services/supabaseClient');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      setUser(null);
      return false;
    }
    // Optionally fetch user profile from users table
    setUser({
      id: data.user.id,
      name: data.user.user_metadata?.name || '',
      email: data.user.email || '',
      role: data.user.user_metadata?.role || 'student',
      classIds: [],
      achievements: [],
    });
    return true;
  };

  const logout = async () => {
    const { supabase } = await import('../services/supabaseClient');
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
