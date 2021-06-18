import { Router } from 'express';

import ensureAdminPermissions from '@modules/users/infra/http/middlewares/ensureAdminPermissions';
import RolesController from '../controllers/RolesController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const rolesRouter = Router();

const rolesController = new RolesController();

rolesRouter.get('/', rolesController.all);
rolesRouter.get('/:id', rolesController.findOne);
rolesRouter.post(
  '/',
  ensureAuthenticated,
  ensureAdminPermissions,
  rolesController.create,
);
rolesRouter.put(
  '/:id',
  ensureAuthenticated,
  ensureAdminPermissions,
  rolesController.update,
);
rolesRouter.delete(
  '/:id',
  ensureAuthenticated,
  ensureAdminPermissions,
  rolesController.delete,
);

export default rolesRouter;
