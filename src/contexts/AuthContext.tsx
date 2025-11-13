import React, { createContext, useContext, useEffect, useState } from 'react';
import { authenticateUser, getUserRole } from '@/lib/supabase-services';

type User = {
  email: string;
  role: 'administrator' | 'user';
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  setRoleForUser: (email: string, role: User['role']) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('auth_user');
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem('auth_user', JSON.stringify(user));
      else localStorage.removeItem('auth_user');
    } catch (e) {
      // ignore
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const res = await authenticateUser(email, password);
      if (res.success) {
        // Try to fetch role from users table if not returned
        let role = res.role;
        if (!role) {
          role = await getUserRole(email);
        }
        if (!role) role = 'user';

        const u: User = { email, role };
        setUser(u);
        if (role) localStorage.setItem(`role_${email}`, role);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (err) {
      console.error('Login error', err);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const setRoleForUser = (email: string, role: User['role']) => {
    try {
      localStorage.setItem(`role_${email}`, role);
      setUser((prev) => (prev && prev.email === email ? { ...prev, role } : prev));
    } catch (e) {
      console.warn('Could not persist role', e);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, setRoleForUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
