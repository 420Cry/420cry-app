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
import {
  showToast,
  useCurrencyPreference,
  useTwoFactorService,
  useSettingsService,
} from '@/lib'
import { SetUpTwoFA } from './SetUpTwoFA'

export const ProfileSettings = (): JSX.Element => {
  const t = useTranslations('settings')
  const tApp = useTranslations()
  const { user, setUser } = useAuthStore()
  const { formatAmount } = useCurrencyPreference()
  const twoFactorService = useTwoFactorService()
  const settingsService = useSettingsService()
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [show2FAVerification, setShow2FAVerification] = useState(false)
  const [show2FASetup, setShow2FASetup] = useState(false)
  const [otp, setOtp] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [savingUsername, setSavingUsername] = useState(false)

  const userData = user || {
    uuid: '',
    fullname: '',
    email: '',
    username: '',
    twoFAEnabled: false,
    rememberMe: false,
  }

  const [formData, setFormData] = useState({
    username: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
      })
    }
  }, [user])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleStartUsernameEdit = () => {
    if (user?.twoFAEnabled) {
      // Show 2FA verification modal before allowing edit
      setShow2FAVerification(true)
    } else {
      // Directly allow edit if 2FA is not enabled
      setIsEditingUsername(true)
    }
  }

  const handle2FAVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp.trim()) {
      showToast(false, tApp('app.messages.error.otpCannotBeEmpty'))
      return
    }

    if (!user?.uuid) {
      showToast(false, tApp('app.messages.error.general'))
      return
    }

    setVerifying(true)
    try {
      const response = await twoFactorService.verify.verifyToken({
        userUUID: user.uuid,
        otp,
        rememberMe: user.rememberMe,
      })

      if (response.isSuccess) {
        setShow2FAVerification(false)
        setIsEditingUsername(true)
        setOtp('')
        showToast(true, tApp('app.messages.success.2FAVerifySuccessful'))
      } else {
        showToast(false, tApp(response.message))
      }
    } catch {
      showToast(false, tApp('app.messages.error.general'))
    } finally {
      setVerifying(false)
    }
  }

  const handleClose2FAModal = () => {
    setShow2FAVerification(false)
    setOtp('')
  }

  const handleSaveUsername = async () => {
    if (!user || formData.username === user.username) return

    setSavingUsername(true)
    try {
      const response =
        await settingsService.updateUserAccountName.updateUsername({
          username: formData.username,
        })
      if (response.isSuccess) {
        // Update user in store with new username
        setUser({
          ...user,
          username: formData.username,
        })
        showToast(true, t('profile.usernameUpdated'))
        setIsEditingUsername(false)
      } else {
        showToast(false, tApp(response.message))
      }
    } catch (error) {
      showToast(false, t('profile.errorUpdateUsername'))
      console.error('Error updating username:', error)
    } finally {
      setSavingUsername(false)
    }
  }

  const handleCancelUsernameEdit = () => {
    if (user) {
      setFormData((prev) => ({ ...prev, username: user.username }))
    }
    setIsEditingUsername(false)
  }

  const handleSetup2FA = () => {
    setShow2FASetup(true)
  }

  const handle2FASetupSuccess = () => {
    setShow2FASetup(false)
  }

  const handle2FASetupClose = () => {
    setShow2FASetup(false)
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
                    {t('profile.uniqueUsername')}
                  </p>
                </div>
              </div>
              {!isEditingUsername && (
                <CryButton
                  onClick={handleStartUsernameEdit}
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
                  disabled={
                    !formData.username.trim() ||
                    formData.username === user?.username ||
                    savingUsername
                  }
                  iconLeft={<CheckCircleSolidIcon className="w-4 h-4" />}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-all duration-200"
                >
                  {savingUsername
                    ? tApp('app.common.loading')
                    : t('profile.saveChanges')}
                </CryButton>
                <CryButton
                  onClick={handleCancelUsernameEdit}
                  disabled={savingUsername}
                  iconLeft={<XIcon className="w-4 h-4" />}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium"
                >
                  {tApp('app.common.cancel')}
                </CryButton>
              </div>
            )}
          </div>

          {/* Email Field - Read Only */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <MailIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {t('profile.fields.email')}
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userData.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            {t('profile.accountInfo')}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 2FA Status */}
            <div
              className={`rounded-xl p-4 border ${
                userData.twoFAEnabled
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800'
                  : 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      userData.twoFAEnabled
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : 'bg-orange-100 dark:bg-orange-900/30'
                    }`}
                  >
                    <LockIcon
                      className={`w-5 h-5 ${
                        userData.twoFAEnabled
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-orange-600 dark:text-orange-400'
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {t('profile.twoFAStatus')}
                    </p>
                    <p
                      className={`text-xs font-medium ${
                        userData.twoFAEnabled
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-orange-700 dark:text-orange-400'
                      }`}
                    >
                      {userData.twoFAEnabled
                        ? t('profile.enabled')
                        : t('profile.disabled')}
                    </p>
                  </div>
                </div>
                {!userData.twoFAEnabled && (
                  <CryButton
                    onClick={handleSetup2FA}
                    className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {t('profile.setup2FAButton')}
                  </CryButton>
                )}
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
                    {t('profile.accountStatus')}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {t('profile.activeVerified')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2FA Verification Modal */}
      {show2FAVerification && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <LockIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('profile.verify2FA')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t('profile.verify2FADescription')}
              </p>
            </div>

            <form onSubmit={handle2FAVerify} className="space-y-6">
              <div>
                <CryTextField
                  modelValue={otp}
                  onChange={(event) => {
                    const value = (event.target as HTMLInputElement).value
                    // Limit to 6 characters
                    setOtp(value.slice(0, 6))
                  }}
                  placeholder="Enter 6-digit code"
                  name="otp"
                  type="text"
                  className="text-center text-2xl font-mono tracking-widest px-4 py-3 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-300 rounded-xl"
                />
              </div>

              <div className="flex gap-3">
                <CryButton
                  type="button"
                  onClick={handleClose2FAModal}
                  disabled={verifying}
                  className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium"
                >
                  {tApp('app.common.cancel')}
                </CryButton>
                <CryButton
                  type="submit"
                  disabled={verifying || !otp.trim()}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium"
                >
                  {verifying
                    ? tApp('app.common.loading')
                    : tApp('app.common.verify')}
                </CryButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2FA Setup Modal */}
      {show2FASetup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <SetUpTwoFA
            onClose={handle2FASetupClose}
            onSuccess={handle2FASetupSuccess}
          />
        </div>
      )}
    </div>
  )
}
