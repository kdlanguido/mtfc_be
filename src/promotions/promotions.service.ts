import { Injectable } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Promotion } from 'schemas/promotion.schema';
import { Model } from 'mongoose';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectModel(Promotion.name) private promotionModel: Model<Promotion>,
  ) {}

  async create(createPromotionDto: CreatePromotionDto) {
    try {
      const createdData = new this.promotionModel(createPromotionDto);
      await createdData.save();
      return {
        message: 'Promotion added successfully.',
        status: 201,
      };
    } catch (error) {
      return {
        message: `There has been a problem adding promotions, ${error}`,
        status: 500,
      };
    }
  }

  async findAnnouncements() {
    try {
      const Promotions = await this.promotionModel
        .find({ promotionType: 'Announcement' })
        .sort({ _id: -1 })
        .exec();
      if (!Promotions) {
        return {
          message: 'No promotions found',
          status: 404,
        };
      }
      return Promotions;
    } catch (error) {
      return {
        message: `There has been a problem fetching promotions, ${error}`,
        status: 500,
      };
    }
  }

  async findAll() {
    try {
      const Promotions = await this.promotionModel
        .find()
        .sort({ _id: -1 })
        .exec();
      if (!Promotions) {
        return {
          message: 'No promotions found',
          status: 404,
        };
      }
      return Promotions;
    } catch (error) {
      return {
        message: `There has been a problem fetching promotions, ${error}`,
        status: 500,
      };
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} promotion`;
  }

  async findByTarget(target: string) {
    try {
      const Promotions = await this.promotionModel
        .find({ target })
        .sort({ _id: -1 })
        .exec();
      if (!Promotions) {
        return {
          message: 'No promotions found',
          status: 404,
        };
      }
      return Promotions;
    } catch (error) {
      return {
        message: `There has been a problem fetching promotions, ${error}`,
        status: 500,
      };
    }
  }

  async findByTitle(title: string) {
    try {
      const Promotions = await this.promotionModel
        .find({ title: { $regex: title, $options: 'i' } })
        .sort({ _id: -1 })
        .exec();
      if (!Promotions) {
        return {
          message: 'No promotions found',
          status: 404,
        };
      }
      return Promotions;
    } catch (error) {
      return {
        message: `There has been a problem fetching promotions, ${error}`,
        status: 500,
      };
    }
  }

  async update(id: string, updatePromotionDto: UpdatePromotionDto) {
    try {
      const updatedPromotion = this.promotionModel
        .findByIdAndUpdate(id, updatePromotionDto, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!updatedPromotion) {
        return {
          message: 'There has been a problem updating promotions',
          status: 500,
        };
      }

      return {
        message: 'Promotion updated successfully',
        status: 201,
      };
    } catch (error) {
      return {
        message: `There has been a problem updating promotions, ${error}`,
        status: 500,
      };
    }
  }

  async remove(id: string) {
    try {
      const deletedPromotion = this.promotionModel.findByIdAndDelete(id).exec();

      if (!deletedPromotion) {
        return {
          message: `There has been a problem deleting promotions`,
          status: 500,
        };
      }
      return {
        message: 'Promotion deleted successfully.',
        status: 201,
      };
    } catch (error) {
      return {
        message: `There has been a problem deleting promotions, ${error}`,
        status: 500,
      };
    }
  }
}
