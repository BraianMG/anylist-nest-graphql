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

  const PORT = process.env.PORT || 3000
  await app.listen(PORT);

  console.log(`App running on port ${PORT}`)
}
bootstrap();
