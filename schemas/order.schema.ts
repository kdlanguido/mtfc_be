import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class OrderItem {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    qty: number;

    @Prop()
    imgUrl?: string;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema()
export class Order {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    orderStatus: string;

    @Prop({ required: true })
    orderDate: Date;

    @Prop({ type: [OrderItemSchema], required: true })
    orderItems: OrderItem[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
