type NotificationType = 'success' | 'error' | 'info' | 'warning'

export function showNotification(
  isSuccess: boolean,
  title: string,
  message: string,
  duration = 5000,
): void {
  // This function will be called from components that have access to useNotification
  // It's a placeholder that matches the signature for easy migration
  const type: NotificationType = isSuccess ? 'success' : 'error'

  // In components, this should be replaced with:
  // const { showNotification } = useNotification()
  // showNotification(type, title, message, duration)

  console.warn(
    'showNotification called without context. Use useNotification hook instead.',
    { type, title, message, duration },
  )
}
