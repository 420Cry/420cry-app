'use client'

import { createContext, useContext, useState, ReactNode, JSX } from 'react'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  duration?: number
}

interface NotificationContextProps {
  notifications: Notification[]
  showNotification: (
    type: Notification['type'],
    title: string,
    message: string,
    duration?: number,
  ) => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined,
)

export function NotificationProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const removeNotification = (id: string): void => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const showNotification = (
    type: Notification['type'],
    title: string,
    message: string,
    duration = 5000,
  ): void => {
    const id = Math.random().toString(36).substring(7)
    const notification: Notification = { id, type, title, message, duration }

    setNotifications((prev) => [...prev, notification])

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
  }

  return (
    <NotificationContext.Provider
      value={{ notifications, showNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification(): NotificationContextProps {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}
