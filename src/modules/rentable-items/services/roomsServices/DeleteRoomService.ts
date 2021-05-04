import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IRoomsRepository from '../../repositories/IRoomsRepository';

@injectable()
class DeleteRoomService {
  constructor(
    @inject('RoomsRepository')
    private roomsRepository: IRoomsRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const room = await this.roomsRepository.findById(id);

    if (!room) {
      throw new AppError('Papel não encontrado', 404);
    }

    await this.roomsRepository.delete(room);
  }
}

export default DeleteRoomService;
