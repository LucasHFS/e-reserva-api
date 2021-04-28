import { Router } from 'express';

import CoursesController from '../controllers/CoursesController';

const coursesRouter = Router();

const coursesController = new CoursesController();

coursesRouter.get('/', coursesController.all);
coursesRouter.get('/:id', coursesController.findOne);
coursesRouter.post('/', coursesController.create);
coursesRouter.put('/:id', coursesController.update);
coursesRouter.delete('/:id', coursesController.delete);

export default coursesRouter;
