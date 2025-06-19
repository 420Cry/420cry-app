'use client'

import { JSX, useState } from 'react'
import { CryButton, CryTextField } from '@420cry/420cry-lib'

const TwoFactorVerifyForm = (): JSX.Element => {
  const [otp, setOtp] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 border border-gray-200">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Two-Factor Authentication
        </h1>
        <p className="text-gray-600 text-sm text-center mb-6">
          Open your authenticator app (like Google Authenticator, Authy, or
          1Password) and enter the 6-digit code below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <CryTextField
            modelValue={otp}
            onChange={setOtp}
            placeholder="Enter 6-digit code"
            className="w-full"
            shape="rounded"
            name={''}
          />

          <CryButton
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            rounded
          >
            Verify Code
          </CryButton>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't see the code? Make sure your authenticator app is synced and the
          QR code was scanned correctly during setup.
        </p>
      </div>
    </div>
  )
}

export default TwoFactorVerifyForm
