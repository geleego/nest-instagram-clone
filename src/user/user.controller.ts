import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('list')
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOneBy(@Param() id: string): Promise<User> {
    return await this.userService.findOneBy(id);
  }

  @Post()
  async createUser(@Body() user: CreateUserDTO) {
    return await this.userService.create(user);
  }

  @Patch(':id')
  async updateUser(@Param() id: string, @Body() user: UpdateUserDTO) {
    return await this.userService.update(id, user);
  }

  @Delete(':id')
  async removeUser(@Param() id: string) {
    return await this.userService.remove(id);
  }
}
