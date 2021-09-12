import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListRoomDayAvailabilityService from '@modules/reserves/services/room/ListRoomDayAvailabilityService';
import AppError from '@shared/errors/AppError';

export default class ReservesRoomDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { date, room_id } = request.query;
    if(!date){
      throw new AppError('Data é um campo obrigatório', 400)
    }

    if(!room_id){
      throw new AppError('id da quadra é obrigatório', 400)
    }    

    const data = new Date(parseInt(date.toString()));

    const listRoomsDayAvailability = container.resolve(
      ListRoomDayAvailabilityService,
    );

    const availability = await listRoomsDayAvailability.execute({
      room_id: room_id.toString(),
      day: data.getDate(),
      month: data.getMonth(),
      year: data.getFullYear(),
    });

    return response.json(availability);
  }
}
