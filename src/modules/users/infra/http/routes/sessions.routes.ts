import { Router } from 'express';

import SessionsController from '../controllers/SessionsController';
import ensureAuthenticated from '../middlewares/ensureAdminPermissions';

const sessionsRouter = Router();

const sessionsController = new SessionsController();

sessionsRouter.post('/', sessionsController.create);

sessionsRouter.get('/verify_token', sessionsController.validate);

export default sessionsRouter;
