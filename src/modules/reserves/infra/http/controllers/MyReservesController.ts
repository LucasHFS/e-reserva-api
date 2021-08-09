import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListMyReserves from '@modules/reserves/services/ListMyReservesService';

export default class MyReservesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const listReserves = container.resolve(ListMyReserves);

    const reserve = await listReserves.execute({
      user_id,
    });

    return response.json(reserve);
  }
}
