import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Logger,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '..auth/guards/access_token.guard';
// import { RoleAllowed } from '..auth/guards/role-decorator';
// import { RolesGuard } from '..auth/guards/role-guard';
import {
  FindUserDto,
  UpdateUserByIdDto,
  UpdateUserPermissionBodyDto,
  UserSignupDto,
  // FieldsToUpdateDto,
} from './dto/user-request.dto';
import { UserSignupResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';
// import { User } from '../auth/guards/user';
import {
  NO_ENTITY_FOUND,
  UNAUTHORIZED_REQUEST,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from 'src/app.constants';
// import { UserRoles } from '@nestjs/common';

@ApiBearerAuth('authorization')
@Controller('users')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)
@ApiTags('users')
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly logger: Logger,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: UserSignupResponseDto,
    description: 'user created successfully',
  })
  @ApiOkResponse({ type: UserSignupResponseDto, description: '' })
  @ApiOperation({ description: 'user create api' })
  @ApiConsumes('application/json')
  @Post('')
  public async createUser(@Body() body: UserSignupDto) {
    console.info(JSON.stringify(body));
    return this.service.create(body);
  }

  // @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserSignupResponseDto, description: '' })
  @ApiOperation({ description: 'user fetched api' })
  @ApiConsumes('application/json')
  @Get('/profile')
  public async fetehUser(@Param() param: UserSignupDto) {
    this.logger.log(JSON.stringify(param));
    return this.service.create(param);
  }

  // @RoleAllowed(UserRoles['sytem-admin'])
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOkResponse({ description: 'user returned Successfully' })
  @ApiOperation({ description: 'Get all users' })
  @ApiConsumes('application/json')
  @HttpCode(HttpStatus.OK)
  @Get('/profile')
  public async allUsers(@Param() param: UserSignupDto) {
    this.logger.log(JSON.stringify(param));
    return this.service.create(param);
  }
}
