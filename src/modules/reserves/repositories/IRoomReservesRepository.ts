import RoomReserve from '../infra/typeorm/entities/RoomReserve';
import ICreateRoomReserveDTO from '../dtos/ICreateRoomReserveDTO';
import IFindAllInDayFromUserDTO from '../dtos/IFindAllInDayFromUserDTO';
import IFindAllRoomInDayDTO from '../dtos/IFindAllRoomInDayDTO';

export default interface IRoomReservesRepository {
  create(data: ICreateRoomReserveDTO): Promise<RoomReserve>;
  findByDate(date: Date, room_id: string): Promise<RoomReserve | undefined>;
  findAllInDayFromUser(
    data: IFindAllInDayFromUserDTO,
  ): Promise<RoomReserve[]>;
  findAllInDay(
    data: IFindAllRoomInDayDTO,
  ): Promise<RoomReserve[]>;
}
