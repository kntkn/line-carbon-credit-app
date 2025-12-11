import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Decopon - カーボンクレジット交換アプリ',
  description: 'カーボンクレジットをクーポンに交換できるLINEミニアプリ',
  keywords: ['カーボンクレジット', 'クーポン', 'LINE', 'ミニアプリ', '環境', 'サステナブル'],
  authors: [{ name: 'Decopon Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#06C755',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Decopon - カーボンクレジット交換アプリ',
    description: 'カーボンクレジットをクーポンに交換できるLINEミニアプリ',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'Decopon',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Decopon - カーボンクレジット交換アプリ',
    description: 'カーボンクレジットをクーポンに交換できるLINEミニアプリ',
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Decopon" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}