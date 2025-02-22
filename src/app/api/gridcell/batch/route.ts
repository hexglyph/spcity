import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { GridCell } from '@/models/GridCell'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const cellsParam = searchParams.get('cells')

    if (!cellsParam) {
        return NextResponse.json({ error: 'Cells parameter is required' }, { status: 400 })
    }

    const cellNumbers = cellsParam.split(',').map(Number)

    try {
        const client = await clientPromise
        const db = client.db('spcity')
        const collection = db.collection<GridCell>('gridcells')

        const cells = await collection.find({ cellNumber: { $in: cellNumbers } }).toArray()

        console.log('Fetched cells:', cells)

        return NextResponse.json(cells)
    } catch (error) {
        console.error('Error fetching cell data:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

