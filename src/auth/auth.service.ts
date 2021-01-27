import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { SignOptions } from "jsonwebtoken";
import { UserRepository } from "./user.repository";
import { AuthCredentialsDTO } from "./dto/auth-credentials.dto";
import { RefreshToken } from "./refresh-token.entity";
import { RefreshTokensRepository } from "./refresh-token.repository";
import { User } from "./user.entity";
import { RefreshTokenDTO } from "./dto/refresh-token.dto";


const BASE_TOKEN_OPTIONS: SignOptions = {
  issuer: 'Dogster Labs',
  audience:'https://dogster.com',
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(RefreshTokensRepository)
    private refreshTokenRepository: RefreshTokensRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.userRepository.signUp(authCredentialsDTO)
  }

  async signIn(authCredentialsDTO: AuthCredentialsDTO): Promise<{ authToken: string, refreshToken: string }> {
    const username = await this.userRepository.validateUserPassword(authCredentialsDTO);
    if (!username) {
      throw new UnauthorizedException()
    }
    const user = await this.userRepository.findOne({ username })
    const payload = { userId: user.id };
    const authToken = await this.jwtService.signAsync({ payload });
    const refreshToken = await this.makeRefreshToken(user)
    return { authToken,  refreshToken };
  }

  async refresh(tokens: RefreshTokenDTO) {

    const decodedTokens = {
      refreshToken: this.jwtService.decode(tokens.refreshToken),
      authToken: this.jwtService.decode(tokens.authToken)
    }
    console.dir(decodedTokens)

    // check if the jwt token is valid
    // [X]The Authorization Server MUST validate the Refresh Token,
    // and must verify that the Client successfully authenticated it has a Client Authentication method.
    const tokensAreValid = await this.verifyTokens(tokens);
    console.log('tokens are valid: ', tokensAreValid);

    // check if the refresh token exists and is linked to that auth token
    // MUST verify that it was issued to the Client,
    const tokenIdsMatch = await this.matchTokenIds(tokens)
    console.log('TOKEN ID:s MATCH: ', tokenIdsMatch);
    //const tokenMatchesStoredVersion = this.matchTokenToDB(tokens)
    return String(tokensAreValid)


    /*
    {
    token: {
      userId: 3,
      isRevoked: false,
      expires: '2021-01-26T11:13:50.726Z',
      id: 16
    },
    jwtOptions: {
      issuer: 'Dogster Labs',
      audience: 'https://dogster.com',
      subject: '3',
      jwtid: '16'
    },
  iat: 1611659630,
  exp: 1611663230
}
*/

    // check if the authToken has expired

    // check if the refreshToken has expired

    // check if the refresh token has already been used

    // check if refreshToken is tied to the requesting user.

    // check if the refresh token has been invalidated



    /*RESPONSE should have shape of:
    {
   "access_token": "TlBN45jURg",
   "token_type": "Bearer",
   "refresh_token": "9yNOxJtZa5",
   "expires_in": 3600
  }
    * */
  }
getJwtId(token: string) {
  const decodedToken = this.jwtService.decode(token);
  return decodedToken["token"]["id"];
}

async verifyTokens(tokens: RefreshTokenDTO): Promise<boolean> {
  const verifyOptions = { ignoreExpiration: false }
  return !!(await this.jwtService.verifyAsync(tokens.refreshToken, verifyOptions) && await this.jwtService.verify(tokens.authToken, verifyOptions));
}
async matchTokenIds(tokens: RefreshTokenDTO): Promise<boolean> {
  const decodedRefreshToken = this.jwtService.decode(tokens.refreshToken)
  const decodedAuthToken = this.jwtService.decode(tokens.authToken)
  return decodedRefreshToken["token"]["userId"] === decodedAuthToken["payload"]["userId"]
}
async matchTokenToDB(tokens: RefreshTokenDTO) {
  const refreshToken = this.jwtService.decode(tokens.refreshToken);
  console.log('client', refreshToken);
  const jwtId = this.getJwtId(tokens.refreshToken);
  const storedRefreshToken = await this.refreshTokenRepository.findTokenById(jwtId);
  console.log('stored', storedRefreshToken);
}
async makeRefreshToken(user: User): Promise<string>{
  const token = new RefreshToken()
  token.userId = user.id;
  token.isRevoked = false;
  token.expires = new Date(); // TODO: Add lifetime
  await token.save();

  const jwtOptions: SignOptions = {
    ...BASE_TOKEN_OPTIONS,
    subject: String(user.id),
    jwtid: String(token.id),
  };
  return this.jwtService.signAsync({ token, jwtOptions })
}



}
