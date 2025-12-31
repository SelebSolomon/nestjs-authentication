import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/database/config/typeorm.config';
import { DBModule } from 'src/database/db.module';
import { User } from './user.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from './user.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    RedisModule,
    ConfigModule.forRoot({ isGlobal: true }),

    DBModule.forRoot({
      entities: [User],
    }),

    // // static configuration
    // TypeOrmModule.forRoot(typeOrmConfig)

    // // dynamic configuration
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get('DB_HOST'),
    //     port: Number(configService.get('DB_PORT')),
    //     username: configService.get('DB_USERNAME'),
    //     password: configService.get('DB_PASSWORD'),
    //     database: configService.get('DB_NAME'),
    //     autoLoadEntities: true,
    //     synchronize: true,
    //   }),
    // }),
  ],
  controllers: [],
  providers: [],
})
export class DomainModule {}
