import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { Trainer, TrainerDocument } from './../../schemas/trainer.schema';
import { Offer, OfferDocument } from 'schemas/offers.schema';
import {
  Subscription,
  SubscriptionDocument,
} from 'schemas/subscriptions.schema';
import { User, UserDocument } from 'schemas/user.schema';

@Injectable()
export class TrainersService {
  constructor(
    @InjectModel(Trainer.name)
    private readonly trainerModel: Model<TrainerDocument>,
    @InjectModel(Offer.name)
    private readonly offerModel: Model<OfferDocument>,
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createTrainerDto: CreateTrainerDto): Promise<Trainer> {
    try {
      const newTrainer = new this.trainerModel(createTrainerDto);
      return await newTrainer.save();
    } catch (error) {
      throw new BadRequestException('Failed to create trainer');
    }
  }

  async findAll(): Promise<Trainer[]> {
    try {
      return await this.trainerModel.find().sort({ _id: -1 }).exec();
    } catch (error) {
      throw new BadRequestException('Failed to retrieve trainers');
    }
  }

  async findOne(id: string): Promise<Trainer> {
    try {
      const trainer = await this.trainerModel.findById(id).exec();
      if (!trainer) {
        throw new NotFoundException(`Trainer with ID ${id} not found`);
      }
      return trainer;
    } catch (error) {
      throw new BadRequestException('Failed to fetch trainer');
    }
  }

  async findByEmail(email: string): Promise<Trainer[]> {
    try {
      const trainers = await this.trainerModel.find({ email }).exec();

      if (trainers.length === 0) {
        throw new NotFoundException(`No trainers found for email: ${email}`);
      }

      return trainers;
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch trainers: ${error.message}`,
      );
    }
  }

  async findStudentsBySport(instructorFor: string): Promise<Trainer[]> {
    try {
      const offerIds = await this.offerModel
        .find({ sport: instructorFor })
        .select('_id')
        .exec();

      const offerIdsArray = offerIds.map((offer) => offer._id.toString());

      const studentUserIds = await this.subscriptionModel
        .find({ offerId: { $in: offerIdsArray } })
        .select('userId')
        .exec();

      const studentUserIdsArray = studentUserIds.map(
        (student) => student.userId,
      );

      const students = await this.userModel
        .find({ _id: { $in: studentUserIdsArray } })
        .exec();

      return students;
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch trainers: ${error.message}`,
      );
    }
  }

  async findBySport(instructorFor: string): Promise<Trainer[]> {
    try {
      const trainers = await this.trainerModel.find({ instructorFor }).exec();

      if (trainers.length === 0) {
        throw new NotFoundException(
          `No trainers found for sport: ${instructorFor}`,
        );
      }

      return trainers;
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch trainers: ${error.message}`,
      );
    }
  }

  async update(
    id: string,
    updateTrainerDto: UpdateTrainerDto,
  ): Promise<{ success: boolean; message: string; trainer?: Trainer }> {
    try {
      const updatedTrainer = await this.trainerModel
        .findByIdAndUpdate(id, updateTrainerDto, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!updatedTrainer) {
        return { success: false, message: `Trainer with ID ${id} not found` };
      }

      return {
        success: true,
        message: 'Trainer updated successfully',
        trainer: updatedTrainer,
      };
    } catch (error) {
      return { success: false, message: 'Failed to update trainer' };
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const deletedTrainer = await this.trainerModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedTrainer) {
        throw new NotFoundException(`Trainer with ID ${id} not found`);
      }
      return { message: 'Trainer deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to delete trainer');
    }
  }
}
