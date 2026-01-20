import { Request, Response, NextFunction } from 'express';
import { ZodType, z } from 'zod';

/**
 * Middleware factory to validate the request body against a Zod schema.
 *
 * @param schema - The Zod schema to validate req.body against.
 * @returns An Express middleware function.
 *
 * @remarks
 * If validation fails, it responds with 400 Bad Request and detailed error messages.
 * If successful, it replaces `req.body` with the sanitized/parsed data.
 */
export const validateBody =
    (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: z.flattenError(result.error).fieldErrors,
            });
        }

        req.body = result.data;
        next();
    };

/**
 * Middleware factory to validate request path parameters against a Zod schema.
 *
 * @param schema - The Zod schema to validate req.params against.
 * @returns An Express middleware function.
 *
 * @remarks
 * If validation fails, responds with 400 Bad Request.
 * If successful, merges sanitized data back into `req.params`.
 */
export const validateParams =
    (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.params);

        if (!result.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: z.flattenError(result.error).fieldErrors,
            });
        }

        Object.assign(req.params, result.data);
        next();
    };
