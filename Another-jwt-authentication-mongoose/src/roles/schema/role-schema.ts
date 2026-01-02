import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Resource } from '../enums/resource-enums';
import { Action } from '../enums/action-enums';

@Schema()
class Permission {
  @Prop({ required: true, enum: Resource })
  resource: Resource;
  @Prop({ type: [String], required: true, enum: Action })
  actions: Action[];
}

@Schema()
export class Role {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, type: [Permission] })
  permission: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
