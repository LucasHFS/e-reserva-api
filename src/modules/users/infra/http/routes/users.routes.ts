import { Router } from 'express';

import ensureAdminPermissions from '@modules/users/infra/http/middlewares/ensureAdminPermissions';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import UsersController from '../controllers/UsersController';

const usersRouter = Router();

const usersController = new UsersController();

usersRouter.get(
  '/',
  ensureAuthenticated,
  ensureAdminPermissions,
  usersController.all,
);
usersRouter.get('/:id', ensureAuthenticated, usersController.findOne);
usersRouter.post('/', usersController.create);
usersRouter.put('/:id', ensureAuthenticated, usersController.update);
usersRouter.delete('/:id', ensureAuthenticated, usersController.delete);

export default usersRouter;
