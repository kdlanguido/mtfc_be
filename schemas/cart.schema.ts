import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema()
export class CartItem {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    qty: number;

    @Prop()
    imgUrl?: string;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema()
export class Cart {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    cartStatus: string;

    @Prop({ type: [CartItemSchema], required: true })
    cartItems: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
