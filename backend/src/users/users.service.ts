import { BadRequestException, HttpStatus, Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm/index';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  /**
   * 전체 유저 리스트 조회
   */
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * 특정 유저 조회
   * @param id
   */
  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id: id });
  }

  /**
   * 유저 생성
   * @param user
   */
  async create(user: CreateUserDTO): Promise<any> {
    const isUser = await this.usersRepository.findOneBy({ email: user.email });

    if (isUser) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: [`이미 등록된 사용자입니다.`],
        error: 'Forbidden'
      })
    }

    user.password = await bcrypt.hash(user.password, 10);
    const { password, ...result } = await this.usersRepository.save(user);
    return result;
  }

  /**
   * 유저 수정
   * @param id
   * @param user
   */
  async update(id: number, user: UpdateUserDTO): Promise<void> {
    const prevUser = await this.usersRepository.findOneBy({ id: id });
    let userToUpdate = {...prevUser, ...user};
    await this.usersRepository.save(userToUpdate);
  }

  /**
   * 유저 삭제
   * @param id
   */
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete({ id: id });
  }

  /**
   * 동일 이메일 검사
   * @param email
   */
  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: {email},
      withDeleted: true
    })

    if (user) {
      throw new BadRequestException('이미 생성된 유저입니다.');
    }

    return user;
  }

  /**
   * 비밀번호 암호화
   * @param password
   */
  async hashPassword(password: string) {
    return await bcrypt.hash(password, 11);
  }
}
