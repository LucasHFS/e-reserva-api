import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICoursesRepository from '../../repositories/ICoursesRepository';

@injectable()
class DeleteCourseService {
  constructor(
    @inject('CoursesRepository')
    private coursesRepository: ICoursesRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const course = await this.coursesRepository.findById(id);

    if (!course) {
      throw new AppError('Curso não encontrado', 404);
    }

    await this.coursesRepository.delete(course);
  }
}

export default DeleteCourseService;
