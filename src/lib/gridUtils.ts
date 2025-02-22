const SAO_PAULO_CENTER = { lat: -23.555153873167974, lng: -46.51717973826744 }
const GRID_SIZE_DEGREES = 5 / 111000 // Aproximadamente 5 metros em graus

/**
 * Calcula o número da célula com base nas coordenadas de latitude e longitude.
 * @param lat Latitude
 * @param lng Longitude
 * @returns Número da célula
 */
export function calculateCellNumber(lat: number, lng: number): number {
    const latIndex = Math.floor((lat - SAO_PAULO_CENTER.lat) / GRID_SIZE_DEGREES)
    const lngIndex = Math.floor((lng - SAO_PAULO_CENTER.lng) / GRID_SIZE_DEGREES)
    return latIndex * 1000000 + lngIndex
}

/**
 * Calcula as coordenadas da célula com base no número da célula.
 * @param cellNumber Número da célula
 * @returns Objeto com latRange e lngRange
 */
export function calculateCellCoordinates(cellNumber: number): {
    latRange: [number, number]
    lngRange: [number, number]
} {
    const latIndex = Math.floor(cellNumber / 1000000)
    const lngIndex = cellNumber % 1000000
    const latStart = SAO_PAULO_CENTER.lat + latIndex * GRID_SIZE_DEGREES
    const lngStart = SAO_PAULO_CENTER.lng + lngIndex * GRID_SIZE_DEGREES
    return {
        latRange: [latStart, latStart + GRID_SIZE_DEGREES],
        lngRange: [lngStart, lngStart + GRID_SIZE_DEGREES],
    }
}