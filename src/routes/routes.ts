import { Router } from 'express';
import { LinkController } from '../controllers/link.controller';
import { validateBody, validateParams } from '../middleware/validate';
import { createLinkBody, getLinkParams } from '../schemas/link.schema';

const router = Router();
const controller = new LinkController();

router.post('/api/shorten', validateBody(createLinkBody), controller.shorten);
router.get('/api/stats/:code', validateParams(getLinkParams), controller.getStats);
router.get('/:code', validateParams(getLinkParams), controller.redirect);

export default router;
