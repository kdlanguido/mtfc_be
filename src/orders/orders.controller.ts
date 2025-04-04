import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Post('/accept-order/:id')
  acceptOrder(@Param('id') id: string) {
    return this.orderService.acceptOrder(id);
  }

  @Post('/complete-order/:id')
  completeOrder(@Param('id') id: string) {
    return this.orderService.completeOrder(id);
  }

  @Post('/update-order')
  updateOrder(@Body() dto: { orderId: string; status: string }) {
    const { orderId, status } = dto;
    return this.orderService.updateOrder(orderId, status);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Get('/find-by-userid/:userId')
  findByUserid(@Param('userId') userId: string) {
    console.log(userId);
    return this.orderService.findByUserId(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
