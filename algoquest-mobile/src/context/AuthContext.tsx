import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/src/api/client';

interface User {
  id: string;
  pseudo: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Charger user/token depuis AsyncStorage au démarrage
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        const savedToken = await AsyncStorage.getItem('token');

        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        }
      } catch (e) {
        console.error('Erreur chargement auth:', e);
      }
    };

    loadAuth();
  }, []);

  //  Connexion : sauvegarde dans le state + AsyncStorage
  const login = (user: User, token: string) => {
  setUser(user);
  setToken(token);

  //  Met à jour directement le header global
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

  //  Déconnexion : suppression des données
  const logout = async () => {
    try {
      setUser(null);
      setToken(null);
      delete api.defaults.headers.common['Authorization'];
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
    } catch (e) {
      console.error('Erreur logout:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
