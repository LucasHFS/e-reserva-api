import AppError from '@shared/errors/AppError';
import { Request, Response } from 'express';
import { getManager } from 'typeorm';

export default class AvailabileSportCourtController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { date, hour, minute } = request.query;

    if(!date || !hour || !minute){
      throw new AppError('Invalid fields', 400)
    }

    const dateTime = new Date(parseInt(date.toString()))
    dateTime.setHours(parseInt(hour.toString()));
    dateTime.setMinutes(parseInt(minute.toString()))
    dateTime.setSeconds(0)
    dateTime.setMilliseconds(0)
    
    const entityManager = getManager();

    const sport_courts = await entityManager.query(`
      SELECT sc.* FROM sport_courts sc
        WHERE sc.id NOT IN (
          SELECT sc.id FROM sport_courts sc
            INNER JOIN sport_court_reserve scr ON sc.id = scr.sport_court_id 
                WHERE scr.starts_at = $1
          )
    `, [dateTime]);

    
    return response.json(sport_courts);
  }
}
