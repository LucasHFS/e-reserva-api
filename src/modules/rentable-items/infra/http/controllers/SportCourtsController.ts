import { Request, Response } from 'express';
import { container } from 'tsyringe';

import DeleteSportCourtService from '@modules/rentable-items/services/sportCourtServices/DeleteSportCourtService';
import CreateSportCourtService from '@modules/rentable-items/services/sportCourtServices/CreateSportCourtService';
import UpdateSportCourtService from '@modules/rentable-items/services/sportCourtServices/UpdateSportCourtService';
import SportCourtsRepository from '@modules/rentable-items/infra/typeorm/repositories/SportCourtsRepository';
import AppError from '@shared/errors/AppError';

export default class SportCourtsController {
  public async all(request: Request, response: Response): Promise<Response> {
    const sportCourtsRepository = new SportCourtsRepository();
    const sportCourts = await sportCourtsRepository.find();
    return response.status(200).json(sportCourts);
  }

  public async findOne(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    if (!id) {
      throw new AppError('campo id é obrigatório', 400);
    }

    const sportCourtsRepository = new SportCourtsRepository();
    const sportCourt = await sportCourtsRepository.findById(id);

    if (!sportCourt) {
      throw new AppError('Quadra não encontrada', 404);
    }

    return response.status(200).json(sportCourt);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, description } = request.body;

    const createSportCourt = container.resolve(CreateSportCourtService);

    const sportCourt = await createSportCourt.execute({
      name,
      description,
    });

    return response.status(201).json(sportCourt);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, description } = request.body;

    if (!id) {
      throw new AppError('campo id é obrigatório', 404);
    }

    const updateSportCourt = container.resolve(UpdateSportCourtService);

    const sportCourt = await updateSportCourt.execute({
      id,
      name,
      description,
    });

    return response.status(200).json(sportCourt);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    if (!id) {
      throw new AppError('campo id é obrigatório', 404);
    }

    const deleteSportCourt = container.resolve(DeleteSportCourtService);

    await deleteSportCourt.execute(id);

    return response.status(204).send();
  }
}
