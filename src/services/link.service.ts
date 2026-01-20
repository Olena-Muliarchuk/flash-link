import redis from '../utils/redis';
import { generateShortCode } from '../utils/generator';

/**
 * Service class handling business logic for URL shortening.
 * Interacts with Redis for storage and retrieval.
 */
export class LinkService {
    private readonly DEFAULT_TTL = 86400; // 24 hour

    /**
     * Creates a shortened link and stores it in Redis.
     *
     * @param originalUrl - The destination URL to shorten.
     * @param ttlSeconds - (Optional) Expiration time in seconds. Defaults to 24 hours.
     * @param customCode - (Optional) A custom alias for the link.
     * @returns The generated or provided short code.
     *
     * @throws Error if the custom code is already in use.
     * @throws Error if a unique code cannot be generated after max attempts.
     */
    async createShortLink(
        originalUrl: string,
        ttlSeconds?: number,
        customCode?: string,
    ): Promise<string> {
        const ttl = ttlSeconds || this.DEFAULT_TTL;
        let shortCode = customCode;

        if (shortCode) {
            const exists = await redis.exists(`link:${shortCode}`);
            if (exists) {
                throw new Error('Code already in use');
            }
        } else {
            let unique = false;
            let attempts = 0;
            const MAX_ATTEMPTS = 10;

            while (!unique && attempts < MAX_ATTEMPTS) {
                shortCode = generateShortCode();
                const exists = await redis.exists(`link:${shortCode}`);
                if (!exists) {
                    unique = true;
                } else {
                    attempts++;
                }
            }

            if (!unique || !shortCode) {
                throw new Error('Failed to generate unique code. Please try again.');
            }
        }

        await redis
            .multi()
            .set(`link:${shortCode}`, originalUrl, 'EX', ttl)
            .set(`stats:${shortCode}`, 0, 'EX', ttl)
            .exec();

        return shortCode;
    }

    /**
     * Retrieves the original URL for a given short code and increments stats.
     *
     * @param shortCode - The short code to look up.
     * @returns The original URL if found, otherwise null.
     */
    async getOriginalUrl(shortCode: string): Promise<string | null> {
        const url = await redis.get(`link:${shortCode}`);
        if (url) {
            redis.incr(`stats:${shortCode}`); // Fire-and-forget
        }
        return url;
    }

    /**
     * Retrieves the visit count for a given short code.
     *
     * @param shortCode - The short code to query.
     * @returns The number of visits (default 0).
     */
    async getStats(shortCode: string): Promise<number> {
        const visits = await redis.get(`stats:${shortCode}`);
        return visits ? parseInt(visits, 10) : 0;
    }
}
