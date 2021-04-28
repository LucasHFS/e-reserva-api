import { Router } from 'express';

import RolesController from '../controllers/RolesController';

const rolesRouter = Router();

const rolesController = new RolesController();

rolesRouter.get('/', rolesController.all);
rolesRouter.get('/:id', rolesController.findOne);
rolesRouter.post('/', rolesController.create);
rolesRouter.put('/:id', rolesController.update);
rolesRouter.delete('/:id', rolesController.delete);

export default rolesRouter;
