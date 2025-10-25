'use client'

import React, { JSX, useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { CryButton, CryTextField } from '@420cry/420cry-lib'
import { useAuthStore } from '@/store'
import {
  CurrencyService,
  CurrencyCode,
  showToast,
  useCurrencyPreference,
} from '@/lib'

export const UserSettings = (): JSX.Element => {
  const t = useTranslations('settings')
  const { user } = useAuthStore()
  const { selectedCurrency, changeCurrency, formatAmount } =
    useCurrencyPreference()
  const [activeTab, setActiveTab] = useState<
    'profile' | 'security' | 'preferences'
  >('profile')
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
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

  const handleSaveUsername = async () => {
    try {
      if (user && formData.username !== user.username) {
        // TODO: Implement update username API call
        console.log('Updating username:', formData.username)
        // await updateUsername(formData.username)
        setIsEditingUsername(false)
      }
    } catch (error) {
      console.error('Error updating username:', error)
      // TODO: Handle error (show notification, etc.)
    }
  }

  const handleSaveEmail = async () => {
    try {
      if (user && formData.email !== user.email) {
        // TODO: Implement update email API call
        console.log('Updating email:', formData.email)
        // await updateEmail(formData.email)
        setIsEditingEmail(false)
      }
    } catch (error) {
      console.error('Error updating email:', error)
      // TODO: Handle error (show notification, etc.)
    }
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

  const handleCancelUsernameEdit = () => {
    if (user) {
      setFormData((prev) => ({ ...prev, username: user.username }))
    }
    setIsEditingUsername(false)
  }

  const handleCancelEmailEdit = () => {
    if (user) {
      setFormData((prev) => ({ ...prev, email: user.email }))
    }
    setIsEditingEmail(false)
  }

  const handleCancelPasswordChange = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setIsChangingPassword(false)
  }

  const handleCurrencyChange = (currency: CurrencyCode) => {
    changeCurrency(currency)
    showToast(
      true,
      `${t('preferences.currency.currentCurrency')}: ${CurrencyService.getCurrencySymbol(currency)}`,
    )
  }

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
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                {/* Profile Header Card */}
                <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-6 mb-6">
                      {/* Profile Avatar */}
                      <div className="relative">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-lg">
                          <span className="text-3xl font-bold text-white">
                            {userData.fullname?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">
                          {userData.fullname || 'User'}
                        </h1>
                        <p className="text-blue-100 text-lg mb-1">
                          @{userData.username || 'username'}
                        </p>
                        <p className="text-blue-200 text-sm">
                          {userData.email || ''}
                        </p>
                      </div>
                    </div>

                    {/* Portfolio Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold">
                          {formatAmount(24567)}
                        </div>
                        <div className="text-blue-200 text-sm">
                          Portfolio Value
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-green-400">
                          +12.5%
                        </div>
                        <div className="text-blue-200 text-sm">24h Change</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold">8</div>
                        <div className="text-blue-200 text-sm">Assets</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Settings Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {t('profile.title')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('profile.subtitle')}
                    </p>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-6">
                    {/* Username Field */}
                    <div
                      className={`bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 transition-all duration-300 ${
                        isEditingUsername
                          ? 'ring-2 ring-blue-500/20 bg-blue-50/50 dark:bg-blue-900/20'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-blue-600 dark:text-blue-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {t('profile.fields.username')}
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Your unique username
                            </p>
                          </div>
                        </div>
                        {!isEditingUsername && (
                          <CryButton
                            onClick={() => setIsEditingUsername(true)}
                            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
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
                          </CryButton>
                        )}
                      </div>

                      <CryTextField
                        name="username"
                        modelValue={formData.username}
                        placeholder={t('profile.fields.username')}
                        onChange={(event) =>
                          handleInputChange(
                            'username',
                            (event.target as HTMLInputElement).value,
                          )
                        }
                        disabled={!isEditingUsername}
                        className={`w-full transition-all duration-200 ${
                          isEditingUsername ? 'ring-2 ring-blue-500/50' : ''
                        }`}
                      />

                      {isEditingUsername && (
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                          <CryButton
                            onClick={handleSaveUsername}
                            iconLeft={
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
                            }
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                          >
                            Save Changes
                          </CryButton>
                          <CryButton
                            onClick={handleCancelUsernameEdit}
                            iconLeft={
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
                            }
                            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium"
                          >
                            Cancel
                          </CryButton>
                        </div>
                      )}
                    </div>

                    {/* Email Field */}
                    <div
                      className={`bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 transition-all duration-300 ${
                        isEditingEmail
                          ? 'ring-2 ring-blue-500/20 bg-blue-50/50 dark:bg-blue-900/20'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-purple-600 dark:text-purple-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {t('profile.fields.email')}
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Your email address
                            </p>
                          </div>
                        </div>
                        {!isEditingEmail && (
                          <CryButton
                            onClick={() => setIsEditingEmail(true)}
                            className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200"
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
                          </CryButton>
                        )}
                      </div>

                      <CryTextField
                        name="email"
                        type="email"
                        modelValue={formData.email}
                        placeholder={t('profile.fields.email')}
                        onChange={(event) =>
                          handleInputChange(
                            'email',
                            (event.target as HTMLInputElement).value,
                          )
                        }
                        disabled={!isEditingEmail}
                        className={`w-full transition-all duration-200 ${
                          isEditingEmail ? 'ring-2 ring-purple-500/50' : ''
                        }`}
                      />

                      {isEditingEmail && (
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                          <CryButton
                            onClick={handleSaveEmail}
                            iconLeft={
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
                            }
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                          >
                            Save Changes
                          </CryButton>
                          <CryButton
                            onClick={handleCancelEmailEdit}
                            iconLeft={
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
                            }
                            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium"
                          >
                            Cancel
                          </CryButton>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                      {t('profile.accountInfo')}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 2FA Status */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-blue-600 dark:text-blue-400"
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
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {t('profile.twoFAStatus')}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {userData.twoFAEnabled
                                ? t('profile.enabled')
                                : t('profile.disabled')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Account Status */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-blue-600 dark:text-blue-400"
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
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              Account Status
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Active & Verified
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                        color="danger"
                        variant="solid"
                        size="lg"
                        className="flex items-center gap-2 px-6 py-3"
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
                          onChange={(event) =>
                            handlePasswordChange(
                              'currentPassword',
                              (event.target as HTMLInputElement).value,
                            )
                          }
                          className="w-full"
                        />
                        <CryTextField
                          name="newPassword"
                          type="password"
                          modelValue={passwordData.newPassword}
                          placeholder={t('security.password.newPassword')}
                          onChange={(event) =>
                            handlePasswordChange(
                              'newPassword',
                              (event.target as HTMLInputElement).value,
                            )
                          }
                          className="w-full"
                        />
                        <CryTextField
                          name="confirmPassword"
                          type="password"
                          modelValue={passwordData.confirmPassword}
                          placeholder={t('security.password.confirmPassword')}
                          onChange={(event) =>
                            handlePasswordChange(
                              'confirmPassword',
                              (event.target as HTMLInputElement).value,
                            )
                          }
                          className="w-full"
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <CryButton
                          onClick={handleChangePassword}
                          color="danger"
                          variant="solid"
                          size="lg"
                          className="flex items-center gap-2 px-6 py-3"
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
                          color="default"
                          variant="outline"
                          size="lg"
                          className="flex items-center gap-2 px-6 py-3"
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
                      color={userData.twoFAEnabled ? 'danger' : 'success'}
                      variant="solid"
                      size="lg"
                      className="flex items-center gap-2 px-6 py-3"
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

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                {/* Currency Preferences */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {t('preferences.currency.title')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('preferences.currency.subtitle')}
                    </p>
                  </div>

                  {/* Current Currency Display */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <span className="text-lg">💱</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {t('preferences.currency.currentCurrency')}
                        </p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {CurrencyService.getCurrencySymbol(selectedCurrency)}{' '}
                          {selectedCurrency}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Currency Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {t('preferences.currency.selectCurrency')}
                    </h3>

                    {/* Popular Currencies */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Popular Currencies
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {[
                          'USD',
                          'EUR',
                          'GBP',
                          'JPY',
                          'CAD',
                          'AUD',
                          'CHF',
                          'CNY',
                        ].map((currency) => (
                          <CryButton
                            key={currency}
                            onClick={() =>
                              handleCurrencyChange(currency as CurrencyCode)
                            }
                            color={
                              selectedCurrency === currency
                                ? 'primary'
                                : 'default'
                            }
                            variant={
                              selectedCurrency === currency
                                ? 'solid'
                                : 'outline'
                            }
                            size="md"
                            className="p-4 min-h-[60px]"
                          >
                            <div className="text-center flex flex-col items-center justify-center h-full">
                              <div className="text-xl font-bold mb-1">
                                {CurrencyService.getCurrencySymbol(
                                  currency as CurrencyCode,
                                )}
                              </div>
                              <div className="text-sm font-medium">
                                {currency}
                              </div>
                            </div>
                          </CryButton>
                        ))}
                      </div>
                    </div>

                    {/* All Currencies */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        All Currencies
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {CurrencyService.getAllCurrencies().map((currency) => (
                          <CryButton
                            key={currency}
                            onClick={() => handleCurrencyChange(currency)}
                            color={
                              selectedCurrency === currency
                                ? 'primary'
                                : 'default'
                            }
                            variant={
                              selectedCurrency === currency
                                ? 'solid'
                                : 'outline'
                            }
                            size="md"
                            className="p-4 min-h-[60px]"
                          >
                            <div className="text-center">
                              <div className="text-lg font-bold">
                                {CurrencyService.getCurrencySymbol(currency)}
                              </div>
                              <div className="text-xs">{currency}</div>
                            </div>
                          </CryButton>
                        ))}
                      </div>
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
