import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { User } from './user.entity';
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
    return this.usersRepository.findOneBy({ id });
  }

  /**
   * 유저 생성
   * @param user
   */
  async create(user: CreateUserDTO): Promise<any> {
    return this.usersRepository.save(user);
  }

  /**
   * 유저 수정
   * @param id
   * @param user
   */
  async update(id: number, user: UpdateUserDTO): Promise<void> {
    const prevUser = await this.usersRepository.findOneBy({ id });
    let userToUpdate = {...prevUser, ...user};
    await this.usersRepository.save(userToUpdate);
  }

  /**
   * 유저 삭제
   * @param id
   */
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete({ id });
  }

  /**
   * 동일 이메일 검사
   * @param email
   */
  async findByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: {email},
    })
  }

  /**
   * 동일 핸드폰 번호 검사
   */
  async findByPhoneNumber(phoneNumber: string) {
    return await this.usersRepository.findOne({
      where: {phoneNumber},
    })
  }

  /**
   * 동일 닉네임 검사
   */
  async findByNickname(nickname: string) {
    return await this.usersRepository.findOne({
      where: {nickname},
    })
  }

  /**
   * 비밀번호 암호화
   * @param password
   */
  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  /**
   * 비밀번호 비교
   * @param plainPassword
   * @param hashedPassword
   */
  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * 사용자 인증
   * @param email
   * @param password
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } } as FindOneOptions<User>);
    const isPasswordValid = await this.comparePassword(password, user.password);

    if (user && isPasswordValid) {
      return user;
    }

    return null;
  }
}
