import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { User } from 'src/domain/user/entities/user.entity';
import { UserRepository } from 'src/domain/user/repositories/user.repository';
import { RegisterDTO } from '../dto/register.dto';

export class RegisterUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ username, password }: RegisterDTO): Promise<User> {
    const exists = await this.userRepository.findByUsername(username);
    if (exists) throw new ConflictException('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userRepository.create({ id: randomUUID(), username, password: hashedPassword });
  }
}
