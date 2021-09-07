import Message from '../infra/typeorm/entities/Message';
import ICreateMessageDTO from '../dtos/ICreateMessageDTO';

export default interface IMessagesRepository {
  getUserMessages(userId: string): Promise<Message[]>;
  getAdminsMessages(): Promise<Message[]>;
  create(data: ICreateMessageDTO): Promise<Message>;
  markAsRead(message_id: string): Promise<Message>;
}
