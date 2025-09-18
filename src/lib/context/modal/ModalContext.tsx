'use client'

import React, {
  createContext,
  useContext,
  useState,
  JSX,
  ReactNode,
} from 'react'
import { IModalState } from '@/types/modal/IModalState'

interface ModalContextProps {
  modal: IModalState
  // eslint-disable-next-line no-unused-vars
  openModal: (modal: IModalState) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined)

export function ModalProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  const [modal, setModal] = useState<IModalState>({ type: null, data: null })

  const openModal = (modalState: IModalState): void => setModal(modalState)
  const closeModal = (): void => setModal({ type: null, data: null })

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal(): ModalContextProps {
  const context = useContext(ModalContext)
  if (!context) throw new Error('useModal must be used within ModalProvider')
  return context
}
