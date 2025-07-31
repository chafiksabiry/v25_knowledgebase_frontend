import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import apiClient from '../api/client';

interface User {
  userId: string | null;
  companyId: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  logout: () => void;
  checkAuthStatus: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Fonction utilitaire pour construire l'URL de l'app principale
  const getMainAppUrl = () => {
    // Toujours rediriger vers /app1 pour l'authentification lors du logout
    return `${window.location.protocol}//${window.location.host}/app1`;
  };

  // Fonction pour vérifier si l'utilisateur est authentifié
  const checkAuthStatus = useCallback(() => {
    const userId = Cookies.get('userId');
    const companyId = Cookies.get('companyId');
    
    // Check for required cookies based on run mode
    const runMode = import.meta.env.VITE_RUN_MODE;
    let isAuth = false;
    
    if (runMode === 'standalone') {
      // En mode standalone, on considère l'utilisateur comme authentifié
      isAuth = true;
    } else {
      // En mode in-app, vérifier les cookies
      isAuth = !!(userId && companyId);
    }

    // Seulement mettre à jour si l'état a changé
    if (isAuthenticated !== isAuth) {
      console.log('Auth status changed:', { userId: !!userId, companyId: !!companyId, runMode });
      setIsAuthenticated(isAuth);
      if (isAuth) {
        setUser({ userId: userId || null, companyId: companyId || null });
      } else {
        setUser(null);
      }
    }

    return isAuth;
  }, [isAuthenticated]);

  // Fonction de logout sécurisée
  const logout = () => {
    console.log('Performing secure logout...');
    
    // 1. Nettoyer le localStorage
    localStorage.clear();
    
    // 2. Nettoyer tous les cookies
    const cookies = Cookies.get();
    Object.keys(cookies).forEach(cookieName => {
      Cookies.remove(cookieName, { path: '/' });
      // Essayer aussi de supprimer avec différents domaines si nécessaire
      Cookies.remove(cookieName, { path: '/', domain: window.location.hostname });
    });
    
    // 3. Nettoyer l'état local
    setIsAuthenticated(false);
    setUser(null);
    
    // 4. Construire l'URL complète pour rediriger vers l'app principale
    const mainAppUrl = getMainAppUrl();
    
    // 5. Nettoyer l'historique du navigateur pour empêcher le retour
    window.history.replaceState(null, '', mainAppUrl);
    
    // 6. Rediriger vers l'application principale (pas la sous-app)
    window.location.replace(mainAppUrl);
  };

  // Vérification initiale au chargement
  useEffect(() => {
    setIsLoading(true);
    const userId = Cookies.get('userId');
    const companyId = Cookies.get('companyId');
    const runMode = import.meta.env.VITE_RUN_MODE;
    
    console.log('Initial auth check:', { userId: !!userId, companyId: !!companyId, runMode });
    
    let isAuth = false;
    if (runMode === 'standalone') {
      isAuth = true;
    } else {
      isAuth = !!(userId && companyId);
    }
    
    setIsAuthenticated(isAuth);
    if (isAuth) {
      setUser({ userId: userId || null, companyId: companyId || null });
    } else {
      setUser(null);
    }
    
    setIsLoading(false);
  }, []);

  // Écouter les changements dans localStorage/cookies depuis d'autres onglets
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // En mode standalone, ne pas gérer les changements de storage
      if (import.meta.env.VITE_RUN_MODE === 'standalone') return;
      
      if ((e.key === 'userId' || e.key === 'companyId') && !e.newValue && isAuthenticated) {
        // Cookie/token supprimé dans un autre onglet - logout direct
        console.log('Auth data removed in another tab, logging out...');
        setIsAuthenticated(false);
        setUser(null);
        window.location.replace(getMainAppUrl());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated]);

  // Intercepter les erreurs 401 globalement
  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && isAuthenticated) {
          console.log('401 error detected, logging out...');
          // Appel direct du logout pour éviter les boucles
          localStorage.clear();
          const cookies = Cookies.get();
          Object.keys(cookies).forEach(cookieName => {
            Cookies.remove(cookieName, { path: '/' });
          });
          setIsAuthenticated(false);
          setUser(null);
          window.location.replace(getMainAppUrl());
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.response.eject(interceptor);
    };
  }, [isAuthenticated]);

  const value = {
    isAuthenticated,
    isLoading,
    user,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 