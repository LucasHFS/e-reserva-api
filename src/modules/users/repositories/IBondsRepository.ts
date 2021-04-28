import Bond from '../infra/typeorm/entities/Bond';
import ICreateBondDTO from '../dtos/ICreateBondDTO';

export default interface IBondsRepository {
  find(): Promise<Bond[]>;
  findById(id: string): Promise<Bond | undefined>;
  findByName(name: string): Promise<Bond | undefined>;
  create(data: ICreateBondDTO): Promise<Bond>;
  save(data: Bond): Promise<Bond>;
  delete(data: Bond): Promise<void>;
}
