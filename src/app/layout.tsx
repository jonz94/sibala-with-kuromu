import '~/styles/globals.css'

import { type Metadata } from 'next'

import { ThemeProvider } from '~/components/theme-provider'
import { TRPCReactProvider } from '~/trpc/react'

export const metadata: Metadata = {
  title: '貓草窩大賭場',
  description: 'cathehe',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
