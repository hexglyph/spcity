'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'
import PlayerMenu from '@/components/PlayerMenu'
import LoadingScreen from '@/components/LoadingScreen'
import { useState, useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mapReady = false
    let playerDataReady = false

    const checkAllReady = () => {
      if (mapReady && playerDataReady) {
        setIsLoading(false)
      }
    }

    const handleMapReady = () => {
      mapReady = true
      checkAllReady()
    }

    const handlePlayerDataReady = () => {
      playerDataReady = true
      checkAllReady()
    }

    window.addEventListener('mapReady', handleMapReady)
    window.addEventListener('playerDataReady', handlePlayerDataReady)

    return () => {
      window.removeEventListener('mapReady', handleMapReady)
      window.removeEventListener('playerDataReady', handlePlayerDataReady)
    }
  }, [])

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <LoadingScreen isLoading={isLoading} />
          {children}
          <PlayerMenu />
        </Providers>
      </body>
    </html>
  )
}

