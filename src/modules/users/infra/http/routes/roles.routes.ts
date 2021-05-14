import { Router } from 'express';

import ensureAdminPermissions from '@modules/users/infra/http/middlewares/ensureAdminPermissions';
import RolesController from '../controllers/RolesController';

const rolesRouter = Router();

const rolesController = new RolesController();

rolesRouter.get('/', rolesController.all);
rolesRouter.get('/:id', rolesController.findOne);
rolesRouter.post('/', ensureAdminPermissions, rolesController.create);
rolesRouter.put('/:id', ensureAdminPermissions, rolesController.update);
rolesRouter.delete('/:id', ensureAdminPermissions, rolesController.delete);

export default rolesRouter;
