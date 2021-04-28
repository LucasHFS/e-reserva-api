import { Router } from 'express';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import bondsRouter from '@modules/users/infra/http/routes/bonds.routes';
import coursesRouter from '@modules/users/infra/http/routes/courses.routes';
import rolesRouter from '@modules/users/infra/http/routes/roles.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/bonds', bondsRouter);
routes.use('/courses', coursesRouter);
routes.use('/roles', rolesRouter);

export default routes;
