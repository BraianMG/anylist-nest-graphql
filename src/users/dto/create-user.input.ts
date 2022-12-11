import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  fullName: string;

  @Field(() => String)
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
