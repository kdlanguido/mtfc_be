import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { Trainer, TrainerDocument } from './../../schemas/trainer.schema';

@Injectable()
export class TrainersService {
  constructor(@InjectModel(Trainer.name) private readonly trainerModel: Model<TrainerDocument>) { }

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

  async findBySport(instructorFor: string): Promise<Trainer[]> {
    try {
      const trainers = await this.trainerModel.find({ instructorFor }).exec();

      if (trainers.length === 0) {
        throw new NotFoundException(`No trainers found for sport: ${instructorFor}`);
      }

      return trainers;
    } catch (error) {
      throw new BadRequestException(`Failed to fetch trainers: ${error.message}`);
    }
  }


  async update(id: string, updateTrainerDto: UpdateTrainerDto): Promise<{ success: boolean; message: string; trainer?: Trainer }> {
    try {
      const updatedTrainer = await this.trainerModel.findByIdAndUpdate(id, updateTrainerDto, {
        new: true,
        runValidators: true,
      }).exec();

      if (!updatedTrainer) {
        return { success: false, message: `Trainer with ID ${id} not found` };
      }

      return { success: true, message: "Trainer updated successfully", trainer: updatedTrainer };
    } catch (error) {
      return { success: false, message: "Failed to update trainer" };
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const deletedTrainer = await this.trainerModel.findByIdAndDelete(id).exec();
      if (!deletedTrainer) {
        throw new NotFoundException(`Trainer with ID ${id} not found`);
      }
      return { message: 'Trainer deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to delete trainer');
    }
  }
}
