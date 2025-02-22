import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import authOptions from "../../auth/[...nextauth]/options"

export async function GET(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
        return NextResponse.json({ error: "UserId is required" }, { status: 400 })
    }

    try {
        const client = await clientPromise
        const db = client.db("spcity")
        const gridcellsCollection = db.collection("gridcells")

        const governedCells = await gridcellsCollection
            .find({
                "governance.governorId": userId,
                "governance.expiresAt": { $gt: new Date() },
            })
            .project({
                cellNumber: 1,
                "names.portuguese": 1,
                "governance.expiresAt": 1,
            })
            .toArray()

        const formattedGovernedCells = governedCells
            .map((cell) => {
                const cellNumber = Number.parseInt(cell.cellNumber, 10)
                if (isNaN(cellNumber)) {
                    console.error(`Invalid cellNumber: ${cell.cellNumber} for cell: ${cell._id}`)
                    return null
                }
                return {
                    cellNumber,
                    name: cell.names.portuguese,
                    expiresAt: cell.governance.expiresAt.toISOString(),
                }
            })
            .filter((cell) => cell !== null)

        console.log(`Governed cells for user ${userId}:`, formattedGovernedCells)

        return NextResponse.json({ governedCells: formattedGovernedCells })
    } catch (error) {
        console.error("Error fetching governed cells:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

