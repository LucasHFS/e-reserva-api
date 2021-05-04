import Equipment from '../infra/typeorm/entities/Equipment';
import ICreateEquipmentDTO from '../dtos/ICreateEquipmentDTO';

export default interface IEquipmentsRepository {
  find(): Promise<Equipment[]>;
  findById(id: string): Promise<Equipment | undefined>;
  findByName(name: string): Promise<Equipment | undefined>;
  create(data: ICreateEquipmentDTO): Promise<Equipment>;
  save(data: Equipment): Promise<Equipment>;
  delete(data: Equipment): Promise<void>;
}
