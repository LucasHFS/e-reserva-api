import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListEquipmentDayAvailabilityService from '@modules/reserves/services/equipment/ListEquipmentDayAvailabilityService';
import AppError from '@shared/errors/AppError';

export default class ReservesEquipmentDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { date, equipment_id } = request.query;

    if(!date){
      throw new AppError('Data é um campo obrigatório', 400)
    }

    if(!equipment_id){
      throw new AppError('id da quadra é obrigatório', 400)
    }    

    const data = new Date(parseInt(date.toString()));

    const listEquipmentsDayAvailability = container.resolve(
      ListEquipmentDayAvailabilityService,
    );

    const availability = await listEquipmentsDayAvailability.execute({
      day: data.getDate(),
      month: data.getMonth(),
      year: data.getFullYear(),
      equipment_id: equipment_id.toString(),
    });

    return response.json(availability);
  }
}
