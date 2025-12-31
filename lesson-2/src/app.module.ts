import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DBModule } from './database/db.module';
import { UserEntity } from './domain/user/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './domain/auth/auth.module';
import { UserModule } from './domain/user/user.module';
import { DomainModule } from './domain/domain.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DBModule.forRoot({
      entities: [UserEntity],
    }),
    AuthModule,
    UserModule,
    DomainModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
