'use client'

import React, { createContext, useContext, useState } from 'react'
import { ModalState } from '@/types/modal/ModalState'

interface ModalContextProps {
  modal: ModalState
  openModal: (modal: ModalState) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalState>({ type: null, data: null })

  const openModal = (modalState: ModalState) => {
    setModal(modalState)
  }

  const closeModal = () => {
    setModal({ type: null, data: null })
  }

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within ModalProvider')
  }
  return context
}
