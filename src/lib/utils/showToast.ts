import { toast } from 'react-hot-toast'

export function showToast(
  isSuccess: boolean,
  message: string,
  duration = 5000,
): void {
  const options = {
    duration,
    position: 'bottom-right' as const,
    style: {
      background: 'rgba(8, 11, 26, 0.95)', // neutralDark with transparency
      color: '#ffffff',
      padding: '16px 20px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      maxWidth: '420px',
      minWidth: '300px',
      wordWrap: 'break-word' as const,
      border: isSuccess
        ? '1px solid oklch(0.75 0.1271 164.59)' // success color
        : '1px solid oklch(0.59 0.1788 24.53)', // danger color
      boxShadow:
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(12px)',
    },
    iconTheme: {
      primary: '#ffffff',
      secondary: isSuccess
        ? 'oklch(0.75 0.1271 164.59)' // success color
        : 'oklch(0.59 0.1788 24.53)', // danger color
    },
    className: 'toast-custom',
  }

  toast[isSuccess ? 'success' : 'error'](message, options)
}
