import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from 'next-auth/react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { LoadingProvider } from '@/components/ui/loading'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Monarca Tasks',
  description: 'Gestor de tareas personal tipo Kanban para un solo usuario',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Monarca Tasks',
    statusBarStyle: 'default',
  },
  icons: {
    icon: [
      { url: '/ico/favicon.png', sizes: '192x192', type: 'image/png' },
      { url: '/ico/favicon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/ico/favicon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/ico/favicon.png',
  },
  applicationName: 'Monarca Tasks',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#f97316',
}

// Script que se ejecuta antes de hidratación para aplicar el tema inmediatamente
const themeScript = `
  (function() {
    try {
      const theme = localStorage.getItem('theme')
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } catch (e) {}
  })()
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        {/* Script de tema que se ejecuta antes de la hidratación */}
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <ThemeProvider>
          <SessionProvider>
            <TooltipProvider>
              <LoadingProvider>
                {children}
              </LoadingProvider>
            </TooltipProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
