import { Request, Response } from 'express';
import { container } from 'tsyringe';
import listPendingReservesService from '@modules/reserves/services/ListPendingReservesService';
import AppError from '@shared/errors/AppError';
import AcceptReserveService from '@modules/reserves/services/AcceptReserveService';
import DenyReserveService from '@modules/reserves/services/DenyReserveService';

export default class PendingReservesController {
  public async index(request: Request, response: Response): Promise<Response> {

    const listPendingReserves = container.resolve(listPendingReservesService);

    const reserves = await listPendingReserves.execute();

    return response.json(reserves);
  }

  public async accept(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    if (!id) {
      throw new AppError('campo id é obrigatório', 400);
    }

    const acceptReserve = container.resolve(AcceptReserveService);

    const reserve = await acceptReserve.execute({
      reserve_id: id,
    });

    return response.status(204).json(reserve);
  }

  public async deny(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    if (!id) {
      throw new AppError('campo id é obrigatório', 400);
    }

    const denyReserve = container.resolve(DenyReserveService);

    const reserve = await denyReserve.execute({
      reserve_id: id,
    });

    return response.status(204).json(reserve);
  }
}
