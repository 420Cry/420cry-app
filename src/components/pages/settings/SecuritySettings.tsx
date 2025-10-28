'use client'

import React, { JSX, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  CryButton,
  CryTextField,
  LockIcon,
  ShieldIcon,
  XIcon,
  SuccessCheckIcon,
  KeyIcon,
} from '@420cry/420cry-lib'
import { useAuthStore } from '@/store'

export const SecuritySettings = (): JSX.Element => {
  const t = useTranslations('settings')
  const { user } = useAuthStore()
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const userData = user || {
    uuid: '',
    fullname: '',
    email: '',
    username: '',
    twoFAEnabled: false,
    rememberMe: false,
  }

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }))
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

  const handleCancelPasswordChange = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setIsChangingPassword(false)
  }

  return (
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
              <KeyIcon className="w-4 h-4" />
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
                <SuccessCheckIcon className="w-4 h-4" />
                {t('security.password.updateButton')}
              </CryButton>
              <CryButton
                onClick={handleCancelPasswordChange}
                color="default"
                variant="outline"
                size="lg"
                className="flex items-center gap-2 px-6 py-3"
              >
                <XIcon className="w-4 h-4" />
                {t('security.password.cancelButton')}
              </CryButton>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <LockIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
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
            <LockIcon className="w-4 h-4" />
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
            <ShieldIcon
              className={`w-5 h-5 ${
                userData.twoFAEnabled
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            />
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
  )
}
