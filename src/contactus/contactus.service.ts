import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactusDto } from './dto/create-contactus.dto';
import { UpdateContactusDto } from './dto/update-contactus.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ContactUs } from 'schemas/contactUs.schema';
import { Model } from 'mongoose';

@Injectable()
export class ContactusService {

  constructor(@InjectModel(ContactUs.name) private contactUsModel: Model<ContactUs>) { }

  create(createContactusDto: CreateContactusDto) {
    const newProduct = new this.contactUsModel(createContactusDto);
    return newProduct.save();
  }

  findAll() {
    return this.contactUsModel.find().sort({ _id: -1 }).exec();
  }

  async findOne(feedbackId: string) {
    try {

      const Product = await this.contactUsModel.findById(feedbackId).exec();

      if (!Product) {
        throw new NotFoundException('Product not found');
      }

      return Product;

    } catch (error) {
      throw new BadRequestException('Error during product retrieval');
    }
  }

  async update(id: string, updateContactusDto: UpdateContactusDto) {
    try {
      const updatedProduct = await this.contactUsModel.findByIdAndUpdate(
        id,
        updateContactusDto,
        {
          new: true,
          runValidators: true,
        }
      ).exec();

      if (!updatedProduct) {
        throw new Error(`Product with id ${id} not found`);
      }

      return updatedProduct;
    } catch (error) {
      throw new BadRequestException('Error during user retrieval');
    }
  }

  async remove(id: string) {
    try {
      const deletedProduct = await this.contactUsModel.findByIdAndDelete(id).exec();

      if (!deletedProduct) {
        throw new Error(`Feedback with id ${id} not found`);
      }

      return deletedProduct;
    } catch (error) {
      throw new BadRequestException('Error during user retrieval');
    }
  }
}
