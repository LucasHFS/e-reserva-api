import MessagesRepository from '@modules/users/infra/typeorm/repositories/MessagesRepository';
import { format } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import { getCustomRepository } from 'typeorm';
import EquipmentReserveRepository from '../infra/typeorm/repositories/EquipmentReservesRepository';
import RoomReserveRepository from '../infra/typeorm/repositories/RoomReservesRepository';
import SportCourtReserveRepository from '../infra/typeorm/repositories/SportCourtReservesRepository';
import IReservesRepository from '../repositories/IReservesRepository';

interface IRequest {
  reserve_id: string;
}

@injectable()
class AcceptReserveService {
  constructor(
    @inject('ReservesRepository')
    private ReservesRepository: IReservesRepository,
  ) {}

  public async execute({ reserve_id }: IRequest): Promise<any> {

    const reserve = await this.ReservesRepository.acceptReserve(
      reserve_id,
    );

    const messagesRepository = getCustomRepository(MessagesRepository);

    if(reserve.room_id){
      const reservesRepository = getCustomRepository(RoomReserveRepository)

      const reserve = await reservesRepository.findOne(reserve_id);
        
      await messagesRepository.create({
        to: 'user',
        userId: reserve!.user.id,
        body: `O Administrador aprovou sua reserva da sala ${reserve!.room.name} para data ${format(reserve!.starts_at, 'd/M/yyyy')} as ${ format(reserve!.starts_at, 'H:m') } hrs.`
      });
    }

    return reserve;
  }
}

export default AcceptReserveService;
