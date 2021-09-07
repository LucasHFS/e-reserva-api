import { EntityRepository, getRepository, Repository } from 'typeorm';

import IMessagesRepository from '@modules/users/repositories/IMessagesRepository';

import ICreateMessageDTO from '@modules/users/dtos/ICreateMessageDTO';

import Message from '../entities/Message';
import AppError from '@shared/errors/AppError';

@EntityRepository(Message)
class MessagesRepository implements IMessagesRepository {
  private ormRepository: Repository<Message>;

  constructor() {
    this.ormRepository = getRepository(Message);
  }

  public async getAdminsMessages(): Promise<Message[]> {
    const messages = await this.ormRepository.find({ where: { to: 'admin' }, order: { created_at: 'DESC' } });

    return messages;
  }

  public async getUserMessages(userId: string): Promise<Message[]> {
    const messages = await this.ormRepository.find({ where: { userId }, order: { created_at: 'DESC' }  });

    return messages;
  }

  public async create({ 
    body,
    to,
    userId,
   }: ICreateMessageDTO): Promise<Message> {
    const message = this.ormRepository.create({
      body,
      to,
      userId,    
    });

    await this.ormRepository.save(message);

    return message;
  }

  public async markAsRead(message_id: string): Promise<Message> {
    const message = await this.ormRepository.findOne(message_id);
    if(!message) {
      throw new AppError('message not found', 404);
    }
    
    message.read = true;
    return this.ormRepository.save(message);
  }
}

export default MessagesRepository;
