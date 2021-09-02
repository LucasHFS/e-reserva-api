import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { messages } from 'joi-translation-pt-br';
import EquipmentReservesController from '../controllers/equipment/EquipmentReservesController';

import ReservesEquipmentDayAvailabilityController from '../controllers/equipment/ReservesEquipmentDayAvailabilityController';
import AvailableEquipmentsController from '../controllers/equipment/AvailableEquipmentsController';

const equipmentReservesRouter = Router();

const reservesEquipmentsDayAvailabilityController = new ReservesEquipmentDayAvailabilityController();

const equipmentReservesController = new EquipmentReservesController();
const availableEquipmentsController = new AvailableEquipmentsController();



equipmentReservesRouter.get(
  '/',
  equipmentReservesController.all,
  );
  
  
  equipmentReservesRouter.get(
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
      availableEquipmentsController.index,
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


equipmentReservesRouter.get(
  '/:id',
  equipmentReservesController.findOne,
);

equipmentReservesRouter.post(
  '/',
  celebrate(
    {
      [Segments.BODY]: {
        equipment_id: Joi.string().uuid().required(),
        starts_at: Joi.date(),
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
