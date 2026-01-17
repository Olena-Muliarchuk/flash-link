import redis from '../utils/redis';
import { generateShortCode } from '../utils/generator';

export class LinkService {
    private readonly DEFAULT_TTL = 86400; // 24 hour

    async createShortLink(originalUrl: string, ttl?: number, customCode?: string): Promise<string> {
        const finalTTL = ttl || this.DEFAULT_TTL;
        let shortCode = customCode;

        if (shortCode) {
            const exists = await redis.exists(`link:${shortCode}`);
            if (exists) {
                throw new Error('Code already in use');
            }
        } else {
            do {
                shortCode = generateShortCode();
            } while (await redis.exists(`link:${shortCode}`));
        }

        await redis
            .multi()
            .set(`link:${shortCode}`, originalUrl, 'EX', finalTTL)
            .set(`stats:${shortCode}`, 0, 'EX', finalTTL)
            .exec();

        return shortCode!;
    }

    async getOriginalUrl(shortCode: string): Promise<string | null> {
        const url = await redis.get(`link:${shortCode}`);
        if (url) {
            redis.incr(`stats:${shortCode}`); // Fire-and-forget
        }
        return url;
    }

    async getStats(shortCode: string): Promise<number> {
        const visits = await redis.get(`stats:${shortCode}`);
        return visits ? parseInt(visits, 10) : 0;
    }
}
