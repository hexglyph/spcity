/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { useSession } from "next-auth/react"
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api"
import CellMenu from "./CellMenu"
import SearchBar from "./SearchBar"
import { saoPauloBoundary } from "../data/pilotoBoundary"
import type { GridCell } from "@/models/GridCell"
import { FaLocationArrow } from "react-icons/fa"
import debounce from "lodash/debounce"
import { toast } from "react-toastify"
import * as turf from "@turf/turf"

declare global {
  interface Window {
    google: typeof google
  }
}

const SAO_PAULO_CENTER = { lat: -23.555153873167974, lng: -46.51717973826744 }
const INITIAL_ZOOM = 14
const MAX_ZOOM = 22

const mapContainerStyle = {
  width: "100%",
  height: "100%",
}

const SaoPauloMap = () => {
  const { data: session } = useSession()
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const gridLayerRef = useRef<Map<number, google.maps.Rectangle>>(new Map())
  const governedCellsLayerRef = useRef<Map<number, google.maps.Rectangle>>(new Map())
  const selectedCellLayerRef = useRef<google.maps.Rectangle | null>(null)
  const locationMarkerRef = useRef<google.maps.Marker | null>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [selectedCell, setSelectedCell] = useState<GridCell | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [governedCells, setGovernedCells] = useState<number[]>([])
  const workerRef = useRef<Worker | null>(null)

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  const toggleGrid = () => {
    setShowGrid((prev) => !prev)
  }

  const updateSelectedCellHighlight = useCallback(
    (cell: GridCell | null) => {
      if (!map) return

      if (selectedCellLayerRef.current) {
        selectedCellLayerRef.current.setMap(null)
        selectedCellLayerRef.current = null
      }

      if (cell) {
        const cellBounds = {
          north: cell.coordinates.latRange[1],
          south: cell.coordinates.latRange[0],
          east: cell.coordinates.lngRange[1],
          west: cell.coordinates.lngRange[0],
        }

        selectedCellLayerRef.current = new google.maps.Rectangle({
          bounds: cellBounds,
          map,
          fillColor: "blue",
          fillOpacity: 0.3,
          strokeColor: "blue",
          strokeWeight: 2,
        })
      }
    },
    [map],
  )

  const handleCellAction = useCallback(
    async (cellNumber: number) => {
      try {
        const response = await fetch(`/api/gridcell?cellNumber=${cellNumber}`)
        if (!response.ok) {
          throw new Error("Failed to fetch cell data")
        }
        const cellData: GridCell | null = await response.json()
        if (cellData) {
          setSelectedCell(cellData)
          updateSelectedCellHighlight(cellData)
        } else {
          console.log("Cell not found in database")
          toast.error("Célula não encontrada no banco de dados")
        }
      } catch (error) {
        console.error("Error fetching cell data:", error)
        toast.error(`Error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`)
      }
    },
    [updateSelectedCellHighlight],
  )

  const saoPauloBoundaryPolygon = useMemo(() => {
    const coords = (saoPauloBoundary.features[0].geometry as any).coordinates[0]
    const polygon = turf.polygon([coords])
    const simplifiedPolygon = turf.simplify(polygon, { tolerance: 0.0001, highQuality: true })
    return {
      original: coords,
      simplified: simplifiedPolygon.geometry.coordinates[0],
    }
  }, [])

  const updateGrid = useCallback(() => {
    if (!map || !workerRef.current) return

    const bounds = map.getBounds()
    const zoom = map.getZoom()
    if (!bounds || zoom === undefined) return

    const ne = bounds.getNorthEast()
    const sw = bounds.getSouthWest()
    const center = map.getCenter()

    if (!ne || !sw || !center) return

    workerRef.current.postMessage({
      bounds: {
        north: ne.lat(),
        south: sw.lat(),
        east: ne.lng(),
        west: sw.lng(),
      },
      center: {
        lat: center?.lat(),
        lng: center?.lng(),
      },
      zoom,
      governedCells,
      saoPauloBoundary: saoPauloBoundaryPolygon.simplified,
      showGrid,
    })
  }, [map, governedCells, saoPauloBoundaryPolygon.simplified, showGrid])

  const fetchGovernedCells = useCallback(async () => {
    if (!session?.user?.id) return

    try {
      const storedCells = localStorage.getItem("governedCells")
      const storedTimestamp = localStorage.getItem("governedCellsTimestamp")

      if (storedCells && storedTimestamp) {
        const parsedCells = JSON.parse(storedCells)
        const timestamp = Number.parseInt(storedTimestamp, 10)

        // Check if the stored data is less than 15 minutes old
        if (Date.now() - timestamp < 15 * 60 * 1000) {
          console.log("Using stored governed cells:", parsedCells)
          return parsedCells.map((cell: any) => cell.cellNumber)
        }
      }

      const response = await fetch(`/api/player/governed-cells?userId=${session.user.id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch governed cells")
      }
      const data = await response.json()
      const cells = data.governedCells
        .map((cell: { cellNumber: number | string }) => {
          const parsed = Number(cell.cellNumber)
          return isNaN(parsed) ? null : parsed
        })
        .filter((num: number | null): num is number => num !== null)

      console.log("Governed cells fetched:", cells)

      // Store the fetched data in localStorage
      localStorage.setItem("governedCells", JSON.stringify(data.governedCells))
      localStorage.setItem("governedCellsTimestamp", Date.now().toString())

      return cells
    } catch (error) {
      console.error("Error fetching governed cells:", error)
      toast.error("Failed to fetch governed cells. Please try again.")
      return []
    }
  }, [session?.user?.id])

  const debouncedUpdateGrid = useMemo(() => debounce(updateGrid, 500), [updateGrid])

  const updateUserLocationMarker = useCallback(
    (position: google.maps.LatLng) => {
      if (!map) return

      if (!locationMarkerRef.current) {
        locationMarkerRef.current = new google.maps.Marker({
          position,
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: "#3388ff",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
        })
      } else {
        locationMarkerRef.current.setPosition(position)
      }
    },
    [map],
  )

  const navigateToCell = useCallback(
    async (cellNumber: number) => {
      try {
        const response = await fetch(`/api/gridcell?cellNumber=${cellNumber}`)
        if (!response.ok) {
          throw new Error("Failed to fetch cell data")
        }
        const cellData: GridCell | null = await response.json()
        if (cellData && cellData.coordinates && map) {
          const center = new google.maps.LatLng(
            (cellData.coordinates.latRange[0] + cellData.coordinates.latRange[1]) / 2,
            (cellData.coordinates.lngRange[0] + cellData.coordinates.lngRange[1]) / 2,
          )
          map.panTo(center)
          map.setZoom(18)
          setSelectedCell(cellData)
          updateSelectedCellHighlight(cellData)
        }
      } catch (error) {
        console.error("Error navigating to cell:", error)
        toast.error("Erro ao navegar para o bloco")
      }
    },
    [map, updateSelectedCellHighlight],
  )

  const handleLocationFound = useCallback(
    (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords
      const latLng = new google.maps.LatLng(latitude, longitude)
      updateUserLocationMarker(latLng)
      if (map) {
        map.panTo(latLng)
        map.setZoom(18)
      }
      setIsLocating(false)
    },
    [map, updateUserLocationMarker],
  )

  const handleLocationError = useCallback((error: GeolocationPositionError) => {
    console.error("Error getting location:", error.message)
    setIsLocating(false)
    toast.error("Erro ao obter localização. Por favor, verifique suas configurações de localização.")
  }, [])

  const locateUser = useCallback(() => {
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(handleLocationFound, handleLocationError)
  }, [handleLocationFound, handleLocationError])

  useEffect(() => {
    if (session?.user?.id) {
      const storedCells = localStorage.getItem("governedCells")
      const storedTimestamp = localStorage.getItem("governedCellsTimestamp")

      if (storedCells && storedTimestamp) {
        const parsedCells = JSON.parse(storedCells)
        const timestamp = Number.parseInt(storedTimestamp, 10)

        // Check if the stored data is less than 15 minutes old
        if (Date.now() - timestamp < 15 * 60 * 1000) {
          console.log("Using stored governed cells:", parsedCells)
          const cellNumbers = parsedCells.map((cell: any) => cell.cellNumber)
          setGovernedCells(cellNumbers)
          return
        }
      }

      fetchGovernedCells().then((cells) => {
        if (cells) {
          setGovernedCells(cells)
        }
      })
    }
  }, [session?.user?.id, fetchGovernedCells])

  useEffect(() => {
    if (map) {
      updateGrid()
    }
  }, [map, updateGrid])

  useEffect(() => {
    if (map && governedCells.length > 0 && governedCells.every((cell) => !isNaN(cell))) {
      console.log("Updating grid due to governedCells change:", governedCells)
      updateGrid()
    }
  }, [map, governedCells, updateGrid])

  useEffect(() => {
    workerRef.current = new Worker(new URL("@/app/workers/gridWorker.ts", import.meta.url))

    workerRef.current.onmessage = (e: MessageEvent) => {
      const cells = e.data
      const visibleCellNumbers = new Set<number>()

      cells.forEach((cell: any) => {
        visibleCellNumbers.add(cell.cellNumber)
        let rectangle = cell.isGoverned
          ? governedCellsLayerRef.current.get(cell.cellNumber)
          : gridLayerRef.current.get(cell.cellNumber)

        if (!rectangle) {
          rectangle = new google.maps.Rectangle({
            bounds: cell.bounds,
            map,
            fillColor: cell.isGoverned ? "green" : "transparent",
            fillOpacity: cell.isGoverned ? 0.3 : 0,
            strokeColor: cell.isGoverned ? "green" : "black",
            strokeWeight: 1,
            clickable: true,
          })

          rectangle.addListener("click", (e: google.maps.MapMouseEvent) => {
            if (e.latLng) handleCellAction(cell.cellNumber)
          })

          if (cell.isGoverned) {
            governedCellsLayerRef.current.set(cell.cellNumber, rectangle)
          } else {
            gridLayerRef.current.set(cell.cellNumber, rectangle)
          }
        } else {
          rectangle.setOptions({
            map,
            bounds: cell.bounds,
            fillColor: cell.isGoverned ? "green" : "transparent",
            fillOpacity: cell.isGoverned ? 0.3 : 0,
            strokeColor: cell.isGoverned ? "green" : "black",
          })
        }
      })

      // Remove cells that are no longer visible
      gridLayerRef.current.forEach((rect, cellNumber) => {
        if (!visibleCellNumbers.has(cellNumber)) {
          rect.setMap(null)
          gridLayerRef.current.delete(cellNumber)
        }
      })

      governedCellsLayerRef.current.forEach((rect, cellNumber) => {
        if (!visibleCellNumbers.has(cellNumber)) {
          rect.setMap(null)
          governedCellsLayerRef.current.delete(cellNumber)
        }
      })
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
      }
    }
  }, [map, handleCellAction])

  // Add event listener for navigation
  useEffect(() => {
    const handleNavigateToCell = (event: CustomEvent<{ cellNumber: number }>) => {
      navigateToCell(event.detail.cellNumber)
    }

    window.addEventListener("navigateToCell", handleNavigateToCell as EventListener)

    return () => {
      window.removeEventListener("navigateToCell", handleNavigateToCell as EventListener)
    }
  }, [navigateToCell])

  const handleSearch = useCallback(
    async (query: string) => {
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
        if (!response.ok) {
          throw new Error("Failed to search for cell")
        }
        const data = await response.json()
        if (data.cellNumber) {
          const cellData: GridCell = data
          if (cellData.coordinates && map) {
            const cellCenter = new google.maps.LatLng(
              (cellData.coordinates.latRange[0] + cellData.coordinates.latRange[1]) / 2,
              (cellData.coordinates.lngRange[0] + cellData.coordinates.lngRange[1]) / 2,
            )
            map.panTo(cellCenter)
            map.setZoom(18)
            updateSelectedCellHighlight(cellData)
            setSelectedCell(cellData)
          }
        } else {
          toast.error("Bloco não encontrado")
        }
      } catch (error) {
        console.error("Error searching for cell:", error)
        toast.error("Erro ao buscar o bloco. Por favor, tente novamente.")
      }
    },
    [map, updateSelectedCellHighlight],
  )

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map)
      const boundaryPolygon = new google.maps.Polygon({
        paths: saoPauloBoundaryPolygon.original.map((coord: any) => ({ lat: coord[1], lng: coord[0] })),
        strokeColor: "black",
        strokeWeight: 2,
        fillOpacity: 0,
      })
      boundaryPolygon.setMap(map)
    },
    [saoPauloBoundaryPolygon.original],
  )

  useEffect(() => {
    if (!map) return

    const debouncedUpdate = debounce(updateGrid, 500)

    const zoomListener = map.addListener("zoom_changed", debouncedUpdate)
    const centerListener = map.addListener("center_changed", debouncedUpdate)

    return () => {
      google.maps.event.removeListener(zoomListener)
      google.maps.event.removeListener(centerListener)
      debouncedUpdate.cancel()
    }
  }, [map, updateGrid])

  if (!isLoaded) return <div>Carregando...</div>

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={SAO_PAULO_CENTER}
        zoom={INITIAL_ZOOM}
        options={{
          maxZoom: MAX_ZOOM,
          streetViewControl: false,
          mapTypeControl: false,
        }}
        onLoad={onMapLoad}
        onZoomChanged={debouncedUpdateGrid}
        onCenterChanged={debouncedUpdateGrid}
      />
      <div className="absolute top-4 left-4 z-[1000] space-y-2">
        <SearchBar onSearch={handleSearch} />
        <button className="bg-white px-4 py-2 rounded shadow hover:bg-gray-100 transition-colors" onClick={toggleGrid}>
          {showGrid ? "Esconder Grid" : "Mostrar Grid"}
        </button>
        <button
          className="bg-white px-4 py-2 rounded shadow hover:bg-gray-100 transition-colors flex items-center justify-center w-full"
          onClick={locateUser}
          disabled={isLocating}
        >
          <FaLocationArrow className="mr-2" />
          {isLocating ? "Localizando..." : "Minha localização"}
        </button>
      </div>
      {selectedCell && (
        <CellMenu
          cellNumber={selectedCell.cellNumber}
          cellData={selectedCell}
          onClose={() => {
            setSelectedCell(null)
            updateSelectedCellHighlight(null)
          }}
        />
      )}
    </div>
  )
}

export default SaoPauloMap

