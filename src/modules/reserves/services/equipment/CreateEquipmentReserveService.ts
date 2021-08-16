import { startOfMinute, isBefore } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import EquipmentReserve from '../../infra/typeorm/entities/EquipmentReserve';
import IEquipmentReservesRepository from '../../repositories/IEquipmentReservesRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import EquipmentsRepository from '@modules/rentable-items/infra/typeorm/repositories/EquipmentsRepository';

interface IRequest {
  equipment_id: string;
  user_id: string;
  starts_at: Date;
  ends_at: Date;
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
    ends_at,
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
    const endReserveDate = startOfMinute(ends_at);

    // validation with hours
    // const startHour = getHours(startReserveDate);
    // const endHour = getHours(endReserveDate);

    if (
      isBefore(startReserveDate, Date.now()) ||
      isBefore(endReserveDate, Date.now())
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
      ends_at: endReserveDate,
    });

    return reserve;
  }
}

export default CreateEquipmentReserveService;
