import { Module } from '@nestjs/common';
import { ContactusService } from './contactus.service';
import { ContactusController } from './contactus.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactUs, ContactUsSchema } from 'schemas/contactUs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ContactUs.name, schema: ContactUsSchema }])
  ],
  controllers: [ContactusController],
  providers: [ContactusService],
})
export class ContactusModule { }
