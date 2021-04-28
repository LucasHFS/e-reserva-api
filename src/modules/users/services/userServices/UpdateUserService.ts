import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
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

    thisUser.name = name;
    thisUser.cpf = cpf;
    thisUser.email = email;
    thisUser.phone = phone;
    thisUser.updated_at = new Date();

    const user = await this.usersRepository.save(thisUser);

    return user;
  }
}

export default UpdateUserService;
