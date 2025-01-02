import { MongoClient } from 'mongodb';
import { cpus } from 'os';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
const NUM_WORKERS = cpus().length;

interface IndexConfig {
    collection: string;
    field: string;
    options?: object;
}

const indexConfigs: IndexConfig[] = [
    { collection: 'gridcells', field: 'cellNumber', options: { unique: true } },
    // Add more index configurations here if needed
];

async function createIndexWorker(config: IndexConfig, client: MongoClient) {
    const db = client.db('spcity');
    const collection = db.collection(config.collection);

    try {
        await collection.createIndex({ [config.field]: 1 }, config.options);
        console.log(`Index on ${config.field} in ${config.collection} created successfully`);
    } catch (error) {
        console.error(`Error creating index on ${config.field} in ${config.collection}:`, error);
    }
}

async function createIndexes() {
    const client = new MongoClient(MONGODB_URI!);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const workerPromises = [];
        for (let i = 0; i < NUM_WORKERS; i++) {
            const configs = indexConfigs.filter((_, index) => index % NUM_WORKERS === i);
            workerPromises.push(
                Promise.all(configs.map(config => createIndexWorker(config, client)))
            );
        }

        await Promise.all(workerPromises);

        console.log('All indexes created successfully');
    } catch (error) {
        console.error('Error creating indexes:', error);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

createIndexes();

