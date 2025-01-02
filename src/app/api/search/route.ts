import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    if (!query) {
        return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    try {
        const client = await clientPromise
        const db = client.db('spcity')
        const collection = db.collection('gridcells')

        const cell = await collection.findOne({
            $or: [
                { 'names.portuguese': query.toLowerCase() },
                { 'names.english': query.toLowerCase() },
                { 'names.japanese': query },
                { 'names.spanish': query.toLowerCase() }
            ]
        })

        if (cell) {
            return NextResponse.json({
                cellNumber: cell.cellNumber,
                coordinates: cell.coordinates,
                names: cell.names
            })
        } else {
            return NextResponse.json({ error: 'Cell not found' }, { status: 404 })
        }
    } catch (error) {
        console.error('Error searching for cell:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

