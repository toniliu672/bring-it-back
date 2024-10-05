"use client";

import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import "./globals.css";
import SessionProvider from "@/providers/SessionProvider";
// import { Navbar } from "@/components";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black dark:bg-gray-900 dark:text-white`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* <Navbar
            logo="/logo.png"
            navItems={[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
            ]}
          /> */}
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
