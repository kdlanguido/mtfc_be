import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from 'schemas/cart.schema';
import { Model } from 'mongoose';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Product } from 'schemas/product.schema';


@Injectable()
export class CartService {

  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>
  ) { }

  async create(createCartDto: CreateCartDto) {
    const newProduct = new this.cartModel(createCartDto);
    return await newProduct.save();
  }

  async addToCart(addToCartDto: AddToCartDto) {

    const { userId, productId } = addToCartDto;

    let cart = await this.cartModel.findOne({ userId, cartStatus: "pending" });

    if (!cart) {
      cart = await this.create({ userId, cartStatus: 'pending', cartItems: [] });
    }

    if (!cart.cartItems) {
      cart.cartItems = [];
    }

    const product = await this.productModel.findOne({ _id: productId });

    if (!product) {
      throw new Error('Product not found');
    }

    let productInCart = cart.cartItems.find(item => item.name.toString() === product.name);

    if (productInCart) {
      productInCart.qty += 1;
    } else {
      cart.cartItems.push({
        name: product.name,
        price: product.price,
        imgUrl: product.imgUrl,
        qty: 1
      });
    }

    return await cart.save();
  }

  async findAll() {
    return await this.cartModel.find().exec();
  }

  async findOne(cartId: string) {
    try {
      const product = await this.cartModel.findById(cartId).exec();

      if (!product) {
        return { success: false, message: 'Product not found' };
      }

      return { success: true, data: product };
    } catch (error) {
      console.error('Error during product retrieval:', error);
      return { success: false, message: 'Error during product retrieval' };
    }
  }

  async findByUserId(userId: string) {
    try {
      const product = await this.cartModel.findOne({ userId }).exec();

      if (!product) {
        return { success: false, message: 'Product not found' };
      }

      return { success: true, data: product };
    } catch (error) {
      console.error('Error during product retrieval:', error);
      return { success: false, message: 'Error during product retrieval' };
    }
  }



}
