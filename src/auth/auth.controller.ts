import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { AuthCredentialsDTO } from "./dto/auth-credentials.dto";
import { AuthService } from "./auth.service";
import { JwtDto }  from "./dto/jwt.dto";

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
  refreshToken(@Body(ValidationPipe) tokens: JwtDto) {
    return this.authService.refresh(tokens)
  }
}
