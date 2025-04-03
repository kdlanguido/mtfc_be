import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Guest } from 'schemas/guest.schema';

@Injectable()
export class GuestsService {
  constructor(@InjectModel(Guest.name) private guestModel: Model<Guest>) { }

  async create(createGuestDto: CreateGuestDto) {
    createGuestDto.date = new Date();
    const createdGuest = new this.guestModel(createGuestDto);
    await createdGuest.save();
    return { message: 'Guest successfully created', data: createdGuest, status: 200 };
  }


  async findAll() {
    const guests = await this.guestModel.find().exec();
    return { message: 'Guests retrieved successfully', status: 200, data: guests };
  }

  async findOne(id: string) {
    const guest = await this.guestModel.findById(id).exec();
    if (!guest) {
      throw new NotFoundException('Guest not found');
    }
    return { message: 'Guest found successfully', status: 200, data: guest };
  }

  async update(id: string, updateGuestDto: UpdateGuestDto) {
    const updatedGuest = await this.guestModel.findByIdAndUpdate(id, updateGuestDto, { new: true }).exec();
    if (!updatedGuest) {
      throw new NotFoundException('Guest not found');
    }
    return { message: 'Guest updated successfully', status: 200, data: updatedGuest };
  }

  async remove(id: string) {
    const removedGuest = await this.guestModel.findByIdAndDelete(id).exec();
    if (!removedGuest) {
      throw new NotFoundException('Guest not found');
    }
    return { message: 'Guest removed successfully', status: 200, data: removedGuest };
  }
}
