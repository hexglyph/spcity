import MapWrapper from '@/components/MapWrapper'
import Head from "next/head"

export default function Home() {
  return (
    <>
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

      <main className="w-full h-screen flex flex-col">
        <div className="flex-grow relative">
          <MapWrapper />
        </div>

      </main>
    </>
  )
}

