import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Room from '../../infra/typeorm/entities/Room';
import IRoomsRepository from '../../repositories/IRoomsRepository';
import roomValidator from '../../validators/roomValidator';

interface IRequest {
  id: string;
  name: string;
  description: string;
  type: string;
}

@injectable()
class UpdateRoomService {
  constructor(
    @inject('RoomsRepository')
    private roomsRepository: IRoomsRepository,
  ) {}

  public async execute({
    id,
    name,
    description,
    type,
  }: IRequest): Promise<Room> {
    await roomValidator({
      name,
      type,
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
    thisRoom.type = type;
    const room = await this.roomsRepository.save(thisRoom);

    return room;
  }
}

export default UpdateRoomService;
