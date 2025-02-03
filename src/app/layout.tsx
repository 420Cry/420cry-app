import type { Metadata } from "next";
import "./globals.css";
import { AlertProvider } from "@/src/context/AlertContext";
import ClientLayout from "./ClientLayout";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "420Crypto",
  description: "420Cry-app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <html lang="en">
      <body className="antialiased">
        <AlertProvider>
          <ClientLayout>{children}</ClientLayout>
        </AlertProvider>
      </body>
    </html>
  );
}
