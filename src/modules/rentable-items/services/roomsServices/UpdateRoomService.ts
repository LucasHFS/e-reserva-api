import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Room from '../../infra/typeorm/entities/Room';
import IRoomsRepository from '../../repositories/IRoomsRepository';
import dataValidator from '../../validators/dataValidator';

interface IRequest {
  id: string;
  name: string;
  description: string;
}

@injectable()
class UpdateRoomService {
  constructor(
    @inject('RoomsRepository')
    private roomsRepository: IRoomsRepository,
  ) {}

  public async execute({ id, name, description }: IRequest): Promise<Room> {
    await dataValidator({
      name,
      description,
    });
    const thisRoom = await this.roomsRepository.findById(id);

    if (!thisRoom) {
      throw new AppError('Papel não encontrado', 404);
    }

    if (thisRoom.name !== name) {
      const checkRoomExistsByMail = await this.roomsRepository.findByName(name);
      if (checkRoomExistsByMail) {
        throw new AppError('Email já utilizado', 400);
      }
    }

    thisRoom.name = name;
    thisRoom.description = description;

    const room = await this.roomsRepository.save(thisRoom);

    return room;
  }
}

export default UpdateRoomService;
