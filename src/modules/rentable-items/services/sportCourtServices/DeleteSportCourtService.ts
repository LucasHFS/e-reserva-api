import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ISportCourtsRepository from '../../repositories/ISportCourtsRepository';

@injectable()
class DeleteSportCourtService {
  constructor(
    @inject('SportCourtsRepository')
    private sportCourtsRepository: ISportCourtsRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const sportCourt = await this.sportCourtsRepository.findById(id);

    if (!sportCourt) {
      throw new AppError('Papel não encontrado', 404);
    }

    await this.sportCourtsRepository.delete(sportCourt);
  }
}

export default DeleteSportCourtService;
