import { Router } from 'express';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import bondsRouter from '@modules/users/infra/http/routes/bonds.routes';
import coursesRouter from '@modules/users/infra/http/routes/courses.routes';
import rolesRouter from '@modules/users/infra/http/routes/roles.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import equipmentsRouter from '@modules/rentable-items/infra/http/routes/equipments.routes';
import roomsRouter from '@modules/rentable-items/infra/http/routes/rooms.routes';
import sportCourtsRouter from '@modules/rentable-items/infra/http/routes/sportCourts.routes';

// import passwordRouter from '@modules/users/infra/http/routes/password.routes';

import reserves from '@modules/reserves/infra/http/routes/reserves.routes';
import equipmentReservesRoutes from '@modules/reserves/infra/http/routes/equipmentReserves.routes';
import sportCourtReservesRoutes from '@modules/reserves/infra/http/routes/sportCourtReserves.routes';
import roomReservesRoutes from '@modules/reserves/infra/http/routes/roomReserves.routes';

import myReserves from '@modules/reserves/infra/http/routes/myReserves.routes';


const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/bonds', bondsRouter);
routes.use('/roles', rolesRouter);
routes.use('/courses', coursesRouter);

routes.use('/equipments', ensureAuthenticated, equipmentsRouter);
routes.use('/rooms', ensureAuthenticated, roomsRouter);
routes.use('/sportCourts', ensureAuthenticated, sportCourtsRouter);
// routes.use('/password', passwordRouter);

routes.use('/my_reserves', ensureAuthenticated, myReserves);

routes.use('/reserves', reserves);
routes.use('/reserves/rooms', roomReservesRoutes);
routes.use('/reserves/equipments', equipmentReservesRoutes);
routes.use('/reserves/sportcourts', sportCourtReservesRoutes);

export default routes;
