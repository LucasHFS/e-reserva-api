import { getRepository, Repository, Raw, EntityRepository } from 'typeorm';
import ICreateEquipmentReserveDTO from '@modules/reserves/dtos/ICreateEquipmentReserveDTO';
import IEquipmentReservesRepository from '@modules/reserves/repositories/IEquipmentReservesRepository';
import IFindAllInDayFromUserDTO from '@modules/reserves/dtos/IFindAllInDayFromUserDTO';
import IFindAllEquipmentInDayDTO from '@modules/reserves/dtos/IFindAllEquipmentInDayDTO';
import EquipmentReserve from '../entities/EquipmentReserve';

@EntityRepository(EquipmentReserve)
class EquipmentReserveRepository implements IEquipmentReservesRepository {
  private ormRepository: Repository<EquipmentReserve>;

  constructor() {
    this.ormRepository = getRepository(EquipmentReserve);
  }

  public async findAllInDayFromUser({
    user_id,
    day,
    month,
    year,
  }: IFindAllInDayFromUserDTO): Promise<EquipmentReserve[]> {
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
    equipment_id,
  }: IFindAllEquipmentInDayDTO ) : Promise<EquipmentReserve[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const reserves = await this.ormRepository.find({
      where: {
        starts_at: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
        equipment_id,
      },
    });

    return reserves;
  }

  public async findByDate(
    starts_at: Date,
    equipment_id: string
  ): Promise<EquipmentReserve | undefined> {
    const findReserve = await this.ormRepository.findOne({
      where: { starts_at, equipment_id }, 
    });

    return findReserve;
  }

  public async create({
    equipment_id,
    user_id,
    starts_at,
  }: ICreateEquipmentReserveDTO): Promise<EquipmentReserve> {
    const reserve = this.ormRepository.create({
      equipment_id,
      user_id,
      status: 'accepted',
      starts_at,
    });

    await this.ormRepository.save(reserve);

    return reserve;
  }
}

export default EquipmentReserveRepository;
