"use client";

import { useAlert } from "@/src/context/AlertContext";
import { CryAlert } from "@420cry/420cry-lib";
import { JSX, ReactNode } from "react";

const ClientLayout = ({ children }: { children: ReactNode }): JSX.Element => {
  const { alert } = useAlert();

  return (
    <>
      {alert.show && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-80 p-4 z-50">
          <CryAlert type={alert.type} containerClass="w-80" title={""}>
            {alert.message}
          </CryAlert>
        </div>
      )}
      {children}
    </>
  );
};

export default ClientLayout;
