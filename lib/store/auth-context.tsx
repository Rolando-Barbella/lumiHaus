'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState } from '../types';
import Cookies from 'js-cookie';
import { signToken, verifyToken } from '@/lib/auth';
import type { JWTPayload } from '@/lib/auth';

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: JWTPayload; token: string } }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<void>;
}>({ 
  state: initialState, 
  dispatch: () => null,
  login: async () => {},
});

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      // Store auth token in cookies with security options
      Cookies.set('auth_token', action.payload.token, { 
        expires: 1, // 24 hours
        secure: true, 
        sameSite: 'strict',
      });
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'LOGIN_ERROR':
      Cookies.remove('auth_token');
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        user: null,
        token: null,
      };
    case 'LOGOUT':
      Cookies.remove('auth_token');
      return initialState;
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verify token on mount and setup periodic verification
  useEffect(() => {
    const verifyExistingToken = async () => {
      const token = Cookies.get('auth_token');
      
      if (token) {
        const payload = await verifyToken(token);
        if (payload) {
          debugger
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: payload, token },
          });
        } else {
          // Token is invalid or expired
          dispatch({ type: 'LOGOUT' });
        }
      }
    };

    verifyExistingToken();

    // Periodically verify token (every 5 minutes)
    const intervalId = setInterval(verifyExistingToken, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // In a real app, validate credentials against your backend
      // For demo purposes, we'll use a mock user
      if (email === 'admin@example.com' && password === 'Admin123!') {
        const user: JWTPayload = {
          id: '1',
          email,
          name: 'Admin User',
        };

        const token = await signToken(user);

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token },
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: error instanceof Error ? error.message : 'Login failed',
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);