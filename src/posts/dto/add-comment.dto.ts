import { IsString, IsNotEmpty } from 'class-validator'; // You can install this by running `npm install class-validator`

export class AddCommentDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
