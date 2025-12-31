import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    console.log('=== AuthenticatedGuard Debug ===');
    console.log('Session ID:', request.sessionID);
    console.log('Session:', request.session);
    console.log('User:', request.user);
    console.log('Has isAuthenticated:', typeof request.isAuthenticated);

    if (
      !request.isAuthenticated ||
      typeof request.isAuthenticated !== 'function'
    ) {
      console.log('isAuthenticated is not a function');
      throw new UnauthorizedException('Authentication not initialized');
    }

    const isAuth = request.isAuthenticated();
    console.log('Is authenticated result:', isAuth);

    if (!isAuth) {
      throw new UnauthorizedException('You are not logged in');
    }

    return true;
  }
}
