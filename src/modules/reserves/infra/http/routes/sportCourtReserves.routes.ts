import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { messages } from 'joi-translation-pt-br';
import SportCourtReservesController from '../controllers/sportCourt/SportCourtReservesController';

import ReservesSportCourtDayAvailabilityController from '../controllers/sportCourt/ReservesSportCourtDayAvailabilityController';
import AvailabileSportCourtController from '../controllers/sportCourt/AvailabileSportCourtController';

const sportCourtReservesRouter = Router();

const reservesSportCourtsDayAvailabilityController = new ReservesSportCourtDayAvailabilityController();

const sportCourtReservesController = new SportCourtReservesController();
const availableSportCourtController = new AvailabileSportCourtController();

sportCourtReservesRouter.get(
  '/',
  sportCourtReservesController.all,
);


sportCourtReservesRouter.get(
  '/day-availability',
  celebrate(
    {
      [Segments.BODY]: {
        date: Joi.number().required(),
        sport_court_id: Joi.string().required(),
      },
    },
    { messages },
    ),
  reservesSportCourtsDayAvailabilityController.index,
);

sportCourtReservesRouter.get(
  '/available',
  celebrate(
    {
      [Segments.QUERY]: {
        date: Joi.number().required(),
        hour: Joi.number().required(),
        minute: Joi.number().required(),
      },
    },
    { messages },
    ),
    availableSportCourtController.index,
);

sportCourtReservesRouter.get(
  '/:id',
  sportCourtReservesController.findOne,
);
sportCourtReservesRouter.post(
  '/',
  celebrate(
    {
      [Segments.BODY]: {
        sport_court_id: Joi.string().uuid().required(),
        starts_at: Joi.date(),
      },
    },
    { messages },
  ),
  sportCourtReservesController.create,
);

export default sportCourtReservesRouter;
