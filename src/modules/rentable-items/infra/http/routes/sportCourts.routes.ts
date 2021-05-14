import { Router } from 'express';

import ensureAdminPermissions from '@modules/users/infra/http/middlewares/ensureAdminPermissions';
import SportCourtsController from '../controllers/SportCourtsController';

const sportCourtRouter = Router();

const sportCourtController = new SportCourtsController();

sportCourtRouter.get('/', sportCourtController.all);
sportCourtRouter.get('/:id', sportCourtController.findOne);
sportCourtRouter.post('/', ensureAdminPermissions, sportCourtController.create);
sportCourtRouter.put(
  '/:id',
  ensureAdminPermissions,
  sportCourtController.update,
);
sportCourtRouter.delete(
  '/:id',
  ensureAdminPermissions,
  sportCourtController.delete,
);

export default sportCourtRouter;
