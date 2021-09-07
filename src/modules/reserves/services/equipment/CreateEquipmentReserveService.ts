import { startOfMinute, isBefore, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import EquipmentReserve from '../../infra/typeorm/entities/EquipmentReserve';
import IEquipmentReservesRepository from '../../repositories/IEquipmentReservesRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import EquipmentsRepository from '@modules/rentable-items/infra/typeorm/repositories/EquipmentsRepository';
import { getCustomRepository } from 'typeorm';
import MessagesRepository from '@modules/users/infra/typeorm/repositories/MessagesRepository';

interface IRequest {
  equipment_id: string;
  user_id: string;
  starts_at: Date;
}

@injectable()
class CreateEquipmentReserveService {
  constructor(
    @inject('EquipmentReservesRepository')
    private EquipmentReservesRepository: IEquipmentReservesRepository,
  ) {}

  public async execute({
    equipment_id,
    user_id,
    starts_at,
  }: IRequest): Promise<EquipmentReserve> {

    const equipmentsRepository = new EquipmentsRepository();
    const usersRepository = new UsersRepository();

    const equipment = await equipmentsRepository.findById(equipment_id);
    if(!equipment){
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
    const findReserveInSameDate = await this.EquipmentReservesRepository.findByDate(
      startReserveDate,
      equipment_id,
    );

    if (findReserveInSameDate) {
      throw new AppError('Esse horário já foi reservado');
    }

    const reserve = await this.EquipmentReservesRepository.create({
      equipment_id,
      user_id,
      starts_at: startReserveDate,
    });

    const messagesRepository = getCustomRepository(MessagesRepository);
    await messagesRepository.create({
      to: 'admin',
      body: `${user.name} reservou o equipamento ${equipment.name} para data ${format(starts_at, 'd/M/yyyy')} as ${ format(starts_at, 'H:m') } hrs.`,
      
    });

    return reserve;
  }
}

export default CreateEquipmentReserveService;
