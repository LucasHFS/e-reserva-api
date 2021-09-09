import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListEquipmentDayAvailabilityService from '@modules/reserves/services/equipment/ListEquipmentDayAvailabilityService';

export default class ReservesEquipmentDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { date, equipment_id } = request.body;

    const data = new Date(date);

    const listEquipmentsDayAvailability = container.resolve(
      ListEquipmentDayAvailabilityService,
    );

    const availability = await listEquipmentsDayAvailability.execute({
      day: data.getDate(),
      month: data.getMonth(),
      year: data.getFullYear(),
      equipment_id,
    });

    return response.json(availability);
  }
}
