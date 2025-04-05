import { Module } from '@nestjs/common';
import { CalendarsService } from './calendars.service';
import { CalendarsController } from './calendars.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Calendars, CalendarsSchema } from 'schemas/calendars.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Calendars.name, schema: CalendarsSchema },
    ]),
  ],
  controllers: [CalendarsController],
  providers: [CalendarsService],
})
export class CalendarsModule {}
