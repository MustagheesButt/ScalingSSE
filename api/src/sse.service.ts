import { Injectable, MessageEvent } from '@nestjs/common';
import { fromEvent, Observable } from 'rxjs';
import { EventEmitter } from 'events';

@Injectable()
export class SseService {
  private readonly emitter = new EventEmitter();

  constructor() {
  }

  subscribe(channel: string) {
    return fromEvent<MessageEvent>(this.emitter, channel);
  }

  emit(channel: string, data?: object) {
    this.emitter.emit(channel, { data })
  }
}
