import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import RedisStore from 'connect-redis';
import passport from 'passport';
import Redis from 'ioredis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Create Redis client directly here instead of using RedisService
  const redisClient = new Redis(
    process.env.REDIS_URL || 'redis://localhost:6379',
  );

  const store = new RedisStore({
    client: redisClient,
    prefix: 'session:',
  });

  // Apply session middleware FIRST
  app.use(
    session({
      store: store,
      secret: process.env.SESSION_SECRET || 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      name: 'connect.sid',
      cookie: {
        maxAge: 3600000,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('Application is running on port 3000');
}
bootstrap();
