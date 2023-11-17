import { Router } from 'express'
import controllerRegions from '../controller.regions'

const router = Router()

router.post('/', controllerRegions.createRegions)
router.get('/', controllerRegions.findAllRegions)
router.get('/:id', controllerRegions.findByIdRegions)
router.patch('/:id', controllerRegions.updateRegions)
router.delete('/:id', controllerRegions.deleteByIdRegions)

export default router
