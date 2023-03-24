import { Controller, Get, Sse, MessageEvent } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';
import { AppService } from './app.service';
import { SseService } from './sse.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly sseService: SseService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello() + ` from PID ${process.pid}`;
  }

  
  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return this.sseService.subscribe('main');
  }

  @Get('fire-event')
  fireEvent(): string {
    this.sseService.emit('main', {hello: 'world', pid: process.pid})
    return 'fired an event';
  }
}
