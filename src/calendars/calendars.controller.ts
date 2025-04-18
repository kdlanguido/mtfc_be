import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CalendarsService } from './calendars.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';

@Controller('calendars')
export class CalendarsController {
  constructor(private readonly calendarsService: CalendarsService) {}

  @Post()
  create(@Body() createCalendarDto: CreateCalendarDto) {
    return this.calendarsService.create(createCalendarDto);
  }

  @Get()
  findAll() {
    return this.calendarsService.findAll();
  }

  @Get('/find-by-userid/:id')
  findByUserId(@Param('id') id: string) {
    return this.calendarsService.findByUserId(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calendarsService.findOne(id);
  }

  @Patch('/update-by-userid/:id')
  updateByUserId(
    @Param('id') id: string,
    @Body()
    updateCalendarDto: {
      userId: string;
      schedule: [
        {
          mon: string;
          tue: string;
          wed: string;
          thu: string;
          fri: string;
          sat: string;
          sun: string;
        },
      ];
    },
  ) {
    return this.calendarsService.updateByUserId(id, updateCalendarDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCalendarDto: UpdateCalendarDto,
  ) {
    return this.calendarsService.update(id, updateCalendarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calendarsService.remove(id);
  }
}
