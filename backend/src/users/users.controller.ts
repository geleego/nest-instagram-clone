import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post('signin')
  async createUser(@Body() user: CreateUserDTO) {
    // 동일 email 검사
    await this.usersService.findOneByEmail(user.email);

    // password 암호화
    const hashPassword = await this.usersService.hashPassword(user.password);
    user.password = hashPassword;

    return await this.usersService.create(user);
  }

  @Patch(':id')
  async updateUser(@Param() id: number, @Body() user: UpdateUserDTO) {
    return await this.usersService.update(id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
