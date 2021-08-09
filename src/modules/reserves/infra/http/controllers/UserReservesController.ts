import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderReservesService from '@modules/reserves/services/equipment/ListEquipmentReservesService';

export default class ReservesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { day, month, year } = request.body;

    const listProviderReserves = container.resolve(ListProviderReservesService);

    const reserves = await listProviderReserves.execute({
      user_id,
      day,
      month,
      year,
    });

    return response.json(reserves);
  }
}
