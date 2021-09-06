import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateRoomReserveService from '@modules/reserves/services/room/CreateRoomReserveService';
import RoomReserve from '@modules/reserves/infra/typeorm/entities/RoomReserve';
import { getRepository } from 'typeorm';
import AppError from '@shared/errors/AppError';

export default class RoomReservesController {
  
  public async all(request: Request, response: Response): Promise<Response> {
    const roomReservesRepository = getRepository(RoomReserve);
    const rooms = await roomReservesRepository.find({
      relations: ['user', 'room'],
    });
    return response.status(200).json(rooms);
  }

  public async findOne(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const roomReservesRepository = getRepository(RoomReserve);

    const { id } = request.params;

    if (!id) {
      throw new AppError('campo id é obrigatório', 400);
    }

    const roomReserve = await roomReservesRepository.findOne(id, {
      relations: ['user', 'room'],
    });

    if (!roomReserve) {
      throw new AppError('Reserva não encontrada', 404);
    }

    return response.status(200).json(roomReserve);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { room_id, starts_at } = request.body;

    const createReserve = container.resolve(CreateRoomReserveService);

    const reserve = await createReserve.execute({
      room_id,
      user_id,
      starts_at,
    });

    return response.status(201).json(reserve);
  }

}
