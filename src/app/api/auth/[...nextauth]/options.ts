import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import AppleProvider from 'next-auth/providers/apple'
import clientPromise from '@/lib/mongodb'
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { Session } from 'next-auth'

// Extend the built-in session type
interface ExtendedSession extends Session {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        level?: number;
        experience?: number;
        hp?: number;
        mana?: number;
        rank?: string;
    }
}

const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        AppleProvider({
            clientId: process.env.APPLE_ID!,
            clientSecret: process.env.APPLE_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            const client = await clientPromise
            const db = client.db('spcity')
            const playersCollection = db.collection('players')

            const existingPlayer = await playersCollection.findOne({ email: user.email })

            if (!existingPlayer) {
                await playersCollection.insertOne({
                    email: user.email,
                    name: user.name,
                    level: 1,
                    experience: 0,
                    hp: 10,
                    mana: 10,
                    rank: 'Bronze 3',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
            }

            return true
        },
        async session({ session, token }): Promise<ExtendedSession> {
            const client = await clientPromise
            const db = client.db('spcity')
            const playersCollection = db.collection('players')

            const playerData = await playersCollection.findOne({ email: session.user?.email })

            if (playerData) {
                (session as ExtendedSession).user = {
                    ...session.user,
                    id: token.sub || session.user.id, // Ensure id is always set
                    level: playerData.level,
                    experience: playerData.experience,
                    hp: playerData.hp,
                    mana: playerData.mana,
                    rank: playerData.rank,
                }
            } else if (session.user) {
                // Ensure id is set even if player data is not found
                (session as ExtendedSession).user.id = token.sub || session.user.id
            }

            return session as ExtendedSession
        },
    },
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
}

export default authOptions;

