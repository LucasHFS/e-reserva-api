export default interface ICreateMessageDTO {
  userId?: string;
  to: 'user' | 'admin';
  body: string;
  read?: boolean;
}
