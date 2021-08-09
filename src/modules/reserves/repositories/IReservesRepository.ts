import IReservesResponse from '../dtos/IReservesResponse';

export default interface IReservesRepository {
  getAllReserves(): Promise<IReservesResponse>;
  getPendingReserves(): Promise<IReservesResponse>;
  getAllReservesByUser(userid: string): Promise<IReservesResponse>;
  acceptReserve(reserve_id: string): Promise<unknown>;
  denyReserve(reserve_id: string): Promise<unknown>;
}
