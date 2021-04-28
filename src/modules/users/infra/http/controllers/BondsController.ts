import { Request, Response } from 'express';
import { container } from 'tsyringe';

import DeleteBondService from '@modules/users/services/bondServices/DeleteBondService';
import CreateBondService from '@modules/users/services/bondServices/CreateBondService';
import UpdateBondService from '@modules/users/services/bondServices/UpdateBondService';
import BondsRepository from '@modules/users/infra/typeorm/repositories/BondsRepository';
import AppError from '@shared/errors/AppError';

export default class BondsController {
  public async all(request: Request, response: Response): Promise<Response> {
    const bondsRepository = new BondsRepository();
    const bonds = await bondsRepository.find();
    return response.status(200).json(bonds);
  }

  public async findOne(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    if (!id) {
      throw new AppError('Campo id é obrigatório', 400);
    }

    const bondsRepository = new BondsRepository();
    const bond = await bondsRepository.findById(id);

    if (!bond) {
      throw new AppError('Vínculo não encontrado', 404);
    }

    return response.status(200).json(bond);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;

    const createBond = container.resolve(CreateBondService);

    const bond = await createBond.execute({
      name,
    });

    return response.status(201).json(bond);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name } = request.body;

    if (!id) {
      throw new AppError('campo id é obrigatório', 404);
    }

    const updateBond = container.resolve(UpdateBondService);

    const bond = await updateBond.execute({
      id,
      name,
    });

    return response.status(200).json(bond);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    if (!id) {
      throw new AppError('campo id é obrigatório', 404);
    }

    const deleteBond = container.resolve(DeleteBondService);

    await deleteBond.execute(id);

    return response.status(204).send();
  }
}
