import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema()
export class Invoice {
  @Prop()
  referenceId: string;

  @Prop()
  userId: string;

  @Prop()
  amount: number;

  @Prop()
  transaction: string;

  @Prop()
  screenshotUrl: string;

  @Prop()
  invoiceDate: Date;

  @Prop()
  paymentType: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
