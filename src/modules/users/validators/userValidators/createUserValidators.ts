import * as Yup from 'yup';

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

const schema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  cpf: Yup.string().required(),
  phone: Yup.string(),
  password: Yup.string().required(),
  roleId: Yup.string().required(),
  bondId: Yup.string().required(),
  courseId: Yup.string().required(),
});

const createUserValidator = async ({
  name,
  email,
  cpf,
  phone,
  password,
  roleId,
  bondId,
  courseId,
}: IRequest): Promise<unknown> => {
  // TODO: Validate CNPJ
  return schema.validate(
    {
      name,
      email,
      cpf,
      phone,
      password,
      roleId,
      bondId,
      courseId,
    },
    { abortEarly: false },
  );
};

export default createUserValidator;
