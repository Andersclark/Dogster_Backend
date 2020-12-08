import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthCredentialsDTO } from "./dto/auth-credentials.dto";
import { JwtService } from "@nestjs/jwt";
import { JWTPayload } from "./jwt-payload.interface";

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService')
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.userRepository.signUp(authCredentialsDTO)
  }
  async signIn(authCredentialsDTO: AuthCredentialsDTO): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(authCredentialsDTO);
    if (!username) {
      throw new UnauthorizedException()
    }
    const payload = { username };
    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(`Generated JWT-token with payload ${JSON.stringify(payload)}`)
    return { accessToken };
  }
}
