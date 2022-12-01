import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation(() => AuthResponse, { name: 'signup' })
  signup(
    @Args('signupInput') signupInput: SignupInput
  ): Promise<AuthResponse> {
    return this.authService.signup(signupInput)
  }

  // @Mutation(/** ? */,{name: 'login'})
  // await login(
  //   /** loginInput */
  // ): Promise</** ? */> {
  //   return this.authService.login(/** ? */)
  // }

  // @Query(/** ? */, {name: 'revalidate'})
  // async revalidateToken(): Promise</** ? */> {
  //   return this.authService.revalidateToken(/** ? */)
  // }
}
