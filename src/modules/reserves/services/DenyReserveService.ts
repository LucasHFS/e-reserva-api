import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IReservesRepository from '../repositories/IReservesRepository';

interface IRequest {
  reserve_id: string;
}

@injectable()
class DenyReserveService {
  constructor(
    @inject('ReservesRepository')
    private ReservesRepository: IReservesRepository,
  ) {}

  public async execute({ reserve_id }: IRequest): Promise<unknown> {
    const reserve = await this.ReservesRepository.denyReserve(
      reserve_id,
    );
    return reserve;
  }
}

export default DenyReserveService;
