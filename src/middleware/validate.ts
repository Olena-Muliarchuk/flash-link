import { Request, Response, NextFunction } from 'express';
import { ZodType, z } from 'zod';

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
