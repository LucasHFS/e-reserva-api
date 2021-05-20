import { Router } from 'express';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import bondsRouter from '@modules/users/infra/http/routes/bonds.routes';
import coursesRouter from '@modules/users/infra/http/routes/courses.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import equipmentsRouter from '@modules/rentable-items/infra/http/routes/equipments.routes';
import roomsRouter from '@modules/rentable-items/infra/http/routes/rooms.routes';
import sportCourtsRouter from '@modules/rentable-items/infra/http/routes/sportCourts.routes';

import passwordRouter from '@modules/users/infra/http/routes/password.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/bonds', ensureAuthenticated, bondsRouter);
routes.use('/courses', ensureAuthenticated, coursesRouter);

routes.use('/equipments', ensureAuthenticated, equipmentsRouter);
routes.use('/rooms', ensureAuthenticated, roomsRouter);
routes.use('/sportCourts', ensureAuthenticated, sportCourtsRouter);
routes.use('/password', passwordRouter);

export default routes;
