import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { GridCell } from '@/models/GridCell'

//const SAO_PAULO_CENTER: [number, number] = [-23.555153873167974, -46.51717973826744]
//const GRID_SIZE = 5 // meters
//const GRID_SIZE_DEGREES = GRID_SIZE / 111000 // Approximate conversion from meters to degrees

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const cellNumber = searchParams.get('cellNumber')

    if (!cellNumber) {
        return NextResponse.json({ error: 'Cell number is required' }, { status: 400 })
    }

    try {
        const client = await clientPromise
        const db = client.db('spcity')
        const collection = db.collection<GridCell>('gridcells')

        const cell = await collection.findOne({ cellNumber: parseInt(cellNumber) })

        if (cell) {
            return NextResponse.json(cell)
        } else {
            return NextResponse.json(null)
        }
    } catch (error) {
        console.error('Error fetching cell data:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

