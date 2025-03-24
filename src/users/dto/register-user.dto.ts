import { IsString, IsOptional, IsEmail } from 'class-validator';

export class RegisterUserDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    profileUrl?: string;

    @IsString()
    @IsOptional()
    userType?: string;

    @IsString()
    @IsOptional()
    fullName?: string;

    @IsString()
    @IsOptional()
    gender?: string;

    @IsString()
    @IsOptional()
    fitnessGoal?: string;
}
