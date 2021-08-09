import { container } from 'tsyringe';

import '@modules/users/providers';
// import './providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IBondsRepository from '@modules/users/repositories/IBondsRepository';
import BondsRepository from '@modules/users/infra/typeorm/repositories/BondsRepository';

import ICoursesRepository from '@modules/users/repositories/ICoursesRepository';
import CoursesRepository from '@modules/users/infra/typeorm/repositories/CoursesRepository';

import IRolesRepository from '@modules/users/repositories/IRolesRepository';
import RolesRepository from '@modules/users/infra/typeorm/repositories/RolesRepository';

import IRoomsRepository from '@modules/rentable-items/repositories/IRoomsRepository';
import RoomsRepository from '@modules/rentable-items/infra/typeorm/repositories/RoomsRepository';

import IEquipmentsRepository from '@modules/rentable-items/repositories/IEquipmentsRepository';
import EquipmentsRepository from '@modules/rentable-items/infra/typeorm/repositories/EquipmentsRepository';

import ISportCourtsRepository from '@modules/rentable-items/repositories/ISportCourtsRepository';
import SportCourtsRepository from '@modules/rentable-items/infra/typeorm/repositories/SportCourtsRepository';

import IEquipmentReservesRepository from '@modules/reserves/repositories/IEquipmentReservesRepository';
import EquipmentReservesRepository from '@modules/reserves/infra/typeorm/repositories/EquipmentReservesRepository';

import IRoomReservesRepository from '@modules/reserves/repositories/IRoomReservesRepository';
import RoomReservesRepository from '@modules/reserves/infra/typeorm/repositories/RoomReservesRepository';

import ISportCourtReservesRepository from '@modules/reserves/repositories/ISportCourtReservesRepository';
import SportCourtReservesRepository from '@modules/reserves/infra/typeorm/repositories/SportCourtReservesRepository';

import IReservesRepository from '@modules/reserves/repositories/IReservesRepository';
import ReservesRepository from '@modules/reserves/infra/typeorm/repositories/ReservesRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<ICoursesRepository>(
  'CoursesRepository',
  CoursesRepository,
);

container.registerSingleton<IRolesRepository>(
  'RolesRepository',
  RolesRepository,
);

container.registerSingleton<IBondsRepository>(
  'BondsRepository',
  BondsRepository,
);

container.registerSingleton<IRoomsRepository>(
  'RoomsRepository',
  RoomsRepository,
);

container.registerSingleton<IEquipmentsRepository>(
  'EquipmentsRepository',
  EquipmentsRepository,
);

container.registerSingleton<ISportCourtsRepository>(
  'SportCourtsRepository',
  SportCourtsRepository,
);

container.registerSingleton<IEquipmentReservesRepository>(
  'EquipmentReservesRepository',
  EquipmentReservesRepository,
);

container.registerSingleton<IRoomReservesRepository>(
  'RoomReservesRepository',
  RoomReservesRepository,
);

container.registerSingleton<ISportCourtReservesRepository>(
  'SportCourtReservesRepository',
  SportCourtReservesRepository,
);

container.registerSingleton<IReservesRepository>(
  'ReservesRepository',
  ReservesRepository,
);
