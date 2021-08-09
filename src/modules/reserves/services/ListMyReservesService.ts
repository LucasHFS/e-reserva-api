import { injectable, inject } from 'tsyringe';
import IReservesRepository from '../repositories/IReservesRepository';

interface IRequest {
  user_id: string;
}

@injectable()
class ListAllReservesService {
  constructor(
    @inject('ReservesRepository')
    private ReservesRepository: IReservesRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<unknown> {
    const reserves = await this.ReservesRepository.getAllReservesByUser(
      user_id,
    );
    return reserves;
  }
}

export default ListAllReservesService;
