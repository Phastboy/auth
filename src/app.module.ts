import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PasswordModule } from './password/password.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [UsersModule, MongooseModule.forRoot('mongodb://127.0.0.1:27017/auth'), AuthModule, PasswordModule, TokenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
