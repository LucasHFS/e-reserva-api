import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { messages } from 'joi-translation-pt-br';
import RoomReservesController from '../controllers/room/RoomReservesController';

import ReservesRoomDayAvailabilityController from '../controllers/room/ReservesRoomDayAvailabilityController';
import AvailabileRoomsController from '../controllers/room/AvailabileRoomsController';

const roomReservesRouter = Router();

const reservesRoomsDayAvailabilityController = new ReservesRoomDayAvailabilityController();
const availableRoomsController = new AvailabileRoomsController();
const roomReservesController = new RoomReservesController();

roomReservesRouter.get(
  '/',
  roomReservesController.all,
);


roomReservesRouter.get(
  '/day-availability',
  celebrate(
    {
      [Segments.BODY]: {
        day: Joi.number().required(),
        month: Joi.number().required(),
        year: Joi.number().required(),
        room_id: Joi.string().required(),
      },
    },
    { messages },
    ),
  reservesRoomsDayAvailabilityController.index,
);


roomReservesRouter.get(
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
    availableRoomsController.index,
);

roomReservesRouter.get(
  '/:id',
  roomReservesController.findOne,
);

roomReservesRouter.post(
  '/',
  celebrate(
    {
      [Segments.BODY]: {
        room_id: Joi.string().uuid().required(),
        starts_at: Joi.date(),
        ends_at: Joi.date(),
      },
    },
    { messages },
  ),
  roomReservesController.create,
);

export default roomReservesRouter;
