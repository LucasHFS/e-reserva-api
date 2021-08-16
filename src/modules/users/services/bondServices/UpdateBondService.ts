import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Bond from '../../infra/typeorm/entities/Bond';
import IBondsRepository from '../../repositories/IBondsRepository';
import bondValidator from '@modules/users/validators/bondValidators';

interface IRequest {
  id: string;
  name: string;
}

@injectable()
class UpdateBondService {
  constructor(
    @inject('BondsRepository')
    private bondsRepository: IBondsRepository,
  ) {}

  public async execute({ id, name }: IRequest): Promise<Bond> {
    await bondValidator({ name });
    const thisBond = await this.bondsRepository.findById(id);

    if (!thisBond) {
      throw new AppError('Vínculo não encontrado', 404);
    }

    if (thisBond.name !== name) {
      const checkBondExistsByMail = await this.bondsRepository.findByName(name);
      if (checkBondExistsByMail) {
        throw new AppError('Email já utilizado', 400);
      }
    }

    thisBond.name = name;

    const bond = await this.bondsRepository.save(thisBond);

    return bond;
  }
}

export default UpdateBondService;
