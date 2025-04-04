import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice } from 'schemas/invoices.schema';
import { Model } from 'mongoose';
import { User } from 'schemas/user.schema';
import { Types } from 'mongoose';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // Create new invoice
  async create(createInvoiceDto: CreateInvoiceDto) {
    try {
      const newInvoice = new this.invoiceModel(createInvoiceDto);
      newInvoice.invoiceDate = new Date();
      await newInvoice.save();
      return {
        message: 'Invoice created successfully',
        status: 201, // HTTP Status Code for Created
      };
    } catch (error) {
      return {
        message: 'Error creating invoice',
        status: 500, // Internal Server Error
      };
    }
  }
  async findAll() {
    try {
      // Fetch all invoices, sorted by _id in descending order
      const invoices = await this.invoiceModel.find().sort({ _id: -1 }).exec();

      // Fetch the full name for each invoice's userId, defaulting to "WALKIN-GUEST" if no user is found
      const result = await Promise.all(
        invoices.map(async (invoice) => {
          // Check if the userId is a valid ObjectId
          const userId = invoice.userId;
          let userFullName = 'WALKIN-GUEST'; // Default if no valid user is found

          if (Types.ObjectId.isValid(userId)) {
            // If userId is valid, find the user by their ID
            const user = await this.userModel.findById(userId).exec();
            if (user) {
              userFullName = user.fullName;
            }
          }

          // Return the invoice along with the userFullName
          return {
            ...invoice.toObject(),
            userFullName,
          };
        }),
      );

      // Return the final result with a success message
      return {
        message: 'Invoices fetched successfully',
        status: 200, // HTTP Status Code for OK
        data: result,
      };
    } catch (error) {
      // In case of an error, return an error message with status 500
      return {
        message: 'Error fetching invoices',
        status: 500, // Internal Server Error
      };
    }
  }

  // Find invoice by ID
  async findOne(id: string) {
    try {
      const invoice = await this.invoiceModel.findById(id).exec();
      if (!invoice) {
        return {
          message: 'Invoice not found',
          status: 404, // Not Found
        };
      }
      return {
        message: 'Invoice fetched successfully',
        status: 200, // OK
        data: invoice,
      };
    } catch (error) {
      return {
        message: 'Error fetching invoice',
        status: 500, // Internal Server Error
      };
    }
  }

  // Find invoices by User ID
  async findByUserId(userId: string) {
    try {
      const invoices = await this.invoiceModel
        .find({ userId })
        .sort({ _id: -1 })
        .exec();
      if (!invoices.length) {
        return {
          message: 'No invoices found for this user',
          status: 404, // Not Found
        };
      }
      return {
        message: 'Invoices fetched successfully',
        status: 200, // OK
        data: invoices,
      };
    } catch (error) {
      return {
        message: 'Error fetching invoices',
        status: 500, // Internal Server Error
      };
    }
  }

  // Update invoice by ID
  async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    try {
      const updatedInvoice = await this.invoiceModel
        .findByIdAndUpdate(id, updateInvoiceDto, { new: true })
        .exec();
      if (!updatedInvoice) {
        return {
          message: 'Invoice not found',
          status: 404, // Not Found
        };
      }
      return {
        message: 'Invoice updated successfully',
        status: 200, // OK
        data: updatedInvoice,
      };
    } catch (error) {
      return {
        message: 'Error updating invoice',
        status: 500, // Internal Server Error
      };
    }
  }

  // Remove invoice by ID
  async remove(id: string) {
    try {
      const deletedInvoice = await this.invoiceModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedInvoice) {
        return {
          message: 'Invoice not found',
          status: 404, // Not Found
        };
      }
      return {
        message: 'Invoice deleted successfully',
        status: 200, // OK
      };
    } catch (error) {
      return {
        message: 'Error deleting invoice',
        status: 500, // Internal Server Error
      };
    }
  }
}
