import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EquipmentDocument = Equipment & Document;

@Schema()
export class VendorDetails {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    contactNumber: string;

    @Prop({ required: true })
    address: string;
}

@Schema()
export class Equipment {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: false })
    datePurchased?: Date;

    @Prop({ required: false })
    qty?: number;

    @Prop({ type: VendorDetails, required: true })
    vendorDetails: VendorDetails;
}

export const VendorDetailsSchema = SchemaFactory.createForClass(VendorDetails);
export const EquipmentSchema = SchemaFactory.createForClass(Equipment);
