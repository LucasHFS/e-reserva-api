import Bond from '../infra/typeorm/entities/Bond';
import Role from '../infra/typeorm/entities/Role';
import Course from '../infra/typeorm/entities/Course';

export default interface ICreateUserDTO {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  password: string;
  role: Role;
  bond: Bond;
  courses: Course[];
}
