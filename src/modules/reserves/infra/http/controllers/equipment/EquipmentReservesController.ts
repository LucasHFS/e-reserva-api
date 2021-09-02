import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateEquipmentReserveService from '@modules/reserves/services/equipment/CreateEquipmentReserveService';
import { getRepository } from 'typeorm';
import EquipmentReserve from '@modules/reserves/infra/typeorm/entities/EquipmentReserve';
import AppError from '@shared/errors/AppError';

export default class EquipmentReservesController {
  public async all(request: Request, response: Response): Promise<Response> {
    const equipmentReservesRepository = getRepository(EquipmentReserve);
    const equipments = await equipmentReservesRepository.find({
      relations: ['user', 'equipment'],
    });
    return response.status(200).json(equipments);
  }

  public async findOne(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const equipmentReservesRepository = getRepository(EquipmentReserve);

    const { id } = request.params;

    if (!id) {
      throw new AppError('campo id é obrigatório', 400);
    }

    const equipmentReserve = await equipmentReservesRepository.findOne(id, {
      relations: ['user', 'equipment'],
    });

    if (!equipmentReserve) {
      throw new AppError('Reserva não encontrada', 404);
    }

    return response.status(200).json(equipmentReserve);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { equipment_id, starts_at } = request.body;

    const createReserve = container.resolve(CreateEquipmentReserveService);

    const reserve = await createReserve.execute({
      equipment_id,
      user_id,
      starts_at,
    });

    return response.json(reserve);
  }

}
