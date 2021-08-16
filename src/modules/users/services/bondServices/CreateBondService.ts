import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Bond from '../../infra/typeorm/entities/Bond';
import IBondsRepository from '../../repositories/IBondsRepository';
import bondValidator from '@modules/users/validators/bondValidators';

interface IRequest {
  name: string;
}

@injectable()
class CreateBondService {
  constructor(
    @inject('BondsRepository')
    private bondsRepository: IBondsRepository,
  ) {}

  public async execute({ name }: IRequest): Promise<Bond> {
    await bondValidator({ name });

    const checkBondExists = await this.bondsRepository.findByName(name);

    if (checkBondExists) {
      throw new AppError('Vínculo já existente', 400);
    }

    const bond = await this.bondsRepository.create({
      name,
    });

    return bond;
  }
}

export default CreateBondService;
