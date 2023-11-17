import { Router } from 'express';
import usersController from '../controllers/users.controller';
import validateUser from '../middlewares/validateUser.middleware';

const router = Router();

router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.put('/:id', validateUser, usersController.updateUserById);
router.post('/', validateUser, usersController.createUser);
router.delete('/:id', usersController.deleteUser);

export default router;
