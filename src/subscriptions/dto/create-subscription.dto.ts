import { IsString, IsDate, IsOptional, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubscriptionDto {

    @IsString()
    offerId: string;

    @IsString()
    userId: string;

    @IsString()
    status: string;

    @IsDate()
    @Type(() => Date)
    dateApplied: Date;
}
