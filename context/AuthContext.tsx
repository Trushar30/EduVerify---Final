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
  const { state } = useData(); // Use the state from DataContext
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('eduverify_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (email: string) => {
    // Search in the dynamic user list from DataContext state
    const foundUser = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('eduverify_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eduverify_user');
  };

  const value = useMemo(() => ({ user, login, logout }), [user, state.users]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
