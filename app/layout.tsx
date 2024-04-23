import ThemeProvider from "@components/providers/theme-provider";
import ToasterProvider from "@components/providers/toaster-provider";
import "@styles/globals.css";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lookback Admin",
  description: "Lookback administration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ToasterProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
