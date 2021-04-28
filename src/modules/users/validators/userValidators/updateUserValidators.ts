import * as Yup from 'yup';

interface IRequest {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  password: string | undefined;
  oldPassword: string | undefined;
  roleId: string;
  bondId: string;
  courseId: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  cpf: Yup.string().required(),
  phone: Yup.string().required(),
  password: Yup.string(),
  oldPassword: Yup.string(),
  roleId: Yup.string().required(),
  bondId: Yup.string().required(),
  courseId: Yup.string().required(),
});

const updateUserValidators = async ({
  name,
  email,
  cpf,
  phone,
  password,
  oldPassword,
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
      oldPassword,
      roleId,
      bondId,
      courseId,
    },
    { abortEarly: false },
  );
};

export default updateUserValidators;
