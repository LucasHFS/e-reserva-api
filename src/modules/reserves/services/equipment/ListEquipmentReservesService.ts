import { injectable, inject } from 'tsyringe';
import Reserve from '@modules/reserves/infra/typeorm/entities/EquipmentReserve';
import IEquipmentReservesRepository from '../../repositories/IEquipmentReservesRepository';

interface IRequest {
  user_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListEquipmentReservesService {
  constructor(
    @inject('EquipmentReservesRepository')
    private equipmentReservesRepository: IEquipmentReservesRepository,
  ) {}

  public async execute({
    user_id,
    day,
    month,
    year,
  }: IRequest): Promise<Reserve[]> {
    const reserves = await this.equipmentReservesRepository.findAllInDayFromUser(
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

export default ListEquipmentReservesService;
