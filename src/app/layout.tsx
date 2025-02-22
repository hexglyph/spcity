"use client"

import type React from "react"

import "./globals.css"
import { Inter } from "next/font/google"
import { Providers } from "@/components/Providers"
import PlayerMenu from "@/components/PlayerMenu"
import LoadingScreen from "@/components/LoadingScreen"
import TopMenu from "@/components/TopMenu"
import { useState, useEffect } from "react"

const inter = Inter({ subsets: ["latin"] })

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

    window.addEventListener("mapReady", handleMapReady)
    window.addEventListener("playerDataReady", handlePlayerDataReady)

    return () => {
      window.removeEventListener("mapReady", handleMapReady)
      window.removeEventListener("playerDataReady", handlePlayerDataReady)
    }
  }, [])

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <TopMenu />
          <main className="pt-16">
            {" "}
            {/* Add padding-top to account for the fixed TopMenu */}
            {children}
          </main>
          <PlayerMenu />
        </Providers>
      </body>
    </html>
  )
}

