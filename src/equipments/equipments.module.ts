import { Module } from '@nestjs/common';
import { EquipmentService } from './equipments.service';
import { EquipmentsController } from './equipments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Equipment, EquipmentSchema } from 'schemas/equipments.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Equipment.name, schema: EquipmentSchema },
    ])
  ],
  controllers: [EquipmentsController],
  providers: [EquipmentService],
})
export class EquipmentsModule { }
