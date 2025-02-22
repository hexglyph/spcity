"use client"

import dynamic from "next/dynamic"
import { Suspense, useEffect, useState } from "react"
import { useJsApiLoader } from "@react-google-maps/api"

const SaoPauloMap = dynamic(() => import("./SaoPauloMap"), {
    ssr: false,
    loading: () => <p>Carregando o mapa...</p>,
})

export default function MapWrapper() {
    const [mapHeight, setMapHeight] = useState("calc(100vh - 64px)") // Subtract the height of TopMenu
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    })

    useEffect(() => {
        const playerMenu = document.getElementById("player-menu")
        const topMenu = document.querySelector("[data-topmenu]")

        if (playerMenu && topMenu) {
            const resizeObserver = new ResizeObserver((entries) => {
                const playerMenuHeight = playerMenu.offsetHeight
                const topMenuHeight = topMenu.clientHeight
                setMapHeight(`calc(100vh - ${playerMenuHeight + topMenuHeight}px)`)
            })

            resizeObserver.observe(playerMenu)
            resizeObserver.observe(topMenu)

            return () => {
                resizeObserver.disconnect()
            }
        }
    }, [])

    if (!isLoaded) {
        return <div className="w-full h-full flex items-center justify-center">Carregando o Google Maps...</div>
    }

    return (
        <div style={{ height: mapHeight, width: "100%", overflow: "hidden" }}>
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Carregando o mapa...</div>}>
                <SaoPauloMap />
            </Suspense>
        </div>
    )
}

