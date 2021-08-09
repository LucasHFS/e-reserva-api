import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateRoomReserveService from '@modules/reserves/services/room/CreateRoomReserveService';

export default class RoomReservesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { room_id, starts_at, ends_at } = request.body;

    const createReserve = container.resolve(CreateRoomReserveService);

    const reserve = await createReserve.execute({
      room_id,
      user_id,
      starts_at,
      ends_at,
    });

    return response.json(reserve);
  }

}
