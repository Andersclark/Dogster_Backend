import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from "@nestjs/common";
import { AuthCredentialsDTO } from "./dto/auth-credentials.dto";
import { AuthService } from "./auth.service";

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

  @Post('/signin')
  signIn(@Body(ValidationPipe) authCredentialsDTO: AuthCredentialsDTO): Promise<{accessToken: string}> {
    return this.authService.signIn(authCredentialsDTO);
  }

}
