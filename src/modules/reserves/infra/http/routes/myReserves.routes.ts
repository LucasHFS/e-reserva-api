import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import MyReservesController from '../controllers/MyReservesController';

const myReservesRoutes = Router();

const myReservesController = new MyReservesController();

myReservesRoutes.use(ensureAuthenticated);

myReservesRoutes.get('/', myReservesController.index); 

export default myReservesRoutes;
