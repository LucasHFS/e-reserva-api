import { Router } from 'express';

import ensureAdminPermissions from '@modules/users/infra/http/middlewares/ensureAdminPermissions';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import BondsController from '../controllers/BondsController';

const bondsRouter = Router();

const bondsController = new BondsController();

bondsRouter.get('/', bondsController.all);
bondsRouter.get('/:id', bondsController.findOne);
bondsRouter.post(
  '/',
  ensureAuthenticated,
  ensureAdminPermissions,
  bondsController.create,
);
bondsRouter.put(
  '/:id',
  ensureAuthenticated,
  ensureAdminPermissions,
  bondsController.update,
);
bondsRouter.delete(
  '/:id',
  ensureAuthenticated,
  ensureAdminPermissions,
  bondsController.delete,
);

export default bondsRouter;
