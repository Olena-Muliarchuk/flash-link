import { Request, Response } from 'express';
import { LinkService } from '../services/link.service';
import { CreateLinkBody, GetLinkParams } from '../schemas/link.schema';

const linkService = new LinkService();

export class LinkController {
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
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

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
