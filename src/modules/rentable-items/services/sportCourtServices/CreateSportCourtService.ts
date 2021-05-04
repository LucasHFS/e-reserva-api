import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import SportCourt from '../../infra/typeorm/entities/SportCourt';
import ISportCourtsRepository from '../../repositories/ISportCourtsRepository';
import dataValidator from '../../validators/dataValidator';

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateSportCourtService {
  constructor(
    @inject('SportCourtsRepository')
    private sportCourtsRepository: ISportCourtsRepository,
  ) {}

  public async execute({ name, description }: IRequest): Promise<SportCourt> {
    await dataValidator({
      name,
      description,
    });

    const checkSportCourtExists = await this.sportCourtsRepository.findByName(
      name,
    );

    if (checkSportCourtExists) {
      throw new AppError('Quadra já existente', 400);
    }

    const sportCourt = await this.sportCourtsRepository.create({
      name,
      description,
    });

    return sportCourt;
  }
}

export default CreateSportCourtService;
