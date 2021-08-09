import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListSportCourtDayAvailabilityService from '@modules/reserves/services/sportCourt/ListSportCourtDayAvailabilityService';

export default class ReservesSportCourtDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { day, month, year, sport_court_id } = request.body;

    const listSportCourtsDayAvailability = container.resolve(
      ListSportCourtDayAvailabilityService,
    );

    const availability = await listSportCourtsDayAvailability.execute({
      day,
      month,
      year,
      sport_court_id,
    });

    return response.json(availability);
  }
}
