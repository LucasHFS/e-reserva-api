import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListAllReserves from '@modules/reserves/services/ListAllReservesService';

export default class ReservesController {
  public async index(request: Request, response: Response): Promise<Response> {

    const listReserves = container.resolve(ListAllReserves);

    const reserves = await listReserves.execute();

    return response.json(reserves);
  }
}
