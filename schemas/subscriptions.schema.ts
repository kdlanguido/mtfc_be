import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema()
export class Subscription {
    @Prop({ required: true })
    offerId: string;

    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    status: string;

    @Prop({ required: false })
    endDate: Date;

    @Prop({ required: false })
    startDate: Date;

    @Prop({ required: false })
    dateApplied: Date;

    @Prop({ required: false })
    qrCodeUrl: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
