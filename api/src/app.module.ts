import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SseService } from './sse.service';

const REDIS_CREDS = {
  username: 'default',
  password: 'redispw',
  host: '127.0.0.1',
  port: 55000
}

@Module({
  imports: [
    RedisModule.forRoot({
      config: [
        {
          namespace: 'pub',
          ...REDIS_CREDS
        },
        {
          namespace: 'sub',
          ...REDIS_CREDS
        }
      ]
    })
  ],
  controllers: [AppController],
  providers: [AppService, SseService],
})
export class AppModule { }
