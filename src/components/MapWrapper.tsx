'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const SaoPauloMap = dynamic(() => import('./SaoPauloMap'), {
    ssr: false,
    loading: () => <p>Carregando Mapa...</p>
})

export default function MapWrapper() {
    return (
        <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Carregando Mapa...</div>}>
            <SaoPauloMap />
        </Suspense>
    )
}

