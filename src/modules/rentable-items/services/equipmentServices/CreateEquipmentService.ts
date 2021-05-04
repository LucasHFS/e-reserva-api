import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Equipment from '../../infra/typeorm/entities/Equipment';
import IEquipmentsRepository from '../../repositories/IEquipmentsRepository';
import dataValidator from '../../validators/dataValidator';

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateEquipmentService {
  constructor(
    @inject('EquipmentsRepository')
    private equipmentsRepository: IEquipmentsRepository,
  ) {}

  public async execute({ name, description }: IRequest): Promise<Equipment> {
    await dataValidator({
      name,
      description,
    });

    const checkEquipmentExists = await this.equipmentsRepository.findByName(
      name,
    );

    if (checkEquipmentExists) {
      throw new AppError('Equipamento já existente', 400);
    }

    const equipment = await this.equipmentsRepository.create({
      name,
      description,
    });

    return equipment;
  }
}

export default CreateEquipmentService;
