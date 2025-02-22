import * as turf from "@turf/turf"

const SAO_PAULO_CENTER = { lat: -23.555153873167974, lng: -46.51717973826744 }
const GRID_SIZE_DEGREES = 5 / 111000 // 5 meters in degrees

self.onmessage = (e: MessageEvent) => {
    const { bounds, zoom, governedCells, saoPauloBoundary, showGrid } = e.data

    const cells = calculateVisibleCells(bounds, zoom, governedCells, saoPauloBoundary, showGrid)
    self.postMessage(cells)
}

function calculateVisibleCells(
    bounds: { north: number; south: number; east: number; west: number },
    zoom: number,
    governedCells: number[],
    saoPauloBoundary: number[][],
    showGrid: boolean,
) {
    const { north, south, east, west } = bounds
    const cellsX = Math.ceil((east - west) / GRID_SIZE_DEGREES)
    const cellsY = Math.ceil((north - south) / GRID_SIZE_DEGREES)

    const maxCells = 2000 // Increased for better coverage
    if (cellsX * cellsY > maxCells) return []

    const startLat =
        Math.floor((south - SAO_PAULO_CENTER.lat) / GRID_SIZE_DEGREES) * GRID_SIZE_DEGREES + SAO_PAULO_CENTER.lat
    const startLon =
        Math.floor((west - SAO_PAULO_CENTER.lng) / GRID_SIZE_DEGREES) * GRID_SIZE_DEGREES + SAO_PAULO_CENTER.lng

    const cells: any[] = []
    const turfPolygon = turf.polygon([saoPauloBoundary])

    console.log("Worker: Calculating visible cells with governed cells:", governedCells)

    for (let i = 0; i <= cellsY; i++) {
        for (let j = 0; j <= cellsX; j++) {
            const cellLat = startLat + i * GRID_SIZE_DEGREES
            const cellLon = startLon + j * GRID_SIZE_DEGREES
            const cellCenter = turf.point([cellLon + GRID_SIZE_DEGREES / 2, cellLat + GRID_SIZE_DEGREES / 2])

            if (turf.booleanPointInPolygon(cellCenter, turfPolygon)) {
                const cellNumber = calculateCellNumber(cellLat, cellLon)
                const isGoverned = governedCells.includes(cellNumber)

                if (isGoverned) {
                    console.log("Worker: Found governed cell:", cellNumber)
                }

                if (isGoverned || (showGrid && zoom >= 18)) {
                    cells.push({
                        cellNumber,
                        isGoverned,
                        bounds: {
                            north: cellLat + GRID_SIZE_DEGREES,
                            south: cellLat,
                            east: cellLon + GRID_SIZE_DEGREES,
                            west: cellLon,
                        },
                    })
                }
            }

            if (cells.length >= maxCells) return cells
        }
    }

    return cells
}

function calculateCellNumber(lat: number, lng: number): number {
    const latOffset = Math.round((lat - SAO_PAULO_CENTER.lat) / GRID_SIZE_DEGREES)
    const lngOffset = Math.round((lng - SAO_PAULO_CENTER.lng) / GRID_SIZE_DEGREES)
    return latOffset * 1000000 + lngOffset
}

