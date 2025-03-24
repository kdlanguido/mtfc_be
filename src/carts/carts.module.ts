import { Module } from '@nestjs/common';
import { CartService } from './carts.service';
import { CartController } from './carts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from 'schemas/cart.schema';
import { Product, ProductSchema } from 'schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Product.name, schema: ProductSchema },
    ])
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule { }
