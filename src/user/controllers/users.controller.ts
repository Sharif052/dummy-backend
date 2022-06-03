import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  UsePipes,
  UseGuards,
  Param,
  HttpStatus,
  HttpException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { UsersService } from '../services';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserDTO } from '../dto';
import { IUser } from '../interfaces';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import {
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { NullValidationPipe } from '../../common/pipes/null-validator.pipe';

/**
 * User Controller
 */
@ApiTags('User')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('users')
export class UsersController {
  /**
   * Constructor
   * @param {UsersService} usersService
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a user
   * @Body {UserDTO} userDTO
   * @returns {Promise<IUser>} created user data
   */
  @ApiOperation({ summary: 'User registration: create new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return new user.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_ACCEPTABLE,
    description: 'Record already exist',
  })
  @UsePipes(new NullValidationPipe())
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @Post()
  public async register(@Body() userDTO: UserDTO): Promise<IUser> {
    try {
      return await this.usersService.register(userDTO);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':email')
  public async findOne(@Param('email') email: string,) {
    try {
      return await this.usersService.findOne(email);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiExcludeEndpoint()
  @Put()
  public apiPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch()
  public apiPatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete()
  public apiDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }
}
