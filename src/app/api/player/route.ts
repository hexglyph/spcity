import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { getServerSession } from 'next-auth/next'
import authOptions from '@/app/api/auth/[...nextauth]/options'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        const client = await clientPromise
        const db = client.db('spcity')
        const playersCollection = db.collection('players')

        const player = await playersCollection.findOne({ email: session.user.email })

        if (!player) {
            return NextResponse.json({ error: 'Player not found' }, { status: 404 })
        }

        return NextResponse.json(player)
    } catch (error) {
        console.error('Error fetching player data:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        const client = await clientPromise
        const db = client.db('spcity')
        const playersCollection = db.collection('players')

        const updateData = await request.json()
        const allowedFields = ['name', 'level', 'experience', 'hp', 'mana', 'rank']
        const filteredUpdateData = Object.keys(updateData)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = updateData[key]
                return obj
            }, {} as Record<string, unknown>)

        filteredUpdateData.updatedAt = new Date()

        const result = await playersCollection.updateOne(
            { email: session.user.email },
            { $set: filteredUpdateData }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Player not found' }, { status: 404 })
        }

        const updatedPlayer = await playersCollection.findOne({ email: session.user.email })
        return NextResponse.json(updatedPlayer)
    } catch (error) {
        console.error('Error updating player data:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

