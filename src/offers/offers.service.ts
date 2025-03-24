import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Offer } from 'schemas/offers.schema';
import { Model } from 'mongoose';

@Injectable()
export class OffersService {

  constructor(
    @InjectModel(Offer.name) private offerModel: Model<Offer>,
  ) { }

  async create(createOfferDto: CreateOfferDto) {
    try {
      const newOffer = new this.offerModel(createOfferDto);
      const savedOffer = await newOffer.save();
      return { message: 'Offer added successfully', offer: savedOffer };
    } catch (error) {
      throw new BadRequestException('Failed to create offer', error.message);
    }
  }


  async findAll() {
    return await this.offerModel.find().sort({ _id: -1 }).exec();
  }

  async findOne(offerId: string) {
    try {

      const Product = await this.offerModel.findById(offerId).exec();

      if (!Product) {
        throw new NotFoundException('Product not found');
      }

      return Product;

    } catch (error) {
      throw new BadRequestException('Error during product retrieval');
    }
  }

  async findBySport(sport: string) {
    try {

      const Product = await this.offerModel.find({ sport }).exec();

      if (!Product) {
        throw new NotFoundException('Product not found');
      }

      return Product;

    } catch (error) {
      throw new BadRequestException('Error during product retrieval');
    }
  }

  async update(id: string, updateOfferDto: UpdateOfferDto) {
    try {
      const updatedOffer = await this.offerModel.findByIdAndUpdate(
        id,
        updateOfferDto,
        { new: true, runValidators: true }
      );

      if (!updatedOffer) {
        throw new NotFoundException(`Offer with ID ${id} not found`);
      }

      return { message: 'Offer updated successfully', offer: updatedOffer };
    } catch (error) {
      throw new BadRequestException(`Failed to update offer: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      const deletedOffer = await this.offerModel.findByIdAndDelete(id);

      if (!deletedOffer) {
        throw new NotFoundException(`Offer with ID ${id} not found`);
      }

      return { message: 'Offer removed successfully', offer: deletedOffer };
    } catch (error) {
      throw new BadRequestException(`Failed to remove offer: ${error.message}`);
    }
  }
}
