import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerUser } from '../types';

interface AuthContextType {
  user: CustomerUser | null;
  isAuthenticated: boolean;
  loginWithGoogle: (customData?: Partial<CustomerUser>) => Promise<CustomerUser>;
  logout: () => void;
  updateUserAddress: (address: NonNullable<CustomerUser['address']>, phone?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'aura_google_customer_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomerUser | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const loginWithGoogle = async (customData?: Partial<CustomerUser>): Promise<CustomerUser> => {
    // If real GSI or custom user info provided, merge it
    const newUser: CustomerUser = {
      id: customData?.id || 'google-user-' + Math.random().toString(36).substring(2, 9),
      name: customData?.name || 'Cliente VIP Aura',
      email: customData?.email || 'cliente.aura@gmail.com',
      avatarUrl: customData?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      phone: customData?.phone || '(11) 98765-4321',
      googleId: customData?.googleId || 'gid-' + Date.now(),
      address: customData?.address || {
        cep: '01414-001',
        street: 'Alameda Lorena',
        number: '1240',
        neighborhood: 'Jardins',
        city: 'São Paulo',
        state: 'SP'
      }
    };

    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserAddress = (address: NonNullable<CustomerUser['address']>, phone?: string) => {
    if (!user) return;
    const updated = {
      ...user,
      phone: phone || user.phone,
      address
    };
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginWithGoogle,
        logout,
        updateUserAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
