import { Router } from 'express';
import usersController from '../controllers/users.controller';
import validateUser from '../middlewares/validateUser';

const router = Router();

router.get('/', usersController.findAll);
router.get('/:id', usersController.getUserById);
router.put('/:id', usersController.updateUserById);
router.post('/', validateUser, usersController.createUser);

export default router;
