import { Body, Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('guests/save')
  saveGuests(
    @Body()
    { email, guests }: { email: string; guests: { name: string; id: string }[] }
  ) {
    this.appService.sendInvitation(email, guests);
  }

  @Post('verify')
  verifyJWT(
    @Body()
    { token }: { token: string }
  ) {
    return this.appService.verifyJWT(token);
  }
}
