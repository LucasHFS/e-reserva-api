import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListRoomDayAvailabilityService from '@modules/reserves/services/room/ListRoomDayAvailabilityService';

export default class ReservesRoomDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { date, room_id } = request.body;
    const data = new Date(date);
    
    const listRoomsDayAvailability = container.resolve(
      ListRoomDayAvailabilityService,
    );

    const availability = await listRoomsDayAvailability.execute({
      room_id,
      day: data.getDate(),
      month: data.getMonth(),
      year: data.getFullYear(),
    });

    return response.json(availability);
  }
}
