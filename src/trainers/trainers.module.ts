import { Module } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { TrainersController } from './trainers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Trainer, TrainerSchema } from 'schemas/trainer.schema';
import { Offer, OfferSchema } from 'schemas/offers.schema';
import { Subscription, SubscriptionSchema } from 'schemas/subscriptions.schema';
import { User, UserSchema } from 'schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Trainer.name, schema: TrainerSchema },
      { name: Offer.name, schema: OfferSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [TrainersController],
  providers: [TrainersService],
})
export class TrainersModule {}
