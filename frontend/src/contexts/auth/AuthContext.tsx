// Mark this file as a client component to enable React Hooks and browser-specific features
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie' // import js-cookie library to handle cookies
import { User } from '@/types/common/index'
import { userApi } from '@/api/index'

// Define the structure of AuthContext (login state, user, token)
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  setToken: (newToken: string | null) => void
  logout: () => void
  isLoading: boolean
}

// Constants related to tokens
const TOKEN_COOKIE_NAME = 'auth_token';
const USER_COOKIE_NAME = 'auth_user';
const TOKEN_CHECK_INTERVAL = 5 * 60 * 1000; // check token validity every 5 minutes
const COOKIE_EXPIRES = 7; // token cookie expiration time (days)

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create a Provider component to wrap the entire app
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null)
  const [user, setUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  const isAuthenticated = !!user;

  // Create a ref to store the logout function
  const logoutRef = useRef<() => void>(() => { });

  // Logout method: clear token and redirect to login
  const logout = useCallback(() => {
    Cookies.remove(TOKEN_COOKIE_NAME, { path: '/' });
    Cookies.remove(USER_COOKIE_NAME, { path: '/' });

    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    setTokenState(null);
    setUserState(null);

    router.push('/login');
  }, [router]);

  // Update logoutRef
  useEffect(() => {
    logoutRef.current = logout;
  }, [logout]);

  const validateToken = useCallback(async (): Promise<boolean> => {
    if (!token) return false;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        return true;
      } else if (res.status === 401) {
        logoutRef.current();
        return false;
      } else {
        return true;
      }
    } catch {
      return true;
    }
  }, [token]);

  // Method to fetch user data
  const fetchUserData = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const userInfo = await userApi.getCurrentUser();

      setUserState(userInfo);
      Cookies.set(USER_COOKIE_NAME, JSON.stringify(userInfo), {
        expires: COOKIE_EXPIRES,
        path: '/',
        sameSite: 'strict'
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      if ((error as Error).message === 'Failed to fetch user data') {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, logout]);

  // Restore token and user from cookies
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = Cookies.get(TOKEN_COOKIE_NAME);

        if (storedToken) {
          setTokenState(storedToken);

          const storedUser = Cookies.get(USER_COOKIE_NAME);
          if (storedUser) {
            try {
              setUserState(JSON.parse(storedUser));
            } catch {
              console.error('Failed to parse user data from cookie');
              await fetchUserData();
            }
          } else {
            await fetchUserData();
          }

          validateToken();
        }
      } catch (e) {
        console.error('Error initializing auth:', e);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const tokenCheckInterval = setInterval(() => {
      if (token) {
        console.log('Performing periodic token validation');
        validateToken();
      }
    }, TOKEN_CHECK_INTERVAL);

    return () => clearInterval(tokenCheckInterval);
  }, [token, validateToken, fetchUserData]);

  const setToken = useCallback((newToken: string | null) => {
    if (newToken) {
      Cookies.set(TOKEN_COOKIE_NAME, newToken, {
        expires: COOKIE_EXPIRES,
        path: '/',
        sameSite: 'strict'
      });

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('token', newToken);
        } catch {
          console.warn('Failed to store token in localStorage');
        }
      }

      setTokenState(newToken);

      setTimeout(() => fetchUserData(), 0);
    } else {
      logout();
    }
  }, [logout, fetchUserData]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Auth state updated:', {
        hasToken: !!token,
        hasUser: !!user,
        isLoading
      });

      if (typeof window !== 'undefined') {
        (window as Window & { __AUTH_DEBUG__?: { getToken: () => string | null; getUser: () => User | null; getCookieToken: () => string | undefined; getCookieUser: () => string | undefined; validateToken: () => Promise<boolean> } }).__AUTH_DEBUG__ = {
          getToken: () => token,
          getUser: () => user,
          getCookieToken: () => Cookies.get(TOKEN_COOKIE_NAME),
          getCookieUser: () => Cookies.get(USER_COOKIE_NAME),
          validateToken
        };
      }
    }
  }, [token, user, isLoading, validateToken]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      setToken,
      logout,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use AuthContext in any component
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>')
  }
  return context
}
