import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IBondsRepository from '../../repositories/IBondsRepository';

@injectable()
class DeleteBondService {
  constructor(
    @inject('BondsRepository')
    private bondsRepository: IBondsRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const bond = await this.bondsRepository.findById(id);

    if (!bond) {
      throw new AppError('Vínculo não encontrado', 404);
    }

    await this.bondsRepository.delete(bond);
  }
}

export default DeleteBondService;
