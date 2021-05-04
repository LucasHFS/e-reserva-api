import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import SportCourt from '../../infra/typeorm/entities/SportCourt';
import ISportCourtsRepository from '../../repositories/ISportCourtsRepository';
import dataValidator from '../../validators/dataValidator';

interface IRequest {
  id: string;
  name: string;
  description: string;
}

@injectable()
class UpdateSportCourtService {
  constructor(
    @inject('SportCourtsRepository')
    private sportCourtsRepository: ISportCourtsRepository,
  ) {}

  public async execute({ id, name, description }: IRequest): Promise<SportCourt> {
    await dataValidator({
      name,
      description,
    });

    const thisSportCourt = await this.sportCourtsRepository.findById(id);

    if (!thisSportCourt) {
      throw new AppError('Papel não encontrado', 404);
    }

    if (thisSportCourt.name !== name) {
      const checkSportCourtExistsByMail = await this.sportCourtsRepository.findByName(name);
      if (checkSportCourtExistsByMail) {
        throw new AppError('Email já utilizado', 400);
      }
    }

    thisSportCourt.name = name;
    thisSportCourt.description = description;

    const sportCourt = await this.sportCourtsRepository.save(thisSportCourt);

    return sportCourt;
  }
}

export default UpdateSportCourtService;
