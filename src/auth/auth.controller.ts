import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { AuthCredentialsDTO } from "./dto/auth-credentials.dto";
import { AuthService } from "./auth.service";
import { RefreshTokenDTO } from "./dto/refresh-token.dto";

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {
  }
  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredentialsDTO: AuthCredentialsDTO) {
    return this.authService.signUp(authCredentialsDTO);
  }
  @Post('/login')
  signIn(@Body(ValidationPipe) authCredentialsDTO: AuthCredentialsDTO): Promise<{authToken: string, refreshToken: string}> {
    return this.authService.signIn(authCredentialsDTO);
  }
  @Post('/refresh')
  //https://openid.net/specs/openid-connect-core-1_0.html#RefreshTokenResponse
  // TODO: Conform response to OpenID2.0-standard
  refreshToken(@Body(ValidationPipe) tokens: RefreshTokenDTO) {
    console.log('IN: ', Date.now());
    console.log(`\n\nREFRESHTOKEN: ${tokens.refreshToken} \n\n AUTHTOKEN: ${tokens.authToken}\n\n`);
    const result = this.authService.refresh(tokens)  ? 'SUCCESS' : 'FAIL';
    console.log('OUT: ', Date.now());
    return result
  }
}
