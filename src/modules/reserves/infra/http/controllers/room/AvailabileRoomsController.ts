import AppError from '@shared/errors/AppError';
import { Request, Response } from 'express';
import { getManager } from 'typeorm';

export default class AvailabileRoomsController {
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

    const rooms = await entityManager.query(`
    SELECT r.* FROM rooms r
      WHERE r.id NOT IN (
        SELECT r.id FROM rooms r
          INNER JOIN room_reserve rr ON r.id = rr.room_id 
              WHERE rr.starts_at = $1 and rr.status != 'denied'
        )
    `, [dateTime]);

    
    return response.json(rooms);
  }
}
