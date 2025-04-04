import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from 'schemas/order.schema';
import { Model } from 'mongoose';
import { Cart } from 'schemas/cart.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      const { userId, cartId } = createOrderDto;
      const orderStatus = 'pending';
      const orderDate = new Date();

      const cart = await this.cartModel.findById(cartId);
      if (!cart) {
        throw new BadRequestException('Cart not found.');
      }

      const orderItems = Array.isArray(cart.cartItems) ? cart.cartItems : [];

      const newOrder = new this.orderModel({
        userId,
        orderStatus,
        orderDate,
        orderItems,
      });

      await newOrder.save();

      await this.cartModel.findByIdAndDelete(cartId);

      return { message: 'Order created successfully' };
    } catch (error) {
      console.error('Error creating order:', error);
      throw new BadRequestException(error.message || 'Failed to create order.');
    }
  }

  async acceptOrder(orderId: string) {
    try {
      const order = await this.orderModel.findById(orderId);

      if (!order) {
        throw new HttpException('Order not found!', HttpStatus.NOT_FOUND);
      }

      order.orderStatus = 'accepted';
      await order.save();

      return { message: 'Order accepted successfully' };
    } catch (error) {
      console.error('Error accepting order:', error);
      throw new HttpException(
        'Failed to accept order. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async completeOrder(orderId: string) {
    try {
      const order = await this.orderModel.findById(orderId);

      if (!order) {
        throw new HttpException('Order not found!', HttpStatus.NOT_FOUND);
      }

      order.orderStatus = 'completed';
      await order.save();

      return { message: 'Order completed successfully' };
    } catch (error) {
      console.error('Error accepting order:', error);
      throw new HttpException(
        'Failed to accept order. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateOrder(orderId: string, status: string) {
    try {
      const order = await this.orderModel.findById(orderId);

      if (!order) {
        throw new HttpException('Order not found!', HttpStatus.NOT_FOUND);
      }

      order.orderStatus = status;
      await order.save();

      return { message: 'Order updated successfully' };
    } catch (error) {
      console.error('Error updating order:', error);
      throw new HttpException(
        'Failed to accept order. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    return await this.orderModel.find().sort({ _id: -1 }).exec();
  }

  async findOne(orderId: string) {
    try {
      const Order = await this.orderModel.findById(orderId).exec();

      if (!Order) {
        throw new NotFoundException('Order not found');
      }

      return Order;
    } catch (error) {
      throw new BadRequestException('Error during product retrieval');
    }
  }

  async findByUserId(userId: string) {
    try {
      const order = await this.orderModel
        .find({ userId })
        .sort({ _id: -1 })
        .exec();
      console.log(order);
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      return order;
    } catch (error) {
      throw new BadRequestException('Error during product retrieval');
    }
  }

  async remove(orderId: string) {
    try {
      const order = await this.orderModel.findByIdAndDelete(orderId).exec();

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      return { message: 'Order deleted successfully', order };
    } catch (error) {
      console.error('Error deleting order:', error);
      throw new BadRequestException('Error deleting order');
    }
  }
}
