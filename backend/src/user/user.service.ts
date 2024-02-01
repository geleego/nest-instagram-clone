import { BadRequestException, HttpStatus, Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm/index';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  /**
   * 전체 유저 리스트 조회
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'userId', 'name']
    });
  }

  /**
   * 특정 유저 조회
   * @param id
   */
  async findOneBy(id: string): Promise<User> {
    return this.userRepository.findOneBy({ userId: id });
  }

  /**
   * 유저 생성
   * @param user
   */
  async create(user: CreateUserDTO): Promise<any> {
    const isUser = await this.userRepository.findOneBy({ userId: user.userId });
    if (isUser) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: [`이미 등록된 사용자입니다.`],
        error: 'Forbidden'
      })
    }

    user.password = await bcrypt.hash(user.password, 10);
    const { password, ...result } = await this.userRepository.save(user);
    return result;
  }

  /**
   * 유저 수정
   * @param id
   * @param user
   */
  async update(id: string, user: UpdateUserDTO): Promise<void> {
    const prevUser = await this.userRepository.findOneBy({ userId: id });
    let userToUpdate = {...prevUser, ...user};
    await this.userRepository.save(userToUpdate);
  }

  /**
   * 유저 삭제
   * @param id
   */
  async remove(id: string): Promise<void> {
    await this.userRepository.delete({ userId: id });
  }

  /**
   * 비밀번호 암호화
   * @param password
   */
  async hashPassword(password: string) {
    return await bcrypt.hash(password, 11);
  }

  /**
   * 동일 이메일 검사
   * @param email
   */
  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {email},
      withDeleted: true
    })

    if (user) {
      throw new BadRequestException('이미 생성된 유저입니다.');
    }

    return user;
  }
}
