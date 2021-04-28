import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Course from '../../infra/typeorm/entities/Course';
import ICoursesRepository from '../../repositories/ICoursesRepository';

interface IRequest {
  id: string;
  name: string;
}

@injectable()
class UpdateCourseService {
  constructor(
    @inject('CoursesRepository')
    private coursesRepository: ICoursesRepository,
  ) {}

  public async execute({ id, name }: IRequest): Promise<Course> {
    const thisCourse = await this.coursesRepository.findById(id);

    if (!thisCourse) {
      throw new AppError('Curso não encontrado', 404);
    }

    if (thisCourse.name !== name) {
      const checkCourseExistsByMail = await this.coursesRepository.findByName(
        name,
      );
      if (checkCourseExistsByMail) {
        throw new AppError('Email já utilizado', 400);
      }
    }

    thisCourse.name = name;

    const course = await this.coursesRepository.save(thisCourse);

    return course;
  }
}

export default UpdateCourseService;
