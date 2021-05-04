import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Room from '../../infra/typeorm/entities/Room';
import IRoomsRepository from '../../repositories/IRoomsRepository';
import dataValidator from '../../validators/dataValidator';

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateRoomService {
  constructor(
    @inject('RoomsRepository')
    private roomsRepository: IRoomsRepository,
  ) {}

  public async execute({ name, description }: IRequest): Promise<Room> {
    await dataValidator({
      name,
      description,
    });
    const checkRoomExists = await this.roomsRepository.findByName(name);

    if (checkRoomExists) {
      throw new AppError('Sala já existente', 400);
    }

    const room = await this.roomsRepository.create({
      name,
      description,
    });

    return room;
  }
}

export default CreateRoomService;
