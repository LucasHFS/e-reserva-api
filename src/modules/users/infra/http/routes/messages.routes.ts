import { Router } from 'express';

import ensureAdminPermissions from '@modules/users/infra/http/middlewares/ensureAdminPermissions';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import MessagesController from '../controllers/MessagesController';

const messageRouter = Router();

const messagesController = new MessagesController();

messageRouter.put('/markread/:id', ensureAuthenticated, messagesController.markAsRead);
messageRouter.get('/admin', ensureAdminPermissions, messagesController.adminMessages);
messageRouter.get('/', ensureAuthenticated, messagesController.userMessages);

export default messageRouter;
