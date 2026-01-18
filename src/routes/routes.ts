import { Router } from 'express';
import { LinkController } from '../controllers/link.controller';
import { validateBody, validateParams } from '../middleware/validate';
import { createLinkBody, getLinkParams } from '../schemas/link.schema';
import { createLinkLimiter, generalLimiter } from '../middleware/rateLimiter';

const router = Router();
const controller = new LinkController();

router.post(
    '/api/shorten',
    createLinkLimiter,
    validateBody(createLinkBody),
    controller.shorten.bind(controller),
);
router.get(
    '/api/stats/:code',
    generalLimiter,
    validateParams(getLinkParams),
    controller.getStats.bind(controller),
);
router.get('/:code', validateParams(getLinkParams), controller.redirect.bind(controller));

export default router;
