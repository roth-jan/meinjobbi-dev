import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AccountType, Student, Company } from '@/types';

interface AuthState {
  user: User | null;
  student: Student | null;
  company: Company | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setStudent: (student: Student | null) => void;
  setCompany: (company: Company | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string, student?: Student | null, company?: Company | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      student: null,
      company: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setStudent: (student) => set({ student }),

      setCompany: (company) => set({ company }),

      setToken: (token) => set({ token }),

      login: (user, token, student = null, company = null) =>
        set({
          user,
          student,
          company,
          token,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          student: null,
          company: null,
          token: null,
          isAuthenticated: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'jobbi-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        student: state.student,
        company: state.company,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setLoading(false);
      },
    }
  )
);

// Selector hooks for common use cases
export const useUser = () => useAuthStore((state) => state.user);
export const useStudent = () => useAuthStore((state) => state.student);
export const useCompany = () => useAuthStore((state) => state.company);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);

