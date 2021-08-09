import { injectable, inject } from 'tsyringe';
import Reserve from '@modules/reserves/infra/typeorm/entities/SportCourtReserve';
import ISportCourtReservesRepository from '../../repositories/ISportCourtReservesRepository';

interface IRequest {
  user_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListSportCourtReservesService {
  constructor(
    @inject('SportCourtReservesRepository')
    private roomReservesRepository: ISportCourtReservesRepository,
  ) {}

  public async execute({
    user_id,
    day,
    month,
    year,
  }: IRequest): Promise<Reserve[]> {
    const reserves = await this.roomReservesRepository.findAllInDayFromUser(
      {
        user_id,
        day,
        month,
        year,
      },
    );

    return reserves;
  }
}

export default ListSportCourtReservesService;
