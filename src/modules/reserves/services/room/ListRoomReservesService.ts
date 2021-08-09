import { injectable, inject } from 'tsyringe';
import Reserve from '@modules/reserves/infra/typeorm/entities/RoomReserve';
import IRoomReservesRepository from '../../repositories/IRoomReservesRepository';

interface IRequest {
  user_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListRoomReservesService {
  constructor(
    @inject('RoomReservesRepository')
    private roomReservesRepository: IRoomReservesRepository,
  ) {}

  public async execute({
    user_id,
    day,
    month,
    year,
  }: IRequest): Promise<Reserve[]> {
    const reserves = await this.roomReservesRepository.findAllInDayFromUser(
      {
        user_id,
        day,
        month,
        year,
      },
    );

    return reserves;
  }
}

export default ListRoomReservesService;
