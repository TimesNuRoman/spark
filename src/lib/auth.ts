// Authentication state management for Spark website
import { api, User } from './api';
import { useState, useEffect } from 'react';

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

class AuthManager {
  private tokenKey = 'spark_token';
  private userKey = 'spark_user';

  private listeners: ((state: AuthState) => void)[] = [];
  private state: AuthState = {
    user: null,
    token: null,
    isLoading: true
  };

  constructor() {
    this.loadStoredAuth();
    this.state.isLoading = false;
    this.notifyListeners();
  }

  private loadStoredAuth() {
    if (typeof window === 'undefined') return;

    try {
      const token = localStorage.getItem(this.tokenKey);
      const userStr = localStorage.getItem(this.userKey);

      if (token && userStr) {
        this.state.token = token;
        this.state.user = JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error);
      this.logout();
    }
  }

  private saveAuth(token: string, user: User) {
    if (typeof window === 'undefined') return;

    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private clearAuth() {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    // Immediately call with current state
    listener(this.state);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getState(): AuthState {
    return { ...this.state };
  }

  async login(email: string, password: string) {
    try {
      const response = await api.login({ email, password });

      if (response.token && response.user) {
        this.state.user = response.user;
        this.state.token = response.token;
        this.saveAuth(response.token, response.user);
        this.notifyListeners();
        return response;
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(data: { email: string; password: string; username: string; fullname: string }) {
    try {
      const response = await api.register(data);

      if (response.token && response.user) {
        this.state.user = response.user;
        this.state.token = response.token;
        this.saveAuth(response.token, response.user);
        this.notifyListeners();
        return response;
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  logout() {
    this.state.user = null;
    this.state.token = null;
    this.clearAuth();
    this.notifyListeners();
  }

  updateUser(user: Partial<User>) {
    if (this.state.user) {
      this.state.user = { ...this.state.user, ...user };
      this.saveAuth(this.state.token!, this.state.user);
      this.notifyListeners();
    }
  }

  getToken(): string | null {
    return this.state.token;
  }

  getUser(): User | null {
    return this.state.user;
  }

  isAuthenticated(): boolean {
    return !!this.state.token && !!this.state.user;
  }
}

// Create singleton instance
export const authManager = new AuthManager();

// React hook for using auth state
export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, token: null, isLoading: true });

  useEffect(() => {
    return authManager.subscribe(setState);
  }, []);

  const isAuthenticated = !!state.token && !!state.user;

  return {
    ...state,
    isAuthenticated,
    login: authManager.login.bind(authManager),
    register: authManager.register.bind(authManager),
    logout: authManager.logout.bind(authManager),
    updateUser: authManager.updateUser.bind(authManager),
    getToken: () => authManager.getToken(),
  };
}
