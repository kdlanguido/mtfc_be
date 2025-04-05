import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String, required: false })
  email: string;

  @Prop({ type: String, required: false })
  password: string;

  @Prop({ type: String, required: false })
  profileUrl: string;

  @Prop({ type: String, required: false })
  userType: string;

  @Prop({ type: String, required: false })
  fullName: string;

  @Prop({ type: String, required: false })
  gender: string;

  @Prop({ type: String, required: false })
  mobileNumber: string;

  @Prop({ type: String, required: false })
  fitnessGoal: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
