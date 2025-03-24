import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subscription } from 'schemas/subscriptions.schema';
import { Model } from 'mongoose';
import { Offer } from 'schemas/offers.schema';
import { addMonths, addDays, addYears } from "date-fns";

@Injectable()
export class SubscriptionsService {

  constructor(
    @InjectModel(Subscription.name) private subscriptionModel: Model<Subscription>,
    @InjectModel(Offer.name) private offerModel: Model<Offer>,

  ) { }

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    try {
      const { userId } = createSubscriptionDto;

      const existingSubscription = await this.subscriptionModel.findOne({
        userId,
        status: { $in: ["pending", "active"] },
      });

      if (existingSubscription) {
        return { status: "error", message: "User already has an active or pending subscription." };
      }

      const newSubscription = new this.subscriptionModel({
        ...createSubscriptionDto,
        dateApplied: new Date(),
        status: "pending",
      });

      const savedSubscription = await newSubscription.save();
      return { status: "success", message: "Subscription added successfully", subscription: savedSubscription };
    } catch (error) {
      return { status: "error", message: `Failed to create subscription: ${error.message}` };
    }
  }

  async findAll() {
    return await this.subscriptionModel.find().sort({ _id: -1 }).exec();
  }

  async findOne(subscriptionId: string) {
    try {

      const Subscription = await this.subscriptionModel.findById(subscriptionId).exec();

      if (!Subscription) {
        throw new NotFoundException('Subscription not found');
      }

      return Subscription;
    } catch (error) {
      throw new BadRequestException('Error during Subscription retrieval');
    }
  }

  async findByUserId(userId: string) {
    try {

      const Subscription = await this.subscriptionModel.findOne({ userId }).exec();

      if (!Subscription) {
        throw new NotFoundException('Subscription not found');
      }

      return Subscription;
    } catch (error) {
      throw new BadRequestException('Error during Subscription retrieval');
    }
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    try {
      const updatedSubscription = await this.subscriptionModel.findByIdAndUpdate(
        id,
        updateSubscriptionDto,
        { new: true, runValidators: true }
      );

      if (!updatedSubscription) {
        throw new NotFoundException(`Subscription with ID ${id} not found`);
      }

      return { message: 'Subscription updated successfully', Subscription: updatedSubscription };
    } catch (error) {
      throw new BadRequestException(`Failed to update Subscription: ${error.message}`);
    }
  }

  async acceptMembership(subscriptionId: string) {
    try {
      const subscriptionInformation = await this.subscriptionModel.findById(subscriptionId);
      if (!subscriptionInformation) {
        throw new NotFoundException(`Subscription with ID ${subscriptionId} not found`);
      }

      const offerInformation = await this.offerModel.findById(subscriptionInformation.offerId);
      if (!offerInformation) {
        throw new NotFoundException(`Offer with ID ${subscriptionInformation.offerId} not found`);
      }

      const startDate = new Date();
      let endDate: Date;

      switch (offerInformation.name) {
        case "daily":
          endDate = addDays(startDate, 1);
          break;
        case "monthly":
          endDate = addMonths(startDate, 1);
          break;
        default:
          endDate = addYears(startDate, 1);
          break;
      }

      const updatedSubscription = await this.subscriptionModel.findByIdAndUpdate(
        subscriptionId,
        {
          status: "active",
          startDate,
          endDate,
        },
        { new: true, runValidators: true }
      );

      if (!updatedSubscription) {
        throw new NotFoundException(`Subscription with ID ${subscriptionId} not found after update`);
      }

      return { message: "Subscription updated successfully", subscription: updatedSubscription };
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw new BadRequestException(`Failed to update subscription: ${error.message}`);
    }
  }

  async cancelMembership(subscriptionId: string) {
    try {
      const subscriptionInformation = await this.subscriptionModel.findById(subscriptionId);
      if (!subscriptionInformation) {
        throw new NotFoundException(`Subscription with ID ${subscriptionId} not found`);
      }

      const updatedSubscription = await this.subscriptionModel.findByIdAndUpdate(
        subscriptionId,
        {
          status: "expired",
        },
        { new: true, runValidators: true }
      );

      if (!updatedSubscription) {
        throw new NotFoundException(`Subscription with ID ${subscriptionId} not found after update`);
      }

      return { message: "Subscription updated successfully", subscription: updatedSubscription };
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw new BadRequestException(`Failed to update subscription: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      const deletedSubscription = await this.subscriptionModel.findByIdAndDelete(id);

      if (!deletedSubscription) {
        throw new NotFoundException(`Subscription with ID ${id} not found`);
      }

      return { message: 'Subscription removed successfully', Subscription: deletedSubscription };
    } catch (error) {
      throw new BadRequestException(`Failed to remove Subscription: ${error.message}`);
    }
  }
}
