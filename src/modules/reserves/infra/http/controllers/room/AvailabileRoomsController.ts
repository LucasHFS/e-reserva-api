import { Request, Response } from 'express';
import { getManager } from 'typeorm';

export default class AvailabileRoomsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { date, hour, minute } = request.body;
    const dateTime = new Date(date)
    dateTime.setHours(hour);
    dateTime.setMinutes(minute);
    dateTime.setSeconds(0)
    dateTime.setMilliseconds(0)

    console.log(dateTime)
    
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
