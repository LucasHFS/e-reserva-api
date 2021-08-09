import { injectable, inject } from 'tsyringe';
import { getHours, getMinutes, isAfter } from 'date-fns';
import IEquipmentReservesRepository from '../../repositories/IEquipmentReservesRepository';
import { startHourArray } from  '@shared/constants/hourArrays';


interface IRequest {
  user_id: string;
  month: number;
  year: number;
  day: number;
  equipment_id: string;
}

type IResponse = Array<{
  hour: number;
  minute: number;
  available: boolean;
}>;

@injectable()
class ListEquipmentDayAvailabilityService {
  constructor(
    @inject('EquipmentReservesRepository')
    private EquipmentReservesRepository: IEquipmentReservesRepository,
  ) {}

  public async execute({
    day,
    month,
    year,
    equipment_id,
  }: IRequest): Promise<IResponse> {
    
    const reserves = await this.EquipmentReservesRepository.findAllInDay(
      {
        day,
        month,
        year,
        equipment_id,
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

export default ListEquipmentDayAvailabilityService;
