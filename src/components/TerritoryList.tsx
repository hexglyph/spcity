"use client"

import { useState, useEffect } from "react"
import { FaTimes, FaArrowRight } from "react-icons/fa"
import { toast } from "react-toastify"

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
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchGovernedCells()
    }, [])

    const fetchGovernedCells = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const storedCells = localStorage.getItem("governedCells")
            const storedTimestamp = localStorage.getItem("governedCellsTimestamp")

            if (storedCells && storedTimestamp) {
                const parsedCells = JSON.parse(storedCells)
                const timestamp = Number.parseInt(storedTimestamp, 10)

                // Check if the stored data is less than 15 minutes old
                if (Date.now() - timestamp < 15 * 60 * 1000) {
                    console.log("Using stored governed cells:", parsedCells)
                    setGovernedCells(parsedCells)
                    setIsLoading(false)
                    return
                }
            }

            const response = await fetch("/api/player/governed-cells")
            if (response.ok) {
                const data = await response.json()
                console.log("Fetched governed cells:", data.governedCells)
                const parsedCells = data.governedCells.map((cell: any) => ({
                    ...cell,
                    cellNumber: Number(cell.cellNumber),
                }))
                setGovernedCells(parsedCells)

                // Store the fetched data in localStorage
                localStorage.setItem("governedCells", JSON.stringify(parsedCells))
                localStorage.setItem("governedCellsTimestamp", Date.now().toString())
            } else {
                throw new Error("Failed to fetch governed cells")
            }
        } catch (error) {
            console.error("Error fetching governed cells:", error)
            setError("Failed to load territories. Please try again.")
            toast.error("Failed to load territories. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const navigateToCell = (cellNumber: number) => {
        console.log("Navigating to cell:", cellNumber)
        window.dispatchEvent(new CustomEvent("navigateToCell", { detail: { cellNumber } }))
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[10000]">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Seu Território</h2>
                    <button title="Fechar" onClick={onClose} className="text-gray-600 hover:text-gray-800">
                        <FaTimes size={24} />
                    </button>
                </div>
                {isLoading ? (
                    <p className="text-gray-600">Carregando territórios...</p>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : governedCells.length === 0 ? (
                    <p className="text-gray-600">Você ainda não governa nenhum bloco.</p>
                ) : (
                    <ul className="space-y-4">
                        {governedCells.map((cell) => (
                            <li key={cell.cellNumber} className="border-b pb-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{cell.name}</h3>
                                        <p className="text-sm text-gray-600">Expira em: {new Date(cell.expiresAt).toLocaleDateString()}</p>
                                        <p className="text-xs text-gray-500">Cell Number: {cell.cellNumber}</p>
                                    </div>
                                    <button
                                        title="Ver detalhes"
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

