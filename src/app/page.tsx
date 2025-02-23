import MapWrapper from '@/components/MapWrapper'

export default function Home() {
  return (
    <main className="w-full h-screen flex flex-col">
      <div className="flex-grow relative">
        <MapWrapper />
      </div>

    </main>
  )
}

