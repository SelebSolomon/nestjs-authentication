import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schema/role-schema';
import { Model } from 'mongoose';
import { CreateRoleDTO } from './dto/create-role-dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  async createRole(role: CreateRoleDTO) {
    const createdRole = this.roleModel.create(role);
    return createdRole;
  }

  async getRoleById(roleId) {
    return await this.roleModel.findById(roleId);
  }
}
