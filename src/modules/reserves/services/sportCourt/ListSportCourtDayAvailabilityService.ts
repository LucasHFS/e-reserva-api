import { injectable, inject } from 'tsyringe';
import { getHours, getMinutes, isAfter } from 'date-fns';
import ISportCourtReservesRepository from '../../repositories/ISportCourtReservesRepository';
import { startHourArray } from  '@shared/constants/hourArrays';


interface IRequest {
  sport_court_id: string;
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
class ListSportCourtDayAvailabilityService {
  constructor(
    @inject('SportCourtReservesRepository')
    private SportCourtReservesRepository: ISportCourtReservesRepository,
  ) {}

  public async execute({
    sport_court_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    
    const reserves = await this.SportCourtReservesRepository.findAllInDay(
      {
        sport_court_id,
        day,
        month,
        year,
      },
    );

    const currentDate = new Date(Date.now());

    const availability = startHourArray.map(hour_minutes => {
      const hasReserveInHour = reserves.find(
        reserve => getHours(reserve.starts_at) === hour_minutes.hour && getMinutes(reserve.starts_at) === hour_minutes.minute
      );

      const compareDate = new Date(year, month - 1, day, hour_minutes.hour, hour_minutes.minute);

      return {
        hour: hour_minutes.hour,
        minute: hour_minutes.minute,
        available: !hasReserveInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListSportCourtDayAvailabilityService;
