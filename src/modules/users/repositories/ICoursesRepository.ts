import Course from '../infra/typeorm/entities/Course';
import ICreateCourseDTO from '../dtos/ICreateCourseDTO';

export default interface ICoursesRepository {
  find(): Promise<Course[]>;
  findById(id: string): Promise<Course | undefined>;
  findByName(name: string): Promise<Course | undefined>;
  create(data: ICreateCourseDTO): Promise<Course>;
  save(data: Course): Promise<Course>;
  delete(data: Course): Promise<void>;
}
