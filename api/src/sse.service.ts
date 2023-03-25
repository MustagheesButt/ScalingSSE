import { Injectable, MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class SseService {
  private redisPublisher: Redis;
  private redisSubscriber: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redisPublisher = this.redisService.getClient('pub')
    this.redisSubscriber = this.redisService.getClient('sub')

    setInterval(() => {
      this.emit('main', {type: 'ping'})
    }, 30_000);
  }

  subscribe(channel: string) {
    this.redisSubscriber.subscribe(channel);
    return new Observable<MessageEvent>((observer) => {
      this.redisSubscriber.on('message', (channel, message) => {
        observer.next(message);
      });
    });
  }

  emit(channel: string, data?: object) {
    this.redisPublisher.publish(channel, JSON.stringify(data));
  }
}
