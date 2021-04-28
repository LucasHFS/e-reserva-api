import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import RolesRepository from '@modules/users/infra/typeorm/repositories/RolesRepository';
import BondsRepository from '@modules/users/infra/typeorm/repositories/BondsRepository';
import CoursesRepository from '@modules/users/infra/typeorm/repositories/CoursesRepository';
import createUserValidator from '../../validators/userValidators/createUserValidators';
import IUsersRepository from '../../repositories/IUsersRepository';
import User from '../../infra/typeorm/entities/User';

import IHashProvider from '../../providers/HashProvider/models/IHashProvider';

interface IRequest {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  password: string;
  roleId: string;
  bondId: string;
  courseId: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    name,
    email,
    cpf,
    phone,
    password,
    roleId,
    bondId,
    courseId,
  }: IRequest): Promise<User> {
    await createUserValidator({
      name,
      email,
      cpf,
      phone,
      password,
      roleId,
      bondId,
      courseId,
    });

    const rolesRepository = getCustomRepository(RolesRepository);
    const bondsRepository = getCustomRepository(BondsRepository);
    const coursesRepository = getCustomRepository(CoursesRepository);

    // Check existent role
    const role = await rolesRepository.findById(roleId);

    if (!role) {
      throw new AppError('Papel do usuário não encontrado', 404);
    }

    // Check existent bond
    const bond = await bondsRepository.findById(bondId);

    if (!bond) {
      throw new AppError('Vínculo do usuário não encontrado', 404);
    }

    // Check existent course
    const course = await coursesRepository.findById(courseId);

    if (!course) {
      throw new AppError('Curso do usuário não encontrado', 404);
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      cpf,
      phone,
      password: hashedPassword,
      role,
      bond,
      courses: [course],
    });

    return user;
  }
}

export default CreateUserService;
