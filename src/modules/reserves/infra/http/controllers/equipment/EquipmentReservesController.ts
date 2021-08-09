import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateEquipmentReserveService from '@modules/reserves/services/equipment/CreateEquipmentReserveService';

export default class EquipmentReservesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { equipment_id, starts_at, ends_at } = request.body;

    const createReserve = container.resolve(CreateEquipmentReserveService);

    const reserve = await createReserve.execute({
      equipment_id,
      user_id,
      starts_at,
      ends_at,
    });

    return response.json(reserve);
  }

}
