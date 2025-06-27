import { create, createStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface languageState {
  languageState: 'EN' | 'VN'
  // eslint-disable-next-line no-unused-vars
  setLanguage: (newLanguage: languageState['languageState']) => void
}

export const useLanguageStore = create<languageState>()(
  persist(
    (set) => ({
      languageState: 'EN',
      setLanguage: (newLanguage: 'EN' | 'VN') =>
        set({ languageState: newLanguage }),
    }),
    {
      name: 'language-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
