import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';

@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Post()
  create(@Body() createTrainerDto: CreateTrainerDto) {
    try {
      return this.trainersService.create(createTrainerDto);
    } catch (error) {
      throw new BadRequestException('Failed to create trainer');
    }
  }

  @Get()
  findAll() {
    try {
      return this.trainersService.findAll();
    } catch (error) {
      throw new BadRequestException('Failed to fetch trainers');
    }
  }

  @Get('/find-by-sport/:instructorFor')
  findBySport(@Param('instructorFor') instructorFor: string) {
    try {
      const trainer = this.trainersService.findBySport(instructorFor);
      if (!trainer) {
        throw new NotFoundException(
          `Trainer with sport ${instructorFor} not found`,
        );
      }
      return trainer;
    } catch (error) {
      throw new BadRequestException('Failed to fetch trainer');
    }
  }

  @Get('/find-students-by-sport/:instructorFor')
  findStudentsBySport(@Param('instructorFor') instructorFor: string) {
    try {
      const trainer = this.trainersService.findStudentsBySport(instructorFor);
      if (!trainer) {
        throw new NotFoundException(
          `Trainer with sport ${instructorFor} not found`,
        );
      }
      return trainer;
    } catch (error) {
      throw new BadRequestException('Failed to fetch trainer');
    }
  }

  @Get('/find-by-email/:email')
  findByEmail(@Param('email') email: string) {
    try {
      const trainer = this.trainersService.findByEmail(email);
      if (!trainer) {
        throw new NotFoundException(`Trainer with sport ${email} not found`);
      }
      return trainer;
    } catch (error) {
      throw new BadRequestException('Failed to fetch trainer');
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      const trainer = this.trainersService.findOne(id);
      if (!trainer) {
        throw new NotFoundException(`Trainer with ID ${id} not found`);
      }
      return trainer;
    } catch (error) {
      throw new BadRequestException('Failed to fetch trainer');
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrainerDto: UpdateTrainerDto) {
    try {
      const updatedTrainer = this.trainersService.update(id, updateTrainerDto);
      if (!updatedTrainer) {
        throw new NotFoundException(`Trainer with ID ${id} not found`);
      }
      return {
        message: 'Trainer updated successfully',
        trainer: updatedTrainer,
      };
    } catch (error) {
      throw new BadRequestException('Failed to update trainer');
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      const deletedTrainer = this.trainersService.remove(id);
      if (!deletedTrainer) {
        throw new NotFoundException(`Trainer with ID ${id} not found`);
      }
      return { message: 'Trainer deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to delete trainer');
    }
  }
}
