import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Post("/add-to-cart")
  addToCart(@Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(addToCartDto);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':cartId')
  findOne(@Param('cartId') cartId: string) {
    return this.cartService.findOne(cartId);
  }

  @Get('/find-by-userId/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.cartService.findByUserId(userId);
  }
}
