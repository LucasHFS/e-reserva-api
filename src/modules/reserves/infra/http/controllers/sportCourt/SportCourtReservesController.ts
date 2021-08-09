import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateSportCourtReserveService from '@modules/reserves/services/sportCourt/CreateSportCourtReserveService';

export default class SportCourtReservesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { sport_court_id, starts_at, ends_at } = request.body;

    const createReserve = container.resolve(CreateSportCourtReserveService);

    const reserve = await createReserve.execute({
      sport_court_id,
      user_id,
      starts_at,
      ends_at,
    });

    return response.json(reserve);
  }

}
