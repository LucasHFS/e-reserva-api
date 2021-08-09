import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureAdminPermissions from '@modules/users/infra/http/middlewares/ensureAdminPermissions';
import ReservesController from '../controllers/ReservesController';
import PendingReservesController from '../controllers/PendingReservesController';

const reservesRoutes = Router();

const reservesController = new ReservesController();
const pendingReservesController = new PendingReservesController();

reservesRoutes.use(ensureAuthenticated);

reservesRoutes.get('/', reservesController.index); 

reservesRoutes.get('/pending', pendingReservesController.index); 

reservesRoutes.put('/:id/accept', ensureAdminPermissions, pendingReservesController.accept);
reservesRoutes.put('/:id/deny', ensureAdminPermissions, pendingReservesController.deny);

export default reservesRoutes;
