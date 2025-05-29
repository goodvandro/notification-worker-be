import { ConflictException } from '@nestjs/common';
import { UserRepository } from 'src/domain/repositories/user.repository';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { User } from 'src/domain/entities/user.entity';

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(username: string, password: string): Promise<User> {
    const exists = await this.userRepository.findByUsername(username);
    if (exists) throw new ConflictException('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userRepository.create({ id: randomUUID(), username, password: hashedPassword });
  }
}
