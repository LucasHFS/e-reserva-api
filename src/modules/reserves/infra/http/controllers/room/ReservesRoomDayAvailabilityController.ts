import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListRoomDayAvailabilityService from '@modules/reserves/services/room/ListRoomDayAvailabilityService';

export default class ReservesRoomDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { day, month, year, room_id } = request.body;

    const listRoomsDayAvailability = container.resolve(
      ListRoomDayAvailabilityService,
    );

    const availability = await listRoomsDayAvailability.execute({
      room_id,
      day,
      month,
      year,
    });

    return response.json(availability);
  }
}
