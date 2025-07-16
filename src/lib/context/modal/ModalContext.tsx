'use client'

import React, {
  JSX,
  ReactNode,
  createContext,
  useContext,
  useState,
} from 'react'
import { ModalState } from '@/types/modal/ModalState'

interface ModalContextProps {
  modal: ModalState
  // eslint-disable-next-line no-unused-vars
  openModal: (modal: ModalState) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined)

export function ModalProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  const [modal, setModal] = useState<ModalState>({ type: null, data: null })

  const openModal = (modalState: ModalState): void => {
    setModal(modalState)
  }

  const closeModal = (): void => {
    setModal({ type: null, data: null })
  }

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal(): ModalContextProps {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within ModalProvider')
  }
  return context
}
