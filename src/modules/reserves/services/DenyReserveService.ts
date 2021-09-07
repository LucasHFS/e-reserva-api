import MessagesRepository from '@modules/users/infra/typeorm/repositories/MessagesRepository';
import AppError from '@shared/errors/AppError';
import { format } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import { getCustomRepository } from 'typeorm';
import RoomReserveRepository from '../infra/typeorm/repositories/RoomReservesRepository';
import IReservesRepository from '../repositories/IReservesRepository';

interface IRequest {
  reserve_id: string;
  justification: string;
}

@injectable()
class DenyReserveService {
  constructor(
    @inject('ReservesRepository')
    private ReservesRepository: IReservesRepository,
  ) {}

  public async execute({ reserve_id, justification }: IRequest): Promise<any> {
    const reserve = await this.ReservesRepository.denyReserve({
      reserve_id,
      justification,
    });

    const messagesRepository = getCustomRepository(MessagesRepository);

    if(reserve.room_id){
      const reservesRepository = getCustomRepository(RoomReserveRepository)

      const reserve = await reservesRepository.findOne(reserve_id);
        
      await messagesRepository.create({
        to: 'user',
        userId: reserve!.user.id,
        body: `O Administrador negou sua reserva da sala ${reserve!.room.name} para data ${format(reserve!.starts_at, 'd/M/yyyy')} as ${ format(reserve!.starts_at, 'H:m') } hrs. Pois ${reserve!.justification}`
      });
    }

    return reserve;
  }
}

export default DenyReserveService;
