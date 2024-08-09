import { IsNotEmpty } from 'class-validator';

export class createUserDto {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  role: string;
}
