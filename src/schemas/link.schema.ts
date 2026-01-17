import { z } from 'zod';

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

export const getLinkParams = z.object({
    code: z.string().trim().min(1).max(20),
});

export type CreateLinkBody = z.infer<typeof createLinkBody>;
export type GetLinkParams = z.infer<typeof getLinkParams>;
