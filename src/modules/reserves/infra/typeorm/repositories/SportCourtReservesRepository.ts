import { getRepository, Repository, Raw, EntityRepository } from 'typeorm';
import ICreateSportCourtReserveDTO from '@modules/reserves/dtos/ICreateSportCourtReserveDTO';
import ISportCourtReservesRepository from '@modules/reserves/repositories/ISportCourtReservesRepository';
import IFindAllInDayFromUserDTO from '@modules/reserves/dtos/IFindAllInDayFromUserDTO';
import IFindAllSportCourtInDayDTO from '@modules/reserves/dtos/IFindAllSportCourtInDayDTO';
import SportCourtReserve from '../entities/SportCourtReserve';


@EntityRepository(SportCourtReserve)
class SportCourtReserveRepository implements ISportCourtReservesRepository {
  private ormRepository: Repository<SportCourtReserve>;

  constructor() {
    this.ormRepository = getRepository(SportCourtReserve);
  }

  public async findOne(reserve_id: string): Promise<SportCourtReserve | undefined> {
    const reserve = await this.ormRepository.findOne(reserve_id, {
      relations: ['user', 'sport_court']
    });

    return reserve;
  }

  public async findAllInDayFromUser({
    user_id,
    day,
    month,
    year,
  }: IFindAllInDayFromUserDTO): Promise<SportCourtReserve[]> {
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
    sport_court_id,
  }: IFindAllSportCourtInDayDTO): Promise<SportCourtReserve[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const reserves = await this.ormRepository.find({
      where: {
        starts_at: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
        sport_court_id,
      },
    });

    return reserves;
  }

  public async findByDate(
    starts_at: Date,
    sport_court_id: string
  ): Promise<SportCourtReserve | undefined> {
    const findReserve = await this.ormRepository.findOne({
      where: { starts_at, sport_court_id },
    });

    return findReserve;
  }

  public async create({
    sport_court_id,
    user_id,
    starts_at,
  }: ICreateSportCourtReserveDTO): Promise<SportCourtReserve> {
    const reserve = this.ormRepository.create({
      sport_court_id,
      user_id,
      status: 'accepted',
      starts_at,
    });

    await this.ormRepository.save(reserve);

    return reserve;
  }
}

export default SportCourtReserveRepository;
