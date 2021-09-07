import { startOfMinute, isBefore, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import SportCourtReserve from '../../infra/typeorm/entities/SportCourtReserve';
import ISportCourtReservesRepository from '../../repositories/ISportCourtReservesRepository';
import SportCourtsRepository from '@modules/rentable-items/infra/typeorm/repositories/SportCourtsRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import { getCustomRepository } from 'typeorm';
import MessagesRepository from '@modules/users/infra/typeorm/repositories/MessagesRepository';

interface IRequest {
  sport_court_id: string;
  user_id: string;
  starts_at: Date;
}

@injectable()
class CreateSportCourtReserveService {
  constructor(
    @inject('SportCourtReservesRepository')
    private SportCourtReservesRepository: ISportCourtReservesRepository,
  ) {}

  public async execute({
    sport_court_id,
    user_id,
    starts_at,
  }: IRequest): Promise<SportCourtReserve> {

    const sportCourtsRepository = new SportCourtsRepository();
    const usersRepository = new UsersRepository();

    const sportCourt = await sportCourtsRepository.findById(sport_court_id);
    if(!sportCourt){
      throw new AppError('equipamento não encontrada', 404)
    }

    const user = await usersRepository.findById(user_id);
    if(!user){
      throw new AppError('user não encontrado', 404)
    }
   

    const startReserveDate = startOfMinute(starts_at);
    startReserveDate.setSeconds(0);
    startReserveDate.setMilliseconds(0);

    // validation with hours
    // const startHour = getHours(startReserveDate);

    if (
      isBefore(startReserveDate, Date.now())
    ) {
      throw new AppError('Não pode realizar uma reserva para um momento do passado');
    }

    // todo: improve this validation
    const findReserveInSameDate = await this.SportCourtReservesRepository.findByDate(
      startReserveDate,
      sport_court_id,
    );

    if (findReserveInSameDate) {
      throw new AppError('Esse horário já foi reservado');
    }

    const reserve = await this.SportCourtReservesRepository.create({
      sport_court_id,
      user_id,
      starts_at: startReserveDate,
    });

    const messagesRepository = getCustomRepository(MessagesRepository);
    await messagesRepository.create({
      to: 'admin',
      body: `${user.name} reservou a quadra ${sportCourt.name} para data ${format(starts_at, 'd/M/yyyy')} as ${ format(starts_at, 'H:m') } hrs.`
    });

    return reserve;
  }
}

export default CreateSportCourtReserveService;
