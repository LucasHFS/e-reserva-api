import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListSportCourtDayAvailabilityService from '@modules/reserves/services/sportCourt/ListSportCourtDayAvailabilityService';
import AppError from '@shared/errors/AppError';

export default class ReservesSportCourtDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { date, sport_court_id } = request.query;

    if(!date){
      throw new AppError('Data é um campo obrigatório', 400)
    }

    if(!sport_court_id){
      throw new AppError('id da quadra é obrigatório', 400)
    }

    const data = new Date(parseInt(date.toString()));

    const listSportCourtsDayAvailability = container.resolve(
      ListSportCourtDayAvailabilityService,
    );

    const availability = await listSportCourtsDayAvailability.execute({
      day: data.getDate(),
      month: data.getMonth(),
      year: data.getFullYear(),
      sport_court_id: sport_court_id.toString(),
    });

    return response.json(availability);
  }
}
