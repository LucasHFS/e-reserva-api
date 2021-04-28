import { uuid } from 'uuidv4';

import ICoursesRepository from '@modules/users/repositories/ICoursesRepository';

import ICreateCourseDTO from '@modules/users/dtos/ICreateCourseDTO';

import Course from '../../infra/typeorm/entities/Course';

class FakeCoursesRepository implements ICoursesRepository {
  private courses: Course[] = [];

  public async findById(id: string): Promise<Course | undefined> {
    const findCourse = this.courses.find(course => course.id === id);

    return findCourse;
  }

  public async create({ name }: ICreateCourseDTO): Promise<Course> {
    const course = new Course();

    Object.assign(course, { id: uuid(), name });

    this.courses.push(course);

    return course;
  }

  public async save(course: Course): Promise<Course> {
    const findIndex = this.courses.findIndex(
      findCourse => findCourse.id === course.id,
    );

    this.courses[findIndex] = course;

    return course;
  }
}

export default FakeCoursesRepository;
