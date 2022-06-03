import {
  Injectable,
  HttpStatus,
  HttpException,
  NotAcceptableException, NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserDTO } from '../dto';
import { IUser } from '../interfaces';

/**
 * User Service
 */
@Injectable()
export class UsersService {
  /**
   * Constructor
   * @param {Model<IUser>} userModel
   */
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<IUser>,
  ) {}

  /**
   * Create a user with RegisterPayload fields
   * @param {UserDTO} userDTO user payload
   * @returns {Promise<IUser>} created user data
   */
  async register(userDTO: UserDTO): Promise<IUser> {
    try {
      userDTO.email = userDTO.email.toLowerCase();
      const isUserExist = await this.userModel.findOne({
        email: userDTO.email,
      });
      if (isUserExist) {
        return Promise.reject(
          new NotAcceptableException(
            `User already exist with the ${userDTO.email}`,
          ),
        );
      }
      userDTO.password = bcrypt.hashSync(userDTO.password, 8);
      userDTO.cBy = userDTO.email;
      userDTO.cTime = Date.now();

      const registerModel = new this.userModel(userDTO);
      return await registerModel.save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * find user with id
   * @param {string} id
   */
  async findOne(email: string): Promise<IUser> {
    try {
      const userInfo = await this.userModel.findOne({ email: email });

      if (!userInfo) {
        return Promise.reject(
            new NotFoundException(
                `Could not find user.`,
            ),
        );
      }
      return userInfo;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
