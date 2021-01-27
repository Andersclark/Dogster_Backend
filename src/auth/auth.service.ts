import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService} from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';
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
const REFRESH_TOKEN_LIFETIME =
  60 * //seconds/
  60 * // minutes
  24 * // hours
  7; // days

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
    const payload = { userId: user.id };
    const authToken = await this.jwtService.signAsync(
      { ...payload },
      BASE_TOKEN_OPTIONS,
    );
    const refreshToken = await this.makeRefreshToken(user.id);
    return { authToken, refreshToken };
  }
  public async refresh(tokens: JwtDto) {
    const refreshToken = this.jwtService.decode(tokens.refreshToken);
    const tokensAreValid = await this.verifyTokens(tokens);
    const tokenIdsMatch = await this.matchTokenIds(tokens);
    const refreshTokenMatchesStoredVersion = await this.matchTokenToDB(tokens);
    console.log(
      'refresh token match stored version: ',
      refreshTokenMatchesStoredVersion,
    );
    if (tokensAreValid && tokenIdsMatch && refreshTokenMatchesStoredVersion) {
      const newTokens = new JwtDto();
      const authPayload = { userId: refreshToken['userId'] };
      newTokens.authToken = await this.jwtService.signAsync(
        { ...authPayload },
        BASE_TOKEN_OPTIONS,
      );
      newTokens.refreshToken = await this.makeRefreshToken(
        refreshToken['userId'],
      );

      //TODO: Invalidate older refreshtokens for user
      return newTokens;
    } else {
      return false;
    }
  }
  private async verifyTokens(tokens: JwtDto): Promise<boolean> {
    const verifyOptions = { ignoreExpiration: false };
    return !!(
      (await this.jwtService.verifyAsync(tokens.refreshToken, verifyOptions)) &&
      (await this.jwtService.verify(tokens.authToken, verifyOptions))
    );
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
      storedRefreshToken.userId === Number(clientRefreshToken['userId']);
    const storedRefreshTokenIsNotExpired =
      storedRefreshToken.expires.valueOf() > Date.now();

    return (
      !storedRefreshToken.isRevoked &&
      userIdsMatch &&
      storedRefreshTokenIsNotExpired
    );
  }
  private async makeRefreshToken(userID: number): Promise<string> {
    const refreshToken = new RefreshToken();
    refreshToken.userId = userID;
    refreshToken.isRevoked = false;
    refreshToken.expires = new Date(Date.now() + REFRESH_TOKEN_LIFETIME);
    await this.refreshTokenRepository.revokeTokenForUser(userID)
    await refreshToken.save();


    const jwtOptions: SignOptions = {
      ...BASE_TOKEN_OPTIONS,
      expiresIn: REFRESH_TOKEN_LIFETIME,
      subject: String(userID),
      jwtid: String(refreshToken.id),
    };
    return this.jwtService.signAsync({ ...refreshToken }, jwtOptions);
  }
}
