import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/create-user.dto';
import { loginUserDto } from './dto/login-user.dto';
import { JwtAuthService } from './Jwt.service';

@Controller('/api/v1/user')
export class userController {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly userService: UserService,
  ) {}

  @Post('create')
  async create(@Res() response, @Body() createUserDto: createUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return response.status(HttpStatus.OK).json({
        message: 'all users successfully',
        user,
      });
    } catch (error) {
      return response.status(error.status).json(error.response);
    }
  }
  @Post('login')
  async login(@Res() response, @Body() loginUserDto: loginUserDto) {
    try {
      const user = await this.userService.loginUser(loginUserDto);
      const token = await this.jwtAuthService.generateToken(user);
      return response.status(200).json({
        message: 'Login successful',
        access_token: token,
        userId: user.id,
      });
    } catch (error) {
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message || 'An error occurred while login',
        });
    }
  }
  @Post('super_login')
  async getSuperAdmin(@Res() response, @Body() loginUserDto: loginUserDto) {
    try {
      const user = await this.userService.loginSuperAdmin(loginUserDto);
      const token = await this.jwtAuthService.generateToken(user);
      return response.status(200).json({
        message: 'super login successful',
        userId: user.id,
        acesss_token: token,
      });
    } catch (error) {
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message || 'An error occurred while login',
        });
    }
  }
}
