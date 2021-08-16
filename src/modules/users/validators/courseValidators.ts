import Yup from '@shared/helpers/validator';

interface IRequest {
  name: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required(),
});

const courseValidator = async ({
  name,
}: IRequest): Promise<unknown> => {

  return schema.validate(
    {
      name,
    },
    { abortEarly: false },
  );
};

export default courseValidator;
