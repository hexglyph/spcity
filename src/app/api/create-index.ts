import clientPromise from '@/lib/mongodb'

export async function createCellNumberIndex() {
    try {
        const client = await clientPromise
        const db = client.db('spcity')
        const collection = db.collection('gridcells')

        await collection.createIndex({ cellNumber: 1 }, { unique: true })
        console.log('Index on cellNumber created successfully')
    } catch (error) {
        console.error('Error creating index:', error)
    }
}

// Execute this function once to create the index
createCellNumberIndex()

