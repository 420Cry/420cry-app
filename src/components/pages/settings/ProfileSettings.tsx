'use client'

import React, { JSX, useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {
  CryButton,
  CryTextField,
  CheckCircleSolidIcon,
  UserSolidIcon,
  MailIcon,
  LockIcon,
  EditIcon,
  XIcon,
  SuccessCheckIcon,
} from '@420cry/420cry-lib'
import { useAuthStore } from '@/store'
import { showToast, useCurrencyPreference } from '@/lib'

export const ProfileSettings = (): JSX.Element => {
  const t = useTranslations('settings')
  const { user } = useAuthStore()
  const { formatAmount } = useCurrencyPreference()
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)

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

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        username: user.username,
      })
    }
  }, [user])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveUsername = async () => {
    try {
      if (user && formData.username !== user.username) {
        // TODO: Implement update username API call
        // await updateUsername(formData.username)
        setIsEditingUsername(false)
      }
    } catch (error) {
      showToast(false, t('profile.errorUpdateUsername'))
      console.error('Error updating username:', error)
    }
  }

  const handleSaveEmail = async () => {
    try {
      if (user && formData.email !== user.email) {
        // TODO: Implement update email API call
        // await updateEmail(formData.email)
        setIsEditingEmail(false)
      }
    } catch (error) {
      showToast(false, t('profile.errorUpdateEmail'))
      console.error('Error updating email:', error)
    }
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

  return (
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
                <CheckCircleSolidIcon className="w-4 h-4 text-white" />
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
              <p className="text-blue-200 text-sm">{userData.email || ''}</p>
            </div>
          </div>

          {/* Portfolio Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{formatAmount(24567)}</div>
              <div className="text-blue-200 text-sm">Portfolio Value</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">+12.5%</div>
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
                  <UserSolidIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
                  <EditIcon className="w-4 h-4" />
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
                  iconLeft={<CheckCircleSolidIcon className="w-4 h-4" />}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                >
                  Save Changes
                </CryButton>
                <CryButton
                  onClick={handleCancelUsernameEdit}
                  iconLeft={<XIcon className="w-4 h-4" />}
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
                  <MailIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
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
                  <EditIcon className="w-4 h-4" />
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
                  iconLeft={<SuccessCheckIcon className="w-4 h-4" />}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                >
                  Save Changes
                </CryButton>
                <CryButton
                  onClick={handleCancelEmailEdit}
                  iconLeft={<XIcon className="w-4 h-4" />}
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
                  <LockIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
                  <SuccessCheckIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
  )
}
