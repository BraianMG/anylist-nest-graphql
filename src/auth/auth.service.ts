import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const user = await this.userService.create(signupInput);

    // TODO: crear JWT
    const token = 'abc123';

    return { token, user };
  }
}
