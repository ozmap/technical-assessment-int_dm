import * as express from 'express'
import { userService } from '../services/user.service'

export const userRouter = express.Router()

userRouter.get('/', userService.getAllUsers)
userRouter.get('/:id', userService.getUserById)
userRouter.post('/', userService.createUser)
userRouter.put('/:id', userService.updateUser)
userRouter.delete('/:id', userService.deleteUser)
