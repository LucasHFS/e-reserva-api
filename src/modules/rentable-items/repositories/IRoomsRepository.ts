import Role from '../infra/typeorm/entities/Role';
import RoleDTO from '../dtos/RoleDTO';

export default interface RolesRepository {
  find(): Promise<Role[]>;
  findById(id: string): Promise<Role | undefined>;
  findByName(name: string): Promise<Role | undefined>;
  create(data: RoleDTO): Promise<Role>;
  save(data: Role): Promise<Role>;
  delete(data: Role): Promise<void>;
}
