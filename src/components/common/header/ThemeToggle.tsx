'use client'

import { JSX } from 'react'
import { useTheme } from '@/lib'
import { SunIcon, MoonIcon } from '@420cry/420cry-lib'

const ThemeToggle = (): JSX.Element => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Sun Icon */}
      <SunIcon
        className={`w-4 h-4 transition-colors duration-300 ease-in-out ${
          theme === 'light' ? 'text-yellow-500' : 'text-gray-400'
        }`}
      />

      {/* Toggle Button */}
      <button
        onClick={toggleTheme}
        className="relative flex items-center w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <span
          className={`absolute w-5 h-5 rounded-full bg-blue-500 left-0.5 transition-all duration-300 ease-in-out shadow-sm ${
            theme === 'light' ? 'translate-x-0' : 'translate-x-6'
          }`}
        />
      </button>

      {/* Moon Icon */}
      <MoonIcon
        className={`w-4 h-4 transition-colors duration-300 ease-in-out ${
          theme === 'dark' ? 'text-blue-400' : 'text-gray-400'
        }`}
      />
    </div>
  )
}

export default ThemeToggle
