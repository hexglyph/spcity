'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const SaoPauloMap = dynamic(() => import('./SaoPauloMap'), {
    ssr: false,
    loading: () => <p>Loading map...</p>
})

export default function MapWrapper() {
    return (
        <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Loading map...</div>}>
            <SaoPauloMap />
        </Suspense>
    )
}

