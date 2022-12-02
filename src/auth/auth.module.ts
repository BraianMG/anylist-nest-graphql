import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthResolver, AuthService],
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // De modo asíncrono para asegurarnos de tener cargadas y leidas las variables de entorno
    JwtModule.registerAsync({
      imports: [ConfigModule], // Para tener acceso al módulo de configuración, donde estan las variables de entorno
      inject: [ConfigService], // Para poder inyectarlo y utilizarlo en useFactory
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '4h',
        },
      }),
    }),
    UsersModule,
  ],
})
export class AuthModule {}
