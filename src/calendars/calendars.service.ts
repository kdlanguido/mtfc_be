import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Calendars } from './../../schemas/calendars.schema';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';

@Injectable()
export class CalendarsService {
  constructor(
    @InjectModel(Calendars.name)
    private readonly calendarModel: Model<Calendars>,
  ) {}

  async create(createCalendarDto: CreateCalendarDto): Promise<Calendars> {
    const newCalendar = new this.calendarModel(createCalendarDto);
    return newCalendar.save();
  }

  async findAll(): Promise<Calendars[]> {
    return this.calendarModel.find().exec();
  }

  async findByUserId(userId: string): Promise<Calendars[]> {
    const calendar = await this.calendarModel.find({ userId }).exec();
    if (!calendar) {
      throw new NotFoundException(`Calendar with id ${userId} not found`);
    }
    return calendar;
  }

  async findOne(id: string): Promise<Calendars> {
    const calendar = await this.calendarModel.findById(id).exec();
    if (!calendar) {
      throw new NotFoundException(`Calendar with id ${id} not found`);
    }
    return calendar;
  }

  async update(
    id: string,
    updateCalendarDto: UpdateCalendarDto,
  ): Promise<Calendars> {
    const updated = await this.calendarModel
      .findByIdAndUpdate(id, updateCalendarDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Calendar with id ${id} not found`);
    }

    return updated;
  }

  async updateByUserId(
    userId: string,
    updateCalendarDto: UpdateCalendarDto,
  ): Promise<{ statusCode: number; message: string; data: Calendars }> {
    try {
      // Perform the update operation
      const updated = await this.calendarModel
        .findOneAndUpdate({ userId }, updateCalendarDto, { new: true })
        .exec();

      // If no document is found and updated, throw an error
      if (!updated) {
        throw new HttpException(
          'Calendar not found for this user.',
          HttpStatus.NOT_FOUND,
        );
      }

      // Return the updated document along with status code and message
      return {
        statusCode: HttpStatus.OK, // 200 OK
        message: 'Calendar updated successfully',
        data: updated,
      };
    } catch (error) {
      // Handle unexpected errors
      throw new HttpException(
        error.message || 'Failed to update the calendar',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<Calendars> {
    const deleted = await this.calendarModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Calendar with id ${id} not found`);
    }
    return deleted;
  }
}
