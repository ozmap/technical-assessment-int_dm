import { Router } from 'express';
import regionsController from '../controllers/regions.controller';

const router = Router();

router.get('/', regionsController.getAllRegions);
router.post('/');

export default router;
