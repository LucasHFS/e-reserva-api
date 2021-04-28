import { Router } from 'express';

// import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import UsersController from '../controllers/UsersController';

const usersRouter = Router();

const usersController = new UsersController();

usersRouter.get('/', usersController.all);
usersRouter.get('/:id', usersController.findOne);
usersRouter.post('/', usersController.create);
usersRouter.put('/:id', usersController.update);
usersRouter.delete('/:id', usersController.delete);

export default usersRouter;
