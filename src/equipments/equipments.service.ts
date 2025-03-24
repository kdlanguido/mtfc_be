import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Equipment, EquipmentDocument } from './../../schemas/equipments.schema';

@Injectable()
export class EquipmentService {
  constructor(@InjectModel(Equipment.name) private equipmentModel: Model<EquipmentDocument>) { }

  async create(createEquipmentDto: CreateEquipmentDto): Promise<{ message: string; equipment: Equipment }> {
    try {
      const newEquipment = new this.equipmentModel(createEquipmentDto);
      const savedEquipment = await newEquipment.save();
      return { message: "Equipment created successfully", equipment: savedEquipment };
    } catch (error) {
      throw new BadRequestException("Failed to create equipment");
    }
  }

  async findAll(): Promise<Equipment[]> {
    try {
      return await this.equipmentModel.find().sort({ _id: -1 }).exec();
    } catch (error) {
      throw new BadRequestException('Failed to retrieve equipment list');
    }
  }

  async findOne(id: string): Promise<Equipment> {
    try {
      const equipment = await this.equipmentModel.findById(id).exec();
      if (!equipment) {
        throw new NotFoundException(`Equipment with ID ${id} not found`);
      }
      return equipment;
    } catch (error) {
      throw new BadRequestException('Error retrieving equipment');
    }
  }

  async update(id: string, updateEquipmentDto: UpdateEquipmentDto): Promise<{ success: boolean; message: string; equipment?: Equipment }> {
    try {
      const updatedEquipment = await this.equipmentModel.findByIdAndUpdate(id, updateEquipmentDto, {
        new: true,
        runValidators: true,
      }).exec();

      if (!updatedEquipment) {
        return { success: false, message: `Equipment with ID ${id} not found` };
      }

      return { success: true, message: "Equipment updated successfully", equipment: updatedEquipment };
    } catch (error) {
      return { success: false, message: "Error updating equipment" };
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const deletedEquipment = await this.equipmentModel.findByIdAndDelete(id).exec();
      if (!deletedEquipment) {
        throw new NotFoundException(`Equipment with ID ${id} not found`);
      }
      return { message: 'Equipment deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Error deleting equipment');
    }
  }
}
