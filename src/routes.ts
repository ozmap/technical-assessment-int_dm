import * as express from 'express'
import { userRouter } from './controllers/regionController/users/user.controller'
import { regionRouter } from './controllers/region.controller'

const router = express.Router()

router.use('/users', userRouter)
router.use('/regions', regionRouter)

export default router
