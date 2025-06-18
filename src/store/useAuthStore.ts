import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { IUser } from '@/types'

interface AuthState {
  user: IUser | null
  setUser: (user: IUser) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
