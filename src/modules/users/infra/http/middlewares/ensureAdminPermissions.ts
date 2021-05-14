import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';

export default async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  if (!request.user) {
    throw new AppError('Acesso não permitido', 401);
  }

  const user_id = request.user.id;

  const usersRepository = getCustomRepository(UsersRepository);
  const user = await usersRepository.findById(user_id);

  if (!user) {
    throw new AppError('Acesso não permitido', 401);
  }

  if (user.role.name !== 'Gestor' && user.role.name !== 'Administrador') {
    throw new AppError('Você não possui permissão', 401);
  }

  return next();
}
