import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Equipment from '../../infra/typeorm/entities/Equipment';
import IEquipmentsRepository from '../../repositories/IEquipmentsRepository';
import dataValidator from '../../validators/dataValidator';

interface IRequest {
  id: string;
  name: string;
  description: string;
}

@injectable()
class UpdateEquipmentService {
  constructor(
    @inject('EquipmentsRepository')
    private equipmentsRepository: IEquipmentsRepository,
  ) {}

  public async execute({
    id,
    name,
    description,
  }: IRequest): Promise<Equipment> {
    await dataValidator({
      name,
      description,
    });

    const thisEquipment = await this.equipmentsRepository.findById(id);

    if (!thisEquipment) {
      throw new AppError('Papel não encontrado', 404);
    }

    if (thisEquipment.name !== name) {
      const checkEquipmentExistsByMail = await this.equipmentsRepository.findByName(
        name,
      );
      if (checkEquipmentExistsByMail) {
        throw new AppError('Email já utilizado', 400);
      }
    }

    thisEquipment.name = name;
    thisEquipment.description = description;

    const equipment = await this.equipmentsRepository.save(thisEquipment);

    return equipment;
  }
}

export default UpdateEquipmentService;
