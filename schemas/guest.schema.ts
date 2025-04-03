import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Guest extends Document {
    @Prop({ required: true, type: String })
    fullName: string;

    @Prop({ required: true, type: String })
    mobileNumber: string;

    @Prop({ required: true, type: Date })
    date: Date;
}

export const GuestSchema = SchemaFactory.createForClass(Guest);
