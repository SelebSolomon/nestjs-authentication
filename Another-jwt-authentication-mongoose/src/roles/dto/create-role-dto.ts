import { Type } from 'class-transformer';
import { ArrayUnique, IsEnum, IsString, ValidateNested } from 'class-validator';
import { Resource } from '../enums/resource-enums';
import { Action } from '../enums/action-enums';

export class CreateRoleDTO {
  @IsString()
  name: string;
  @ValidateNested()
  @Type(() => Permission)
  permission: Permission[];
}

export class Permission {
  @IsEnum(Resource)
  resource: Resource;

  @IsEnum(Action, { each: true })
  @ArrayUnique()
  actions: Action[];
}
