import IReservesResponse from '../dtos/IReservesResponse';

export default interface IReservesRepository {
  getAllReserves(): Promise<Array<any>>;
  getPendingReserves(): Promise<Array<any>>;
  countPendingReserves(): Promise<number>;
  getAllReservesByUser(userid: string): Promise<Array<any>>;
  acceptReserve(reserve_id: string): Promise<unknown>;
  denyReserve(reserve_id: string): Promise<unknown>;
}
