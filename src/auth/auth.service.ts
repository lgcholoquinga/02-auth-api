import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';

import { User } from './entities';
import { CreateUserDto, LoginUserDto, RegisterUserDto } from './dto';
import {
  JwtPayload,
  LoginResponse,
  RegisterUser,
  UserResponse,
} from './interfaces';
import { getUserResponse, getUsersResponse } from './adapters';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Method for create new user
   * @param createUserDto Objet with properties for register user
   * @returns Promise of type User
   */
  public async create(createUserDto: CreateUserDto): Promise<RegisterUser> {
    try {
      const { password, ...userData } = createUserDto;
      const user = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData,
      });

      const response = await user.save();

      return {
        user: getUserResponse(response),
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} already exists.`);
      }

      throw new InternalServerErrorException('Something terrible happen.');
    }
  }

  /**
   * Method for login user in the app
   * @param loginUserDto Object with credentials for login
   * @returns Object
   */
  public async login(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email });
    console.log(typeof user);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }

    if (!bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const token = await this.getJWTToken({ id: user._id.toString() });

    return {
      user: getUserResponse(user),
      token,
    };
  }

  /**
   * Method that permite register a new user
   * @param user Object with values for register process
   * @returns Object
   */
  public async register(user: RegisterUserDto): Promise<RegisterUser> {
    const newUser = await this.create({
      email: user.email,
      name: user.name,
      password: user.password,
    });

    const token = await this.getJWTToken({ id: newUser.user.id });
    return {
      ...newUser,
      token,
    };
  }

  /**
   *
   * @returns
   */
  public async findAll(): Promise<UserResponse[]> {
    try {
      const usersDB = await this.userModel.find();
      return getUsersResponse(usersDB);
    } catch {
      throw new InternalServerErrorException('Something terrible happen.');
    }
  }

  /**
   * Method that permit a get user by id
   * @param id Identifier unique of the user
   * @returns Object with user data
   */
  public async findUserById(id: string): Promise<UserResponse> {
    const user = await this.userModel.findById(id);
    return getUserResponse(user);
  }

  /**
   * Method that permit check token
   * @param user Object with user properties
   * @returns Object with data of process
   */
  public async checkToken(user: UserResponse): Promise<LoginResponse> {
    const token = await this.getJWTToken({ id: user.id });
    return {
      user,
      token,
    };
  }

  /**
   * Method that permit generate a JTW token value
   * @param payload Object with data for payload
   * @returns Token value in JWT format
   */
  private async getJWTToken(payload: JwtPayload) {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }
}
