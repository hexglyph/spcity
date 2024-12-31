'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { FaUser, FaStar, FaHeart, FaMagic, FaMapMarkedAlt } from 'react-icons/fa'
import TerritoryList from './TerritoryList'

interface PlayerData {
    name: string
    level: number
    experience: number
    hp: number
    maxHp: number
    mana: number
    maxMana: number
    rank: string
}

export default function PlayerMenu() {
    const { data: session, status } = useSession()
    const [playerData, setPlayerData] = useState<PlayerData | null>(null)
    const [showTerritoryList, setShowTerritoryList] = useState(false)

    useEffect(() => {
        if (session) {
            fetchPlayerData()
        }
    }, [session])

    const fetchPlayerData = async () => {
        const response = await fetch('/api/player')
        if (response.ok) {
            const data = await response.json()
            setPlayerData({
                ...data,
                maxHp: 100,
                maxMana: 100
            })

            window.dispatchEvent(new Event('playerDataReady'))
        }
    }

    const toggleTerritoryList = () => {
        setShowTerritoryList(!showTerritoryList)
    }

    if (status === 'loading') {
        return <div>Loading...</div>
    }

    if (!session) {
        return (
            <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-between items-center z-[9999]">
                <div className="text-xl font-bold">SPCity</div>
                <div>
                    <button onClick={() => signIn('google')} className="bg-red-600 text-white px-4 py-2 rounded mr-2 hover:bg-red-700 transition-colors">
                        Login with Google
                    </button>
                    <button onClick={() => signIn('apple')} className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 transition-colors">
                        Login with Apple
                    </button>
                </div>
            </div>
        )
    }

    return (
        <>
            <div id="player-menu" className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-between items-center z-[9999]">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                        <FaUser className="text-2xl" />
                    </div>
                    <div>
                        <div className="font-bold text-lg">{playerData?.name || session.user?.name}</div>
                        <div className="flex items-center space-x-2">
                            <FaStar className="text-yellow-400" />
                            <span>Nível {playerData?.level || 1}</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 mx-4">
                    <div className="mb-2">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">HP</span>
                            <span className="text-sm">{playerData?.hp || 10}/{playerData?.maxHp || 100}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-red-500 rounded-full h-2"
                                style={{ width: `${((playerData?.hp || 10) / (playerData?.maxHp || 100)) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Mana</span>
                            <span className="text-sm">{playerData?.mana || 10}/{playerData?.maxMana || 100}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-blue-500 rounded-full h-2"
                                style={{ width: `${((playerData?.mana || 10) / (playerData?.maxMana || 100)) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-sm">
                        <div>XP: {playerData?.experience || 0}</div>
                        <div>Rank: {playerData?.rank || 'Bronze 3'}</div>
                    </div>
                    <button
                        onClick={toggleTerritoryList}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center"
                    >
                        <FaMapMarkedAlt className="mr-2" />
                        Território
                    </button>
                    <button onClick={() => signOut()} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                        Logout
                    </button>
                </div>
            </div>
            {showTerritoryList && <TerritoryList onClose={toggleTerritoryList} />}
        </>
    )
}

