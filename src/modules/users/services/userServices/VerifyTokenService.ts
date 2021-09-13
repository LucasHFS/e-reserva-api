import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';

interface IRequest {
  token: string;
}

class VerifyTokenService {
  public execute({ token }: IRequest): boolean {
    const { secret } = authConfig.jwt;
    let valid = true;

    try {
      verify(token, secret);
    } catch(err){
      console.log(err)
      valid = false;
    }
    return valid;
  }
}

export default VerifyTokenService;
