import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AuthenticateUserService from '@modules/users/services/userServices/AuthenticateUserService';
import VerifyTokenService from '@modules/users/services/userServices/VerifyTokenService';
import AppError from '@shared/errors/AppError';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { cpf, password } = request.body;

    const authenticateUserService = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUserService.execute({
      cpf,
      password,
    });

    return response.status(201).json({ user, token });
  }

  public async validate(request: Request, response: Response): Promise<Response> {
    const { token } = request.query;

    if (!token) {
      throw new AppError('Token é obrigatório', 400);
    }

    const verifyToken = new VerifyTokenService();

    const valid = await verifyToken.execute({
      token: token.toString()
    });

    return response.status(200).json({ valid });
  }
}
