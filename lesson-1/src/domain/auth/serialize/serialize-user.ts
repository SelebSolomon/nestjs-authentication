import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/domain/user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: any, done: Function) {
    console.log('🔵 Serializing user:', user);
    done(null, user.id);
  }

  async deserializeUser(id: string, done: Function) {
    console.log('🟢 Deserializing user with ID:', id);
    try {
      const user = await this.userService.findById(id);
      console.log('🟢 Deserialized user:', user);
      done(null, user);
    } catch (error) {
      console.error('🔴 Deserialize error:', error);
      done(error, null);
    }
  }
}
