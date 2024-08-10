import { Controller, Get } from '@nestjs/common';
import { AppService, GetHelloResponse } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): GetHelloResponse {
    return this.appService.getHello();
  }
}
