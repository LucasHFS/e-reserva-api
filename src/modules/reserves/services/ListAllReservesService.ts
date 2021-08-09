import { injectable, inject } from 'tsyringe';
import IReservesRepository from '../repositories/IReservesRepository';

@injectable()
class ListAllReservesService {
  constructor(
    @inject('ReservesRepository')
    private ReservesRepository: IReservesRepository,
  ) {}

  public async execute(): Promise<unknown> {
    return this.ReservesRepository.getAllReserves();
  }
}

export default ListAllReservesService;
