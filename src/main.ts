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
//guia para echar a andar la aplicacion
//cp .env.template .env
//npm install
//docker-compose up -d
//npm run start:dev
//npx prisma db push

//guia de como se puede desplegar la aplicacion
//docker-compose up -d
//docker-compose -f docker-compose.prod.yml build
//docker-compose -f docker-compose.prod.yml up
//docker push dav1dlynn/mederi.room.manager.back:latest

//docker buildx build --platform linux/amd64,linux/arm64 -t dav1dlynn/mederi.room.manager.back --push .
