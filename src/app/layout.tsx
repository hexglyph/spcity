import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'
import PlayerMenu from '@/components/PlayerMenu'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SPCity',
  description: 'Interactive map of São Paulo City',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <PlayerMenu />
        </Providers>
      </body>
    </html>
  )
}

