import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.getUserByUsername(createUserDto.username);
    if (user) {
      throw new NotFoundException('User already exists');
    }

    return this.userModel.create(createUserDto);
  }

  async getUserByUsername(username: string) {
    return await this.userModel.findOne({
      username,
    });
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userModel.findOne({
      username: loginUserDto.username,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const validate = this.comparePassword(loginUserDto.password, user.password);
    if (!validate) {
      throw new NotFoundException('Invalid password');
    }

    const JWTtoken = this.jwtService.sign({
      username: user.username,
      sub: user._id,
    });

    const payload = {
      username: user.username,
      sub: user._id,
      JWTtoken,
    };

    return payload;
  }

  findAll() {
    return `You can't see all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  // hash the password before saving it to the database.
  async hashPassword(password: string) {
    return await bcrypt.hash(password, 5);
  }

  // compare the password with the hashed password in the database.
  async comparePassword(attempt: string, password: string) {
    return await bcrypt.compare(attempt, password);
  }
}
