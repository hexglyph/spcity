type CacheItem<T> = {
    value: T;
    expiry: number;
}

class MemoryCache<T> {
    private cache: Map<string, CacheItem<T>> = new Map();

    set(key: string, value: T, ttl: number): void {
        const expiry = Date.now() + ttl * 1000;
        this.cache.set(key, { value, expiry });
    }

    get(key: string): T | undefined {
        const item = this.cache.get(key);
        if (item && item.expiry > Date.now()) {
            return item.value;
        }
        this.cache.delete(key);
        return undefined;
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }
}

export const cellCache = new MemoryCache<unknown>();

