'use client'

import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState } from 'react'

const SaoPauloMap = dynamic(() => import('./SaoPauloMap'), {
    ssr: false,
    loading: () => <p>Carregando o mapa...</p>
})

export default function MapWrapper() {
    const [mapHeight, setMapHeight] = useState('100vh')

    useEffect(() => {
        const updateMapHeight = () => {
            const playerMenu = document.getElementById('player-menu')
            if (playerMenu) {
                const menuHeight = playerMenu.offsetHeight
                setMapHeight(`calc(100vh - ${menuHeight}px)`)
            }
        }

        updateMapHeight()
        window.addEventListener('resize', updateMapHeight)

        return () => window.removeEventListener('resize', updateMapHeight)
    }, [])

    return (
        <div style={{ height: mapHeight, width: '100%', overflow: 'hidden' }}>
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Carregando o mapa...</div>}>
                <SaoPauloMap />
            </Suspense>
        </div>
    )
}

