import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService} from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { UserRepository } from './user.repository';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { RefreshToken } from './refresh-token.entity';
import { RefreshTokensRepository } from './refresh-token.repository';
import { JwtDto } from './dto/jwt.dto';

const BASE_TOKEN_OPTIONS: SignOptions = {
  issuer: 'Dogster Labs', //TODO: Add actual registration name
  audience: 'https://dogster.com', //TODO: Add actual domain
  algorithm: 'HS256', //default
  expiresIn: 3600, //seconds
};
const REFRESH_TOKEN_LIFETIME = 604800 // seconds = one week

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(RefreshTokensRepository)
    private refreshTokenRepository: RefreshTokensRepository,
    private jwtService: JwtService,
  ) {}

  public async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.userRepository.signUp(authCredentialsDTO);
  }

  public async signIn(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ authToken: string; refreshToken: string }> {
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDTO,
    );
    if (!username) {
      throw new UnauthorizedException();
    }
    const user = await this.userRepository.findOne({ username });
    if(user) {
      const authToken = await this.makeAuthToken(user.id);
      const refreshToken = await this.makeRefreshToken(user.id);
      return { authToken, refreshToken }
    }
  }
  public async refresh(tokens: JwtDto) {
    const refreshToken = this.jwtService.decode(tokens.refreshToken);
    const tokensAreValid = await this.verifyTokens(tokens);
    const tokenIdsMatch = await this.matchTokenIds(tokens);
    const refreshTokenMatchesStoredVersion = await this.matchTokenToDB(tokens);

    if (tokensAreValid && tokenIdsMatch && refreshTokenMatchesStoredVersion) {
      const newTokens = new JwtDto();
      const userId = refreshToken['userId'];
      newTokens.authToken = await this.makeAuthToken(userId)
      newTokens.refreshToken = await this.makeRefreshToken(userId);
      return newTokens;
    } else return false;
  }
  private verifyTokens(tokens: JwtDto): boolean {
    const verifyOptions = { ignoreExpiration: false };
    let result;
    try {
      result = !!(
        (this.jwtService.verify(tokens.refreshToken, verifyOptions)) &&
        (this.jwtService.verify(tokens.authToken, verifyOptions))
      );
    } catch(error){
     return error
    }
    // TODO: Try-Catch JsonWebTokenError
    // https://www.npmjs.com/package/jsonwebtoken
    return result;
  }
  private async matchTokenIds(tokens: JwtDto): Promise<boolean> {
    const decodedRefreshToken = this.jwtService.decode(tokens.refreshToken);
    const decodedAuthToken = this.jwtService.decode(tokens.authToken);
    return decodedRefreshToken['userId'] === decodedAuthToken['userId'];
  }
  private async matchTokenToDB(tokens: JwtDto): Promise<boolean> {
    const clientRefreshToken = await this.jwtService.decode(
      tokens.refreshToken,
    );
    const storedRefreshToken = await this.refreshTokenRepository.findTokenById(
      clientRefreshToken['id'],
    );
    const userIdsMatch =
      storedRefreshToken.userId === clientRefreshToken['userId'];
    const storedRefreshTokenIsNotExpired =
      storedRefreshToken.expires.valueOf() > Date.now();

    return (
      !storedRefreshToken.isRevoked &&
      userIdsMatch &&
      storedRefreshTokenIsNotExpired
    );
  }
  private async makeRefreshToken(userId: string): Promise<string> {

    const refreshToken = new RefreshToken();
    refreshToken.id = uuid()
    refreshToken.userId = userId;
    refreshToken.isRevoked = false;
    refreshToken.expires = new Date(Date.now() + REFRESH_TOKEN_LIFETIME);
    await this.refreshTokenRepository.revokeTokenForUser(userId)
    await refreshToken.save();


    const jwtOptions: SignOptions = {
      ...BASE_TOKEN_OPTIONS,
      expiresIn: REFRESH_TOKEN_LIFETIME,
      subject: String(userId),
      jwtid: String(refreshToken.id),
    };
    return this.jwtService.signAsync({ ...refreshToken }, jwtOptions);
  }

  private async makeAuthToken(userId: string): Promise<string> {
    const authPayload = { userId };
    return this.jwtService.signAsync(
      { ...authPayload },
      BASE_TOKEN_OPTIONS,
    );
  }
}
