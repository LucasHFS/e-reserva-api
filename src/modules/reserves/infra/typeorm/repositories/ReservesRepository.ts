import { getRepository, Repository } from 'typeorm';
import IReservesRepository from '@modules/reserves/repositories/IReservesRepository';
import IReservesResponse from '@modules/reserves/dtos/IReservesResponse';
import EquipmentReserve from '../entities/EquipmentReserve';
import RoomReserve from '../entities/RoomReserve';
import SportCourtReserve from '../entities/SportCourtReserve';
import AppError from '@shared/errors/AppError';

class ReservesRepository implements IReservesRepository {
  private equipmentRepository: Repository<EquipmentReserve>;
  private roomRepository: Repository<RoomReserve>;
  private sportCourtRepository: Repository<SportCourtReserve>;

  constructor() {
    this.equipmentRepository = getRepository(EquipmentReserve);
    this.roomRepository = getRepository(RoomReserve);
    this.sportCourtRepository = getRepository(SportCourtReserve);
  }

  public async getAllReserves(): Promise<Array<any>> {
    const equipmentsReserves = await this.equipmentRepository.find({
      relations: ['user', 'equipment'],
    });
    const roomsReserves = await this.roomRepository.find({
      relations: ['user', 'room'],
    });
    const sportCourtsReserves = await this.sportCourtRepository.find({
      relations: ['user', 'sport_court'],
    });
    
    // @ts-ignore    
    const reserves = [].concat(equipmentsReserves, sportCourtsReserves, roomsReserves)
    // @ts-ignore    
    reserves.sort((a,b)=> new Date(b.starts_at) - new Date(a.starts_at));

    return reserves;
  }

  public async getPendingReserves(): Promise<Array<any>> {
    const equipmentsReserves = await this.equipmentRepository.find({
      relations: ['user', 'equipment'],
      where: {  status: 'pending'  }
    });
    const roomsReserves = await this.roomRepository.find({
      relations: ['user', 'room'],
      where: {  status: 'pending'  }
    });
    const sportCourtsReserves = await this.sportCourtRepository.find({
      relations: ['user', 'sport_court'],
      where: {  status: 'pending'  }
    });

    // @ts-ignore    
    const reserves = [].concat(equipmentsReserves, sportCourtsReserves, roomsReserves)
    // @ts-ignore    
    reserves.sort((a,b)=> new Date(b.starts_at) - new Date(a.starts_at));

    return reserves;  
  }

  public async countPendingReserves(): Promise<number> {
    const equipmentsReserves = await this.equipmentRepository.count({
      relations: ['user', 'equipment'],
      where: {  status: 'pending'  }
    });
    const roomsReserves = await this.roomRepository.count({
      relations: ['user', 'room'],
      where: {  status: 'pending'  }
    });
    const sportCourtsReserves = await this.sportCourtRepository.count({
      relations: ['user', 'sport_court'],
      where: {  status: 'pending'  }
    });
    return equipmentsReserves + roomsReserves + sportCourtsReserves;
  }
  
  public async getAllReservesByUser(
    user_id: string,
  ): Promise<Array<any>> {
    const equipmentsReserves = await this.equipmentRepository.find({
      where: { user_id },
      relations: ['user', 'equipment'],
    });
    const roomsReserves = await this.roomRepository.find({
      where: { user_id },
      relations: ['user', 'room'],
    });
    const sportCourtsReserves = await this.sportCourtRepository.find({
      where: { user_id },
      relations: ['user', 'sport_court'],
    });

    // @ts-ignore    
    const reserves = [].concat(equipmentsReserves, sportCourtsReserves, roomsReserves)
    // @ts-ignore    
    reserves.sort((a,b)=> new Date(b.starts_at) - new Date(a.starts_at));

    return reserves;  
  }

  public async acceptReserve(
    reserve_id: string,
  ): Promise<unknown> {
    try{
      const roomReserve = await this.roomRepository.findOne(reserve_id);
        
      if(roomReserve){
        roomReserve.status = 'accepted';
        return this.roomRepository.save(roomReserve);
      } else {
        throw new AppError('Não foi possível localizar reserva', 404)
      }

      }catch(e){
        throw new AppError('Erro ao localizar reserva', 400)
      }
    }


  public async denyReserve(
    {reserve_id, justification } : { reserve_id: string; justification: string}
  ): Promise<unknown> {
    try {
        const roomReserve = await this.roomRepository.findOne(reserve_id);
        
        if(roomReserve){
          roomReserve.status = 'denied';
          roomReserve.justification = justification;
          return this.roomRepository.save(roomReserve);
        } else {
          throw new AppError('Não foi possível localizar reserva', 404)
        }
    }catch(e){
      throw new AppError('Erro ao localizar reserva', 400)
    }
  }
}

export default ReservesRepository;
