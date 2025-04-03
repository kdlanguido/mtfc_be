import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePromotionDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    target: string;

    @IsString()
    @IsNotEmpty()
    promotionType: string;
}
