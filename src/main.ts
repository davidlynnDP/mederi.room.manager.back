import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('MainRest');
  
  app.setGlobalPrefix('api');
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,  
      transformOptions: {
        enableImplicitConversion: true,
      }
    }),
  );

  await app.listen( envs.port );
  logger.log(`App running on port ${ envs.port }`);
}
bootstrap();
