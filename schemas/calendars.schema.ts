import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Schedule {
  @Prop() mon: string;
  @Prop() tue: string;
  @Prop() wed: string;
  @Prop() thu: string;
  @Prop() fri: string;
  @Prop() sat: string;
  @Prop() sun: string;
}

const ScheduleSchema = SchemaFactory.createForClass(Schedule);

@Schema()
export class Calendars extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: [ScheduleSchema], required: true })
  schedule: Schedule[];
}

export const CalendarsSchema = SchemaFactory.createForClass(Calendars);
