import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema()
export class Session {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({ required: false })
    time: string;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    status: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
