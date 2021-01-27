import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import * as config from 'config';
import { RefreshTokensRepository } from "./refresh-token.repository";

const jwtConfig = config.get('jwt');

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      }
    }),
    TypeOrmModule.forFeature([UserRepository, RefreshTokensRepository]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy
  ],
  exports: [
    JwtStrategy,
    PassportModule,
  ],
})
export class AuthModule {}
