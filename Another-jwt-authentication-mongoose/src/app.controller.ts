import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticationGuard } from './auth/guards/authentication.guard';
import { Permissions } from './decorator/permissions-decorator';
import { Resource } from './roles/enums/resource-enums';
import { Action } from './roles/enums/action-enums';
import { AuthorizationGuard } from './auth/guards/authorization.guard';

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Permissions([{ resource: Resource.products, actions: [Action.read] }])
  @Get('generic')
  generic(@Req() req) {
    return { message: 'Is Access denied', userId: req.userId };
  }
}
