'use client'

import React, { JSX, useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { CryButton, CryTextField } from '@420cry/420cry-lib'
import { useAuthStore } from '@/store'

export const UserSettings = (): JSX.Element => {
  const t = useTranslations('settings')
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Get user data from store
  const userData = user || {
    uuid: '',
    fullname: '',
    email: '',
    username: '',
    twoFAEnabled: false,
    rememberMe: false,
  }

  const [formData, setFormData] = useState({
    email: '',
    username: '',
  })

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        username: user.username,
      })
    }
  }, [user])

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = () => {
    // TODO: Implement save profile logic
    setIsEditing(false)
  }

  const handleChangePassword = () => {
    // TODO: Implement change password logic
    setIsChangingPassword(false)
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  const handleCancelEdit = () => {
    if (user) {
      setFormData({
        email: user.email,
        username: user.username,
      })
    }
    setIsEditing(false)
  }

  const handleCancelPasswordChange = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setIsChangingPassword(false)
  }

  const tabs = [
    { id: 'profile', label: t('tabs.profile'), icon: '👤' },
    { id: 'security', label: t('tabs.security'), icon: '🔒' },
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
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {t('profile.title')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('profile.subtitle')}
                    </p>
                  </div>
                  {!isEditing && (
                    <CryButton
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      {t('profile.editButton')}
                    </CryButton>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {userData.fullname?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {userData.fullname || 'User'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        @{userData.username || 'username'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {userData.email || ''}
                      </p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ${
                      isEditing
                        ? 'bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800'
                        : ''
                    }`}
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('profile.fields.username')}
                      </label>
                      <CryTextField
                        name="username"
                        modelValue={formData.username}
                        placeholder={t('profile.fields.username')}
                        onChange={(value) =>
                          handleInputChange('username', value)
                        }
                        disabled={!isEditing}
                        className={`w-full transition-all duration-200 ${
                          isEditing
                            ? 'ring-2 ring-blue-200 dark:ring-blue-800'
                            : ''
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('profile.fields.email')}
                      </label>
                      <CryTextField
                        name="email"
                        type="email"
                        modelValue={formData.email}
                        placeholder={t('profile.fields.email')}
                        onChange={(value) => handleInputChange('email', value)}
                        disabled={!isEditing}
                        className={`w-full transition-all duration-200 ${
                          isEditing
                            ? 'ring-2 ring-blue-200 dark:ring-blue-800'
                            : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      {t('profile.accountInfo')}
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-purple-600 dark:text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {t('profile.rememberMe')}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {userData.rememberMe
                            ? t('profile.enabled')
                            : t('profile.disabled')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex items-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <CryButton
                        onClick={handleSaveProfile}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {t('profile.saveButton')}
                      </CryButton>
                      <CryButton
                        onClick={handleCancelEdit}
                        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        {t('profile.cancelButton')}
                      </CryButton>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Password Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t('security.password.title')}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {t('security.password.subtitle')}
                      </p>
                    </div>
                    {!isChangingPassword && (
                      <CryButton
                        onClick={() => setIsChangingPassword(true)}
                        className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                          />
                        </svg>
                        {t('security.password.changeButton')}
                      </CryButton>
                    )}
                  </div>

                  {isChangingPassword ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-6">
                        <CryTextField
                          name="currentPassword"
                          type="password"
                          modelValue={passwordData.currentPassword}
                          placeholder={t('security.password.currentPassword')}
                          onChange={(value) =>
                            handlePasswordChange('currentPassword', value)
                          }
                          className="w-full"
                        />
                        <CryTextField
                          name="newPassword"
                          type="password"
                          modelValue={passwordData.newPassword}
                          placeholder={t('security.password.newPassword')}
                          onChange={(value) =>
                            handlePasswordChange('newPassword', value)
                          }
                          className="w-full"
                        />
                        <CryTextField
                          name="confirmPassword"
                          type="password"
                          modelValue={passwordData.confirmPassword}
                          placeholder={t('security.password.confirmPassword')}
                          onChange={(value) =>
                            handlePasswordChange('confirmPassword', value)
                          }
                          className="w-full"
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <CryButton
                          onClick={handleChangePassword}
                          className="flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {t('security.password.updateButton')}
                        </CryButton>
                        <CryButton
                          onClick={handleCancelPasswordChange}
                          className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 px-4 py-2 rounded-lg"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          {t('security.password.cancelButton')}
                        </CryButton>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-gray-500 dark:text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {t('security.password.lastChanged')}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t('security.password.neverChanged')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2FA Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t('security.twoFactor.title')}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {t('security.twoFactor.subtitle')}
                      </p>
                    </div>
                    <CryButton
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        userData.twoFAEnabled
                          ? 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      {userData.twoFAEnabled
                        ? t('security.twoFactor.disable')
                        : t('security.twoFactor.enable')}
                    </CryButton>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        userData.twoFAEnabled
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 ${
                          userData.twoFAEnabled
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {userData.twoFAEnabled
                          ? t('security.twoFactor.enabled')
                          : t('security.twoFactor.disabled')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {userData.twoFAEnabled
                          ? t('security.twoFactor.enabledDesc')
                          : t('security.twoFactor.disabledDesc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
