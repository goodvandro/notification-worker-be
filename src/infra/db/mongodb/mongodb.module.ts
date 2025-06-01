import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';

const getMongoUri = (config: ConfigService) => {
  const dbUser = config.get<string>('DB_USER', { infer: true }) || '';
  const dbPass = config.get<string>('DB_PASS', { infer: true }) || '';
  const dbHost = config.get<string>('DB_HOST', { infer: true }) || '';
  const dbPort = config.get<string>('DB_PORT', { infer: true }) || '';
  const dbName = config.get<string>('DB_NAME', { infer: true }) || '';
  const uri = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;
  return uri;
};

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: getMongoUri(config) || '',
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
})
export class MongoModule {}
