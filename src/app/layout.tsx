"use client";

import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import "./globals.css";
import SessionProvider from "@/providers/SessionProvider";

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
      <head>
        {/* Menambahkan favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo.png" />
        <title>Peta Okupasi Minahasa</title>

        {/* SEO Meta Tags */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Peta Okupasi Sekolah Menengah Kejuruan (SMK) Sulawesi Utara"
        />
        <meta
          name="keywords"
          content="okupasi, sekolah mengengah kejuruan, SMK, smk, kode okupasi, minahasa, sulut, sulawesi utara, smk sulawesi utara, sulawesi"
        />
        <meta name="author" content="Universitas Negeri Manado" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen overflow-hidden`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
