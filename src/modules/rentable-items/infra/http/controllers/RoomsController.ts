import { Request, Response } from 'express';
import { container } from 'tsyringe';

import DeleteRoomService from '@modules/rentable-items/services/roomsServices/DeleteRoomService';
import CreateRoomService from '@modules/rentable-items/services/roomsServices/CreateRoomService';
import UpdateRoomService from '@modules/rentable-items/services/roomsServices/UpdateRoomService';
import RoomsRepository from '@modules/rentable-items/infra/typeorm/repositories/RoomsRepository';
import AppError from '@shared/errors/AppError';

export default class RoomsController {
  public async all(request: Request, response: Response): Promise<Response> {
    const roomsRepository = new RoomsRepository();
    const rooms = await roomsRepository.find();
    return response.status(200).json(rooms);
  }

  public async findOne(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    if (!id) {
      throw new AppError('campo id é obrigatório', 400);
    }

    const roomsRepository = new RoomsRepository();
    const room = await roomsRepository.findById(id);

    if (!room) {
      throw new AppError('Papel não encontrado', 404);
    }

    return response.status(200).json(room);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, description } = request.body;

    const createRoom = container.resolve(CreateRoomService);

    const room = await createRoom.execute({
      name,
      description,
    });

    return response.status(201).json(room);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, description } = request.body;

    if (!id) {
      throw new AppError('campo id é obrigatório', 404);
    }

    const updateRoom = container.resolve(UpdateRoomService);

    const room = await updateRoom.execute({
      id,
      name,
      description,
    });

    return response.status(200).json(room);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    if (!id) {
      throw new AppError('campo id é obrigatório', 404);
    }

    const deleteRoom = container.resolve(DeleteRoomService);

    await deleteRoom.execute(id);

    return response.status(204).send();
  }
}
