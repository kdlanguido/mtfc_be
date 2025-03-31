import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @Post()
  create(@Body() createEmailDto: CreateEmailDto) {
    return this.emailService.create(createEmailDto);
  }


  @Post('/create-code')
  createCode(@Body() body: { code: string; email: string }) {
    this.emailService.createCode(body.code, body.email);
    return {
      status: HttpStatus.OK,
      message: 'Code created successfully',
    };
  }



  @Get()
  findAll() {
    return this.emailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmailDto: UpdateEmailDto) {
    return this.emailService.update(+id, updateEmailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.emailService.remove(+id);
  }
}
