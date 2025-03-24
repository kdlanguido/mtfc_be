import { IsNotEmpty, IsString } from 'class-validator';

export class AddToCartDto {

    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    productId: string;
}
