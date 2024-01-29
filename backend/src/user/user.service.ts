import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm/index';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  /**
   * 전체 유저 리스트 조회
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  /**
   * 특정 유저 조회
   * @param id
   */
  async findOneBy (id: string): Promise<User> {
    return await this.userRepository.findOneBy({ userId: id });
  }

  /**
   * 유저 생성
   * @param user
   */
  async create(user: CreateUserDTO) {
    return await this.userRepository.save(user);
  }

  /**
   * 유저 수정
   * @param user
   */
  async update(id: string, user: UpdateUserDTO): Promise<void> {
    const prevUser = await this.userRepository.findOneBy({ userId: id });
    let userToUpdate = {...prevUser, ...user};
    await this.userRepository.save(userToUpdate);
  }

  /**
   * 유저 삭제
   */
  async remove(id: string): Promise<void> {
    await this.userRepository.delete({ userId: id });
  }
}
