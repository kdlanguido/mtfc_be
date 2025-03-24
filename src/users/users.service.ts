import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

  async register(registerUserDto: RegisterUserDto) {
    const { email, password } = registerUserDto;

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      ...registerUserDto,
      password: hashedPassword,
    });

    try {
      await newUser.save();
      return { message: 'User registered successfully', userId: newUser._id };
    } catch (error) {
      throw new BadRequestException('Error registering user');
    }
  }

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(userId: string) {

    try {
      const User = await this.userModel.findById(userId).exec();

      if (!User) {
        throw new NotFoundException('User not found');
      }

      return User;
    } catch (error) {
      throw new BadRequestException('Error during user retrieval');
    }
  }

  async authLogin(email: string, password: string) {
    try {
      const user = await this.userModel.findOne({ email }).exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new BadRequestException('Invalid credentials');
      }

      return user;
    } catch (error) {
      throw new BadRequestException('Error during user authentication');
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      const response = await this.userModel.findByIdAndUpdate(userId, updateUserDto, {
        new: true,
        runValidators: true,
      });

      if (!response) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      return { message: 'User updated successfully', user: response };
    } catch (error) {
      throw new BadRequestException(error.message || 'Error updating user');
    }
  }

  async remove(userId: string) {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(userId);

      if (!deletedUser) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      return { message: 'User deleted successfully', user: deletedUser };
    } catch (error) {
      throw new BadRequestException(error.message || 'Error deleting user');
    }
  }

}
