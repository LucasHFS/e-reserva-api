import { injectable, inject } from 'tsyringe';
import IReservesRepository from '../repositories/IReservesRepository';

@injectable()
class ListPendingReservesService {
  constructor(
    @inject('ReservesRepository')
    private ReservesRepository: IReservesRepository,
  ) {}

  public async execute(): Promise<unknown> {
    return this.ReservesRepository.getPendingReserves();
  }
}

export default ListPendingReservesService;
