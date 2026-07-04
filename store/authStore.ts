import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  schoolId?: string;
  schoolName?: string;
  image?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => set({ user, token }),
  clearAuth: () => set({ user: null, token: null }),
}));
