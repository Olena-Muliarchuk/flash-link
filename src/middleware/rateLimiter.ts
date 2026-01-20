import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for link creation endpoints.
 *
 * @remarks
 * Strict limit to prevent spam/abuse of the database.
 * Allows 20 requests per 15 minutes per IP.
 */
export const createLinkLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many links created from this IP, please try again after 15 minutes',
    },
});

/**
 * General rate limiter for read operations (stats, etc.).
 *
 * @remarks
 * Protects against denial-of-service (DoS) attacks.
 * Allows 100 requests per 1 minute per IP.
 */
export const generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many requests, please try again later',
    },
});
