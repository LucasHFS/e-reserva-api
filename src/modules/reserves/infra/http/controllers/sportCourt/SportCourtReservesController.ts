import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateSportCourtReserveService from '@modules/reserves/services/sportCourt/CreateSportCourtReserveService';
import { getRepository } from 'typeorm';
import SportCourtReserve from '@modules/reserves/infra/typeorm/entities/SportCourtReserve';
import AppError from '@shared/errors/AppError';

export default class SportCourtReservesController {
  public async all(request: Request, response: Response): Promise<Response> {
    const sportCourtReservesRepository = getRepository(SportCourtReserve);
    const sportCourts = await sportCourtReservesRepository.find({
      relations: ['user', 'sport_court'],
    });
    
    return response.status(200).json(sportCourts);
  }

  public async findOne(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const sportCourtReservesRepository = getRepository(SportCourtReserve);

    const { id } = request.params;

    if (!id) {
      throw new AppError('campo id é obrigatório', 400);
    }

    const sportCourtReserve = await sportCourtReservesRepository.findOne(id,{
      relations: ['user', 'sport_court'],
    });

    if (!sportCourtReserve) {
      throw new AppError('Reserva não encontrada', 404);
    }

    return response.status(200).json(sportCourtReserve);
  }
  
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { sport_court_id, starts_at, ends_at } = request.body;

    const createReserve = container.resolve(CreateSportCourtReserveService);

    const reserve = await createReserve.execute({
      sport_court_id,
      user_id,
      starts_at,
      ends_at,
    });

    return response.json(reserve);
  }

}
