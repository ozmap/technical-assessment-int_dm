import { Router } from 'express'
import controllerRegions from '../controller/controller.regions'

const router = Router()

router.post('/', controllerRegions.createRegions)
router.get('/', controllerRegions.findAllRegions)
router.get('/byId/:id', controllerRegions.findByIdRegions)
router.get('/byPoint', controllerRegions.findRegionsByPointSpecific)
router.get('/byPointDistance', controllerRegions.findRegionsWithinDistance)
router.patch('/:id', controllerRegions.updateRegions)
router.delete('/:id', controllerRegions.deleteByIdRegions)

export default router
