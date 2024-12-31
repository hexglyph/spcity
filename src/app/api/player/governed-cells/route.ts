import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { getServerSession } from 'next-auth/next'
import authOptions from '../../auth/[...nextauth]/options'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        const client = await clientPromise
        const db = client.db('spcity')
        const gridcellsCollection = db.collection('gridcells')

        const governedCells = await gridcellsCollection.find({
            'governance.governorId': session.user.id,
            'governance.expiresAt': { $gt: new Date() }
        }).project({
            cellNumber: 1,
            'names.portuguese': 1,
            'governance.expiresAt': 1
        }).toArray()

        const formattedGovernedCells = governedCells.map(cell => ({
            cellNumber: cell.cellNumber,
            name: cell.names.portuguese,
            expiresAt: cell.governance.expiresAt.toISOString()
        }))

        return NextResponse.json({ governedCells: formattedGovernedCells })
    } catch (error) {
        console.error('Error fetching governed cells:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

