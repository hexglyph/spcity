'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import CellMenu from './CellMenu'
import { saoPauloBoundary } from '../data/saoPauloBoundary'
import { GridCell } from '@/models/GridCell'

const SAO_PAULO_CENTER: L.LatLngTuple = [-23.5505, -46.6333]
const INITIAL_ZOOM = 14
const MAX_ZOOM = 22
const GRID_SIZE = 5 // meters

const SaoPauloMap = () => {
  const mapRef = useRef<L.Map | null>(null)
  const gridLayerRef = useRef<L.LayerGroup | null>(null)
  const selectedCellLayerRef = useRef<L.LayerGroup | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [showGrid, setShowGrid] = useState(true)
  const [selectedCell, setSelectedCell] = useState<GridCell | null>(null)
  const [mapHeight, setMapHeight] = useState('100vh')

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

  const handleCellAction = useCallback(async (cellNumber: number, center: [number, number], cellCoords: [number, number]) => {
    try {
      const response = await fetch(
        `/api/gridcell?cellNumber=${cellNumber}&lat=${cellCoords[0]}&lng=${cellCoords[1]}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch cell data')
      }
      const cellData: GridCell = await response.json()
      setSelectedCell(cellData)
      updateSelectedCellHighlight(cellData)
    } catch (error) {
      console.error('Error fetching cell data:', error)
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
    if (!mapRef.current || !gridLayerRef.current) return

    const zoom = mapRef.current.getZoom()
    if (zoom < 20 || !showGrid) {
      gridLayerRef.current.clearLayers()
      return
    }

    const bounds = mapRef.current.getBounds()

    gridLayerRef.current.clearLayers()

    const gridSizeInDegrees = GRID_SIZE / 111000 // Approximate conversion from meters to degrees

    // Calculate the number of cells to cover the visible area
    const cellsX = Math.ceil((bounds.getEast() - bounds.getWest()) / gridSizeInDegrees)
    const cellsY = Math.ceil((bounds.getNorth() - bounds.getSouth()) / gridSizeInDegrees)

    // Calculate the starting point for the grid, aligned with São Paulo's center
    const startLat = Math.floor((bounds.getSouth() - SAO_PAULO_CENTER[0]) / gridSizeInDegrees) * gridSizeInDegrees + SAO_PAULO_CENTER[0]
    const startLon = Math.floor((bounds.getWest() - SAO_PAULO_CENTER[1]) / gridSizeInDegrees) * gridSizeInDegrees + SAO_PAULO_CENTER[1]

    for (let i = 0; i <= cellsY; i++) {
      for (let j = 0; j <= cellsX; j++) {
        const cellLat = startLat + i * gridSizeInDegrees
        const cellLon = startLon + j * gridSizeInDegrees

        const cellBounds = L.latLngBounds(
          [cellLat, cellLon],
          [cellLat + gridSizeInDegrees, cellLon + gridSizeInDegrees]
        )

        if (isRectangleInPolygon(cellBounds, saoPauloBoundary)) {
          const cellNumber = Math.floor((cellLat - SAO_PAULO_CENTER[0]) / gridSizeInDegrees) * 1000 +
            Math.floor((cellLon - SAO_PAULO_CENTER[1]) / gridSizeInDegrees)

          L.rectangle(cellBounds, {
            color: 'red',
            weight: 1,
            fillColor: 'transparent',
            fillOpacity: 0
          })
            .addTo(gridLayerRef.current)
            .on('contextmenu', () => {
              const center = cellBounds.getCenter()
              handleCellAction(cellNumber, [center.lat, center.lng], [cellLat, cellLon])
            })
        }
      }
    }
  }, [showGrid, handleCellAction, isRectangleInPolygon])

  useEffect(() => {
    if (typeof window !== 'undefined' && !mapRef.current) {
      mapRef.current = L.map('map', {
        center: SAO_PAULO_CENTER,
        zoom: INITIAL_ZOOM,
        zoomControl: false,
        maxZoom: MAX_ZOOM
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: MAX_ZOOM
      }).addTo(mapRef.current)

      L.control.zoom({ position: 'topright' }).addTo(mapRef.current)

      L.geoJSON(saoPauloBoundary, {
        style: {
          color: 'red',
          weight: 2,
          fillOpacity: 0
        }
      }).addTo(mapRef.current)

      gridLayerRef.current = L.layerGroup().addTo(mapRef.current)
      selectedCellLayerRef.current = L.layerGroup().addTo(mapRef.current)

      mapRef.current.on('zoomend', updateGrid)
      mapRef.current.on('moveend', updateGrid)

      setMapReady(true)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [updateGrid])

  useEffect(() => {
    if (mapRef.current && gridLayerRef.current) {
      updateGrid()
    }
  }, [showGrid, updateGrid])

  useEffect(() => {
    updateSelectedCellHighlight(selectedCell)
  }, [selectedCell, updateSelectedCellHighlight])

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
    <div className="relative w-full" style={{ height: mapHeight }}>
      <div id="map" className="w-full h-full" />
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p className="text-xl font-semibold">Loading map...</p>
        </div>
      )}
      <button
        className="absolute top-4 left-4 z-[1000] bg-white px-4 py-2 rounded shadow"
        onClick={toggleGrid}
      >
        {showGrid ? 'Hide Grid' : 'Show Grid'}
      </button>
      {selectedCell && (
        <CellMenu
          cellNumber={selectedCell.cellNumber}
          centerCoords={[selectedCell.coordinates.latRange[0], selectedCell.coordinates.lngRange[0]]}
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

