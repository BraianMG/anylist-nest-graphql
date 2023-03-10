import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions/internal-server-error.exception';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { ValidRoles } from '../enums/valid-roles.enum';

export const CurrentUser = createParamDecorator(
  (roles: ValidRoles[] = [], context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user: User = ctx.getContext().req.user;

    if (!user)
      throw new InternalServerErrorException(
        'No user inside the request - make sure that we used the AuthGuard',
      );

    if (roles.length === 0) return user;

    for (const role of user.roles) {
      // TODO: Eliminar "as ValidRoles"
      if (roles.includes(role as ValidRoles)) return user;
    }

    throw new ForbiddenException(
      `User ${user.fullName} need a valid role [${roles}]`,
    );
  },
);
