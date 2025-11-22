import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import '@mysten/dapp-kit/dist/index.css'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/toaster'
import { AppProviders } from '@/components/app-providers'
import './globals.css'

const aeonik = localFont({
  src: '../public/fonts/Aeonik-Regular.ttf',
  variable: '--font-aeonik',
  display: 'swap',
})

const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'DolpGuild',
  description: 'Ocean-themed professional pods on Sui',
  generator: 'DolpGuild',
  icons: {
    icon: [
      { url: '/images/dolpguild-logo.jpeg' },
      { url: '/images/dolpguild-logo.jpeg', sizes: '32x32' },
      { url: '/images/dolpguild-logo.jpeg', sizes: '180x180' },
    ],
    apple: '/images/dolpguild-logo.jpeg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${aeonik.variable} ${geistMono.variable} font-sans antialiased`}>
        <AppProviders>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Navigation />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
          <Toaster />
          <Analytics />
        </AppProviders>
      </body>
    </html>
  )
}
