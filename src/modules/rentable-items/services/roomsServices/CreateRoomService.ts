import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Room from '../../infra/typeorm/entities/Room';
import IRoomsRepository from '../../repositories/IRoomsRepository';
import roomValidator from '../../validators/roomValidator';

interface IRequest {
  name: string;
  description: string;
  type: string;
}

@injectable()
class CreateRoomService {
  constructor(
    @inject('RoomsRepository')
    private roomsRepository: IRoomsRepository,
  ) {}

  public async execute({ name, description, type }: IRequest): Promise<Room> {
    await roomValidator({
      name,
      description,
      type,
    });
    const checkRoomExists = await this.roomsRepository.findByName(name);

    if (checkRoomExists) {
      throw new AppError('Sala já existente', 400);
    }

    const room = await this.roomsRepository.create({
      name,
      description,
      type,
    });

    return room;
  }
}

export default CreateRoomService;
