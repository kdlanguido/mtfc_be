import { IsString, IsNumber, IsOptional, IsUrl, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsString()
    description: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    ratingScore?: number;

    @IsString()
    @IsUrl()
    imgUrl: string;
}
