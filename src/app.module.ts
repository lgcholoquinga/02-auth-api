import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { envs } from './config';

@Module({
  imports: [AuthModule, MongooseModule.forRoot(envs.MONGO_URI)],
  controllers: [],
  providers: [],
})
export class AppModule {}
