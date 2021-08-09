import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { messages } from 'joi-translation-pt-br';
import SportCourtReservesController from '../controllers/sportCourt/SportCourtReservesController';

import ReservesSportCourtDayAvailabilityController from '../controllers/sportCourt/ReservesSportCourtDayAvailabilityController';

const sportCourtReservesRouter = Router();

const reservesSportCourtsDayAvailabilityController = new ReservesSportCourtDayAvailabilityController();

const sportCourtReservesController = new SportCourtReservesController();

sportCourtReservesRouter.use(ensureAuthenticated);

sportCourtReservesRouter.post(
  '/',
  celebrate(
    {
      [Segments.BODY]: {
        sport_court_id: Joi.string().uuid().required(),
        starts_at: Joi.date(),
        ends_at: Joi.date(),
      },
    },
    { messages },
  ),
  sportCourtReservesController.create,
);

sportCourtReservesRouter.get(
  '/day-availability',
  celebrate(
    {
      [Segments.BODY]: {
        day: Joi.number().required(),
        month: Joi.number().required(),
        year: Joi.number().required(),
        sport_court_id: Joi.string().required(),
      },
    },
    { messages },
    ),
  reservesSportCourtsDayAvailabilityController.index,
);

export default sportCourtReservesRouter;
