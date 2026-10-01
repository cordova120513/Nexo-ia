import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NEXO.IA — Consultoría & Inteligencia Artificial Automatizada para PyMEs",
  description: "Plataforma de consultoría y automatización con IA diseñada para impulsar comercios y pequeñas empresas en México.",
  manifest: "/manifest.json",
  themeColor: "#22E6D6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NEXO.IA",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#22E6D6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="NEXO.IA" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
