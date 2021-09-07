import EquipmentReserve from '../infra/typeorm/entities/EquipmentReserve';
import ICreateEquipmentReserveDTO from '../dtos/ICreateEquipmentReserveDTO';
import IFindAllInDayFromUserDTO from '../dtos/IFindAllInDayFromUserDTO';
import IFindAllEquipmentInDayDTO from '../dtos/IFindAllEquipmentInDayDTO';

export default interface IEquipmentReservesRepository {
  findOne(reserve_id: string): Promise<EquipmentReserve | undefined>
  create(data: ICreateEquipmentReserveDTO): Promise<EquipmentReserve>;
  findByDate(date: Date, equipment_id: string): Promise<EquipmentReserve | undefined>;
  findAllInDayFromUser(
    data: IFindAllInDayFromUserDTO,
  ): Promise<EquipmentReserve[]>;
  findAllInDay(
    data: IFindAllEquipmentInDayDTO,
  ): Promise<EquipmentReserve[]>;
}
