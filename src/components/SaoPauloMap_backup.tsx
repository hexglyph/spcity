'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import CellMenu from './CellMenu'
import SearchBar from './SearchBar'
import { saoPauloBoundary } from '../data/pilotoBoundary'
import { GridCell } from '@/models/GridCell'
import { FaLocationArrow } from 'react-icons/fa'
import debounce from 'lodash/debounce'
import { toast } from 'react-toastify'

const SAO_PAULO_CENTER: L.LatLngTuple = [-23.555153873167974, -46.51717973826744]
const INITIAL_ZOOM = 14
const MAX_ZOOM = 22
const GRID_SIZE = 5 // meters
const GRID_SIZE_DEGREES = GRID_SIZE / 111000 // Approximate conversion from meters to degrees

const SaoPauloMap2 = () => {
  const { data: session } = useSession()
  const mapRef = useRef<L.Map | null>(null)
  const gridLayerRef = useRef<L.LayerGroup | null>(null)
  const governedCellsLayerRef = useRef<L.LayerGroup | null>(null)
  const selectedCellLayerRef = useRef<L.LayerGroup | null>(null)
  const locationMarkerRef = useRef<L.Marker | null>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [selectedCell, setSelectedCell] = useState<GridCell | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [governedCells, setGovernedCells] = useState<number[]>([])

  const toggleGrid = () => {
    setShowGrid((prev) => !prev)
  }

  const updateSelectedCellHighlight = useCallback((cell: GridCell | null) => {
    if (!mapRef.current || !selectedCellLayerRef.current) return

    selectedCellLayerRef.current.clearLayers()

    if (cell) {
      const cellBounds = L.latLngBounds(
        [cell.coordinates.latRange[0], cell.coordinates.lngRange[0]],
        [cell.coordinates.latRange[1], cell.coordinates.lngRange[1]]
      )

      L.rectangle(cellBounds, {
        color: 'blue',
        weight: 2,
        fillColor: 'blue',
        fillOpacity: 0.3
      }).addTo(selectedCellLayerRef.current)
    }
  }, [])

  const calculateCellNumber = (lat: number, lng: number): number => {
    const latOffset = Math.floor((lat - SAO_PAULO_CENTER[0]) / GRID_SIZE_DEGREES)
    const lngOffset = Math.floor((lng - SAO_PAULO_CENTER[1]) / GRID_SIZE_DEGREES)
    return latOffset * 1000000 + lngOffset
  }

  const handleCellAction = useCallback(async (cellNumber: number, latlng: L.LatLng) => {
    console.log('handleCellAction called:', cellNumber, latlng)
    try {
      const response = await fetch(`/api/gridcell?cellNumber=${cellNumber}`)
      if (!response.ok) {
        throw new Error('Failed to fetch cell data')
      }
      const cellData: GridCell | null = await response.json()
      console.log('Cell data received:', cellData)
      if (cellData) {
        setSelectedCell(cellData)
        updateSelectedCellHighlight(cellData)
      } else {
        console.log('Cell not found in database')
        toast.error('Célula não encontrada no banco de dados')
      }
    } catch (error) {
      console.error('Error fetching cell data:', error)
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
    }
  }, [updateSelectedCellHighlight])

  const isPointInPolygon = (point: number[], polygon: number[][]) => {
    let inside = false
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1]
      const xj = polygon[j][0], yj = polygon[j][1]
      const intersect = ((yi > point[1]) !== (yj > point[1])) &&
        (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi)
      if (intersect) inside = !inside
    }
    return inside
  }

  const isRectangleInPolygon = useCallback((rect: L.LatLngBounds, geoJSON: GeoJSON.FeatureCollection) => {
    const feature = geoJSON.features[0]
    if (feature.geometry.type !== 'Polygon') {
      console.error('Expected Polygon geometry')
      return false
    }
    const polygon = feature.geometry.coordinates[0]
    const corners = [
      rect.getNorthWest(),
      rect.getNorthEast(),
      rect.getSouthEast(),
      rect.getSouthWest()
    ]

    return corners.some(corner => isPointInPolygon([corner.lng, corner.lat], polygon))
  }, [])

  const updateGrid = useCallback(() => {
    if (!mapRef.current || !gridLayerRef.current || !governedCellsLayerRef.current) return

    const zoom = mapRef.current.getZoom()
    const bounds = mapRef.current.getBounds()

    gridLayerRef.current.clearLayers()
    governedCellsLayerRef.current.clearLayers()

    if (zoom < 16 && !governedCells.length) return

    const cellsX = Math.ceil((bounds.getEast() - bounds.getWest()) / GRID_SIZE_DEGREES)
    const cellsY = Math.ceil((bounds.getNorth() - bounds.getSouth()) / GRID_SIZE_DEGREES)

    const maxCells = 10000
    if (cellsX * cellsY > maxCells) return

    const startLat = Math.floor((bounds.getSouth() - SAO_PAULO_CENTER[0]) / GRID_SIZE_DEGREES) * GRID_SIZE_DEGREES + SAO_PAULO_CENTER[0]
    const startLon = Math.floor((bounds.getWest() - SAO_PAULO_CENTER[1]) / GRID_SIZE_DEGREES) * GRID_SIZE_DEGREES + SAO_PAULO_CENTER[1]

    for (let i = 0; i <= cellsY; i++) {
      for (let j = 0; j <= cellsX; j++) {
        const cellLat = startLat + i * GRID_SIZE_DEGREES
        const cellLon = startLon + j * GRID_SIZE_DEGREES

        const cellBounds = L.latLngBounds(
          [cellLat, cellLon],
          [cellLat + GRID_SIZE_DEGREES, cellLon + GRID_SIZE_DEGREES]
        )

        const center: [number, number] = [cellLon + GRID_SIZE_DEGREES / 2, cellLat + GRID_SIZE_DEGREES / 2]

        if (isPointInPolygon(center, saoPauloBoundary.features[0].geometry.coordinates[0])) {
          const cellNumber = calculateCellNumber(cellLat, cellLon)

          const isGoverned = governedCells.includes(cellNumber)

          const rectangle = L.rectangle(cellBounds, {
            color: isGoverned ? 'green' : 'black',
            weight: 1,
            fillColor: isGoverned ? 'green' : 'transparent',
            fillOpacity: isGoverned ? 0.3 : 0
          })
            .on('click', (e: L.LeafletMouseEvent) => {
              console.log('Cell clicked:', cellNumber)
              e.originalEvent.stopPropagation()
              handleCellAction(cellNumber, e.latlng)
            })

          if (isGoverned) {
            rectangle.addTo(governedCellsLayerRef.current)
          } else if (zoom >= 16 && showGrid) {
            rectangle.addTo(gridLayerRef.current)
          }
        }
      }
    }
  }, [showGrid, handleCellAction, isPointInPolygon, governedCells, calculateCellNumber])

  const debouncedUpdateGrid = useCallback(
    debounce(() => {
      updateGrid()
    }, 100),
    [updateGrid]
  )

  const updateUserLocationMarker = useCallback((position: L.LatLng) => {
    if (!mapRef.current) return

    if (!locationMarkerRef.current) {
      locationMarkerRef.current = L.marker(position, {
        icon: L.divIcon({
          className: 'w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-md',
          html: '<div class="w-full h-full rounded-full bg-blue-500 opacity-70 animate-ping"></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })
      }).addTo(mapRef.current)
    } else {
      locationMarkerRef.current.setLatLng(position)
    }
  }, [])

  const handleLocationFound = useCallback((e: L.LocationEvent) => {
    const { lat, lng } = e.latlng
    updateUserLocationMarker(e.latlng)
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], 18)
    }
    setIsLocating(false)
  }, [updateUserLocationMarker])

  const handleLocationError = useCallback((e: L.ErrorEvent) => {
    console.error('Error getting location:', e.message)
    setIsLocating(false)
    // You might want to show an error message to the user here
  }, [])

  const locateUser = useCallback(() => {
    if (!mapRef.current) return

    setIsLocating(true)
    mapRef.current.locate({ setView: false, maxZoom: 18 })
  }, [])

  const fetchGovernedCells = useCallback(async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch(`/api/player/governed-cells?userId=${session.user.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch governed cells')
      }
      const data = await response.json()
      setGovernedCells(data.governedCells)
    } catch (error) {
      console.error('Error fetching governed cells:', error)
    }
  }, [session?.user?.id])

  useEffect(() => {
    if (typeof window !== 'undefined' && !mapRef.current) {
      mapRef.current = L.map('map', {
        center: SAO_PAULO_CENTER,
        zoom: INITIAL_ZOOM,
        zoomControl: false,
        maxZoom: MAX_ZOOM
      })

      // Force the map to update its size after initialization
      setTimeout(() => {
        mapRef.current?.invalidateSize()
      }, 0)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: MAX_ZOOM
      }).addTo(mapRef.current)

      L.control.zoom({ position: 'topright' }).addTo(mapRef.current)

      L.geoJSON(saoPauloBoundary, {
        style: {
          color: 'black',
          weight: 2,
          fillOpacity: 0
        }
      }).addTo(mapRef.current)

      gridLayerRef.current = L.layerGroup().addTo(mapRef.current)
      governedCellsLayerRef.current = L.layerGroup().addTo(mapRef.current)
      selectedCellLayerRef.current = L.layerGroup().addTo(mapRef.current)

      mapRef.current.on('zoomend', debouncedUpdateGrid)
      mapRef.current.on('moveend', debouncedUpdateGrid)
      mapRef.current.on('locationfound', handleLocationFound)
      mapRef.current.on('locationerror', handleLocationError)

      //setMapReady(true)

      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new Event('mapReady'))
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [debouncedUpdateGrid, handleLocationFound, handleLocationError])

  useEffect(() => {
    if (session?.user?.id) {
      fetchGovernedCells()
    }
  }, [session?.user?.id, fetchGovernedCells])

  useEffect(() => {
    if (mapRef.current && gridLayerRef.current) {
      updateGrid()
    }
  }, [updateGrid, governedCells])

  useEffect(() => {
    console.log('Selected cell updated:', selectedCell)
    if (selectedCell) {
      updateSelectedCellHighlight(selectedCell)
    }
  }, [selectedCell, updateSelectedCellHighlight])


  const navigateToCell = useCallback(async (cellNumber: number) => {
    if (!mapRef.current) return

    try {
      const response = await fetch(`/api/gridcell?cellNumber=${cellNumber}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch cell data')
      }
      const cellData: GridCell = await response.json()

      if (cellData.coordinates) {
        const cellCenter = [
          (cellData.coordinates.latRange[0] + cellData.coordinates.latRange[1]) / 2,
          (cellData.coordinates.lngRange[0] + cellData.coordinates.lngRange[1]) / 2
        ]

        mapRef.current.setView(cellCenter as L.LatLngExpression, 18)

        const cellBounds = L.latLngBounds(
          [cellData.coordinates.latRange[0], cellData.coordinates.lngRange[0]],
          [cellData.coordinates.latRange[1], cellData.coordinates.lngRange[1]]
        )

        if (selectedCellLayerRef.current) {
          selectedCellLayerRef.current.clearLayers()
          L.rectangle(cellBounds, {
            color: 'blue',
            weight: 2,
            fillColor: 'blue',
            fillOpacity: 0.3
          }).addTo(selectedCellLayerRef.current)
        }

        setSelectedCell(cellData)
      } else {
        console.error('Cell coordinates not found')
        alert('Erro ao navegar para o bloco. Coordenadas não encontradas.')
      }
    } catch (error) {
      console.error('Error fetching cell data:', error)
      alert('Erro ao buscar dados do bloco. Por favor, tente novamente.')
    }
  }, [])

  useEffect(() => {
    const handleNavigateToCell = (event: CustomEvent<{ cellNumber: number }>) => {
      navigateToCell(event.detail.cellNumber)
    }

    window.addEventListener('navigateToCell', handleNavigateToCell as EventListener)

    return () => {
      window.removeEventListener('navigateToCell', handleNavigateToCell as EventListener)
    }
  }, [navigateToCell])

  const handleSearch = useCallback(async (query: string) => {
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error('Failed to search for cell')
      }
      const data = await response.json()
      if (data.cellNumber) {
        navigateToCell(data.cellNumber)
      } else {
        alert('Bloco não encontrado')
      }
    } catch (error) {
      console.error('Error searching for cell:', error)
      alert('Erro ao buscar o bloco. Por favor, tente novamente.')
    }
  }, [navigateToCell])

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.on('click', () => {
        console.log('Map clicked, clearing selection')
        setSelectedCell(null)
        updateSelectedCellHighlight(null)
      })
    }
  }, [updateSelectedCellHighlight])

  return (
    <div className="relative w-full h-full">
      <div id="map" className="absolute inset-0" />
      <div className="absolute top-4 left-4 z-[1000] space-y-2">
        <SearchBar onSearch={handleSearch} />
        <button
          className="bg-white px-4 py-2 rounded shadow hover:bg-gray-100 transition-colors"
          onClick={toggleGrid}
        >
          {showGrid ? 'Hide Grid' : 'Show Grid'}
        </button>
        <button
          className="bg-white px-4 py-2 rounded shadow hover:bg-gray-100 transition-colors flex items-center justify-center w-full"
          onClick={locateUser}
          disabled={isLocating}
        >
          <FaLocationArrow className="mr-2" />
          {isLocating ? 'Locating...' : 'Find Me'}
        </button>
      </div>
      {selectedCell && (
        <CellMenu
          cellNumber={selectedCell.cellNumber}
          cellData={selectedCell}
          onClose={() => {
            console.log('Closing CellMenu')
            setSelectedCell(null)
            updateSelectedCellHighlight(null)
          }}
        />
      )}
    </div>
  )
}

export default SaoPauloMap2

