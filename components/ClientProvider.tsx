"use client";

import React, { createContext, useContext, useState } from "react";

interface ClientState {
  user: object | null;
  theme: "light" | "dark";
}

interface ClientContextType {
  clientState: ClientState;
  setClientState: React.Dispatch<React.SetStateAction<ClientState>>;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
};

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clientState, setClientState] = useState<ClientState>({
    user: null,
    theme: "light",
  });

  return (
    <ClientContext value={{ clientState, setClientState }}>
      {children}
    </ClientContext>
  );
};
