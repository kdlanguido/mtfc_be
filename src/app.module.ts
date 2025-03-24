import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactusModule } from './contactus/contactus.module';
import { CartModule } from './carts/carts.module';
import { OrderModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { OffersModule } from './offers/offers.module';
import { PaymentsModule } from './payments/payments.module';
import { SessionsModule } from './sessions/sessions.module';
import { TrainersModule } from './trainers/trainers.module';
import { EquipmentsModule } from './equipments/equipments.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://atlasUser:orVZXgOJgJTvOAwk@cluster0.yeukxf1.mongodb.net/mtfc?retryWrites=true&w=majority&appName=Cluster0'),
    ProductsModule,
    ContactusModule,
    CartModule,
    OrderModule,
    UsersModule,
    SubscriptionsModule,
    OffersModule,
    PaymentsModule,
    SessionsModule,
    TrainersModule,
    EquipmentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
