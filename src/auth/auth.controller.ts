import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpStatus,
  HttpCode,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, RegisterUserDto } from './dto';
import { AuthGuard } from './guards';
import { UserResponse } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('register')
  register(@Body() user: RegisterUserDto) {
    return this.authService.register(user);
  }

  @Get('users')
  @UseGuards(AuthGuard)
  findAll() {
    return this.authService.findAll();
  }

  @Get('check-token')
  @UseGuards(AuthGuard)
  checkToken(@Request() req: Request) {
    const user = req['user'] as UserResponse;
    return this.authService.checkToken(user);
  }
}
