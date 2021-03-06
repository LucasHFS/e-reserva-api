import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Yup from '@shared/helpers/validator';

interface IRequest {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  password: string;
  bondId: string;
  courseId: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  cpf: Yup.string().required(),
  phone: Yup.string().nullable(),
  password: Yup.string().required(),
  bondId: Yup.string().required(),
  courseId: Yup.string().required(),
});

const createUserValidator = async ({
  name,
  email,
  cpf,
  phone,
  password,
  bondId,
  courseId,
}: IRequest): Promise<unknown> => {
  // TODO: Validate CNPJ

  const usersRepository = getCustomRepository(UsersRepository);

  const cpfUser = await usersRepository.findByCpf(cpf);
  const emailUser = await usersRepository.findByEmail(email);

  if (cpfUser) {
    throw new AppError('Cpf já existente', 400);
  }

  if (emailUser) {
    throw new AppError('Email já existente', 400);
  }

  return schema.validate(
    {
      name,
      email,
      cpf,
      phone,
      password,
      bondId,
      courseId,
    },
    { abortEarly: false },
  );
};

export default createUserValidator;
