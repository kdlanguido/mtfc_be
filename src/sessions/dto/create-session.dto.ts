import { IsNotEmpty, IsString, IsDateString, IsEnum } from "class-validator";

export class CreateSessionDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    fullName: string;

    @IsNotEmpty()
    @IsString()
    time: string;

    @IsNotEmpty()
    @IsDateString()
    date: Date;

    @IsNotEmpty()
    @IsEnum(["IN", "OUT"])
    status: "IN" | "OUT";
}
