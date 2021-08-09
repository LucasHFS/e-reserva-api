import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { messages } from 'joi-translation-pt-br';
import EquipmentReservesController from '../controllers/equipment/EquipmentReservesController';

import ReservesEquipmentDayAvailabilityController from '../controllers/equipment/ReservesEquipmentDayAvailabilityController';

const equipmentReservesRouter = Router();

const reservesEquipmentsDayAvailabilityController = new ReservesEquipmentDayAvailabilityController();

const equipmentReservesController = new EquipmentReservesController();

equipmentReservesRouter.use(ensureAuthenticated);

equipmentReservesRouter.post(
  '/',
  celebrate(
    {
      [Segments.BODY]: {
        equipment_id: Joi.string().uuid().required(),
        starts_at: Joi.date(),
        ends_at: Joi.date(),
      },
    },
    { messages },
  ),
  equipmentReservesController.create,
);

equipmentReservesRouter.get(
  '/day-availability',
  celebrate(
    {
      [Segments.BODY]: {
        day: Joi.number().required(),
        month: Joi.number().required(),
        year: Joi.number().required(),
        equipment_id: Joi.string().required(),
      },
    },
    { messages },
    ),
  reservesEquipmentsDayAvailabilityController.index,
);

export default equipmentReservesRouter;
