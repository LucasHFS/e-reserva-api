import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import CoursesRepository from '@modules/users/infra/typeorm/repositories/CoursesRepository';
import { getCustomRepository } from 'typeorm';
import BondsRepository from '@modules/users/infra/typeorm/repositories/BondsRepository';
import RolesRepository from '@modules/users/infra/typeorm/repositories/RolesRepository';
import User from '../../infra/typeorm/entities/User';
import IUsersRepository from '../../repositories/IUsersRepository';
import updateUserValidator from '../../validators/userValidators/updateUserValidators';

import IHashProvider from '../../providers/HashProvider/models/IHashProvider';

interface IRequest {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  password?: string;
  oldPassword?: string;
  roleId: string;
  bondId: string;
  courseId: string;
}

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    id,
    name,
    email,
    cpf,
    phone,
    password,
    oldPassword,
    roleId,
    bondId,
    courseId,
  }: IRequest): Promise<User> {
    await updateUserValidator({
      name,
      email,
      cpf,
      phone,
      password,
      oldPassword,
      roleId,
      bondId,
      courseId,
    });

    const thisUser = await this.usersRepository.findById(id);

    if (!thisUser) {
      throw new AppError('Usuário não encontrado', 404);
    }

    if (thisUser.email !== email) {
      const checkUserExistsByMail = await this.usersRepository.findByEmail(
        email,
      );
      if (checkUserExistsByMail) {
        throw new AppError('Email já utilizado', 400);
      }
    }

    if (thisUser.cpf !== cpf) {
      const checkUserExistsByCpf = await this.usersRepository.findByCpf(cpf);

      if (checkUserExistsByCpf) {
        throw new AppError('Cpf já utilizado', 400);
      }
    }

    if (password && oldPassword) {
      if (oldPassword === password) {
        throw new AppError('Senhas informadas são iguais', 400);
      }
      const hashedNewPassword = await this.hashProvider.generateHash(password);

      if (!thisUser.password) {
        throw new AppError('Não foi possível realizar autenticação', 403);
      }
      const passwordMatches = await this.hashProvider.compareHash(
        oldPassword,
        thisUser.password,
      );

      if (!passwordMatches) {
        throw new AppError('Senha atual incorreta', 403);
      }

      thisUser.password = hashedNewPassword;
    }

    const coursesRepository = getCustomRepository(CoursesRepository);
    const course = await coursesRepository.findById(courseId);

    if (!course) {
      throw new AppError('id do curso não encontrado', 404);
    }

    if (thisUser.bondId !== bondId) {
      const bondsRepository = getCustomRepository(BondsRepository);
      const bond = await bondsRepository.findById(bondId);

      if (!bond) {
        throw new AppError('id do vínculo não encontrado', 404);
      }
      thisUser.bond = bond;
    }

    if (thisUser.roleId !== roleId) {
      const rolesRepository = getCustomRepository(RolesRepository);
      const role = await rolesRepository.findById(roleId);

      if (!role) {
        throw new AppError('id do vínculo não encontrado', 404);
      }
      thisUser.role = role;
    }

    thisUser.name = name;
    thisUser.cpf = cpf;
    thisUser.email = email;
    thisUser.phone = phone;
    thisUser.courses = [course];

    const user = await this.usersRepository.save(thisUser);

    return user;
  }
}

export default UpdateUserService;
