import { ObjectId } from 'mongodb'

export interface GridCell {
    _id?: ObjectId
    cellNumber: number
    coordinates: {
        latRange: [number, number] // [min, max]
        lngRange: [number, number] // [min, max]
    }
    names: {
        portuguese: string
        english: string
        japanese: string
        spanish: string
    }
    governance?: {
        governorId: string
        governorName: string
        claimedAt: Date
        expiresAt: Date
    }
    data: Record<string, unknown>
}

export interface WordList {
    portuguese: string[]
    english: string[]
    japanese: string[]
    spanish: string[]
}

// Function to generate a unique cell name from the word list
export function generateUniqueCellName(
    wordList: WordList,
    usedNames: Set<string>,
    attempts: number = 0
): { portuguese: string; english: string; japanese: string; spanish: string } | null {
    if (attempts > 100) return null // Prevent infinite loops

    const index1 = Math.floor(Math.random() * wordList.portuguese.length)
    const index2 = Math.floor(Math.random() * wordList.portuguese.length)
    const index3 = Math.floor(Math.random() * wordList.portuguese.length)
    const index4 = Math.floor(Math.random() * wordList.portuguese.length)

    const name = `${wordList.portuguese[index1]}.${wordList.portuguese[index2]}.${wordList.portuguese[index3]}.${wordList.portuguese[index4]}`

    if (usedNames.has(name)) {
        return generateUniqueCellName(wordList, usedNames, attempts + 1)
    }

    usedNames.add(name)
    return {
        portuguese: `${wordList.portuguese[index1]}.${wordList.portuguese[index2]}.${wordList.portuguese[index3]}.${wordList.portuguese[index4]}`,
        english: `${wordList.english[index1]}.${wordList.english[index2]}.${wordList.english[index3]}.${wordList.english[index4]}`,
        japanese: `${wordList.japanese[index1]}.${wordList.japanese[index2]}.${wordList.japanese[index3]}.${wordList.japanese[index4]}`,
        spanish: `${wordList.spanish[index1]}.${wordList.spanish[index2]}.${wordList.spanish[index3]}.${wordList.spanish[index4]}`
    }
}

