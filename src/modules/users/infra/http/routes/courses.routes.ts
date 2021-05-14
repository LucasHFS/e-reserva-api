import { Router } from 'express';

import ensureAdminPermissions from '@modules/users/infra/http/middlewares/ensureAdminPermissions';
import CoursesController from '../controllers/CoursesController';

const coursesRouter = Router();

const coursesController = new CoursesController();

coursesRouter.get('/', coursesController.all);
coursesRouter.get('/:id', coursesController.findOne);
coursesRouter.post('/', ensureAdminPermissions, coursesController.create);
coursesRouter.put('/:id', ensureAdminPermissions, coursesController.update);
coursesRouter.delete('/:id', ensureAdminPermissions, coursesController.delete);

export default coursesRouter;
