import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from '../auth/dto/inputs/signup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });

      return await this.usersRepository.save(newUser);
    } catch (error) {
      console.log(error);
      this.handleDBErrors(error);
    }
  }

  async findAll(
    roles: ValidRoles[],
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<User[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    console.log({ zone: 'UsersService - findAll', limit, offset, search });

    const queryBuilder = this.usersRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset);

    if (roles.length !== 0)
      queryBuilder
        .andWhere('ARRAY[roles] && ARRAY[:...roles]')
        .setParameter('roles', roles);

    if (search) {
      // TODO: agregar búsqueda por 'email' además de 'fullName'
      queryBuilder.andWhere('LOWER("fullName") like :fullName', {
        fullName: `%${search.toLowerCase()}%`,
      });
    }

    return queryBuilder.getMany();

    //# region ORIGINAL
    // if (roles.length === 0)
    //   return this.usersRepository.find({
    //     //! No es necesario porque tenemos 'lazy' la propiedad 'lastUpdateBy'
    //     // relations: {
    //     //   lastUpdateBy: true,
    //     // },
    //   });

    // return this.usersRepository
    //   .createQueryBuilder()
    //   .andWhere('ARRAY[roles] && ARRAY[:...roles]')
    //   .setParameter('roles', roles)
    //   .getMany();
    //# endregion
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
    } catch (error) {
      throw new NotFoundException(`${email} not found`);
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`${id} not found`);
    }
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    updateBy: User,
  ): Promise<User> {
    const user = await this.usersRepository.preload({
      ...updateUserInput,
      id,
    });
    if (!user) throw new NotFoundException(`User with id: ${id} not found`);
    try {
      user.lastUpdateBy = updateBy;
      return await this.usersRepository.save(user);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async block(id: string, adminUser: User): Promise<User> {
    const userToBlock = await this.findOneById(id);
    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = adminUser;
    return await this.usersRepository.save(userToBlock);
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
