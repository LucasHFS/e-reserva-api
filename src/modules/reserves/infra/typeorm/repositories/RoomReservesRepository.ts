import { getRepository, Repository, Raw } from 'typeorm';
import ICreateRoomReserveDTO from '@modules/reserves/dtos/ICreateRoomReserveDTO';
import IRoomReservesRepository from '@modules/reserves/repositories/IRoomReservesRepository';
import IFindAllInDayFromUserDTO from '@modules/reserves/dtos/IFindAllInDayFromUserDTO';
import RoomReserve from '../entities/RoomReserve';
import IFindAllRoomInDayDTO from '@modules/reserves/dtos/IFindAllRoomInDayDTO';

class RoomReserveRepository implements IRoomReservesRepository {
  private ormRepository: Repository<RoomReserve>;

  constructor() {
    this.ormRepository = getRepository(RoomReserve);
  }

  public async findAllInDayFromUser({
    user_id,
    day,
    month,
    year,
  }: IFindAllInDayFromUserDTO): Promise<RoomReserve[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const reserves = await this.ormRepository.find({
      where: {
        user_id,
        starts_at: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
    });

    return reserves;
  }


  public async findAllInDay({
    day,
    month,
    year,
    room_id,
  }: IFindAllRoomInDayDTO ) : Promise<RoomReserve[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const reserves = await this.ormRepository.find({
      where: {
        starts_at: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
        room_id,
      },
    });

    return reserves;
  }


  public async findByDate(
    starts_at: Date,
    room_id: string,
  ): Promise<RoomReserve | undefined> {
    const findReserve = await this.ormRepository.findOne({
      where: { starts_at, room_id },
    });

    return findReserve;
  }

  public async create({
    room_id,
    user_id,
    status,
    starts_at,
    ends_at,
  }: ICreateRoomReserveDTO): Promise<RoomReserve> {
    const reserve = this.ormRepository.create({
      room_id,
      user_id,
      status,
      starts_at,
      ends_at,
    });

    await this.ormRepository.save(reserve);

    return reserve;
  }
}

export default RoomReserveRepository;
