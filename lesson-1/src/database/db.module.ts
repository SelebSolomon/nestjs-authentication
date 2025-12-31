import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { dbconfig } from './db.interface';

@Module({})
export class DBModule {
  private static getConnectionOptions(
    config: ConfigService,
    dbconfig: dbconfig,
  ): TypeOrmModuleOptions {
    const databaseUrl = config.get<string>('DATABASE_URL');
    return {
      type: 'postgres',
      url: databaseUrl,
      ssl:
        process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'test'
          ? { rejectUnauthorized: false }
          : false,
      entities: dbconfig.entities,
      synchronize: true,
      logging: false,
    };
  }

  public static forRoot(dbconfig: any): DynamicModule {
    return {
      module: DBModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            return DBModule.getConnectionOptions(configService, dbconfig);
          },
          inject: [ConfigService],
        }),
      ],
    };
  }
}
