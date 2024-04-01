import * as express from 'express'
import { regionService } from '../services/region.service'

export const regionRouter = express.Router()

regionRouter.get('/contains', regionService.getRegionsContainingPoint)
regionRouter.get('/', regionService.getAllRegions)
regionRouter.post('/', regionService.createRegion)
regionRouter.get('/:id', regionService.getRegionById)
regionRouter.put('/:id', regionService.updateRegion)
regionRouter.delete('/:id', regionService.deleteRegion)
