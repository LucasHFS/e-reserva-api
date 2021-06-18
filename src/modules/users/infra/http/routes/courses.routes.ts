import { Router } from 'express';

import ensureAdminPermissions from '@modules/users/infra/http/middlewares/ensureAdminPermissions';
import CoursesController from '../controllers/CoursesController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const coursesRouter = Router();

const coursesController = new CoursesController();

coursesRouter.get('/', coursesController.all);
coursesRouter.get('/:id', coursesController.findOne);
coursesRouter.post(
  '/',
  ensureAuthenticated,
  ensureAdminPermissions,
  coursesController.create,
);
coursesRouter.put(
  '/:id',
  ensureAuthenticated,
  ensureAdminPermissions,
  coursesController.update,
);
coursesRouter.delete(
  '/:id',
  ensureAuthenticated,
  ensureAdminPermissions,
  coursesController.delete,
);

export default coursesRouter;
