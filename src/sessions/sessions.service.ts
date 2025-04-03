import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from 'schemas/session.schema';
import { Model } from 'mongoose';

@Injectable()
export class SessionsService {

  constructor(
    @InjectModel(Session.name) private sessionModel: Model<Session>,
  ) { }

  async create(createSessionDto: CreateSessionDto) {
    try {
      const newSession = new this.sessionModel(createSessionDto);
      const savedSession = await newSession.save();
      return { message: 'session created successfully', session: savedSession };
    } catch (error) {
      throw new BadRequestException('Failed to create session');
    }
  }

  async timeIn(createSessionDto: CreateSessionDto) {
    try {
      const currentTime = new Date();
      const newSession = new this.sessionModel({
        ...createSessionDto,
        time: currentTime.toISOString(),
        date: currentTime.toISOString(),
        status: "IN",
      });

      const savedSession = await newSession.save();
      return { message: "Session created successfully", session: savedSession };
    } catch (error) {
      throw new BadRequestException("Failed to create session");
    }
  }

  async timeOut(createSessionDto: CreateSessionDto) {
    try {
      const currentTime = new Date();

      const manilaTime = new Date(
        currentTime.toLocaleString("en-US", { timeZone: "Asia/Manila" })
      );

      const newSession = new this.sessionModel({
        ...createSessionDto,
        time: manilaTime.toISOString(),
        date: manilaTime.toISOString(),
        status: "OUT",
      });


      const savedSession = await newSession.save();
      return { message: "Session created successfully", session: savedSession };
    } catch (error) {
      throw new BadRequestException("Failed to create session");
    }
  }

  async findAll() {
    return await this.sessionModel.find().sort({ _id: -1 }).exec();
  }

  async findOne(id: string) {
    try {
      const session = await this.sessionModel.findById(id).exec();
      if (!session) {
        throw new NotFoundException(`Session with ID ${id} not found`);
      }
      return session;
    } catch (error) {
      throw new BadRequestException('Failed to retrieve session');
    }
  }

  async findAllAttendance(userId: string) {
    try {
      const sessions = await this.sessionModel.find({ userId }).exec();
      if (!sessions || sessions.length === 0) {
        throw new NotFoundException(`No sessions found for user with ID ${userId}`);
      }
      const monthsCount = this.getEntriesPerMonth(sessions);
      return { sessions, monthsCount };
    } catch (error) {
      throw new BadRequestException('Failed to retrieve sessions');
    }
  }

  getEntriesPerMonth(data: Session[]) {
    const monthsCount = Array(12).fill(0);
    data.forEach(entry => {
      const month = new Date(entry.date).getMonth();
      monthsCount[month]++;
    });
    return monthsCount;
  }

  async update(id: string, updateSessionDto: UpdateSessionDto) {
    try {
      const updatedSession = await this.sessionModel.findByIdAndUpdate(id, updateSessionDto, {
        new: true,
        runValidators: true,
      }).exec();

      if (!updatedSession) {
        throw new NotFoundException(`Session with ID ${id} not found`);
      }

      return { message: 'Session updated successfully', session: updatedSession };
    } catch (error) {
      throw new BadRequestException('Failed to update session');
    }
  }

  async remove(id: string) {
    try {
      const deletedSession = await this.sessionModel.findByIdAndDelete(id).exec();
      if (!deletedSession) {
        throw new NotFoundException(`Session with ID ${id} not found`);
      }
      return { message: 'Session deleted successfully', session: deletedSession };
    } catch (error) {
      throw new BadRequestException('Failed to delete session');
    }
  }

}
