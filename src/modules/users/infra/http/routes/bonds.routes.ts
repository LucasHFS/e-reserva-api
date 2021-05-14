import { Router } from 'express';

import ensureAdminPermissions from '@modules/users/infra/http/middlewares/ensureAdminPermissions';
import BondsController from '../controllers/BondsController';

const bondsRouter = Router();

const bondsController = new BondsController();

bondsRouter.get('/', bondsController.all);
bondsRouter.get('/:id', bondsController.findOne);
bondsRouter.post('/', ensureAdminPermissions, bondsController.create);
bondsRouter.put('/:id', ensureAdminPermissions, bondsController.update);
bondsRouter.delete('/:id', ensureAdminPermissions, bondsController.delete);

export default bondsRouter;
