import { toast } from 'react-hot-toast'

export function showToast(
  success: boolean,
  message: string,
  duration: number = 5000,
): void {
  toast[success ? 'success' : 'error'](message, {
    duration,
  })
}
