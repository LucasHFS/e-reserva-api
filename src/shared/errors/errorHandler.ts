import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { ValidationError } from 'yup';
import AppError from '@shared/errors/AppError';

interface IValidationErrors {
  [key: string]: string[];
}

const errorHandler: ErrorRequestHandler = (
  error: Error,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: NextFunction,
) => {
  if (error instanceof ValidationError) {
    const errors: IValidationErrors = {};

    // eslint-disable-next-line consistent-return
    error.inner.forEach(err => {
      if (!err.path) {
        return response
          .status(400)
          .json({ status: 'erro', message: 'Validação falhou.' });
      }
      errors[err.path] = err.errors;
    });

    return response
      .status(400)
      .json({ status: 'erro', message: 'Validação falhou.', errors });
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'erro',
      message: error.message,
    });
  }

  // eslint-disable-next-line no-console
  console.error(error);

  return response.status(500).json({
    status: 'erro',
    message: 'Erro interno do servidor',
  });
};

export default errorHandler;
