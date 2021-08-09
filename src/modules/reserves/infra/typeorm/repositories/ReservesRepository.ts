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

  public async getAllReserves(): Promise<IReservesResponse> {
    const equipmentsReserves = await this.equipmentRepository.find({
      relations: ['user', 'equipment'],
    });
    const roomsReserves = await this.roomRepository.find({
      relations: ['user', 'room'],
    });
    const sportCourtsReserves = await this.sportCourtRepository.find({
      relations: ['user', 'sport_court'],
    });
    return { equipmentsReserves, roomsReserves, sportCourtsReserves };
  }

  public async getPendingReserves(): Promise<IReservesResponse> {
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
    return { equipmentsReserves, roomsReserves, sportCourtsReserves };
  }
  
  public async getAllReservesByUser(
    user_id: string,
  ): Promise<IReservesResponse> {
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
    return { equipmentsReserves, roomsReserves, sportCourtsReserves };
  }

  public async acceptReserve(
    reserve_id: string,
  ): Promise<unknown> {
    const equipmentReserve = await this.equipmentRepository.findOne(reserve_id);
    
    if(equipmentReserve){

      equipmentReserve.status = 'accepted';
      return this.equipmentRepository.save(equipmentReserve);

    } else {
      const roomReserve = await this.equipmentRepository.findOne(reserve_id);
      
      if(roomReserve){
        roomReserve.status = 'accepted';
        return this.roomRepository.save(roomReserve);
      } else {
        const sportCourtReserve = await this.equipmentRepository.findOne(reserve_id);

        if(sportCourtReserve){
          sportCourtReserve.status = 'accepted';
          return this.sportCourtRepository.save(sportCourtReserve);
        } else {
          throw new AppError('reserve not found', 404);
        }
      }
    }
  }


  public async denyReserve(
    reserve_id: string,
  ): Promise<unknown> {
    const equipmentReserve = await this.equipmentRepository.findOne(reserve_id);
    
    if(equipmentReserve){

      equipmentReserve.status = 'denied';
      return this.equipmentRepository.save(equipmentReserve);

    } else {
      const roomReserve = await this.equipmentRepository.findOne(reserve_id);
      
      if(roomReserve){
        roomReserve.status = 'denied';
        return this.roomRepository.save(roomReserve);
      } else {
        const sportCourtReserve = await this.equipmentRepository.findOne(reserve_id);

        if(sportCourtReserve){
          sportCourtReserve.status = 'denied';
          return this.sportCourtRepository.save(sportCourtReserve);
        } else {
          throw new AppError('reserve not found', 404);
        }
      }
    }
  }
}

export default ReservesRepository;
