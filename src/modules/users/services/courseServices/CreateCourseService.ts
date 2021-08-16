import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Course from '../../infra/typeorm/entities/Course';
import ICoursesRepository from '../../repositories/ICoursesRepository';
import courseValidator from '@modules/users/validators/courseValidators';

interface IRequest {
  name: string;
}

@injectable()
class CreateCourseService {
  constructor(
    @inject('CoursesRepository')
    private coursesRepository: ICoursesRepository,
  ) {}

  public async execute({ name }: IRequest): Promise<Course> {
    const checkCourseExists = await this.coursesRepository.findByName(name);

    await courseValidator({name});

    if (checkCourseExists) {
      throw new AppError('Curso já existente', 400);
    }

    const course = await this.coursesRepository.create({
      name,
    });

    return course;
  }
}

export default CreateCourseService;
