import { IsString, IsNumber, IsArray } from 'class-validator';

export class CreateOfferDto {
    @IsString()
    name: string;

    @IsArray()
    @IsString({ each: true })
    inclusions: string[];

    @IsNumber()
    price: number;

    @IsString()
    sport: string;
}
