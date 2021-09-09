import { injectable, inject } from 'tsyringe';
import { getHours, getMinutes, isAfter, isEqual, startOfDay } from 'date-fns';
import IRoomReservesRepository from '../../repositories/IRoomReservesRepository';
import { startHourArray } from  '@shared/constants/hourArrays';


interface IRequest {
  room_id: string;
  month: number;
  year: number;
  day: number;
}

type IResponse = Array<{
  hour: number;
  minute: number;
  available: boolean;
}>;

@injectable()
class ListRoomDayAvailabilityService {
  constructor(
    @inject('RoomReservesRepository')
    private RoomReservesRepository: IRoomReservesRepository,
  ) {}

  public async execute({
    room_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    
    const reserves = await this.RoomReservesRepository.findAllInDay(
      {
        room_id,
        day,
        month: month + 1,
        year,
      },
    );

    const currentDate = new Date();

    const availability = startHourArray.map(hour_minutes => {

      const hasReserveInHour = reserves.find(
        reserve => getHours(reserve.starts_at) === hour_minutes.hour && getMinutes(reserve.starts_at) === hour_minutes.minute
      );

      const compareDate = new Date(year, month, day, hour_minutes.hour, hour_minutes.minute);

      return {
        hour: hour_minutes.hour,
        minute: hour_minutes.minute,
        available: !hasReserveInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListRoomDayAvailabilityService;
