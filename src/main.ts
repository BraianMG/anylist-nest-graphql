import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true, //! Esto es para evitar el poder enviar más información de la que necesito, en este caso GrapQL se encarga de evitar eso. Desactivamos o comentamos para poder recibir más de un Args como en 'findAll' de ItemsResolver
    }),
  );

  await app.listen(3000);
}
bootstrap();
