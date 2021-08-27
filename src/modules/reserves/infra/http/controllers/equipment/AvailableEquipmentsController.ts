import { Request, Response } from 'express';
import { getManager } from 'typeorm';

export default class AvailableEquipmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { date, hour, minute } = request.body;
    const dateTime = new Date(date)
    dateTime.setHours(hour);
    dateTime.setMinutes(minute);
    dateTime.setSeconds(0)
    dateTime.setMilliseconds(0) 
    
    const entityManager = getManager();

    const equipments = await entityManager.query(`
      SELECT eq.* FROM equipments eq
        WHERE eq.id NOT IN (
          SELECT eq.id FROM equipments eq
            INNER JOIN equipment_reserve er ON eq.id = er.equipment_id 
                WHERE er.starts_at = $1
          )
    `, [dateTime]);

    
    return response.json(equipments);
  }
}
