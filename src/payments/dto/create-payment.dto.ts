import { IsString, IsEnum, IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class CardPaymentDto {
    @IsString()
    @IsNotEmpty()
    cardNo: string;

    @IsString()
    @IsNotEmpty()
    expiryDate: string;

    @IsOptional()
    @IsString()
    cvv?: string;

    @IsString()
    @IsNotEmpty()
    nameOnCard: string;
}

class GcashPaymentDto {
    @IsString()
    @IsNotEmpty()
    mobileNumber: string;
}

export class CreatePaymentDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsEnum(['card', 'gcash'])
    @IsNotEmpty()
    paymentType: 'card' | 'gcash';

    @ValidateNested()
    @Type(() => Object)
    paymentCredentials: CardPaymentDto | GcashPaymentDto;
}
