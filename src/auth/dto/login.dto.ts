import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Represents the data transfer object for user login.
 */
export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

