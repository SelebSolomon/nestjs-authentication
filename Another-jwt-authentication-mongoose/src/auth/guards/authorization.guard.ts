import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from 'src/decorator/permissions-decorator';
import { AuthService } from '../auth.service';
import { Permission } from 'src/roles/dto/create-role-dto';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('INSIDE AUTHORIZATION');
    const request = context.switchToHttp().getRequest();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!request.userId) {
      throw new UnauthorizedException('User id not found');
    }

    const routePermissions: Permission[] =
      await this.reflector.getAllAndOverride(PERMISSION_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
    if (!routePermissions) {
      return true;
    }

    try {
      const userPermissions = await this.authService.getUserPermissions(
        request.userId,
      );
      for (const routePermission of routePermissions) {
        const userPermission = userPermissions?.find(
          (perm) => perm.resource === routePermission.resource,
        );

        if (!userPermissions) {
          throw new ForbiddenException();
        }

        const allActionAvaiable = routePermission.actions.every(
          (requiredAction) => userPermission?.actions.includes(requiredAction),
        );
        if (!allActionAvaiable) {
          throw new UnauthorizedException();
        }
      }
    } catch (error) {
      Logger.error(error.message);
      throw new ForbiddenException();
    }

    return true;
  }
}
