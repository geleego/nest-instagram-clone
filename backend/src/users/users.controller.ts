import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post('signup')
  async create(@Body() user: CreateUserDTO) {
    const { email, phoneNumber, nickname } = user;

    // 동일 email 검사
    const hasEmail = await this.usersService.findByEmail(email);
    if (hasEmail) {
      throw new BadRequestException('이미 사용중인 이메일 입니다.');
    }

    // 동일 핸드폰 번호 검사
    const hasPhoneNumber = await this.usersService.findByPhoneNumber(phoneNumber);
    if (hasPhoneNumber) {
      throw new BadRequestException('이미 사용중인 핸드폰 번호 입니다.');
    }

    // 동일 닉네임 검사
    const hasNickname = await this.usersService.findByNickname(nickname);
    if (hasNickname) {
      throw new BadRequestException('이미 사용중인 닉네임 입니다.');
    }

    return await this.usersService.create(user);
  }

  @Post('signin')
  async login(@Body('email') email: string, @Body('password') password: string) {
    const user = await this.usersService.validateUser(email, password);
    if (!user) {
      throw new BadRequestException('잘못된 자격증명입니다.');
    }
    return user;
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDTO) {
    return await this.usersService.update(id, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
