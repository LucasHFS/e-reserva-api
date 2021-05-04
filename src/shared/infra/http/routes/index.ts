import { Router } from 'express';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import bondsRouter from '@modules/users/infra/http/routes/bonds.routes';
import coursesRouter from '@modules/users/infra/http/routes/courses.routes';
import rolesRouter from '@modules/users/infra/http/routes/roles.routes';

import equipmentsRouter from '@modules/rentable-items/infra/http/routes/equipments.routes';
import roomsRouter from '@modules/rentable-items/infra/http/routes/rooms.routes';
import sportCourtsRouter from '@modules/rentable-items/infra/http/routes/sportCourts.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/bonds', bondsRouter);
routes.use('/courses', coursesRouter);
routes.use('/roles', rolesRouter);

routes.use('/equipments', equipmentsRouter);
routes.use('/rooms', roomsRouter);
routes.use('/sportCourts', sportCourtsRouter);

export default routes;
