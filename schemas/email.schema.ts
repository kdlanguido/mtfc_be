import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true }) // Adds createdAt & updatedAt fields automatically
export class Email extends Document {
    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    code: number;

    @Prop({ required: true })
    status: string;
}

// Generate Mongoose Schema
export const EmailSchema = SchemaFactory.createForClass(Email);
