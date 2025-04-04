import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Post extends Document {
  @Prop({ required: true, type: String })
  content: string;

  @Prop({ required: true, type: [String] })
  attachments: string[];

  @Prop({ required: true, type: String })
  userId: string;

  @Prop({ required: true, type: String })
  userProfile: string;

  @Prop({ required: true, type: [String] })
  userReacted: string[];

  @Prop({ required: true, type: [String] })
  comments: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
