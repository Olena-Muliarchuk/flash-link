import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Redis client instance configuration.
 *
 */
const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
});

redis.on('connect', () => console.log('✅ Redis connected successfully'));
redis.on('error', (err) => console.error('❌ Redis Connection Error:', err));

export default redis;
