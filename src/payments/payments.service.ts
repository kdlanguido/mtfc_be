import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from 'schemas/payment.schema';
import { Model } from 'mongoose';



@Injectable()
export class PaymentsService {

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
  ) { }

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      const { paymentType, paymentCredentials } = createPaymentDto;
      if (paymentType === 'card') {
        if (!('cardNo' in paymentCredentials && 'expiryDate' in paymentCredentials && 'nameOnCard' in paymentCredentials)) {
          throw new HttpException('Invalid card payment details.', HttpStatus.BAD_REQUEST);
        }
      } else if (paymentType === 'gcash') {
        if (!('mobileNumber' in paymentCredentials)) {
          throw new HttpException('Invalid GCash payment details.', HttpStatus.BAD_REQUEST);
        }
      } else {
        throw new HttpException('Invalid payment type. Must be "card" or "gcash".', HttpStatus.BAD_REQUEST);
      }

      const newPayment = new this.paymentModel(createPaymentDto);
      const savedPayment = await newPayment.save();

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Payment added successfully',
        payment: savedPayment,
      };
    } catch (error) {
      console.error('Error creating payment:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to process payment. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


  async findAll() {
    return await this.paymentModel.find().sort({ _id: -1 }).exec();
  }

  async findUserPayment(userId: string) {
    try {
      const payments = await this.paymentModel.find({ userId }).exec();

      if (!payments || payments.length === 0) {
        return { success: false, message: `No payment records found for user ID: ${userId}` };
      }

      return { success: true, payments };
    } catch (error) {
      return { success: false, message: `Error retrieving payment records: ${error.message}` };
    }
  }

  async update(userId: string, updatePaymentDto: UpdatePaymentDto) {
    try {
      const { paymentType, paymentCredentials } = updatePaymentDto;

      if (paymentType === 'card') {
        if (!('cardNo' in paymentCredentials && 'expiryDate' in paymentCredentials && 'nameOnCard' in paymentCredentials)) {
          throw new BadRequestException('Invalid card payment details.');
        }
      } else if (paymentType === 'gcash') {
        if (!('mobileNumber' in paymentCredentials)) {
          throw new BadRequestException('Invalid GCash payment details.');
        }
      } else {
        throw new BadRequestException('Invalid payment type. Must be "card" or "gcash".');
      }

      const updatedPayment = await this.paymentModel.findOneAndUpdate({ userId, paymentType }, updatePaymentDto, {
        new: true,
        runValidators: true,
      });

      if (!updatedPayment) {
        throw new NotFoundException(`Payment with userID ${userId} not found.`);
      }

      return { message: 'Payment updated successfully', payment: updatedPayment };
    } catch (error) {
      console.error('Error updating payment:', error);
      throw new InternalServerErrorException('Failed to update payment. Please try again.');
    }
  }

  async remove(userId: string, paymentType: string) {
    try {
      const deletedPayment = await this.paymentModel.findOneAndDelete({ userId, paymentType });

      if (!deletedPayment) {
        throw new NotFoundException(`Payment with userFID ${userId} not found.`);
      }

      return { message: 'Payment removed successfully', deletedPayment };
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw new InternalServerErrorException('Failed to remove payment. Please try again.');
    }
  }
}
