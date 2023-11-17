import { Router } from 'express'
import controllerUser from '../controller.user'
import { /*createRegionsWithNewUser*/ filterUser } from '../middlewares'

const router = Router()

router.post('/', filterUser, controllerUser.create /*createRegionsWithNewUser*/)
router.get('/', controllerUser.findAll)
router.get('/:id', controllerUser.findById)
router.patch('/:id', filterUser, controllerUser.update)
router.delete('/:id', controllerUser.deleteById)

export default router
