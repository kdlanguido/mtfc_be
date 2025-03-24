import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ _id: false })
export class CardPayment {
    @Prop({ required: true })
    cardNo: string;

    @Prop({ required: true })
    expiryDate: Date;

    @Prop()
    cvv?: number;

    @Prop({ required: true })
    nameOnCard: string;
}

@Schema({ _id: false })
export class GcashPayment {
    @Prop({ required: true })
    mobileNumber: string;
}

@Schema()
export class Payment {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true, enum: ['card', 'gcash'] })
    paymentType: string;

    @Prop({ type: Object, required: true })
    paymentCredentials: CardPayment | GcashPayment;
}

export const CardPaymentSchema = SchemaFactory.createForClass(CardPayment);
export const GcashPaymentSchema = SchemaFactory.createForClass(GcashPayment);
export const PaymentSchema = SchemaFactory.createForClass(Payment);
