import { EntityRepository, getRepository, Repository } from 'typeorm';

import ICoursesRepository from '@modules/users/repositories/ICoursesRepository';

import ICreateCourseDTO from '@modules/users/dtos/ICreateCourseDTO';

import Course from '../entities/Course';

@EntityRepository(Course)
class CoursesRepository implements ICoursesRepository {
  private ormRepository: Repository<Course>;

  constructor() {
    this.ormRepository = getRepository(Course);
  }

  public async first(): Promise<Course | undefined> {
    return this.ormRepository.findOne();
  }

  public async find(): Promise<Course[]> {
    return this.ormRepository.find();
  }

  public async findById(id: string): Promise<Course | undefined> {
    const course = await this.ormRepository.findOne(id);

    return course;
  }

  public async findByName(name: string): Promise<Course | undefined> {
    const role = await this.ormRepository.findOne({ where: { name } });

    return role;
  }

  public async create({ name }: ICreateCourseDTO): Promise<Course> {
    const course = this.ormRepository.create({
      name,
    });

    await this.ormRepository.save(course);

    return course;
  }

  public async save(course: Course): Promise<Course> {
    return this.ormRepository.save(course);
  }

  public async delete(course: Course): Promise<void> {
    await this.ormRepository.remove(course);
  }
}

export default CoursesRepository;
