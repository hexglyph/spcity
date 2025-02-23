import React, { useEffect } from 'react'
import { GridCell } from '@/models/GridCell'
import { FaMapMarkerAlt, FaInfoCircle, FaHistory } from 'react-icons/fa'
import { GovernancePanel } from './GovernancePanel'

interface CellMenuProps {
    cellNumber: number
    cellData?: GridCell
    onClose: () => void
}

const CellMenu: React.FC<CellMenuProps> = ({ cellNumber, cellData, onClose }) => {
    console.log('CellMenu rendered:', { cellNumber, cellData })

    useEffect(() => {
        console.log('CellMenu mounted or updated:', { cellNumber, cellData })
    }, [cellNumber, cellData])

    if (!cellData) {
        console.log('No cell data, not rendering CellMenu')
        return null
    }

    const getLocalizedName = () => {
        if (!cellData?.names) return ''

        const userLanguage = navigator.language.split('-')[0]
        switch (userLanguage) {
            case 'pt':
                return cellData.names.portuguese
            case 'ja':
                return cellData.names.japanese
            case 'es':
                return cellData.names.spanish
            default:
                return cellData.names.english
        }
    }

    return (
        <div className="fixed right-0 top-0 h-full w-80 bg-gray-800 text-white shadow-lg p-6 z-[2000] overflow-y-auto">
            <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                onClick={onClose}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="sr-only">Fechar</span>
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">Detalhes do Bloco</h2>

            <div className="space-y-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-yellow-400" />
                        Nome
                    </h3>
                    <p className="text-lg font-medium">{getLocalizedName()}</p>
                    {/*<div className="mt-2 text-sm text-gray-300">
                        <p>ID: {cellData?._id?.toString()}</p>
                        <p>Número do Bloco: {cellNumber}</p>
                    </div>*/}
                </div>

                {cellData && <GovernancePanel
                    cellId={/*cellData._id?.toString() ||*/ ''}
                    governance={cellData.governance}
                />}

                <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2 flex items-center">
                        <FaInfoCircle className="mr-2 text-yellow-400" />
                        Status
                    </h3>
                    <p className="text-lg italic text-gray-400">Em breve</p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2 flex items-center">
                        <FaHistory className="mr-2 text-yellow-400" />
                        Histórico
                    </h3>
                    <p className="text-lg italic text-gray-400">Em breve</p>
                </div>

                {/*<div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Coordenadas</h3>
                    {cellData?.coordinates ? (
                        <>
                            <div className="mb-3">
                                <p className="text-sm font-semibold mb-1 text-yellow-400">Latitude:</p>
                                <p className="text-xs text-gray-300">De: {cellData.coordinates.latRange[0].toFixed(6)}</p>
                                <p className="text-xs text-gray-300">Até: {cellData.coordinates.latRange[1].toFixed(6)}</p>
                            </div>
                            <div className="mb-3">
                                <p className="text-sm font-semibold mb-1 text-yellow-400">Longitude:</p>
                                <p className="text-xs text-gray-300">De: {cellData.coordinates.lngRange[0].toFixed(6)}</p>
                                <p className="text-xs text-gray-300">Até: {cellData.coordinates.lngRange[1].toFixed(6)}</p>
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-600">
                                <p className="text-sm font-semibold text-yellow-400">Identificação do Bloco:</p>
                                <p className="text-sm text-gray-300">{getLocalizedName()}</p>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm italic text-gray-400">Coordenadas não disponíveis</p>
                    )}
                </div>*/}
            </div>
            <button
                className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                onClick={() => {/* TODO: Implement open demand functionality */ }}
            >
                Abrir Demanda
            </button>
        </div>
    )
}

export default CellMenu

