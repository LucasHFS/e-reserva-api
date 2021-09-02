import { startOfMinute, isBefore } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import RoomReserve from '../../infra/typeorm/entities/RoomReserve';
import IRoomReservesRepository from '../../repositories/IRoomReservesRepository';
import RoomsRepository from '@modules/rentable-items/infra/typeorm/repositories/RoomsRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

interface IRequest {
  room_id: string;
  user_id: string;
  starts_at: Date;
}

@injectable()
class CreateRoomReserveService {
  constructor(
    @inject('RoomReservesRepository')
    private RoomReservesRepository: IRoomReservesRepository,
  ) {}

  public async execute({
    room_id,
    user_id,
    starts_at,
  }: IRequest): Promise<RoomReserve> {
    const roomsRepository = new RoomsRepository();
    const usersRepository = new UsersRepository();

    const startReserveDate = startOfMinute(starts_at);

    const room = await roomsRepository.findById(room_id);
    if(!room){
      throw new AppError('sala não encontrada', 404)
    }

    const user = await usersRepository.findById(user_id);
    if(!user){
      throw new AppError('user não encontrado', 404)
    }

    // validation with hours
    // const startHour = getHours(startReserveDate);

    if (
      isBefore(startReserveDate, Date.now())
    ) {
      throw new AppError('Não pode realizar uma reserva para um momento do passado');
    }

    // todo: improve this validation
    const findReserveInSameDate = await this.RoomReservesRepository.findByDate(
      startReserveDate,
      room_id,
    );

    if (findReserveInSameDate) {
      throw new AppError('Esse horário já foi reservado');
    }

    const status = room.type === 'auditorium' || room.type === 'lab' ? 'pending' : 'accepted'

    const reserve = await this.RoomReservesRepository.create({
      room_id,
      user_id,
      status,
      starts_at: startReserveDate,
    });

    return reserve;
  }
}

export default CreateRoomReserveService;
