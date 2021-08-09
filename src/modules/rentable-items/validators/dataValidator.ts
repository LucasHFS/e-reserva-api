import Yup from '@shared/helpers/validator';

interface IRequest {
  name: string;
  description: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
});

const createUserValidator = async ({
  name,
  description,
}: IRequest): Promise<unknown> => {
  return schema.validate(
    {
      name,
      description,
    },
    { abortEarly: false },
  );
};

export default createUserValidator;
