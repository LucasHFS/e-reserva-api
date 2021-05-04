import { Request, Response } from 'express';
import { container } from 'tsyringe';

import DeleteEquipmentService from '@modules/rentable-items/services/equipmentServices/DeleteEquipmentService';
import CreateEquipmentService from '@modules/rentable-items/services/equipmentServices/CreateEquipmentService';
import UpdateEquipmentService from '@modules/rentable-items/services/equipmentServices/UpdateEquipmentService';
import EquipmentsRepository from '@modules/rentable-items/infra/typeorm/repositories/EquipmentsRepository';
import AppError from '@shared/errors/AppError';

export default class EquipmentsController {
  public async all(request: Request, response: Response): Promise<Response> {
    const equipmentsRepository = new EquipmentsRepository();
    const equipments = await equipmentsRepository.find();
    return response.status(200).json(equipments);
  }

  public async findOne(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    if (!id) {
      throw new AppError('campo id é obrigatório', 400);
    }

    const equipmentsRepository = new EquipmentsRepository();
    const equipment = await equipmentsRepository.findById(id);

    if (!equipment) {
      throw new AppError('Papel não encontrado', 404);
    }

    return response.status(200).json(equipment);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, description } = request.body;

    const createEquipment = container.resolve(CreateEquipmentService);

    const equipment = await createEquipment.execute({
      name,
      description,
    });

    return response.status(201).json(equipment);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, description } = request.body;

    if (!id) {
      throw new AppError('campo id é obrigatório', 404);
    }

    const updateEquipment = container.resolve(UpdateEquipmentService);

    const equipment = await updateEquipment.execute({
      id,
      name,
      description,
    });

    return response.status(200).json(equipment);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    if (!id) {
      throw new AppError('campo id é obrigatório', 404);
    }

    const deleteEquipment = container.resolve(DeleteEquipmentService);

    await deleteEquipment.execute(id);

    return response.status(204).send();
  }
}
