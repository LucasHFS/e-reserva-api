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
