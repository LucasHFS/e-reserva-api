import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListEquipmentDayAvailabilityService from '@modules/reserves/services/equipment/ListEquipmentDayAvailabilityService';

export default class ReservesEquipmentDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { day, month, year, equipment_id } = request.body;

    const listEquipmentsDayAvailability = container.resolve(
      ListEquipmentDayAvailabilityService,
    );

    const availability = await listEquipmentsDayAvailability.execute({
      day,
      month,
      year,
      equipment_id,
    });

    return response.json(availability);
  }
}
