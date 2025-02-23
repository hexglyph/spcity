import type React from "react"

import "./globals.css"
import { Inter } from "next/font/google"
import { Providers } from "@/components/Providers"
import PlayerMenu from "@/components/PlayerMenu"
//import LoadingScreen from "@/components/LoadingScreen"
import TopMenu from "@/components/TopMenu"
//import { useEffect } from "react"
import Head from "next/head"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SPCity - Acolhimento de Demandas",
  description: "Facilite a comunicação com a prefeitura de São Paulo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  //const [isLoading, setIsLoading] = useState(true)

  /*useEffect(() => {
    let playerDataReady = false
    let mapReady = false
    

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
  */

  return (
    <html lang="pt-BR">
      <Head>
        <title>SPCity - Acolhimento de Demandas do Cidadão de São Paulo</title>
        <meta name="description" content="O SPCity facilita a comunicação entre os cidadãos de São Paulo e a administração pública. Registre demandas, acompanhe solicitações e receba atualizações sobre os serviços municipais." />
        <meta name="keywords" content="SPCity, São Paulo, serviços públicos, demandas, prefeitura, comunicação, solicitações, cidade" />
        <meta name="author" content="Prefeitura de São Paulo" />

        <meta property="og:title" content="SPCity - Acolhimento de Demandas do Cidadão de São Paulo" />
        <meta property="og:description" content="Registre e acompanhe solicitações de serviços públicos em São Paulo com o SPCity." />
        <meta property="og:image" content="/logo_maior.png" />
        <meta property="og:url" content="https://spcity.app" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SPCity - Acolhimento de Demandas do Cidadão de São Paulo" />
        <meta name="twitter:description" content="Com o SPCity, cidadãos de São Paulo podem registrar e acompanhar demandas de serviços públicos." />
        <meta name="twitter:image" content="/logo_maior.png" />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://spcity.app" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
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

