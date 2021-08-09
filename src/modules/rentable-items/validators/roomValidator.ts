import Yup from '@shared/helpers/validator';

interface IRequest {
  name: string;
  description: string;
  type: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  type: Yup.string().required(),
});

const createUserValidator = async ({
  name,
  description,
  type,
}: IRequest): Promise<unknown> => {
  return schema.validate(
    {
      name,
      description,
      type,
    },
    { abortEarly: false },
  );
};

export default createUserValidator;
