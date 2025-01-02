import Link from 'next/link'
import MapWrapper from '@/components/MapWrapper'
import FooterLinks from '@/components/FooterLinks'

export default function Home() {
  return (
    <main className="w-full h-screen flex flex-col">
      <div className="flex-grow relative">
        <MapWrapper />
        <div className="absolute bottom-4 left-4 z-[1000]">
          <FooterLinks />
        </div>
      </div>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <div className="container mx-auto">
          <nav className="flex justify-center space-x-4">
            <Link href="/privacidade" className="hover:text-gray-300 transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/termos" className="hover:text-gray-300 transition-colors">
              Termos de Serviço
            </Link>
          </nav>
          <p className="mt-2 text-sm text-gray-400">© 2023 SPCity. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  )
}

