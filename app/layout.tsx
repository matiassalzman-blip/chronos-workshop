import "../styles/globals.css";

import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/context/providers";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Dualboot Prototype Starter",
  description:
    "A high-fidelity UI prototype starter built on Next.js, Tailwind CSS, and shadcn/ui."
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/assets/images/favicon.png" />
      </head>

      <body className="overflow-y-scroll-auto font-base relative min-h-screen w-full overflow-x-hidden scroll-smooth font-sans antialiased">
        <Providers>
          <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-950">
            <Header />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
