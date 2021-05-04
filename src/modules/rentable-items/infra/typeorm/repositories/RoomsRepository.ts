import { EntityRepository, getRepository, Repository } from 'typeorm';

import IRoomsRepository from '@modules/rentable-items/repositories/IRoomsRepository';

import ICreateRoomDTO from '@modules/rentable-items/dtos/ICreateRoomDTO';

import Room from '../entities/Room';

@EntityRepository(Room)
class RoomsRepository implements IRoomsRepository {
  private ormRepository: Repository<Room>;

  constructor() {
    this.ormRepository = getRepository(Room);
  }

  public async first(): Promise<Room | undefined> {
    return this.ormRepository.findOne();
  }

  public async find(): Promise<Room[]> {
    return this.ormRepository.find();
  }

  public async findById(id: string): Promise<Room | undefined> {
    const room = await this.ormRepository.findOne(id);

    return room;
  }

  public async findByName(name: string): Promise<Room | undefined> {
    const room = await this.ormRepository.findOne({ where: { name } });

    return room;
  }

  public async create({ name, description }: ICreateRoomDTO): Promise<Room> {
    const room = this.ormRepository.create({
      name,
      description,
    });

    await this.ormRepository.save(room);

    return room;
  }

  public async save(room: Room): Promise<Room> {
    return this.ormRepository.save(room);
  }

  public async delete(room: Room): Promise<void> {
    await this.ormRepository.remove(room);
  }
}

export default RoomsRepository;
