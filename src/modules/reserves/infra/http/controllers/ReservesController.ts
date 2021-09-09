import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListAllReserves from '@modules/reserves/services/ListAllReservesService';
import AppError from '@shared/errors/AppError';
import DeleteReserveService from '@modules/reserves/services/DeleteReserveService';

export default class ReservesController {
  public async index(request: Request, response: Response): Promise<Response> {

    const listReserves = container.resolve(ListAllReserves);

    const reserves = await listReserves.execute();

    return response.json(reserves);
  }


  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    if (!id) {
      throw new AppError('campo id é obrigatório', 400);
    }

    const deleteReserve = new DeleteReserveService();

    await deleteReserve.execute({
      reserve_id: id,
    });

    return response.status(204).json({});
  }
}
