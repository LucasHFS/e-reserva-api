import { getCustomRepository } from 'typeorm';

import BondsRepository from '@modules/users/infra/typeorm/repositories/BondsRepository';
import RolesRepository from '@modules/users/infra/typeorm/repositories/RolesRepository';
import CoursesRepository from '@modules/users/infra/typeorm/repositories/CoursesRepository';
import AuthenticateUserService from '@modules/users/services/userServices/AuthenticateUserService';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';
import User from '@modules/users/infra/typeorm/entities/User';

const generateToken = async (dirtUser?: User): Promise<string> => {
  const usersRepository = new UsersRepository();
  const hashProvider = new BCryptHashProvider();
  const authenticateUserService = new AuthenticateUserService(
    usersRepository,
    hashProvider,
  );

  let user = dirtUser

  if(!user){
    const bondsRepository = getCustomRepository(BondsRepository);
    const rolesRepository = getCustomRepository(RolesRepository);
    const coursesRepository = getCustomRepository(CoursesRepository);
  
    const bond = await bondsRepository.create({ name: 'bx1' });
    const role = await rolesRepository.create({ name: 'Administrador', description: 'abc' });
    const course = await coursesRepository.create({ name: 'crsex' });
  
    user = await usersRepository.create({
      name: 'Lucas Silva',
      email: 'lucas3333@gmail.com',
      cpf: '70142411888',
      phone: '62991431044',
      password: await hashProvider.generateHash('123456'),
      bond,
      role,
      courses: [course],
    });
  }

  const { token } = await authenticateUserService.execute({
    cpf: user.cpf,
    password: '123456',
  });
  return token;
};

export default generateToken;
