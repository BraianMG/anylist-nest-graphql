import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from '../auth/dto/inputs/signup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create(signupInput);
      return await this.usersRepository.save(newUser);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Algo saliò mal');
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOne(id: string): Promise<User> {
    throw new Error('findOne method not implemented');
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  async block(id: string): Promise<User> {
    throw new Error('block method not implemented');
  }
}
