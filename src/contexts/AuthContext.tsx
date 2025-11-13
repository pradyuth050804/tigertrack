import React, { createContext, useContext, useEffect, useState } from 'react';
import { sendOtp, verifyOtp, getUserRole } from '@/lib/supabase-services';

type User = {
  email: string;
  role: 'administrator' | 'user';
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  sendOtpToEmail: (email: string) => Promise<boolean>;
  verifyCode: (email: string, code: string) => Promise<{ success: boolean; role?: string }>;
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

  const sendOtpToEmail = async (email: string) => {
    return await sendOtp(email);
  };

  const verifyCode = async (email: string, code: string) => {
    const res = await verifyOtp(email, code);
    if (res.success) {
      // Try to fetch role from users table/Supabase
      let role = (res.role as User['role']) || (localStorage.getItem(`role_${email}`) as User['role'] | null);
      if (!role) {
        role = await getUserRole(email);
      }
      if (!role) role = 'user'; // Default to 'user' if no role found

      const u: User = { email, role };
      setUser(u);
      if (role) localStorage.setItem(`role_${email}`, role);
      return { success: true, role };
    }
    return { success: false };
  };

  const setRoleForUser = (email: string, role: User['role']) => {
    try {
      localStorage.setItem(`role_${email}`, role);
      // if currently logged in user matches, update
      setUser((prev) => (prev && prev.email === email ? { ...prev, role } : prev));
    } catch (e) {
      console.warn('Could not persist role', e);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, sendOtpToEmail, verifyCode, setRoleForUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
