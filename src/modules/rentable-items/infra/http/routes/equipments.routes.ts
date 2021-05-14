import { Router } from 'express';

import ensureAdminPermissions from '@modules/users/infra/http/middlewares/ensureAdminPermissions';
import EquipmentsController from '../controllers/EquipmentsController';

const equipmentRouter = Router();

const equipmentController = new EquipmentsController();

equipmentRouter.get('/', equipmentController.all);
equipmentRouter.get('/:id', equipmentController.findOne);
equipmentRouter.post('/', ensureAdminPermissions, equipmentController.create);
equipmentRouter.put('/:id', ensureAdminPermissions, equipmentController.update);
equipmentRouter.delete(
  '/:id',
  ensureAdminPermissions,
  equipmentController.delete,
);

export default equipmentRouter;
