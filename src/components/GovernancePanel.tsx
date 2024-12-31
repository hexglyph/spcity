'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { claimGovernance } from '../actions/governance'
import { FaCrown, FaMapMarkerAlt } from 'react-icons/fa'

interface GovernancePanelProps {
    cellId: string
    governance?: {
        governorId: string
        governorName: string
        claimedAt: Date
        expiresAt: Date
    }
}

export function GovernancePanel({ cellId, governance }: GovernancePanelProps) {
    const { data: session } = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleClaimGovernance = async () => {
        if (!session) {
            setError('Você precisa estar logado para reivindicar governança.')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            // Get current position
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error('Geolocalização não suportada'))
                    return
                }
                navigator.geolocation.getCurrentPosition(resolve, reject)
            })

            const result = await claimGovernance(cellId, {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })

            if (!result.success) {
                setError(result.message)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao obter localização')
        } finally {
            setIsLoading(false)
        }
    }

    const isExpired = governance && new Date(governance.expiresAt) <= new Date()
    const timeLeft = governance && !isExpired
        ? Math.ceil((new Date(governance.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0

    return (
        <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaCrown className="mr-2 text-yellow-400" />
                Governança
            </h3>

            {governance && !isExpired ? (
                <div className="space-y-2">
                    <p className="text-sm">
                        Governante atual: <span className="font-medium">{governance.governorName}</span>
                    </p>
                    <p className="text-sm">
                        Tempo restante: <span className="font-medium">{timeLeft} dias</span>
                    </p>
                    {session?.user?.id === governance.governorId && (
                        <div className="mt-2 p-2 bg-green-600/20 rounded-md">
                            <p className="text-sm">Você é o governante deste bloco!</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-gray-300">
                        Este bloco não possui um governante ativo.
                    </p>
                    <Button
                        onClick={handleClaimGovernance}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            'Reivindicando...'
                        ) : (
                            <>
                                <FaMapMarkerAlt />
                                Reivindicar Governança
                            </>
                        )}
                    </Button>
                    {error && (
                        <p className="text-sm text-red-400 mt-2">{error}</p>
                    )}
                </div>
            )}
        </div>
    )
}

