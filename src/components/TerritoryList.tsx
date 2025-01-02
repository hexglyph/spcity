'use client'

import { useState, useEffect } from 'react'
import { FaTimes, FaArrowRight } from 'react-icons/fa'

interface GovernedCell {
    cellNumber: number
    name: string
    expiresAt: string
}

interface TerritoryListProps {
    onClose: () => void
}

export default function TerritoryList({ onClose }: TerritoryListProps) {
    const [governedCells, setGovernedCells] = useState<GovernedCell[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchGovernedCells()
    }, [])

    const fetchGovernedCells = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/player/governed-cells')
            if (response.ok) {
                const data = await response.json()
                setGovernedCells(data.governedCells)
            }
        } catch (error) {
            console.error('Error fetching governed cells:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const navigateToCell = (cellNumber: number) => {
        window.dispatchEvent(new CustomEvent('navigateToCell', { detail: { cellNumber } }))
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[10000]">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Seu Território</h2>
                    <button title='Ver Território' onClick={onClose} className="text-gray-600 hover:text-gray-800">
                        <FaTimes size={24} />
                    </button>
                </div>
                {isLoading ? (
                    <p className="text-gray-600">Carregando territórios...</p>
                ) : governedCells.length === 0 ? (
                    <p className="text-gray-600">Você ainda não governa nenhum bloco.</p>
                ) : (
                    <ul className="space-y-4">
                        {governedCells.map((cell) => (
                            <li key={cell.cellNumber} className="border-b pb-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{cell.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            Expira em: {new Date(cell.expiresAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        title='Ver detalhes'
                                        onClick={() => navigateToCell(cell.cellNumber)}
                                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                                    >
                                        <FaArrowRight />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

