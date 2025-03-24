import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OfferDocument = Offer & Document;

@Schema()
export class Offer {
    @Prop({ required: true })
    name: string;

    @Prop({ type: [String], required: true })
    inclusions: string[];

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    sport: string;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
