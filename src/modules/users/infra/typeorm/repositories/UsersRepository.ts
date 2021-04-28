import { EntityRepository, getRepository, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '../entities/User';

@EntityRepository(User)
class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async first(): Promise<User | undefined> {
    return this.ormRepository.findOne();
  }

  public async find(): Promise<User[]> {
    return this.ormRepository.find({
      select: [
        'id',
        'name',
        'cpf',
        'email',
        'phone',
        'created_at',
        'updated_at',
      ],
      relations: ['role', 'bond', 'courses'],
    });
  }

  public async findByCpf(cpf: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { cpf },
    });

    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id, {
      select: [
        'id',
        'name',
        'cpf',
        'email',
        'phone',
        'password',
        'created_at',
        'updated_at',
      ],
      relations: ['role', 'bond', 'courses'],
    });

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
    });

    return user;
  }

  public async create({
    name,
    email,
    cpf,
    phone,
    password,
    bond,
    courses,
    role,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({
      name,
      email,
      cpf,
      phone,
      password,
    });

    user.bond = bond;
    user.courses = courses;
    user.role = role;

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async delete(user: User): Promise<void> {
    await this.ormRepository.remove(user);
  }
}

export default UsersRepository;
