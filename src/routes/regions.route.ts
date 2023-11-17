import { Router } from 'express';
import regionsController from '../controllers/regions.controller';
import validateRegion from '../middlewares/validateRegion.middleware';

const router = Router();

router.get('/', regionsController.getAllRegions);
router.get('/:id', regionsController.getRegionById);
router.post('/', validateRegion, regionsController.createRegion);
router.put('/:id', validateRegion, regionsController.updateRegion);
router.delete('/:id', regionsController.deleteRegion);

export default router;
