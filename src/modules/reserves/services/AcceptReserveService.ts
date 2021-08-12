import { injectable, inject } from 'tsyringe';
import IReservesRepository from '../repositories/IReservesRepository';

interface IRequest {
  reserve_id: string;
}

@injectable()
class AcceptReserveService {
  constructor(
    @inject('ReservesRepository')
    private ReservesRepository: IReservesRepository,
  ) {}

  public async execute({ reserve_id }: IRequest): Promise<unknown> {
    if(reserve_id === ''){
      return {
        "status": "erro",
        "message": "Validação falhou.",
        "errors": {
            "reserve_id": [
                "é um campo obrigatório"
            ]
        }
      }
    }

    const reserve = await this.ReservesRepository.acceptReserve(
      reserve_id,
    );
    return reserve;
  }
}

export default AcceptReserveService;
