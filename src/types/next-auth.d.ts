export declare module "next-auth" {
    interface Session {
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
}

