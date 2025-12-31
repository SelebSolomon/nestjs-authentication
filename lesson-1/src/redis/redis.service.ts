import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: RedisClientType;
  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    this.client = createClient({ url: redisUrl });
    this.client.on('error', (err) => {
      console.error(err);
    });

    await this.client.connect();
    console.log('redis is connected ....');
  }

  getClient(): RedisClientType {
    return this.client;
  }
}
