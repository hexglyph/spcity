import Link from 'next/link'
import MapWrapper from '@/components/MapWrapper'
import FooterLinks from '@/components/FooterLinks'

export default function Home() {
  return (
    <main className="w-full h-screen flex flex-col">
      <div className="flex-grow relative">
        <MapWrapper />
      </div>

    </main>
  )
}

