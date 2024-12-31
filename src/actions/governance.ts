'use server'

import { getServerSession } from 'next-auth'
import authOptions from '@/app/api/auth/[...nextauth]/options'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { revalidatePath } from 'next/cache'

interface Position {
    latitude: number
    longitude: number
}

export async function claimGovernance(cellId: string, position: Position) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return { success: false, message: 'Você precisa estar logado para reivindicar governança.' }
    }

    try {
        const client = await clientPromise
        const db = client.db('spcity')
        const collection = db.collection('gridcells')

        // Find the cell
        const cell = await collection.findOne({
            _id: new ObjectId(cellId)
        })

        if (!cell) {
            return { success: false, message: 'Bloco não encontrado.' }
        }

        // Check if cell already has a governor
        if (cell.governance && cell.governance.expiresAt > new Date()) {
            return { success: false, message: 'Este bloco já possui um governante ativo.' }
        }

        // Check if player is within cell boundaries
        const isWithinBounds = position.latitude >= cell.coordinates.latRange[0] &&
            position.latitude <= cell.coordinates.latRange[1] &&
            position.longitude >= cell.coordinates.lngRange[0] &&
            position.longitude <= cell.coordinates.lngRange[1]

        if (!isWithinBounds) {
            return { success: false, message: 'Você precisa estar dentro do bloco para reivindicar governança.' }
        }

        // Set governance data
        const governanceData = {
            governorId: session.user.id,
            governorName: session.user.name,
            claimedAt: new Date(),
            expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
        }

        // Update the cell
        await collection.updateOne(
            { _id: new ObjectId(cellId) },
            { $set: { governance: governanceData } }
        )

        revalidatePath('/') // Revalidate the page to show updated data

        return {
            success: true,
            message: 'Governança reivindicada com sucesso!',
            governance: governanceData
        }
    } catch (error) {
        console.error('Error claiming governance:', error)
        return { success: false, message: 'Erro ao reivindicar governança.' }
    }
}

