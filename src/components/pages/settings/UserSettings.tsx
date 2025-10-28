'use client'

import React, { JSX, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CryButton } from '@420cry/420cry-lib'
import { ProfileSettings } from './ProfileSettings'
import { SecuritySettings } from './SecuritySettings'
import { PreferencesSettings } from './PreferencesSettings'

export const UserSettings = (): JSX.Element => {
  const t = useTranslations('settings')
  const [activeTab, setActiveTab] = useState<
    'profile' | 'security' | 'preferences'
  >('profile')

  const tabs = [
    { id: 'profile', label: t('tabs.profile'), icon: '👤' },
    { id: 'security', label: t('tabs.security'), icon: '🔒' },
    { id: 'preferences', label: t('tabs.preferences'), icon: '⚙️' },
  ] as const

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('title')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <CryButton
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    iconLeft={
                      <span className="text-lg leading-none">{tab.icon}</span>
                    }
                    className={`w-full flex items-center justify-start px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="font-medium">{tab.label}</span>
                  </CryButton>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && <ProfileSettings />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'preferences' && <PreferencesSettings />}
          </div>
        </div>
      </div>
    </div>
  )
}
