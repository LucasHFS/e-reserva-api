import { Request, Response } from 'express';
import { container } from 'tsyringe';

import MessagesRepository from '@modules/users/infra/typeorm/repositories/MessagesRepository';
import AppError from '@shared/errors/AppError';

export default class MessagesController {
  public async adminMessages(request: Request, response: Response): Promise<Response> {
    const messagesRepository = new MessagesRepository();
    const messages = await messagesRepository.getAdminsMessages();

    return response.status(200).json(messages);
  }

  public async userMessages(request: Request, response: Response): Promise<Response> {
    const { id } = request.user

    const messagesRepository = new MessagesRepository();
    const messages = await messagesRepository.getUserMessages(id);

    return response.status(200).json(messages);
  }

  public async markAsRead(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    // const messagesRepository = new MessagesRepository();

    // await messagesRepository.markAsRead(id)

    return response.status(200).json({});
  }
}
