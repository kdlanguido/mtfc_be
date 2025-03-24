import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateCartDto {

    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    cartStatus: string;

    @IsNotEmpty()
    @IsArray()
    cartItems: [];
}
