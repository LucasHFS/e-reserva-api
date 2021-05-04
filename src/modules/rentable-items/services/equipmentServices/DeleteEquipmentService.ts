import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IEquipmentsRepository from '../../repositories/IEquipmentsRepository';

@injectable()
class DeleteEquipmentService {
  constructor(
    @inject('EquipmentsRepository')
    private equipmentsRepository: IEquipmentsRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const equipment = await this.equipmentsRepository.findById(id);

    if (!equipment) {
      throw new AppError('Papel não encontrado', 404);
    }

    await this.equipmentsRepository.delete(equipment);
  }
}

export default DeleteEquipmentService;
