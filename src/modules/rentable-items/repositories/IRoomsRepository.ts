import Room from '../infra/typeorm/entities/Room';
import CreateRoomDTO from '../dtos/ICreateRoomDTO';

export default interface IRoomsRepository {
  find(): Promise<Room[]>;
  findById(id: string): Promise<Room | undefined>;
  findByName(name: string): Promise<Room | undefined>;
  create(data: CreateRoomDTO): Promise<Room>;
  save(data: Room): Promise<Room>;
  delete(data: Room): Promise<void>;
}
