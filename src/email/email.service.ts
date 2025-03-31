import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Email } from 'schemas/email.schema';
import { Model } from 'mongoose';

@Injectable()
export class EmailService {

  constructor(
    @InjectModel(Email.name) private emailModel: Model<Email>,
  ) { }


  create(createEmailDto: CreateEmailDto) {
    return 'This action adds a new email';
  }

  async createCode(code: string, email: string) {
    try {
      const newCode = new this.emailModel({ code, status: "pending", email });
      return await newCode.save();
    } catch (error) {
      throw new Error(`Error creating code: ${error.message}`);
    }
  }

  findAll() {
    return this.emailModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} email`;
  }

  update(id: number, updateEmailDto: UpdateEmailDto) {
    return `This action updates a #${id} email`;
  }

  remove(id: number) {
    return `This action removes a #${id} email`;
  }
}
