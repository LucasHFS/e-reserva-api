import AppError from '@shared/errors/AppError';
import { differenceInDays } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import { getCustomRepository, getRepository } from 'typeorm';
import EquipmentReserve from '../infra/typeorm/entities/EquipmentReserve';
import RoomReserve from '../infra/typeorm/entities/RoomReserve';
import SportCourtReserve from '../infra/typeorm/entities/SportCourtReserve';
import RoomReserveRepository from '../infra/typeorm/repositories/RoomReservesRepository';
import IReservesRepository from '../repositories/IReservesRepository';

interface IRequest {
  reserve_id: string;
}

@injectable()
class DeleteReserveService {
  public async execute({ reserve_id }: IRequest): Promise<void> {
    // find reserve
    const roomReserveRepository = getRepository(RoomReserve);
    const roomReserve = await roomReserveRepository.findOne(reserve_id)

    const today = new Date();

    if(roomReserve){
      console.log(differenceInDays(roomReserve.starts_at, today))
      if(differenceInDays(roomReserve.starts_at, today) <= 3){
        throw new AppError('Só é possível cancelar 3 dias antes da data', 400)
      }

      await roomReserveRepository.remove(roomReserve)
      return
    }

    const equipmentReserveRepository = getRepository(EquipmentReserve);
    const equipmentReserve = await equipmentReserveRepository.findOne(reserve_id)

    if(equipmentReserve){
      if(differenceInDays(equipmentReserve.starts_at, today) <= 3){
        throw new AppError('Só é possível cancelar 3 dias antes da data', 400)
      }
      await equipmentReserveRepository.remove(equipmentReserve)
      return
    }

    const sportCourtReserveRepository = getRepository(SportCourtReserve);
    const sportCourtReserve = await sportCourtReserveRepository.findOne(reserve_id)

    if(sportCourtReserve){
      if(differenceInDays(sportCourtReserve.starts_at, today) <= 3){
        throw new AppError('Só é possível cancelar 3 dias antes da data', 400)
      }

      await sportCourtReserveRepository.remove(sportCourtReserve)
      return
    }

    throw new AppError('Reserva não encontrada', 404);
  }
}

export default DeleteReserveService;
