import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TrainerDocument = Trainer & Document;

@Schema({ timestamps: true })
export class Trainer {
    @Prop()
    profileUrl?: string;

    @Prop()
    fullName?: string;

    @Prop()
    gender?: string;

    @Prop({ unique: true })
    email?: string;

    @Prop()
    phone?: string;

    @Prop()
    shortIntro?: string;

    @Prop()
    instructorSchedule?: string;

    @Prop()
    hourlyRate?: number;

    @Prop()
    specialization?: string;

    @Prop()
    instructorFor?: string;
}

export const TrainerSchema = SchemaFactory.createForClass(Trainer);
