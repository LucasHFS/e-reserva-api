import { Router } from 'express';

import ensureAdminPermissions from '@modules/users/infra/http/middlewares/ensureAdminPermissions';
import RoomsController from '../controllers/RoomsController';

const roomRouter = Router();

const roomController = new RoomsController();

roomRouter.get('/', roomController.all);
roomRouter.get('/:id', roomController.findOne);
roomRouter.post('/', ensureAdminPermissions, roomController.create);
roomRouter.put('/:id', ensureAdminPermissions, roomController.update);
roomRouter.delete('/:id', ensureAdminPermissions, roomController.delete);

export default roomRouter;
