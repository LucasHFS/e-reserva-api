import SportCourt from '../infra/typeorm/entities/SportCourt';
import ICreateSportCourtDTO from '../dtos/ICreateSportCourtDTO';

export default interface ISportCourtsRepository {
  find(): Promise<SportCourt[]>;
  findById(id: string): Promise<SportCourt | undefined>;
  findByName(name: string): Promise<SportCourt | undefined>;
  create(data: ICreateSportCourtDTO): Promise<SportCourt>;
  save(data: SportCourt): Promise<SportCourt>;
  delete(data: SportCourt): Promise<void>;
}
