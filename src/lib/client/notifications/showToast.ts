import { toast } from 'react-hot-toast'

export function showToast(
  isSuccess: boolean,
  message: string,
  duration = 5000,
): void {
  toast[isSuccess ? 'success' : 'error'](message, {
    duration,
  })
}
