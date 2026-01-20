import { z } from 'zod';

/**
 * Zod schema for validating the request body when creating a short link.
 *
 * @property url - The destination URL. Must be a valid URL format and max 2048 chars.
 * @property ttl - Optional Time-To-Live in seconds (min 60s, max 1 year).
 * @property customCode - Optional custom alias. Alphanumeric + dash/underscore (3-20 chars).
 */
export const createLinkBody = z.object({
    url: z.url().max(2048),
    ttl: z.number().int().min(60).max(31536000).optional(),
    customCode: z
        .string()
        .trim()
        .min(3)
        .max(20)
        .regex(/^[a-zA-Z0-9_-]+$/)
        .optional(),
});

/**
 * Zod schema for validating route parameters (e.g., /:code).
 *
 * @property code - The short code identifier (1-20 chars).
 */
export const getLinkParams = z.object({
    code: z.string().trim().min(1).max(20),
});

/** Inferred TypeScript type for creating a link */
export type CreateLinkBody = z.infer<typeof createLinkBody>;
/** Inferred TypeScript type for link parameters */
export type GetLinkParams = z.infer<typeof getLinkParams>;
