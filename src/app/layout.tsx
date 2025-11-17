import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from 'sonner'
import { AuthProvider } from '@/shared/auth/components/AuthProvider'
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Reserrega - Red Social de Regalos",
    template: "%s | Reserrega",
  },
  description: "Reserva productos en tienda, crea tu wishlist y recibe los regalos perfectos. La red social que conecta deseos con regalos únicos.",
  keywords: ["regalos", "wishlist", "reservas", "tienda", "social", "compras"],
  authors: [{ name: "Reserrega" }],
  creator: "Reserrega",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Reserrega",
    title: "Reserrega - Red Social de Regalos",
    description: "Reserva productos en tienda, crea tu wishlist y recibe los regalos perfectos.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster
          position="top-right"
          richColors
          closeButton
        />
      </body>
    </html>
  )
}
