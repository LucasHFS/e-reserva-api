import { Request, Response } from 'express';
import { container } from 'tsyringe';

import DeleteCourseService from '@modules/users/services/courseServices/DeleteCourseService';
import CreateCourseService from '@modules/users/services/courseServices/CreateCourseService';
import UpdateCourseService from '@modules/users/services/courseServices/UpdateCourseService';
import CoursesRepository from '@modules/users/infra/typeorm/repositories/CoursesRepository';
import AppError from '@shared/errors/AppError';

export default class CoursesController {
  public async all(request: Request, response: Response): Promise<Response> {
    const coursesRepository = new CoursesRepository();
    const courses = await coursesRepository.find();
    return response.status(200).json(courses);
  }

  public async findOne(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    if (!id) {
      throw new AppError('campo id é obrigatório', 400);
    }

    const coursesRepository = new CoursesRepository();
    const course = await coursesRepository.findById(id);

    if (!course) {
      throw new AppError('Curso não encontrado', 404);
    }

    return response.status(200).json(course);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;

    const createCourse = container.resolve(CreateCourseService);

    const course = await createCourse.execute({
      name,
    });

    return response.status(201).json(course);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name } = request.body;

    if (!id) {
      throw new AppError('campo id é obrigatório', 404);
    }

    const updateCourse = container.resolve(UpdateCourseService);

    const course = await updateCourse.execute({
      id,
      name,
    });

    return response.status(200).json(course);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    if (!id) {
      throw new AppError('campo id é obrigatório', 404);
    }

    const deleteCourse = container.resolve(DeleteCourseService);

    await deleteCourse.execute(id);

    return response.status(204).send();
  }
}
