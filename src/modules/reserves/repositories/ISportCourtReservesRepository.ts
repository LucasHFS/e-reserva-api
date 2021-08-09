import SportCourtReserve from '../infra/typeorm/entities/SportCourtReserve';
import ICreateSportCourtReserveDTO from '../dtos/ICreateSportCourtReserveDTO';
import IFindAllInDayFromUserDTO from '../dtos/IFindAllInDayFromUserDTO';
import IFindAllSportCourtInDayDTO from '../dtos/IFindAllSportCourtInDayDTO';

export default interface ISportCourtReservesRepository {
  create(data: ICreateSportCourtReserveDTO): Promise<SportCourtReserve>;
  findByDate(date: Date, sport_court_id: string): Promise<SportCourtReserve | undefined>;
  findAllInDayFromUser(
    data: IFindAllInDayFromUserDTO,
  ): Promise<SportCourtReserve[]>;
  findAllInDay(
    data: IFindAllSportCourtInDayDTO,
  ): Promise<SportCourtReserve[]>;
}
