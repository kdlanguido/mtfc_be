import { IsString, IsDate, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateGuestDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsNotEmpty()
    mobileNumber: string;

    @IsDate()
    @IsNotEmpty()
    date: Date;
}
