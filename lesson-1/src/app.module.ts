import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DomainModule } from './domain/user/domain.module';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './domain/user/user.module';
import { AuthModule } from './domain/auth/auth.module';

@Module({
  imports: [DomainModule, RedisModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
