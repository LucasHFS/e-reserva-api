import AppError from '@shared/errors/AppError';

interface IRequest {
  cpf: string;
  password: string;
}

const createSessionValidator = ({ cpf, password }: IRequest): void => {
  // TODO: Validate CPF

  if (!cpf) {
    throw new AppError('CPF é um campo obrigatório', 400);
  }

  if (!password) {
    throw new AppError('CPF é um campo obrigatório', 400);
  }
};

export default createSessionValidator;
