import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  // Create a new invoice
  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }

  // Get all invoices
  @Get()
  findAll() {
    return this.invoicesService.findAll();
  }

  @Get('/find-monthly-salesreport')
  findMonthlySalesTotals() {
    return this.invoicesService.findMonthlySalesTotals(); // id is a string, no need to convert
  }

  // Get a single invoice by its ID
  @Get('/find-by-userid/:id')
  findByUserId(@Param('id') id: string) {
    return this.invoicesService.findByUserId(id); // id is a string, no need to convert
  }

  // Get a single invoice by its ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id); // id is a string, no need to convert
  }

  // Update an invoice by its ID
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoicesService.update(id, updateInvoiceDto); // id is a string
  }

  // Delete an invoice by its ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoicesService.remove(id); // id is a string
  }
}
