import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactUsDocument = ContactUs & Document;

@Schema()
export class ContactUs {
    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phoneNumber: string;

    @Prop({ required: true })
    message: string;

    @Prop({ required: true })
    subject: string;
}

export const ContactUsSchema = SchemaFactory.createForClass(ContactUs);
