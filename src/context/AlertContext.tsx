'use client'
import React, { createContext, useState, useContext, ReactNode } from 'react'
import { IAlertContext, IAlert } from '../types'

const AlertContext = createContext<IAlertContext | undefined>(undefined)

export const useAlert = (): IAlertContext => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
}

interface AlertProviderProps {
  children: ReactNode
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alert, setAlertState] = useState<IAlert>({
    message: '',
    show: false,
    type: 'danger',
  })

  const setAlert = (alert: IAlert) => setAlertState(alert)

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      {children}
    </AlertContext.Provider>
  )
}
