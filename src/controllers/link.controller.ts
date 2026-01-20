import { Request, Response } from 'express';
import { LinkService } from '../services/link.service';
import { CreateLinkBody, GetLinkParams } from '../schemas/link.schema';

const linkService = new LinkService();

/**
 * Controller class handling HTTP requests for Link operations.
 */
export class LinkController {
    /**
     * Handles the creation of a new short link.
     * POST /api/shorten
     *
     * @param req - Express Request object containing url, ttl, and customCode.
     * @param res - Express Response object.
     */
    async shorten(req: Request, res: Response) {
        const { url, ttl, customCode } = req.body as CreateLinkBody;

        try {
            const shortCode = await linkService.createShortLink(url, ttl, customCode);
            const baseUrl = `${req.protocol}://${req.get('host')}`;

            res.status(201).json({
                shortCode,
                shortUrl: `${baseUrl}/${shortCode}`,
                originalUrl: url,
            });
        } catch (error) {
            if (error instanceof Error && error.message === 'Code already in use') {
                return res.status(409).json({ error: 'Custom code already in use' });
            }
            if (
                error instanceof Error &&
                error.message.includes('Failed to generate unique code')
            ) {
                return res.status(503).json({ error: 'Server busy, please try again later' });
            }
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * Redirects the user to the original URL based on the short code.
     * GET /:code
     */
    async redirect(req: Request, res: Response) {
        const { code } = req.params as GetLinkParams;

        try {
            const url = await linkService.getOriginalUrl(code);
            if (!url) return res.status(404).json({ error: 'Link not found' });
            res.redirect(url);
        } catch {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * Retrieves statistics (visit count) for a short link.
     * GET /api/stats/:code
     */
    async getStats(req: Request, res: Response) {
        const { code } = req.params as GetLinkParams;

        try {
            const visits = await linkService.getStats(code);
            res.json({ code, visits });
        } catch {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
