import Role from '../infra/typeorm/entities/Role';
import ICreateRoleDTO from '../dtos/ICreateRoleDTO';

export default interface IRolesRepository {
  find(): Promise<Role[]>;
  findById(id: string): Promise<Role | undefined>;
  findByName(name: string): Promise<Role | undefined>;
  create(data: ICreateRoleDTO): Promise<Role>;
  save(data: Role): Promise<Role>;
  delete(data: Role): Promise<void>;
}
