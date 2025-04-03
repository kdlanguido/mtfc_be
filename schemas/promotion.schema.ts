import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Promotion extends Document {
    @Prop({ required: true, type: String })
    title: string;

    @Prop({ required: true, type: String })
    description: string;

    @Prop({ required: true, type: String })
    target: string;

    @Prop({ required: true, type: String })
    promotionType: string;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
