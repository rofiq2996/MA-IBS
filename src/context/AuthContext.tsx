import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role } from '../types';
import { apiClient } from '../lib/apiClient';

interface AuthContextType {
  user: User | null;
  login: (userId: string, apiUser?: any) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed;
        } catch(e) {}
      }
    }
    return null;
  });

  // Re-fetch user data on mount to keep avatar and other profile info synced
  useEffect(() => {
    if (user && user.username) {
      // Since we don't have a verify token endpoint, we could just do a check or 
      // rely on the user to re-login to fully sync if there isn't a better endpoint.
      // Actually, we don't have the user's password here.
      // So let's create a quick api/get_user.php endpoint to fetch the latest avatar!
      apiClient(`/get_user.php?id=${user.id}`)
        .then(data => {
          if (data.status === 'success' && data.user) {
            const updatedUser = { ...user, avatar: data.user.avatar, name: data.user.name };
            setUser(updatedUser);
            if (typeof window !== 'undefined') {
              localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            }
          }
        })
        .catch(err => console.warn('Sync user data failed or unavailable:', err.message));
    }
  }, []);


  const login = (userId: string, apiUser?: any) => {
    if (apiUser) {
        const u = { ...apiUser, roles: [apiUser.role] };
        setUser(u);
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(u));
        }
        return;
    }
  };

  const switchRole = (role: Role) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
      
      if (updates.avatar && user.id) {
        try {
          const result = await apiClient('/update_avatar.php', {
            method: 'POST',
            body: JSON.stringify({
              user_id: user.id,
              avatar_base64: updates.avatar
            }),
          });
          if (result.status === 'success' && result.avatar_url) {
             const finalUser = { ...updatedUser, avatar: result.avatar_url };
             setUser(finalUser);
             if (typeof window !== 'undefined') {
                localStorage.setItem('currentUser', JSON.stringify(finalUser));
             }
          }
        } catch (error) {
          console.error("Error updating avatar on server", error);
        }
      }
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole, updateUser }}>
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
